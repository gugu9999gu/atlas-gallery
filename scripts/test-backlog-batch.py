"""ATLAS v3.2.6: 44 canonical backlog upgrades and honest planned card status.
All examples use original browser code, run locally, and retain their original IDs.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright
import os, json, collections

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
DB=json.loads((ROOT/'qa/expanded-data-v32.json').read_text(encoding='utf-8'))
BUILD=json.loads((ROOT/'qa/build-v32.json').read_text(encoding='utf-8'))
PROGRESS=json.loads((ROOT/'qa/preview-progress.json').read_text(encoding='utf-8'))
CANONICAL=[e for e in DB['entries'] if not e.get('canonical_id')]
RECIPES=[]
for line in (ROOT/'data/backlog-studies.tsv').read_text(encoding='utf-8').splitlines():
    if not line or line.startswith('#'):continue
    key,record_id,en=line.split('|')
    matches=[e for e in CANONICAL if e['id']==record_id and e['en']==en]
    assert len(matches)==1,(key,en,len(matches))
    assert matches[0]['demo']['key']==key and matches[0]['demo']['engine']=='dom'
    RECIPES.append(matches[0])
assert len(RECIPES)==44
assert len({e['id'] for e in RECIPES})==44
assert BUILD['backlog_upgrades']==44
assert DB['metadata']['backlog_edition']['upgraded']==44
assert len(CANONICAL)==PROGRESS['current']['total']
planned=[e for e in CANONICAL if e.get('implementation_status')=='planned']
assert len(planned)==PROGRESS['current']['pending'],(len(planned),PROGRESS['current'])
assert len(CANONICAL)-len(planned)==PROGRESS['current']['specific']
assert PROGRESS['current']['pending'] < 1049
assert all(not e.get('demo') for e in planned)
assert all(e.get('implementation_status')=='implemented' for e in RECIPES)
for e in RECIPES[:2]+planned[:2]:
    label=('구현 예정' if e['implementation_status']=='planned' else '직접 조작')
    text=(PUBLIC/'reference'/e['id']/'index.html').read_text(encoding='utf-8')
    assert ('구현 예정' in text)==(e['implementation_status']=='planned'),(e['en'],label)
    english=(PUBLIC/'en/reference'/e['id']/'index.html').read_text(encoding='utf-8')
    assert ('Planned' in english)==(e['implementation_status']=='planned')
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(PUBLIC)))
Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
failures=[];executed=0;details=[]
with sync_playwright() as pw:
    exe=os.getenv('CHROMIUM_PATH')
    browser=pw.chromium.launch(**({'executable_path':exe} if exe else {}),headless=True,args=['--no-sandbox','--use-angle=swiftshader'])
    home=browser.new_page(viewport={'width':1280,'height':900})
    home.on('pageerror',lambda error:failures.append('gallery:'+str(error)))
    home.goto(base+'/?qa=1&ads=off&lang=ko',wait_until='domcontentloaded',timeout=60000)
    home.wait_for_function('window.atlasInteractiveQA',timeout=60000)
    states=home.evaluate('atlasInteractiveQA.statuses()')
    assert len(states)==len(CANONICAL)
    assert sum(x['planned'] for x in states)==len(planned)
    assert set(x['id'] for x in states if x['planned'])==set(e['id'] for e in planned)
    home.locator('#preview-filter').select_option('diagram')
    home.wait_for_function("document.querySelectorAll('.term-card').length===24")
    assert home.locator('.term-card .preview-pending').count()==24,'All diagrams should be marked planned'
    assert home.locator('.term-card .pending-preview-kind').count()==24
    assert '구현 예정' in home.locator('#preview-filter option[value="diagram"]').text_content()
    home.locator('#preview-filter').select_option('all')
    home.locator('#search').fill('CSS Transitions')
    home.wait_for_function("document.querySelector('.term-card[data-id=dar-75ac70d863ca] .bl-stage')",timeout=12000)
    card=home.locator('.term-card[data-id="dar-75ac70d863ca"]')
    assert card.locator('.preview-pending').count()==0,'Implemented card must not be marked planned'
    assert card.locator('.copy-card-prompt').count()==1
    assert card.locator('[data-copy-code]').count()==1
    home.locator('#search').fill('')
    home.close()
    for language in ('ko','en'):
        for e in RECIPES:
            code=(PUBLIC/'assets/interaction-kit.js').read_text(encoding='utf-8') if False else None
            # The gallery exports the same self-contained renderer, not an illustrative screenshot.
            page=browser.new_page(viewport={'width':500,'height':690},locale='ko-KR' if language=='ko' else 'en-US')
            page.on('pageerror',lambda error:failures.append('standalone:'+str(error)))
            page.goto(base+'/reference/'+e['id']+'/' if language=='ko' else base+'/en/reference/'+e['id']+'/',wait_until='domcontentloaded')
            stage=page.locator('.bl-stage')
            stage.wait_for(timeout=12000)
            assert stage.get_attribute('data-kind')==e['demo']['key']
            before=page.locator('.bl-status').inner_text()
            stage.locator('.bl-action').click()
            after=page.locator('.bl-status').inner_text()
            if before==after or stage.get_attribute('data-activations')!='1':
                failures.append('No interaction or feedback: '+language+'/'+e['en'])
            if e['en']=='Animation Cancel':
                stage.locator('.bl-stop').click()
                if stage.get_attribute('data-cancelled')!='true':failures.append('WAAPI cancel broken')
            if e['en']=='View Transition API' and stage.locator('.bl-view-glyph').inner_text()!='B':
                failures.append('view transition did not update DOM')
            if e['en'] in ('Layout / Reflow','FLIP Layout Animation') and 'bl-wide' not in stage.locator('.bl-grid').get_attribute('class'):
                failures.append('layout reflow failed')
            if e['en']=='Feedback Loop' and stage.locator('.bl-feedback-value').inner_text()=='40%':
                failures.append('feedback value unchanged')
            if e['en']=='Overscroll Effect':
                block=stage.locator('.bl-elastic-track');bbox=block.bounding_box()
                page.mouse.move(bbox['x']+bbox['width']/2,bbox['y']+bbox['height']/2)
                page.mouse.down();page.mouse.move(bbox['x']+bbox['width']/2,bbox['y']+bbox['height']/2+32);page.mouse.up()
                if stage.get_attribute('data-dragged')!='true':failures.append('elastic drag did not follow pointer')
            if language=='ko':
                export=page.evaluate("""async () => {
                    const text=await (await fetch('/assets/interaction-style.css')).text();
                    const p=JSON.parse(document.querySelector('#reference-recipe').textContent);
                    return AtlasKit.code(p,'ko',text);
                }""")
                if 'AtlasBacklog.mount' not in export or '<html' not in export or 'bl-stage' not in export:
                    failures.append('Copy code mismatch: '+e['en'])
            executed+=1
            page.close()
    reduced=browser.new_context(reduced_motion='reduce')
    page=reduced.new_page()
    page.goto(base+'/reference/'+RECIPES[0]['id']+'/',wait_until='domcontentloaded')
    page.locator('.bl-stage').wait_for(timeout=12000)
    assert page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
    page.locator('.bl-action').click()
    assert page.locator('.bl-status').inner_text()!=''
    page.close();reduced.close();browser.close()
server.shutdown();server.server_close()
report={'version':'3.2.6','canonical':len(CANONICAL),'implemented':PROGRESS['current']['specific'],'planned':len(planned),'new_live_studies':len(RECIPES),'standalone_language_interactions':executed,'failures':failures}
(ROOT/'qa/backlog-batch-v326.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
if failures:raise SystemExit('Backlog implementation test failed')
