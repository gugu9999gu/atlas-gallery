"""Network-free AdFit lifecycle / layout regression tests; NEVER requests live ads."""
from pathlib import Path
import json, os
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
HTML=(R/'public/index.html').read_text()
checks=[]
def check(name,ok,detail=None):
 checks.append({'name':name,'passed':bool(ok),'details':detail})
 if not ok:raise AssertionError(name+': '+str(detail))
MOCK=r'''window.__adfitCalls=[];window.__adfitDestroyed=[];window.adfit={render(el){window.__adfitCalls.push({id:el.dataset.adUnit,w:+el.dataset.adWidth,h:+el.dataset.adHeight});if(window.__mockNoFill){window[el.dataset.adOnfail](el);return;}el.style.display='block';el.style.width=el.dataset.adWidth+'px';el.style.height=el.dataset.adHeight+'px';const f=document.createElement('iframe');f.title='Test-only advertisement';f.width=el.dataset.adWidth;f.height=el.dataset.adHeight;f.style.border='0';f.srcdoc='<body style="margin:0;background:#edf0f5;color:#62728d;display:grid;place-items:center;height:100vh;font:16px system-ui">TEST ONLY / NO LIVE AD</body>';el.appendChild(f);window[el.dataset.adOnload](el);},destroy(el){window.__adfitDestroyed.push(el.dataset.adUnit);el.replaceChildren();}};'''
try:
 with sync_playwright() as p:
  executable=os.environ.get('CHROMIUM_PATH') or ('/usr/bin/chromium' if Path('/usr/bin/chromium').exists() else None)
  browser=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--no-sandbox'])
  def page_at(width=1440,choice=None,suffix='',mode='ok',gpc=False):
   # In-memory test page: no navigation, SDK download, live impression, or policy changes.
   ctx=browser.new_context(viewport={'width':width,'height':980});page=ctx.new_page();requests=[];errors=[]
   page.on('request',lambda req:requests.append(req.url));page.on('pageerror',lambda err:errors.append(str(err)))
   page.route('**/*',lambda route:route.abort())
   seed=json.dumps({'atlas-adfit-consent-v1':json.dumps({'choice':choice,'at':__import__('time').time()*1000})} if choice else {})
   setup="window.__fixtureURL="+json.dumps('https://atlas-gallery.app/'+suffix)+";window.__mockNoFill="+str(mode=='nofill').lower()+";window.__fixtureStorage="+seed+";Object.defineProperty(window,'localStorage',{value:{getItem(k){return window.__fixtureStorage[k]??null},setItem(k,v){window.__fixtureStorage[k]=v},removeItem(k){delete window.__fixtureStorage[k]}}});history.replaceState=(a,b,u)=>{window.__historyURL=String(u)};"
   if gpc:setup+="Object.defineProperty(navigator,'globalPrivacyControl',{value:true});"
   fixture=HTML.replace("location.protocol==='https:'&&(AD.productionHosts||[]).includes(location.hostname)","true").replace('new URL(location.href)','new URL(window.__fixtureURL)')
   fixture=fixture.replace("s.src='https://t1.kakaocdn.net/kas/static/ba.min.js';","s.dataset.mockSdk='1';")
   mock="s.dispatchEvent(new Event('error'));" if mode=='blocked' else MOCK+"s.dispatchEvent(new Event('load'));"
   fixture=fixture.replace('document.body.appendChild(s);',"document.body.appendChild(s);window.__sdkLoads=(window.__sdkLoads||0)+1;Promise.resolve().then(()=>{"+mock+"});")
   fixture=fixture.replace('location.replace(url.href);',"window.__reloadURL=url.href;document.getElementById('atlas-adfit-sdk')?.remove();")
   fixture=fixture.replace('<head>','<head><script>'+setup+'</script>',1)
   page.set_content(fixture,wait_until='load');page.wait_for_timeout(120)
   return ctx,page,requests,errors
  c,page,req,err=page_at()
  check('sidebar knowledge-base card removed',page.locator('.mini-note,.side-bottom').count()==0 and 'VISUAL KNOWLEDGE BASE' not in page.locator('#sidebar').inner_text())
  check('no third-party request before consent',page.evaluate('window.__sdkLoads||0')==0 and not req)
  check('unconsented users retain all initial cards',page.locator('.term-card').count()==24)
  page.locator('[data-ad-choice="denied"]').first.click();page.wait_for_timeout(100)
  check('declining hides ad slots',page.locator('.ad-slot:visible').count()==0)
  check('declining does not load SDK',page.locator('#atlas-adfit-sdk').count()==0)
  page.locator('[data-ad-settings]').click()
  check('preferences accessible after refusal',page.locator('#ad-settings-dialog').evaluate('(x)=>x.open'))
  page.locator('#ad-settings-dialog [data-ad-choice="granted"]').click()
  page.locator('.ad-slot[data-slot="0"]').scroll_into_view_if_needed();page.wait_for_function('window.__adfitCalls?.length===1')
  check('desktop issued unit exact',page.evaluate('window.__adfitCalls[0]')=={'id':'DAN-Axsm48rrgFFIzM0r','w':728,'h':90})
  page.evaluate('window.__firstFrame=document.querySelector(".ad-slot iframe")')
  page.select_option('#language-select','en');page.wait_for_timeout(150)
  check('language change preserves connected ad iframe',page.evaluate('window.__firstFrame.isConnected && window.__firstFrame===document.querySelector(".ad-slot iframe")'))
  check('language change sends no duplicate ad request',page.evaluate('window.__adfitCalls.length')==1)
  page.locator('#search').fill('Spinner');page.wait_for_timeout(350)
  check('short search hides slots without new requests',page.locator('.ad-slot:visible').count()==0 and page.evaluate('window.__adfitCalls.length')==1)
  page.locator('#search').fill('');page.wait_for_timeout(350)
  check('restoring search preserves iframe identity',page.evaluate('window.__firstFrame===document.querySelector(".ad-slot iframe") && window.__adfitCalls.length===1'))
  page.locator('#load-more').click();page.locator('.ad-slot[data-slot="1"]').scroll_into_view_if_needed();page.wait_for_function('window.__adfitCalls.length===2')
  check('secondary unit is 300x250',page.evaluate('window.__adfitCalls[1]')=={'id':'DAN-dXqYEuIKMUp9iN9Z','w':300,'h':250})
  check('SDK script loaded once',page.locator('#atlas-adfit-sdk').count()==1 and page.evaluate('window.__sdkLoads')==1)
  positions=page.evaluate('Array.from(document.querySelector("#cards").children).reduce((a,e)=>{if(e.classList.contains("term-card"))a.n++;else if(e.classList.contains("ad-slot"))a.p.push(a.n);return a;},{n:0,p:[]}).p')
  check('slots follow cards 16 and 40 in DOM order',positions==[16,40],positions)
  page.locator('#load-more').click();page.wait_for_timeout(100)
  check('further pagination never creates a third slot',page.locator('.ad-slot').count()==2 and page.evaluate('window.__adfitCalls.length')==2)
  page.set_viewport_size({'width':390,'height':900})
  page.wait_for_function('''() => {
    const slot=document.querySelector('.ad-slot[data-slot="0"]');
    return slot?.hidden===true && window.__adfitCalls?.length===2;
  }''',timeout=6000)
  check('oversize desktop ad hidden without scaled creative',page.locator('.ad-slot[data-slot="0"]').is_hidden() and page.evaluate('window.__adfitCalls.length')==2)
  check('resized layout has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  page.set_viewport_size({'width':1440,'height':980})
  page.wait_for_function('''() => {
    const slot=document.querySelector('.ad-slot[data-slot="0"]');
    return slot?.hidden===false && window.__firstFrame?.isConnected && window.__adfitCalls?.length===2;
  }''',timeout=6000)
  check('resize back reuses prior iframe',page.evaluate('window.__firstFrame.isConnected && window.__adfitCalls.length===2'))
  page.locator('[data-ad-settings]').click();page.locator('#ad-settings-dialog [data-ad-choice="denied"]').click();page.wait_for_timeout(200)
  check('withdrawal requests a clean reload',page.locator('#atlas-adfit-sdk').count()==0 and 'ads=off' in page.evaluate('window.__reloadURL'))
  check('withdrawal is saved',page.evaluate('JSON.parse(localStorage.getItem("atlas-adfit-consent-v1")).choice')=='denied')
  check('desktop interaction has no JS errors',not err,err);c.close()
  for width,unit in [(390,'DAN-UZvTvQHDzkXHOdgI'),(360,'DAN-UZvTvQHDzkXHOdgI'),(320,'DAN-HeS6GkO12A1Vgi8s'),(768,'DAN-UZvTvQHDzkXHOdgI'),(1024,'DAN-Axsm48rrgFFIzM0r')]:
   c,page,req,err=page_at(width,'granted')
   page.locator('.ad-slot[data-slot="0"]').scroll_into_view_if_needed();page.wait_for_function('window.__adfitCalls?.length===1')
   check(str(width)+'px selects fitting original-size unit',page.evaluate('window.__adfitCalls[0].id')==unit,page.evaluate('window.__adfitCalls[0]'))
   check(str(width)+'px has no horizontal overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
   check(str(width)+'px no page errors',not err,err);c.close()
  for mode in ['nofill','blocked']:
   c,page,req,err=page_at(1440,'granted',mode=mode)
   page.locator('.ad-slot[data-slot="0"]').scroll_into_view_if_needed();page.wait_for_function('document.querySelector(".ad-slot").dataset.state==="empty"')
   check(mode+' hides empty space',page.locator('.ad-slot[data-slot="0"]').is_hidden())
   page.select_option('#language-select','en');page.wait_for_timeout(100)
   check(mode+' does not retry on locale change',page.evaluate('window.__sdkLoads')==1);c.close()
  c,page,req,err=page_at(390,'granted',suffix='?adpreview=1');page.locator('#load-more').click();page.locator('.ad-slot[data-slot="1"]').scroll_into_view_if_needed();page.wait_for_timeout(120)
  check('preview never requests live advertising',page.evaluate('window.__sdkLoads||0')==0)
  check('preview has two sized slots',page.locator('.ad-preview:visible').count()==2)
  c.close()
  c,page,req,err=page_at(1440,'granted',gpc=True);page.wait_for_timeout(200)
  check('GPC overrides previous opt-in',page.locator('.ad-slot:visible').count()==0 and page.evaluate('window.__sdkLoads||0')==0);c.close()
  c,page,req,err=page_at(1440,'granted',suffix='?qa=1');page.wait_for_timeout(120)
  check('QA route never loads SDK',page.locator('#atlas-adfit-sdk').count()==0);c.close()
  check('unused large placements absent from live code path',all(x not in ['desktopLeaderboard','mobileBanner','rectangle','compactSquare'] for x in json.loads((R/'data/advertising.json').read_text())['adfit']['reservedUnits']))
  browser.close()
finally:
 (R/'qa/adfit-tests.json').write_text(json.dumps({'checks':checks,'passed':sum(x['passed'] for x in checks),'total':len(checks),'liveAdRequests':0,'mode':'mocked SDK, network intercepted'},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'passed':len(checks),'total':len(checks),'liveAdRequests':0}))
