"""Browser regression tests against the built release; no production ad requests."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import json, os, hashlib, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
REPORT=[]
def check(name,passed,detail=None):
    REPORT.append({'name':name,'pass':bool(passed),'detail':detail})
    print(('PASS ' if passed else 'FAIL ')+name,flush=True)
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT/'public')))
Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
build=json.loads((ROOT/'qa/build-v32.json').read_text())
check('pinned-three-vendored',build['vendor_available'])
check('72-recipes-and-24-real-three',build['recipes']==72 and build['three']==24)
check('bilingual-static-pages',len(list((ROOT/'public/reference').glob('*/index.html')))==build['canonical'] and len(list((ROOT/'public/en/reference').glob('*/index.html')))==build['canonical'])
static_errors=[]
for file in list((ROOT/'public/reference').glob('*/index.html'))+list((ROOT/'public/en/reference').glob('*/index.html')):
    source=file.read_text(encoding='utf-8')
    if not all(x in source for x in ['<h1>','class="definition"','rel="canonical"','hreflang="ko"','hreflang="en"','application/ld+json']):static_errors.append(str(file))
    data=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',source,re.S)[1])
    if not any(x.get('@type')=='DefinedTerm' and x.get('description') for x in data['@graph']):static_errors.append(str(file))
check('all-reference-pages-have-visible-text-and-matching-term-schema',not static_errors,static_errors[:5])
with sync_playwright() as p:
    executable=os.getenv('CHROMIUM_PATH')
    browser=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--enable-unsafe-swiftshader','--use-angle=swiftshader'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/?qa=1&lang=ko',wait_until='networkidle')
    page.wait_for_function('window.atlasInteractiveQA')
    check('copy-button-on-every-card',page.locator('.term-card').count()==page.locator('.term-card [data-copy-code]').count()==24)
    page.evaluate("window.__copied=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>window.__copied.push(value)}})")
    page.locator('[data-copy-code]').first.click()
    check('copy-does-not-open-details',page.evaluate("window.__copied.length===1 && !document.getElementById('drawer').classList.contains('open')"))
    check('legacy-example-copies-real-markup',page.evaluate("window.__copied[0].includes('<!doctype html>') && window.__copied[0].includes('<svg')"))
    check('ad-sdk-not-loaded-in-qa',page.locator('script[src*="ba.min.js"]').count()==0)
    check('sidebar-card-remains-removed',page.locator('.mini-note').count()==0)
    for width in [360,390,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':950});page.wait_for_timeout(150);page.evaluate('atlasInteractiveQA.enforce(document)')
        small=page.evaluate("""[...document.querySelectorAll('body *')].filter(e=>!e.closest('svg,[hidden],dialog:not([open])')&&e.getClientRects().length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<13.99).map(e=>[e.tagName,e.className,getComputedStyle(e).fontSize]).slice(0,6)""")
        check(f'text-minimum-14-at-{width}',not small,small)
        check(f'no-overflow-at-{width}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    page.set_viewport_size({'width':1440,'height':1000})
    recipes=page.evaluate('atlasInteractiveQA.recipes()')
    for recipe in [r for r in recipes if r['engine']=='dom']:
        code=page.evaluate('(id)=>atlasInteractiveQA.code(id)',recipe['id'])
        demo=context.new_page();de=[];demo.on('pageerror',lambda e:de.append(str(e)))
        demo.set_content(code,wait_until='domcontentloaded')
        stage=demo.locator('.ix-stage');rect=stage.bounding_box();key=recipe['key']
        if key.startswith('hover-'):
            stage.hover();changed=stage.evaluate("e=>e.classList.contains('is-active')")
        elif key.startswith('track-'):
            demo.mouse.move(rect['x']+rect['width']*.75,rect['y']+rect['height']*.3);demo.wait_for_timeout(30)
            changed=stage.evaluate("e=>parseFloat(e.style.getPropertyValue('--px'))>e.clientWidth*.6")
        elif key=='press-hold':
            stage.focus();demo.keyboard.down('Enter');demo.wait_for_timeout(1100);demo.keyboard.up('Enter');changed=stage.evaluate("e=>e.classList.contains('is-checked')")
        elif key=='drag-compare':
            demo.locator('.ix-range').fill('75');changed=stage.evaluate("e=>e.style.getPropertyValue('--split')==='75%'")
        elif key.startswith('drag-'):
            stage.focus();demo.keyboard.press('ArrowRight');changed=demo.locator('.ix-object').evaluate("e=>e.style.transform.includes('30px')")
        else:
            demo.locator('.ix-trigger').click();demo.wait_for_timeout(40)
            changed=stage.evaluate("e=>e.querySelector('.ix-particle')!==null||e.classList.contains('is-on')||e.classList.contains('is-busy')||e.classList.contains('is-checked')")
        check('standalone-'+key,changed and not de,de);demo.close()
    # All 24 genuine scenes must render non-uniform pixels, with one WebGL context.
    for recipe in [r for r in recipes if r['engine']=='three']:
        result=page.evaluate('''async recipe=>{
          const old=document.getElementById('three-test');if(old)old.remove();AtlasKit.cleanup();
          const root=document.createElement('div');root.id='three-test';root.className='ix-demo';root.style.cssText='position:fixed;top:0;left:0;width:500px;height:340px;z-index:100000';document.body.append(root);
          await AtlasKit.mount(root,recipe,'en');
          const canvas=root.querySelector('canvas');if(!canvas)return {engine:root.dataset.engine,rendered:false};
          const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
          const values=new Set();for(let i=0;i<data.length;i+=400)values.add(data[i]+','+data[i+1]+','+data[i+2]);
          root.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
          return {engine:root.dataset.engine,rendered:root.dataset.rendered,colors:values.size,contexts:AtlasKit.stats().contexts};
        }''',recipe)
        check('real-webgl-'+recipe['key'],result.get('engine')=='three-webgl' and result.get('rendered')=='true' and result.get('colors',0)>3 and result.get('contexts')==1,result)
    page.evaluate("document.getElementById('three-test')?.remove();AtlasKit.cleanup();atlasInteractiveQA.collection('three')")
    page.wait_for_timeout(350)
    check('three-filter-only-three',page.evaluate("[...document.querySelectorAll('.term-card')].every(e=>e.querySelector('[data-live-demo][data-engine]'))"))
    check('single-webgl-context-for-gallery',page.evaluate('AtlasKit.stats().contexts')==1)
    three=next(r for r in recipes if r['key']=='three-tilt')
    code=page.evaluate('(id)=>atlasInteractiveQA.code(id)',three['id'])
    check('three-copy-contains-real-scene-code',all(x in code for x in ['function buildScene','new THREE.WebGLRenderer','three@0.180.0']))
    demo=context.new_page();demo.goto(base+'/404.html')
    code=code.replace('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js',base+'/assets/vendor/three-0.180.0.module.min.js')
    demo.set_content(code);demo.wait_for_selector('#demo[data-rendered="true"]')
    check('copied-three-example-runs',demo.locator('#demo canvas').count()==1);demo.close()
    check('no-javascript-errors',not errors,errors[:10])
    for language in ['ko','en']:
        ref=context.new_page(java_script_enabled=False) if False else context.new_page()
        ref.goto(base+('/en' if language=='en' else '')+'/reference/'+three['id']+'/',wait_until='domcontentloaded')
        check('reference-'+language+'-canonical',ref.locator('link[rel=canonical]').get_attribute('href').startswith('https://atlas-gallery.app/'))
        check('reference-'+language+'-definition',bool(ref.locator('.definition').inner_text()))
        ref.close()
    browser.close()
server.shutdown()
(ROOT/'qa/interaction-tests-v32.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
failed=[r for r in REPORT if not r['pass']]
print(json.dumps({'passed':len(REPORT)-len(failed),'total':len(REPORT),'failed':failed},ensure_ascii=False,indent=2))
raise SystemExit(1 if failed else 0)
