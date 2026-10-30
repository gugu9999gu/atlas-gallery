"""Regression: ATLAS motion-graphics terminology, runnable previews and export.
Run after: npm run build. Uses installed Playwright/Chromium without external HTTP calls.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'
DB=json.loads((ROOT/'qa/expanded-data-v32.json').read_text(encoding='utf-8'))
SAMPLES=[e for e in DB['entries'] if not e.get('canonical_id') and e.get('demo',{}).get('key','').startswith('mg-')]
KEYS={e['demo']['key'] for e in SAMPLES}
assert len(SAMPLES)==26 and len(KEYS)==26, f'Expected 26 unique runnable motion graphics studies, got {len(SAMPLES)}'
assert len({c['category'] for c in SAMPLES})>=4, 'Expected at least four categories'
assert all(e['preview']['classification']=='interactive' for e in SAMPLES)
assert DB['metadata']['motion_graphics_edition']['studies']==26
assert 'AtlasMotionGraphics' in (OUT/'assets/interaction-kit.js').read_text(encoding='utf-8')
assert '.mg-stage' in (OUT/'assets/interaction-style.css').read_text(encoding='utf-8')
for e in SAMPLES:
    for folder in [OUT/'reference'/e['id'],OUT/'en/reference'/e['id']]:
        assert (folder/'index.html').exists(),f'Missing definition {folder}'
        assert (folder/'index.md').exists(),f'Missing markdown {folder}'
        assert 'reference-demo' in (folder/'index.html').read_text(encoding='utf-8')
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        return
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(OUT)))
thread=Thread(target=server.serve_forever,daemon=True);thread.start()
origin='http://127.0.0.1:'+str(server.server_port)
problems=[]
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        example=next(e for e in SAMPLES if e['demo']['key']=='mg-particle-burst')
        url=origin+'/reference/'+example['id']+'/'
        page=browser.new_page(viewport={'width':900,'height':750})
        page.on('pageerror',lambda err:problems.append(str(err)))
        page.goto(url,wait_until='domcontentloaded')
        stage=page.locator('.mg-stage[data-kind="mg-particle-burst"]')
        stage.wait_for(timeout=15000)
        page.wait_for_function("document.querySelector('.mg-stage')?.classList.contains('mg-playing')",timeout=15000)
        assert page.locator('.mg-spark').count()==12,'Particle sample should have twelve radial particles'
        assert page.locator('.mg-anim').first.evaluate('(e)=>getComputedStyle(e).animationPlayState')=='running'
        stage.locator('.mg-pause').click()
        assert stage.locator('.mg-pause').get_attribute('aria-pressed')=='true'
        assert page.locator('.mg-anim').first.evaluate('(e)=>getComputedStyle(e).animationPlayState')=='paused'
        stage.locator('.mg-replay').click()
        assert stage.locator('.mg-pause').get_attribute('aria-pressed')=='false'
        stage.locator('.mg-rate').select_option('2')
        assert stage.evaluate('(e)=>e.style.getPropertyValue("--mg-rate")')=='0.5'
        export=page.evaluate("""async (key) => {
           const css=await (await fetch('/assets/interaction-style.css')).text();
           return AtlasKit.code({key,engine:'dom',title:'Particle Burst'},'ko',css);
        }""",example['demo']['key'])
        assert 'AtlasMotionGraphics.mount' in export and '.mg-stage' in export and '<html' in export
        english=browser.new_page(viewport={'width':900,'height':750})
        english.goto(origin+'/en/reference/'+example['id']+'/',wait_until='domcontentloaded')
        assert english.locator('.mg-replay').count()==1
        assert english.locator('html').get_attribute('lang')=='en'
        reduced=browser.new_context(reduced_motion='reduce')
        reduced_page=reduced.new_page()
        reduced_page.goto(url,wait_until='domcontentloaded')
        reduced_page.locator('.mg-stage').wait_for()
        assert reduced_page.locator('.mg-stage').evaluate('(e)=>e.classList.contains("mg-still")'),'Reduced motion should disable playback'
        reduced.close();english.close();page.close();browser.close()
finally:
    server.shutdown();server.server_close()
assert not problems,'Browser JS errors: '+str(problems)
report={'version':'3.2.4','motion_terms':len(SAMPLES),'categories':sorted({e['category'] for e in SAMPLES}),'preview_engine':'HTML/CSS/SVG','browser':'Chromium','checks':['render','intersection playback','pause/replay','speed','copy export','English','reduced motion'],'errors':problems}
(ROOT/'qa/motion-graphics-v324.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
