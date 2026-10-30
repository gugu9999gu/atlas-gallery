"""ATLAS v3.2.8: 20 real UX research studies + linear progress clipping regression.
Uses built files, local Chromium and synthetic examples; no third-party requests.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import json,os

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'
db=json.loads((ROOT/'qa/expanded-data-v32.json').read_text(encoding='utf-8'))
progress=json.loads((ROOT/'qa/preview-progress.json').read_text(encoding='utf-8'))
rows=[line.split('|') for line in (ROOT/'data/research-studies.tsv').read_text(encoding='utf-8').splitlines() if line and not line.startswith('#')]
canonical={e['id']:e for e in db['entries'] if not e.get('canonical_id')}
assert len(rows)==20 and len({x[0] for x in rows})==20
assert db['metadata']['research_studies']['version']=='3.2.8'
assert progress['current']==dict(progress['current'],specific=1224,pending=965),progress['current']
for id,key,name in rows:
    e=canonical[id]
    assert e['en']==name and e['demo']['key']==key and e['implementation_status']=='implemented'
    assert (OUT/'reference'/id/'index.html').exists()
    assert (OUT/'en/reference'/id/'index.html').exists()
assert 'AtlasResearch' in (OUT/'assets/interaction-kit.js').read_text(encoding='utf-8')
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(OUT)))
Thread(target=server.serve_forever,daemon=True).start()
origin='http://127.0.0.1:'+str(server.server_port)
failures=[];tested=0
try:
    with sync_playwright() as playwright:
        binary=os.getenv('CHROMIUM_PATH')
        browser=playwright.chromium.launch(**({'executable_path':binary} if binary else {}),headless=True,args=['--no-sandbox'])
        for lang in ('ko','en'):
            page=browser.new_page(viewport={'width':650,'height':720})
            page.on('pageerror',lambda e:failures.append('Page JS error '+str(e)))
            for id,key,en in rows:
                page.goto(origin+('/en' if lang=='en' else '')+'/reference/'+id+'/',wait_until='domcontentloaded')
                study=page.locator('.rs-stage')
                study.wait_for(timeout=12000)
                assert study.get_attribute('data-kind')==key
                before=study.locator('.rs-status').inner_text()
                ctrl=study.locator('[data-rs-range]')
                if ctrl.count():
                    ctrl.fill('75')
                else:
                    action=study.locator('[data-rs="next"]').first if key=='rs-hick' else study.locator('[data-rs]').first
                    if action.count():action.click()
                    else:failures.append('No real control '+key)
                after=study.locator('.rs-status').inner_text()
                if before==after:failures.append('No interaction state feedback '+lang+'/'+en)
                if key=='rs-sort' and study.get_attribute('data-grouped')!='1':failures.append('Card sorting failed')
                if key=='rs-tree':
                    if not study.locator('[data-node="billing"]').count():failures.append('Tree traversal submenu absent')
                if key=='rs-ia' and not study.locator('.rs-subtree').is_visible():failures.append('Information hierarchy did not expand')
                if key=='rs-matrix' and not study.get_attribute('data-cell'):failures.append('State matrix selection missing')
                if key=='rs-regression' and study.get_attribute('data-compare')!='75':failures.append('Before-after clipping slider failed')
                if key=='rs-fitts' and study.get_attribute('data-target')!='small':failures.append('Target size interaction missing')
                if key=='rs-hick' and study.get_attribute('data-choices')!='4':failures.append('Hick choices did not expand')
                if key=='rs-content' and not study.locator('.rs-json').inner_text().startswith('{'):failures.append('Structured JSON preview missing')
                if key=='rs-heatmap':
                    study.locator('.rs-heatmap button').first.click()
                    if study.get_attribute('data-selected')!='1':failures.append('Heatmap cell inspect failed')
                if lang=='ko':
                    exported=page.evaluate('''async()=>{
                        const css=await(await fetch('/assets/interaction-style.css')).text();
                        const e=JSON.parse(document.getElementById('reference-recipe').textContent);
                        return AtlasKit.code(e,'ko',css);
                    }''')
                    if '<html' not in exported or 'AtlasResearch.mount' not in exported:
                        failures.append('Source not preserved in standalone export '+en)
                tested+=1
            page.close()
        page=browser.new_page(viewport={'width':1200,'height':850})
        page.goto(origin+'/?qa=1&lang=ko&ads=off',wait_until='domcontentloaded')
        # The source edition overrides this canonical card with a live UI.
        # Explicitly exercise its original SVG family renderer in a real browser.
        page.wait_for_function('window.atlasInteractiveQA && typeof atlasInteractiveQA.progressSvg==="function"')
        page.evaluate("""()=>{const p=document.createElement('section');p.id='progress-clipping-probe';
            p.className='scene scene-reference';p.style.cssText='position:relative;width:360px;height:250px;display:block';
            p.innerHTML='<div class="reference-stage">'+atlasInteractiveQA.progressSvg('dar-191b8376a8af',68)+'</div>';
            document.body.append(p)}""")
        probe=page.locator('#progress-clipping-probe')
        clip=probe.locator('svg[data-progress-clip="linear-family"]')
        clip.wait_for(state='attached',timeout=8000)
        if clip.get_attribute('overflow')!='hidden':failures.append('Linear progress clip missing overflow=hidden')
        if clip.locator('rect.native-segment').count()!=1:failures.append('Moving segment is not inside clip viewport')
        if clip.evaluate('e=>getComputedStyle(e).overflowX')!='hidden':failures.append('SVG viewport does not clip animated segment')
        if clip.evaluate('e=>Math.abs(e.viewBox.baseVal.width-224)>0.01'):failures.append('Indeterminate bar clip differs from 224px track')
        # Numeric redraw must retain the same clipping structure.
        page.evaluate("""()=>{const stage=document.querySelector('#progress-clipping-probe .reference-stage');
            stage.innerHTML=atlasInteractiveQA.progressSvg('dar-191b8376a8af',25)}""")
        if probe.locator('svg[data-progress-clip="linear-family"] rect.native-segment').count()!=1:
            failures.append('Progress value redraw lost clipping')
        page.close()
        reduced=browser.new_context(reduced_motion='reduce',viewport={'width':390,'height':760})
        sample=reduced.new_page()
        sample.goto(origin+'/reference/'+rows[0][0]+'/',wait_until='domcontentloaded')
        sample.locator('.rs-stage').wait_for()
        small=sample.locator('.rs-status').evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)<14')
        if small:failures.append('Reduced-motion scene uses sub-14px text')
        sample.close();reduced.close()
        browser.close()
finally:
    server.shutdown();server.server_close()
receipt={'version':'3.2.8','implemented':1224,'planned':965,'new_studies':len(rows),'bilingual_render_and_interaction':tested,'linear_progress_clip':not any('clip' in e.lower() for e in failures),'failures':failures}
(ROOT/'qa/research-studies-v328.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt,ensure_ascii=False,indent=2))
if failures:raise SystemExit('Research studies or progress clipping QA failed')
