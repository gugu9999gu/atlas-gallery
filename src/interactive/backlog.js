/* ATLAS backlog batch — runnable, original, self-contained browser studies.
 * No claim to reproduce third-party engines, libraries or performance benchmarks.
 * Pointer, touch and keyboard interactions; no analytics, network calls or audio.
 */
(function initAtlasBacklog(global){
'use strict';
const keys=('css-transition css-keyframes css-animation waapi cancel keyframe curve timing stagger blending scroll-story reflow budget view-transition flip interrupt reverse view-timeline overscroll velocity hierarchy preference essential compositor state retarget spec frames sprite procedural clip additive layer mask notify recoil recovery sync buffer secondary feedback positive negative hit').split(' ').map(x=>'bl-'+x);
const KINDS=new Set(keys);
const supports=key=>KINDS.has(key);
let serial=0;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tile=(i)=>'<span class="bl-tile" data-index="'+i+'">'+(i+1)+'</span>';
function scene(key,ko){
 const dot='<span class="bl-object bl-autoplay" aria-hidden="true">◆</span>';
 const rail='<span class="bl-rail" aria-hidden="true"></span>';
 const caption=(a,b)=>'<span class="bl-scene-caption">'+escape(ko?a:b)+'</span>';
 if(key==='bl-scroll-story'||key==='bl-view-timeline')
  return '<div class="bl-scrollbox" tabindex="0" aria-label="'+(ko?'스크롤하여 단계 변경':'Scroll to change progress')+'"><div class="bl-story-item">01 · '+(ko?'시작':'Begin')+'</div><div class="bl-story-item">02 · '+(ko?'전개':'Develop')+'</div><div class="bl-story-item">03 · '+(ko?'마무리':'Complete')+'</div></div><div class="bl-progress"><span></span></div>'+caption('스크롤 위치 → 진행률','Scroll position → progress');
 if(key==='bl-reflow'||key==='bl-flip')return '<div class="bl-grid">'+Array.from({length:4},(_,i)=>tile(i)).join('')+'</div>'+caption(key==='bl-flip'?'First → Last → Invert → Play':'배치가 바뀌는 동안 재흐름','Layout reflow during a reorder');
 if(key==='bl-budget')return '<div class="bl-budget">'+[8,13,18,11,21,15,12,23].map(v=>'<span class="bl-budget-bar" style="--h:'+(v*3)+'px" title="'+v+' ms"></span>').join('')+'<span class="bl-budget-line">16.7ms</span></div>'+caption('60Hz 가상 프레임 시간 (실측 아님)','Illustrative 60Hz frame times, not measured');
 if(key==='bl-curve')return '<svg viewBox="0 0 280 122" class="bl-curve" aria-hidden="true"><path d="M36 99V19M36 99H258" stroke="#718eaf" stroke-width="2" fill="none"/><path d="M36 99C108 98 104 19 258 20" stroke="#8de5db" stroke-width="4" fill="none"/><circle class="bl-curve-dot" cx="36" cy="99" r="7" fill="#ffb785"/></svg>'+caption('Cubic Bézier · 시간에 따른 값','Cubic Bézier · value over time');
 if(key==='bl-timing')return '<div class="bl-timing">'+['linear','ease-in','ease-out'].map(x=>'<div class="bl-lane"><span>'+x+'</span><i class="bl-runner" data-ease="'+x+'"></i></div>').join('')+'</div>';
 if(key==='bl-secondary')return '<div class="bl-secondary-stage"><span class="bl-primary-pill">'+(ko?'주요 작업':'Primary action')+'</span><div class="bl-secondary-menu" hidden><button type="button" data-secondary="save">'+(ko?'저장':'Save')+'</button><button type="button" data-secondary="share">'+(ko?'공유':'Share')+'</button></div></div>';
 if(key==='bl-feedback'||key==='bl-positive'||key==='bl-negative')return '<div class="bl-feedback"><div class="bl-feedback-track"><span></span></div><strong class="bl-feedback-value">40%</strong></div>'+caption(key==='bl-negative'?'목표 50%로 수렴':'피드백과 상태 변화',key==='bl-negative'?'Converging to the 50% target':'Input and state feedback');
 if(key==='bl-state'||key==='bl-essential'||key==='bl-notify'||key==='bl-buffer')return '<div class="bl-state-panel"><span class="bl-state-glyph">◇</span><strong class="bl-state-title">'+(ko?'준비':'Ready')+'</strong><small class="bl-state-sub">'+(ko?'상태를 변경해 보세요':'Change the state')+'</small></div>';
 if(key==='bl-frames'||key==='bl-sprite')return '<div class="bl-frames"><div class="bl-sprite-window"><div class="bl-sprite-strip bl-autoplay">'+['↑','↗','→','↘','↓','↙'].map(x=>'<span>'+x+'</span>').join('')+'</div></div><span class="bl-frame-counter">01 / 06</span></div>'+caption('개별 프레임 순서','Discrete frame sequence');
 if(key==='bl-procedural')return '<svg class="bl-wave-svg" viewBox="0 0 275 120" aria-hidden="true"><path class="bl-procedural-path" d="M0 60H275" stroke="#8febdf" stroke-width="4" fill="none" stroke-linecap="round"/></svg>'+caption('sin(x+t) · 시간 기반 곡선','Time-based sine-wave deformation');
 if(key==='bl-clip'||key==='bl-mask')return '<div class="bl-reveal-frame"><span>01 / BASE</span><div class="bl-reveal-layer bl-autoplay">02 / REVEAL</div></div>'+caption(key==='bl-mask'?'마스크가 가시 영역을 제어':'클리핑 경계가 공개 영역을 제어',key==='bl-mask'?'Mask controls visible area':'Clipping defines the reveal');
 if(key==='bl-layer'||key==='bl-additive'||key==='bl-blending')return '<div class="bl-layer-canvas"><div class="bl-layer-a bl-autoplay">A</div><div class="bl-layer-b bl-autoplay">B</div></div>'+caption(key==='bl-additive'?'기본 이동 + 추가 흔들림':key==='bl-blending'?'두 동작의 가중 혼합':'개별 레이어의 합성',key==='bl-additive'?'Base move + additional offset':key==='bl-blending'?'Weighted blend of two motions':'Independent animation layers');
 if(key==='bl-hierarchy')return '<div class="bl-hierarchy"><strong class="bl-h-main bl-autoplay">'+(ko?'주요 행동':'Primary')+'</strong><span class="bl-h-sub bl-autoplay">'+(ko?'보조 피드백':'Supporting feedback')+'</span><span class="bl-h-sub bl-autoplay">'+(ko?'세부 정보':'Secondary detail')+'</span></div>';
 if(key==='bl-stagger')return '<div class="bl-stagger">'+Array.from({length:5},(_,i)=>'<span class="bl-stagger-item bl-autoplay" style="--i:'+i+'">'+(i+1)+'</span>').join('')+'</div>'+caption('요소별 시작 시간 차이','Offset starts for each element');
 if(key==='bl-sync')return '<div class="bl-sync">'+[0,1,2].map(x=>'<span class="bl-sync-item bl-autoplay">'+(x+1)+'</span>').join('')+'</div>'+caption('공통 타임라인에 동기화','Shared animation timeline');
 if(key==='bl-retarget')return '<div class="bl-target-area"><span class="bl-target-pin" aria-hidden="true">◆</span><span class="bl-target-pos">A / B / C</span></div>';
 if(key==='bl-view-transition')return '<div class="bl-view-panel"><span class="bl-view-glyph">A</span><strong class="bl-view-text">'+(ko?'첫 번째 보기':'First view')+'</strong></div>';
 if(key==='bl-overscroll')return '<div class="bl-elastic-track" tabindex="0" aria-label="'+(ko?'위아래 드래그':'Drag vertically')+'"><div class="bl-elastic-object">↕</div></div>'+caption('경계에서 늘어났다 복귀','Elastic release at the bounds');
 if(key==='bl-velocity')return '<div class="bl-velocity-track">'+rail+dot+'</div>'+caption('속도에 따른 이동량 비교','Distance changes with velocity');
 if(key==='bl-spec')return '<div class="bl-spec-visual">'+rail+dot+'<span class="bl-spec-value">400ms</span></div>'+caption('duration · easing · feedback','Duration · easing · feedback');
 if(key==='bl-keyframe'||key==='bl-css-keyframes')return '<div class="bl-keyframe-timeline">'+['0%','50%','100%'].map((v,i)=>'<span class="bl-frame-marker">'+v+'</span>').join('')+rail+dot+'</div>';
 if(key==='bl-preference')return '<div class="bl-preference-visual">'+dot+'<span>'+ (ko?'시스템 모션 설정 적용':'System motion setting respected') +'</span></div>';
 if(key==='bl-compositor')return '<div class="bl-default-canvas bl-compositor">'+rail+dot+'</div>'+caption('transform + opacity / GPU 보장 아님','transform + opacity / not a GPU guarantee');
 if(key==='bl-interrupt'||key==='bl-reverse')return '<div class="bl-default-canvas">'+rail+dot+'</div>'+caption(key==='bl-interrupt'?'도중 다시 누르면 현재 위치부터':'중간 지점에서 재생 방향 역전',key==='bl-interrupt'?'Retarget from the current frame':'Reverse in place at any moment');
 if(key==='bl-recoil'||key==='bl-recovery'||key==='bl-hit')return '<div class="bl-default-canvas bl-impact">'+dot+'</div>'+caption(key==='bl-hit'?'피격 반응 · 밝기와 넉백':key==='bl-recovery'?'충격 후 복귀 동작':'충격의 짧은 반동',key==='bl-hit'?'Flash and knockback on impact':key==='bl-recovery'?'Settling after impact':'Short reaction to force');
 return '<div class="bl-default-canvas">'+rail+dot+'</div>'+caption('조작 가능한 원리 시연','Interactive original study');
}
const BUTTONS={
 'bl-cancel':['취소','Cancel'],'bl-reverse':['방향 전환','Reverse'],'bl-interrupt':['방향 변경','Retarget'],
 'bl-reflow':['배치 변경','Reflow'],'bl-flip':['순서 뒤집기','Reorder'],
 'bl-view-transition':['화면 변경','Switch view'],'bl-secondary':['추가 메뉴','More actions'],
 'bl-state':['다음 상태','Next state'],'bl-buffer':['입력 예약','Queue action'],
 'bl-feedback':['값 변경','Change value'],'bl-positive':['증폭','Amplify'],'bl-negative':['오차 줄이기','Correct error'],
 'bl-overscroll':['원위치','Reset'],'bl-spec':['실행','Run'], 'bl-budget':['새 예시','Another sample'],
 'bl-notify':['이벤트 시작','Start event'], 'bl-preference':['반응 보기','Show response'], 'bl-essential':['완료 처리','Mark complete'],
 'bl-retarget':['다음 목표','Next target'], 'bl-velocity':['다른 속도','Change velocity']
};
function markup(key,language='ko'){
 if(!supports(key))throw new Error('Unregistered ATLAS backlog preview: '+key);
 const ko=language==='ko',labels=BUTTONS[key]||['시연하기','Play example'];
 let extra='';
 if(['bl-feedback','bl-spec','bl-velocity'].includes(key))extra='<label class="bl-range-wrap">'+(ko?'값 조절':'Adjust')+' <input class="bl-range" type="range" min="10" max="90" value="40" step="10" aria-label="'+(ko?'예제 값':'Example value')+'"></label>';
 if(key==='bl-cancel')extra='<button type="button" class="bl-stop">'+(ko?'중지':'Cancel')+'</button>';
 return '<div class="bl-stage" data-kind="'+key+'" tabindex="0" role="group" aria-label="'+(ko?'실행 가능한 '+key.slice(3)+' 시연':'Runnable '+key.slice(3)+' study')+'"><div class="bl-art">'+scene(key,ko)+'</div><div class="bl-toolbar"><button type="button" class="bl-action">'+escape(ko?labels[0]:labels[1])+'</button>'+extra+'</div><output class="bl-status" role="status" aria-live="polite">'+(ko?'예제 안에서 조작해 보세요.':'Interact within this example.')+'</output></div>';
}
function mount(root,key,language='ko',options={}){
 if(!supports(key))throw new Error('Unknown study: '+key);
 const ko=language==='ko',abort=new AbortController(),signal=abort.signal,timers=new Set(),animations=new Set();
 const motionQuery=global.matchMedia('(prefers-reduced-motion: reduce)');
 const action=root.querySelector('.bl-action'),out=root.querySelector('.bl-status'),object=root.querySelector('.bl-object'),range=root.querySelector('.bl-range');
 const limited=()=>motionQuery.matches||options.paused?.()===true||document.documentElement.classList.contains('motion-paused');
 const say=(a,b)=>{out.textContent=ko?a:b;};
 const wait=(fn,ms)=>{const t=setTimeout(()=>{timers.delete(t);fn();},ms);timers.add(t);return t;};
 const animate=(target,frames,settings={})=>{
  if(!target||limited())return null;
  const a=target.animate(frames,{duration:settings.duration??560,easing:settings.easing||'cubic-bezier(.2,.75,.25,1)',fill:'both',iterations:settings.iterations||1});
  animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;
 };
 let state=0,velocity=0,lastAnimation=null,raf=0,visible=true,down=false,dragStart=0,queued=0,processing=false;
 function activate(){
  state++;root.dataset.activations=String(state);
  root.classList.toggle('is-active',state%2===1);
  if(key==='bl-css-transition'||key==='bl-compositor'||key==='bl-clip'||key==='bl-mask'){
   say('상태와 스타일이 전환되었습니다.','Transitioned to the next visual state.');return;
  }
  if(key==='bl-css-keyframes'||key==='bl-css-animation'||key==='bl-keyframe'||key==='bl-frames'||key==='bl-sprite'||key==='bl-stagger'||key==='bl-sync'||key==='bl-additive'||key==='bl-layer'){
   root.classList.remove('bl-restart');void root.offsetWidth;root.classList.add('bl-restart');say('키프레임을 다시 재생했습니다.','Replayed the animation keyframes.');return;
  }
  if(key==='bl-waapi'||key==='bl-cancel'||key==='bl-notify'){
   lastAnimation?.cancel();
   const a=animate(object,[{transform:'translateX(0) scale(1)',opacity:.75},{transform:'translateX(112px) scale(1.15)',opacity:1},{transform:'translateX(0) scale(1)',opacity:.75}],{duration:850});
   lastAnimation=a;
   if(key==='bl-notify'){say('완료 이벤트를 기다리는 중','Waiting for the finish event');if(a)a.onfinish=()=>say('애니메이션 완료 이벤트 발생','Animation finished event fired');else say('모션 없이 상태 완료','Completed without motion');}
   else say('브라우저 Animation 객체를 재생했습니다.','A browser Animation object played.');
   return;
  }
  if(key==='bl-curve'||key==='bl-timing'){
   if(key==='bl-curve'){const dot=root.querySelector('.bl-curve-dot');animate(dot,[{transform:'translate(0,0)'},{transform:'translate(80px,-52px)'},{transform:'translate(215px,-79px)'}],{duration:850,easing:'cubic-bezier(.32,0,.67,1)'});}
   else root.querySelectorAll('.bl-runner').forEach(dot=>animate(dot,[{transform:'translateX(0)'},{transform:'translateX(115px)'}],{duration:900,easing:dot.dataset.ease}));
   say('이징과 시간 경과를 비교합니다.','Comparing timing and easing.');return;
  }
  if(key==='bl-budget'){root.querySelectorAll('.bl-budget-bar').forEach((el,i)=>el.style.setProperty('--h',((i*17+state*19)%54+12)+'px');say('가상 프레임 막대를 바꿨습니다.','Changed illustrative frame bars.');return;}
  if(key==='bl-reflow'||key==='bl-flip'){
   const tiles=[...root.querySelectorAll('.bl-tile')],first=tiles.map(x=>x.getBoundingClientRect());
   const grid=root.querySelector('.bl-grid');grid.classList.toggle('bl-wide');
   if(key==='bl-flip'&&!limited()){tiles.forEach((el,i)=>{const after=el.getBoundingClientRect();const dx=first[i].left-after.left,dy=first[i].top-after.top;animate(el,[{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:530});});}
   say('레이아웃이 바뀌었습니다.','The layout changed.');return;
  }
  if(key==='bl-view-transition'){
   const panel=root.querySelector('.bl-view-panel'),glyph=root.querySelector('.bl-view-glyph'),label=root.querySelector('.bl-view-text'),on=state%2===1;
   const update=()=>{panel.classList.toggle('alternate',on);glyph.textContent=on?'B':'A';label.textContent=ko?(on?'두 번째 보기':'첫 번째 보기'):(on?'Second view':'First view');};
   if(!limited()&&typeof document.startViewTransition==='function'){try{document.startViewTransition(update);}catch{update();}}
   else update();
   say('동일 문서 내 뷰 상태를 바꿨습니다.','Switched the same-document view state.');return;
  }
  if(key==='bl-interrupt'||key==='bl-reverse'){
   if(key==='bl-reverse'&&lastAnimation?.playState==='running'){lastAnimation.reverse();say('진행 중인 애니메이션을 역재생합니다.','Reversed the running animation.');return;}
   const current=lastAnimation?.effect?.getComputedTiming?.().progress||0;
   lastAnimation?.cancel();lastAnimation=animate(object,[{transform:'translateX('+(current*110)+'px)'},{transform:'translateX('+(state%2?116:0)+'px)'}],{duration:840});
   say('움직이는 도중 목표를 바꿉니다.','The target changes during motion.');return;
  }
  if(key==='bl-velocity'){
   const v=Number(range?.value||40),distance=Math.round(v*1.6);animate(object,[{transform:'translateX(0)'},{transform:'translateX('+distance+'px)'}],{duration:620});say('속도 '+v+' · 거리 '+distance+'px','Velocity '+v+' · distance '+distance+'px');return;
  }
  if(key==='bl-hierarchy'){
   root.querySelectorAll('.bl-hierarchy>*').forEach((el,i)=>{if(limited())return;wait(()=>animate(el,[{transform:'translateY(12px)',opacity:.25},{transform:'translateY(0)',opacity:1}],{duration:380}),i*120);});
   say('주요 요소부터 순서대로 반응합니다.','Primary elements lead the sequence.');return;
  }
  if(key==='bl-spec'){
   const ms=Number(range?.value||40)*10+100;
   animate(object,[{transform:'translateX(0)'},{transform:'translateX(130px)'}],{duration:ms});root.querySelector('.bl-spec-value').textContent=ms+'ms';say('기간 토큰 '+ms+'ms','Duration token '+ms+'ms');return;
  }
  if(key==='bl-retarget'){
   const positions=[[18,52],[57,18],[76,68]],p=positions[state%3],pin=root.querySelector('.bl-target-pin');pin.style.left=p[0]+'%';pin.style.top=p[1]+'%';
   say('다음 목적지로 이동했습니다.','Moved to the next destination.');return;
  }
  if(key==='bl-essential'||key==='bl-preference'||key==='bl-state'||key==='bl-buffer'){
   const title=root.querySelector('.bl-state-title'),glyph=root.querySelector('.bl-state-glyph');
   if(key==='bl-buffer'){
    queued++;say('대기 중인 입력 '+queued,'Buffered inputs: '+queued);
    if(!processing){processing=true;wait(()=>{queued=Math.max(0,queued-1);processing=false;title.textContent=ko?'실행 완료':'Executed';glyph.textContent='✓';say('남은 입력 '+queued,'Remaining queued: '+queued);},480);}
    return;
   }
   const steps=key==='bl-state'?['IDLE','RUNNING','DONE']:['READY','COMPLETE'];const v=steps[state%steps.length];title.textContent=v;glyph.textContent=v==='DONE'||v==='COMPLETE'?'✓':v==='RUNNING'?'▶':'◇';
   if(key==='bl-preference')say(limited()?'모션 감소를 적용하고 정보를 유지합니다.':'모션 설정을 반영했습니다.',limited()?'Motion reduced; information remains.':'System motion preference respected.');
   else say('상태: '+v,'State: '+v);
   if(!limited()&&key!=='bl-essential')animate(glyph,[{transform:'scale(.8)'},{transform:'scale(1.13)'},{transform:'scale(1)'}],{duration:420});
   return;
  }
  if(key==='bl-recoil'||key==='bl-recovery'||key==='bl-hit'){
   const frames=key==='bl-hit'?[{transform:'translateX(0)',filter:'brightness(1)'},{transform:'translateX(17px)',filter:'brightness(2)',offset:.22},{transform:'translateX(-5px)',filter:'brightness(1.2)',offset:.65},{transform:'translateX(0)',filter:'brightness(1)'}]:key==='bl-recoil'?[{transform:'translateX(0)'},{transform:'translateX(-25px)'},{transform:'translateX(7px)'},{transform:'translateX(0)'}]:[{transform:'translateY(-30px)'},{transform:'translateY(24px)'},{transform:'translateY(-13px)'},{transform:'translateY(0)'}];
   animate(object,frames,{duration:key==='bl-hit'?400:650});say('상황에 맞는 반응을 실행했습니다.','Played the contextual response.');return;
  }
  if(key==='bl-secondary'){
   const menu=root.querySelector('.bl-secondary-menu'),open=menu.hidden;menu.hidden=!open;action.setAttribute('aria-expanded',String(open));say(open?'추가 작업을 표시합니다.':'추가 작업을 닫았습니다.',open?'Secondary actions opened.':'Secondary actions closed.');return;
  }
  if(key==='bl-feedback'||key==='bl-positive'||key==='bl-negative'){
   let value=Number(root.dataset.value||40);
   if(key==='bl-positive')value=Math.min(100,Math.round(value*1.35+3));
   else if(key==='bl-negative')value=Math.round(value+(50-value)*.48);
   else value=(value+15)%105;
   root.dataset.value=String(value);root.querySelector('.bl-feedback-track span').style.width=value+'%';root.querySelector('.bl-feedback-value').textContent=value+'%';
   say('현재 값 '+value+'%','Current value '+value+'%');return;
  }
  if(key==='bl-scroll-story'||key==='bl-view-timeline'){const scroll=root.querySelector('.bl-scrollbox');scroll.scrollTop+=65;updateScroll();return;}
  if(key==='bl-overscroll'){root.querySelector('.bl-elastic-object').style.transform='translateY(0)';say('원래 위치로 복귀합니다.','Elastic element reset.');return;}
  if(key==='bl-procedural'){say('시간에 따라 계산되는 곡선입니다.','The curve is calculated from elapsed time.');return;}
  animate(object,[{transform:'translateX(0)',opacity:1},{transform:'translateX(115px) scale(1.1)',opacity:.75},{transform:'translateX(0)',opacity:1}],{duration:740});
  say('단계별 동작을 시연했습니다.','Played the transition study.');
 }
 function updateScroll(){
  const sc=root.querySelector('.bl-scrollbox');if(!sc)return;
  const progress=sc.scrollTop/Math.max(1,sc.scrollHeight-sc.clientHeight);
  root.querySelector('.bl-progress span').style.width=Math.round(progress*100)+'%';root.dataset.progress=String(Math.round(progress*100));
  say('스크롤 진행 '+Math.round(progress*100)+'%','Scroll progress '+Math.round(progress*100)+'%');
 }
 function updateVisibility(yes){
  visible=yes;root.classList.toggle('bl-playing',yes&&!limited()&&!document.hidden);
  if(key==='bl-procedural'){if(raf)cancelAnimationFrame(raf);raf=0;if(yes&&!limited()&&!document.hidden)raf=requestAnimationFrame(drawWave);}
 }
 function drawWave(time){
  if(!root.isConnected||!visible||limited()||document.hidden){raf=0;return;}
  const path=root.querySelector('.bl-procedural-path');const values=[];
  for(let x=0;x<=275;x+=5)values.push((x===0?'M':'L')+x+' '+(60+23*Math.sin(x*.036+time*.0024)).toFixed(1));
  path?.setAttribute('d',values.join(' '));raf=requestAnimationFrame(drawWave);
 }
 action.addEventListener('click',activate,{signal});
 const stop=root.querySelector('.bl-stop');
 stop?.addEventListener('click',()=>{lastAnimation?.cancel();object?.removeAttribute('style');root.dataset.cancelled='true';say('현재 Animation을 취소했습니다.','Cancelled the active Animation.');},{signal});
 range?.addEventListener('input',()=>{
  if(key==='bl-feedback'){const v=Number(range.value);root.dataset.value=String(v);root.querySelector('.bl-feedback-track span').style.width=v+'%';root.querySelector('.bl-feedback-value').textContent=v+'%';}
  else if(key==='bl-spec'){root.querySelector('.bl-spec-value').textContent=(Number(range.value)*10+100)+'ms';}
  else if(key==='bl-velocity'){velocity=Number(range.value);root.dataset.velocity=String(velocity);}
 },{signal});
 root.querySelectorAll('[data-secondary]').forEach(btn=>btn.addEventListener('click',()=>{say('보조 작업 선택: '+btn.textContent,'Selected: '+btn.textContent);root.querySelector('.bl-secondary-menu').hidden=true;action.setAttribute('aria-expanded','false');},{signal}));
 root.querySelector('.bl-scrollbox')?.addEventListener('scroll',updateScroll,{signal,passive:true});
 const elastic=root.querySelector('.bl-elastic-track'),elasticItem=root.querySelector('.bl-elastic-object');
 if(elastic){
  elastic.addEventListener('pointerdown',e=>{down=true;dragStart=e.clientY;elastic.setPointerCapture(e.pointerId);},{signal});
  elastic.addEventListener('pointermove',e=>{if(!down)return;const delta=Math.max(-54,Math.min(54,(e.clientY-dragStart)*.55));elasticItem.style.transform='translateY('+delta+'px)';root.dataset.dragged='true';},{signal});
  const release=()=>{if(!down)return;down=false;elasticItem.style.transform='translateY(0)';say('스프링 복귀 완료','Spring returned to origin');};
  elastic.addEventListener('pointerup',release,{signal});elastic.addEventListener('pointercancel',release,{signal});
 }
 root.addEventListener('keydown',e=>{if(e.target===root&&(e.key==='Enter'||e.key===' ')){e.preventDefault();activate();}},{signal});
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(items=>updateVisibility(items[0]?.isIntersecting===true),{threshold:.05}):null;
 observer?.observe(root);
 document.addEventListener('visibilitychange',()=>updateVisibility(visible),{signal});
 motionQuery.addEventListener?.('change',()=>updateVisibility(visible),{signal});
 if(!observer)updateVisibility(true);
 if(key==='bl-secondary')action.setAttribute('aria-expanded','false');
 return {kind:key,dispose(){
  observer?.disconnect();abort.abort();if(raf)cancelAnimationFrame(raf);for(const id of timers)clearTimeout(id);for(const a of animations)a.cancel();lastAnimation?.cancel();
 }};
}
global.AtlasBacklog={supports,markup,mount,keys:[...KEYS],source:'('+initAtlasBacklog.toString()+')(window);'};
})(window);
