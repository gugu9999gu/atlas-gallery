/* ATLAS v3.15: 24 original, deterministic, browser-only game-system studies.
 * No network, audio, persistent storage, external artwork or game-engine dependency.
 */
(function initAtlasGameLab(global){
'use strict';
const ITEMS=[
 ['dar-191fb9b3b28a','gm-core','Core Loop','코어 루프'],
 ['dar-4d5c2abddb72','gm-meta','Meta Loop','메타 루프'],
 ['dar-68f090a83481','gm-mechanic','Game Mechanic','게임 메커닉'],
 ['dar-b18ff123c369','gm-agency','Player Agency','플레이어 행위 주도성'],
 ['dar-f0bc4c7fd3fd','gm-choice','Meaningful Choice','의미 있는 선택'],
 ['dar-d83528e152d0','gm-risk','Risk–Reward','위험과 보상'],
 ['dar-e5d0e866b80b','gm-feedback','Feedback Loop','피드백 루프'],
 ['dar-9a679cfd064b','gm-positive','Positive Feedback Loop','강화 피드백 루프'],
 ['dar-8e2489a5962f','gm-negative','Negative Feedback Loop','균형 피드백 루프'],
 ['dar-6d3213ebe256','gm-skills','Skill Tree','스킬 트리'],
 ['dar-af9f16055916','gm-tech','Tech Tree','기술 트리'],
 ['dar-84e26fd65922','gm-unlock','Unlock','해금'],
 ['dar-768dcb9e44ce','gm-curve','Difficulty Curve','난이도 곡선'],
 ['dar-1a904ebfccd1','gm-dynamic','Dynamic Difficulty','동적 난이도'],
 ['dar-16c51aa95070','gm-economy','Resource Economy','자원 경제'],
 ['dar-3cf6e81f771b','gm-flow','Source and Sink','자원 공급원·소모처'],
 ['dar-d4b2cf539395','gm-craft','Crafting','제작'],
 ['dar-0efbbff99f37','gm-loot','Loot Table','전리품 테이블'],
 ['dar-ef460ee95bd3','gm-rng','Random Number Generation','난수 생성'],
 ['dar-76b3a39cc11b','gm-pcg','Procedural Content Generation','절차적 콘텐츠 생성'],
 ['dar-dfd00872ed64','gm-permadeath','Permadeath','영구 사망'],
 ['dar-f8cb0765419a','gm-checkpoint','Checkpoint','체크포인트'],
 ['dar-9715bb477abe','gm-save','Save State','저장 상태'],
 ['dar-4ca8dce48bc7','gm-plus','New Game Plus','뉴게임 플러스']
];
// [KO label, EN label, min, max, default, step, suffix]
const RANGES={
 'gm-core':['보상','Reward',1,9,3,1,''],
 'gm-mechanic':['이동 칸','Step size',1,3,2,1,''],
 'gm-risk':['성공률','Success',20,80,60,5,'%'],
 'gm-feedback':['보정률','Correction',10,90,40,10,'%'],
 'gm-positive':['성장률','Growth',10,50,20,5,'%'],
 'gm-negative':['추격률','Catch-up',10,80,35,5,'%'],
 'gm-unlock':['요구 XP','Required XP',2,8,3,1,''],
 'gm-curve':['지수','Exponent',1,3,2,.25,''],
 'gm-dynamic':['반영률','Weight',10,60,35,5,'%'],
 'gm-economy':['거래량','Quantity',1,3,1,1,''],
 'gm-flow':['유입량','Inflow',0,10,5,1,''],
 'gm-loot':['희귀 가중치','Epic weight',1,30,5,1,''],
 'gm-rng':['시드','Seed',1,99,42,1,''],
 'gm-pcg':['시드','Seed',1,99,17,1,'']
};
const ACTIONS={
 'gm-core':[['step','다음 행동','Next step']],
 'gm-meta':[['run','세션 완료','Finish run'],['upgrade','영구 강화','Upgrade']],
 'gm-mechanic':[['jump','이동','Move']],
 'gm-agency':[['key','열쇠 경로','Key route'],['chest','보물 경로','Chest route']],
 'gm-choice':[['guard','방어 +2','Guard +2'],['speed','속도 +2','Speed +2']],
 'gm-risk':[['safe','안전 +1','Safe +1'],['risk','도전 +4/−2','Risk +4/−2']],
 'gm-feedback':[['step','피드백 적용','Apply feedback'],['target','목표 전환','Change target']],
 'gm-positive':[['step','성장 1회','Grow once']],
 'gm-negative':[['step','추격 1회','Catch up']],
 'gm-skills':[['earn','포인트 +1','Point +1']],
 'gm-tech':[['earn','연구점 +1','Research +1']],
 'gm-unlock':[['earn','XP +1','XP +1'],['open','문 열기','Open gate']],
 'gm-curve':[['step','다음 단계','Next stage']],
 'gm-dynamic':[['success','성공','Success'],['failure','실패','Failure']],
 'gm-economy':[['buy','목재 구매','Buy wood'],['sell','목재 판매','Sell wood']],
 'gm-flow':[['step','한 주기','One cycle']],
 'gm-craft':[['gather','재료 수집','Gather'],['craft','방패 제작','Craft shield']],
 'gm-loot':[['draw','1회 추첨','Draw 1'],['batch','10회 추첨','Draw 10']],
 'gm-rng':[['draw','다음 6개','Next 6'],['rewind','시드 재생','Replay seed']],
 'gm-pcg':[['generate','같은 시드','Same seed'],['next','다음 시드','Next seed']],
 'gm-permadeath':[['explore','탐색 +1','Explore +1'],['hit','피해 −1','Damage −1'],['run','새 캐릭터','New run']],
 'gm-checkpoint':[['move','전진','Advance'],['mark','체크포인트','Mark'],['fail','실패·복귀','Respawn']],
 'gm-save':[['move','상태 변경','Advance'],['save','저장','Save'],['load','불러오기','Load']],
 'gm-plus':[['step','구간 완료','Complete stage'],['restart','계승 시작','New cycle']]
};
const NOTES={
 'gm-core':['수집 → 제작 → 보상. 한 번의 클릭이 한 행동입니다.','Gather → craft → reward. One click executes one action.'],
 'gm-meta':['세션 보상으로 다음 세션의 수익을 강화합니다. 새로고침 시 소실됩니다.','Run rewards upgrade later runs. Reloading clears this demo.'],
 'gm-mechanic':['착지 칸만 판정하는 격자 규칙입니다. 물리 엔진은 아닙니다.','Only the landing tile is tested; this is not a physics engine.'],
 'gm-agency':['열쇠 경로를 선택해야 보물 경로의 결과가 달라집니다.','Choosing the key route changes the result of the chest route.'],
 'gm-choice':['공유 예산 8, 각 선택 비용 3. 방어와 속도에 다른 결과를 줍니다.','Shared budget 8, cost 3 per choice. Guard and speed trade off.'],
 'gm-risk':['시드 기반 모의 보상입니다. 현금·구매·실제 보상은 없습니다.','Seeded virtual rewards only; no money, purchases or real prizes.'],
 'gm-feedback':['출력 오차를 다음 입력에 반영하는 단순 보정 모델입니다.','A simple model feeds output error into the next correction.'],
 'gm-positive':['현재 자원의 비율로 증가합니다. 절대 격차가 커지는 모형입니다.','Proportional growth increases the absolute resource gap.'],
 'gm-negative':['뒤처진 쪽에 격차 비례 보너스를 주는 추격 모형입니다.','The trailing side receives a gap-proportional catch-up bonus.'],
 'gm-skills':['기초 → 양자택일 분기 → 숙련. 버튼으로 선행 조건을 확인하세요.','Base → mutually exclusive branch → mastery. Try each node.'],
 'gm-tech':['공장은 제련과 기계가 모두 필요합니다. 각 연구는 점수를 소모합니다.','Factory needs both smelting and machinery. Research costs points.'],
 'gm-unlock':['요구 XP를 충족해야 문을 열 수 있습니다. 조건 변경 시 재평가합니다.','The gate requires enough XP. Changing the requirement rechecks it.'],
 'gm-curve':['5 + 단계^지수로 만든 예시 곡선입니다. 실측 난이도가 아닙니다.','Illustrative curve: 5 + stage^exponent, not measured difficulty.'],
 'gm-dynamic':['성공률 EMA가 0.70 초과면 +1, 0.40 미만이면 −1. 예시 규칙입니다.','Illustrative EMA rule: above .70 adds 1; below .40 subtracts 1.'],
 'gm-economy':['구매: 코인 2→목재 3. 판매: 목재 2→코인 1. 예시 교환 규칙입니다.','Buy: 2 coins → 3 wood. Sell: 2 wood → 1 coin. Toy exchange rules.'],
 'gm-flow':['한 주기마다 유입 후 최대 3을 제거합니다. 자원 보존을 확인하세요.','Each cycle adds inflow, then removes up to 3. Track conservation.'],
 'gm-craft':['방패 1개 = 목재 3 + 돌 2. 부족하면 제작하지 않습니다.','One shield costs 3 wood + 2 stone. Missing materials block crafting.'],
 'gm-loot':['일반 70 : 고급 25 : 희귀 가중치. 시드 고정, 유료 추첨이 아닙니다.','Common 70 : rare 25 : epic weight. Seeded, never a paid draw.'],
 'gm-rng':['32비트 LCG 시연. 같은 시드로 재현 가능하며 보안용이 아닙니다.','32-bit LCG study. Reproducible from a seed; not cryptographic.'],
 'gm-pcg':['시드 기반 2D 보행·연결 경로 생성. 완성된 레벨 생성기는 아닙니다.','Seeded 2D walk with a connected route, not a complete level generator.'],
 'gm-permadeath':['사망 시 이 캐릭터의 보상 소실. 새 캐릭터로 재시작하는 메모리 시연입니다.','Death erases this character’s rewards. New run starts an in-memory character.'],
 'gm-checkpoint':['현재 위치를 기록한 뒤 실패하면 기록 위치로 복귀합니다.','Record a position, then fail to return to that checkpoint.'],
 'gm-save':['JSON 깊은 복사로 메모리에 저장합니다. 새로고침하면 소실됩니다.','A deep JSON snapshot in memory; reloading clears the save.'],
 'gm-plus':['3구간 완료 후 힘을 계승하고 진행도만 초기화합니다.','After 3 stages, carry power forward and reset stage progress.']
};
const byId=new Map(ITEMS.map(x=>[x[0],x])),byKey=new Map(ITEMS.map(x=>[x[1],x]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=s=>JSON.parse(JSON.stringify(s));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lcg=s=>(Math.imul(s>>>0,1664525)+1013904223)>>>0;
function generateMap(seed){let r=seed>>>0,x=0,y=3;const cells=new Set(['0,3']);for(let i=0;i<48;i++){r=lcg(r);const d=Math.floor(r/4294967296*4);x=clamp(x+(d===0?1:d===1?-1:0),0,11);y=clamp(y+(d===2?1:d===3?-1:0),0,6);cells.add(x+','+y);}while(y!==3){y+=y<3?1:-1;cells.add(x+','+y);}while(x<11){x++;cells.add(x+','+y);}return [...cells].sort();}
function initial(key){return {value:RANGES[key]?.[4]??0,turn:0,phase:0,ore:0,tools:0,coins:key==='gm-choice'?8:key==='gm-economy'?4:0,level:key==='gm-dynamic'?3:1,xp:0,runs:0,x:0,key:false,opened:false,guard:0,speed:0,score:0,seed:42,current:20,target:80,a:key==='gm-negative'?70:12,b:key==='gm-negative'?20:6,history:[],points:key==='gm-tech'?4:3,nodes:[],stage:1,ema:.5,wood:4,stone:2,stock:10,added:0,removed:0,crafted:0,counts:[0,0,0],samples:[],map:generateMap(17),hp:3,alive:true,mark:0,world:{x:0,hp:100,items:1},snapshot:null,cycle:1,power:1,progress:0,last:''};}
const css=`
.gm-stage{display:grid;grid-template-rows:minmax(80px,1fr) auto auto;position:relative;width:100%;height:100%;min-height:0;overflow:hidden;background:#14283b;color:#e9f2f5;font:14px/1.35 system-ui,sans-serif;isolation:isolate}
.gm-stage *,.gm-stage *:before,.gm-stage *:after{box-sizing:border-box}.gm-stage [hidden]{display:none!important}.gm-stage button,.gm-stage input,.gm-stage output,.gm-stage p,.gm-stage span,.gm-stage strong,.gm-stage label,.gm-stage small{font-size:14px;line-height:1.3}
.gm-board{display:grid;grid-template-rows:minmax(0,1fr) auto;min-width:0;min-height:0;padding:9px 10px 5px;background:radial-gradient(ellipse at 85% 0,#234d5d,transparent 70%),#152c40}
.gm-art{min-height:0;min-width:0;display:flex;align-items:center;justify-content:center;overflow:hidden}.gm-stats{margin:5px 0 0!important;color:#f2cf8e;text-align:center;font-variant-numeric:tabular-nums;overflow-wrap:anywhere;min-height:19px;max-height:40px;overflow:auto;overscroll-behavior:contain}
.gm-controls{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;padding:6px 8px;background:#1b3349;border-top:1px solid #476071}.gm-range{width:100%;display:flex;align-items:center;gap:7px;margin:0;min-width:0}.gm-range span{white-space:nowrap}.gm-range input{min-width:30px;flex:1;width:70px;accent-color:#a3dfce;height:24px;margin:0}.gm-range output{min-width:38px;text-align:right;color:#fff;font-variant-numeric:tabular-nums}
.gm-stage button{font:600 14px/1.2 system-ui;min-height:32px;padding:6px 9px;border:1px solid #7594a9;border-radius:6px;background:#2c5268;color:#fff;cursor:pointer;transition:background .16s,transform .16s}.gm-stage button:hover{background:#39697e}.gm-stage button:active{transform:translateY(1px)}.gm-stage button:disabled{opacity:.48;cursor:not-allowed}.gm-stage button:focus-visible,.gm-stage input:focus-visible,.gm-scope:focus-visible{outline:3px solid #ffda87;outline-offset:2px}.gm-stage [data-gm=reset]{padding:5px 8px;background:transparent}
.gm-scope{font:14px/1.35 system-ui;margin:0!important;padding:5px 9px;color:#c8dce6;background:#112536;max-height:48px;overflow:auto;overscroll-behavior:contain}.gm-announcer{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.gm-flow{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;flex-wrap:wrap}.gm-chip{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:5px;min-width:56px;padding:9px 7px;border:1px solid #658294;border-radius:9px;background:#203f53;text-align:center}.gm-chip strong{color:#bdeedc;font-size:23px!important}.gm-chip.is-current{border:2px solid #edbc6c;background:#385162}.gm-chip.is-muted{opacity:.48}.gm-arrow{font-size:18px!important;color:#b7d5d6}.gm-meters{display:grid;gap:9px;width:100%;max-width:270px}.gm-meter-row{display:grid;grid-template-columns:40px 1fr 42px;align-items:center;gap:6px}.gm-meter-row b{font-size:14px;text-align:right;font-variant-numeric:tabular-nums}.gm-meter{height:15px;border:1px solid #6f8c9d;border-radius:6px;overflow:hidden;background:#0b2134}.gm-meter i{display:block;height:100%;width:var(--fill);background:#81cebe;transition:width .25s}.gm-meter-row:nth-child(2n) .gm-meter i{background:#e8b575}
.gm-track{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;width:100%;max-width:270px}.gm-tile{height:47px;position:relative;border-bottom:4px solid #688797;border-radius:5px;background:#26485c;display:grid;place-items:center}.gm-tile.is-wall{background:repeating-linear-gradient(45deg,#88643c 0 5px,#544839 5px 10px)}.gm-tile.is-mark{border-bottom-color:#efc37e}.gm-player{width:18px;height:23px;background:#9ee3d0;border:2px solid #ddfff4;border-radius:5px;box-shadow:0 3px 0 #061c28}.gm-marker{width:13px;height:23px;border-left:2px solid #ffc976;border-top:8px solid #ffc976}.gm-path{width:100%;max-width:270px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.gm-path>div{padding:9px 7px;border:1px solid #658799;border-radius:10px;text-align:center;background:#244559;display:grid;gap:7px}.gm-path strong{font-size:24px!important;color:#c5ecdf}.gm-path .is-current{border:2px solid #ecc17b}
.gm-tree{display:grid;grid-template-columns:1fr 1fr;gap:6px;position:relative;width:100%;max-width:275px}.gm-tree button{padding:5px;font-size:14px!important;min-height:30px;background:#24475c}.gm-tree button:first-child,.gm-tree button:last-child{grid-column:1/-1}.gm-tree button[aria-pressed=true]{background:#376e62;border-color:#b4e7cd}.gm-tree button[data-locked=true]{border-style:dashed;color:#c8d2d8}.gm-tree small{font-weight:400;margin-left:5px}
.gm-chart{height:100%;min-height:50px;max-height:94px;width:100%;max-width:270px;display:flex;align-items:flex-end;gap:6px;border-bottom:1px solid #90a7b3;padding:5px}.gm-column{flex:1;min-width:0;background:#689b9c;height:var(--height);border-radius:5px 5px 0 0;transition:height .25s}.gm-column.is-current{background:#edbe77;border:1px solid #ffe2ad}.gm-line{width:100%;height:85px;max-width:270px;overflow:hidden}.gm-line svg{width:100%;height:100%;display:block}
.gm-numbers{display:grid;grid-template-columns:repeat(6,1fr);gap:5px;width:100%;max-width:270px}.gm-numbers span{padding:10px 0;background:#2a4d60;border:1px solid #718b9b;border-radius:5px;text-align:center;font:700 17px/1 system-ui!important;font-variant-numeric:tabular-nums}.gm-map{display:grid;grid-template-columns:repeat(12,1fr);gap:2px;width:100%;max-width:252px;aspect-ratio:12/7;max-height:109px}.gm-cell{background:#29485a;border-radius:1px;min-height:0}.gm-cell.is-floor{background:#81b4ac}.gm-cell.is-start{background:#fee0a1}.gm-cell.is-goal{background:#e89d7e}.gm-resource{display:flex;gap:9px;align-items:center;justify-content:center;flex-wrap:wrap;width:100%}.gm-resource .gm-chip{padding:7px;min-width:61px}.gm-gate{display:flex;gap:14px;align-items:center;justify-content:center;width:100%}.gm-door{width:58px;height:71px;border:4px solid #839da7;border-radius:27px 27px 3px 3px;background:repeating-linear-gradient(90deg,#355268 0 10px,#213d53 10px 13px);transition:background .2s}.gm-door.is-open{background:#a2d9ba;border-color:#c5f1ce;clip-path:polygon(0 0,100% 0,100% 100%,0 100%,0 90%,70% 80%,70% 20%,0 10%)}
.gm-hearts{display:flex;gap:8px;justify-content:center}.gm-hearts i{width:23px;height:23px;background:#d38b86;clip-path:polygon(50% 18%,70% 0,100% 10%,100% 45%,50% 100%,0 45%,0 10%,30% 0)}.gm-hearts i.is-muted{background:#4a5d69}.gm-last{animation:gm-arrive .24s ease-out both}@keyframes gm-arrive{from{opacity:.5;transform:translateY(4px)}to{opacity:1;transform:none}}
@media(max-width:360px){.gm-controls{gap:4px;padding:5px}.gm-stage button{padding:6px 7px}.gm-chip{min-width:49px;padding:7px 5px}.gm-flow{gap:4px}.gm-tree{gap:4px}.gm-board{padding:7px 7px 4px}}
@media(prefers-reduced-motion:reduce){.gm-stage *{animation:none!important;transition:none!important}}
html.motion-paused .gm-stage *,html[data-motion=off] .gm-stage *,body.motion-paused .gm-stage *{animation:none!important;transition:none!important}
@media(forced-colors:active){.gm-stage button{forced-color-adjust:auto}.gm-chip,.gm-meter,.gm-cell{border:1px solid CanvasText}.gm-player{background:Highlight}}
`;
function install(){if(document.getElementById('atlas-game-lab-v315'))return;const s=document.createElement('style');s.id='atlas-game-lab-v315';s.textContent=css;document.head.append(s);}
function markup(key,lang='ko'){if(!byKey.has(key))throw Error('Unknown game study: '+key);const en=lang==='en',r=RANGES[key],t=(ko,eng)=>en?eng:ko;return '<section class="gm-stage" lang="'+(en?'en':'ko')+'" data-game="'+key+'" aria-label="'+esc(byKey.get(key)[en?2:3])+'"><div class="gm-board"><div class="gm-art"></div><p class="gm-stats" tabindex="0"></p></div><div class="gm-controls">'+(r?'<label class="gm-range"><span>'+esc(r[en?1:0])+'</span><input type="range" data-gm-range min="'+r[2]+'" max="'+r[3]+'" step="'+r[5]+'" value="'+r[4]+'"><output>'+r[4]+r[6]+'</output></label>':'')+ACTIONS[key].map(a=>'<button type="button" data-gm="'+a[0]+'">'+esc(a[en?2:1])+'</button>').join('')+'<button type="button" data-gm="reset" aria-label="'+t('초기화','Reset')+'" title="'+t('초기화','Reset')+'">↺</button></div><p class="gm-scope" tabindex="0">'+esc(NOTES[key][en?1:0])+'</p><span class="gm-announcer" role="status" aria-live="polite" aria-atomic="true"></span></section>';}
const active=new Set();let observer;
function mount(root,key=root.dataset.game,lang=root.lang||'ko'){
 if(root.__gmStudy)return root.__gmStudy;if(!byKey.has(key))throw Error('Unknown study '+key);const en=lang==='en',t=(ko,eng)=>en?eng:ko,ac=new AbortController();let s=initial(key),revision=0,disposed=false;
 const q=sel=>root.querySelector(sel),all=sel=>[...root.querySelectorAll(sel)],cfg=RANGES[key];
 const chip=(label,value,current=false)=>'<div class="gm-chip'+(current?' is-current':'')+'"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';
 const meter=(label,value,max=100)=>'<div class="gm-meter-row"><span>'+esc(label)+'</span><div class="gm-meter"><i style="--fill:'+clamp(value/max*100,0,100)+'%"></i></div><b>'+Math.round(value)+'</b></div>';
 const resources=arr=>'<div class="gm-resource">'+arr.map(x=>chip(...x)).join('')+'</div>';
 const track=(x,mark=-1,wall=-1)=>'<div class="gm-track">'+Array.from({length:8},(_,i)=>'<div class="gm-tile'+(i===wall?' is-wall':'')+(i===mark?' is-mark':'')+'">'+(i===x?'<i class="gm-player"></i>':i===mark?'<i class="gm-marker"></i>':'')+'</div>').join('')+'</div>';
 function random(){s.seed=lcg(s.seed);return s.seed/4294967296;}
 function line(){const data=s.history.length?s.history:[[s.a,s.b]],max=Math.max(100,...data.flat()),points=k=>data.map((p,i)=>(10+i/Math.max(1,data.length-1)*250)+','+(78-p[k]/max*66)).join(' ');return '<div class="gm-line"><svg viewBox="0 0 270 90"><path d="M10 8V78H264" fill="none" stroke="#8099a6"/><polyline points="'+points(0)+'" fill="none" stroke="#8dd7c3" stroke-width="3"/><polyline points="'+points(1)+'" fill="none" stroke="#efbf79" stroke-width="3"/><circle cx="'+(data.length>1?260:10)+'" cy="'+(78-data.at(-1)[0]/max*66)+'" r="4" fill="#8dd7c3"/><circle cx="'+(data.length>1?260:10)+'" cy="'+(78-data.at(-1)[1]/max*66)+'" r="4" fill="#efbf79"/></svg></div>';}
 function nodeAllowed(i){if(s.nodes.includes(i))return false;if(key==='gm-skills'){if(i===0)return s.points>=1;if(i===1||i===2)return s.points>=2&&s.nodes.includes(0)&&!s.nodes.includes(i===1?2:1);return s.points>=3&&(s.nodes.includes(1)||s.nodes.includes(2));}const deps=[[],[0],[0],[1,2]],cost=[1,2,2,3];return s.points>=cost[i]&&deps[i].every(n=>s.nodes.includes(n));}
 function tree(){const labels=key==='gm-skills'?[t('기초','Base'),t('공격','Attack'),t('방어','Guard'),t('숙련','Mastery')]:[t('기초','Base'),t('제련','Smelt'),t('기계','Machine'),t('공장','Factory')];q('.gm-art').removeAttribute('aria-hidden');return '<div class="gm-tree">'+labels.map((label,i)=>'<button type="button" data-gm="node'+i+'" aria-pressed="'+s.nodes.includes(i)+'" data-locked="'+!nodeAllowed(i)+'" aria-label="'+esc(label+' · '+(s.nodes.includes(i)?t('완료','complete'):t('필요 점수 ','cost ')+[1,2,2,3][i]))+'">'+esc(label)+'<small>'+ (s.nodes.includes(i)?'✓':[1,2,2,3][i])+'</small></button>').join('')+'</div>';}
 function render(announce=true){if(disposed)return;let art='',stats='';const focus=document.activeElement?.closest?.('[data-gm]'),focusKey=focus&&root.contains(focus)?focus.dataset.gm:null;
 switch(key){
 case 'gm-core':art='<div class="gm-flow">'+[t('수집','Gather'),t('제작','Craft'),t('보상','Reward')].map((x,i)=>chip(x,['+1','−1 / +1','+'+s.value][i],s.phase===i)+(i<2?'<span class="gm-arrow">→</span>':'')).join('')+'</div>';stats=t('완료 ','Cycles ')+s.runs+' · '+t('광석 ','Ore ')+s.ore+' · '+t('코인 ','Coins ')+s.coins;break;
 case 'gm-meta':art=resources([[t('세션','Runs'),s.runs],[t('영구 레벨','Meta level'),s.level,true],[t('보상','XP'),s.xp]]);stats=t('세션 보상 ','Run reward ')+(s.level+1)+' · '+t('강화 비용 ','Upgrade cost ')+(s.level*3);break;
 case 'gm-mechanic':art=track(s.x,-1,4);stats=t('착지 칸 ','Tile ')+s.x+' / 7 · '+t('장애물 4','Obstacle 4');break;
 case 'gm-agency':art='<div class="gm-path"><div class="'+(s.key?'is-current':'')+'"><span>'+t('열쇠 경로','Key route')+'</span><strong>'+(s.key?'✓':'?')+'</strong></div><div class="'+(s.opened?'is-current':'')+'"><span>'+t('보물 경로','Chest route')+'</span><strong>'+(s.opened?'+5':'×')+'</strong></div></div>';stats=t('열쇠 ','Key ')+(s.key?t('획득','owned'):t('없음','missing'))+' · '+t('보상 ','Reward ')+s.score;break;
 case 'gm-choice':art='<div class="gm-meters">'+meter(t('방어','Guard'),s.guard,6)+meter(t('속도','Speed'),s.speed,6)+'</div>';stats=t('남은 예산 ','Budget ')+s.coins+' · '+t('각 선택 비용 3','Each choice costs 3');break;
 case 'gm-risk':art=resources([[t('안전','Safe'),'+1'],[t('성공률','Chance'),s.value+'%',true],[t('보상','Score'),s.score]]);stats=t('도전: 성공 +4 · 실패 −2','Risk: success +4 · failure −2');break;
 case 'gm-feedback':art='<div class="gm-meters">'+meter(t('목표','Target'),s.target)+meter(t('출력','Output'),s.current)+'</div>';stats=t('오차 ','Error ')+(s.target-s.current).toFixed(1)+' · '+t('적용 ','Steps ')+s.turn;break;
 case 'gm-positive':case 'gm-negative':art=line();stats='A '+s.a.toFixed(1)+' · B '+s.b.toFixed(1)+' · '+t('격차 ','Gap ')+(s.a-s.b).toFixed(1);break;
 case 'gm-skills':case 'gm-tech':art=tree();stats=t('남은 점수 ','Points ')+s.points+' · '+t('완료 ','Complete ')+s.nodes.length+'/'+(key==='gm-skills'?3:4);break;
 case 'gm-unlock':art='<div class="gm-gate"><div class="gm-door'+(s.opened?' is-open':'')+'"></div>'+chip('XP',s.xp+'/'+s.value,s.xp>=s.value)+'</div>';stats=s.opened?t('문 열림','Gate opened'):s.xp>=s.value?t('조건 충족 · 열기 가능','Ready · open the gate'):t('XP가 부족합니다.','More XP required.');break;
 case 'gm-curve':{const values=Array.from({length:8},(_,i)=>5+Math.pow(i+1,s.value)),max=Math.max(...values);art='<div class="gm-chart">'+values.map((v,i)=>'<i class="gm-column'+(i+1===s.stage?' is-current':'')+'" style="--height:'+(v/max*100)+'%"></i>').join('')+'</div>';stats=t('단계 ','Stage ')+s.stage+'/8 · '+t('도전값 ','Challenge ')+values[s.stage-1].toFixed(1);break;}
 case 'gm-dynamic':art='<div class="gm-meters">'+meter(t('성공','EMA'),s.ema*100)+meter(t('레벨','Level'),s.level,8)+'</div>';stats='EMA '+s.ema.toFixed(2)+' · '+t('난이도 ','Difficulty ')+s.level+'/8';break;
 case 'gm-economy':art=resources([[t('코인','Coins'),s.coins],[t('목재','Wood'),s.wood]]);stats=t('거래 묶음 ','Bundles ')+s.value+' · '+t('보유량 내에서 거래','Trades require enough resources');break;
 case 'gm-flow':art='<div class="gm-flow">'+chip(t('공급','Source'),'+'+s.value)+'<span class="gm-arrow">→</span>'+chip(t('재고','Stock'),s.stock,true)+'<span class="gm-arrow">→</span>'+chip(t('소모','Sink'),'−3')+'</div>';stats='10 + '+s.added+' − '+s.removed+' = '+s.stock;break;
 case 'gm-craft':art=resources([[t('목재','Wood'),s.wood],[t('돌','Stone'),s.stone],[t('방패','Shields'),s.crafted,true]]);stats=t('제작 비용: 목재 3 + 돌 2','Recipe: 3 wood + 2 stone');break;
 case 'gm-loot':{const total=95+s.value,w=[70,25,s.value],names=[t('일반','Common'),t('고급','Rare'),t('희귀','Epic')];art='<div class="gm-chart">'+s.counts.map((v,i)=>'<i class="gm-column'+(i===2?' is-current':'')+'" style="--height:'+Math.max(5,v/Math.max(1,...s.counts)*100)+'%"></i>').join('')+'</div>';stats=names.map((n,i)=>n+' '+s.counts[i]+' ('+(w[i]/total*100).toFixed(1)+'%)').join(' · ');break;}
 case 'gm-rng':art='<div class="gm-numbers">'+Array.from({length:6},(_,i)=>'<span>'+esc(s.samples[i]??'–')+'</span>').join('')+'</div>';stats=t('시드 ','Seed ')+s.value+' · '+t('생성 수 ','Generated ')+s.turn*6;break;
 case 'gm-pcg':{const map=new Set(s.map);art='<div class="gm-map">'+Array.from({length:84},(_,i)=>{const x=i%12,y=Math.floor(i/12);return '<i class="gm-cell'+(map.has(x+','+y)?' is-floor':'')+(x===0&&y===3?' is-start':x===11&&y===3?' is-goal':'')+'"></i>';}).join('')+'</div>';stats=t('시드 ','Seed ')+s.value+' · '+t('연결된 바닥 ','Connected floor ')+s.map.length+'/84';break;}
 case 'gm-permadeath':art='<div class="gm-resource"><div class="gm-hearts">'+Array.from({length:3},(_,i)=>'<i class="'+(i>=s.hp?'is-muted':'')+'"></i>').join('')+'</div>'+chip(t('보상','Rewards'),s.score)+'</div>';stats=s.alive?t('생존 · 캐릭터 ','Alive · character ')+(s.runs+1):t('사망 · 보상 소실','Dead · rewards lost');break;
 case 'gm-checkpoint':art=track(s.x,s.mark);stats=t('현재 ','Now ')+s.x+' · '+t('체크포인트 ','Checkpoint ')+s.mark;break;
 case 'gm-save':art=track(s.world.x%8,s.snapshot?s.snapshot.x%8:-1);stats='HP '+s.world.hp+' · '+t('아이템 ','Items ')+s.world.items+' · '+t('저장 ','Saved ')+(s.snapshot?s.snapshot.x:'–');break;
 case 'gm-plus':art=resources([[t('회차','Cycle'),s.cycle],[t('힘','Power'),s.power,true],[t('진행','Stage'),(s.stage-1)+'/3']]);stats=s.stage===4?t('완료 · 힘을 계승할 수 있습니다.','Complete · carry power to the next cycle.'):t('구간 진행 ','Stage progress ')+s.progress+'/'+(s.cycle*2);break;
 }
 q('.gm-art').innerHTML=art;if(announce)q('.gm-art').firstElementChild?.classList.add('gm-last');q('.gm-stats').textContent=(s.last?s.last+' · ':'')+stats;root.dataset.revision=String(revision);root.dataset.value=String(s.value);
 if(cfg){const input=q('[data-gm-range]');input.value=String(s.value);input.setAttribute('aria-valuetext',cfg[en?1:0]+' '+s.value+cfg[6]);q('output').textContent=s.value+cfg[6];}
 const disable=(a,v)=>{const b=q('[data-gm="'+a+'"]');if(b)b.disabled=v;};
 if(key==='gm-meta')disable('upgrade',s.xp<s.level*3||s.level>=10);
 if(key==='gm-choice'){disable('guard',s.coins<3);disable('speed',s.coins<3);}
 if(key==='gm-economy'){disable('buy',s.coins<2*s.value);disable('sell',s.wood<2*s.value);}
 if(key==='gm-craft')disable('craft',s.wood<3||s.stone<2);
 if(key==='gm-unlock')disable('open',s.xp<s.value||s.opened);
 if(key==='gm-permadeath'){disable('explore',!s.alive);disable('hit',!s.alive);disable('run',s.alive);}
 if(key==='gm-save')disable('load',!s.snapshot);
 if(key==='gm-plus'){disable('restart',s.stage!==4);disable('step',s.stage===4);}
 if(key==='gm-positive'||key==='gm-negative')disable('step',s.turn>=20);
 if(key==='gm-skills'||key==='gm-tech')disable('earn',s.points>=9);
 if(focusKey){const b=q('[data-gm="'+focusKey+'"]');if(b&&!b.disabled&&b!==document.activeElement)b.focus({preventScroll:true});}
 if(announce)q('.gm-announcer').textContent=(s.last?s.last+' · ':'')+stats;
 }
 function act(action){if(disposed)return;if(action==='reset'){s=initial(key);revision=0;render();return;}
 let changed=true;s.last='';
 switch(key){
 case 'gm-core':if(s.phase===0)s.ore++;else if(s.phase===1){s.ore--;s.tools++;}else{s.coins+=s.value;s.runs++;}s.phase=(s.phase+1)%3;break;
 case 'gm-meta':if(action==='run'){s.runs++;s.xp+=s.level+1;}else if(s.xp>=s.level*3&&s.level<10){s.xp-=s.level*3;s.level++;}else changed=false;break;
 case 'gm-mechanic':{const next=Math.min(7,s.x+s.value);s.x=next===4?0:next;s.last=next===4?t('장애물 착지 · 출발점 복귀','Obstacle landing · returned to start'):t('이동 완료','Moved');break;}
 case 'gm-agency':if(action==='key'){s.key=true;s.last=t('열쇠를 획득했습니다.','Key acquired.');}else if(s.key&&!s.opened){s.opened=true;s.score=5;}else{s.last=s.opened?t('이미 열었습니다.','Already opened.'):t('먼저 열쇠가 필요합니다.','A key is required first.');}break;
 case 'gm-choice':if(s.coins>=3){s.coins-=3;s[action==='guard'?'guard':'speed']+=2;}else changed=false;break;
 case 'gm-risk':if(action==='safe')s.score++;else{const won=random()<s.value/100;s.score+=won?4:-2;s.last=won?t('성공 +4','Success +4'):t('실패 −2','Failure −2');}break;
 case 'gm-feedback':if(action==='target')s.target=s.target===80?30:80;else{s.current+=(s.target-s.current)*s.value/100;s.turn++;}break;
 case 'gm-positive':case 'gm-negative':if(s.turn>=20){changed=false;break;}if(!s.history.length)s.history.push([s.a,s.b]);if(key==='gm-positive'){s.a*=1+s.value/100;s.b*=1+s.value/100;}else{const gap=s.a-s.b;s.a+=5;s.b+=5+gap*s.value/100;}s.history.push([s.a,s.b]);s.turn++;break;
 case 'gm-skills':case 'gm-tech':if(action==='earn')s.points=Math.min(9,s.points+1);else{const i=Number(action.slice(4));if(Number.isInteger(i)&&i>=0&&i<4&&nodeAllowed(i)){s.points-=[1,2,2,3][i];s.nodes.push(i);s.last=t('해금 완료','Unlocked');}else{s.last=t('선행 조건·점수·분기 조건을 확인하세요.','Check prerequisites, points and branch choice.');}}break;
 case 'gm-unlock':if(action==='earn')s.xp=Math.min(99,s.xp+1);else if(s.xp>=s.value)s.opened=true;else changed=false;break;
 case 'gm-curve':s.stage=s.stage%8+1;break;
 case 'gm-dynamic':s.ema=(1-s.value/100)*s.ema+s.value/100*(action==='success'?1:0);if(s.ema>.7)s.level=Math.min(8,s.level+1);else if(s.ema<.4)s.level=Math.max(1,s.level-1);s.turn++;break;
 case 'gm-economy':if(action==='buy'&&s.coins>=2*s.value){s.coins-=2*s.value;s.wood+=3*s.value;}else if(action==='sell'&&s.wood>=2*s.value){s.wood-=2*s.value;s.coins+=s.value;}else changed=false;break;
 case 'gm-flow':{const sink=Math.min(3,s.stock+s.value);s.stock+=s.value-sink;s.added+=s.value;s.removed+=sink;s.turn++;break;}
 case 'gm-craft':if(action==='gather'){s.wood++;s.stone++;}else if(s.wood>=3&&s.stone>=2){s.wood-=3;s.stone-=2;s.crafted++;}else changed=false;break;
 case 'gm-loot':for(let i=0;i<(action==='batch'?10:1);i++){const v=random()*(95+s.value);s.counts[v<70?0:v<95?1:2]++;s.turn++;}break;
 case 'gm-rng':if(action==='rewind'){s.seed=s.value;s.turn=0;}s.samples=Array.from({length:6},()=>Math.floor(random()*100));s.turn++;break;
 case 'gm-pcg':if(action==='next')s.value=s.value%99+1;s.map=generateMap(s.value);s.turn++;break;
 case 'gm-permadeath':if(action==='run'&&!s.alive){s.runs++;s.alive=true;s.hp=3;s.score=0;}else if(s.alive&&action==='explore')s.score++;else if(s.alive&&action==='hit'){s.hp--;if(s.hp===0){s.alive=false;s.score=0;}}else changed=false;break;
 case 'gm-checkpoint':if(action==='move')s.x=Math.min(7,s.x+1);else if(action==='mark')s.mark=s.x;else s.x=s.mark;break;
 case 'gm-save':if(action==='save')s.snapshot=clone(s.world);else if(action==='load'&&s.snapshot)s.world=clone(s.snapshot);else if(action==='move'){s.world.x++;s.world.hp=Math.max(0,s.world.hp-5);s.world.items++;}else changed=false;break;
 case 'gm-plus':if(action==='step'&&s.stage<4){s.progress+=s.power;if(s.progress>=s.cycle*2){s.stage++;s.progress=0;}}else if(action==='restart'&&s.stage===4){s.cycle++;s.power++;s.stage=1;s.progress=0;}else changed=false;break;
 }
 if(changed)revision++;render();
 }
 root.addEventListener('click',event=>{const b=event.target.closest('[data-gm]');if(!b||!root.contains(b)||b.disabled)return;act(b.dataset.gm);},{signal:ac.signal});
 root.addEventListener('input',event=>{if(!event.target.matches('[data-gm-range]')||!cfg)return;const value=Number(event.target.value);if(!Number.isFinite(value))return;s.value=clamp(value,cfg[2],cfg[3]);if(key==='gm-rng'){s.seed=s.value;s.turn=0;s.samples=[];}if(key==='gm-pcg')s.map=generateMap(s.value);if(key==='gm-unlock'&&s.xp<s.value)s.opened=false;revision++;render();},{signal:ac.signal});
 render(false);const study={root,key,inspect:()=>clone(s),dispose(){if(disposed)return;disposed=true;ac.abort();active.delete(study);delete root.__gmStudy;}};root.__gmStudy=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const a of active)if(!a.root.isConnected)a.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown game entry');const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:18px;background:#e9eff3;color:#152d40;font:16px/1.5 system-ui}main{max-width:640px;margin:auto}h1{font-size:24px}.demo{height:340px;border-radius:12px;overflow:hidden}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div id="demo" class="demo"></div><p>'+esc(NOTES[item[1]][en?1:0])+'</p></main><script>('+initAtlasGameLab.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasGameLab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasGameLab.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){const A=global.Atlas32;if(!A||A.__game315)return false;A.__game315=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-game-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive game-system study':'직접 조작하는 게임 시스템 예제'}:prev.art(e,lang);};A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.gm-stage')?[scope]:[...scope.querySelectorAll('.gm-stage')];roots.forEach(el=>mount(el));};A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prev.code(e,lang);return true;}
install();global.AtlasGameLab={ITEMS,RANGES,ACTIONS,NOTES,byId,byKey,markup,mount,code,initial,lcg,generateMap,attach,css,version:'3.15.0',activeCount:()=>active.size};attach();
})(window);
