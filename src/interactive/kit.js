/* ATLAS interactive study kit. Original code; no analytics or advertising dependencies.
 * Copied demos use these same functions, not a substitute screenshot/template.
 */
(function(global){
'use strict';
const VERSION='3.2.3';
const THREE_VERSION='0.180.0';
const THREE_URL=global.ATLAS_THREE_URL||'/assets/vendor/three-0.180.0.module.min.js';
let threePromise;
const mounted=new Map();
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function markup(kind,language='ko'){
 if(window.AtlasFoundations?.supports(kind))return window.AtlasFoundations.markup(kind,language);
 if(window.AtlasPatterns?.supports(kind))return window.AtlasPatterns.markup(kind,language);
 if(window.AtlasStudies?.supports(kind))return window.AtlasStudies.markup(kind,language);
 if(window.AtlasAdvanced?.supports(kind))return window.AtlasAdvanced.markup(kind,language);
 kind=({'press-long':'press-hold','drag-swipe-dismiss':'drag-dismiss','click-radial-legacy':'click-radial','drag-elasticity':'drag-elastic'})[kind]||kind;
 const ko=language==='ko',drag=kind.startsWith('drag-'),track=kind.startsWith('track-'),click=kind.startsWith('click-')||kind==='press-hold';
 return `<div class="ix-stage" data-kind="${kind}" lang="${language}" tabindex="0" role="group" aria-label="${ko?'직접 조작하는 예제':'Interactive example'}"><div class="ix-grid" aria-hidden="true"></div><div class="ix-light" aria-hidden="true"></div><div class="ix-trail" aria-hidden="true"></div><div class="ix-cross" aria-hidden="true"></div><div class="ix-tiles" aria-hidden="true">${Array.from({length:9},(_,i)=>`<i data-tile="${i}"></i>`).join('')}</div><div class="ix-object"><div class="ix-graphic" aria-hidden="true"><i></i><i></i><i></i></div><span class="ix-kicker">ATLAS / LAB</span><strong class="ix-head">${track?'FOLLOW':drag?'MOVE':click?'MAKE IT':'HELLO.'}</strong><div class="ix-line" aria-hidden="true"></div><div class="ix-extra">${ko?'다음 장면을 발견하세요.':'Discover the next scene.'}</div><div class="ix-alt" aria-hidden="true"><strong>ANOTHER<br>VIEW.</strong></div><div class="ix-check" aria-hidden="true"><svg viewBox="0 0 80 80"><path d="M15 40 32 56 65 22"/></svg></div><div class="ix-knob" aria-hidden="true"></div><div class="ix-meter" aria-hidden="true"></div></div><div class="ix-orbit-actions" aria-hidden="true"><i>＋</i><i>↗</i><i>★</i></div><span class="ix-follower" aria-hidden="true"></span><button type="button" class="ix-trigger">${ko?(drag?'드래그 / 방향키':track?'움직여 보세요':kind==='press-hold'?'길게 누르기':click?'클릭 / 탭':'호버 / 초점'):drag?'Drag / arrow keys':track?'Move pointer':kind==='press-hold'?'Press and hold':click?'Click / tap':'Hover / focus'}</button><input class="ix-range" type="range" min="0" max="100" value="50" aria-label="${ko?'전후 비교 비율':'Before and after split'}"${kind==='drag-compare'?'':' hidden'}><output class="ix-readout" aria-live="off">${ko?'직접 조작해 보세요':'Try the interaction'}</output></div>`;
}
function mountDOM(root,kind,language='ko',options={}){
 if(window.AtlasFoundations?.supports(kind))return window.AtlasFoundations.mount(root,kind,language,options);
 if(window.AtlasPatterns?.supports(kind))return window.AtlasPatterns.mount(root,kind,language,options);
 if(window.AtlasStudies?.supports(kind))return window.AtlasStudies.mount(root,kind,language,options);
 if(window.AtlasAdvanced?.supports(kind))return window.AtlasAdvanced.mount(root,kind,language,options);
 kind=({'press-long':'press-hold','drag-swipe-dismiss':'drag-dismiss','click-radial-legacy':'click-radial','drag-elasticity':'drag-elastic'})[kind]||kind;
 const ko=language==='ko',abort=new AbortController(),signal=abort.signal;
 const object=root.querySelector('.ix-object'),out=root.querySelector('.ix-readout'),button=root.querySelector('.ix-trigger'),follower=root.querySelector('.ix-follower');
 let alive=true,down=false,moved=false,on=false,raf=0,hold=0,startX=0,startY=0,dx=0,dy=0,px=0,py=0,fx=0,fy=0,vx=0,vy=0,previousX=0,previousY=0,last=0,count=128,doubleAt=0,order=2;
 const timers=new Set(),animations=new Set();
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||options.paused?.()===true;
 const listen=(target,name,fn,opt={})=>target.addEventListener(name,fn,{...opt,signal});
 const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(alive)fn();},ms);timers.add(id);return id;};
 const say=s=>{out.textContent=s;};
 if(['drag-reorder','drag-pull-refresh','drag-swipe-actions'].includes(kind)){object.style.touchAction='none';root.style.touchAction='pan-y';}
 if(kind==='drag-reorder'){root.querySelector('.ix-head').textContent='ITEM 2 / 3';say(ko?'위·아래로 드래그하여 순서를 바꾸세요.':'Drag up or down to reorder.');}
 if(kind==='drag-pull-refresh')root.querySelector('.ix-head').textContent='REFRESH';
 if(kind==='drag-swipe-actions'){root.querySelector('.ix-head').textContent='SWIPE ←';const action=document.createElement('span');action.textContent=ko?'보관':'Archive';action.setAttribute('aria-hidden','true');action.style.cssText='position:absolute;right:18px;top:50%;transform:translateY(-50%);padding:10px;border-radius:8px;background:#243a65;color:#fff;font:700 14px system-ui';root.append(action);}
 if(kind==='click-double')root.querySelector('.ix-head').textContent='DOUBLE TAP';
 if(kind==='click-toast'){
  root.querySelector('.ix-head').textContent='NOTIFY';
  const toast=document.createElement('div');toast.className='ix-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.hidden=true;root.append(toast);
}
 if(kind==='drag-reorder')out.setAttribute('aria-live','polite');
 if(kind==='click-radial'){
   const actions=root.querySelector('.ix-orbit-actions');
   actions.setAttribute('aria-hidden','false');actions.replaceChildren();
   for(const [idx,label] of (ko?['추가','공유','즐겨찾기']:['Add','Share','Favorite']).entries()){
    const a=document.createElement('button');a.type='button';a.className='ix-radial-action';a.textContent=['＋','↗','★'][idx];a.setAttribute('aria-label',label);a.disabled=true;a.tabIndex=-1;actions.append(a);
    listen(a,'click',()=>{say((ko?'작업 선택: ':'Selected action: ')+label);});
   }
  }
 const animate=(el,frames,opts)=>{if(reduced())return null;const a=el.animate(frames,opts);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;};
 function active(value){root.classList.toggle('is-active',value);if(!value){root.style.setProperty('--mx','0px');root.style.setProperty('--my','0px');}}
 function move(x,y){
  const b=root.getBoundingClientRect();px=clamp(x,0,b.width);py=clamp(y,0,b.height);
  root.style.setProperty('--px',px+'px');root.style.setProperty('--py',py+'px');root.style.setProperty('--xp',px/b.width*100+'%');root.style.setProperty('--yp',py/b.height*100+'%');
  const mx=(px-b.width/2),my=(py-b.height/2);root.style.setProperty('--mx',mx*.13+'px');root.style.setProperty('--my',my*.13+'px');root.style.setProperty('--hue',String(210+px/b.width*110));
  if(kind==='track-spring'){
   if(!raf){last=performance.now();const tick=now=>{if(!alive)return;const dt=Math.min(2,(now-last)/16.67);last=now;vx=(vx+(px-fx)*.09*dt)*.73;vy=(vy+(py-fy)*.09*dt)*.73;fx+=vx*dt;fy+=vy*dt;follower.style.transform=`translate(${fx}px,${fy}px)`;if(Math.hypot(px-fx,py-fy)>.4&&!reduced())raf=requestAnimationFrame(tick);else raf=0;};raf=requestAnimationFrame(tick);}
  }else if(kind==='track-stretch'){
   const sx=px-previousX,sy=py-previousY,speed=Math.min(2.5,1+Math.hypot(sx,sy)/18),angle=Math.atan2(sy,sx)*180/Math.PI;
   follower.style.transform=`translate(${px}px,${py}px) rotate(${angle}deg) scale(${reduced()?1:speed},${reduced()?1:1/Math.sqrt(speed)})`;
  }else follower.style.transform=`translate(${px}px,${py}px)`;
  if(kind==='track-trail'&&!reduced()){
   const tray=root.querySelector('.ix-trail');if(tray.children.length<24){const dot=document.createElement('i');dot.style.left=px+'px';dot.style.top=py+'px';tray.append(dot);animate(dot,[{opacity:.8,transform:'scale(1)'},{opacity:0,transform:'scale(.15)'}],{duration:650,fill:'forwards'});later(()=>dot.remove(),680);}
  }
  if(kind==='track-proximity')root.querySelectorAll('[data-tile]').forEach(tile=>{const t=tile.getBoundingClientRect(),dist=Math.hypot(b.left+px-t.left-t.width/2,b.top+py-t.top-t.height/2);tile.style.opacity=String(clamp(1-dist/230,.18,1));tile.style.transform=`scale(${1+Math.max(0,1-dist/110)*.12})`;});
  if(kind==='track-reticle')say(`${Math.round(px)} , ${Math.round(py)}`);
  previousX=px;previousY=py;
 }
 function burst(mode,x,y){
  if(reduced()){root.classList.toggle('is-checked');say(ko?'입력이 확인되었습니다.':'Input acknowledged.');return;}
  const n=mode==='rings'?3:mode==='ripple'?1:mode==='confetti'?18:14;
  for(let i=0;i<n;i++){
   const p=document.createElement('i');p.className='ix-particle '+mode;p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--c',`hsl(${180+i*19} 85% 68%)`);root.append(p);
   const a=i/n*Math.PI*2,dist=45+(i%5)*15,xx=Math.cos(a)*dist,yy=Math.sin(a)*dist;
   const frames=mode==='ripple'||mode==='rings'?[{transform:'translate(-50%,-50%) scale(0)',opacity:.75},{transform:'translate(-50%,-50%) scale(12)',opacity:0}]:mode==='confetti'?[{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${xx}px,${-70-Math.abs(yy)}px) rotate(120deg)`,opacity:1,offset:.45},{transform:`translate(${xx*1.2}px,100px) rotate(260deg)`,opacity:0}]:[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${xx}px,${yy}px) scale(.1)`,opacity:0}];
   animate(p,frames,{duration:mode==='confetti'?1100:700,delay:mode==='rings'?i*100:0,easing:'cubic-bezier(.16,.7,.3,1)',fill:'forwards'});later(()=>p.remove(),1450);
  }
 }
 function act(event){
  if(moved){moved=false;return;}
  const b=root.getBoundingClientRect(),x=event?.clientX?event.clientX-b.left:b.width/2,y=event?.clientY?event.clientY-b.top:b.height/2;
  if(kind.startsWith('hover-')){active(!root.classList.contains('is-active'));return;}
  if(kind.startsWith('track-')){move(b.width*.73,b.height*.34);active(true);return;}
  if(kind.startsWith('drag-')){if(kind==='drag-dismiss'){object.style.transform='';object.style.opacity='1';say(ko?'카드를 복원했습니다.':'Card restored.');}if(kind==='drag-swipe-actions'){dx=0;object.style.transform='';say(ko?'보조 액션을 닫았습니다.':'Action closed.');}if(kind==='drag-pull-refresh'){say(ko?'아래로 당겨 새로고침':'Pull down to refresh');}return;}
  if(kind==='press-hold')return;
  if(kind==='click-double'){
   const now=performance.now();if(doubleAt && now-doubleAt<420){doubleAt=0;root.classList.toggle('is-checked');say(ko?'더블 탭이 인식되었습니다.':'Double tap recognized.');animate(object,[{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:300});}
   else{doubleAt=now;say(ko?'한 번 더 탭하세요. 키보드는 Enter 두 번.':'Tap again. Keyboard: Enter twice.');}
   return;
  }
  if(kind==='click-toast'){
   root.classList.add('is-checked');
   const toast=root.querySelector('.ix-toast');toast.textContent=ko?'변경사항이 저장되었습니다.':'Your changes were saved.';toast.hidden=false;
   say(ko?'토스트 알림이 표시되었습니다.':'Toast notification displayed.');
   later(()=>{root.classList.remove('is-checked');toast.hidden=true;say(ko?'알림이 닫혔습니다.':'Toast dismissed.');},2400);return;
  }
  if(kind==='click-ripple'||kind==='click-rings'||kind==='click-burst'||kind==='click-confetti'){burst(kind.slice(6),x,y);say(ko?'클릭 위치에서 시작':'Origin: clicked position');return;}
  on=!on;root.classList.toggle('is-on',on);button.setAttribute('aria-pressed',String(on));
  if(kind==='click-morph'){root.querySelector('.ix-head').textContent=on?'×':'＋';say(on?(ko?'닫기 상태':'Close state'):(ko?'열기 상태':'Open state'));}
  if(kind==='click-like'){root.querySelector('.ix-head').textContent=on?'♥':'♡';count=on?129:128;say(count+' '+(ko?'좋아요':'likes'));animate(object,[{transform:'scale(1)'},{transform:'scale(1.13)'},{transform:'scale(1)'}],{duration:360});}
  if(kind==='click-toggle'){say(on?'ON':'OFF');button.textContent=on?(ko?'끄기':'Turn off'):(ko?'켜기':'Turn on');}
  if(kind==='click-check'){say(on?(ko?'완료되었습니다.':'Completed.'):(ko?'초기화되었습니다.':'Reset.'));root.classList.toggle('is-checked',on);}
  if(kind==='click-press'){animate(object,[{transform:'translateY(0)',boxShadow:'0 12px 0 #07152e'},{transform:'translateY(9px)',boxShadow:'0 3px 0 #07152e'},{transform:'translateY(0)',boxShadow:'0 12px 0 #07152e'}],{duration:300});say(ko?'입력이 확인되었습니다.':'Input acknowledged.');}
  if(kind==='click-shake'){animate(object,[{transform:'translateX(0)'},{transform:'translateX(-9px)'},{transform:'translateX(9px)'},{transform:'translateX(-6px)'},{transform:'translateX(0)'}],{duration:350});say(ko?'오류 예시: 값을 확인하세요.':'Example error: check the value.');}
  if(kind==='click-counter'){const a=count,z=count+64,t=performance.now();count=z;const tick=now=>{if(!alive)return;const v=reduced()?1:Math.min(1,(now-t)/650);root.querySelector('.ix-head').textContent=String(Math.round(a+(z-a)*(1-Math.pow(1-v,3))));if(v<1)raf=requestAnimationFrame(tick);else raf=0;};if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);say(ko?'가상 값 +64':'Synthetic value +64');}
  if(kind==='click-accordion'){button.setAttribute('aria-expanded',String(on));say(on?(ko?'펼침':'Expanded'):(ko?'접힘':'Collapsed'));}
  if(kind==='click-radial'){
   button.setAttribute('aria-expanded',String(on));root.querySelectorAll('.ix-radial-action').forEach(a=>{a.tabIndex=on?0:-1;a.disabled=!on;});
   say(on?(ko?'액션을 펼쳤습니다.':'Actions expanded.'):(ko?'메뉴를 접었습니다.':'Menu collapsed.'));
  }
  if(kind==='click-loading'){if(button.disabled)return;button.disabled=true;button.setAttribute('aria-busy','true');button.textContent=ko?'처리 중…':'Working…';root.classList.add('is-busy');say(ko?'로컬 시연 · 서버 요청 없음':'Local simulation · no server request');later(()=>{button.disabled=false;button.setAttribute('aria-busy','false');button.textContent=ko?'완료 · 다시 시연':'Done · repeat';root.classList.remove('is-busy');root.classList.add('is-checked');},1100);}
 }
 function endDrag(){
  if(!down)return;down=false;
  if(kind==='press-hold'){cancelAnimationFrame(hold);hold=0;root.style.setProperty('--hold','0%');if(!on)say(ko?'취소되었습니다.':'Cancelled.');return;}
  object.style.transition=reduced()?'none':'transform .5s cubic-bezier(.2,1.5,.35,1), opacity .25s';
  if(kind==='drag-reorder'){
   if(Math.abs(dy)>20){order=clamp(order+(dy>0?1:-1),1,3);root.querySelector('.ix-head').textContent='ITEM '+order+' / 3';say((ko?'목록 위치: ':'List position: ')+order+' / 3');}
   dx=dy=0;object.style.transform='';
  }
  else if(kind==='drag-pull-refresh'){
   const triggered=dy>55;dx=dy=0;object.style.transform='';
   if(triggered){say(ko?'새로고침 완료 · 서버 요청 없음':'Refreshed locally · no server request');root.classList.add('is-checked');later(()=>root.classList.remove('is-checked'),1100);}
   else say(ko?'조금 더 아래로 당겨 주세요.':'Pull further down.');
  }
  else if(kind==='drag-swipe-actions'){
   const revealed=dx< -52;dx=revealed?-74:0;dy=0;object.style.transform=`translateX(${dx}px)`;say(revealed?(ko?'보조 액션 표시 · 버튼으로 닫기':'Action revealed · button closes'):(ko?'닫혔습니다.':'Closed.'));
  }
  else if(kind==='drag-elastic'){dx=dy=0;object.style.transform='translate(0,0)';}
  else if(kind==='drag-snap'){dx=Math.round(dx/30)*30;dy=Math.round(dy/30)*30;object.style.transform=`translate(${dx}px,${dy}px)`;say(`${dx}, ${dy} · SNAP`);}
  else if(kind==='drag-dismiss'){if(Math.abs(dx)>65){object.style.transform=`translateX(${Math.sign(dx)*320}px)`;object.style.opacity='0';say(ko?'제거됨 · 버튼으로 복원':'Dismissed · press button to restore');}else{object.style.transform='';say(ko?'복귀했습니다.':'Returned.');}dx=dy=0;}
 }
 listen(root,'pointerenter',()=>active(true));listen(root,'pointerleave',()=>{if(!down)active(false);});
 listen(root,'focusin',()=>active(true));listen(root,'focusout',e=>{if(!root.contains(e.relatedTarget))active(false);});
 listen(root,'pointermove',e=>{
  const b=root.getBoundingClientRect();if(!reduced()||kind==='track-reticle')move(e.clientX-b.left,e.clientY-b.top);
  if(!down||!kind.startsWith('drag-')||kind==='drag-compare')return;
  const nx=e.clientX-startX,ny=e.clientY-startY;if(Math.hypot(nx,ny)>5)moved=true;
  dx=clamp(nx,-b.width*.28,b.width*.28);dy=clamp(ny,-50,45);if(kind==='drag-dismiss'||kind==='drag-swipe-actions')dy=0;if(kind==='drag-pull-refresh'){dx=0;dy=clamp(ny,0,100);}if(kind==='drag-reorder'){dx=0;dy=clamp(ny,-70,70);}
  object.style.transition='none';object.style.transform=`translate(${dx}px,${dy}px)`;say(`${Math.round(dx)}, ${Math.round(dy)}`);
 });
 listen(root,'pointerdown',e=>{
  if(e.target.closest('input'))return;
  if(kind==='press-hold'){
   down=true;on=false;const start=performance.now();root.setPointerCapture?.(e.pointerId);const tick=now=>{if(!down||!alive)return;const v=Math.min(1,(now-start)/1000);root.style.setProperty('--hold',v*100+'%');say(Math.round(v*100)+'%');if(v<1)hold=requestAnimationFrame(tick);else{on=true;root.classList.add('is-checked');say(ko?'확인되었습니다.':'Confirmed.');}};hold=requestAnimationFrame(tick);return;
  }
  if(!kind.startsWith('drag-')||kind==='drag-compare'||e.target===button)return;
  down=true;moved=false;startX=e.clientX-dx;startY=e.clientY-dy;root.setPointerCapture?.(e.pointerId);
 });
 listen(root,'pointerup',endDrag);listen(root,'pointercancel',endDrag);
 listen(button,'click',act);
 listen(root,'click',e=>{if(e.target.closest('button,input'))return;act(e);});
 listen(root,'keydown',e=>{
  if(e.target.closest('input'))return;
  if(e.key.startsWith('Arrow')){e.preventDefault();const b=root.getBoundingClientRect(),x=px||b.width/2,y=py||b.height/2;move(x+(e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0),y+(e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0));if(kind.startsWith('drag-')){dx=clamp(dx+(e.key==='ArrowRight'?30:e.key==='ArrowLeft'?-30:0),-80,80);dy=clamp(dy+(e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0),-45,45);object.style.transform=`translate(${dx}px,${dy}px)`;}return;}
  if(kind==='press-hold'&&(e.key===' '||e.key==='Enter')){e.preventDefault();if(!e.repeat&&!down){down=true;const start=performance.now();const tick=now=>{if(!down||!alive)return;const v=Math.min(1,(now-start)/1000);root.style.setProperty('--hold',v*100+'%');say(Math.round(v*100)+'%');if(v<1)hold=requestAnimationFrame(tick);else{on=true;say(ko?'확인되었습니다.':'Confirmed.');root.classList.add('is-checked');}};hold=requestAnimationFrame(tick);}return;}
  if(e.target===root&&(e.key==='Enter'||e.key===' ')){e.preventDefault();act();}
 });
 listen(root,'keyup',e=>{if(kind==='press-hold'&&(e.key===' '||e.key==='Enter'))endDrag();});
 const range=root.querySelector('.ix-range');listen(range,'input',()=>{root.style.setProperty('--split',range.value+'%');say(range.value+'%');});
 if(kind==='click-like')root.querySelector('.ix-head').textContent='♡';
 if(kind==='click-counter')root.querySelector('.ix-head').textContent=String(count);
 move(root.clientWidth/2,root.clientHeight/2);
 return {kind,dispose(){alive=false;abort.abort();cancelAnimationFrame(raf);cancelAnimationFrame(hold);for(const id of timers)clearTimeout(id);for(const a of animations)a.cancel();},activate:act};
}
function buildScene(THREE,kind){
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.6,6);camera.lookAt(0,0,0);
 scene.background=new THREE.Color('#101b32');scene.add(new THREE.HemisphereLight(0xcce8ff,0x24304d,2.2));
 const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,4,5);scene.add(key);
 const point=new THREE.PointLight(0x91e5ff,12,14);point.position.set(-2,1,3);scene.add(point);
 const group=new THREE.Group();scene.add(group);
 const mat=(color=0x87b8ff,opts={})=>new THREE.MeshStandardMaterial({color,roughness:.3,metalness:.22,...opts});
 const add=(geo,m,parent=group)=>{const mesh=new THREE.Mesh(geo,m);parent.add(mesh);return mesh;};
 const box=(w,h,d,m)=>add(new THREE.BoxGeometry(w,h,d),m);
 let main,base,parts=[],points,grid,morphBase;
 if(['three-tilt','three-flip','three-holo','three-glass','three-stack','three-float'].includes(kind)){
  const materials=Array.from({length:6},(_,i)=>mat(i===4?0x78aaff:i===5?0xf0a0d8:0xc4dbff));
  main=box(2.45,1.5,.14,materials);
  for(let i=0;i<3;i++){const stripe=add(new THREE.BoxGeometry(i?1.1:.5,.08,.025),mat(i?0xe7f4ff:0x132c55));stripe.position.set(i?-.35:-.65,.43-i*.29,.09);}
  const disc=add(new THREE.CircleGeometry(.19,32),mat(0xd1faff));disc.position.set(.75,.38,.091);
  if(kind==='three-holo')main.material=new THREE.MeshPhysicalMaterial({color:0x8ad5ff,metalness:.75,roughness:.13,iridescence:1,iridescenceIOR:1.4,iridescenceThicknessRange:[100,400],clearcoat:1});
  if(kind==='three-glass'){main.material=new THREE.MeshPhysicalMaterial({color:0xcdeeff,roughness:.08,transmission:.85,thickness:.55,ior:1.4,transparent:true,opacity:.95});const object=add(new THREE.TorusKnotGeometry(.48,.17,100,12),mat(0xf5b36d));object.position.set(.45,-.1,-.7);}
  if(kind==='three-stack'){for(let i=1;i<=3;i++){const layer=box(2.45,1.5,.07,mat([0,0x7467cb,0x4ac4bc,0xd9a4e1][i]));layer.position.set(i*.16,i*-.12,-i*.4);parts.push(layer);}}
 }else if(kind==='three-pick'){
  for(let i=0;i<5;i++){const geo=i%2?new THREE.IcosahedronGeometry(.43,0):new THREE.TorusGeometry(.34,.12,12,32);const o=add(geo,mat(0x829dff));o.position.set((i%3-1)*1.05,i<3?.4:-.65,0);parts.push(o);}main=parts[0];
 }else if(kind==='three-explode'){
  for(let i=0;i<5;i++){const o=box(1.6-i*.1,.17,1.1,mat([0x86c8ff,0x9f91ee,0x5de0bf,0xe7bd82,0xbac9f2][i]));o.position.y=(i-2)*.2;parts.push(o);}main=parts[0];group.rotation.set(.4,.45,0);
 }else if(kind==='three-ripple'){
  main=add(new THREE.PlaneGeometry(3.3,2.5,36,28),mat(0x62c3e1,{wireframe:true,side:THREE.DoubleSide}));main.rotation.x=-.65;base=main.geometry.attributes.position.array.slice();
 }else if(kind==='three-particles'){
  const pos=new Float32Array(450*3);for(let i=0;i<450;i++){const a=i*2.399963,r=Math.sqrt(i/450)*1.7;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r;pos[i*3+2]=Math.sin(i*.17)*.4;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));base=pos.slice();points=new THREE.Points(geo,new THREE.PointsMaterial({color:0xb9f6ff,size:.055,sizeAttenuation:true}));group.add(points);main=points;
 }else if(kind==='three-instance'){
  grid=new THREE.InstancedMesh(new THREE.BoxGeometry(.19,.6,.19),mat(0x93b7ff),121);group.add(grid);main=grid;group.rotation.set(.5,.4,0);
 }else{
  const isBox=['three-vertex','three-edge','three-face','three-translate','three-rotate','three-scale'].includes(kind);
  const geometry=isBox?new THREE.BoxGeometry(1.5,1.5,1.5):kind==='three-orbit'?new THREE.TorusKnotGeometry(.72,.24,100,16):new THREE.IcosahedronGeometry(1,kind==='three-morph'?4:1);
  main=add(geometry,kind==='three-toon'?new THREE.MeshToonMaterial({color:0x8ea3ff}):kind==='three-face'?Array.from({length:6},(_,i)=>mat(i===4?0xffb172:0x6684bb)):mat(0x8caeff));
  if(kind==='three-wire'||kind==='three-edge'){const lines=new THREE.LineSegments(kind==='three-edge'?new THREE.EdgesGeometry(geometry):new THREE.WireframeGeometry(geometry),new THREE.LineBasicMaterial({color:0xbaffeb}));main.add(lines);if(kind==='three-edge'){main.material.transparent=true;main.material.opacity=.12;}}
  if(kind==='three-vertex'){main.material.transparent=true;main.material.opacity=.12;const dots=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xb6ffe8,size:.13}));main.add(dots);}
  if(kind==='three-normal'){const p=geometry.attributes.position,n=geometry.attributes.normal,arr=[];for(let i=0;i<p.count;i+=3){arr.push(p.getX(i),p.getY(i),p.getZ(i),p.getX(i)+n.getX(i)*.35,p.getY(i)+n.getY(i)*.35,p.getZ(i)+n.getZ(i)*.35);}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));main.add(new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:0xbbffbc})));}
  if(['three-translate','three-rotate','three-scale'].includes(kind)){group.add(new THREE.AxesHelper(2));if(kind==='three-rotate')for(let i=0;i<3;i++){const ring=add(new THREE.TorusGeometry(1.4,.018,6,60),new THREE.MeshBasicMaterial({color:[0xff8f9e,0x93e5b5,0x8cbbff][i]}));if(i===1)ring.rotation.x=Math.PI/2;if(i===2)ring.rotation.y=Math.PI/2;}if(kind==='three-scale')for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){const h=add(new THREE.BoxGeometry(.13,.13,.13),mat(0xbaffdf));h.position.set(x*.9,y*.9,z*.9);}}
  if(kind==='three-morph')morphBase=geometry.attributes.position.array.slice();
 }
 const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),dummy=new THREE.Object3D();
 function draw(state,time){
  const x=state.x,y=state.y,t=time||0;
  if(!['three-ripple','three-instance','three-explode','three-orbit','three-translate','three-scale','three-light'].includes(kind))group.rotation.set(-y*.28,x*.48,0);
  if(kind==='three-flip')group.rotation.y+=state.toggled?Math.PI:0;
  if(kind==='three-float')group.position.y=Math.sin(t*1.6)*.16;
  if(kind==='three-holo'&&main.material.color)main.material.color.setHSL((.57+x*.12+t*.025)%1,.62,.64);
  if(kind==='three-light')point.position.set(x*3,y*2,2.5);
  if(kind==='three-orbit'){const a=state.orbitX||x*.8,e=state.orbitY||.25;camera.position.set(Math.sin(a)*5.3,Math.sin(e)*3,Math.cos(a)*5.3);camera.lookAt(0,0,0);}
  if(kind==='three-translate')group.position.set(x*.8,y*.6,0);
  if(kind==='three-scale'){group.scale.setScalar(.68+(x+1)*.22);group.position.y=.16;}
  if(kind==='three-explode')parts.forEach((o,i)=>o.position.y=(i-2)*(state.toggled?.6:.2));
  if(kind==='three-ripple'){const p=main.geometry.attributes.position;for(let i=0;i<p.count;i++){const xx=base[i*3],yy=base[i*3+1],d=Math.hypot(xx-x,yy-y);p.setZ(i,Math.sin(d*5-t*3)*.14*Math.exp(-d*.4));}p.needsUpdate=true;}
  if(points){const p=points.geometry.attributes.position;for(let i=0;i<p.count;i++){const xx=base[i*3],yy=base[i*3+1],d=Math.max(.3,Math.hypot(xx-x,yy-y));p.setXYZ(i,xx+(xx-x)*.13/d,yy+(yy-y)*.13/d,base[i*3+2]+Math.sin(t+i*.07)*.08);}p.needsUpdate=true;}
  if(grid){for(let i=0;i<121;i++){const xx=i%11-5,yy=Math.floor(i/11)-5,s=.65+Math.sin(Math.hypot(xx,yy)*.6-t*2)*.4;dummy.position.set(xx*.24,s*.3,yy*.24);dummy.scale.set(1,s,1);dummy.updateMatrix();grid.setMatrixAt(i,dummy.matrix);}grid.instanceMatrix.needsUpdate=true;}
  if(morphBase){const p=main.geometry.attributes.position,k=(x+1)/2;for(let i=0;i<p.count;i++){const a=morphBase[i*3],b=morphBase[i*3+1],c=morphBase[i*3+2],m=Math.max(Math.abs(a),Math.abs(b),Math.abs(c));p.setXYZ(i,a*(1-k)+(a/m)*k,b*(1-k)+(b/m)*k,c*(1-k)+(c/m)*k);}p.needsUpdate=true;main.geometry.computeVertexNormals();}
  if(kind==='three-pick'){ndc.set(x,y);scene.updateMatrixWorld();ray.setFromCamera(ndc,camera);const hit=ray.intersectObjects(parts,false)[0]?.object;parts.forEach(o=>{o.material.emissive.set(o===hit?0x387e89:0x000000);o.scale.setScalar(o===hit?1.12:1);});return hit?parts.indexOf(hit)+1:0;}
  return null;
 }
 function dispose(){const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
 return {scene,camera,draw,dispose};
}
function createThreePool(THREE){
 // One genuine WebGL renderer shared by all visible card scenes. Each result is
 // copied immediately to a 2D canvas; there is no per-card WebGL context.
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 const records=new Set();let active=null,raf=0,disposed=false;
 function render(rec,time=0){
  if(!rec.root.isConnected)return;
  const w=Math.max(1,Math.round(rec.root.clientWidth)),h=Math.max(1,Math.round(rec.root.clientHeight)),dpr=Math.min(devicePixelRatio||1,1.5);
  const pw=Math.round(w*dpr),ph=Math.round(h*dpr);if(rec.canvas.width!==pw||rec.canvas.height!==ph){rec.canvas.width=pw;rec.canvas.height=ph;}
  renderer.setSize(pw,ph,false);rec.scene.camera.aspect=w/h;rec.scene.camera.updateProjectionMatrix();const picked=rec.scene.draw(rec.state,time);
  renderer.render(rec.scene.scene,rec.scene.camera);rec.context.drawImage(renderer.domElement,0,0,pw,ph);rec.root.dataset.rendered='true';rec.root.dataset.engine='three-webgl';if(picked!==null)rec.out.textContent=picked?`OBJECT ${picked}`:(rec.lang==='ko'?'오브젝트를 가리키세요':'Point at an object');
 }
 function start(rec){active=rec;if(raf)return;const tick=now=>{raf=0;if(disposed||!active||!active.root.isConnected||document.hidden)return;const r=active;render(r,r.reduced()?0:now/1000);if(!r.reduced())raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}
 function stop(rec){if(active===rec){active=null;cancelAnimationFrame(raf);raf=0;}}
 function mount(root,kind,language='ko',options={}){
  const abort=new AbortController(),signal=abort.signal,canvas=document.createElement('canvas');canvas.className='ix-three-canvas';canvas.setAttribute('aria-hidden','true');
  const out=document.createElement('output');out.className='ix-three-readout';out.textContent=language==='ko'?'드래그 · 방향키 · Enter':'Drag · arrow keys · Enter';
  root.replaceChildren(canvas,out);root.tabIndex=0;root.setAttribute('role','group');root.setAttribute('aria-label',language==='ko'?'실제 3D 조작 예제':'Interactive real 3D example');
  const rec={root,canvas,out,context:canvas.getContext('2d'),scene:buildScene(THREE,kind),state:{x:.18,y:-.15,toggled:false,orbitX:.4,orbitY:.25},lang:language,reduced:()=>matchMedia('(prefers-reduced-motion: reduce)').matches||options.paused?.()===true};
  records.add(rec);let down=false,sx=0,sy=0,moved=false;
  const on=(name,fn)=>root.addEventListener(name,fn,{signal});
  on('pointerenter',()=>start(rec));on('pointerleave',()=>{if(!down)stop(rec);});on('focus',()=>{render(rec);});on('blur',()=>stop(rec));
  on('pointerdown',e=>{down=true;moved=false;sx=e.clientX;sy=e.clientY;root.setPointerCapture?.(e.pointerId);start(rec);});
  on('pointermove',e=>{const b=root.getBoundingClientRect();rec.state.x=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1));rec.state.y=Math.max(-1,Math.min(1,1-(e.clientY-b.top)/b.height*2));if(down){const dx=e.clientX-sx,dy=e.clientY-sy;rec.state.orbitX+=dx*.012;rec.state.orbitY=Math.max(-1,Math.min(1,rec.state.orbitY+dy*.008));if(Math.hypot(dx,dy)>2)moved=true;sx=e.clientX;sy=e.clientY;}render(rec);});
  on('pointerup',()=>{down=false;stop(rec);});on('pointercancel',()=>{down=false;stop(rec);});
  on('click',()=>{if(moved)return;rec.state.toggled=!rec.state.toggled;render(rec);});
  on('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();if(e.key==='Enter'||e.key===' ')rec.state.toggled=!rec.state.toggled;else{rec.state.x=Math.max(-1,Math.min(1,rec.state.x+(e.key==='ArrowRight'?.15:e.key==='ArrowLeft'?-.15:0)));rec.state.y=Math.max(-1,Math.min(1,rec.state.y+(e.key==='ArrowUp'?.15:e.key==='ArrowDown'?-.15:0)));rec.state.orbitX+=e.key==='ArrowRight'?.18:e.key==='ArrowLeft'?-.18:0;}render(rec);}});
  const resize=new ResizeObserver(()=>render(rec));resize.observe(root);render(rec);
  return {kind,dispose(){stop(rec);resize.disconnect();abort.abort();rec.scene.dispose();records.delete(rec);},render:()=>render(rec)};
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)stop(active);});
 return {mount,stats:()=>({contexts:1,scenes:records.size,active:!!active}),dispose(){disposed=true;cancelAnimationFrame(raf);records.forEach(r=>r.scene.dispose());records.clear();renderer.dispose();renderer.forceContextLoss();}};
}
let pool;
async function mount(root,recipe,language='ko',options={}){
 if(mounted.has(root))return mounted.get(root);
 let record;
 if(recipe.engine==='three'){
  root.innerHTML=`<p class="ix-three-loading">${language==='ko'?'3D 불러오는 중…':'Loading 3D…'}</p>`;
  try{threePromise??=import(THREE_URL);const THREE=await threePromise;if(!root.isConnected)return null;pool??=createThreePool(THREE);record=pool.mount(root,recipe.key,language,options);}
  catch(error){root.dataset.engine='unavailable';root.innerHTML=`<div class="ix-three-unavailable"><b>${language==='ko'?'3D를 실행할 수 없습니다':'3D is unavailable'}</b><p>${language==='ko'?'WebGL 또는 라이브러리 연결을 확인하세요. 코드 복사는 사용할 수 있습니다.':'Check WebGL support and the library connection. Code copying remains available.'}</p><button type="button">${language==='ko'?'다시 시도':'Retry'}</button></div>`;root.querySelector('button').onclick=()=>{threePromise=null;void mount(root,recipe,language,options);};return null;}
 }else{root.innerHTML=markup(recipe.key,language);record=mountDOM(root.firstElementChild,recipe.key,language,options);}
 mounted.set(root,record);return record;
}
function cleanup(){for(const [root,rec] of mounted)if(!root.isConnected){rec.dispose();mounted.delete(root);}}
function code(recipe,language='ko',css=''){
 const name=escape(recipe.title||recipe.en||recipe.key),ko=language==='ko';
 const header='<!doctype html>\n<html lang="'+language+'">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+name+' — ATLAS example</title>\n<style>html{font-size:16px}body{margin:0;padding:24px;background:#edf1f8;font-family:system-ui,sans-serif;font-size:16px}main{max-width:640px;margin:auto}h1{font-size:24px}p{font-size:16px;line-height:1.7}.ix-demo{height:340px;border-radius:20px;overflow:hidden}button,input{font:inherit}\n'+css+'\n</style></head><body><main><h1>'+name+'</h1><p>'+(ko?'포인터·터치 또는 키보드로 조작하세요. 실제 개인정보나 서버 요청을 사용하지 않는 독립 실행 예제입니다.':'Use pointer, touch or keyboard input. This is a standalone demonstration without analytics or server requests.')+'</p><div id="demo" class="ix-demo"></div></main>\n';
 if(recipe.engine==='dom'&&global.AtlasFoundations?.supports(recipe.key))return header+'<script>\n'+global.AtlasFoundations.source+'\nconst root=document.getElementById("demo");root.innerHTML=AtlasFoundations.markup('+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');const example=AtlasFoundations.mount(root.firstElementChild,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');window.addEventListener("pagehide",()=>example.dispose(),{once:true});\n</'+'script></body></html>';
 if(recipe.engine==='dom'&&global.AtlasPatterns?.supports(recipe.key))return header+'<script>\n'+global.AtlasPatterns.source+'\nconst root=document.getElementById("demo");root.innerHTML=AtlasPatterns.markup('+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');const example=AtlasPatterns.mount(root.firstElementChild,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');window.addEventListener("pagehide",()=>example.dispose(),{once:true});\n</'+'script></body></html>';
 if(recipe.engine==='dom'&&global.AtlasStudies?.supports(recipe.key))return header+'<script>\n'+global.AtlasStudies.source+'\nconst root=document.getElementById("demo");root.innerHTML=AtlasStudies.markup('+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');const example=AtlasStudies.mount(root.firstElementChild,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');window.addEventListener("pagehide",()=>example.dispose(),{once:true});\n</'+'script></body></html>';
 if(recipe.engine==='dom'&&global.AtlasAdvanced?.supports(recipe.key))return header+'<script>\n'+global.AtlasAdvanced.source+'\nconst root=document.getElementById("demo");root.innerHTML=AtlasAdvanced.markup('+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');const example=AtlasAdvanced.mount(root.firstElementChild,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');window.addEventListener("pagehide",()=>example.dispose(),{once:true});\n</'+'script></body></html>';
 if(recipe.engine==='three')return header+'<!-- Dependency: Three.js '+THREE_VERSION+' (MIT). Serve via HTTP(S), e.g. python -m http.server. CDN connection required. -->\n<script type="module">\nimport * as THREE from "https://cdn.jsdelivr.net/npm/three@'+THREE_VERSION+'/build/three.module.min.js";\n'+buildScene.toString()+'\n'+createThreePool.toString()+'\nconst root=document.getElementById("demo");const pool=createThreePool(THREE);const example=pool.mount(root,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');\nwindow.addEventListener("pagehide",()=>{example.dispose();pool.dispose();},{once:true});\n</'+'script></body></html>';
 return header+'<script>\n'+markup.toString()+'\n'+mountDOM.toString()+'\nconst root=document.getElementById("demo");root.innerHTML=markup('+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');\nconst example=mountDOM(root.firstElementChild,'+JSON.stringify(recipe.key)+','+JSON.stringify(language)+');window.addEventListener("pagehide",()=>example.dispose(),{once:true});\n</'+'script></body></html>';
}
global.AtlasKit={VERSION,THREE_VERSION,mount,cleanup,code,markup,mountDOM,buildScene,createThreePool,stats:()=>({mounted:mounted.size,...(pool?.stats()||{contexts:0,scenes:0,active:false})})};
})(window);
