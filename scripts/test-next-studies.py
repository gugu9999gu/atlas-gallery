"""Regression for 20 precise, live pending-preview upgrades (v3.2.7).
Verifies canonical IDs, actual DOM interaction, standalone code, accessibility and coverage.
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
report=json.loads((ROOT/'qa/preview-progress.json').read_text(encoding='utf-8'))
rows=[line.split('|') for line in (ROOT/'data/next-studies.tsv').read_text(encoding='utf-8').splitlines() if line and not line.startswith('#')]
canonical={e['id']:e for e in db['entries'] if not e.get('canonical_id')}
assert len(rows)==20 and len({r[0] for r in rows})==20
assert report['current']['total']==2189
assert report['current']['specific']==1204 and report['current']['pending']==985,report['current']
for id,key,en in rows:
    entry=canonical[id]
    assert entry['en']==en and entry['demo']['key']==key and entry['implementation_status']=='implemented'
    assert (OUT/'reference'/id/'index.html').exists()
    assert (OUT/'en/reference'/id/'index.html').exists()
assert 'AtlasNext' in (OUT/'assets/interaction-kit.js').read_text(encoding='utf-8')

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(OUT)))
Thread(target=server.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(server.server_port)
issues=[];passed=0
with sync_playwright() as pw:
    exe=os.getenv('CHROMIUM_PATH')
    browser=pw.chromium.launch(**({'executable_path':exe} if exe else {}),headless=True,args=['--no-sandbox'])
    for language in ('ko','en'):
        page=browser.new_page(viewport={'width':650,'height':750})
        page.on('pageerror',lambda e:issues.append('JS:'+str(e)))
        for id,key,en in rows:
            page.goto(base+('/en' if language=='en' else '')+'/reference/'+id+'/',wait_until='domcontentloaded')
            stage=page.locator('.n27-stage')
            stage.wait_for(timeout=9000)
            if stage.get_attribute('data-n27-kind')!=key:issues.append('Wrong renderer '+key)
            status=page.locator('.n27-status')
            before=status.inner_text()
            primary=stage.locator('[data-n27=primary]')
            if primary.count():
                primary.click()
                if status.inner_text()==before and key not in ('n27-variablejump',):issues.append('No feedback '+key)
            elif key in ('n27-contrast','n27-nineslice','n27-deadzone'):
                slider=stage.locator('[data-n27-range]')
                slider.fill('190' if key=='n27-nineslice' else '60' if key=='n27-deadzone' else '80')
                if status.inner_text()==before:issues.append('No slider feedback '+key)
            if key=='n27-cooldown' and primary.is_enabled():issues.append('Cooldown did not disable action')
            if key=='n27-progression' and stage.locator('.n27-meter-fill').evaluate('e=>parseFloat(e.style.width)')<=0:issues.append('XP meter unchanged')
            if key=='n27-fog':
                stage.locator('.n27-fog-cell').first.focus()
                if int(stage.get_attribute('data-revealed') or '0')<2:issues.append('Fog of war reveal failed')
            if key=='n27-userflow' and stage.get_attribute('data-step')!='2':issues.append('User flow did not advance')
            if key=='n27-responsive' and stage.get_attribute('data-state')!='768':issues.append('Responsive columns unchanged')
            if key=='n27-hitbox' and stage.get_attribute('data-state')!='overlap':issues.append('Hitbox activation failed')
            if key=='n27-invuln':
                stage.locator('[data-n27=secondary]').click()
                if stage.get_attribute('data-state')!='blocked':issues.append('Invulnerability window failed')
            if key=='n27-deadzone' and stage.get_attribute('data-output') in (None,'0'):
                issues.append('Dead zone did not produce output')
            if language=='ko':
                exported=page.evaluate('''async()=>{const css=await(await fetch("/assets/interaction-style.css")).text();const e=JSON.parse(document.getElementById("reference-recipe").textContent);return AtlasKit.code(e,"ko",css)}''')
                if 'AtlasNext.mount' not in exported or '<html' not in exported:issues.append('Standalone copy not using real module '+key)
            passed+=1
        page.close()
    tiny=browser.new_context(viewport={'width':360,'height':740},reduced_motion='reduce')
    p=tiny.new_page();p.goto(base+'/reference/'+rows[15][0]+'/',wait_until='domcontentloaded')
    p.locator('.n27-stage').wait_for()
    if p.locator('.n27-stage').evaluate('(e)=>parseFloat(getComputedStyle(e.querySelector(".n27-hint")).fontSize)<14'):
        issues.append('Font under 14px')
    p.close();tiny.close();browser.close()
server.shutdown();server.server_close()
receipt={'version':'3.2.7','total':2189,'implemented':1204,'planned':985,'new_studies':20,'bilingual_study_runs':passed,'issues':issues}
(ROOT/'qa/next-studies-v327.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt,ensure_ascii=False,indent=2))
if issues:raise SystemExit('New study regression failed')
