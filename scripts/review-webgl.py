from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import json,os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT/'public')))
Thread(target=server.serve_forever,daemon=True).start();base='http://127.0.0.1:'+str(server.server_port)
with sync_playwright() as p:
    executable=os.getenv('CHROMIUM_PATH');b=p.chromium.launch(**({'executable_path':executable} if executable else {}),headless=True,args=['--enable-unsafe-swiftshader','--use-angle=swiftshader'])
    page=b.new_page(viewport={'width':1440,'height':1050});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/?qa=1&lang=en');page.wait_for_function('window.atlasInteractiveQA')
    page.screenshot(path=str(ROOT/'qa/v32-desktop.png'))
    report=page.evaluate('''async()=>{
      const recipes=atlasInteractiveQA.recipes().filter(e=>e.engine==='three');
      document.body.innerHTML='<main id="review-grid" style="padding:20px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px;background:#eaf0fa"></main>';AtlasKit.cleanup();
      const grid=document.getElementById('review-grid');const results=[];
      for(const r of recipes){const box=document.createElement('section');box.innerHTML='<h2 style="font:16px system-ui">'+r.en+'</h2><div class="ix-demo" style="width:320px;height:250px"></div>';grid.append(box);const root=box.querySelector('.ix-demo');await AtlasKit.mount(root,r,'en');results.push({key:r.key,engine:root.dataset.engine});}
      const THREE=await import('/assets/vendor/three-0.180.0.module.min.js');const scene=AtlasKit.buildScene(THREE,'three-pick');scene.camera.aspect=320/250;scene.camera.updateProjectionMatrix();
      const state={x:.18,y:-.15,toggled:false};const before=[];scene.scene.traverse(o=>{if(o.isMesh)before.push({position:o.position.toArray(),scale:o.scale.toArray(),geometry:o.geometry.type,visible:o.visible})});
      const hit=scene.draw(state,0);const after=[];scene.scene.traverse(o=>{if(o.isMesh)after.push({position:o.position.toArray(),scale:o.scale.toArray(),matrix:o.matrixWorld.toArray(),material:o.material.type})});scene.dispose();
      return {results,hit,before,after,camera:{position:scene.camera.position.toArray(),quaternion:scene.camera.quaternion.toArray()}};
    }''')
    page.wait_for_timeout(400);page.screenshot(path=str(ROOT/'qa/v32-three-grid.png'),full_page=True)
    report['errors']=errors;(ROOT/'qa/webgl-review-v32.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
    b.close()
server.shutdown()
