from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from threading import Thread
import os, json, argparse, time, collections
from PIL import Image, ImageOps, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'qa'/'visual-audit'
parser=argparse.ArgumentParser()
parser.add_argument('--limit',type=int,default=0)
parser.add_argument('--offset',type=int,default=0)
parser.add_argument('--mode',choices=['all','specific','diagram'],default='specific')
parser.add_argument('--batch',type=int,default=24)
parser.add_argument('--render',action='store_true')
args=parser.parse_args()
OUT=OUT/args.mode
OUT.mkdir(parents=True,exist_ok=True)
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT/'public')))
Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/?qa=1&lang=ko&ads=off'
all_metrics=[]; images=[]
COLS=6;CW=248;CH=228;ROWS=max(1,(args.batch+COLS-1)//COLS)
with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader'])
  page=browser.new_page(viewport={'width':COLS*CW+20,'height':ROWS*CH+25},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  content=(ROOT/'public/index.html').read_text(encoding='utf-8').replace("get('qa')==='1'","get('qa')!=='0'")
  page.set_content(content,wait_until='domcontentloaded',timeout=90000)
  page.wait_for_function('window.atlasQA && window.atlasInteractiveQA',timeout=90000)
  metas=page.evaluate('''(mode)=>{window.__visualPreviews=atlasQA.inspect().filter(e=>mode==='all'||(mode==='specific'?e.specific:!e.specific));return window.__visualPreviews.map(({id,en,mode,key,specific})=>({id,en,mode,key,specific}));}''',args.mode)
  print('total',len(metas),'errors',errors[:1],flush=True)
  html='''<style>body{background:#e9edf4;margin:0!important;padding:10px!important;font:14px/1.3 system-ui!important}.audit-grid{display:grid;grid-template-columns:repeat(6,248px);gap:0}.audit-item{box-sizing:border-box;width:248px;height:228px;padding:5px;background:#fff;border:1px solid #d8e1ec;overflow:hidden;display:flex;flex-direction:column}.audit-item .audit-title{flex:none;color:#152944;font:600 14px system-ui;height:34px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.audit-item .scene{width:100%!important;height:182px!important;min-height:182px!important;max-width:100%!important;margin:0!important;border-radius:6px!important;overflow:hidden!important}.audit-item .scene .reference-stage{width:100%;height:100%;display:grid;place-items:center}.audit-item .scene .reference-svg{width:100%;max-height:100%}.audit-item .scene-live .ix-demo{height:100%!important;min-height:182px!important}.audit-item .scene .preview-zoom{display:none}</style><main id="review-root"><div class="audit-grid" id="review-grid"></div></main>'''
  page.evaluate('(x)=>document.body.innerHTML=x',html)
  page.evaluate('()=>{document.querySelectorAll("link[rel=stylesheet]").forEach(e=>e.disabled=false);}')
  end=min(len(metas),args.offset+args.limit) if args.limit else len(metas)
  for start in range(args.offset,end,args.batch):
    stop=min(start+args.batch,end)
    metrics=page.evaluate('''async ({start,stop})=>{
       const es=window.__visualPreviews.slice(start,stop), grid=document.getElementById('review-grid');grid.replaceChildren();
       es.forEach((e,i)=>{const item=document.createElement('section');item.className='audit-item term-card';item.dataset.id=e.id;
           const title=document.createElement('div');title.className='audit-title';title.textContent=(start+i+1)+' · '+e.en;
           item.append(title);item.insertAdjacentHTML('beforeend',e.html);grid.append(item);});
       await Promise.all(es.map(async e=>{const el=grid.querySelector('[data-id="'+CSS.escape(e.id)+'"] [data-live-demo]');if(!el)return;
         const engine=el.dataset.engine;if(engine==='three') {el.innerHTML='<p class=ix-three-loading>Three.js scene audited separately</p>';}
         else await AtlasKit.mount(el,{key:el.closest('.scene').dataset.previewKey,engine:'dom'},'ko',{paused:()=>true});}));
       atlasInteractiveQA.enforce(grid);await new Promise(r=>requestAnimationFrame(()=>r()));
       return es.map((e,i)=>{const item=grid.children[i],scene=item.querySelector('.scene');
         const title=item.querySelector('.audit-title');const svgs=[...scene.querySelectorAll('svg')],texts=[...scene.querySelectorAll('svg text')];
         let collisions=0,offstage=0,small=0,blank=scene.getBoundingClientRect().width<50||scene.getBoundingClientRect().height<50;
         const b=scene.getBoundingClientRect(),textboxes=texts.filter(n=>n.getClientRects().length).map(n=>({node:n,r:n.getBoundingClientRect()}));
         for(let a=0;a<textboxes.length;a++){
           const r=textboxes[a].r; if(r.width<1||r.height<1)continue;
           const intersection=Math.max(0,Math.min(r.right,b.right)-Math.max(r.left,b.left))*Math.max(0,Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top));
           if(intersection<r.width*r.height*.7)offstage++;
           const font=parseFloat(getComputedStyle(textboxes[a].node).fontSize),transform=textboxes[a].node.getScreenCTM();const scale=transform?Math.min(Math.hypot(transform.a,transform.b),Math.hypot(transform.c,transform.d)):1;
           if(font*scale<13.95)small++;
           for(let k=a+1;k<textboxes.length;k++){
             const r2=textboxes[k].r;const overlap=Math.max(0,Math.min(r.right,r2.right)-Math.max(r.left,r2.left))*Math.max(0,Math.min(r.bottom,r2.bottom)-Math.max(r.top,r2.top));
             if(overlap>Math.min(r.width*r.height,r2.width*r2.height)*.13)collisions++;
           }
         }
         const visibleText=[...scene.querySelectorAll('*')].filter(el=>el.getClientRects().length&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).length;
         return {id:e.id,en:e.en,mode:e.mode,key:e.key,specific:e.specific,svg:svgs.length,texts:texts.length,collisions,offstage,small,blank,visibleText,sceneChildren:scene.children.length,threeStatus:scene.querySelector('[data-live-demo]')?.dataset.engine||''};
       });
    }''',{'start':start,'stop':stop})
    all_metrics+=metrics
    if args.render:
      path=OUT/f'page-{start:04d}.jpg';page.screenshot(path=str(path),type='jpeg',quality=74,animations='disabled');images.append(path)
    print(f'{stop}/{end}: collisions={sum(m["collisions"]>0 for m in metrics)} offstage={sum(m["offstage"]>0 for m in metrics)} blank={sum(m["blank"] for m in metrics)}',flush=True)
  page.close();browser.close()
server.shutdown()
(OUT/'metrics.json').write_text(json.dumps({'source':'offline compiled public/index.html','mode':args.mode,'total':len(metas),'inspected':len(all_metrics),'errors':errors,'metrics':all_metrics},ensure_ascii=False,indent=2))
counts=collections.Counter()
for m in all_metrics:
 for f in ['collisions','offstage','small','blank']:
  if m[f]:counts[f]+=1
print('summary',counts,'jsErrors:',errors[:5],flush=True)
if args.render and images:
  # Make contact sheets of 96 entries (4 page captures) with large enough captions to inspect.
  for j in range(0,len(images),4):
    batch=images[j:j+4];c=Image.new('RGB',(COLS*CW*2,ROWS*CH*2),(232,237,244))
    for k,impath in enumerate(batch):
      im=Image.open(impath);c.paste(im,((k%2)*COLS*CW,(k//2)*ROWS*CH))
    name=OUT/f'sheet-{args.offset+j*args.batch:04d}.jpg';c.save(name,quality=78,optimize=True)
  print('sheets',len(list(OUT.glob('sheet-*'))))
