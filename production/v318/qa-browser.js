/* ATLAS v3.18 — browser-executed staging regression. Attach via Cloudflare Browser Rendering addScriptTag. */
(function(){
 function check(){
 const errors=[],rootList=[...document.querySelectorAll('.geo-stage')],byKey=new Map(rootList.map(el=>[el.dataset.geoKey,el]));let count=0;
 try{
 const lab=window.AtlasGeoLab,A=window.Atlas32;
 if(!lab||!A)throw Error('Missing lab or host');
 for(const [id,key] of lab.ITEMS){
  const root=byKey.get(key);if(!root){errors.push(key+':not-in-gallery');continue;}
  const original=root.dataset.label,container=root.getBoundingClientRect();
  if(!root.querySelector('.geo-canvas')||!root.querySelector('.geo-note'))errors.push(key+':no-svg');
  if(root.scrollWidth>root.clientWidth+3)errors.push(key+':overflow='+String(root.scrollWidth-root.clientWidth));
  for(const el of root.querySelectorAll('button,input,output,label,.geo-status,.geo-scope')){
   if(parseFloat(getComputedStyle(el).fontSize)<14)errors.push(key+':small-text');
  }
  for(const b of root.querySelectorAll('.geo-controls button')){
   const r=b.getBoundingClientRect();if(r.left<container.left-3||r.right>container.right+3)errors.push(key+':clipped-button');
  }
  root.querySelector('[data-geo=step]').click();
  if(root.dataset.revision!=='1')errors.push(key+':step');
  root.querySelector('[data-geo=alt]').click();
  if(root.dataset.mode!=='alternative')errors.push(key+':alt');
  const range=root.querySelector('[data-geo-range]');
  range.value=range.max;range.dispatchEvent(new Event('input',{bubbles:true}));
  if(range.value!==range.max)errors.push(key+':range');
  const code=A.code({id},root.lang);
  if(!code.startsWith('<!doctype html>')||!code.includes('AtlasGeoLab.mount'))errors.push(key+':export');
  root.querySelector('[data-geo=reset]').click();
  if(root.dataset.revision!=='0'||root.dataset.mode!=='primary'||root.dataset.label!==original)errors.push(key+':reset');
  count++;
 }
 }catch(e){errors.push('CRASH:'+String(e))}
 const node=document.createElement('pre');node.id='atlas-qa-v318';node.dataset.qa=encodeURIComponent(JSON.stringify({pass:errors.length===0,checked:count,visible:rootList.length,errors,viewport:innerWidth,lang:document.querySelector('.geo-stage')?.lang||''}));document.body.appendChild(node);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(check),{once:true});else requestAnimationFrame(check);
})();