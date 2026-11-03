/* ATLAS v3.20 — 16 original frontend performance, rendering and motion studies.
   Metrics and server/bundler stages are synthetic educational models, not real measurements.
 */
(function initAtlasPerf320(global){
'use strict';
const ITEMS=[
 ['dar-7a8fef28336a','perf-view','View Transition API','뷰 트랜지션 API'],
 ['dar-5ed4fd3c3b98','perf-path','Critical Rendering Path','핵심 렌더링 경로'],
 ['dar-c6935fbfa3c2','perf-csr','CSR','클라이언트 측 렌더링'],
 ['dar-1d892b657a92','perf-ssr','SSR','서버 측 렌더링'],
 ['dar-bc155cebac99','perf-ssg','SSG','정적 사이트 생성'],
 ['dar-374fae2f5384','perf-hydration','Hydration','하이드레이션'],
 ['dar-468e11bd8c6a','perf-islands','Islands Architecture','아일랜드 아키텍처'],
 ['dar-1b0ebe710e1e','perf-split','Code Splitting','코드 분할'],
 ['dar-eed6cddce434','perf-shake','Tree Shaking','미사용 코드 제거'],
 ['dar-8fd635d0827e','perf-lcp','LCP','최대 콘텐츠 표시 시간'],
 ['dar-3b1910ae945b','perf-cls','CLS','누적 레이아웃 이동'],
 ['dar-5b6925abbfd8','perf-inp','INP','상호작용 응답성 지표'],
 ['dar-f25fef7d971b','perf-budget','Performance Budget','성능 예산'],
 ['dar-04df56f9d567','perf-curve','Animation Curve','애니메이션 곡선'],
 ['dar-c40ef3e4b163','perf-keyframes','Keyframe Animation','키프레임 애니메이션'],
 ['dar-258b4065f756','perf-stagger','Stagger','시차 실행']
];
const CONFIG={
 'perf-view':[200,900,480,20,'전환 시간','Duration (ms)','화면 전환','Swap panel','즉시 전환','Instant swap'],
 'perf-path':[1,5,3,1,'차단 단계','Blocking cost','다음 단계','Next stage','차단 제거','Remove blocker'],
 'perf-csr':[100,900,400,50,'가상 JS 용량','Synthetic JS KB','스크립트 실행','Run JS','초기 HTML 비교','Compare HTML'],
 'perf-ssr':[100,900,300,50,'가상 응답 지연','Synthetic TTFB','이벤트 연결','Activate events','CSR 비교','Compare CSR'],
 'perf-ssg':[1,8,3,1,'페이지 수','Generated pages','정적 재생성','Rebuild pages','게시','Publish'],
 'perf-hydration':[1,6,3,1,'버튼 수','Static buttons','동작 연결','Hydrate','동작 시험','Try interaction'],
 'perf-islands':[1,4,3,1,'아일랜드 수','Island count','하나 활성화','Activate one','모두 활성화','Activate all'],
 'perf-split':[100,900,400,50,'가상 청크 KB','Synthetic chunk KB','경로 청크 로드','Load route','사전 로드','Prefetch'],
 'perf-shake':[1,4,2,1,'사용 모듈 수','Used imports','진입점 변경','Change imports','제거 대상 표시','Show dropped'],
 'perf-lcp':[500,4500,2300,100,'모의 렌더 ms','Synthetic paint ms','히어로 최적화','Optimize hero','지연 추가','Add delay'],
 'perf-cls':[0,70,40,5,'이동 거리 px','Shift px','늦게 삽입','Late insert','공간 미리 예약','Reserve space'],
 'perf-inp':[10,500,220,10,'모의 처리 ms','Synthetic task ms','응답 과정 보기','Simulate response','작업 분할','Split task'],
 'perf-budget':[100,900,450,50,'전송 예산 KB','Budget KB','리소스 최적화','Optimize','대형 리소스 추가','Add large resource'],
 'perf-curve':[10,90,36,2,'곡선 강도','Curve strength','움직임 재생','Play motion','곡선 반전','Reverse curve'],
 'perf-keyframes':[0,100,50,5,'타임라인 %','Timeline %','키프레임 재생','Play frames','프리셋 변경','Change preset'],
 'perf-stagger':[20,220,90,10,'지연 간격 ms','Stagger gap ms','순차 등장','Play sequence','역순 재생','Reverse order']
};
const SCOPES={
 'perf-view':['지원 브라우저의 startViewTransition()을 사용하며, 미지원 시 즉시 화면을 교체합니다. 전체 페이지 이동은 아닙니다.','Uses startViewTransition where supported with an instant fallback; not a cross-document route.'],
 'perf-path':['렌더링 경로의 단계와 차단 의존성을 모의 표현합니다. 실제 브라우저 추적 기록은 아닙니다.','Illustrates rendering-stage dependencies, not actual browser tracing.'],
 'perf-csr':['빈 HTML에서 JS로 화면을 구성하는 시연입니다. KB와 로딩 시간은 가상값입니다.','Client-side DOM construction with synthetic bytes, not a measured network load.'],
 'perf-ssr':['서버가 HTML을 생성한 상태를 시각화합니다. 실제 서버 렌더러나 HTTP 요청을 실행하지 않습니다.','Pre-rendered HTML model; no server renderer or backend request executes.'],
 'perf-ssg':['빌드 시 정적 HTML을 생성하고 배포하는 과정을 모델링합니다. 실제 배포를 실행하지 않습니다.','Static build/publish state model; does not run a real hosting deployment.'],
 'perf-hydration':['정적 콘텐츠에 이벤트를 연결하는 원리 시연입니다. React/Vue 하이드레이션은 아닙니다.','Illustrative event activation on static markup, not React/Vue hydration.'],
 'perf-islands':['부분적인 UI만 활성화하는 모델입니다. 실제 아일랜드 프레임워크 실행은 아닙니다.','Selectively activated UI islands, not an islands-framework runtime.'],
 'perf-split':['기본/경로 청크의 가상 요청 순서를 보여줍니다. 실제 dynamic import·네트워크는 수행하지 않습니다.','Synthetic chunks and loading order; no dynamic import or fetch.'],
 'perf-shake':['명시적으로 사용된 함수의 도달 집합으로 남는 코드를 계산합니다. 실제 번들러는 아닙니다.','Dependency-reachability model, not a real bundler or minifier.'],
 'perf-lcp':['주요 콘텐츠의 표시 시각은 모의 수치이며 실제 Core Web Vitals LCP 측정값이 아닙니다.','Synthetic largest-content render timing; never a measured LCP value.'],
 'perf-cls':['영향 면적과 이동 거리의 곱으로 개념을 보여줍니다. 실제 LayoutShift 점수는 아닙니다.','Synthetic impact × distance fraction, not a measured browser CLS.'],
 'perf-inp':['입력 지연·처리·표시 단계의 모의 합산입니다. 실제 INP 측정/PerformanceObserver가 아닙니다.','Synthetic input/processing/presentation latency; not measured INP.'],
 'perf-budget':['가상의 KB 수치를 예산과 비교합니다. 실제 사이트 전송량은 측정하지 않습니다.','Synthetic payload sizes compared with a configured limit, not live site bytes.'],
 'perf-curve':['3차 베지어 y 보간의 시각화입니다. 복잡한 x축 제어점 역산은 생략합니다.','Cubic Bézier y-interpolation visualization with a linearized time axis.'],
 'perf-keyframes':['브라우저 Web Animations API를 통한 3개 변환 키프레임입니다. 스켈레탈 리깅은 아닙니다.','Three Web Animations API transform keyframes, not skeletal animation.'],
 'perf-stagger':['여러 요소를 지연 시간 차이로 재생합니다. 모션 감소 설정에서는 정적으로 보여줍니다.','Independent staggered DOM animations; reduced motion displays static objects.']
};
const byId=new Map(ITEMS.map(x=>[x[0],x])),byKey=new Map(ITEMS.map(x=>[x[1],x]));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const rules={
 critical(stage,blocked){return ['HTML','DOM+CSSOM','Layout','Paint','Composite'].map((name,i)=>({name,done:i<=stage,blocked:blocked&&i===1}));},
 reach(extra=0){const dependencies={App:['router','style'],router:['view','shared'],view:['render'],shared:['format'],style:[],render:[],format:[],debug:[],analytics:[],metrics:[],trace:[]};const imports=['App',...['debug','analytics','metrics','trace'].slice(0,extra)],queue=[...imports],seen=new Set();for(let i=0;i<queue.length;i++){const node=queue[i];if(seen.has(node))continue;seen.add(node);queue.push(...dependencies[node]);}return {all:Object.keys(dependencies),used:seen};},
 inp(task,split){const processing=split?Math.round(task*.35):task,inputDelay=16,presentation=24;return {processing,inputDelay,presentation,total:inputDelay+processing+presentation};},
 cls(shift,reserved){const impact=.38,distance=reserved?0:shift/360;return {impact,distance,score:Number((impact*distance).toFixed(4))};},
 budget(limit,opt,heavy){const parts=[180,opt?65:170,opt?75:145,heavy?310:55],total=parts.reduce((a,b)=>a+b,0);return {parts,total,over:total>limit};},
 curve(t,p,reverse){const a=clamp(p/100,0,1),c1=reverse?1-a:a,c2=reverse?a:1-a,z=clamp(t,0,1);return 3*(1-z)*(1-z)*z*c1+3*(1-z)*z*z*c2+z*z*z;},
 keyframe(t,alt){const p=clamp(t,0,1),xs=alt?[0,58,-30]:[0,95,20],ys=alt?[0,-38,-8]:[0,-27,0];if(p<=.5){return{x:xs[1]*p*2,y:ys[1]*p*2,rotation:(alt?-20:35)*p*2};}const v=(p-.5)*2;return{x:xs[1]+(xs[2]-xs[1])*v,y:ys[1]+(ys[2]-ys[1])*v,rotation:(alt?-20:35)*(1-v)};}
};
const CSS='.perf320{position:relative;display:grid;grid-template-rows:minmax(76px,1fr) auto auto auto auto;width:100%;height:100%;min-height:0;min-width:0;overflow:hidden;isolation:isolate;background:#14293e;color:#ecf8fe;font:14px/1.35 system-ui,sans-serif}.perf320 *{box-sizing:border-box}.perf320 button,.perf320 input,.perf320 output,.perf320 span,.perf320 label,.perf320 p,.perf320 b{font-size:14px;line-height:1.3}.perf320 button{font:600 14px/1.22 system-ui;min-height:31px;border:1px solid #8bacbd;border-radius:7px;padding:5px 7px;background:#23516c;color:#edfaff;cursor:pointer}.perf320 button:hover{background:#346985}.perf320 button:focus-visible,.perf320 input:focus-visible,.perf320 [tabindex]:focus-visible{outline:3px solid #ffd780;outline-offset:2px}.p320-view{min-width:0;min-height:0;display:flex;flex-direction:column;justify-content:safe center;align-items:center;gap:5px;overflow:auto;overscroll-behavior:contain;padding:6px 9px;background:radial-gradient(ellipse at 40% 0,#24465f,#13293c)}.p320-frame{display:flex;gap:5px;justify-content:center;align-items:center;flex-wrap:wrap;max-width:100%;min-width:0}.p320-tile{display:inline-flex;flex-direction:column;gap:2px;justify-content:center;align-items:center;text-align:center;min-width:47px;padding:7px 6px;border:1px solid #7396aa;border-radius:8px;background:#234960;color:#e7f3fa;font:14px/1.3 system-ui;overflow-wrap:anywhere}.p320-tile.active{background:#35785f;border-color:#a5f0cd}.p320-tile.dim{opacity:.42}.p320-hero{width:100%;max-width:248px;min-height:70px;padding:10px;border:1px solid #6e9db1;border-radius:12px;background:#2d617b;display:flex;align-items:center;justify-content:center;gap:10px;transition:background .2s,transform .2s,margin .2s;view-transition-name:atlas-perf320-hero}.p320-barlist{width:100%;max-width:280px;display:grid;gap:4px}.p320-bar{display:grid;grid-template-columns:80px minmax(0,1fr) 52px;gap:5px;align-items:center}.p320-bartrack{height:12px;border:1px solid #7293a3;background:#1b3a4f;border-radius:6px;overflow:hidden}.p320-fill{height:100%;background:#87d5b4;transition:width .16s ease-out}.p320-bar b{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}.p320-note{max-width:100%;margin:0;text-align:center;font:14px/1.3 ui-monospace,monospace;color:#cde5f2;overflow-wrap:anywhere}.p320-controls{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:5px;padding:5px 7px;border-top:1px solid #36566d}.p320-controls [data-p320=reset]{margin-left:auto}.p320-range{display:flex;align-items:center;gap:7px;padding:0 9px 5px;min-width:0}.p320-range span{white-space:nowrap}.p320-range input{min-width:22px;flex:1;height:24px;accent-color:#8bdaba}.p320-range output{text-align:right;min-width:32px;font-variant-numeric:tabular-nums}.p320-status{max-height:40px;overflow:auto;background:#173a33;color:#d1f2df;text-align:center;margin:0;padding:4px 7px}.p320-scope{max-height:43px;overflow:auto;overscroll-behavior:contain;background:#102538;color:#c3d9e8;padding:5px 8px;margin:0}.p320-motion{display:flex;align-items:center;justify-content:center;width:100%;max-width:270px;height:64px;overflow:hidden;border:1px dashed #7092a8;border-radius:10px}.p320-sprite{width:31px;height:31px;flex:none;border-radius:8px;background:#a4e5c3;box-shadow:0 2px 10px #0004}.p320-svg{display:block;width:100%;max-width:280px;max-height:114px;flex:1 1 100px;min-height:75px}.p320-svg text{font-size:14px;fill:#ebfaff}.p320-step{display:inline-block;font-size:14px}.p320-skeleton{height:18px;border-radius:6px;background:#668499;opacity:.55}.p320-widget{padding:6px 12px;border:1px solid #9ec6c3;border-radius:8px}.p320-row{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap}.p320-payload{font-variant-numeric:tabular-nums}.p320-state-label{color:#b4ddcf}@media(max-width:390px){.p320-view{padding:5px 6px}.p320-controls{gap:4px;padding:4px 5px}.p320-controls button{padding:5px}.p320-bar{grid-template-columns:72px minmax(0,1fr) 45px}.p320-range{padding:0 6px 4px;gap:4px}}@media(prefers-reduced-motion:reduce){.perf320 *{transition:none!important;animation:none!important}}html.motion-paused .perf320 *,html[data-motion=off] .perf320 *{transition:none!important;animation:none!important}@media(forced-colors:active){.perf320 button{forced-color-adjust:auto}.p320-bartrack{border:1px solid CanvasText}.p320-fill{background:Highlight}}';
let observer;const active=new Set();
function install(){if(document.getElementById('atlas-perf-v320'))return;const style=document.createElement('style');style.id='atlas-perf-v320';style.textContent=CSS;document.head.append(style);}
function markup(key,lang='ko'){const item=byKey.get(key),p=CONFIG[key],en=lang==='en';if(!item)throw Error('Unknown frontend term '+key);return '<div class="perf320" data-p320-key="'+key+'" lang="'+(en?'en':'ko')+'"><div class="p320-view" aria-label="'+esc(item[en?2:3])+'"></div><div class="p320-controls"><button type="button" data-p320="step">'+esc(p[en?7:6])+'</button><button type="button" data-p320="alt">'+esc(p[en?9:8])+'</button><button type="button" data-p320="reset" aria-label="'+(en?'Reset':'초기화')+'" title="'+(en?'Reset':'초기화')+'">↺</button></div><label class="p320-range"><span>'+esc(p[en?5:4])+'</span><input type="range" data-p320-range min="'+p[0]+'" max="'+p[1]+'" step="'+p[3]+'" value="'+p[2]+'"><output>'+p[2]+'</output></label><p class="p320-status" role="status" aria-live="polite">'+(en?'Ready':'준비')+'</p><p class="p320-scope" tabindex="0">'+esc(SCOPES[key][en?1:0])+'</p></div>';}
function mount(root,key=root.dataset.p320Key,lang=root.lang||'ko'){
 if(root.__perf320)return root.__perf320;if(!byKey.has(key))throw Error('Unknown demo '+key);
 const en=lang==='en',t=(ko,eng)=>en?eng:ko,p=CONFIG[key],view=root.querySelector('.p320-view'),slider=root.querySelector('[data-p320-range]'),status=root.querySelector('.p320-status'),controller=new AbortController();
 let s,disposed=false,animations=[];
 const element=(name,active=false)=>'<span class="p320-tile'+(active?' active':'')+'">'+esc(name)+'</span>';
 const row=content=>'<div class="p320-frame">'+content+'</div>';
 const note=text=>'<p class="p320-note">'+esc(text)+'</p>';
 const box=(title,active=false)=>'<div class="p320-tile'+(active?' active':'')+'">'+esc(title)+'</div>';
 const line=(label,n,max,suffix='')=>'<div class="p320-bar"><span>'+esc(label)+'</span><div class="p320-bartrack"><div class="p320-fill" style="width:'+clamp(n/(max||1)*100,0,100)+'%"></div></div><b>'+Math.round(n)+esc(suffix)+'</b></div>';
 const bars=contents=>'<div class="p320-barlist">'+contents+'</div>';
 const hero=(label,active)=>'<div class="p320-hero" style="background:'+(active?'#3e795e':'#2e617a')+'"><span>'+esc(label)+'</span><span>'+(active?'◆':'○')+'</span></div>';
 const motion=(content)=>'<div class="p320-motion">'+content+'</div>';
 function base(){return {param:p[2],revision:0,phase:0,alt:false,rendered:false,hydrated:false,count:0,generated:0,published:0,loaded:false,prefetched:false,mounted:0,heavy:false,optimized:false,shifted:false,reserved:false,played:false,progress:0,mode:'normal',last:0};}
 function stop(){for(const a of animations)try{a.cancel();}catch{}animations=[];}
 function reduced(){return (typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)||document.documentElement.matches('.motion-paused,[data-motion="off"]')||document.body?.classList.contains('motion-paused');}
 function render(){
  let html='',read='';
  const v=s.param;
  switch(key){
   case 'perf-view':html=hero(s.alt?t('즉시 전환','Instant view'):s.phase%2?t('상세 보기','Detail view'):t('목록 보기','List view'),s.phase%2);read=(typeof document.startViewTransition==='function'?t('API 지원','API supported'):t('즉시 전환 대체','Instant fallback'))+' · '+v+'ms';break;
   case 'perf-path':{const items=rules.critical(s.phase,s.alt?false:true);html=row(items.map((x,i)=>box(x.name,x.done)).join(''));read=t('완료 단계 ','Completed ')+(s.phase+1)+'/5 · '+(s.alt?t('차단 제거 모델','unblocked model'):t('CSS 차단 모델','CSS-blocking model'));break;}
   case 'perf-csr':html=s.rendered?hero(t('JS로 완성된 화면','Client-rendered view'),true):'<div style="width:70%;display:grid;gap:8px">'+['80%','96%','55%'].map(w=>'<div class="p320-skeleton" style="width:'+w+'"></div>').join('')+'</div>';read=s.rendered?t('클라이언트 DOM 구성 완료','Client DOM populated'):t('초기 빈/스켈레톤 DOM','Initial skeleton')+' · '+v+'KB ('+t('가상','synthetic')+')';break;
   case 'perf-ssr':html=s.alt?hero(t('CSR 초기 스켈레톤','CSR first paint'),false):hero(t('HTML에 이미 존재하는 제목','Title already in HTML'),true);read=(s.alt?'CSR comparison':s.hydrated?t('클라이언트 이벤트 활성','Client events attached'):t('HTML 초기 표시','HTML initially visible'))+' · '+v+'ms '+t('모의','mock');break;
   case 'perf-ssg':html=row([box(t('빌드 파일','Build output')+' '+s.generated,true),box(t('게시판','Published')+' '+s.published,s.generated===s.published)].join(''));read=v+t('페이지 · ',' pages · ')+t('빌드 후 게시 분리','build and publish are separate');break;
   case 'perf-hydration':html=row(Array.from({length:v},(_,i)=>box('B'+(i+1),s.hydrated)).join(''));read=s.hydrated?t('이벤트 활성 · 클릭 '+s.count,'Active controls · clicks '+s.count):t('정적 버튼 · 동작 미연결','Static buttons · not active');break;
   case 'perf-islands':html=row(Array.from({length:v},(_,i)=>box('Island '+(i+1),i<s.mounted)).join(''));read=s.mounted+'/'+v+t('개 영역 활성화',' active regions');break;
   case 'perf-split':html=row(box('core · 120KB',true)+box('route · '+v+'KB',s.loaded)+box('prefetch',s.prefetched));read=s.loaded?t('경로 준비 완료','Route ready'):s.prefetched?t('사전 로드됨','Prefetched'):t('기본 청크만 사용','Core chunk only');break;
   case 'perf-shake':{const result=rules.reach(v),used=result.used;html=row(result.all.map(x=>'<span class="p320-tile '+(used.has(x)?'active':s.alt?'':'dim')+'">'+esc(x)+'</span>').join(''));read=used.size+'/'+result.all.length+t('개 모듈 유지',' retained modules')+' · '+(result.all.length-used.size)+t('개 미사용',' unused');break;}
   case 'perf-lcp':{const ms=Math.max(0,Math.round(v*(s.optimized?.6:1)+(s.heavy?800:0)));html=hero(s.rendered?t('주요 이미지 표시','Largest content visible'):t('주요 콘텐츠 로딩','Hero pending'),s.rendered);read=t('모의 LCP 시각 ','Synthetic LCP time ')+ms+'ms';break;}
   case 'perf-cls':{const r=rules.cls(v,s.reserved),y=s.shifted&&!s.reserved?v:0;html='<div class="p320-hero" style="min-height:38px;padding:5px;background:#2c536e">'+t('늦게 도착하는 콘텐츠','Late content')+'</div><div class="p320-widget" style="transform:translateY('+Math.min(y,52)+'px);transition:transform .18s">'+t('뒤에 놓인 버튼','Content below')+'</div>';read=t('모의 CLS ','Synthetic CLS ')+r.score.toFixed(4)+' · '+(s.reserved?t('공간 확보','space reserved'):t('자리 이동','shift possible'));break;}
   case 'perf-inp':{const r=rules.inp(v,s.optimized);html=bars(line(t('입력 지연','Input delay'),r.inputDelay,550,'ms')+line(t('처리','Processing'),r.processing,550,'ms')+line(t('화면 표시','Presentation'),r.presentation,550,'ms'));read=t('모의 INP ','Synthetic INP ')+(s.rendered?r.total+'ms':t('실행 전','not simulated'));break;}
   case 'perf-budget':{const r=rules.budget(v,s.optimized,s.heavy);html=bars(['HTML','CSS','JS','Media'].map((label,i)=>line(label,r.parts[i],450,'KB')).join(''));read=r.total+' / '+v+'KB · '+(r.over?t('예산 초과','over budget'):t('예산 내','within budget'));break;}
   case 'perf-curve':{const points=Array.from({length:51},(_,i)=>{const x=i/50;return [(20+x*240).toFixed(1),(118-rules.curve(x,v,s.alt)*98).toFixed(1)];});const d=points.map((xy,i)=>(i?'L':'M')+xy.join(' ')).join('');html='<svg class="p320-svg" viewBox="0 0 280 135" role="img" aria-label="'+esc(t('이징 곡선','Easing curve'))+'"><path d="M20 18V118H260" fill="none" stroke="#638ba4" stroke-width="2"/><path d="'+d+'" stroke="#b4e9d3" stroke-width="3" fill="none"/><circle cx="'+(20+240*(s.played?1:.5))+'" cy="'+(118-98*rules.curve(s.played?1:.5,v,s.alt))+'" r="5" fill="#f4d391"/></svg>';read=(s.alt?'reverse':'forward')+' · cubic Bézier y(t) · '+v;break;}
   case 'perf-keyframes':{const r=rules.keyframe(v/100,s.alt);html=motion('<span class="p320-sprite" data-p320-sprite style="transform:translate('+r.x.toFixed(1)+'px,'+r.y.toFixed(1)+'px) rotate('+r.rotation.toFixed(1)+'deg)"></span>');read=t('키프레임 위치 ','Keyframe position ')+v+'% · x='+r.x.toFixed(0);break;}
   case 'perf-stagger':html=motion('<div class="p320-row">'+Array.from({length:4},(_,i)=>'<span class="p320-sprite" data-p320-sprite="'+i+'" style="width:32px;height:32px;border-radius:7px;display:inline-block"></span>').join('')+'</div>');read=(s.alt?t('역순 재생','Reverse order'):t('정방향 재생','Forward order'))+' · '+v+'ms';break;
  }
  view.innerHTML=html+note(read);
  slider.value=String(s.param);root.querySelector('output').textContent=String(s.param);
  root.dataset.label=read;root.dataset.mode=s.alt?'alternative':'primary';
  root.dataset.revision=String(s.revision);
 }
 function playMotion(){
  if(reduced()||typeof Element==='undefined'||typeof Element.prototype.animate!=='function')return;
  if(key==='perf-curve'){
   const svg=view.querySelector('svg');if(!svg)return;
   const a=svg.animate([{opacity:.55,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0px)'}],{duration:Math.max(200,s.param*9),easing:'ease-in-out'});animations.push(a);
  }else if(key==='perf-keyframes'){
   const el=view.querySelector('[data-p320-sprite]');if(!el)return;const middle=rules.keyframe(.5,s.alt),end=rules.keyframe(1,s.alt);
   const frames=[{transform:'translate(0px,0px) rotate(0deg)'},{transform:'translate('+middle.x+'px,'+middle.y+'px) rotate('+middle.rotation+'deg)'},{transform:'translate('+end.x+'px,'+end.y+'px) rotate('+end.rotation+'deg)'}];
   const a=el.animate(frames,{duration:1100,iterations:1,fill:'none',easing:'ease-in-out'});animations.push(a);
  }else if(key==='perf-stagger'){
   for(const el of view.querySelectorAll('[data-p320-sprite]')){
    const i=Number(el.dataset.p320Sprite),order=s.alt?3-i:i;
    animations.push(el.animate([{opacity:0,transform:'translateY(18px) scale(.65)'},{opacity:1,transform:'translateY(0px) scale(1)'}],{delay:order*s.param,duration:260,easing:'ease-out',fill:'both'}));
   }
  }
 }
 function reset(){stop();s=base();root.dataset.state='ready';render();status.textContent=t('초기화 · 버튼으로 조작하세요','Reset · use the controls');}
 function apply(action){
  if(action==='reset'){reset();return;}
  stop();s.revision++;root.dataset.state='changed';
  const alt=action==='alt';
  if(key==='perf-view'){
   if(alt){s.alt=!s.alt;s.phase++;render();}
   else{const update=()=>{s.alt=false;s.phase++;render();};if(typeof document.startViewTransition==='function'&&!reduced())try{document.startViewTransition(update);}catch{update();}else update();}
  }else{
   switch(key){
    case 'perf-path':if(alt)s.alt=!s.alt;else s.phase=(s.phase+1)%5;break;
    case 'perf-csr':if(alt)s.rendered=!s.rendered;else s.rendered=true;break;
    case 'perf-ssr':if(alt)s.alt=!s.alt;else s.hydrated=true;break;
    case 'perf-ssg':if(alt)s.published=s.generated;else s.generated++;break;
    case 'perf-hydration':if(alt){if(s.hydrated)s.count++;}else s.hydrated=true;break;
    case 'perf-islands':if(alt)s.mounted=s.param;else s.mounted=Math.min(s.param,s.mounted+1);break;
    case 'perf-split':if(alt)s.prefetched=true;else s.loaded=true;break;
    case 'perf-shake':if(alt)s.alt=!s.alt;else s.param=s.param>=4?1:s.param+1;break;
    case 'perf-lcp':if(alt)s.heavy=!s.heavy;else{s.optimized=true;s.rendered=true;}break;
    case 'perf-cls':if(alt)s.reserved=!s.reserved;else s.shifted=!s.shifted;break;
    case 'perf-inp':if(alt)s.optimized=!s.optimized;else s.rendered=true;break;
    case 'perf-budget':if(alt)s.heavy=!s.heavy;else s.optimized=!s.optimized;break;
    case 'perf-curve':if(alt)s.alt=!s.alt;else s.played=!s.played;break;
    case 'perf-keyframes':if(alt)s.alt=!s.alt;else s.played=true;break;
    case 'perf-stagger':if(alt)s.alt=!s.alt;s.played=true;break;
   }
   render();
  }
  if(!alt||['perf-keyframes','perf-stagger'].includes(key))playMotion();
  status.textContent=view.querySelector('.p320-note')?.textContent||t('상태가 갱신되었습니다.','Updated.');
 }
 root.addEventListener('click',event=>{const b=event.target.closest('button[data-p320]');if(!b||!root.contains(b))return;event.stopPropagation();apply(b.dataset.p320);},{signal:controller.signal});
 slider.addEventListener('input',()=>{stop();s.param=clamp(Number(slider.value),p[0],p[1]);s.revision++;root.dataset.state='changed';if(key==='perf-islands')s.mounted=Math.min(s.mounted,s.param);render();status.textContent=p[en?5:4]+' '+s.param;},{signal:controller.signal});
 reset();
 const study={root,key,act:apply,snapshot:()=>JSON.parse(JSON.stringify(s)),dispose(){disposed=true;stop();controller.abort();active.delete(study);delete root.__perf320;}};
 root.__perf320=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const item of active)if(!item.root.isConnected)item.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown frontend code '+entry?.id);const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e7eef3;color:#163c53;font:16px/1.5 system-ui}main{max-width:660px;margin:auto}h1{font-size:24px}.demo{height:370px;border-radius:14px;overflow:hidden;border:1px solid #a2b6cb}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div id="demo" class="demo"></div><p>'+esc(SCOPES[item[1]][en?1:0])+'</p></main><script>('+initAtlasPerf320.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasPerf320.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasPerf320.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){
 const A=global.Atlas32;if(!A||A.__perf320)return false;A.__perf320=true;const previous={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};
 A.recipe=e=>byId.get(e?.id)?.[1]||previous.recipe(e);
 A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-performance-study" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive frontend/performance study':'직접 조작하는 웹 렌더링·모션 예제'}:previous.art(e,lang);};
 A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):previous.markup(key,lang);
 A.mount=(scope=document)=>{previous.mount(scope);const roots=scope.matches?.('.perf320')?[scope]:[...scope.querySelectorAll('.perf320')];roots.forEach(el=>mount(el));};
 A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):previous.code(e,lang);
 return true;
}
install();global.AtlasPerf320={ITEMS,CONFIG,SCOPES,byId,byKey,rules,markup,mount,code,attach,CSS,version:'3.20.0',activeCount:()=>active.size};attach();
})(window);
