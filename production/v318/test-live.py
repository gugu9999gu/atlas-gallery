"""ATLAS 3.18 staging and exported-example browser regression.
Run with: python production/v318/test-live.py
Requires: playwright==1.57.0 and an installed Chromium/Chrome binary.
This test does not mutate production.
"""
import json
import os
import shutil
from pathlib import Path
from urllib.parse import urlencode
from playwright.sync_api import sync_playwright

BASE=os.environ.get("ATLAS_STAGING_URL","https://atlas-gallery-v318-preview.gytlrgpfl96.workers.dev").rstrip("/")
RESULTS=Path("production/v318/qa-result.json")
IDS=[
 ("dar-eaf8288da983","geo-voronoi"),
 ("dar-c0ba1313c297","geo-perlin"),
 ("dar-c8755d71db8e","geo-fbm"),
 ("dar-4afe7c548909","geo-bsp"),
 ("dar-e927a41ade6b","geo-isoline"),
 ("dar-79f90b8cac02","geo-label"),
 ("dar-a93cbd09246b","geo-cluster"),
 ("dar-84278562ae06","geo-fence"),
 ("dar-9db3a96cdf3d","geo-join"),
 ("dar-752c2a37fc6a","geo-buffer"),
 ("dar-5d5cecc2dacb","geo-symbol"),
 ("dar-200458a776da","geo-general"),
]
assert len(IDS)==12 and len(set(IDS))==12
report={"staging":BASE,"layoutCases":[],"standaloneCases":[],"canonicalCases":[],"errors":[]}

def require(condition, label):
 if not condition:
  raise AssertionError(label)

def capture_errors(page,label):
 page.on("pageerror",lambda error:report["errors"].append({"page":label,"exception":str(error)}))

def stage_check(browser,lang,width):
 page=browser.new_page(viewport={"width":width,"height":900},locale="ko-KR" if lang=="ko" else "en-US")
 capture_errors(page,f"{lang}-{width}")
 url=BASE+"/?"+urlencode({"lang":lang,"collection":"v318"})
 response=page.goto(url,wait_until="domcontentloaded",timeout=60000)
 require(response and response.status==200,f"staging HTTP for {lang}-{width}")
 require(response.headers.get("x-atlas-version")=="3.18.0","wrong stage version header")
 require(response.headers.get("x-robots-tag")=="noindex, nofollow","staging must be noindex")
 page.wait_for_function("window.AtlasGeoLab && window.Atlas32 && document.querySelectorAll('.geo-stage').length>=12",timeout=35000)
 count=page.locator(".geo-stage").count()
 require(count==12,f"{lang}-{width}: expected 12 actual stages got {count}")
 require(page.evaluate("window.AtlasGeoLab.ITEMS.length")==12,"incomplete geo registry")
 require(page.evaluate("window.Atlas32.recipe({id:'dar-5cd15e048690'})")=="ai-tree","prior AI adapter broken")
 require(page.evaluate("window.Atlas32.recipe({id:'dar-eaf8288da983'})")=="geo-voronoi","geo adapter missing")
 for id,key in IDS:
  stage=page.locator(f'.geo-stage[data-geo-key="{key}"]')
  require(stage.count()==1,f"missing {key} from gallery")
  require(stage.locator("svg.geo-canvas").count()==1,f"{key}: SVG missing")
  require(stage.get_attribute("lang")==lang,f"{key}: language incorrect")
  before=stage.get_attribute("data-label")
  b=stage.bounding_box()
  require(b and b["width"]>=150 and b["height"]>=180,f"{key}: collapsed preview")
  fit=stage.evaluate("""(node)=>{
   const outer=node.getBoundingClientRect();
   const buttons=[...node.querySelectorAll('.geo-controls button')];
   const clipped=buttons.filter(el=>{const r=el.getBoundingClientRect();return r.left<outer.left-2||r.right>outer.right+2;}).length;
   const small=[...node.querySelectorAll('button,input,output,label,.geo-status,.geo-scope')]
    .filter(el=>parseFloat(getComputedStyle(el).fontSize)<14).length;
   return {overflow:node.scrollWidth-node.clientWidth,clipped,small}
  }""")
  require(fit["overflow"]<=2 and fit["clipped"]==0 and fit["small"]==0,f"{key}: layout/font failure {fit}")
  stage.locator('[data-geo="step"]').click()
  require(stage.get_attribute("data-revision")=="1",f"{key}: primary handler")
  stage.locator('[data-geo="alt"]').click()
  require(stage.get_attribute("data-mode")=="alternative",f"{key}: alternative handler")
  inp=stage.locator("[data-geo-range]")
  inp.evaluate("""el=>{el.value=el.max;el.dispatchEvent(new Event('input',{bubbles:true}));}""")
  require(inp.input_value()==inp.get_attribute("max"),f"{key}: range handler")
  code=page.evaluate("(args)=>window.Atlas32.code({id:args.id},args.lang)",{"id":id,"lang":lang})
  require(code.startswith("<!doctype html>") and "AtlasGeoLab.mount" in code,f"{key}: standalone export missing")
  stage.locator('[data-geo="reset"]').click()
  require(stage.get_attribute("data-revision")=="0" and stage.get_attribute("data-mode")=="primary",f"{key}: reset state")
  require(stage.get_attribute("data-label")==before,f"{key}: reset visual")
 report["layoutCases"].append({"lang":lang,"viewport":width,"tested":count,"passed":True})
 page.close()

def standalone_check(browser,lang):
 for id,key in IDS:
  original=browser.new_page(viewport={"width":390,"height":844})
  capture_errors(original,f"export-{key}-{lang}")
  original.goto(BASE+"/?lang="+lang+"&collection=v318",wait_until="domcontentloaded",timeout=60000)
  original.wait_for_function("window.Atlas32 && window.AtlasGeoLab",timeout=25000)
  markup=original.evaluate("(v)=>window.Atlas32.code({id:v.id},v.lang)",{"id":id,"lang":lang})
  original.close()
  standalone=browser.new_page(viewport={"width":390,"height":844})
  capture_errors(standalone,f"standalone-{key}-{lang}")
  standalone.set_content(markup,wait_until="load")
  standalone.wait_for_selector('.geo-stage[data-geo-key="'+key+'"]',timeout=7000)
  root=standalone.locator(".geo-stage")
  require(root.locator("svg.geo-canvas").count()==1,f"export SVG {key}")
  originalLabel=root.get_attribute("data-label")
  root.locator('[data-geo="step"]').click()
  require(root.get_attribute("data-revision")=="1",f"export handler {key}")
  root.locator('[data-geo="alt"]').click()
  require(root.get_attribute("data-mode")=="alternative",f"export alternative {key}")
  root.locator('[data-geo="reset"]').click()
  require(root.get_attribute("data-label")==originalLabel and root.get_attribute("data-revision")=="0",f"export reset {key}")
  report["standaloneCases"].append({"lang":lang,"key":key,"passed":True})
  standalone.close()

def canonical_check(browser,lang,id,key):
 page=browser.new_page(viewport={"width":390,"height":844})
 capture_errors(page,f"canonical-{key}-{lang}")
 path=f"/{'en/' if lang=='en' else ''}reference/{id}/"
 response=page.goto(BASE+path,wait_until="domcontentloaded",timeout=60000)
 require(response and response.status==200,"canonical HTTP "+path)
 page.wait_for_selector('.geo-stage[data-geo-key="'+key+'"]',timeout=25000)
 stage=page.locator('.geo-stage')
 before=stage.get_attribute("data-label")
 stage.locator('[data-geo="step"]').click()
 require(stage.get_attribute("data-revision")=="1",f"canonical handler {key}")
 stage.locator('[data-geo="reset"]').click()
 require(stage.get_attribute("data-label")==before,f"canonical reset {key}")
 require(page.locator("link[rel=canonical]").count()>=1,"missing canonical link")
 report["canonicalCases"].append({"lang":lang,"key":key,"passed":True})
 page.close()

def verify_api(browser):
 request=browser.new_context().request
 status=request.get(BASE+"/data/implementation-status.json").json()
 coverage=request.get(BASE+"/data/preview-coverage.json").json()
 for k,v in {"version":"3.18.0","canonical":2153,"directInteractive":563,"uniqueRecipes":551,"specificPreviews":1419,"remainingConceptDiagrams":734}.items():
  require(status[k]==v,f"status {k}={status.get(k)} != {v}")
 require(coverage["previewModes"]["diagram"]==734 and coverage["previewModes"]["native"]==611,"coverage modes mismatch")
 for id,key in IDS:
  row=next((e for e in coverage["entries"] if e["id"]==id),None)
  require(row and row["mode"]=="native" and row["key"]==key and row["directInteractive"],f"coverage entry {id}")
 for path in ["/assets/atlas-v318.js","/assets/atlas-v317.js","/data/release-v318.json","/llms.txt","/robots.txt"]:
  res=request.get(BASE+path)
  require(res.status==200 and res.headers.get("x-atlas-version")=="3.18.0",f"asset/route {path}: {res.status}")
 report["api"]={"passed":True,"interactive":563,"planned":734}

def main():
 try:
  with sync_playwright() as p:
   binary=shutil.which("google-chrome") or shutil.which("chromium")
   browser=p.chromium.launch(headless=True,executable_path=binary if binary else None,args=["--disable-dev-shm-usage"])
   verify_api(browser)
   for lang in ("ko","en"):
    for width in (320,390,1440):
     stage_check(browser,lang,width)
   # Each standalone exported HTML must execute in its own clean JavaScript realm.
   for lang in ("ko","en"):
    standalone_check(browser,lang)
   canonical_check(browser,"ko",IDS[0][0],IDS[0][1])
   canonical_check(browser,"en",IDS[7][0],IDS[7][1])
   browser.close()
  require(not report["errors"],"page JavaScript errors: "+json.dumps(report["errors"],ensure_ascii=False)[:500])
  report["passed"]=True
 except Exception as exc:
  report["passed"]=False
  report["failure"]=repr(exc)
 finally:
  RESULTS.parent.mkdir(parents=True,exist_ok=True)
  RESULTS.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
  print(json.dumps({"passed":report["passed"],"layoutCases":len(report["layoutCases"]),"standaloneCases":len(report["standaloneCases"]),"canonicalCases":len(report["canonicalCases"]),"api":report.get("api"),"errors":report["errors"][:3],"failure":report.get("failure")},ensure_ascii=False,indent=2))
 if not report["passed"]:
  raise SystemExit(1)

if __name__=="__main__":
 main()
