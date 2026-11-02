/* ATLAS v3.17 — original, self-contained 2D AI, narrative and simulation studies.
 * No network, storage, audio or external assets. Browser demonstrations, not native engine runtimes.
 */
(function initAtlasAILab(global){
'use strict';
const ITEMS=[
 ['dar-5cd15e048690','ai-tree','Behavior Tree','행동 트리'],
 ['dar-b569fb792f89','ai-utility','Utility AI','효용 기반 AI'],
 ['dar-0b391b6b3a3d','ai-goap','GOAP','목표 지향 행동 계획'],
 ['dar-5dec66dcbb8c','ai-board','Blackboard','블랙보드'],
 ['dar-1b955a06b5e8','ai-steer','Steering Behavior','조향 행동'],
 ['dar-3679b0bfa61e','ai-perception','Perception System','인지 시스템'],
 ['dar-8f31911d07e0','ai-aggro','Aggro','어그로'],
 ['dar-da93074fb164','ai-spawn','Spawn System','생성 시스템'],
 ['dar-b87ed595ef1b','ai-encounter','Encounter','인카운터'],
 ['dar-ea34b69ffcff','ai-dialogue','Branching Dialogue','분기 대화'],
 ['dar-b886daf8258c','ai-quest','Quest Graph','퀘스트 그래프'],
 ['dar-ff933ea044d5','ai-bark','Bark','상황 단발 대사'],
 ['dar-9242dca19b0d','ai-cutscene','Cutscene','컷신'],
 ['dar-7d368035df16','ai-ecs','Entity Component System','엔티티·컴포넌트·시스템'],
 ['dar-8490b4667f1a','ai-prefab','Prefab / Packed Scene','재사용 객체 묶음'],
 ['dar-9d6b92be66d5','ai-loop','Game Loop','게임 루프'],
 ['dar-2c87c0685a04','ai-fixed','Fixed Timestep','고정 시간 간격'],
 ['dar-9b40139f4d28','ai-delta','Delta Time','델타 타임'],
 ['dar-b3f44aefbd20','ai-telemetry','Telemetry','텔레메트리'],
 ['dar-69464f7b94e3','ai-flow','Flow Field','흐름장'],
 ['dar-76fd019d7366','ai-life','Cellular Automata','셀룰러 오토마타'],
 ['dar-d4eca7a2d5b6','ai-grammar','Graph Grammar','그래프 문법'],
 ['dar-bfc83a726aed','ai-lsystem','L-system','L 시스템'],
 ['dar-1683a55eeee0','ai-terrain','Terrain Rules','지형 연결 규칙']
];
// KO label, EN label, minimum, maximum, initial, step, unit
const PARAMS={
 'ai-tree':['거리','Distance',0,100,60,5,''],
 'ai-utility':['허기','Hunger',0,100,60,5,'%'],
 'ai-board':['경계도','Alert',0,100,30,10,'%'],
 'ai-steer':['가속 한도','Max force',20,150,80,10,''],
 'ai-perception':['시야 거리','Sight range',40,220,140,10,''],
 'ai-aggro':['감쇠율','Decay',0,50,10,5,'%'],
 'ai-spawn':['최대 개체','Capacity',1,8,4,1,''],
 'ai-encounter':['예산','Budget',2,12,6,1,''],
 'ai-cutscene':['장면 길이','Duration',2,8,4,1,'s'],
 'ai-ecs':['시간 간격','Time step',1,10,5,1,'×0.1s'],
 'ai-prefab':['원본 체력','Template HP',10,100,100,10,''],
 'ai-loop':['속도','Speed',10,100,60,10,'/s'],
 'ai-fixed':['프레임 간격','Frame time',10,100,33,1,'ms'],
 'ai-delta':['비교 FPS','Compared FPS',15,120,60,15,''],
 'ai-lsystem':['분기 각도','Branch angle',15,45,25,5,'°']
};
const ACTIONS={
 'ai-tree':['평가·진행','Tick','시야 전환','Visibility'],
 'ai-utility':['행동 선택','Choose','피로 추가','Add fatigue'],
 'ai-goap':['계획 실행','Execute','도끼 전환','Toggle axe'],
 'ai-board':['대상 발견','Target','기억 비우기','Clear'],
 'ai-steer':['한 단계','Step','추적↔회피','Seek / flee'],
 'ai-perception':['방향 회전','Rotate','벽 전환','Toggle wall'],
 'ai-aggro':['위협 추가','Threat +','감쇠 적용','Decay'],
 'ai-spawn':['0.5초 진행','+0.5s','개체 제거','Remove'],
 'ai-encounter':['새 편성','Recompose','하나 처치','Defeat one'],
 'ai-dialogue':['협력 선택','Cooperate','다른 선택','Alternative'],
 'ai-quest':['다음 목표','Next goal','보고 시도','Try report'],
 'ai-bark':['이벤트 발생','Trigger','2초 진행','+2s'],
 'ai-cutscene':['0.5초 진행','+0.5s','건너뛰기','Skip'],
 'ai-ecs':['시스템 실행','Update','B 속도 전환','B velocity'],
 'ai-prefab':['인스턴스 생성','Clone','마지막 피해','Damage last'],
 'ai-loop':['단계 진행','Next phase','방향 전환','Reverse'],
 'ai-fixed':['프레임 입력','Feed frame','지터 100ms','Jitter 100ms'],
 'ai-delta':['1초 비교','Compare 1s','1프레임','One frame'],
 'ai-telemetry':['성공 기록','Success','실패 기록','Failure'],
 'ai-flow':['경로 한 칸','Move','목표 전환','Change goal'],
 'ai-life':['다음 세대','Generation','글라이더','Glider'],
 'ai-grammar':['규칙 적용','Rewrite','규칙 전환','Change rule'],
 'ai-lsystem':['세대 추가','Grow','규칙 전환','Change rule'],
 'ai-terrain':['지형 추가','Add land','마스크 표시','Show masks']
};
const SCOPES={
 'ai-tree':['선택·순서 노드의 작은 실행기입니다. Unreal 런타임은 아닙니다.','A small selector/sequence executor, not the Unreal runtime.'],
 'ai-utility':['공개된 예시 점수로 선택합니다. 학습 모델이나 검증된 밸런스는 아닙니다.','Illustrative scores, not a trained model or validated balancing.'],
 'ai-goap':['세 가지 행동을 비용 순으로 탐색합니다. 목표는 불 피우기입니다.','Uniform-cost planning over three actions; the goal is a fire.'],
 'ai-board':['두 에이전트가 한 메모리 객체의 변경을 읽습니다.','Two agents read changes from one in-memory object.'],
 'ai-steer':['2D 추적·회피 및 도착 감속입니다. 장애물 충돌은 생략합니다.','2D seek/flee with arrival slowing; no collision response.'],
 'ai-perception':['90° 시야·거리·단일 벽 가림을 계산합니다. 점을 눌러 옮기세요.','90° sight, range and one-wall occlusion. Click to move the target.'],
 'ai-aggro':['가상 위협값의 최댓값을 선택합니다. 동점은 앞선 대상을 선택합니다.','Highest illustrative threat wins; ties prefer the first actor.'],
 'ai-spawn':['1초마다 생성하며 정원을 지킵니다. 시연 시간은 수동 진행입니다.','Spawns every simulated second within capacity; time is explicit.'],
 'ai-encounter':['비용 1·2·3의 개체를 예산 안에서 편성하는 작은 예제입니다.','A small encounter composition with unit costs 1, 2 and 3.'],
 'ai-dialogue':['작성된 분기와 신뢰·열쇠 조건입니다. 생성형 대화는 아닙니다.','Authored branches with trust/key gates, not generated dialogue.'],
 'ai-quest':['A 이후 B·C를 모두 완료해야 D를 보고할 수 있습니다.','Complete A, then both B and C before reporting D.'],
 'ai-bark':['텍스트 대사와 2초 재사용 대기입니다. 음성은 재생하지 않습니다.','Text-only barks with a two-second cooldown; no audio.'],
 'ai-cutscene':['직접 그린 2D 장면과 시점별 신호입니다. 영상 파일은 아닙니다.','Original 2D scene with timeline cues, not a video file.'],
 'ai-ecs':['위치·속도가 모두 있는 개체만 갱신하는 작은 ECS입니다.','A small ECS updates only entities with position and velocity.'],
 'ai-prefab':['원본을 깊은 복사합니다. 엔진 자산 상속은 구현하지 않습니다.','Deep-copy instantiation, not native engine asset inheritance.'],
 'ai-loop':['입력→갱신→표시를 분리합니다. 재생 속도는 관찰용입니다.','Input → update → render are separate; playback is slowed.'],
 'ai-fixed':['20ms 고정 간격과 잔여 누산기입니다. 물리 엔진은 아닙니다.','20ms fixed steps and a residual accumulator, not a physics engine.'],
 'ai-delta':['60단위/초 이동과 1단위/프레임 이동을 같은 시간에 비교합니다.','Compares 60 units/second with 1 unit/frame over equal time.'],
 'ai-telemetry':['직접 누른 가상 사건만 메모리에 기록합니다. 외부 전송은 없습니다.','Only your explicit demo events are recorded in memory; no upload.'],
 'ai-flow':['9×5 격자 BFS 거리장을 계산합니다. 칸 클릭으로 벽을 바꾸세요.','BFS distance field on a 9×5 grid. Click cells to edit walls.'],
 'ai-life':['B3/S23 규칙·닫힌 경계입니다. 칸을 눌러 생존 상태를 바꾸세요.','B3/S23 with dead boundaries. Click to edit live cells.'],
 'ai-grammar':['방 노드를 직렬 또는 분기로 치환합니다. 최대 12개 노드입니다.','Rewrites a room into a sequence or fork; capped at 12 nodes.'],
 'ai-lsystem':['문자열 치환과 거북이 그리기입니다. 최대 4세대입니다.','String rewriting and turtle drawing, capped at generation 4.'],
 'ai-terrain':['상하좌우 동일 지형의 4비트 마스크를 다시 계산합니다.','Recalculates four-bit N/E/S/W matching-terrain masks.']
};
const PLAYABLE=new Set(['ai-steer','ai-spawn','ai-cutscene','ai-ecs','ai-loop','ai-life']);
const byId=new Map(ITEMS.map(i=>[i[0],i])),byKey=new Map(ITEMS.map(i=>[i[1],i]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const copy=x=>JSON.parse(JSON.stringify(x));
const W=9,H=5,neighbors=i=>[i>=W?i-W:-1,i%W<W-1?i+1:-1,i<W*(H-1)?i+W:-1,i%W?i-1:-1].filter(x=>x>=0);
// Pure rules are exported for reproducible boundary and invariant tests.
const rules={
 plan(start){
  const actions=[{id:'axe',cost:1,ok:s=>!s.axe,apply:s=>({...s,axe:true})},{id:'wood',cost:1,ok:s=>s.axe&&!s.wood,apply:s=>({...s,wood:true})},{id:'fire',cost:1,ok:s=>s.wood&&!s.fire,apply:s=>({...s,fire:true})}];
  const queue=[{state:{...start},cost:0,path:[]}],visited=new Map();
  while(queue.length){queue.sort((a,b)=>a.cost-b.cost);const n=queue.shift(),id=JSON.stringify([n.state.axe,n.state.wood,n.state.fire]);if(visited.has(id)&&visited.get(id)<=n.cost)continue;visited.set(id,n.cost);if(n.state.fire)return n.path;for(const a of actions)if(a.ok(n.state))queue.push({state:a.apply(n.state),cost:n.cost+a.cost,path:[...n.path,a.id]});}return null;
 },
 field(walls,goal){const d=Array(W*H).fill(Infinity),queue=[goal];if(walls[goal])return d;d[goal]=0;for(let j=0;j<queue.length;j++)for(const v of neighbors(queue[j]))if(!walls[v]&&!Number.isFinite(d[v])){d[v]=d[queue[j]]+1;queue.push(v);}return d;},
 life(cells){return cells.map((live,i)=>{const x=i%W,y=Math.floor(i/W);let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&x+dx>=0&&x+dx<W&&y+dy>=0&&y+dy<H)n+=Number(!!cells[(y+dy)*W+x+dx]);return n===3||(live&&n===2);});},
 masks(cells){return cells.map((v,i)=>{let bits=0;const x=i%W,y=Math.floor(i/W);if(y>0&&cells[i-W]===v)bits|=1;if(x<W-1&&cells[i+1]===v)bits|=2;if(y<H-1&&cells[i+W]===v)bits|=4;if(x>0&&cells[i-1]===v)bits|=8;return bits;});},
 perceive(target,heading,radius,wall){const dx=target.x-45,dy=target.y-65,distance=Math.hypot(dx,dy);const diff=Math.atan2(Math.sin(Math.atan2(dy,dx)-heading),Math.cos(Math.atan2(dy,dx)-heading));let occluded=false;if(wall&&dx>0){const t=(135-45)/dx,y=65+t*dy;occluded=t>0&&t<1&&y>=30&&y<=105;}return {visible:distance<=radius&&Math.abs(diff)<=Math.PI/4&&!occluded,distance,occluded};},
 steer(s,force,dt){const dx=s.target.x-s.x,dy=s.target.y-s.y,d=Math.hypot(dx,dy),sign=s.flee?-1:1,speed=s.flee?60:60*Math.min(1,d/45);const vx=d>1e-8?sign*dx/d*speed:0,vy=d>1e-8?sign*dy/d*speed:0;let ax=(vx-s.vx)*3,ay=(vy-s.vy)*3;const a=Math.hypot(ax,ay);if(a>force){ax=ax/a*force;ay=ay/a*force;}s.vx+=ax*dt;s.vy+=ay*dt;s.x=clamp(s.x+s.vx*dt,8,272);s.y=clamp(s.y+s.vy*dt,8,122);if(s.x===8||s.x===272)s.vx=0;if(s.y===8||s.y===122)s.vy=0;return s;},
 fixed(s,ms){s.elapsed+=ms;s.acc+=ms;while(s.acc>=20){s.acc-=20;s.steps++;s.x+=1.2;}return s;},
 pack(budget,offset=0){const costs=[1,2,3],list=[];let spent=0,k=offset;while(spent<budget&&list.length<12){let cost=costs[k++%3];if(cost>budget-spent)cost=1;list.push(cost);spent+=cost;}return list;},
 lsystem(generation,angle,branch=false){let word='F';const replacement=branch?'F[+F][-F]':'F[+F]F[-F]F';for(let i=0;i<clamp(generation,0,4);i++)word=word.replace(/F/g,replacement);let x=0,y=0,h=-Math.PI/2;const stack=[],lines=[];for(const c of word){if(c==='F'){const nx=x+Math.cos(h),ny=y+Math.sin(h);lines.push([x,y,nx,ny]);x=nx;y=ny;}else if(c==='+')h+=angle*Math.PI/180;else if(c==='-')h-=angle*Math.PI/180;else if(c==='[')stack.push([x,y,h]);else if(c===']')[x,y,h]=stack.pop();}return {word,lines};}
};
const css=`
.ai-stage{position:relative;display:grid;grid-template-rows:minmax(80px,1fr) auto auto auto auto;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;isolation:isolate;background:#152b40;color:#eff7ff;font:14px/1.35 system-ui,sans-serif}
.ai-stage *{box-sizing:border-box}.ai-stage button,.ai-stage input,.ai-stage output,.ai-stage span,.ai-stage p,.ai-stage b,.ai-stage strong,.ai-stage label,.ai-stage code{font-size:14px;line-height:1.3}.ai-stage button{font:600 14px/1.2 system-ui;min-height:30px;border:1px solid #789cb7;border-radius:7px;background:#264964;color:#eff8ff;padding:5px 8px;cursor:pointer}.ai-stage button:hover{background:#35627b}.ai-stage button:disabled{opacity:.55;cursor:not-allowed}.ai-stage button:focus-visible,.ai-stage input:focus-visible,.ai-stage [tabindex]:focus-visible{outline:3px solid #ffd27b;outline-offset:2px}.ai-stage button[aria-pressed=true]{border-color:#9fe8cb;background:#316953}
.ai-visual{min-height:0;min-width:0;padding:8px 10px;overflow:auto;overscroll-behavior:contain;display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:5px;background:radial-gradient(ellipse at 20% 0%,#23465b,#13283d);scrollbar-width:thin}.ai-visual svg{display:block;max-width:100%;flex:none}.ai-visual .ai-canvas{width:100%;height:108px;min-height:50px;max-height:130px;flex:1 1 75px;touch-action:manipulation}.ai-canvas[tabindex]{cursor:crosshair}.ai-readout{flex-shrink:0;width:100%;font:14px/1.3 ui-monospace,monospace;text-align:center;white-space:normal;overflow-wrap:anywhere;margin:0;color:#d3e9f4}.ai-controls{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px;padding:5px 7px;border-top:1px solid #36546b}.ai-controls button{flex:0 1 auto}.ai-controls [data-ai=reset]{margin-left:auto;min-width:30px}.ai-param{display:flex;align-items:center;gap:7px;min-width:0;padding:0 9px 5px;margin:0}.ai-param input{flex:1;min-width:30px;width:60px;height:24px;margin:0;accent-color:#8bd6bd}.ai-param span{white-space:nowrap}.ai-param output{min-width:33px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.ai-status{margin:0;padding:4px 8px;color:#d0f0dd;background:#17382f;max-height:43px;overflow:auto;text-align:center}.ai-scope{margin:0;padding:5px 8px;background:#102338;color:#b8cfdf;max-height:43px;overflow:auto;overscroll-behavior:contain}.ai-row{display:flex;gap:7px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%}.ai-node{display:inline-flex;align-items:center;justify-content:center;border:1px solid #64859d;background:#1e3f55;color:#d6eaf4;border-radius:7px;padding:6px 9px;min-width:44px}.ai-node.active{background:#31715c;color:#fff;border-color:#9ce2c3}.ai-node.muted{opacity:.6}.ai-bars{width:100%;max-width:290px;display:grid;gap:5px}.ai-bar{display:grid;grid-template-columns:64px 1fr 32px;gap:6px;align-items:center}.ai-track{height:12px;background:#35516a;border-radius:7px;overflow:hidden}.ai-fill{height:100%;background:#8bdec0;transition:width .16s}.ai-grid{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:2px;width:100%;max-width:270px;flex:none}.ai-grid + .ai-readout{display:none}.ai-grid button{font-size:14px;line-height:1;min-height:22px;height:22px;padding:1px;min-width:0;border-radius:3px;overflow:hidden;background:#203f57}.ai-grid button.ai-cell-on{background:#6fbaa2;color:#102b29}.ai-grid button.ai-cell-wall{background:#677780;color:#101c25}.ai-grid button.ai-cell-goal{background:#d9b96b;color:#1a2c39}.ai-grid button.ai-cell-agent{background:#b6d6fb;color:#182a40}.ai-dialogue{margin:0;width:100%;max-width:320px;padding:9px 10px;background:#25465a;border-left:3px solid #99d7bc;border-radius:8px}.ai-log{max-height:61px;overflow:auto;margin:0;padding:0;width:100%;list-style:none;font-family:ui-monospace,monospace}.ai-log li{font-size:14px;padding:1px 3px;white-space:normal;overflow-wrap:anywhere}.ai-counter{font:700 24px/1.2 ui-monospace,monospace!important;color:#a1e1c5}.ai-token{display:flex;flex-direction:column;align-items:center;justify-content:center;width:46px;height:46px;border-radius:9px;background:#2d576e;border:1px solid #759cad;color:#fff}.ai-visual .ai-flash{animation:ai-flash .22s ease-out}@keyframes ai-flash{from{opacity:.45;transform:translateY(3px)}to{opacity:1;transform:none}}
@media(max-width:390px){.ai-controls{gap:4px;padding:5px}.ai-controls button{padding:5px 6px}.ai-param{gap:4px}.ai-visual{padding:6px 8px}.ai-bar{grid-template-columns:54px 1fr 30px}}
@media(prefers-reduced-motion:reduce){.ai-stage *{animation:none!important;transition:none!important}}html.motion-paused .ai-stage *,body.motion-paused .ai-stage *,html[data-motion=off] .ai-stage *{animation:none!important;transition:none!important}
@media(forced-colors:active){.ai-stage button{forced-color-adjust:auto}.ai-track{border:1px solid CanvasText}.ai-fill{background:Highlight}.ai-node.active{border:3px solid Highlight}}
`;
let observer;const active=new Set();
function install(){if(document.getElementById('atlas-ai-v317'))return;const style=document.createElement('style');style.id='atlas-ai-v317';style.textContent=css;document.head.append(style);}
function markup(key,lang='ko'){
 const en=lang==='en',item=byKey.get(key),a=ACTIONS[key],p=PARAMS[key];if(!item)throw Error('Unknown AI study '+key);
 return '<div class="ai-stage" data-ai-key="'+key+'" lang="'+(en?'en':'ko')+'"><div class="ai-visual" aria-label="'+esc(item[en?2:3])+'"></div><div class="ai-controls"><button type="button" data-ai="step">'+a[en?1:0]+'</button><button type="button" data-ai="alt">'+a[en?3:2]+'</button>'+(PLAYABLE.has(key)?'<button type="button" data-ai="play" aria-pressed="false">'+(en?'Play':'재생')+'</button>':'')+'<button type="button" data-ai="reset" aria-label="'+(en?'Reset':'초기화')+'" title="'+(en?'Reset':'초기화')+'">↺</button></div>'+(p?'<label class="ai-param"><span>'+p[en?1:0]+'</span><input type="range" data-ai-range min="'+p[2]+'" max="'+p[3]+'" value="'+p[4]+'" step="'+p[5]+'"><output>'+p[4]+p[6]+'</output></label>':'<div></div>')+'<p class="ai-status" role="status" aria-live="polite">'+(en?'Ready · use the controls':'준비 · 버튼으로 조작하세요')+'</p><p class="ai-scope" tabindex="0">'+SCOPES[key][en?1:0]+'</p></div>';
}
function mount(root,key=root.dataset.aiKey,lang=root.lang||'ko'){
 if(root.__aiStudy)return root.__aiStudy;if(!byKey.has(key))throw Error('Unknown study '+key);
 const en=lang==='en',t=(ko,english)=>en?english:ko,ac=new AbortController(),q=s=>root.querySelector(s),visual=q('.ai-visual'),range=q('[data-ai-range]');
 let s,disposed=false,visible=true,raf=0,last=0,elapsed=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const say=text=>{q('.ai-status').textContent=text;};
 const mark=()=>{s.actions++;root.dataset.state='changed';root.dataset.revision=String(s.actions);};
 const node=(text,on=false,attrs='')=>'<span class="ai-node'+(on?' active':'')+'" '+attrs+'>'+esc(text)+'</span>';
 const button=(id,label,on=false,disabled=false)=>'<button type="button" data-node="'+id+'" aria-pressed="'+on+'"'+(disabled?' disabled':'')+'>'+esc(label)+'</button>';
 const row=html=>'<div class="ai-row">'+html+'</div>';
 const info=text=>'<p class="ai-readout">'+esc(text)+'</p>';
 const svg=html=>'<svg class="ai-canvas" viewBox="0 0 280 130" aria-hidden="true">'+html+'</svg>';
 const circle=(x,y,r,fill='#9bddc1')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
 const line=(x1,y1,x2,y2,color='#90b4c9',width=2)=>'<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" fill="none" stroke="'+color+'" stroke-width="'+width+'"/>';
 const bar=(label,value,max=100)=>'<div class="ai-bar"><span>'+esc(label)+'</span><div class="ai-track"><div class="ai-fill" style="width:'+clamp(value/max*100,0,100)+'%"></div></div><b>'+Math.round(value)+'</b></div>';
 function base(){return {param:PARAMS[key]?.[4]??0,actions:0,steps:0,seen:true,distance:60,decision:'',energy:60,hunger:60,world:{axe:false,wood:false,fire:false},plan:[],board:{target:false,alert:30,version:0},x:35,y:65,vx:0,vy:0,target:{x:235,y:65},flee:false,heading:0,wall:false,threat:[20,30,10],selected:0,clock:0,nextSpawn:1,nextId:1,entities:[],wave:0,pack:[1,2,3],dialogue:'gate',trust:0,hasKey:false,quests:[],bark:'',lastBark:-Infinity,barkCount:0,time:0,cues:[],skipped:false,ecs:[{id:'A',position:25,velocity:20},{id:'B',position:80},{id:'C',position:140,velocity:30}],template:{hp:100,speed:10},instances:[{id:1,hp:100,speed:10}],phase:0,direction:1,pending:0,displayX:0,acc:0,elapsed:0,seconds:0,byTime:0,byFrame:0,frames:0,events:[],eventSeq:0,success:0,fail:0,goal:44,agent:0,walls:Array.from({length:45},(_,i)=>i%9===4&&Math.floor(i/9)!==2),cells:Array.from({length:45},(_,i)=>[21,22,23].includes(i)),generation:0,nodes:[{id:'S',kind:'start'},{id:'R0',kind:'room'},{id:'G',kind:'goal'}],edges:[['S','R0'],['R0','G']],serial:1,branch:false,showMasks:false,terrain:Array.from({length:45},(_,i)=>[12,13,14,21,22,23,30,31,32].includes(i))};}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;elapsed=0;root.dataset.playing='false';const b=q('[data-ai=play]');if(b){b.textContent=t('재생','Play');b.setAttribute('aria-pressed','false');}}
 function blocked(){return reduced.matches||document.documentElement.matches('.motion-paused,[data-motion="off"]')||document.body?.classList.contains('motion-paused');}
 function reset(){stop();s=base();if(key==='ai-goap')s.plan=rules.plan(s.world);if(key==='ai-fixed'||key==='ai-loop')s.x=0;root.dataset.state='ready';root.dataset.revision='0';if(range)range.value=String(s.param);render();say(t('초기화 · 버튼으로 조작하세요','Reset · use the controls'));}
 function grid(kind){const distances=kind==='flow'?rules.field(s.walls,s.goal):null,masks=kind==='terrain'?rules.masks(s.terrain):null;let html='<div class="ai-grid" aria-label="'+t('9열 5행 편집 격자','Editable 9 by 5 grid')+'">';for(let i=0;i<45;i++){
   let text='·',cls='',label='';if(kind==='flow'){let next=-1;if(Number.isFinite(distances[i])&&distances[i]>0)next=neighbors(i).find(n=>distances[n]<distances[i])??-1;text=s.walls[i]?'■':i===s.agent?'●':i===s.goal?'★':next<0?'×':next===i-9?'↑':next===i+9?'↓':next===i+1?'→':'←';cls=s.walls[i]?'ai-cell-wall':i===s.agent?'ai-cell-agent':i===s.goal?'ai-cell-goal':'';label=t('거리 ','Distance ')+(Number.isFinite(distances[i])?distances[i]:t('도달 불가','unreachable'));}else if(kind==='life'){text=s.cells[i]?'●':'·';cls=s.cells[i]?'ai-cell-on':'';label=s.cells[i]?t('생존','alive'):t('비어 있음','empty');}else{text=s.showMasks?String(masks[i]):s.terrain[i]?'■':'~';cls=s.terrain[i]?'ai-cell-on':'';label=t('연결 마스크 ','Connection mask ')+masks[i];}
   html+='<button type="button" data-cell="'+i+'" class="'+cls+'" aria-label="'+t('행 ','Row ')+(Math.floor(i/9)+1)+t(' 열 ',' column ')+(i%9+1)+' · '+label+'">'+text+'</button>';}
   return html+'</div>';
 }
 function render(){
  const focused=visual.contains(document.activeElement)?document.activeElement:null,focusAttr=focused?.hasAttribute('data-cell')?['data-cell',focused.dataset.cell]:focused?.hasAttribute('data-node')?['data-node',focused.dataset.node]:null;
  let html='';
  if(key==='ai-tree'){const seen=s.seen&&s.distance<=70,near=seen&&s.distance<=25;html=row(node(t('선택 노드','Selector'),true))+row(node(t('대상 확인','Visible'),seen)+node('→')+node(t('거리 검사','Near'),near))+row(node(t('공격','Attack'),s.decision==='attack')+node(t('추적','Chase'),s.decision==='chase')+node(t('순찰','Patrol'),s.decision==='patrol'))+info('tick '+s.steps+' · '+(s.decision||t('미평가','not evaluated'))+' · d='+s.distance);}
  else if(key==='ai-utility'){const scores=[s.hunger,100-s.energy,30];html='<div class="ai-bars">'+bar(t('식사','Eat'),scores[0])+bar(t('휴식','Rest'),scores[1])+bar(t('탐험','Explore'),scores[2])+'</div>'+info(t('선택: ','Selected: ')+(s.decision||'—'));}
  else if(key==='ai-goap'){html=row(['axe','wood','fire'].map(k=>node(({axe:t('도끼','Axe'),wood:t('나무','Wood'),fire:t('불','Fire')})[k],s.world[k])).join(''))+info(s.plan.length?s.plan.join(' → '):t('목표 달성','Goal achieved'))+info(t('실행 비용: ','Executed cost: ')+s.steps);}
  else if(key==='ai-board'){const action=s.board.target?(s.board.alert>=60?t('추적','Chase'):t('관찰','Watch')):t('순찰','Patrol');html=row(node('Shared memory · v'+s.board.version,true))+info('target: '+s.board.target+' · alert: '+s.board.alert)+row(node('A → '+action)+node('B → '+action));}
  else if(key==='ai-steer'){html=svg(line(s.x,s.y,s.target.x,s.target.y,'#45667e',1)+circle(s.target.x,s.target.y,9,'#edc878')+circle(s.x,s.y,9)+line(s.x,s.y,s.x+s.vx*.5,s.y+s.vy*.5,'#dff6ee',2))+info((s.flee?'FLEE':'SEEK')+' · v='+Math.hypot(s.vx,s.vy).toFixed(1)+' · '+t('클릭으로 목표 이동','click to move target'));}
  else if(key==='ai-perception'){const p=rules.perceive(s.target,s.heading,s.param,s.wall),a=s.heading-Math.PI/4,b=s.heading+Math.PI/4;const cone='<path d="M45 65 L'+(45+s.param*Math.cos(a))+' '+(65+s.param*Math.sin(a))+' A'+s.param+' '+s.param+' 0 0 1 '+(45+s.param*Math.cos(b))+' '+(65+s.param*Math.sin(b))+' Z" fill="#6aaea533" stroke="#6aaea5"/>';html=svg(cone+(s.wall?line(135,30,135,105,'#c98d7b',8):'')+circle(45,65,7)+circle(s.target.x,s.target.y,9,p.visible?'#9bddc1':'#edc878'))+info((p.visible?t('탐지','Detected'):t('미탐지','Not detected'))+' · d='+p.distance.toFixed(0)+(p.occluded?t(' · 벽 가림',' · occluded'):''));}
  else if(key==='ai-aggro'){const winner=s.threat.indexOf(Math.max(...s.threat));html=row(s.threat.map((v,i)=>button('actor-'+i,String.fromCharCode(65+i),s.selected===i)).join(''))+'<div class="ai-bars">'+s.threat.map((v,i)=>bar(String.fromCharCode(65+i),v,Math.max(100,...s.threat))).join('')+'</div>'+info(t('대상: ','Target: ')+String.fromCharCode(65+winner));}
  else if(key==='ai-spawn'){html=row(s.entities.length?s.entities.map(e=>'<span class="ai-token">#'+e.id+'</span>').join(''):node(t('생성 대기','Waiting')))+info(s.entities.length+'/'+s.param+' · t='+s.clock.toFixed(1)+'s · '+t('간격 1s','interval 1s'));}
  else if(key==='ai-encounter'){html=row(s.pack.length?s.pack.map(c=>'<span class="ai-token">'+['',t('정찰','Scout'),t('경비','Guard'),t('중갑','Heavy')][c]+'<b>'+c+'</b></span>').join(''):node(t('구역 정리','Cleared')))+info(t('편성 비용 ','Cost ')+s.pack.reduce((a,b)=>a+b,0)+' / '+s.param+' · #'+(s.wave+1));}
  else if(key==='ai-dialogue'){const text={gate:t('문지기: 길을 찾고 있나요?','Guard: Looking for a way through?'),help:t('문지기: 도와주면 열쇠를 드리죠.','Guard: Help us and earn a key.'),key:t('열쇠를 받았습니다. 안으로 들어갈까요?','You earned a key. Enter?'),inside:t('문이 열렸습니다. 신뢰로 길을 찾았습니다.','The gate opens. Trust made a path.'),closed:t('문이 닫혔습니다. 다른 선택은 초기화 후 가능합니다.','The gate is closed. Reset to explore another choice.')};html='<p class="ai-dialogue">'+text[s.dialogue]+'</p>'+row(node('trust '+s.trust)+node('key '+s.hasKey,s.hasKey))+info('gate → '+s.dialogue);}
  else if(key==='ai-quest'){html=row(['A','B','C','D'].map(n=>button('quest-'+n,n,s.quests.includes(n))).join(''))+info('A → (B + C) → D')+info(t('완료: ','Complete: ')+(s.quests.join(', ')||'—'));}
  else if(key==='ai-bark'){html='<p class="ai-dialogue">'+(s.bark||t('사건이 발생하면 짧은 대사가 표시됩니다.','An event triggers a short line.'))+'</p>'+info('t='+s.clock.toFixed(1)+'s · '+t('남은 대기 ','Cooldown ')+Math.max(0,2-(s.clock-s.lastBark)).toFixed(1)+'s')+info(t('발화 수: ','Lines emitted: ')+s.barkCount);}
  else if(key==='ai-cutscene'){const f=clamp(s.time/s.param,0,1);html=svg('<rect x="0" y="0" width="280" height="130" fill="#1c4059"/><path d="M0 100L65 30L140 100L220 45L280 100V130H0Z" fill="#41655e"/>'+circle(30+220*f,96,9)+'<rect width="280" height="12" fill="#091721"/><rect y="118" width="280" height="12" fill="#091721"/>')+info(s.time.toFixed(1)+' / '+s.param+'s · '+(s.skipped?t('건너뜀','skipped'):s.cues.join(' → ')||t('시작 대기','ready')));}
  else if(key==='ai-ecs'){html=svg(s.ecs.map((e,i)=>line(10,25+i*37,270,25+i*37,'#36546a')+circle(10+(e.position%250),25+i*37,9,e.velocity===undefined?'#a8b2ba':'#9bddc1')).join(''))+info(s.ecs.map(e=>e.id+':'+e.position.toFixed(0)+(e.velocity===undefined?' [no V]':'')).join(' · '));}
  else if(key==='ai-prefab'){html=row(s.instances.map(e=>'<span class="ai-token">#'+e.id+'<b>'+e.hp+'</b></span>').join(''))+info(t('원본 HP ','Template HP ')+s.template.hp+' · '+t('복사본은 독립적','independent copies'));}
  else if(key==='ai-loop'){html=row([t('입력','Input'),t('갱신','Update'),t('표시','Render')].map((v,i)=>node(v,s.phase===i)).join(''))+svg(line(10,70,270,70,'#416278')+circle(20+((s.displayX%240)+240)%240,70,10))+info('model='+s.x.toFixed(1)+' · view='+s.displayX.toFixed(1)+' · '+(s.direction>0?'→':'←'));}
  else if(key==='ai-fixed'){html=row(node('h = 20ms',true)+node('steps '+s.steps))+ '<div class="ai-bars">'+bar(t('잔여','Residual'),s.acc,20)+'</div>'+info('elapsed '+s.elapsed+'ms · x='+s.x.toFixed(1));}
  else if(key==='ai-delta'){html='<div class="ai-bars">'+bar('v × dt',s.byTime,Math.max(120,s.byTime,s.byFrame))+bar('1/frame',s.byFrame,Math.max(120,s.byTime,s.byFrame))+'</div>'+info('t='+s.seconds.toFixed(2)+'s · '+s.param+' FPS · '+s.frames+' frames');}
  else if(key==='ai-telemetry'){const total=s.success+s.fail;html=row(node('success '+s.success)+node('failure '+s.fail))+info((total?(100*s.success/total).toFixed(1):'0.0')+'% · '+t('이 시연에서 직접 입력한 사건','explicit demo events only'))+'<ul class="ai-log">'+s.events.slice(-3).map(e=>'<li>#'+e.id+' '+e.kind+'</li>').join('')+'</ul>';}
  else if(key==='ai-flow'){html=grid('flow')+info(t('클릭: 벽 · ● 시작 ★ 목표','Click: wall · ● agent ★ goal'));}
  else if(key==='ai-life'){html=grid('life')+info('B3/S23 · '+t('세대 ','Generation ')+s.generation+' · '+s.cells.filter(Boolean).length+' alive');}
  else if(key==='ai-grammar'){const rank={S:0};for(let k=0;k<12;k++)for(const [a,b]of s.edges)if(rank[a]!==undefined)rank[b]=Math.max(rank[b]??0,rank[a]+1);const max=Math.max(...Object.values(rank),1),pos={};for(let r=0;r<=max;r++){const nodes=s.nodes.filter(n=>rank[n.id]===r);nodes.forEach((n,i)=>pos[n.id]=[15+r/max*250,25+(i+1)*80/(nodes.length+1)]);}html=svg(s.edges.map(([a,b])=>line(...pos[a],...pos[b])).join('')+s.nodes.map(n=>circle(...pos[n.id],n.kind==='room'?7:5,n.kind==='room'?'#9bddc1':'#ecc472')).join(''))+info((s.branch?'R → fork(R,R)':'R → R → R')+' · '+s.nodes.length+' nodes / '+s.edges.length+' edges');}
  else if(key==='ai-lsystem'){const result=rules.lsystem(s.generation,s.param,s.branch),xs=result.lines.flatMap(l=>[l[0],l[2]]),ys=result.lines.flatMap(l=>[l[1],l[3]]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min(250/(maxX-minX||1),110/(maxY-minY||1));const path=result.lines.map(l=>'M'+(140+(l[0]-(minX+maxX)/2)*scale).toFixed(2)+' '+(120+(l[1]-maxY)*scale).toFixed(2)+'L'+(140+(l[2]-(minX+maxX)/2)*scale).toFixed(2)+' '+(120+(l[3]-maxY)*scale).toFixed(2)).join('');html=svg('<path d="'+path+'" fill="none" stroke="#9bddc1" stroke-width="1.8" stroke-linecap="round"/>')+info('g='+s.generation+' · F '+result.lines.length+' · '+(s.branch?'F[+F][-F]':'F[+F]F[-F]F'));}
  else if(key==='ai-terrain'){html=grid('terrain')+info(t('N=1 · E=2 · S=4 · W=8 · 같은 지형 연결','N=1 · E=2 · S=4 · W=8 · same-terrain links'));}
  visual.innerHTML=html;
  if(range){range.value=String(s.param);const p=PARAMS[key];q('output').textContent=s.param+p[6];range.setAttribute('aria-valuetext',p[en?1:0]+' '+s.param+p[6]);}
  if(focusAttr)visual.querySelector('['+focusAttr[0]+'="'+focusAttr[1]+'"]')?.focus({preventScroll:true});
 }
 function quest(id){if(s.quests.includes(id))return t('이미 완료한 목표입니다.','Already completed.');const deps={A:[],B:['A'],C:['A'],D:['B','C']}[id];if(!deps||!deps.every(n=>s.quests.includes(n)))return t('선행 목표가 필요합니다.','Prerequisites are missing.');s.quests.push(id);return t('완료: ','Completed: ')+id;}
 function dialogue(alternative){if(['inside','closed'].includes(s.dialogue))return t('다른 경로는 초기화 후 선택하세요.','Reset to try another path.');if(alternative){s.dialogue='closed';return t('거절 경로로 이동했습니다.','Took the refusal branch.');}if(s.dialogue==='gate'){s.trust++;s.dialogue='help';}else if(s.dialogue==='help'&&s.trust>=1){s.hasKey=true;s.dialogue='key';}else if(s.dialogue==='key'&&s.hasKey)s.dialogue='inside';return t('대화 상태를 변경했습니다.','Dialogue state changed.');}
 function rewrite(){const room=s.nodes.find(n=>n.kind==='room'),added=s.branch?3:1;if(!room||s.nodes.length+added>12)return false;const a='R'+s.serial++,b='R'+s.serial++,incoming=s.edges.filter(e=>e[1]===room.id),outgoing=s.edges.filter(e=>e[0]===room.id);s.edges=s.edges.filter(e=>!e.includes(room.id));s.nodes=s.nodes.filter(n=>n.id!==room.id);s.nodes.push({id:a,kind:'room'},{id:b,kind:'room'});if(s.branch){const f='F'+s.serial++,j='J'+s.serial++;s.nodes.push({id:f,kind:'fork'},{id:j,kind:'join'});s.edges.push(...incoming.map(e=>[e[0],f]),[f,a],[f,b],[a,j],[b,j],...outgoing.map(e=>[j,e[1]]));}else s.edges.push(...incoming.map(e=>[e[0],a]),[a,b],...outgoing.map(e=>[b,e[1]]));return true;}
 function advance(){
  s.steps++;
  if(key==='ai-steer')rules.steer(s,s.param,.1);
  else if(key==='ai-spawn'){s.clock+=.5;while(s.clock>=s.nextSpawn){if(s.entities.length<s.param)s.entities.push({id:s.nextId++});s.nextSpawn+=1;}}
  else if(key==='ai-cutscene'){const old=s.time;s.time=Math.min(s.param,s.time+.5);[.25,.5,.75,1].forEach((fraction,i)=>{if(old<s.param*fraction&&s.time>=s.param*fraction&&!s.cues.includes('cue'+(i+1)))s.cues.push('cue'+(i+1));});return s.time<s.param;}
  else if(key==='ai-ecs'){for(const e of s.ecs)if(Number.isFinite(e.position)&&Number.isFinite(e.velocity))e.position+=e.velocity*s.param/10;}
  else if(key==='ai-loop'){if(s.phase===0)s.pending=s.direction;else if(s.phase===1)s.x+=s.pending*s.param*.1;else s.displayX=s.x;s.phase=(s.phase+1)%3;}
  else if(key==='ai-life'){s.cells=rules.life(s.cells);s.generation++;}
  return true;
 }
 function act(action){
  if(action==='reset'){reset();return;}if(action==='play'){play();return;}stop();mark();let message='';const alt=action==='alt';
  if(key==='ai-tree'){
   if(alt)s.seen=!s.seen;else{const success='SUCCESS',failure='FAILURE',running='RUNNING';const sequence=children=>{for(const child of children){const r=child();if(r!==success)return r;}return success;};const selector=children=>{for(const child of children){const r=child();if(r!==failure)return r;}return failure;};s.steps++;const seen=()=>s.seen&&s.distance<=70?success:failure;s.result=selector([()=>sequence([seen,()=>s.distance<=25?success:failure,()=>{s.decision='attack';return success;}]),()=>sequence([seen,()=>{s.decision='chase';s.distance=Math.max(25,s.distance-10);return running;}]),()=>{s.decision='patrol';return running;}]);s.param=s.distance;message=s.result;}
  }else if(key==='ai-utility'){if(alt)s.energy=Math.max(0,s.energy-30);else{const values=[s.hunger,100-s.energy,30],i=values.indexOf(Math.max(...values));s.decision=['Eat','Rest','Explore'][i];if(i===0)s.hunger=Math.max(0,s.hunger-40);if(i===1)s.energy=Math.min(100,s.energy+35);if(i===2){s.energy=Math.max(0,s.energy-15);s.hunger=Math.min(100,s.hunger+15);}s.param=s.hunger;}}
  else if(key==='ai-goap'){if(alt){s.world.axe=!s.world.axe;}else{const plan=rules.plan(s.world);if(plan?.length){s.world[plan[0]]=true;s.steps++;}}s.plan=rules.plan(s.world)||[];}
  else if(key==='ai-board'){if(alt)s.board.target=false;else s.board.target=!s.board.target;s.board.version++;}
  else if(key==='ai-steer'){if(alt)s.flee=!s.flee;else advance();}
  else if(key==='ai-perception'){if(alt)s.wall=!s.wall;else s.heading=(s.heading+Math.PI/4)%(Math.PI*2);}
  else if(key==='ai-aggro'){if(alt)s.threat=s.threat.map(v=>v*(1-s.param/100));else s.threat[s.selected]+=15;}
  else if(key==='ai-spawn'){if(alt)s.entities.shift();else advance();}
  else if(key==='ai-encounter'){if(alt)s.pack.shift();else{s.wave++;s.pack=rules.pack(s.param,s.wave);}}
  else if(key==='ai-dialogue')message=dialogue(alt);
  else if(key==='ai-quest'){const next=['A','B','C','D'].find(n=>!s.quests.includes(n));message=quest(alt?'D':next);}
  else if(key==='ai-bark'){if(alt)s.clock+=2;else if(s.clock-s.lastBark>=2){s.bark=[t('저기 불빛이 보여요.','I see a light ahead.'),t('길이 열렸어요.','The path is open.')][s.barkCount%2];s.lastBark=s.clock;s.barkCount++;}else message=t('대기 중: 중복 대사를 막았습니다.','Cooldown: repeated bark suppressed.');}
  else if(key==='ai-cutscene'){if(alt){s.time=s.param;s.skipped=true;if(!s.cues.includes('end'))s.cues.push('end');}else advance();}
  else if(key==='ai-ecs'){if(alt){if(s.ecs[1].velocity===undefined)s.ecs[1].velocity=25;else delete s.ecs[1].velocity;}else advance();}
  else if(key==='ai-prefab'){if(alt)s.instances[s.instances.length-1].hp=Math.max(0,s.instances[s.instances.length-1].hp-20);else if(s.instances.length<5)s.instances.push({...copy(s.template),id:s.instances.length+1});else message=t('최대 5개입니다.','Maximum five instances.');}
  else if(key==='ai-loop'){if(alt)s.direction*=-1;else advance();}
  else if(key==='ai-fixed'){if(alt)[10,50,16,24].forEach(ms=>rules.fixed(s,ms));else rules.fixed(s,s.param);}
  else if(key==='ai-delta'){const frames=alt?1:s.param,dt=1/s.param;for(let i=0;i<frames;i++){s.seconds+=dt;s.byTime+=60*dt;s.byFrame++;s.frames++;}}
  else if(key==='ai-telemetry'){const kind=alt?'failure':'success';s[alt?'fail':'success']++;s.events.push({id:++s.eventSeq,kind});if(s.events.length>20)s.events.shift();}
  else if(key==='ai-flow'){if(alt){s.goal=s.goal===44?8:44;s.walls[s.goal]=false;}else{const d=rules.field(s.walls,s.goal),next=neighbors(s.agent).find(i=>d[i]<d[s.agent]);if(next!==undefined)s.agent=next;else message=s.agent===s.goal?t('목표 도착','Goal reached'):t('도달할 경로가 없습니다.','No reachable path.');}}
  else if(key==='ai-life'){if(alt){s.cells=Array.from({length:45},(_,i)=>[2,12,19,20,21].includes(i));s.generation=0;}else advance();}
  else if(key==='ai-grammar'){if(alt)s.branch=!s.branch;else if(!rewrite())message=t('12개 노드 한도입니다.','Twelve-node limit reached.');}
  else if(key==='ai-lsystem'){if(alt)s.branch=!s.branch;else s.generation=Math.min(4,s.generation+1);}
  else if(key==='ai-terrain'){if(alt)s.showMasks=!s.showMasks;else{const i=s.terrain.findIndex(v=>!v);if(i>=0)s.terrain[i]=true;}}
  render();say(message||visual.querySelector('.ai-readout')?.textContent||t('상태를 변경했습니다.','State updated.'));
 }
 function play(){if(raf){stop();say(t('재생 정지','Playback paused'));return;}if(blocked()){mark();advance();render();say(t('움직임 감소: 한 단계 진행','Reduced motion: one step'));return;}if(document.hidden||!visible)return;mark();root.dataset.playing='true';const b=q('[data-ai=play]');b.textContent=t('정지','Pause');b.setAttribute('aria-pressed','true');last=0;elapsed=0;say(t('재생 중 · 화면 밖에서 정지합니다.','Playing · pauses offscreen.'));function frame(now){if(disposed||!root.isConnected||document.hidden||!visible||blocked()){stop();return;}if(!last)last=now;elapsed+=Math.min(.1,(now-last)/1000);last=now;let running=true;while(elapsed>=.2&&running){elapsed-=.2;running=advance();render();}if(running)raf=requestAnimationFrame(frame);else{stop();say(t('재생 완료','Playback complete'));}}raf=requestAnimationFrame(frame);}
 root.addEventListener('click',event=>{const el=event.target.closest('button');if(!el||!root.contains(el))return;event.stopPropagation();if(el.dataset.ai){act(el.dataset.ai);return;}stop();mark();let message='';if(el.dataset.node?.startsWith('actor-'))s.selected=Number(el.dataset.node.slice(6));if(el.dataset.node?.startsWith('quest-'))message=quest(el.dataset.node.slice(6));if(el.dataset.cell!==undefined){const i=Number(el.dataset.cell);if(key==='ai-flow'){if(i!==s.agent&&i!==s.goal)s.walls[i]=!s.walls[i];}else if(key==='ai-life')s.cells[i]=!s.cells[i];else if(key==='ai-terrain')s.terrain[i]=!s.terrain[i];}render();say(message||t('선택을 반영했습니다.','Selection updated.'));},{signal:ac.signal});
 root.addEventListener('input',event=>{if(event.target!==range)return;stop();mark();s.param=clamp(Number(range.value),PARAMS[key][2],PARAMS[key][3]);if(key==='ai-tree')s.distance=s.param;if(key==='ai-utility')s.hunger=s.param;if(key==='ai-board'){s.board.alert=s.param;s.board.version++;}if(key==='ai-spawn')s.entities=s.entities.slice(0,s.param);if(key==='ai-encounter')s.pack=rules.pack(s.param,s.wave);if(key==='ai-prefab')s.template.hp=s.param;if(key==='ai-cutscene'){s.time=0;s.cues=[];s.skipped=false;}render();say(PARAMS[key][en?1:0]+' '+s.param+PARAMS[key][6]);},{signal:ac.signal});
 if(key==='ai-steer'||key==='ai-perception'){
  visual.addEventListener('pointerdown',event=>{const target=event.target.closest('svg');if(!target)return;const matrix=target.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());s.target={x:clamp(p.x,8,272),y:clamp(p.y,8,122)};mark();render();say(t('목표 위치를 변경했습니다.','Target moved.'));},{signal:ac.signal});
  // A dedicated keyboard target allows equivalent input without capturing page-wide arrows.
  visual.tabIndex=0;visual.setAttribute('aria-label',t('목표 위치: 방향키로 이동','Target position: use arrow keys'));
  visual.addEventListener('keydown',event=>{if(event.target!==visual||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();event.stopPropagation();const dx=event.key==='ArrowLeft'?-10:event.key==='ArrowRight'?10:0,dy=event.key==='ArrowUp'?-10:event.key==='ArrowDown'?10:0;s.target={x:clamp(s.target.x+dx,8,272),y:clamp(s.target.y+dy,8,122)};mark();render();say(t('목표 위치 ','Target ')+Math.round(s.target.x)+', '+Math.round(s.target.y));},{signal:ac.signal});
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:ac.signal});reduced.addEventListener('change',()=>{if(reduced.matches)stop();},{signal:ac.signal});
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop();}):null;io?.observe(root);
 reset();const study={root,key,snapshot:()=>copy(s),step:(n=1)=>{stop();for(let i=0;i<clamp(n,1,200);i++)act('step');return copy(s);},dispose(){disposed=true;stop();ac.abort();io?.disconnect();active.delete(study);delete root.__aiStudy;}};root.__aiStudy=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const a of active)if(!a.root.isConnected)a.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown entry');const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e8edf4;color:#19364a;font:16px/1.5 system-ui}main{max-width:660px;margin:auto}h1{font-size:24px}.demo{height:360px;border-radius:14px;overflow:hidden;border:1px solid #9cb0c6}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div class="demo" id="demo"></div><p>'+esc(SCOPES[item[1]][en?1:0])+'</p></main><script>('+initAtlasAILab.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasAILab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasAILab.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){const A=global.Atlas32;if(!A||A.__ai317)return false;A.__ai317=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-ai-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive AI/simulation study':'직접 조작하는 AI·시뮬레이션 예제'}:prev.art(e,lang);};A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.ai-stage')?[scope]:[...scope.querySelectorAll('.ai-stage')];roots.forEach(el=>mount(el));};A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prev.code(e,lang);return true;}
install();global.AtlasAILab={ITEMS,PARAMS,ACTIONS,SCOPES,byId,byKey,markup,mount,code,attach,rules,css,version:'3.17.0',activeCount:()=>active.size};attach();
})(window);
