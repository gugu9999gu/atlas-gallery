/* ATLAS Motion Graphics — original runnable CSS/SVG studies.
 * The same renderer is used by gallery cards and copied standalone HTML.
 * No third-party screenshots, tracking or external runtime dependencies.
 */
(function initMotionGraphics(global){
'use strict';
const KEYS=new Set([
 'mg-kinetic','mg-character','mg-text-reveal','mg-typewriter','mg-logo-reveal','mg-lower-third',
 'mg-trim-paths','mg-shape-morph','mg-mask-reveal','mg-alpha-matte','mg-luma-matte','mg-layer-parallax','mg-stroke-draw',
 'mg-time-remap','mg-speed-ramp','mg-hold-keyframe','mg-seamless-loop','mg-stagger','mg-motion-path',
 'mg-motion-blur','mg-echo-trails','mg-glitch','mg-chromatic','mg-light-sweep','mg-particle-burst','mg-liquid'
]);
let sequence=0;
const supports=key=>KEYS.has(key);
function item(className,text,animation,delay=0){
 return '<span class="mg-anim '+className+'" style="--mg-name:'+animation+';animation-delay:'+delay+'s">'+text+'</span>';
}
function scene(key,id){
 const brand='<span class="mg-small-cap">ATLAS / MOTION LAB</span>';
 switch(key){
 case 'mg-kinetic':
  return '<div class="mg-type-stack">'+['MAKE','IT','MOVE'].map((s,i)=>item('mg-big-type',s,'mg-type-rise',i*.18)).join('')+'</div>';
 case 'mg-character':
  return '<div class="mg-character">'+Array.from('MOTION', (s,i)=>item('mg-letter',s,'mg-letter-enter',i*.10)).join('')+'</div>';
 case 'mg-text-reveal':
  return '<div class="mg-window">'+item('mg-text-block','REVEAL','mg-slide-up')+'</div><span class="mg-underbar"></span>';
 case 'mg-typewriter':
  return '<div class="mg-typewriter">'+item('mg-typing','Motion tells a story.','mg-typewriter')+'</div>';
 case 'mg-logo-reveal':
  return '<div class="mg-logo-wrap">'+item('mg-logo-symbol','✦','mg-logo-spin')+item('mg-logo-name','ATLAS','mg-logo-fade',.35)+'</div>';
 case 'mg-lower-third':
  return '<div class="mg-lower-wrap"><div class="mg-lower-accent"></div>'+item('mg-lower-content','<strong>MOTION DESIGN</strong><span>ATLAS · ORIGINAL STUDY</span>','mg-lower-enter')+'</div>';
 case 'mg-trim-paths':
  return '<svg class="mg-svg" viewBox="0 0 300 150" aria-hidden="true"><path d="M42 103 Q70 18 117 82 T208 69 T270 93" fill="none" stroke="#27456e" stroke-width="10" stroke-linecap="round"/><path class="mg-anim mg-trace" style="--mg-name:mg-stroke" d="M42 103 Q70 18 117 82 T208 69 T270 93" fill="none" stroke="#6ee8e7" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>';
 case 'mg-shape-morph':
  return '<div class="mg-morph-field">'+item('mg-morph-blob','','mg-morph')+'<span class="mg-morph-outline"></span></div>';
 case 'mg-mask-reveal':
  return '<div class="mg-mask-stage"><span>DISCOVER</span>'+item('mg-mask-top','DISCOVER','mg-clip')+'</div>';
 case 'mg-alpha-matte':
  return '<svg class="mg-svg" viewBox="0 0 300 150" aria-label="알파 마스크의 투명한 영역과 불투명한 영역"><defs><linearGradient id="'+id+'-color" x1="0" x2="1"><stop stop-color="#f59cc7"/><stop offset="1" stop-color="#75d6e8"/></linearGradient><mask id="'+id+'-alpha" mask-type="alpha"><circle class="mg-anim" style="--mg-name:mg-mask-shift" cx="0" cy="75" r="53" fill="#fff"/></mask></defs><rect x="30" y="25" width="240" height="100" rx="15" fill="#182c4c"/><rect x="30" y="25" width="240" height="100" rx="15" fill="url(#'+id+'-color)" mask="url(#'+id+'-alpha)"/><path d="M30 75H270" stroke="#ffffff22" stroke-dasharray="5 7"/></svg>';
 case 'mg-luma-matte':
  return '<svg class="mg-svg" viewBox="0 0 300 150" aria-label="밝기 기반 마스크의 흑백 그라데이션"><defs><linearGradient id="'+id+'-luma"><stop offset="0" stop-color="black"/><stop offset=".5" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="'+id+'-lm" mask-type="luminance"><rect class="mg-anim" style="--mg-name:mg-luma-shift" x="-180" y="0" width="300" height="150" fill="url(#'+id+'-luma)"/></mask></defs><rect x="30" y="25" width="240" height="100" rx="15" fill="#233357"/><rect x="30" y="25" width="240" height="100" rx="15" fill="#a8e6f4" mask="url(#'+id+'-lm)"/><text x="150" y="87" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">LUMINANCE</text></svg>';
 case 'mg-layer-parallax':
  return '<div class="mg-depth">'+item('mg-depth-back','BACK','mg-drift-back')+item('mg-depth-mid','MIDDLE','mg-drift-mid')+item('mg-depth-front','FRONT','mg-drift-front')+'</div>';
 case 'mg-stroke-draw':
  return '<svg class="mg-svg" viewBox="0 0 300 150" aria-hidden="true"><path class="mg-anim mg-trace" style="--mg-name:mg-stroke" d="M48 95 L100 40 L147 100 L198 42 L250 96" fill="none" stroke="#e9b5fa" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/></svg>';
 case 'mg-time-remap':
  return '<div class="mg-track"><span class="mg-track-line"></span>'+item('mg-orb','','mg-remap')+'<span class="mg-track-hint">FAST　 HOLD　 SLOW</span></div>';
 case 'mg-speed-ramp':
  return '<div class="mg-track"><span class="mg-track-line"></span>'+item('mg-orb mg-orb-pink','','mg-ramp')+'<span class="mg-track-hint">ACCELERATION → DECELERATION</span></div>';
 case 'mg-hold-keyframe':
  return '<div class="mg-track"><span class="mg-track-line"></span>'+item('mg-square','','mg-hold')+'<span class="mg-track-hint">MOVE　▸　HOLD　▸　MOVE</span></div>';
 case 'mg-seamless-loop':
  return '<div class="mg-marquee"><div class="mg-anim mg-marquee-track" style="--mg-name:mg-marquee">'+Array.from({length:12},(_,i)=>'<span class="mg-marquee-dot">'+(i%2?'◆':'●')+'</span>').join('')+'</div></div>';
 case 'mg-stagger':
  return '<div class="mg-stagger-bars">'+Array.from({length:5},(_,i)=>item('mg-stagger-bar','','mg-bar-rise',i*.17)).join('')+'</div>';
 case 'mg-motion-path':
  return '<div class="mg-path-track"><svg viewBox="0 0 280 115" aria-hidden="true"><path d="M20 85 C75 0 135 0 150 65 S228 110 260 23" fill="none" stroke="#9ddff1" stroke-dasharray="5 6" opacity=".55" stroke-width="2"/></svg>'+item('mg-path-orb','','mg-curve')+'</div>';
 case 'mg-motion-blur':
  return '<div class="mg-track">'+Array.from({length:3},(_,i)=>item('mg-blur-ghost','','mg-ramp',i*.035)).join('')+item('mg-orb','','mg-ramp')+'</div>';
 case 'mg-echo-trails':
  return '<div class="mg-track">'+Array.from({length:5},(_,i)=>item('mg-echo '+(i===0?'mg-echo-main':''),'','mg-remap',i*.12)).join('')+'</div>';
 case 'mg-glitch':
  return '<div class="mg-glitch-word">'+item('mg-glitch-layer mg-glitch-a','GLITCH','mg-glitch-one')+item('mg-glitch-layer mg-glitch-b','GLITCH','mg-glitch-two')+item('mg-glitch-base','GLITCH','mg-glitch-three')+'</div>';
 case 'mg-chromatic':
  return '<div class="mg-chroma-word">'+item('mg-chroma-r','COLOR','mg-chroma-red')+item('mg-chroma-b','COLOR','mg-chroma-blue')+'<span>COLOR</span></div>';
 case 'mg-light-sweep':
  return '<div class="mg-sweep-card"><span>SHINE</span>'+item('mg-sweep-glint','','mg-sweep')+'</div>';
 case 'mg-particle-burst':
  return '<div class="mg-particles"><span class="mg-particle-center">✦</span>'+Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return '<span class="mg-anim mg-spark" style="--mg-name:mg-burst;--dx:'+Math.round(Math.cos(a)*105)+'px;--dy:'+Math.round(Math.sin(a)*65)+'px;animation-delay:'+(i*.035)+'s"></span>';}).join('')+'</div>';
 case 'mg-liquid':
  return '<div class="mg-liquid-field">'+item('mg-liquid-blob mg-liquid-a','','mg-liquid-one')+item('mg-liquid-blob mg-liquid-b','','mg-liquid-two')+'</div>';
 default:return '<div class="mg-placeholder">'+brand+'</div>';
 }
}
function markup(key,language='ko'){
 if(!supports(key))throw new Error('Unknown motion graphics study: '+key);
 const ko=language==='ko',id='atlas-mg-'+(++sequence);
 return '<div class="mg-stage" data-kind="'+key+'" role="group" tabindex="0" lang="'+language+'" aria-label="'+(ko?'모션그래픽 애니메이션 미리보기':'Motion graphics animation preview')+'">'+
 '<div class="mg-art"><span class="mg-eyebrow">MOTION GRAPHICS / ATLAS</span>'+scene(key,id)+'</div>'+
 '<div class="mg-controls"><button class="mg-replay" type="button">'+(ko?'다시 재생':'Replay')+'</button>'+
 '<button class="mg-pause" type="button" aria-pressed="false">'+(ko?'일시정지':'Pause')+'</button>'+
 '<label class="mg-rate-label">'+(ko?'배속':'Speed')+' <select class="mg-rate" aria-label="'+(ko?'재생 속도':'Playback speed')+'"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label></div>'+
 '<output class="mg-status" aria-live="polite">'+(ko?'화면에 보일 때만 재생됩니다.':'Plays only while visible.')+'</output></div>';
}
function mount(root,key,language='ko',options={}){
 const ko=language==='ko',controller=new AbortController(),signal=controller.signal;
 const replay=root.querySelector('.mg-replay'),pause=root.querySelector('.mg-pause'),speed=root.querySelector('.mg-rate'),status=root.querySelector('.mg-status');
 const motionPreference=global.matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false,paused=false;
 function update(){
  const still=motionPreference.matches||options.paused?.()===true||document.documentElement.classList.contains('motion-paused');
  root.classList.toggle('mg-still',still);
  root.classList.toggle('mg-playing',visible&&!paused&&!still&&!document.hidden);
  root.classList.toggle('mg-user-paused',paused);
  pause.setAttribute('aria-pressed',String(paused));
  pause.textContent=ko?(paused?'재생':'일시정지'):(paused?'Play':'Pause');
  if(still)status.textContent=ko?'움직임 감소 설정: 정적 미리보기':'Reduced motion: static preview';
  else if(paused)status.textContent=ko?'일시정지됨':'Paused';
  else status.textContent=ko?'화면에 보이는 동안 재생':'Playing while visible';
 }
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.05}):null;
 if(io)io.observe(root);else visible=true;
 replay.addEventListener('click',()=>{
  const art=root.querySelector('.mg-art');if(art)art.replaceWith(art.cloneNode(true));
  paused=false;update();
 },{signal});
 pause.addEventListener('click',()=>{paused=!paused;update();},{signal});
 speed.addEventListener('change',()=>{const value=Number(speed.value)||1;root.style.setProperty('--mg-rate',String(1/value));status.textContent=(ko?'재생 속도: ':'Playback speed: ')+value+'×';},{signal});
 document.addEventListener('visibilitychange',update,{signal});
 motionPreference.addEventListener?.('change',update,{signal});
 root.addEventListener('keydown',event=>{if(event.target!==root)return;if(event.key===' '||event.key==='Enter'){event.preventDefault();paused=!paused;update();}},{signal});
 update();
 return {kind:key,dispose(){io?.disconnect();controller.abort();root.classList.remove('mg-playing');}};
}
global.AtlasMotionGraphics={supports,markup,mount,source:'('+initMotionGraphics.toString()+')(window);',keys:[...KEYS]};
})(window);
