"""Repeatable preview visual QA: 162 DOM studies at real sizes plus 26 compact motion studies."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os

ROOT=Path(__file__).resolve().parents[1]
JS='\n'.join((ROOT/'src/interactive'/f).read_text(encoding='utf-8') for f in ('foundations.js','patterns.js','studies.js','advanced.js','mograph.js','kit.js'))
CSS='\n'.join((ROOT/'src/interactive'/f).read_text(encoding='utf-8') for f in ('style.css','patterns.css','foundations.css','mograph.css','layout.css'))
recipes=[]
for line in (ROOT/'data/interaction-recipes.tsv').read_text(encoding='utf-8').splitlines():
    if not line.strip() or line.startswith('#'):continue
    key,en,ko,engine,category,*_=line.split('|')
    if engine=='dom':recipes.append({'key':key,'en':en})
ui='ui-toast ui-snackbar ui-tooltip ui-popover ui-modal ui-sheet ui-drawer ui-banner ui-inline ui-accordion ui-tabs ui-segmented ui-switch ui-checkbox ui-radio ui-slider ui-steps ui-quantity ui-progress ui-skeleton ui-carousel ui-loading ui-search ui-fab ui-dropdown ui-button ui-card'.split()
recipes.extend({'key':key,'en':key} for key in ui)
recipes=list({r['key']:r for r in recipes}.values())
assert len(recipes)>=150,'Existing interaction preview library is unexpectedly small'
motion=[r for r in recipes if r['key'].startswith('mg-')]
assert len(motion)==26
failures=[];counts=[]

def document(items,w,h):
    data=json.dumps(items,ensure_ascii=False).replace('<','\\u003c')
    return f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
    *{{box-sizing:border-box}}html,body{{margin:0;font:16px system-ui;background:#e6edf5}}
    .audit-grid{{display:grid;grid-template-columns:repeat(4,{w}px);gap:8px;padding:8px}}
    .audit-tile{{width:{w}px;min-width:0;border:1px solid #bbc8d9;overflow:hidden}}
    .audit-title{{height:25px;line-height:25px;font-size:14px;white-space:nowrap;overflow:hidden}}
    .ix-demo{{width:100%;height:{h}px!important;min-height:{h}px!important;border-radius:0}}
    {CSS}</style></head><body><main class="audit-grid"></main><script>{JS}</script>
    <script>const rows={data};
    document.querySelector('main').innerHTML=rows.map(r=>'<section class="audit-tile"><div class="audit-title">'+r.en+'</div><div class="ix-demo" data-key="'+r.key+'"></div></section>').join('');
    Promise.all([...document.querySelectorAll('.ix-demo')].map(el=>AtlasKit.mount(el,{{key:el.dataset.key,engine:'dom'}},'ko',{{paused:()=>false}}))).then(()=>{{window.__auditReady=true}});
    </script></body></html>'''

MEASURE='''()=>[...document.querySelectorAll('.ix-demo')].map(stage=>{
 const key=stage.dataset.key,b=stage.getBoundingClientRect(),root=stage.firstElementChild,errors=[];
 if(!root||root.clientHeight<stage.clientHeight-2)errors.push('missing-or-short-root');
 const selectors=['button','select','input:not([type=hidden])','output','.mg-controls','.mg-status'];
 const controls=[...new Set(selectors.flatMap(q=>[...stage.querySelectorAll(q)]))].filter(x=>{const cs=getComputedStyle(x);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)>.5&&x.getClientRects().length&&!x.closest('[aria-hidden="true"]');});
 for(const el of controls){const r=el.getBoundingClientRect();if(r.width<1||r.height<1)continue;const i=Math.max(0,Math.min(r.right,b.right)-Math.max(r.left,b.left))*Math.max(0,Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top));if(i<r.width*r.height*.8)errors.push('clipped:'+el.tagName+'.'+(typeof el.className==='string'?el.className:''));}
 if(key.startsWith('mg-')){const caption=root.querySelector('.mg-eyebrow'),visual=root.querySelector('.mg-visual');if(!caption||!visual||caption.getBoundingClientRect().bottom>visual.getBoundingClientRect().top+1)errors.push('caption-art-overlap');}
 return {key,errors};
})'''

with sync_playwright() as pw:
    executable=os.getenv('CHROMIUM_PATH')
    browser=pw.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--no-sandbox'])
    for width,height,subset in [(320,250,recipes),(360,250,recipes),(650,340,recipes),(248,182,motion)]:
        page=browser.new_page(viewport={'width':width*4+40,'height':950})
        page.on('pageerror',lambda e:failures.append(str(e)))
        page.set_content(document(subset,width,height),wait_until='domcontentloaded',timeout=60000)
        page.wait_for_function('window.__auditReady===true',timeout=20000)
        findings=[m for m in page.evaluate(MEASURE) if m['errors']]
        counts.append({'size':f'{width}x{height}','inspected':len(subset),'layout_errors':len(findings)})
        if findings:failures.append(f'{width}x{height}: '+json.dumps(findings[:6],ensure_ascii=False))
        if width==320:
            # Every motion study must have a working clock, pause/replay, and static reduced-motion frame.
            for recipe in motion:
                node=page.locator(f'.ix-demo[data-key="{recipe["key"]}"] .mg-stage')
                node.scroll_into_view_if_needed()
                page.wait_for_function('key=>document.querySelector(\'.ix-demo[data-key="\'+key+\'"] .mg-stage\')?.classList.contains("mg-playing")',arg=recipe['key'],timeout=7000)
                first=node.locator('.mg-anim').first
                before=first.evaluate('(el)=>({state:getComputedStyle(el).animationPlayState,time:el.getAnimations()[0]?.currentTime})')
                page.wait_for_timeout(90)
                after=first.evaluate('(el)=>({state:getComputedStyle(el).animationPlayState,time:el.getAnimations()[0]?.currentTime})')
                if before['state']!='running' or after['time'] is None or after['time']<=before['time']:
                    failures.append('Motion timeline did not advance: '+recipe['key'])
                node.locator('.mg-pause').click()
                if first.evaluate('(el)=>getComputedStyle(el).animationPlayState')!='paused':failures.append('Pause failed: '+recipe['key'])
                node.locator('.mg-replay').click()
                if node.locator('.mg-pause').get_attribute('aria-pressed')!='false':failures.append('Replay failed: '+recipe['key'])
            page.emulate_media(reduced_motion='reduce')
            page.wait_for_timeout(60)
            states=page.evaluate("[...document.querySelectorAll('.mg-stage')].map(e=>({key:e.dataset.kind,still:e.classList.contains('mg-still'),animation:getComputedStyle(e.querySelector('.mg-anim')).animationName}))")
            if any(not x['still'] or x['animation']!='none' for x in states):
                failures.append('Reduced motion not respected: '+str([x for x in states if not x['still'] or x['animation']!='none'][:5]))
        page.close()
    browser.close()

report={'scope':'real-size DOM preview layout and 26 motion studies','sizes':counts,'motion_studies':len(motion),'failures':failures}
(ROOT/'qa/live-preview-layout-v325.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
if failures:raise SystemExit('Live preview layout/motion audit failed')
