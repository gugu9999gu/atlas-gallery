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
definitions=[line for line in (ROOT/'data/interaction-recipes.tsv').read_text(encoding='utf-8').splitlines() if line and not line.startswith('#')]
check('manifest-recipes-and-24-real-three',build['recipes']==len(definitions) and build['three']==24,{'built':build['recipes'],'manifest':len(definitions)})
check('coverage-progress-is-consistent',build['coverage']['specific']+build['coverage']['pending']==build['coverage']['total'] and build['coverage']['percentage']>=50,build['coverage'])
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
    toast_id='dar-888fda81c920'
    toast_recipes=[recipe for recipe in recipes if recipe['id']==toast_id]
    check('canonical-toast-id-uses-real-popup-pattern',len(toast_recipes)==1 and toast_recipes[0]['key']=='ui-toast',toast_recipes)
    check('ui-pattern-count-matches-build',len([recipe for recipe in recipes if recipe['key'].startswith('ui-')])==build.get('ui_motion_examples'),build.get('ui_motion_examples'))
    toast_html=page.evaluate('(id)=>atlasInteractiveQA.code(id)',toast_id)
    check('toast-copy-has-actual-renderer',all(x in toast_html for x in ['AtlasPatterns.mount','ix-p-toast','function initPatterns']),len(toast_html))
    toast=context.new_page()
    toast.set_content(toast_html,wait_until='domcontentloaded')
    toast.wait_for_function("document.querySelector('.ix-pattern.is-open')",timeout=6000)
    appeared=toast.locator('.ix-p-toast').get_attribute('aria-hidden')=='false'
    toast.wait_for_function("!document.querySelector('.ix-pattern.is-open')",timeout=6000)
    disappeared=toast.locator('.ix-p-toast').get_attribute('aria-hidden')=='true'
    check('toast-autoplay-entrance-hold-exit',appeared and disappeared)
    toast.locator('[data-action=trigger]').click()
    check('toast-button-opens-same-popup',toast.locator('.ix-pattern').evaluate("e=>e.classList.contains('is-open')"))
    toast.locator('[data-action=dismiss]').click()
    check('toast-button-dismisses-popup',toast.locator('.ix-p-toast').get_attribute('aria-hidden')=='true')
    toast.close()
    quiet=context.new_page();quiet.emulate_media(reduced_motion='reduce')
    quiet.set_content(toast_html,wait_until='domcontentloaded')
    quiet.wait_for_timeout(1200)
    check('reduced-motion-prevents-toast-autoplay',quiet.locator('.ix-p-toast').get_attribute('aria-hidden')=='true')
    quiet.locator('[data-action=trigger]').click()
    check('reduced-motion-keeps-manual-toast-functional',quiet.locator('.ix-p-toast').get_attribute('aria-hidden')=='false')
    quiet.close()
    for recipe in [r for r in recipes if r['engine']=='dom']:
        code=page.evaluate('(id)=>atlasInteractiveQA.code(id)',recipe['id'])
        demo=context.new_page();de=[];demo.on('pageerror',lambda e:de.append(str(e)))
        demo.set_content(code,wait_until='domcontentloaded')
        key=recipe['key']
        stage=demo.locator('.mg-stage' if key.startswith('mg-') else '.ix-stage')
        rect=stage.bounding_box()
        if key.startswith('mg-'):
            demo.locator('.mg-pause').click()
            changed=stage.get_attribute('class').find('mg-user-paused')>=0
            demo.locator('.mg-replay').click()
            changed=changed and stage.get_attribute('class').find('mg-user-paused')<0
            demo.locator('.mg-rate').select_option('2')
            changed=changed and stage.evaluate("e=>e.style.getPropertyValue('--mg-rate')")=='0.5'
        elif key.startswith('fnd-'):
            if key=='fnd-name':
                demo.locator('[data-act=toggle]').click()
                changed=demo.locator('.ix-fnd-icon').get_attribute('aria-label')!='Save'
            elif key=='fnd-focus-order':
                demo.locator('[data-act=focus]').click()
                changed=demo.locator('.ix-fnd-focus-list button').nth(1).evaluate('e=>document.activeElement===e')
            elif key=='fnd-contrast':
                demo.locator('.ix-fnd-range input').fill('240')
                changed=':1' in demo.locator('.ix-fnd-score').inner_text()
            elif key=='fnd-touch':
                demo.locator('[data-act=toggle]').click()
                changed='ix-fnd-large' in stage.get_attribute('class')
            elif key=='fnd-prevent':
                demo.locator('[data-act=request]').click()
                changed=demo.locator('[data-act=confirm]').is_visible()
                demo.locator('[data-act=confirm]').click()
                changed=changed and demo.locator('[data-act=request]').is_visible()
            elif key=='fnd-error':
                demo.locator('input[type=email]').fill('invalid')
                demo.locator('[data-act=validate]').click()
                changed=demo.locator('input[type=email]').get_attribute('aria-invalid')=='true'
            elif key=='fnd-type-scale':
                demo.locator('input[type=range]').fill('30')
                changed=demo.locator('.ix-fnd-type-demo').evaluate('e=>e.style.fontSize==="30px"')
            elif key=='fnd-type-hierarchy':
                demo.locator('[data-act=toggle]').click()
                changed='ix-fnd-flat' in stage.get_attribute('class')
            elif key=='fnd-spacing':
                demo.locator('[data-act=next]').click()
                changed=demo.locator('.ix-fnd-spaces').evaluate('e=>e.style.gap==="8px"')
            elif key=='fnd-elevation':
                demo.locator('input[type=range]').fill('3')
                changed='LEVEL 3' in demo.locator('.ix-fnd-elevated').inner_text()
            elif key=='fnd-shadow':
                demo.locator('[data-act=next]').click()
                changed='SHADOW / 02' in demo.locator('.ix-fnd-shadow-card').inner_text()
            elif key=='fnd-stroke':
                demo.locator('input[type=range]').fill('5')
                changed=demo.locator('.ix-fnd-stroke-card').evaluate('e=>e.style.borderWidth==="5px"')
            elif key=='fnd-variant':
                demo.locator('[data-act=next]').click()
                changed=demo.locator('.ix-fnd-variant-sample').get_attribute('data-variant')=='secondary'
            elif key=='fnd-state':
                demo.locator('[data-act=next]').click()
                changed=demo.locator('.ix-fnd-state-sample').get_attribute('aria-busy')=='true'
            elif key=='fnd-bento':
                demo.locator('[data-act=toggle]').click()
                changed='ix-fnd-bento-alt' in stage.get_attribute('class')
            elif key=='fnd-specificity':
                demo.locator('[data-act=next]').click()
                changed='1-0-0' in demo.locator('.ix-fnd-output').inner_text()
            elif key=='fnd-clamp':
                demo.locator('input[type=range]').fill('780')
                changed=demo.locator('.ix-fnd-clamp-preview').evaluate('e=>parseFloat(e.style.fontSize)===32')
            elif key=='fnd-scroll-margin':
                demo.locator('[data-act=jump]').click()
                changed=demo.locator('.ix-fnd-scroll').evaluate('e=>e.scrollTop>0')
        elif key.startswith('ui-'):
            if key in ('ui-toast','ui-snackbar','ui-banner','ui-inline'):
                stage.locator('[data-action=trigger]').click()
                changed=stage.evaluate("e=>e.classList.contains('is-open')") and stage.locator('[data-surface]').get_attribute('aria-hidden')=='false'
                stage.locator('[data-action=dismiss]').click()
                changed=changed and stage.locator('[data-surface]').get_attribute('aria-hidden')=='true'
            elif key=='ui-tooltip':
                stage.locator('[data-action=trigger]').focus()
                changed=stage.evaluate("e=>e.classList.contains('is-open')")
            elif key in ('ui-popover','ui-dropdown','ui-modal','ui-sheet','ui-drawer','ui-accordion','ui-fab'):
                stage.locator('[data-action=trigger]').click()
                changed=stage.evaluate("e=>e.classList.contains('is-open')") and stage.locator('[data-action=trigger]').get_attribute('aria-expanded')=='true'
            elif key in ('ui-tabs','ui-segmented'):
                stage.locator('[data-action=tab1]').click()
                changed=stage.locator('[data-action=tab1]').get_attribute('aria-selected')=='true'
                stage.locator('[data-action=tab1]').focus()
                demo.keyboard.press('ArrowRight')
                changed=changed and stage.locator('[data-action=tab0]').get_attribute('aria-selected')=='true'
            elif key in ('ui-checkbox','ui-radio','ui-switch'):
                stage.locator('input[data-control]').first.check()
                changed=stage.locator('input[data-control]').first.is_checked()
            elif key=='ui-slider':
                stage.locator('input[data-control]').fill('75')
                changed='75%' in stage.locator('[data-value]').inner_text()
            elif key=='ui-steps':
                stage.locator('[data-action=next]').click()
                changed='active' in stage.locator('.ix-p-steps b').nth(1).get_attribute('class')
            elif key=='ui-quantity':
                stage.locator('[data-action=increment]').click()
                changed=stage.locator('[data-value]').inner_text()=='2'
            elif key=='ui-progress':
                stage.locator('[data-action=trigger]').click()
                changed=stage.locator('[data-control]').evaluate('e=>e.value>28')
            elif key=='ui-skeleton':
                changed=stage.locator('.ix-p-skeleton span').count()>3
            elif key=='ui-carousel':
                stage.locator('[data-action=next]').click()
                changed=stage.locator('[data-value]').inner_text()=='2 / 3'
            elif key=='ui-loading':
                stage.locator('[data-action=trigger]').click()
                changed=stage.evaluate("e=>e.classList.contains('is-busy')")
            elif key=='ui-search':
                stage.locator('[data-control]').fill('card')
                changed=stage.evaluate("e=>e.classList.contains('is-open')")
            elif key in ('ui-card','ui-button'):
                stage.locator('[data-action=trigger]').click()
                changed=stage.evaluate("e=>e.classList.contains('is-pressed')")
            else:
                changed=False
        elif key.startswith('study-'):
            if key=='study-blur':
                demo.locator('.ix-study-range').fill('8')
                changed=stage.get_attribute('data-state')=='active' and '8' in demo.locator('.ix-study-status').inner_text()
            else:
                demo.locator('.ix-study-trigger').click()
                changed=stage.get_attribute('data-state')=='active'
                if key=='study-skip':
                    changed=changed and demo.locator('.ix-study-target').evaluate('e=>document.activeElement===e')
        elif key in {
            'click-live','click-haptic','click-overflow','drag-drop','drag-swipe','drag-pinch','drag-sort','drag-reorder',
            'key-shortcut','click-context','click-micro','click-history','click-confirm','input-debounce',
            'track-throttle','click-fade','click-slide','key-navigation','key-focus-trap','key-focus',
            'drag-gesture-transition','scroll-scrub','scroll-timeline'
        }:
            if key=='click-live':
                demo.locator('[data-action=polite]').click()
                changed='상태 업데이트' in stage.locator('[role=status]').first.inner_text() or 'Status update' in stage.locator('[role=status]').first.inner_text()
            elif key=='click-haptic':
                demo.locator('[data-action=tap]').click()
                changed=bool(stage.locator('.ix-readout').inner_text())
            elif key=='click-overflow':
                demo.locator('[data-action=menu]').click()
                changed=stage.locator('[role=menu]').is_visible()
            elif key=='drag-drop':
                demo.locator('[data-action=token]').click()
                changed=stage.locator('.ix-drop-zone').get_attribute('class').find('is-complete')>=0
            elif key=='drag-swipe':
                demo.locator('.ix-gesture-card').focus()
                demo.keyboard.press('ArrowRight')
                changed='right' in stage.locator('.ix-readout').inner_text().lower() or '오른쪽' in stage.locator('.ix-readout').inner_text()
            elif key=='drag-pinch':
                demo.locator('[data-action=plus]').click()
                changed='115%' in stage.locator('.ix-readout').inner_text()
            elif key in ('drag-sort','drag-reorder'):
                demo.locator('.ix-sort-list button').first.focus()
                demo.keyboard.press('ArrowDown')
                changed='BETA' in stage.locator('.ix-sort-list button').first.inner_text()
            elif key=='key-shortcut':
                demo.locator('[data-action=open]').click()
                changed=stage.locator('.ix-command-palette').is_visible()
            elif key=='click-context':
                demo.locator('[data-action=target]').click()
                changed=stage.locator('[role=menu]').is_visible()
            elif key=='click-micro':
                demo.locator('[data-action=pulse]').click()
                changed='is-active' in stage.locator('.ix-pulse-indicator').get_attribute('class')
            elif key=='click-history':
                demo.locator('[data-action=add]').click()
                demo.locator('[data-action=undo]').click()
                demo.locator('[data-action=redo]').click()
                changed=stage.locator('.ix-special-count').inner_text()=='1'
            elif key=='click-confirm':
                demo.locator('[data-action=request]').click()
                demo.locator('[data-action=confirm]').click()
                changed=stage.locator('[role=dialog]').is_hidden()
            elif key=='input-debounce':
                demo.locator('input.ix-text-input').fill('atlas')
                demo.wait_for_timeout(460)
                changed='atlas' in stage.locator('.ix-filter-result').inner_text()
            elif key=='track-throttle':
                pad=demo.locator('.ix-track-pad').bounding_box()
                demo.mouse.move(pad['x']+pad['width']*.6,pad['y']+pad['height']*.4)
                changed='1' in stage.locator('.ix-readout').inner_text()
            elif key in ('click-fade','click-slide'):
                demo.locator('[data-action=toggle]').click()
                changed='is-hidden' in stage.locator('.ix-motion-target').get_attribute('class')
            elif key=='key-navigation':
                demo.locator('.ix-key-list button').first.focus()
                demo.keyboard.press('ArrowDown')
                changed=demo.locator('.ix-key-list button').nth(1).get_attribute('tabindex')=='0'
            elif key=='key-focus-trap':
                demo.locator('[data-action=open]').click()
                demo.keyboard.press('Tab')
                changed=stage.locator('[role=dialog]').is_visible() and demo.locator('[data-action=last]').evaluate('e=>document.activeElement===e')
            elif key=='key-focus':
                demo.locator('[data-action=one]').focus()
                changed='Focused' in stage.locator('.ix-readout').inner_text() or '포커스' in stage.locator('.ix-readout').inner_text()
            elif key=='drag-gesture-transition':
                demo.locator('[role=slider]').focus()
                demo.keyboard.press('ArrowRight')
                changed=demo.locator('[role=slider]').get_attribute('aria-valuenow')=='10'
            elif key in ('scroll-scrub','scroll-timeline'):
                demo.locator('.ix-scroll-frame').evaluate('e=>{e.scrollTop=e.scrollHeight-e.clientHeight;e.dispatchEvent(new Event("scroll",{bubbles:true}));}')
                demo.wait_for_function("document.querySelector('.ix-scroll-progress span')?.style.width && parseFloat(document.querySelector('.ix-scroll-progress span').style.width)>0",timeout=2000)
                changed=stage.locator('.ix-scroll-progress span').evaluate('e=>parseFloat(e.style.width)>0')
        elif key.startswith('hover-'):
            stage.hover();changed=stage.evaluate("e=>e.classList.contains('is-active')")
        elif key.startswith('track-'):
            demo.mouse.move(rect['x']+rect['width']*.75,rect['y']+rect['height']*.3);demo.wait_for_timeout(30)
            changed=stage.evaluate("e=>parseFloat(e.style.getPropertyValue('--px'))>e.clientWidth*.6")
        elif key in ('press-hold','press-long'):
            stage.focus();demo.keyboard.down('Enter');demo.wait_for_timeout(1100);demo.keyboard.up('Enter');changed=stage.evaluate("e=>e.classList.contains('is-checked')")
        elif key=='click-double':
            demo.locator('.ix-trigger').click()
            demo.locator('.ix-trigger').click()
            changed=stage.evaluate("e=>e.classList.contains('is-checked')")
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
          const values=new Set();for(let i=0;i<data.length;i+=44)values.add(data[i]+','+data[i+1]+','+data[i+2]);
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
