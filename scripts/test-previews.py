"""Browser QA for the actual compiled site. Requires Playwright + Chromium; no network."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, re, hashlib, collections, os
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/'qa/preview-expansion-tests.json'
checks=[]
def check(name, condition, details=None):
    checks.append({'name':name,'passed':bool(condition),'details':details})
    if not condition: raise AssertionError(name+': '+str(details))
def load(page):
    # Enable an already-existing QA seam only for this test page. Published source remains ?qa=1.
    page.set_content((ROOT/'public/index.html').read_text().replace("get('qa')==='1'","get('qa')!=='0'"),wait_until='load')
def body_signature(html):
    return re.sub(r'aria-label="[^"]*"','',re.sub(r'<(?:text|title)[^>]*>.*?</(?:text|title)>','',html,flags=re.S))
try:
 with sync_playwright() as p:
  executable=os.environ.get('CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None)
  browser=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':1000});errors=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  load(page)
  entries=page.evaluate('atlasQA.waveEntries()');counts=page.evaluate('atlasQA.counts()')
  check('catalog retained',counts=={'all':2112,'canonical':2109,'categories':111},counts)
  check('237 exact-name preview registrations',len(entries)==237)
  samples=page.evaluate("()=>atlasQA.waveEntries().map(e=>({...e,html:[0,.2,.6,1].map(t=>atlasQA.waveRender(e.en,t).html)}))")
  check('all 948 sampled render states are finite',all(not re.search(r'(?:NaN|undefined|Infinity)',s) for e in samples for s in e['html']))
  fingerprints=collections.defaultdict(list)
  for e in samples:fingerprints[hashlib.sha256(''.join(body_signature(s) for s in e['html']).encode()).hexdigest()].append(e['en'])
  duplicates=[v for v in fingerprints.values() if len(v)>1]
  check('no identical new geometry sequences after removing labels',not duplicates,duplicates)
  inspect=page.evaluate('atlasQA.inspect().map(({html,...e})=>e)')
  check('specific and remaining preview totals',sum(e['specific'] for e in inspect)==999 and sum(not e['specific'] for e in inspect)==1110)
  check('all canonical items have a preview identifier',all(e['key'] for e in inspect))
  page.select_option('#preview-filter','expanded')
  check('new preview collection filter',page.locator('#result-count').inner_text().replace(',','')=='237')
  page.select_option('#preview-filter','diagram')
  check('remaining concept filter',page.locator('#result-count').inner_text().replace(',','')=='1110')
  page.select_option('#preview-filter','expanded')
  names={e['en']:e['id'] for e in entries}
  page.evaluate('(id)=>atlasQA.open(id)',names['A* Search']);page.wait_for_timeout(400)
  check('keyboard reachable slider outside inert scene',page.locator('#wave-progress').evaluate('(e)=>!e.closest("[inert]")'))
  before=page.locator('#detail-body > .scene').inner_html()
  page.locator('#wave-progress').fill('100');page.locator('#wave-progress').dispatch_event('input')
  check('path search slider changes geometry',before!=page.locator('#detail-body > .scene').inner_html())
  check('slider exposes current value',page.locator('#wave-progress').get_attribute('aria-valuetext')=='100%')
  page.locator('#wave-reset').click();check('reset restores default',page.locator('#wave-progress').input_value()=='60')
  check('pathfinding comparison panel',page.locator('.compare-card').count()==6)
  page.locator('#replay').click();page.wait_for_timeout(250)
  check('user-triggered replay changes time',page.locator('#wave-progress').input_value()!='60')
  page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(80)
  check('reduced motion stops playback',not page.evaluate('atlasQA.wavePlaybackActive()'))
  page.locator('#wave-reset').click();page.locator('#replay').click();page.wait_for_timeout(80)
  check('reduced motion does not autoplay after replay',page.locator('#wave-progress').input_value()=='60')
  page.keyboard.press('Escape');check('escape closes detail',page.locator('#drawer').get_attribute('aria-hidden')=='true')
  page.emulate_media(reduced_motion='no-preference')
  # Actual weighted searches, not merely pictures of paths.
  searches=page.evaluate("""()=>['astar','dijkstra','bfs','connectivity'].map(k=>{const d=atlasQA.searchGrid(k);return {kind:k,route:d.route,cost:d.route.slice(1).reduce((n,i)=>n+d.cost(i),0),blocked:[...d.blocked],visit:d.visit,W:d.W,start:d.start,goal:d.goal}})""")
  for d in searches[:3]:
   check(d['kind']+' path avoids obstacles and is four-connected',d['route'][0]==d['start'] and d['route'][-1]==d['goal'] and not set(d['route'])&set(d['blocked']) and all(abs(a%d['W']-b%d['W'])+abs(a//d['W']-b//d['W'])==1 for a,b in zip(d['route'],d['route'][1:])))
  check('A* and Dijkstra agree on optimal weighted cost',searches[0]['cost']==searches[1]['cost'],[d['cost'] for d in searches])
  check('separated goal is unreachable',not searches[3]['route'])
  # Both locales and source text remain intact.
  language=page.locator('#language-select')
  if not language.count():language=page.locator('select[data-language]').first
  if not language.count():language=page.locator('select').filter(has=page.locator('option[value="ko"]')).first
  for lang in ['ko','en']:
   language.select_option(lang);page.evaluate('(id)=>atlasQA.open(id)',names['Alpha Clip']);page.wait_for_timeout(200)
   check('language '+lang,page.locator('html').get_attribute('lang')==lang)
   check('translated specific description '+lang,page.locator('.wave-help').count()==1 and bool(page.locator('.wave-help').inner_text()))
   page.keyboard.press('Escape')
  # Restore search and filter across a language change.
  page.locator('#search').fill('알파');page.locator('#search').dispatch_event('input');page.wait_for_timeout(300)
  before=page.locator('#search').input_value();language.select_option('ko')
  check('language switch preserves search and collection',page.locator('#search').input_value()==before and page.locator('#preview-filter').input_value()=='expanded')
  page.locator('#search').fill('');page.locator('#search').dispatch_event('input');page.wait_for_timeout(300)
  for width in [360,390,768,1024,1440]:
   page.set_viewport_size({'width':width,'height':1000});page.wait_for_timeout(100)
   check('gallery does not overflow at '+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   page.evaluate('(id)=>atlasQA.open(id)',names['Gravity Force']);page.wait_for_timeout(400)
   check('detail does not overflow at '+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth+1 && document.querySelector("#detail-body").scrollWidth<=document.querySelector("#detail-body").clientWidth+1'))
   page.keyboard.press('Escape');page.wait_for_timeout(300)
  page.select_option('#preview-filter','all');page.locator('#search').fill('Progress Ring');page.locator('#search').dispatch_event('input');page.wait_for_timeout(300)
  id=page.evaluate("atlasQA.inspect().find(e=>e.en==='Progress Ring').id");page.evaluate('(id)=>atlasQA.open(id)',id);page.wait_for_timeout(350)
  page.locator('#progress-demo').fill('42');page.locator('#progress-demo').dispatch_event('input')
  check('existing progress control preserved',page.locator('#progress-output').inner_text()=='42%')
  check('no advertising requests',not [u for u in requests if re.search('googlesyndication|doubleclick|daumcdn|adfit',u)])
  check('no runtime page exceptions',not errors,errors)
  # Capture public release metadata without collecting browsing history or private information.
  coverage={'version':'3.1.0','canonical':2109,'specific':999,'remaining':1110,'added':237,'interactive_added':sum(x['interactive'] for x in entries),'families':dict(collections.Counter(x['family'] for x in entries)),'entries':[{k:e[k] for k in ['id','en','ko','family','key','interactive']} for e in entries]}
  (ROOT/'qa/preview-coverage.json').write_text(json.dumps(coverage,ensure_ascii=False,indent=2)+'\n')
  (ROOT/'qa/remaining-previews.json').write_text(json.dumps([e for e in inspect if not e['specific']],ensure_ascii=False,indent=2)+'\n')
  db=page.evaluate('atlasQA.waveData()');(ROOT/'data/atlas-gallery-bilingual.json').write_text(json.dumps(db,ensure_ascii=False,indent=2)+'\n')
  browser.close()
except Exception:
 REPORT.write_text(json.dumps({'checks':checks,'passed':sum(x['passed'] for x in checks),'total':len(checks)},ensure_ascii=False,indent=2)+'\n')
 raise
REPORT.write_text(json.dumps({'checks':checks,'passed':len(checks),'total':len(checks)},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'total':len(checks),'added':len(entries),'remaining':1110},ensure_ascii=False))
