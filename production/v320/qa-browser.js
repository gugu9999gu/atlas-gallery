/* Cloudflare Browser Rendering staging smoke/regression for ATLAS v3.20 */
(function(){
 function verify(){
  const err=[],lab=window.AtlasPerf320,A=window.Atlas32;
  let checked=0,small=0,clipped=0,overflow=0,exports=0;
  const all=[...document.querySelectorAll('.perf320')],map=new Map(all.map(r=>[r.dataset.p320Key,r]));
  try{
   if(!lab||!A||lab.ITEMS.length!==16)throw Error('Adapter or 16-item registry missing');
   if(A.recipe({id:'dar-eaf8288da983'})!=='geo-voronoi')err.push('prior-v318-adapter');
   if(A.recipe({id:'dar-bec6171276e6'})!=='map-wang')err.push('prior-v319-adapter');
   const db=JSON.parse(document.getElementById('atlas-data').textContent);
   for(const [id,key] of lab.ITEMS){
    const r=map.get(key);if(!r){err.push('missing '+key);continue;}
    const orig=r.dataset.label,outer=r.getBoundingClientRect(),preview=r.querySelector('.p320-view');
    if(!preview||!preview.firstElementChild||outer.height<180||outer.width<200)err.push(key+':empty');
    if(r.scrollWidth>r.clientWidth+3){err.push(key+':horizontal-overflow');overflow++;}
    for(const el of r.querySelectorAll('button,input,output,label,.p320-status,.p320-scope')){
     if(parseFloat(getComputedStyle(el).fontSize)<14){err.push(key+':small-font');small++;}
    }
    for(const b of r.querySelectorAll('.p320-controls button')){
     const rect=b.getBoundingClientRect();if(rect.left<outer.left-3||rect.right>outer.right+3){err.push(key+':button-overflow');clipped++;}
    }
    const entry=db.entries.find(e=>e.id===id);
    if(!entry||entry.live_key!==key||!entry.aliases.includes('atlasv320'))err.push(key+':source-alias');
    const recipe=A.recipe({id});if(recipe!==key)err.push(key+':recipe');
    const exported=A.code({id},r.lang);
    if(!exported.startsWith('<!doctype html>')||!exported.includes('AtlasPerf320.mount'))err.push(key+':export');
    else exports++;
    r.querySelector('[data-p320=step]').click();
    if(r.dataset.revision!=='1')err.push(key+':step');
    r.querySelector('[data-p320=alt]').click();
    if(r.dataset.revision!=='2')err.push(key+':alternative');
    const input=r.querySelector('[data-p320-range]');
    input.value=input.max;input.dispatchEvent(new Event('input',{bubbles:true}));
    if(input.value!==input.max||r.dataset.revision!=='3')err.push(key+':range');
    r.querySelector('[data-p320=reset]').click();
    if(r.dataset.state!=='ready'||r.dataset.revision!=='0'||r.dataset.label!==orig)err.push(key+':reset');
    checked++;
   }
  }catch(e){err.push('fatal:'+String(e))}
  const report={pass:err.length===0,cards:checked,rendered:all.length,language:all[0]?.lang||'',width:innerWidth,exported:exports,small,clipped,overflow,errors:err};
  const x=document.createElement('pre');x.id='atlas-v320-qa';x.dataset.report=encodeURIComponent(JSON.stringify(report));document.body.append(x);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(verify),{once:true});else requestAnimationFrame(verify);
})();