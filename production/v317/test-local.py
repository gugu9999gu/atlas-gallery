"""Run with Python Playwright and a system Chromium executable.
CHROMIUM=/usr/bin/chromium python production/v317/test-local.py
Creates local-layouts.json and review.png. No network access is required.
"""
from pathlib import Path
import json, hashlib, os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).parent
SOURCE=(ROOT/'atlas-v317.js').read_text()
summary={'layouts':[],'exports':[],'errors':[]}
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),args=['--no-sandbox'])
 page=browser.new_page()
 page.on('pageerror',lambda error:summary['errors'].append(str(error)))
 page.set_content('<html><body></body></html>')
 page.add_script_tag(content=SOURCE)
 items=page.evaluate('AtlasAILab.ITEMS')
 for lang in ['ko','en']:
  for width in [320,390,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for item in items:
    result=page.evaluate('''({key,lang,width})=>{
     document.body.style.cssText='margin:0;padding:12px;background:#e7edf4';
     document.body.innerHTML='<div id="host" style="width:100%;max-width:344px;height:250px"></div>';
     const host=document.getElementById('host');host.innerHTML=AtlasAILab.markup(key,lang);
     const root=host.firstElementChild,study=AtlasAILab.mount(root),before=JSON.stringify(study.snapshot());
     root.querySelector('[data-ai=step]').click();const changed=before!==JSON.stringify(study.snapshot());
     root.querySelector('[data-ai=alt]').click();
     const input=root.querySelector('input');let rangeOK=true;if(input){input.value=input.max;input.dispatchEvent(new Event('input',{bubbles:true}));rangeOK=study.snapshot().param===+input.max;}
     root.querySelector('[data-ai=reset]').click();const reset=JSON.stringify(study.snapshot())===before;
     const nodes=[...root.querySelectorAll('*')].filter(e=>e.getClientRects().length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));
     const minimum=Math.min(...nodes.map(e=>parseFloat(getComputedStyle(e).fontSize)));
     const overflow=root.scrollWidth>root.clientWidth+1||document.documentElement.scrollWidth>innerWidth+1;
     const controls=root.querySelector('.ai-controls'),r=controls.getBoundingClientRect();
     const clipped=[...controls.querySelectorAll('button')].some(e=>{const b=e.getBoundingClientRect();return b.left<r.left-1||b.right>r.right+1||b.top<r.top-1||b.bottom>r.bottom+1});
     return {key,lang,width,changed,rangeOK,reset,minimum,overflow,clipped,pass:changed&&rangeOK&&reset&&minimum>=14&&!overflow&&!clipped};
    }''',{'key':item[1],'lang':lang,'width':width})
    summary['layouts'].append(result)
 for lang in ['ko','en']:
  for item in items:
   html=page.evaluate('({id,lang})=>AtlasAILab.code({id},lang)',{'id':item[0],'lang':lang})
   export_page=browser.new_page(viewport={'width':390,'height':844})
   export_page.on('pageerror',lambda error:summary['errors'].append(str(error)))
   export_page.set_content(html)
   result=export_page.evaluate('''()=>{const root=document.querySelector('.ai-stage'),s=root.__aiStudy,b=JSON.stringify(s.snapshot());root.querySelector('[data-ai=step]').click();const changed=b!==JSON.stringify(s.snapshot());root.querySelector('[data-ai=reset]').click();return {key:root.dataset.aiKey,changed,reset:b===JSON.stringify(s.snapshot()),pass:changed&&b===JSON.stringify(s.snapshot())};}''')
   result['lang']=lang;summary['exports'].append(result)
   export_page.close()
 page.set_viewport_size({'width':1440,'height':1000})
 page.set_content('<html><head><style>body{background:#e9edf4;margin:20px;font:16px system-ui}h1{font-size:26px}#review{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}article{min-width:0;background:white;border:1px solid #c8d3df;border-radius:12px;overflow:hidden}h2{font-size:16px;height:38px;margin:10px 12px}.host{height:250px}</style></head><body><h1>ATLAS v3.17 · AI & simulation · 24 studies</h1><div id="review"></div></body></html>')
 page.add_script_tag(content=SOURCE)
 page.evaluate('''()=>{document.getElementById('review').innerHTML=AtlasAILab.ITEMS.map(i=>'<article><h2>'+i[3]+' · '+i[2]+'</h2><div class="host">'+AtlasAILab.markup(i[1],'ko')+'</div></article>').join('');for(const root of document.querySelectorAll('.ai-stage')){AtlasAILab.mount(root);root.querySelector('[data-ai=step]').click();}}''')
 page.screenshot(path=str(ROOT/'review.png'),full_page=True)
 browser.close()
summary['sha256']=hashlib.sha256(SOURCE.encode()).hexdigest()
summary['pass']=all(r['pass'] for r in summary['layouts']+summary['exports']) and not summary['errors']
(ROOT/'local-layouts.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
print(json.dumps({'pass':summary['pass'],'layouts':len(summary['layouts']),'exports':len(summary['exports']),'errors':summary['errors']}))
if not summary['pass']:
 raise SystemExit(1)
