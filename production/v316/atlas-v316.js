/* ATLAS v3.16 — 24 original 2D combat, movement and game-UI studies.
 * Illustrative rules only; no game engine, network calls or persistent storage.
 */
(function initAtlasCombatLab(global) {
'use strict';
const ITEMS=[
 ['dar-09961e47f98c','cb-collision','Collision Shape','충돌 형태'],
 ['dar-afbe7f683460','cb-startup','Startup Frames','발동 프레임'],
 ['dar-ce1f71a15050','cb-active','Active Frames','활성 프레임'],
 ['dar-e2acb28ea0e5','cb-recovery','Recovery Frames','후딜레이 프레임'],
 ['dar-3361cdc2db05','cb-stun','Hitstun','피격 경직'],
 ['dar-085d356459c1','cb-knockback','Knockback','넉백'],
 ['dar-8d67d7046a5f','cb-telegraph','Telegraph','공격 예고'],
 ['dar-ba350284504f','cb-buffer','Input Buffer','입력 버퍼'],
 ['dar-e46fca9f5960','cb-air','Air Control','공중 제어'],
 ['dar-076fa673a17a','cb-accel','Acceleration and Deceleration','가속·감속'],
 ['dar-235d8a1c08cd','cb-aim','Aim Assist','조준 보조'],
 ['dar-288ee118bf4a','cb-lock','Lock-on','표적 고정'],
 ['dar-8242243c244e','cb-cancel','Animation Cancel','애니메이션 캔슬'],
 ['dar-5506e7db91fb','cb-combo','Combo System','콤보 시스템'],
 ['dar-67ff513e1d55','cb-ttk','Time to Kill','처치 소요 시간'],
 ['dar-a49b6dc06a45','cb-falloff','Damage Falloff','거리별 피해 감소'],
 ['dar-6cec4a8c6732','cb-friendly','Friendly Fire','아군 피해'],
 ['dar-81a63d60d638','cb-hud','HUD','헤드업 디스플레이'],
 ['dar-45bb64283687','cb-health','Health Bar','체력 바'],
 ['dar-70b1bf1d690e','cb-prompt','Interaction Prompt','상호작용 안내'],
 ['dar-315b6c42ca32','cb-inventory','Inventory Grid','인벤토리 격자'],
 ['dar-b52f0caf1981','cb-hotbar','Hotbar','단축 슬롯 바'],
 ['dar-30ff39302f37','cb-radial','Radial Menu','원형 메뉴'],
 ['dar-f5b67a356add','cb-fsm','Finite State Machine','유한 상태 기계']
];
// [KO label, EN label, min, max, initial, step, unit]
const PARAMS={
 'cb-collision':['위치','Position',35,245,70,1,''],
 'cb-startup':['발동','Startup',6,30,12,1,'f'],
 'cb-active':['활성','Active',2,20,8,1,'f'],
 'cb-recovery':['회복','Recovery',4,30,16,1,'f'],
 'cb-stun':['경직','Stun',8,40,18,1,'f'],
 'cb-knockback':['충격','Impulse',20,160,80,10,''],
 'cb-telegraph':['예고','Warning',200,1200,600,100,'ms'],
 'cb-buffer':['선입력','Lead',0,12,4,1,'f'],
 'cb-air':['공중 제어','Air control',0,100,60,10,'%'],
 'cb-accel':['가속','Accel',20,200,100,10,''],
 'cb-aim':['입력 위치','Input X',30,270,166,1,''],
 'cb-lock':['대상 위치','Targets',0,100,20,5,'%'],
 'cb-cancel':['프레임','Frame',0,36,6,1,'f'],
 'cb-combo':['입력 간격','Input gap',4,22,8,1,'f'],
 'cb-ttk':['피해','Damage',5,60,25,5,''],
 'cb-falloff':['거리','Distance',0,100,40,1,''],
 'cb-hud':['이동','Move',0,100,20,5,'%'],
 'cb-health':['체력','Health',0,100,75,5,'%'],
 'cb-prompt':['위치','Position',30,250,60,5,''],
 'cb-fsm':['거리','Distance',0,100,80,5,'']
};
// Primary and secondary actions; all buttons are native keyboard-operable controls.
const ACTIONS={
 'cb-collision':['이동','Move','도형','Shape'],
 'cb-startup':['재생','Play','+1f','+1f'],
 'cb-active':['재생','Play','+1f','+1f'],
 'cb-recovery':['공격','Attack','+1f','+1f'],
 'cb-stun':['피격','Hit','이동','Move'],
 'cb-knockback':['밀기','Push','+1f','+1f'],
 'cb-telegraph':['예고 시작','Warn','피하기','Dodge'],
 'cb-buffer':['선입력','Queue','+1f','+1f'],
 'cb-air':['점프','Jump','방향 전환','Reverse'],
 'cb-accel':['가속','Accelerate','감속','Release'],
 'cb-aim':['보조 전환','Assist','중앙 이동','Center'],
 'cb-lock':['다음 대상','Next target','대상 이동','Move'],
 'cb-cancel':['캔슬','Cancel','활성으로','To active'],
 'cb-combo':['입력','Press','간격 추가','Wait'],
 'cb-ttk':['시연','Run','1회 타격','One hit'],
 'cb-falloff':['거리 변경','Move','초기 거리','Start'],
 'cb-friendly':['영역 공격','Area hit','허용 전환','Toggle'],
 'cb-hud':['플레이','Act','재충전','Refill'],
 'cb-health':['피해 −25','Hit −25','회복 +20','Heal +20'],
 'cb-prompt':['접근/이탈','Move','상호작용','Interact'],
 'cb-inventory':['빈칸 이동','Move','정렬','Sort'],
 'cb-hotbar':['사용','Use','다음 슬롯','Next'],
 'cb-radial':['열기/닫기','Open / close','선택','Choose'],
 'cb-fsm':['감지','Sense','대기','Idle']
};
const SCOPES={
 'cb-collision':['사각형·원 대 AABB 겹침 검사 · 물리 엔진 아님','Rectangle/circle vs AABB overlap; not a physics engine'],
 'cb-startup':['논리 프레임 · 재생 20f/s · 발동 중 판정 없음','Logical frames at 20f/s; no hit during startup'],
 'cb-active':['공격 1회당 명중 1회 · 재생 20f/s','One hit per attack; playback at 20 logical frames/s'],
 'cb-recovery':['회복 종료 전 새 공격 차단 · 재생 20f/s','New attacks blocked until recovery ends; playback 20f/s'],
 'cb-stun':['경직 중 이동 차단 · 예시 규칙','Movement is blocked during stun; illustrative rule'],
 'cb-knockback':['2D 지수 감쇠 속도 · 충돌 반응은 생략','2D exponentially damped velocity; no collision response'],
 'cb-telegraph':['예고 뒤 범위 판정 · 2D 원리 시연','Warning followed by an area check; 2D study'],
 'cb-buffer':['실행 24f · 유효 선입력 0–6f · 재생 20f/s','Executes at 24f; input valid 0–6f early; playback 20f/s'],
 'cb-air':['공중 수평 가속 + 중력 · 착지 시 제어 종료','Airborne horizontal acceleration + gravity; ends on landing'],
 'cb-accel':['시간 기반 속도 변화 · 2D 이동 시연','Time-based velocity changes; bounded 2D movement study'],
 'cb-aim':['대상 ±28 안에서만 보정 · 마우스 이동 지원','Correction only within ±28 units; pointer movement supported'],
 'cb-lock':['위치가 변해도 선택 ID 유지 · 2D 시연','Selection follows a stable target ID; 2D study'],
 'cb-cancel':['12–19f 활성 구간에서만 회피로 전이','Only active frames 12–19 may transition to dodge'],
 'cb-combo':['입력 간격 12f 이내 연결 · 최대 3단계','Link inputs within 12f; up to three stages'],
 'cb-ttk':['체력 100 · 초당 4회 · 첫 타격 t=0 · 전탄 명중','100 HP; 4 hits/s; first hit at t=0; all hits connect'],
 'cb-falloff':['20까지 100 · 80부터 25 · 구간 내 선형 감소','100 through 20; 25 from 80; linear falloff between'],
 'cb-friendly':['팀 ID로 피해 허용 판정 · 가상 수치','Team IDs control damage permission; fictional values'],
 'cb-hud':['화면 고정 UI + 이동 장면 · 2D 시연','Screen-fixed UI over a moving 2D scene'],
 'cb-health':['0–100 범위 제한 · 숫자와 접근성 값 동기화','Clamped to 0–100; text and accessibility value stay in sync'],
 'cb-prompt':['거리 45 이내 · 버튼 또는 이 카드 안에서 E','Within 45 units; use the button or E inside this card'],
 'cb-inventory':['칸 선택 후 교환 · 빈칸 이동 · 메모리에만 유지','Select then swap slots; move to empty; memory only'],
 'cb-hotbar':['1–4로 선택 · 방향키 이동 · 카드 안에서만','1–4 select; arrows move focus; scoped to this card'],
 'cb-radial':['방향키·Enter·Escape · 네 방향 명령 메뉴','Arrows, Enter and Escape; four-direction command menu'],
 'cb-fsm':['대기·순찰·추적 · 감지 거리 35 · 예시 규칙','Idle/patrol/chase; detection distance 35; illustrative rules']
};
const byId=new Map(ITEMS.map(i=>[i[0],i])),byKey=new Map(ITEMS.map(i=>[i[1],i]));
const active=new Set();let observer=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const rules={
 phase:(f,s=12,a=8,r=16)=>f<s?'startup':f<s+a?'active':f<s+a+r?'recovery':'ready',
 rect:(a,b)=>a.x<=b.x+b.w&&a.x+a.w>=b.x&&a.y<=b.y+b.h&&a.y+a.h>=b.y,
 circleRect:(c,b)=>Math.hypot(c.x-clamp(c.x,b.x,b.x+b.w),c.y-clamp(c.y,b.y,b.y+b.h))<=c.r,
 buffered:(lead)=>lead>=0&&lead<=6,
 falloff:d=>100-75*clamp((d-20)/60,0,1),
 ttk:(hp,damage,rate)=>hp<=0?0:damage>0&&rate>0?(Math.ceil(hp/damage)-1)/rate:Infinity,
 assisted:(x,on)=>on&&Math.abs(x-180)<=28?x+(180-x)*.65:x,
 toward:(value,target,step)=>value<target?Math.min(target,value+step):Math.max(target,value-step)
};
const css=`
.cb-stage{display:grid;grid-template-rows:minmax(60px,1fr) auto auto auto;position:relative;isolation:isolate;width:100%;height:100%;min-height:0;overflow:hidden;background:#14283f;color:#edf5ff;font:14px/1.3 system-ui,sans-serif;text-align:left}
.cb-stage *,.cb-stage *::before,.cb-stage *::after{box-sizing:border-box}.cb-stage [hidden]{display:none!important}.cb-stage button,.cb-stage input,.cb-stage p,.cb-stage output,.cb-stage label,.cb-stage span,.cb-stage b{font-size:14px;line-height:1.3}
.cb-visual{min-width:0;min-height:0;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 80%,#254c63,#122a40)}.cb-drawing{width:100%;height:100%;display:block}.cb-readout{position:absolute;inset:5px 7px auto;margin:0;padding:3px 6px;background:#0c203be6;color:#edf7ff;border-radius:5px;z-index:2;pointer-events:none;font-variant-numeric:tabular-nums;white-space:normal;overflow-wrap:anywhere}
.cb-toolbar{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;align-items:center;padding:5px 7px;background:#1e3854;border-top:1px solid #42627e;min-width:0}.cb-range{display:flex;align-items:center;gap:5px;flex:1 0 100%;min-width:0;margin:0;color:#edf7ff}.cb-range>span{white-space:nowrap}.cb-range input{flex:1;min-width:35px;width:60px;height:23px;margin:0;accent-color:#74d6c3}.cb-range output{min-width:36px;text-align:right;font-variant-numeric:tabular-nums}
.cb-stage button{font:600 14px/1.2 system-ui;border:1px solid #8baac4;border-radius:6px;padding:6px 9px;min-height:30px;background:#315873;color:#fff;cursor:pointer}.cb-stage button:hover{background:#3c6d8c}.cb-stage button:disabled{opacity:.55;cursor:not-allowed}.cb-stage button:focus-visible,.cb-stage input:focus-visible,.cb-stage [tabindex]:focus-visible{outline:3px solid #ffe19a;outline-offset:2px}.cb-stage button[aria-pressed=true]{border-color:#92f2cb;background:#1d665c}
.cb-status{margin:0;padding:4px 8px;min-height:25px;max-height:42px;overflow:auto;background:#11263e;color:#a8e3db;font-variant-numeric:tabular-nums}.cb-scope{margin:0;padding:3px 8px;max-height:40px;overflow:auto;overflow-wrap:anywhere;background:#192f46;color:#cfdeed}
.cb-ui{position:absolute;left:10px;right:10px;top:36px;bottom:7px;display:flex;align-items:center;justify-content:center;gap:8px}.cb-meter{display:flex;flex-direction:column;gap:7px;width:min(260px,100%)}.cb-meter-track{height:22px;position:relative;background:#091f33;border:1px solid #7794ad;border-radius:6px;overflow:hidden}.cb-meter-fill{height:100%;width:var(--health,75%);background:#71d5ba;transition:width .18s ease-out}.cb-meter-value{text-align:center;color:#eef7ff;font-weight:700}
.cb-inventory{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;width:min(270px,100%)}.cb-inventory button{min-width:0;height:34px;padding:3px}.cb-inventory button[data-held=true]{outline:2px dashed #ffda8a;outline-offset:1px}
.cb-hotbar{display:flex;gap:5px;max-width:100%}.cb-hotbar button{min-width:45px;padding:5px;display:grid;gap:3px}.cb-hotbar button span{font-size:14px}
.cb-hud{position:absolute;left:9px;right:9px;top:6px;z-index:3;display:flex;justify-content:space-between;gap:4px;flex-wrap:wrap;pointer-events:none}.cb-hud span{padding:4px 6px;border:1px solid #83c1d6;background:#0d263ce8;border-radius:5px;font-size:14px}
.cb-radial{position:relative;display:grid;grid-template:repeat(3,30px)/repeat(3,minmax(48px,70px));gap:2px;justify-content:center}.cb-radial button{padding:3px;min-height:30px}.cb-radial button:nth-child(1){grid-area:1/2}.cb-radial button:nth-child(2){grid-area:2/3}.cb-radial button:nth-child(3){grid-area:3/2}.cb-radial button:nth-child(4){grid-area:2/1}.cb-radial b{grid-area:2/2;display:grid;place-items:center;font-size:14px;color:#bceada}.cb-fsm{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.cb-fsm span{padding:8px 9px;background:#304961;border:1px solid #7f9eb7;border-radius:20px}.cb-fsm [data-current=true]{background:#2c6a62;border-color:#8df0ca;box-shadow:0 0 0 2px #80d8b433}
.cb-pulse{animation:cb-pulse .25s ease-out}@keyframes cb-pulse{from{filter:brightness(1.3)}to{filter:brightness(1)}}
@media(max-width:360px){.cb-toolbar{padding:4px;gap:4px}.cb-stage button{padding:6px}.cb-readout{font-size:14px}.cb-range{gap:3px}.cb-scope{max-height:40px}}
@media(prefers-reduced-motion:reduce){.cb-stage *{animation:none!important;transition:none!important}}
html.motion-paused .cb-stage *,body.motion-paused .cb-stage *,html[data-motion=off] .cb-stage *{animation:none!important;transition:none!important}
@media(forced-colors:active){.cb-stage button{forced-color-adjust:auto}.cb-meter-fill{background:Highlight}.cb-stage button[aria-pressed=true],.cb-fsm [data-current=true]{outline:2px solid Highlight}}
`;
function install(){if(!document.getElementById('atlas-combat-v316')){const el=document.createElement('style');el.id='atlas-combat-v316';el.textContent=css;document.head.append(el);}}
function markup(key,lang='ko'){
 if(!byKey.has(key))throw Error('Unknown combat key: '+key);const en=lang==='en',t=(a,b)=>en?b:a,c=PARAMS[key],a=ACTIONS[key];let extra='';
 if(key==='cb-health')extra='<div class="cb-ui"><div class="cb-meter"><div class="cb-meter-track" role="progressbar" aria-label="'+t('체력','Health')+'" aria-valuemin="0" aria-valuemax="100"><div class="cb-meter-fill"></div></div><span class="cb-meter-value"></span></div></div>';
 if(key==='cb-inventory')extra='<div class="cb-ui"><div class="cb-inventory" role="group" aria-label="'+t('인벤토리 칸','Inventory slots')+'">'+Array.from({length:8},(_,i)=>'<button type="button" data-slot="'+i+'"></button>').join('')+'</div></div>';
 if(key==='cb-hotbar')extra='<div class="cb-ui"><div class="cb-hotbar" role="toolbar" aria-label="'+t('단축 슬롯','Hotbar')+'">'+Array.from({length:4},(_,i)=>'<button type="button" data-hot="'+i+'"><b>'+['Q','W','E','R'][i]+'</b><span></span></button>').join('')+'</div></div>';
 if(key==='cb-radial')extra='<div class="cb-ui"><div class="cb-radial" role="menu" aria-label="'+t('방향 명령','Directional commands')+'" hidden>'+[t('이동','Move'),t('수비','Guard'),t('대기','Wait'),t('회복','Heal')].map((x,i)=>'<button type="button" role="menuitem" data-radial="'+i+'" tabindex="-1">'+x+'</button>').join('')+'<b aria-hidden="true">+</b></div></div>';
 if(key==='cb-fsm')extra='<div class="cb-ui"><div class="cb-fsm">'+['idle','patrol','chase'].map((x,i)=>'<span data-fsm="'+x+'">'+t(['대기','순찰','추적'][i],['Idle','Patrol','Chase'][i])+'</span>').join('')+'</div></div>';
 if(key==='cb-hud')extra='<div class="cb-hud"><span data-hud="hp"></span><span data-hud="ammo"></span><span data-hud="score"></span></div>';
 return '<section class="cb-stage" data-combat="'+key+'" lang="'+(en?'en':'ko')+'" aria-label="'+esc(byKey.get(key)[en?2:3])+'"><div class="cb-visual"><svg class="cb-drawing" viewBox="0 0 300 130" aria-hidden="true"></svg><p class="cb-readout"></p>'+extra+'</div><div class="cb-toolbar">'+(c?'<label class="cb-range"><span>'+c[en?1:0]+'</span><input type="range" min="'+c[2]+'" max="'+c[3]+'" value="'+c[4]+'" step="'+c[5]+'"><output>'+c[4]+c[6]+'</output></label>':'')+'<button type="button" data-cb="run">'+a[en?1:0]+'</button><button type="button" data-cb="alt">'+a[en?3:2]+'</button>'+(['cb-stun','cb-telegraph','cb-air','cb-accel','cb-ttk'].includes(key)?'<button type="button" data-cb="step">'+t('진행','Step')+'</button>':'')+'<button type="button" data-cb="reset" aria-label="'+t('초기화','Reset')+'" title="'+t('초기화','Reset')+'">↺</button></div><p class="cb-status" role="status" aria-live="polite"></p><p class="cb-scope" tabindex="0">'+SCOPES[key][en?1:0]+'</p></section>';
}
function mount(root,key=root.dataset.combat,lang=root.lang||'ko'){
 if(root.__cbStudy)return root.__cbStudy;if(!byKey.has(key))throw Error('Unknown combat study');const en=lang==='en',t=(a,b)=>en?b:a,ac=new AbortController(),q=s=>root.querySelector(s),qa=s=>[...root.querySelectorAll(s)],range=q('input[type=range]'),cfg=PARAMS[key];
 let s,raf=0,last=0,acc=0,disposed=false,visible=true,animationTime=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const isTiming=['cb-startup','cb-active','cb-recovery'].includes(key);
 const rect=(x,y,w,h,fill='#7bd7c4',stroke='none')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
 const circle=(x,y,r,fill='#e5bb74',stroke='none')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
 const line=(x,y,x2,y2,color='#8facbd',dash='')=>'<path d="M '+x+' '+y+' L '+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="2"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
 function say(text){q('.cb-status').textContent=text;}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;acc=0;root.dataset.playing='false';}
 function dims(){return {start:key==='cb-startup'?s.param:12,active:key==='cb-active'?s.param:8,recovery:key==='cb-recovery'?s.param:16};}
 function phase(){const d=dims();return rules.phase(s.frame,d.start,d.active,d.recovery);}
 function setParam(v){if(!cfg)return;s.param=clamp(Number(v),cfg[2],cfg[3]);range.value=s.param;q('output').textContent=s.param+cfg[6];range.setAttribute('aria-valuetext',cfg[en?1:0]+' '+s.param+cfg[6]);if(key==='cb-health')s.hp=s.param;if(key==='cb-cancel'){s.frame=s.param;s.cancelled=false;}render();}
 function reset(){stop();s={param:cfg?cfg[4]:0,frame:0,hits:0,actions:0,circle:false,stun:0,x:70,y:102,v:0,vy:0,time:0,dir:1,airborne:false,holding:false,assist:true,target:0,cancelled:false,combo:0,clock:0,lastInput:null,queue:null,consumed:false,bufferResult:null,telegraph:'idle',dodged:false,hp:key==='cb-health'?75:100,enemy:100,friendly:false,ammo:6,score:0,opened:false,slots:['key','potion','map',null,null,null,null,null],selected:0,held:null,charges:[3,3,3,3],menu:false,choice:null,mode:'idle',blocked:false};if(cfg){s.param=cfg[4];range.value=cfg[4];q('output').textContent=cfg[4]+cfg[6];range.setAttribute('aria-valuetext',cfg[en?1:0]+' '+cfg[4]+cfg[6]);}if(key==='cb-cancel')s.frame=s.param;root.dataset.state='ready';render();say(t('조작해서 변화를 확인하세요.','Use the controls to explore.'));}
 function render(){
 let drawing=line(16,112,284,112,'#46657d'),read='';const v=s.param;
 if(key==='cb-collision'){const box={x:156,y:55,w:50,h:42},hit=s.circle?rules.circleRect({x:v,y:76,r:21},box):rules.rect({x:v-18,y:56,w:36,h:40},box);s.overlap=hit;drawing+=rect(156,55,50,42,'#627da2')+(s.circle?circle(v,76,21,hit?'#f3bd72':'#78d6c3'):rect(v-18,56,36,40,hit?'#f3bd72':'#78d6c3'));read=(s.circle?'Circle / AABB':'AABB / AABB')+' · '+t(hit?'겹침':'분리',hit?'Overlap':'Separate');}
 else if(isTiming||key==='cb-cancel'){const d=dims(),p=key==='cb-cancel'?rules.phase(s.frame):phase(),total=d.start+d.active+d.recovery,colors=['#8daee0','#7ee0ba','#e8b47b'];let x=25;[d.start,d.active,d.recovery].forEach((n,i)=>{drawing+=rect(x,89,250*n/total,14,colors[i]);x+=250*n/total;});drawing+=line(25+250*clamp(s.frame/total,0,1),83,25+250*clamp(s.frame/total,0,1),109,'#fff');drawing+=rect(s.cancelled?35:70,49,28,32,'#7bd7c4')+rect(190,49,28,32,s.hits?'#f3bd72':'#8aa6ce');if(p==='active'&&!s.cancelled)drawing+=rect(106,54,80,20,'#80dfba66','#80dfba');read=t(({startup:'발동',active:'활성',recovery:'회복',ready:'준비'})[p],p)+' · '+s.frame+'f'+(key==='cb-active'?' · '+t('명중 ','hits ')+s.hits:'')+(s.cancelled?' → '+t('회피','dodge'):'');}
 else if(key==='cb-stun'){drawing+=rect(s.x,65,28,37,s.stun?'#e6bd79':'#7ad9c5');if(s.stun)for(let i=0;i<3;i++)drawing+=circle(s.x+3+i*11,52,3,'#f1ce89');read=t('경직 ','Stun ')+s.stun+'f · '+t(s.stun?'이동 잠김':'이동 가능',s.stun?'movement locked':'movement ready');}
 else if(key==='cb-knockback'||key==='cb-accel'){drawing+=rect(clamp(s.x,20,260),67,25,34);drawing+=line(s.x+12,58,s.x+12+s.v*.35,58,'#e6bb70');read='x '+s.x.toFixed(1)+' · v '+s.v.toFixed(1)+(key==='cb-accel'?' · '+t(s.holding?'입력 ON':'입력 OFF',s.holding?'input ON':'input OFF'):'');}
 else if(key==='cb-telegraph'){drawing+=rect(140,45,95,64,s.telegraph==='strike'?'#b9654a99':'#edc67922','#cfb578')+rect(s.x,75,25,28);read=t(({idle:'준비',warning:'공격 예고',strike:'범위 판정',done:'완료'})[s.telegraph],s.telegraph)+' · '+Math.round(s.time*1000)+'ms'+(s.telegraph==='strike'||s.telegraph==='done'?' · '+t(s.hits?'명중':'회피',s.hits?'hit':'avoided'):'');}
 else if(key==='cb-buffer'){drawing+=rect(25,65,250,20,'#536b87');const inputFrame=24-v;drawing+=line(25+250*(24-6)/30,52,25+250*(24-6)/30,96,'#90dfba','3 2')+line(225,48,225,100,'#90dfba');drawing+=circle(25+250*inputFrame/30,75,7,'#e6be7a')+rect(25+250*s.frame/30-2,60,4,30,'#eaf5ff');read=s.bufferResult===null?t('입력 ','Input ')+inputFrame+'f → 24f':t(s.bufferResult?'버퍼 실행 1회':'입력 만료',s.bufferResult?'Executed once':'Input expired');}
 else if(key==='cb-air'){drawing+=line(20,103,280,103,'#89aebe')+rect(s.x,s.y-24,23,24);drawing+=line(s.x+11,s.y-34,s.x+11+s.dir*25,s.y-34,'#ebc47b');read='x '+s.x.toFixed(1)+' · y '+(102-s.y).toFixed(1)+' · '+t(s.airborne?'공중':'지상',s.airborne?'airborne':'grounded');}
 else if(key==='cb-aim'){const actual=rules.assisted(v,s.assist);s.aimX=actual;drawing+=circle(180,79,28,'#75baad18','#608a86')+circle(180,79,10,'#e4bd7a')+line(v,43,v,108,'#8aa6c7','3 3')+line(actual-10,79,actual+10,79,'#baf4e8')+line(actual,69,actual,89,'#baf4e8');read=t('입력 ','Input ')+v+' → '+actual.toFixed(1)+' · '+t(s.assist?'보조 ON':'보조 OFF',s.assist?'assist ON':'assist OFF');}
 else if(key==='cb-lock'){const positions=[[65+v*.35,76],[146-v*.18,60],[219-v*.2,83]],p=positions[s.target];drawing+=line(150,111,p[0],p[1],'#8ce0ca');positions.forEach(([x,y],i)=>{drawing+=circle(x,y,13,['#81b6d6','#d6a7c2','#e6be78'][i]);if(i===s.target)drawing+=circle(x,y,20,'none','#a7f2da');});read=t('선택 ID ','Selected ID ')+(s.target+1)+' · x '+p[0].toFixed(0);}
 else if(key==='cb-combo'){for(let i=0;i<3;i++){drawing+=rect(53+i*70,58,54,34,i<s.combo?'#77d6bf':'#3e5673');if(i<2)drawing+=line(110+i*70,75,120+i*70,75);}read=t('연속 ','Chain ')+s.combo+'/3 · '+t('입력 간격 ','gap ')+v+'f / 12f';}
 else if(key==='cb-ttk'){drawing+=rect(25,57,250,25,'#334d68')+rect(25,57,250*s.hp/100,25,'#7ad7bc');const expected=rules.ttk(100,v,4);read='HP '+s.hp+' · '+s.hits+' '+t('회','hits')+' · TTK '+expected.toFixed(2)+'s';}
 else if(key==='cb-falloff'){const dmg=rules.falloff(v);s.damage=dmg;drawing+=line(30,98,275,98)+line(30,43,30,98);drawing+='<path d="M30 45 L78 45 L222 86 L270 86" fill="none" stroke="#8dddc7" stroke-width="3"/>'+circle(30+2.4*v,45+(100-dmg)*41/75,5,'#efc47c');read=t('거리 ','Distance ')+v+' → '+t('피해 ','damage ')+dmg.toFixed(1);}
 else if(key==='cb-friendly'){drawing+=rect(35,51,95,17,'#3c526c')+rect(35,51,.95*s.hp,17,'#80bada')+rect(170,51,95,17,'#3c526c')+rect(170,51,.95*s.enemy,17,'#e6bb7e')+circle(82,91,13,'#80bada')+circle(217,91,13,'#e6bb7e');read=t('아군 ','Ally ')+s.hp+' / '+t('적 ','Enemy ')+s.enemy+' · FF '+(s.friendly?'ON':'OFF');}
 else if(key==='cb-hud'){drawing+=rect(25-v*.3,65,35,45,'#456781')+rect(145-v*.3,49,45,61,'#3c6178')+rect(250-v*.3,72,35,38,'#456781')+rect(90,78,20,27);q('[data-hud=hp]').textContent='HP '+s.hp;q('[data-hud=ammo]').textContent=t('충전 ','Charge ')+s.ammo;q('[data-hud=score]').textContent='XP '+s.score;read='';}
 else if(key==='cb-health'){root.style.setProperty('--health',s.hp+'%');q('.cb-meter-track').setAttribute('aria-valuenow',s.hp);q('.cb-meter-value').textContent=s.hp+' / 100';read=t(s.hp===0?'체력 소진':'체력 상태',s.hp===0?'Depleted':'Health state');}
 else if(key==='cb-prompt'){s.near=Math.abs(v-220)<=45;drawing+=rect(v-10,78,20,28)+rect(205,70,30,36,s.opened?'#8bd2a5':'#d3b078');if(s.near&&!s.opened)drawing+=circle(220,54,8,'#a1efd6');read=s.opened?t('상호작용 완료','Interaction complete'):s.near?t('[E] 상자 열기','[E] Open chest'):t('가까이 이동하세요.','Move closer.');q('[data-cb=alt]').disabled=!s.near||s.opened;}
 else if(key==='cb-inventory'){const names={key:t('열쇠','Key'),potion:t('약','Potion'),map:t('지도','Map')};qa('[data-slot]').forEach((b,i)=>{b.textContent=s.slots[i]?names[s.slots[i]]:'—';b.setAttribute('aria-label',t('칸 ','Slot ')+(i+1)+' · '+(s.slots[i]?names[s.slots[i]]:t('비어 있음','empty')));b.setAttribute('aria-pressed',String(s.selected===i));b.dataset.held=String(s.held===i);});read=t('선택 칸 ','Selected slot ')+(s.selected+1)+(s.held===null?'':' · '+t('교환할 칸 선택','Choose a swap target'));}
 else if(key==='cb-hotbar'){qa('[data-hot]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===s.selected));b.tabIndex=i===s.selected?0:-1;b.querySelector('span').textContent='×'+s.charges[i];b.setAttribute('aria-label',t('슬롯 ','Slot ')+(i+1)+' · '+t('잔여 ','remaining ')+s.charges[i]);});read=t('선택 ','Selected ')+(s.selected+1)+' · '+t('잔여 ','remaining ')+s.charges[s.selected];}
 else if(key==='cb-radial'){if(!s.menu){drawing+=circle(150,78,31,'none','#52778e');[[150,47],[181,78],[150,109],[119,78]].forEach(([x,y])=>drawing+=circle(x,y,9,'#41647b','#8fbdbb'));drawing+=circle(150,78,8,'#81d7c3');}q('.cb-radial').hidden=!s.menu;q('[data-cb=run]').setAttribute('aria-expanded',String(s.menu));read=s.choice===null?t('네 방향 명령 선택','Choose a directional command'):t('선택: ','Selected: ')+[t('이동','Move'),t('수비','Guard'),t('대기','Wait'),t('회복','Heal')][s.choice];}
 else if(key==='cb-fsm'){qa('[data-fsm]').forEach(b=>b.dataset.current=String(b.dataset.fsm===s.mode));read=t('감지 거리 ','Detection distance ')+v+' / 35';}
 q('.cb-drawing').innerHTML=drawing;q('.cb-readout').textContent=read;q('.cb-readout').hidden=!read;root.dataset.actions=String(s.actions);root.dataset.frame=String(s.frame);root.dataset.value=String(s.param);root.dataset.hits=String(s.hits);root.dataset.mode=isTiming?phase():key==='cb-fsm'?s.mode:key==='cb-telegraph'?s.telegraph:'';
 }
 function advance(dt=1/20){
 if(isTiming){s.frame=Math.min(s.frame+1,Object.values(dims()).reduce((a,b)=>a+b,0));if(phase()==='active'&&!s.hits)s.hits=1;return phase()!=='ready';}
 if(key==='cb-stun'){s.stun=Math.max(0,s.stun-1);s.frame++;return s.stun>0;}
 if(key==='cb-knockback'){const decay=Math.exp(-3*dt);s.x=clamp(s.x+s.v*(1-decay)/3,20,260);s.v*=decay;s.time+=dt;s.frame++;return s.time<1.5;}
 if(key==='cb-telegraph'){s.time+=dt;s.frame++;if(s.time>=s.param/1000&&s.telegraph==='warning'){s.telegraph='strike';s.hits=s.x+25>=140&&s.x<=235?1:0;}if(s.time>=s.param/1000+.35){s.telegraph='done';return false;}return true;}
 if(key==='cb-buffer'){s.frame=Math.min(30,s.frame+1);if(s.queue!==null&&!s.consumed&&s.frame>=24){s.consumed=true;s.bufferResult=rules.buffered(24-s.queue);s.hits=s.bufferResult?1:0;s.queue=null;}return s.frame<30;}
 if(key==='cb-air'){if(!s.airborne)return false;const step=Math.min(dt,1/20);s.v=clamp(s.v+s.dir*120*s.param/100*step,-80,80);s.x=clamp(s.x+s.v*step,20,260);s.y+=s.vy*step+200*step*step;s.vy+=400*step;s.time+=step;s.frame++;if(s.y>=102){s.y=102;s.airborne=false;s.v=0;}return s.airborne;}
 if(key==='cb-accel'){s.v=rules.toward(s.v,s.holding?100:0,s.param*dt);s.x=clamp(s.x+s.v*dt,20,260);s.time+=dt;s.frame++;return s.time<2&&(s.holding||s.v>0);}
 if(key==='cb-ttk'){s.time+=dt;s.frame++;const needed=Math.min(Math.ceil(100/s.param),Math.floor((s.time+1e-8)*4)+1);while(s.hits<needed){s.hp=Math.max(0,s.hp-s.param);s.hits++;}return s.hp>0;}
 return false;
 }
 function motionBlocked(){return reduced.matches||document.documentElement.matches('.motion-paused,[data-motion="off"]')||document.body?.classList.contains('motion-paused');}
 function play(){stop();if(motionBlocked()){advance();render();say(t('움직임 감소: 한 단계 진행했습니다.','Reduced motion: advanced one step.'));return;}root.dataset.playing='true';animationTime=0;function frame(now){if(disposed||!root.isConnected||document.hidden||!visible||motionBlocked()){stop();return;}if(!last)last=now;const delta=Math.min(.1,(now-last)/1000);last=now;acc+=delta;animationTime+=delta;let running=true;while(acc>=.05&&running){acc-=.05;running=advance(.05);}render();if(!running||animationTime>8){stop();say(q('.cb-readout').textContent);return;}raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);}
 function interact(){if(Math.abs(s.param-220)<=45&&!s.opened){s.opened=true;s.actions++;render();say(t('상자를 열었습니다.','Chest opened.'));}else say(t('거리 조건을 먼저 충족하세요.','Move within interaction range first.'));}
 function menu(open,focus=true){s.menu=open;render();if(focus){if(open){qa('[data-radial]')[s.selected%4].focus();}else q('[data-cb=run]').focus();}}
 function choose(i){if(!s.menu)return;s.choice=i;s.selected=i;s.actions++;menu(false);say(t('명령 선택: ','Command selected: ')+[t('이동','Move'),t('수비','Guard'),t('대기','Wait'),t('회복','Heal')][i]);}
 function run(action){s.actions++;root.dataset.state='changed';let message='';
 if(key==='cb-collision'){if(action==='run')setParam(s.param<130?170:70);else s.circle=!s.circle;}
 else if(isTiming){if(action==='alt'){stop();advance();}else if(key==='cb-recovery'&&s.frame>0&&phase()!=='ready'){s.blocked=true;message=t('회복 전 새 공격은 차단됩니다.','New attack blocked until recovery ends.');}else{s.frame=0;s.hits=0;s.blocked=false;play();}}
 else if(key==='cb-stun'){if(action==='run'){s.stun=s.param;s.frame=0;play();}else if(s.stun){s.blocked=true;message=t('경직 중 이동 불가','Cannot move while stunned');}else{s.x=s.x>=200?70:s.x+25;s.blocked=false;}}
 else if(key==='cb-knockback'){if(action==='run'){s.x=70;s.v=s.param;s.time=0;s.frame=0;play();}else{stop();advance();}}
 else if(key==='cb-telegraph'){if(action==='run'){s.time=0;s.frame=0;s.x=180;s.hits=0;s.telegraph='warning';play();}else if(s.telegraph==='warning'){s.x=75;s.dodged=true;}else message=t('예고 중에 피하세요.','Dodge during the warning.');}
 else if(key==='cb-buffer'){if(action==='run'){s.frame=24-s.param;s.queue=s.frame;s.consumed=false;s.bufferResult=null;s.hits=0;if(s.frame===24){s.consumed=true;s.bufferResult=true;s.hits=1;s.queue=null;}play();}else{stop();advance();}}
 else if(key==='cb-air'){if(action==='run'){s.x=70;s.y=102;s.v=0;s.vy=-180;s.time=0;s.airborne=true;s.frame=0;play();}else{s.dir*=-1;}}
 else if(key==='cb-accel'){s.holding=action==='run';s.time=0;if(s.x>=250)s.x=70;play();}
 else if(key==='cb-aim'){if(action==='run')s.assist=!s.assist;else setParam(180);}
 else if(key==='cb-lock'){if(action==='run')s.target=(s.target+1)%3;else setParam((s.param+25)%101);}
 else if(key==='cb-cancel'){if(action==='alt')setParam(14);else if(rules.phase(s.frame)==='active'){s.cancelled=true;message=t('활성 구간 → 회피 전이','Active window → dodge');}else{message=t('이 프레임에서는 캔슬할 수 없습니다.','Cancel is not allowed at this frame.');}}
 else if(key==='cb-combo'){if(action==='alt'){s.clock+=20;s.combo=0;message=t('연결 시간이 지났습니다.','Link window expired.');}else{s.clock+=s.param;s.combo=s.lastInput!==null&&s.clock-s.lastInput<=12?Math.min(3,s.combo+1):1;s.lastInput=s.clock;}}
 else if(key==='cb-ttk'){if(action==='run'){s.hp=Math.max(0,100-s.param);s.hits=1;s.time=0;s.frame=0;play();}else{stop();if(s.hp>0){s.hp=Math.max(0,s.hp-s.param);s.hits++;s.time=Math.max(0,(s.hits-1)/4);}}}
 else if(key==='cb-falloff')setParam(action==='run'?(s.param+20)%101:40);
 else if(key==='cb-friendly'){if(action==='run'){s.enemy=Math.max(0,s.enemy-25);if(s.friendly)s.hp=Math.max(0,s.hp-25);}else s.friendly=!s.friendly;}
 else if(key==='cb-hud'){if(action==='alt')s.ammo=6;else if(s.ammo>0&&s.hp>0){s.hp=Math.max(0,s.hp-15);s.ammo--;s.score+=10;}else message=t('충전 또는 초기화가 필요합니다.','Refill or reset to continue.');}
 else if(key==='cb-health')setParam(s.hp+(action==='run'?-25:20));
 else if(key==='cb-prompt'){if(action==='run')setParam(s.param<175?200:60);else interact();}
 else if(key==='cb-inventory'){if(action==='alt'){s.slots=s.slots.filter(Boolean).sort().concat(Array(s.slots.filter(x=>!x).length).fill(null));s.held=null;s.selected=0;}else{const empty=s.slots.indexOf(null);if(empty>=0&&s.slots[s.selected]){s.slots[empty]=s.slots[s.selected];s.slots[s.selected]=null;s.selected=empty;s.held=null;}else message=t('아이템이 든 칸을 선택하세요.','Select an occupied slot.');}}
 else if(key==='cb-hotbar'){if(action==='alt')s.selected=(s.selected+1)%4;else if(s.charges[s.selected]>0)s.charges[s.selected]--;else message=t('잔여 횟수가 없습니다.','No charges remaining.');}
 else if(key==='cb-radial'){if(action==='run')menu(!s.menu);else if(s.menu)choose(s.selected%4);else menu(true);}
 else if(key==='cb-fsm'){s.mode=action==='alt'?'idle':s.param<=35?'chase':'patrol';}
 render();say(message||q('.cb-readout').textContent||t('상태를 변경했습니다.','State updated.'));}
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!root.contains(b))return;e.stopPropagation();if(b.dataset.cb==='reset'){reset();return;}if(b.dataset.cb==='step'){stop();s.actions++;root.dataset.state='changed';advance();render();say(q('.cb-readout').textContent);return;}if(b.dataset.cb){run(b.dataset.cb);return;}if(b.dataset.slot!==undefined){const i=Number(b.dataset.slot);s.selected=i;if(s.held===null)s.held=i;else{[s.slots[i],s.slots[s.held]]=[s.slots[s.held],s.slots[i]];s.held=null;}s.actions++;render();say(q('.cb-readout').textContent);}if(b.dataset.hot!==undefined){s.selected=Number(b.dataset.hot);s.actions++;render();}if(b.dataset.radial!==undefined)choose(Number(b.dataset.radial));},{signal:ac.signal});
 root.addEventListener('input',e=>{if(e.target===range){stop();root.dataset.state='changed';s.actions++;setParam(range.value);if(isTiming){s.frame=0;s.hits=0;render();}if(key==='cb-ttk'){s.hp=100;s.hits=0;s.time=0;render();}say(q('.cb-readout').textContent);}},{signal:ac.signal});
 root.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select'))return;let handled=false;if(key==='cb-prompt'&&e.key.toLowerCase()==='e'){interact();handled=true;}if(key==='cb-hotbar'){const buttons=qa('[data-hot]');let n=s.selected;if(/^[1-4]$/.test(e.key)){n=Number(e.key)-1;handled=true;}if(e.key==='ArrowRight'){n=(n+1)%4;handled=true;}if(e.key==='ArrowLeft'){n=(n+3)%4;handled=true;}if(e.key==='Home'){n=0;handled=true;}if(e.key==='End'){n=3;handled=true;}if(handled){s.selected=n;s.actions++;render();buttons[n].focus();}}if(key==='cb-radial'&&s.menu){if(e.key==='Escape'){menu(false);handled=true;}else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){s.selected=e.key==='Home'?0:e.key==='End'?3:(s.selected+(e.key==='ArrowLeft'||e.key==='ArrowUp'?3:1))%4;qa('[data-radial]')[s.selected].focus();handled=true;}}if(handled){e.preventDefault();e.stopPropagation();}},{signal:ac.signal});
 if(key==='cb-aim')q('.cb-visual').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const svg=q('svg'),matrix=svg.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());setParam(Math.round(clamp(p.x,30,270)));},{signal:ac.signal});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:ac.signal});reduced.addEventListener('change',()=>{if(reduced.matches)stop();},{signal:ac.signal});
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop();}):null;io?.observe(root);
 reset();const study={root,key,snapshot:()=>JSON.parse(JSON.stringify(s)),step:(n=1)=>{stop();for(let i=0;i<n;i++)advance();render();return study.snapshot();},dispose(){disposed=true;stop();ac.abort();io?.disconnect();active.delete(study);delete root.__cbStudy;}};root.__cbStudy=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const item of active)if(!item.root.isConnected)item.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown combat entry');const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e9eef5;color:#183047;font:16px/1.5 system-ui}main{max-width:660px;margin:auto}h1{font-size:24px}.demo{height:360px;overflow:hidden;border:1px solid #94adc2;border-radius:14px}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div class="demo" id="demo"></div><p>'+esc(SCOPES[item[1]][en?1:0])+'</p></main><script>('+initAtlasCombatLab.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasCombatLab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasCombatLab.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){const A=global.Atlas32;if(!A||A.__combat316)return false;A.__combat316=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-combat-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive 2D study':'직접 조작하는 2D 예제'}:prev.art(e,lang);};A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.cb-stage')?[scope]:[...scope.querySelectorAll('.cb-stage')];roots.forEach(el=>mount(el));};A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prev.code(e,lang);return true;}
install();global.AtlasCombatLab={ITEMS,PARAMS,ACTIONS,SCOPES,byId,byKey,markup,mount,code,attach,rules,css,version:'3.16.0',activeCount:()=>active.size};attach();
})(window);
