"""Regression: card-level Korean/English name copy, term-specific prompts and scrolling.

Uses the built standalone HTML offline; no network, advertising or clipboard
permission is required. Both localized interfaces and every canonical term are covered.
"""
from pathlib import Path
import json, os
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
db=json.loads((ROOT/'qa/expanded-data-v32.json').read_text(encoding='utf-8'))
total=sum(not e.get('canonical_id') for e in db['entries'])
assert total>=2000, 'Canonical reference count unexpectedly low'
html=(ROOT/'public/index.html').read_text(encoding='utf-8')
assert 'card-prompt-scroll' in html and 'data-copy-name' in html
# The live site exposes QA under ?qa=1; about:blank test pages enable it locally.
html=html.replace("get('qa')==='1'","get('qa')!=='0'")
checks=[]

def check(name,passed,detail=None):
    checks.append({'name':name,'passed':bool(passed),'detail':detail})
    print(('PASS ' if passed else 'FAIL ')+name,flush=True)

with sync_playwright() as p:
    chrome=os.getenv('CHROMIUM_PATH')
    browser=p.chromium.launch(**({'executable_path':chrome} if chrome else {}),headless=True,args=['--no-sandbox','--use-angle=swiftshader'])
    for language in ['ko-KR','en-US']:
        locale=language[:2]
        page=browser.new_page(locale=language,viewport={'width':1280,'height':950})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.set_content(html,wait_until='domcontentloaded',timeout=90000)
        page.wait_for_function('window.atlasInteractiveQA',timeout=30000)
        cards=page.locator('.term-card')
        n=cards.count()
        check('correct-locale-'+locale,page.locator('html').get_attribute('lang')==locale)
        check('copy-icons-on-every-card-'+locale,n==24 and page.locator('.term-card [data-copy-name=ko]').count()==n and page.locator('.term-card [data-copy-name=en]').count()==n)
        check('prompt-and-copy-on-every-card-'+locale,page.locator('.term-card .card-prompt-scroll').count()==n and page.locator('.term-card [data-copy-prompt]').count()==n)
        entries=page.evaluate('''lang=>atlasInteractiveQA.prompts(lang).map(e=>({id:e.id,ko:e.ko,en:e.en,text:e.prompt}))''',locale)
        check('all-term-prompts-'+locale,len(entries)==total,len(entries))
        check('specific-complete-prompts-'+locale,all(len(e['text'])>=190 and e['ko'] in e['text'] and e['en'] in e['text'] and ('정의:' if locale=='ko' else 'Definition:') in e['text'] for e in entries))
        check('no-identical-prompts-'+locale,len({e['text'] for e in entries})==len(entries))
        check('no-undefined-content-'+locale,all('undefined' not in e['text'] and '[object Object]' not in e['text'] for e in entries))
        card=cards.first;scroll=card.locator('.card-prompt-scroll')
        check('scroll-container-'+locale,scroll.evaluate('e=>getComputedStyle(e).overflowY==="auto"&&e.scrollHeight>e.clientHeight+25'))
        scroll.focus();page.keyboard.press('End')
        page.wait_for_function('document.querySelector(".card-prompt-scroll")?.scrollTop>0',timeout=4000)
        check('keyboard-scroll-'+locale,scroll.evaluate('e=>e.scrollTop>0'))
        check('no-drawer-on-scroll-'+locale,not page.locator('#drawer').evaluate('e=>e.classList.contains("open")'))
        page.evaluate('''()=>{window.__copies=[];Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async x=>window.__copies.push(x)}})}''')
        card.locator('[data-copy-name=ko]').click()
        card.locator('[data-copy-name=en]').click()
        card.locator('[data-copy-prompt]').click()
        expected=page.evaluate('atlasInteractiveQA.prompts()[0]')
        check('three-clipboard-values-'+locale,page.evaluate('window.__copies')==[expected['ko'],expected['en'],expected['prompt']])
        check('copy-does-not-open-drawer-'+locale,not page.locator('#drawer').evaluate('e=>e.classList.contains("open")'))
        card.locator('[data-copy-prompt]').click()
        check('repeat-copy-feedback-'+locale,len(page.evaluate('window.__copies'))==4 and card.locator('.copy-card-prompt').evaluate('e=>e.classList.contains("copied")'))
        page.evaluate('''()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('blocked')}}});document.execCommand=()=>false}''')
        card.locator('[data-copy-name=ko]').click()
        dialog=page.locator('#manual-card-copy-dialog')
        check('blocked-clipboard-fallback-'+locale,dialog.evaluate('e=>e.open') and dialog.locator('textarea').input_value()==expected['ko'])
        dialog.locator('form button').click()
        check('existing-code-copy-kept-'+locale,card.locator('[data-copy-code]').count()==1)
        for width in [360,390,768,1280]:
            page.set_viewport_size({'width':width,'height':900})
            page.evaluate('atlasInteractiveQA.enforce(document)')
            page.evaluate('()=>new Promise(done=>requestAnimationFrame(done))')
            check('no-horizontal-overflow-'+locale+'-'+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            boxes=card.locator('[data-copy-name]').evaluate_all('es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))')
            check('name-icons-usable-'+locale+'-'+str(width),all(b['w']>=35.5 and b['h']>=35.5 for b in boxes))
            check('prompt-14px-minimum-'+locale+'-'+str(width),scroll.evaluate('e=>parseFloat(getComputedStyle(e.querySelector("p")).fontSize)>=14'))
        check('no-page-errors-'+locale,not errors,errors[:3])
        page.close()
    browser.close()

report={'version':'3.2.5','canonical':total,'checks':len(checks),'passed':sum(x['passed'] for x in checks),'failed':[x for x in checks if not x['passed']]}
(ROOT/'qa/card-prompt-tests-v325.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
if report['failed']:raise SystemExit('Bilingual card-copy and prompt regression failed')
