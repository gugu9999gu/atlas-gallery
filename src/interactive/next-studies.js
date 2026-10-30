/* ATLAS Next: exact, independently interactive reference studies.
 * Original HTML/CSS/JS, no telemetry, simulated numbers clearly labeled.
 * Shared standalone export and compatible with both AtlasKit and Atlas32 hosts.
 */
(function initAtlasNext(global){
'use strict';
const ITEMS=[
 ['dar-18ab9064f702','n27-permission','Permission Denied Indicator','접근 거부 상태'],
 ['dar-66187bdda16a','n27-contrast','Non-text Contrast','비텍스트 명도 대비'],
 ['dar-c30f823d3b27','n27-iconstate','Icon State Variant','아이콘 상태 변형'],
 ['dar-1d21c0676320','n27-nineslice','Nine-slice Scaling','나인 슬라이스 크기 조절'],
 ['dar-635a967bfd14','n27-coyote','Coyote Time','코요테 타임'],
 ['dar-4687b6f568fe','n27-jumpbuffer','Jump Buffer','점프 입력 버퍼'],
 ['dar-1a4f74aba5b3','n27-variablejump','Variable Jump Height','가변 점프 높이'],
 ['dar-c5c958271b8e','n27-cooldown','Cooldown','쿨다운'],
 ['dar-a9c10d34dc16','n27-stamina','Stamina System','스태미나 시스템'],
 ['dar-0146ba41e18b','n27-hitbox','Hitbox','히트박스'],
 ['dar-dcd47283aa03','n27-hurtbox','Hurtbox','허트박스'],
 ['dar-51b364eb06f5','n27-invuln','Invincibility Frames','무적 프레임'],
 ['dar-a10cb4ccae11','n27-parry','Parry Window','패리 타이밍'],
 ['dar-0019ceec6862','n27-deadzone','Dead Zone','데드 존'],
 ['dar-9e6dcb1c6b72','n27-hitstop','Hit Stop','히트 스톱'],
 ['dar-18eba456b53b','n27-damage','Damage Number','피해량 숫자'],
 ['dar-0f7d4d5c2efe','n27-fog','Fog of War','전장의 안개'],
 ['dar-c038f0addbbd','n27-progression','Progression System','진행도 시스템'],
 ['dar-64a7fc9fab50','n27-userflow','User Flow','사용자 흐름'],
 ['dar-bf4c5d8b714d','n27-responsive','Responsive QA','반응형 검수']
];
const byId=new Map(ITEMS.map(x=>[x[0],x]));
const byKey=new Map(ITEMS.map(x=>[x[1],x]));
const supports=key=>byKey.has(key);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const promptButton=(t,action='primary')=>'<button type="button" class="n27-btn" data-n27="'+action+'">'+esc(t)+'</button>';
const field=(v)=>'<div class="n27-meter"><div class="n27-meter-fill" style="width:'+v+'%"></div></div>';
function markup(kind,lang='ko'){
 const ko=lang!=='en',t=(k,e)=>ko?k:e;
 if(!supports(kind))throw Error('Unknown live reference: '+kind);
 let body='',actions='',hint=t('조작하여 개념을 확인하세요.','Interact to inspect this behavior.');
 switch(kind){
 case 'n27-permission':
  body='<div class="n27-symbol" aria-hidden="true">🔒</div><div class="n27-head">'+t('비공개 자료','Private resource')+'</div>';
  actions=promptButton(t('접근 요청','Try access'));break;
 case 'n27-contrast':
  body='<div class="n27-contrast" style="--n27-ink:#8b9bb3"><span class="n27-contrast-icon" aria-hidden="true">◆</span><strong class="n27-head">'+t('상태 아이콘','UI component')+'</strong></div><output class="n27-number">1.00:1</output>';
  actions='<label class="n27-range-label">'+t('아이콘 대비','Icon contrast')+' <input data-n27-range type="range" min="0" max="100" value="25" aria-label="'+t('아이콘 밝기','Icon brightness')+'"></label>';hint=t('비텍스트 UI 대비 3:1 참고값 · 학습용','Illustrative 3:1 non-text UI contrast comparison');break;
 case 'n27-iconstate':
  body='<div class="n27-iconstate"><span class="n27-symbol" aria-hidden="true">☆</span><strong class="n27-head">DEFAULT</strong></div>';
  actions=promptButton(t('다음 상태','Next state'));break;
 case 'n27-nineslice':
  body='<div class="n27-nine" style="--n27-nine-size:170px">'+Array.from({length:9},(_,i)=>'<span class="n27-nine-'+i+'">'+(i===4?'CONTENT':'')+'</span>').join('')+'</div>';
  actions='<label class="n27-range-label">'+t('패널 폭','Panel width')+' <input data-n27-range type="range" min="140" max="230" value="170"></label>';hint=t('네 모서리는 22px 고정, 가장자리와 중앙만 확장','22px corners stay fixed; center and edges stretch');break;
 case 'n27-coyote':
  body='<div class="n27-game"><div class="n27-player"></div><div class="n27-platform"></div><span class="n27-window-mark">120 ms</span></div>';
  actions=promptButton(t('낭떠러지로 이동','Leave edge'))+promptButton(t('점프','Jump'),'secondary');hint=t('발판을 떠난 직후에도 120ms 동안 점프 허용','Jump remains possible for 120ms after leaving an edge');break;
 case 'n27-jumpbuffer':
  body='<div class="n27-game"><div class="n27-player n27-air"></div><div class="n27-platform"></div></div>';
  actions=promptButton(t('착지 전 점프 입력','Queue jump'));hint=t('착지 직전 입력을 500ms 저장하고 착지 시 실행','Stores a jump for up to 500ms until landing');break;
 case 'n27-variablejump':
  body='<div class="n27-game"><div class="n27-player"></div><div class="n27-platform"></div><span class="n27-jump-label">0%</span></div>';
  actions=promptButton(t('길게 눌러 점프','Hold to jump'));hint=t('누른 시간에 따라 점프 높이 변경 · 키보드 지원','Hold duration controls jump height; keyboard supported');break;
 case 'n27-cooldown':
  body='<div class="n27-cooldown"><span class="n27-cooldown-ring">READY</span>'+field(100)+'</div>';
  actions=promptButton(t('스킬 사용','Use skill'));hint=t('스킬 사용 후 1.6초 동안 다시 사용할 수 없음','Skill unavailable for 1.6 seconds after use');break;
 case 'n27-stamina':
  body='<div class="n27-stamina">'+field(100)+'<output class="n27-number">100 / 100</output></div>';
  actions=promptButton(t('달리기','Sprint'));hint=t('달리기는 25 소모 · 시간에 따라 회복','Sprint consumes 25; stamina regenerates over time');break;
 case 'n27-hitbox':
 case 'n27-hurtbox':
  body='<div class="n27-combat"><div class="n27-attacker">A<div class="n27-hit-area"></div></div><div class="n27-defender">B<div class="n27-hurt-area"></div></div></div>';
  actions=promptButton(kind==='n27-hitbox'?t('공격하기','Attack'):t('피격 범위 전환','Toggle hurt area'));hint=kind==='n27-hitbox'?t('공격 판정 범위와 상대 허트박스의 교집합 확인','Detect overlap between attack hitbox and target hurtbox'):t('허트박스는 피해를 받을 수 있는 범위','Hurtbox is a character damage-receiving area');break;
 case 'n27-invuln':
  body='<div class="n27-dodge"><span class="n27-avatar" aria-hidden="true">◆</span><span class="n27-invuln-state">VULNERABLE</span></div>';
  actions=promptButton(t('회피','Dodge'))+promptButton(t('피격 시도','Attempt hit'),'secondary');hint=t('회피 후 900ms는 피해 판정 무시','900ms invulnerability window after dodge');break;
 case 'n27-parry':
  body='<div class="n27-parry-track"><span class="n27-parry-cursor"></span><span class="n27-parry-zone"></span></div>';
  actions=promptButton(t('공격 예고','Incoming attack'))+promptButton(t('패리','Parry'),'secondary');hint=t('공격 발생 전 짧은 구간에서만 방어 성공','Parry succeeds only in a short pre-impact window');break;
 case 'n27-deadzone':
  body='<div class="n27-deadzone"><span class="n27-deadzone-track"><span class="n27-deadzone-center"></span><span class="n27-deadzone-pin"></span></span><output class="n27-number">OUTPUT 0%</output></div>';
  actions='<label class="n27-range-label">'+t('입력 값','Input axis')+' <input data-n27-range type="range" min="-100" max="100" value="0" step="1"></label>';hint=t('절대값 20 미만의 입력은 0으로 처리','Inputs with absolute magnitude below 20 become zero');break;
 case 'n27-hitstop':
  body='<div class="n27-hitstop"><span class="n27-moving">◆</span><span class="n27-target">◎</span></div>';
  actions=promptButton(t('타격','Hit'));hint=t('충돌 순간 240ms 동안 대상 움직임 정지','Pause motion for 240ms at impact');break;
 case 'n27-damage':
  body='<div class="n27-damage-zone"><span class="n27-target">◎</span></div>';
  actions=promptButton(t('피해 주기','Deal damage'));hint=t('피해량 텍스트가 위치를 이동하며 사라짐','Damage numbers rise and fade at the hit location');break;
 case 'n27-fog':
  body='<div class="n27-fog-grid">'+Array.from({length:32},(_,i)=>'<button type="button" class="n27-fog-cell" data-fog="'+i+'" aria-label="'+t('타일','Tile')+' '+(i+1)+'">·</button>').join('')+'</div>';
  actions=promptButton(t('시야 초기화','Reset vision'));hint=t('셀에 초점·클릭하면 주변 타일이 보임','Reveal neighboring tiles on focus or click');break;
 case 'n27-progression':
  body='<div class="n27-progress"><strong class="n27-head">LEVEL 1</strong>'+field(0)+'<output class="n27-number">0 / 100 XP</output></div>';
  actions=promptButton(t('경험치 +35','Gain 35 XP'));hint=t('100 경험치마다 다음 레벨로 진행','Gain a level each time XP reaches 100');break;
 case 'n27-userflow':
  body='<div class="n27-flow">'+[t('탐색','Discover'),t('선택','Choose'),t('완료','Complete')].map((s,i)=>'<div class="n27-flow-step '+(i===0?'active':'')+'">'+(i+1)+' · '+s+'</div>').join('')+'</div>';
  actions=promptButton(t('이전','Back'),'back')+promptButton(t('다음','Next'));hint=t('화면 상태를 순서대로 진행·복귀','Navigate through a real three-step flow');break;
 case 'n27-responsive':
  body='<div class="n27-responsive"><div class="n27-responsive-cards"><span></span><span></span><span></span></div><output class="n27-number">320 px · 1 column</output></div>';
  actions=promptButton(t('다음 화면 크기','Change viewport'));hint=t('320/768/1280px 가상 뷰포트의 그리드 차이','Compare grid layouts at simulated 320/768/1280px widths');break;
 }
 return '<div class="n27-stage" data-n27-kind="'+esc(kind)+'" tabindex="0" role="group" lang="'+(ko?'ko':'en')+'" aria-label="'+esc(t('직접 조작하는 '+byKey.get(kind)[3]+' 예제','Interactive '+byKey.get(kind)[2]+' example'))+'"><div class="n27-display">'+body+'</div><div class="n27-buttons">'+actions+'</div><p class="n27-hint">'+hint+'</p><output class="n27-status" role="status" aria-live="polite">'+t('동작을 시도하세요.','Try an action.')+'</output></div>';
}
function mount(root,key,language='ko',options={}){
 const ko=language!=='en',ctrl=new AbortController(),signal=ctrl.signal,t=(a,b)=>ko?a:b,live=()=>!global.matchMedia('(prefers-reduced-motion: reduce)').matches&&!options.paused?.();
 const q=selector=>root.querySelector(selector),all=selector=>[...root.querySelectorAll(selector)];
 const timers=new Set();let value=100,count=0,level=1,phase=0,deadline=0,queued=false,held=0,active=false,step=0;
 const status=q('.n27-status');const say=(a,b)=>{status.textContent=t(a,b);};
 const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn();},ms);timers.add(id);return id;};
 const repeat=(fn,ms)=>{const id=setInterval(fn,ms);timers.add(id);return id;};
 const animate=(el,frames,duration=450)=>{if(!el||!live())return;const a=el.animate(frames,{duration,easing:'ease-out',fill:'both'});a.finished.catch(()=>{});return a;};
 const setMeter=v=>{const bar=q('.n27-meter-fill');if(bar)bar.style.width=Math.max(0,Math.min(100,v))+'%';};
 function interact(a='primary'){
 switch(key){
 case 'n27-permission':q('.n27-symbol').textContent='⛔';say('접근 거부 · 권한 필요','Access denied · permission required');root.dataset.state='denied';break;
 case 'n27-iconstate':{const states=['DEFAULT','HOVER','PRESSED','DISABLED'];phase=(phase+1)%states.length;q('.n27-iconstate .n27-head').textContent=states[phase];q('.n27-symbol').textContent=['☆','★','✓','⊘'][phase];root.dataset.state=states[phase].toLowerCase();say('아이콘 상태: '+states[phase],'Icon state: '+states[phase]);break;}
 case 'n27-coyote':{
  const player=q('.n27-player');if(a==='secondary'){const yes=Date.now()<=deadline&&deadline>0;root.dataset.state=yes?'jumped':'missed';say(yes?'코요테 타임 점프 성공':'점프 시간 초과',yes?'Coyote jump succeeded':'Jump grace window expired');if(yes)animate(player,[{transform:'translate(60px,0)'},{transform:'translate(60px,-47px)'},{transform:'translate(60px,0)'}],580);break;}
  deadline=Date.now()+120;player.style.transform='translateX(60px)';root.dataset.state='off-edge';say('120ms 동안 점프할 수 있습니다.','120ms jump grace is active.');later(()=>{if(root.dataset.state==='off-edge')say('점프 유예 시간 종료','Grace period expired');},125);break;}
 case 'n27-jumpbuffer':{
  queued=true;root.dataset.state='queued';say('점프 입력 예약됨','Jump queued before landing');later(()=>{if(!queued)return;queued=false;root.dataset.state='jumped';animate(q('.n27-player'),[{transform:'translateY(0)'},{transform:'translateY(-52px)'},{transform:'translateY(0)'}],500);say('착지 직후 예약된 점프 실행','Buffered jump executed at landing');},330);break;}
 case 'n27-cooldown':{
  if(active)return;active=true;value=0;root.dataset.state='cooldown';q('.n27-cooldown-ring').textContent='1.6s';setMeter(0);const button=q('[data-n27=primary]');button.disabled=true;let ticks=0;
  const id=repeat(()=>{ticks++;value=Math.min(100,ticks/16*100);setMeter(value);q('.n27-cooldown-ring').textContent=(Math.max(0,16-ticks)/10).toFixed(1)+'s';if(ticks>=16){clearInterval(id);timers.delete(id);active=false;button.disabled=false;q('.n27-cooldown-ring').textContent='READY';root.dataset.state='ready';say('스킬 사용 가능','Skill ready again');}},100);
  say('스킬 대기시간 시작','Cooldown started');break;}
 case 'n27-stamina':value=Math.max(0,value-25);setMeter(value);q('.n27-number').textContent=value+' / 100';root.dataset.state=value?'draining':'exhausted';say('잔여 스태미나 '+value,'Remaining stamina '+value);break;
 case 'n27-hitbox':{root.classList.toggle('n27-hit-active');const hit=root.classList.contains('n27-hit-active');root.dataset.state=hit?'overlap':'idle';say(hit?'공격 판정이 허트박스와 겹침':'공격 해제',hit?'Attack hitbox intersects target hurtbox':'Attack reset');break;}
 case 'n27-hurtbox':{root.classList.toggle('n27-hurt-small');root.dataset.state=root.classList.contains('n27-hurt-small')?'small':'large';say(root.dataset.state==='small'?'작은 피격 범위':'큰 피격 범위',root.dataset.state==='small'?'Small hurtbox':'Large hurtbox');break;}
 case 'n27-invuln':{if(a==='secondary'){const safe=Date.now()<deadline;root.dataset.state=safe?'blocked':'hit';say(safe?'무적 프레임 · 피해 무시':'피해를 받았습니다.',safe?'Invulnerable: hit ignored':'Damage received');break;}deadline=Date.now()+900;root.dataset.state='dodging';q('.n27-invuln-state').textContent='INVULNERABLE';say('900ms 무적 구간 시작','900ms invulnerability active');later(()=>{q('.n27-invuln-state').textContent='VULNERABLE';if(root.dataset.state==='dodging')root.dataset.state='ready';},900);break;}
 case 'n27-parry':{if(a==='secondary'){const delta=deadline-Date.now();const win=delta>0&&delta<=180;root.dataset.state=win?'success':'failure';say(win?'패리 성공':'패리 시간 불일치',win?'Parry succeeded':'Outside parry window');break;}deadline=Date.now()+650;root.dataset.state='incoming';say('공격 도착까지 650ms','Attack lands in 650ms');q('.n27-parry-cursor').style.animation=live()?'n27-attack 650ms linear forwards':'none';later(()=>{if(root.dataset.state==='incoming')root.dataset.state='missed';},660);break;}
 case 'n27-hitstop':{const moving=q('.n27-moving');moving.style.animationPlayState='paused';root.dataset.state='frozen';say('240ms 타격 정지','240ms impact freeze');later(()=>{moving.style.animationPlayState='running';root.dataset.state='resumed';say('동작 재개','Motion resumed');},240);break;}
 case 'n27-damage':{count++;const el=document.createElement('span');el.className='n27-damage-number';el.textContent='-'+(8+count*4);q('.n27-damage-zone').append(el);animate(el,[{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,-55px)',opacity:0}],800);later(()=>el.remove(),840);root.dataset.state='damaged';say('피해량 표시 '+count,'Damage number shown '+count);break;}
 case 'n27-fog':all('.n27-fog-cell').forEach(el=>{el.classList.remove('revealed');el.textContent='·';});root.dataset.state='reset';say('안개 초기화','Fog reset');break;
 case 'n27-progression':{count+=35;if(count>=100){count-=100;level++;}q('.n27-progress .n27-head').textContent='LEVEL '+level;setMeter(count);q('.n27-number').textContent=count+' / 100 XP';root.dataset.state=level>1?'levelup':'gaining';say('레벨 '+level+' · 경험치 '+count,'Level '+level+' · XP '+count);break;}
 case 'n27-userflow':{step=Math.min(2,Math.max(0,step+(a==='back'?-1:1)));all('.n27-flow-step').forEach((x,i)=>x.classList.toggle('active',i===step));root.dataset.step=String(step+1);say('진행 단계 '+(step+1)+'/3','Flow step '+(step+1)+'/3');break;}
 case 'n27-responsive':{phase=(phase+1)%3;const widths=[320,768,1280],columns=[1,2,3];const node=q('.n27-responsive-cards');node.style.gridTemplateColumns='repeat('+columns[phase]+',1fr)';q('.n27-responsive .n27-number').textContent=widths[phase]+' px · '+columns[phase]+' column'+(columns[phase]>1?'s':'');root.dataset.state=String(widths[phase]);say('가상 화면 '+widths[phase]+'px','Simulated viewport '+widths[phase]+'px');break;}
 }
 }
 const on=(el,type,fn)=>el?.addEventListener(type,fn,{signal});
 all('[data-n27]').forEach(btn=>on(btn,'click',()=>interact(btn.dataset.n27)));
 on(root,'keydown',e=>{if(e.target===root&&(e.key==='Enter'||e.key===' ')){e.preventDefault();interact('primary');}});
 const range=q('[data-n27-range]');
 if(range)on(range,'input',()=>{
  if(key==='n27-contrast'){const v=Number(range.value),shade=Math.round(45+v*2.1);const bg=[24,42,65];const f=(c,b)=>{c/=255;b/=255;const L=x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);return L(c);};const ratio=(()=>{const f=x=>{x=x/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);};const a=f(shade),base=(.2126*f(bg[0])+.7152*f(bg[1])+.0722*f(bg[2]));return (a+.05)/(base+.05);})();const hex='#'+shade.toString(16).padStart(2,'0').repeat(3);q('.n27-contrast').style.setProperty('--n27-ink',hex);q('.n27-number').textContent=ratio.toFixed(2)+':1';root.dataset.state=ratio>=3?'above-3':'below-3';say('대비 '+ratio.toFixed(2)+':1','Contrast '+ratio.toFixed(2)+':1');}
  if(key==='n27-nineslice'){q('.n27-nine').style.setProperty('--n27-nine-size',range.value+'px');root.dataset.width=range.value;say('패널 너비 '+range.value+'px','Panel width '+range.value+'px');}
  if(key==='n27-deadzone'){const v=Number(range.value),out=Math.abs(v)<20?0:Math.round(Math.sign(v)*(Math.abs(v)-20)/80*100);q('.n27-deadzone-pin').style.left=(50+v/2)+'%';q('.n27-number').textContent='OUTPUT '+out+'%';root.dataset.output=String(out);say('출력 '+out+'%','Output '+out+'%');}
 },{signal});
 const hold=q('.n27-stage [data-n27=primary]')||q('[data-n27=primary]');
 if(key==='n27-variablejump'&&hold){let start=0;on(hold,'pointerdown',()=>{start=performance.now();});on(hold,'pointerup',()=>{if(!start)return;held=Math.min(1,(performance.now()-start)/950);start=0;const h=Math.round(18+held*66);root.dataset.height=String(h);q('.n27-jump-label').textContent=Math.round(held*100)+'%';animate(q('.n27-player'),[{transform:'translateY(0)'},{transform:'translateY(-'+h+'px)'},{transform:'translateY(0)'}],730);say('점프 높이 '+h+'px','Jump height '+h+'px');});on(hold,'keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!start)start=performance.now();});on(hold,'keyup',e=>{if((e.key==='Enter'||e.key===' ')&&start){held=Math.min(1,(performance.now()-start)/950);start=0;const h=Math.round(18+held*66);root.dataset.height=String(h);animate(q('.n27-player'),[{transform:'translateY(0)'},{transform:'translateY(-'+h+'px)'},{transform:'translateY(0)'}],730);say('점프 높이 '+h+'px','Jump height '+h+'px');}});}
 if(key==='n27-stamina')repeat(()=>{if(value<100){value=Math.min(100,value+5);setMeter(value);q('.n27-number').textContent=value+' / 100';}},300);
 if(key==='n27-fog'){const show=i=>{const c=i%8,r=Math.floor(i/8);all('[data-fog]').forEach(el=>{const j=Number(el.dataset.fog),dist=Math.abs(j%8-c)+Math.abs(Math.floor(j/8)-r);if(dist<=2){el.classList.add('revealed');el.textContent='·';}});root.dataset.revealed=String(all('.revealed').length);say('시야가 확장되었습니다.','Vision area revealed.');};all('[data-fog]').forEach(el=>{on(el,'click',()=>show(Number(el.dataset.fog)));on(el,'focus',()=>show(Number(el.dataset.fog)));});}
 return {kind:key,dispose(){ctrl.abort();for(const id of timers){clearTimeout(id);clearInterval(id);} }};
}
function code(entry,lang='ko',css=''){
 const item=byId.get(entry?.id);if(!item)return '';
 const title=esc(lang==='en'?item[2]:item[3]);
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' · ATLAS example</title><style>body{background:#111e33;margin:0;color:white;font:16px system-ui}main{max-width:720px;margin:25px auto;padding:20px}.n27-host{height:345px}'+css+'</style></head><body><main><h1>'+title+'</h1><div id="demo" class="n27-host"></div></main><script>'+source+';const node=document.getElementById("demo");node.innerHTML=AtlasNext.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const instance=AtlasNext.mount(node.firstElementChild,'+JSON.stringify(item[1])+','+JSON.stringify(lang)+');window.addEventListener("pagehide",()=>instance.dispose(),{once:true});</'+'script></body></html>';
}
function attachAtlas32(){
 const host=global.Atlas32;if(!host||host.__atlasNextAttached)return false;
 host.__atlasNextAttached=true;
 const old={recipe:host.recipe,markup:host.markup,art:host.art,mount:host.mount,code:host.code};
 host.recipe=e=>byId.get(e?.id)?.[1]||old.recipe(e);
 host.markup=(key,lang)=>supports(key)?markup(key,lang):old.markup(key,lang);
 host.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-next" data-preview-key="'+esc(item[1])+'">'+markup(item[1],lang)+'</div>',mode:'native',previewType:'실행형 예시',key:item[1],specific:true}:old.art(e,lang);};
 host.mount=(scope=document)=>{old.mount(scope);const roots=scope.matches?.('.n27-stage')?[scope]:[...scope.querySelectorAll('.n27-stage')];for(const root of roots)if(!root.__n27Instance)root.__n27Instance=mount(root,root.dataset.n27Kind,root.getAttribute('lang')||'ko');};
 host.code=(e,lang)=>byId.has(e?.id)?code(e,lang,global.AtlasNext.styles||''):old.code(e,lang);
 return true;
}
const source='('+initAtlasNext.toString()+')(window);';
global.AtlasNext={supports,markup,mount,code,ITEMS,byId,source,attachAtlas32,styles:''};
if(global.Atlas32)attachAtlas32();
})(window);
