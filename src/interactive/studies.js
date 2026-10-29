/* ATLAS original interactive studies. No third-party calls or analytics. */
(function initStudies(global){
'use strict';
const KINDS=new Set(['study-transition','study-entrance','study-exit','study-ease','study-blur','study-backdrop','study-glass','study-neumorph','study-contrast','study-color','study-reduced','study-skip']);
let sequence=0;
const supports=key=>KINDS.has(key);
function markup(key,language='ko'){
 const ko=language==='ko',blur=key==='study-blur',ease=key==='study-ease',skip=key==='study-skip';
 const buttonText=key==='study-transition'?(ko?'상태 전환':'Toggle state'):key==='study-entrance'?(ko?'등장 시연':'Show / reset'):key==='study-exit'?(ko?'퇴장 시연':'Hide / reset'):key==='study-ease'?(ko?'이징 비교':'Compare easing'):key==='study-contrast'?(ko?'고대비 전환':'Toggle contrast'):key==='study-color'?(ko?'상태 변경':'Change status'):key==='study-reduced'?(ko?'모션 차이':'Motion behavior'):key==='study-skip'?(ko?'본문으로 건너뛰기':'Skip to content'):(ko?'모양 변경':'Change surface');
 return `<div class="ix-stage ix-study" data-kind="${key}" data-state="idle" role="group" tabindex="0" aria-label="${ko?'시각 및 접근성 인터랙션 시연':'Visual and accessibility interaction demonstration'}">
  <div class="ix-study-visual" aria-hidden="true">
   <div class="ix-study-background"></div>
   <div class="ix-study-card"><span class="ix-study-shape">◇</span><span class="ix-study-message">ATLAS</span></div>
   <div class="ix-study-motion-rows"><span></span><span></span><span></span></div>
  </div>
  <div class="ix-study-controls">
    ${blur?`<label>${ko?'흐림 정도':'Blur intensity'} <input class="ix-study-range" type="range" min="0" max="10" step="1" value="5" aria-label="${ko?'흐림 정도':'Blur intensity'}"></label>`:''}
    ${skip?`<a class="ix-study-trigger" href="#ix-study-target">${buttonText}</a>`:`<button class="ix-study-trigger" type="button">${buttonText}</button>`}
  </div>
  ${skip?`<section class="ix-study-target" tabindex="-1" aria-label="${ko?'건너뛰기 목적지':'Skip destination'}">${ko?'본문 콘텐츠':'MAIN CONTENT'}</section>`:''}
  <output class="ix-study-status" role="status" aria-live="polite">${ko?(ease?'선형 · 느리게 시작 · 부드럽게':'조작해 보세요.'):(ease?'Linear · Ease-in · Ease-in-out':'Try the interaction.')}</output>
 </div>`;
}
function mount(root,key,language='ko',options={}){
 const ko=language==='ko',abort=new AbortController(),signal=abort.signal,animations=[];
 const control=root.querySelector('.ix-study-trigger'),card=root.querySelector('.ix-study-card'),status=root.querySelector('.ix-study-status');
 const supportsMotion=()=>!global.matchMedia('(prefers-reduced-motion: reduce)').matches&&!options.paused?.();
 const announce=(a,b)=>{status.textContent=ko?a:b;};
 const animate=(target,frames,opts)=>{if(!supportsMotion())return;const instance=target.animate(frames,opts);animations.push(instance);instance.finished.catch(()=>{});};
 let toggled=false;
 const setState=(on)=>{toggled=on;root.dataset.state=on?'active':'idle';root.classList.toggle('is-study-active',on);control.setAttribute('aria-pressed',String(on));};
 if(key==='study-blur'){
   const range=root.querySelector('.ix-study-range');const update=()=>{card.style.filter=`blur(${range.value}px)`;root.dataset.state='active';announce(`흐림 ${range.value}px`,`Blur ${range.value}px`);};
   range.addEventListener('input',update,{signal});update();
   control.addEventListener('click',()=>{range.value=range.value==='0'?'7':'0';update();},{signal});
 } else if(key==='study-skip'){
   const target=root.querySelector('.ix-study-target'),link=root.querySelector('a.ix-study-trigger');
   const dest='atlas-skip-'+(++sequence);target.id=dest;link.href='#'+dest;
   link.addEventListener('click',e=>{e.preventDefault();target.focus();setState(true);announce('본문 영역으로 초점 이동','Focus moved to main content');},{signal});
 } else {
   control.addEventListener('click',()=>{
     setState(!toggled);
     if(key==='study-entrance'||key==='study-exit')announce(toggled?'요소가 전환되었습니다.':'원래 상태로 돌아왔습니다.',toggled?'Element changed visibility.':'Restored original state.');
     else if(key==='study-ease'){
       const timings=['linear','ease-in','ease-in-out'];const rows=[...root.querySelectorAll('.ix-study-motion-rows span')];
       rows.forEach((row,i)=>{if(!supportsMotion()){row.style.transform='translateX(105px)';return;}animate(row,[{transform:'translateX(0)'},{transform:'translateX(105px)'}],{duration:800,fill:'both',easing:timings[i]});});
       announce('이징별 이동 비교 완료','Easing comparison triggered');
     } else if(key==='study-color'){
       const shape=root.querySelector('.ix-study-shape'),msg=root.querySelector('.ix-study-message');shape.textContent=toggled?'!':'✓';msg.textContent=toggled?(ko?'주의':'WARNING'):(ko?'완료':'SUCCESS');announce(toggled?'경고 상태 · 기호와 텍스트 동반':'성공 상태 · 기호와 텍스트 동반',toggled?'Warning state with icon and text':'Success state with icon and text');
     } else if(key==='study-reduced'){
       if(supportsMotion())animate(card,[{transform:'translateY(0)'},{transform:'translateY(-14px)'},{transform:'translateY(0)'}],{duration:600});
       announce(supportsMotion()?'모션 시연':'감소된 모션 설정: 움직임 생략',supportsMotion()?'Motion demonstrated':'Reduced motion: animation skipped');
     } else announce(toggled?'변경된 상태':'기본 상태',toggled?'Active state':'Default state');
   },{signal});
 }
 return {kind:key,dispose(){abort.abort();animations.forEach(a=>a.cancel());}};
}
global.AtlasStudies={supports,markup,mount,source:'('+initStudies.toString()+')(window);'};
})(window);
