/* Inject into a gallery page using Cloudflare Browser Rendering addScriptTag.
 * Tests only ATLAS v3.19 cards and existing adapter continuity.
 */
(function(){
 function run(){
  const errors=[],lab=window.AtlasMap319,A=window.Atlas32;
  let checked=0;const actual=[...document.querySelectorAll('.g319')],byKey=new Map(actual.map(el=>[el.dataset.mapKey,el]));
  try{
   if(!lab||!A)throw Error('Missing Map319 or Atlas32 adapter');
   if(lab.ITEMS.length!==16)throw Error('Not 16 canonical records');
   if(A.recipe({id:'dar-eaf8288da983'})!=='geo-voronoi')errors.push('prior-geo-regression');
   if(A.recipe({id:'dar-5cd15e048690'})!=='ai-tree')errors.push('prior-ai-regression');
   for(const [id,key] of lab.ITEMS){
    const root=byKey.get(key);if(!root){errors.push(key+':missing');continue;}
    const initial=root.dataset.label,rect=root.getBoundingClientRect(),svg=root.querySelector('.g319-svg');
    if(!svg||rect.width<150||rect.height<150)errors.push(key+':empty-visual');
    if(root.scrollWidth-root.clientWidth>3)errors.push(key+':horizontal-overflow');
    for(const n of root.querySelectorAll('button,input,output,label,.g319-status,.g319-scope')){
     if(parseFloat(getComputedStyle(n).fontSize)<14)errors.push(key+':font-small');
    }
    for(const b of root.querySelectorAll('.g319-controls button')){
     const br=b.getBoundingClientRect();
     if(br.left<rect.left-3||br.right>rect.right+3)errors.push(key+':button-overflow');
    }
    const main=root.querySelector('[data-map-action=step]'),alt=root.querySelector('[data-map-action=alt]'),reset=root.querySelector('[data-map-action=reset]'),range=root.querySelector('[data-map-range]');
    main.click();if(root.dataset.revision!=='1')errors.push(key+':step-not-counted');
    alt.click();if(root.dataset.revision!=='2')errors.push(key+':alt-not-counted');
    range.value=range.max;range.dispatchEvent(new Event('input',{bubbles:true}));
    if(range.value!==range.max||root.dataset.revision!=='3')errors.push(key+':slider-not-updated');
    const html=A.code({id},root.lang);
    if(!html.startsWith('<!doctype html>')||!html.includes('AtlasMap319.mount'))errors.push(key+':bad-export');
    reset.click();
    if(root.dataset.revision!=='0'||root.dataset.label!==initial||root.dataset.state!=='ready')errors.push(key+':reset-state');
    checked++;
   }
  }catch(e){errors.push('CRASH:'+String(e))}
  const report={pass:errors.length===0,checked,rendered:actual.length,lang:actual[0]?.lang||'',width:innerWidth,errors};
  const box=document.createElement('pre');box.id='atlas319-test';box.setAttribute('data-report',encodeURIComponent(JSON.stringify(report)));document.body.append(box);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(run),{once:true});else requestAnimationFrame(run);
})();