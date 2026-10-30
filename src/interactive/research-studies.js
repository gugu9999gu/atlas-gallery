/* ATLAS Research & UX Lab: twenty original interactive studies for existing terms.
 * No vendor impersonation, external requests, telemetry, or invented observations.
 */
(function initAtlasResearch(global){
'use strict';
const ITEMS=[
 ['dar-04dd8ace06ed','rs-ia','Information Architecture (IA)','정보 구조 설계'],
 ['dar-e09f44244ea3','rs-task','Task Flow','작업 흐름'],
 ['dar-6f898c58315e','rs-journey','User Journey Map','사용자 여정 지도'],
 ['dar-d783e29e433b','rs-blueprint','Service Blueprint','서비스 블루프린트'],
 ['dar-935948cbb920','rs-persona','Persona','페르소나'],
 ['dar-edf8d697653d','rs-usability','Usability Testing','사용성 테스트'],
 ['dar-7d17b28695f3','rs-heuristic','Heuristic Evaluation','휴리스틱 평가'],
 ['dar-3bc66b146ab2','rs-walkthrough','Cognitive Walkthrough','인지적 워크스루'],
 ['dar-684ed5a6d984','rs-ab','A/B Testing','A/B 테스트'],
 ['dar-3eb43daaf59d','rs-funnel','Funnel Analysis','퍼널 분석'],
 ['dar-23f9a1de0dec','rs-heatmap','Heatmap Analysis','히트맵 분석'],
 ['dar-40d4bd0ca323','rs-sort','Card Sorting','카드 소팅'],
 ['dar-c32c873aa4d2','rs-tree','Tree Testing','트리 테스트'],
 ['dar-69e500feb8b2','rs-matrix','State Matrix','상태 행렬'],
 ['dar-75c3e926cd30','rs-regression','Visual Regression Test','시각 회귀 테스트'],
 ['dar-f6bfdfa7a35a','rs-fitts',"Fitts's Law",'피츠의 법칙'],
 ['dar-0f438bfa631c','rs-hick','Hick–Hyman Law','힉·하이먼 법칙'],
 ['dar-ccc2e115cb50','rs-access','Accessibility Audit','접근성 감사'],
 ['dar-2b590ac95226','rs-content','Content Model','콘텐츠 모델'],
 ['dar-a01220fd37ad','rs-handoff','Design Handoff','디자인 핸드오프']
];
const byId=new Map(ITEMS.map(x=>[x[0],x])),byKey=new Map(ITEMS.map(x=>[x[1],x]));
const supports=k=>byKey.has(k);
const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const labels=(ko,a,b)=>ko?a:b;
const btn=(act,a,b,ko,attrs='')=>'<button type="button" data-rs="'+act+'" '+attrs+'>'+esc(labels(ko,a,b))+'</button>';
const bar=(label,percentage)=>'<div class="rs-bar-line"><span>'+esc(label)+'</span><div class="rs-meter"><i style="width:'+percentage+'%"></i></div><strong>'+percentage+'%</strong></div>';
function markup(key,lang='ko'){
 const item=byKey.get(key);if(!item)throw Error('Unknown ATLAS research key: '+key);
 const ko=lang!=='en',t=(a,b)=>labels(ko,a,b);let body='',controls='',hint=t('직접 조작하여 개념을 확인하세요.','Interact with this original study.');
 switch(key){
 case 'rs-ia':
  body='<div class="rs-tree"><strong>'+t('서비스 전체','Site structure')+'</strong>'+btn('branch', '제품 카테고리 펼치기','Expand product category',ko,'aria-expanded="false"')+'<div class="rs-subtree" hidden>'+btn('leaf','결제 안내','Billing',ko)+btn('leaf','배송 안내','Shipping',ko)+'</div></div>';hint=t('상위·하위 정보 구조를 펼쳐 탐색합니다.','Explore parent and child information categories.');break;
 case 'rs-task':
  body='<div class="rs-stepper">'+[t('상품 찾기','Find item'),t('결제하기','Pay'),t('확인','Confirm')].map((v,i)=>'<span class="rs-step '+(!i?'active':'')+'">'+(i+1)+'. '+v+'</span>').join('')+'</div>';
  controls=btn('back','이전','Back',ko)+btn('next','다음','Next',ko);hint=t('작업을 완료하기까지 순서대로 진행합니다.','Move through the task completion sequence.');break;
 case 'rs-journey':
  body='<div class="rs-journey"><div class="rs-journey-stages">'+[t('인지','Aware'),t('비교','Compare'),t('사용','Use'),t('재방문','Return')].map((v,i)=>'<span class="'+(!i?'active':'')+'">'+v+'</span>').join('')+'</div><div class="rs-journey-score">'+t('감정 지표','Emotion score')+': <strong>+1</strong> <span>'+t('설명용 값','synthetic')+'</span></div></div>';
  controls=btn('next','다음 접점','Next touchpoint',ko);hint=t('접점별 경험과 감정의 변화를 탐색합니다.','Inspect illustrative touchpoints and emotion.');break;
 case 'rs-blueprint':
  body='<div class="rs-blueprint"><div class="rs-blueprint-row"><b>'+t('고객 접점','Customer')+'</b><span>'+t('예약 접수','Booking')+'</span></div><div class="rs-blueprint-row"><b>'+t('프런트','Frontstage')+'</b><span>'+t('접수 확인','Confirmation')+'</span></div><div class="rs-blueprint-row rs-back"><b>'+t('백스테이지','Backstage')+'</b><span>'+t('내부 처리','Processing')+'</span></div></div>';
  controls=btn('toggle','내부 작업 강조','Highlight backstage',ko);hint=t('고객에게 보이는 업무와 내부 업무를 분리합니다.','Separate customer-visible and backstage work.');break;
 case 'rs-persona':
  body='<div class="rs-persona"><span class="rs-avatar" aria-hidden="true">◎</span><div><strong class="rs-persona-title">'+t('처음 방문한 사용자','First-time visitor')+'</strong><p class="rs-persona-goal">'+t('목표: 빠르게 필요한 정보 찾기','Goal: Find answers quickly')+'</p></div></div>';
  controls=btn('toggle','다른 사용 맥락','Switch scenario',ko);hint=t('가상의 행동·제약을 명시합니다. 실제 조사 결과가 아닙니다.','A fictional scenario, not a research participant.');break;
 case 'rs-usability':
  body='<div class="rs-testing"><strong>'+t('과제: 결제 내역 찾기','Task: Locate payment history')+'</strong><output class="rs-timer">00.0 s</output><span class="rs-user-result">'+t('시작하지 않음','Not started')+'</span></div>';
  controls=btn('start','과제 시작','Start task',ko)+btn('complete','완료','Complete',ko);hint=t('과제 수행 시간을 로컬에서만 측정합니다.','Timer stays local to this demonstration.');break;
 case 'rs-heuristic':
  body='<div class="rs-assess"><strong class="rs-assess-rule">'+t('상태 가시성','Visibility of system status')+'</strong><p class="rs-assess-issue">'+t('점검: 진행 상태가 보이는가?','Check: Is progress visible?')+'</p></div>';
  controls=btn('next','다음 휴리스틱','Next heuristic',ko);hint=t('대표 원칙별 점검 예시이며 공인 평가 결과가 아닙니다.','Illustrative inspection, not a certified evaluation.');break;
 case 'rs-walkthrough':
  body='<div class="rs-assess"><strong class="rs-question">'+t('사용자는 다음 행동을 알아볼 수 있는가?','Can users identify the next action?')+'</strong><span class="rs-assess-issue">'+t('단계 1 / 3','Step 1 / 3')+'</span></div>';
  controls=btn('yes','예','Yes',ko)+btn('no','어려움','No',ko);hint=t('초보 사용자의 관점에서 단계별 질문에 답합니다.','Answer sequential questions from a novice viewpoint.');break;
 case 'rs-ab':
  body='<div class="rs-ab">'+bar('A · '+t('대조군','Control'),42)+bar('B · '+t('변형','Variant'),49)+'</div>';
  controls=btn('next','다음 가상 표본','Another sample',ko);hint=t('전환율은 예시이며 실제 실험·유의성 검증이 아닙니다.','Synthetic rates, not a real experiment or significance test.');break;
 case 'rs-funnel':
  body='<div class="rs-funnel">'+bar(t('방문','Visit'),100)+bar(t('가입','Signup'),64)+bar(t('결제','Purchase'),32)+'</div>';
  controls='<label class="rs-range-label">'+t('중간 단계 유지율','Mid-step retention')+' <input data-rs-range type="range" min="30" max="90" step="5" value="65"></label>';hint=t('가상 단계별 이탈 비율을 조절합니다.','Adjust illustrative step-by-step drop-off.');break;
 case 'rs-heatmap':
  body='<div class="rs-heatmap">'+Array.from({length:25},(_,i)=>'<button type="button" data-cell="'+i+'" style="--rs-intensity:'+(.14+(i*13%11)/12).toFixed(2)+'" aria-label="'+t('영역','Cell')+' '+(i+1)+'"></button>').join('')+'</div>';
  controls=btn('toggle','강도 패턴 변경','Change intensity',ko);hint=t('가상 상호작용 밀도이며 사용자 추적 데이터가 아닙니다.','Synthetic density; no user tracking data.');break;
 case 'rs-sort':
  body='<div class="rs-sorting"><strong>'+t('카드 정리','Group these cards')+'</strong><div class="rs-sort-board">'+[t('설정','Settings'),t('결제','Billing'),t('문의','Support')].map((x,i)=>btn('move',x,x,ko,'data-index="'+i+'"')).join('')+'</div><output class="rs-sort-count">'+t('그룹에 담긴 카드: 0','Grouped cards: 0')+'</output></div>';
  hint=t('카드를 누르면 그룹에 배치되며 다시 누르면 해제됩니다.','Click cards to group or ungroup them.');break;
 case 'rs-tree':
  body='<div class="rs-navigation"><strong>'+t('영수증 메뉴를 찾으세요','Find the receipts menu')+'</strong><div class="rs-tree-options">'+btn('nav','계정','Account',ko,'data-node="account"')+btn('nav','상품','Products',ko,'data-node="products"')+'</div></div>';
  hint=t('메뉴 경로를 따라가며 탐색 성공 여부를 확인합니다.','Test whether navigation leads to the target.');break;
 case 'rs-matrix':
  body='<div class="rs-matrix"><span>'+t('기본','Default')+'</span><span>'+t('호버','Hover')+'</span><span>'+t('비활성','Disabled')+'</span>'+['PRIMARY','SECONDARY'].flatMap(row=>['DEFAULT','HOVER','DISABLED'].map((v,i)=>btn('state',row.slice(0,1)+'-'+(i+1),row.slice(0,1)+'-'+(i+1),ko,'data-cell="'+row+':'+v+'"'))).join('')+'</div>';
  hint=t('변형 × 상태 조합을 누르면 명세 셀이 선택됩니다.','Inspect combinations of variant and interaction state.');break;
 case 'rs-regression':
  body='<div class="rs-regression"><div class="rs-baseline"><span>'+t('이전 화면','Before')+'</span><i></i><i></i></div><div class="rs-after" style="clip-path:inset(0 50% 0 0)"><span>'+t('변경 화면','After')+'</span><i></i><i></i></div><span class="rs-divider"></span></div>';
  controls='<label class="rs-range-label">'+t('전후 비교','Compare')+' <input data-rs-range type="range" min="0" max="100" value="50"></label>';hint=t('원본 대비 시각 차이를 슬라이더로 비교합니다.','Slide between original and changed illustrative UI.');break;
 case 'rs-fitts':
  body='<div class="rs-fitts">'+btn('target','작은 목표','Small target',ko,'data-size="small"')+btn('target','큰 목표','Large target',ko,'data-size="large"')+'</div>';
  controls=btn('toggle','거리 변경','Change distance',ko);hint=t('목표 크기·거리의 효과를 실험합니다. 실제 이동시간 통계가 아닙니다.','Explore target size and distance, without measured timing claims.');break;
 case 'rs-hick':
  body='<div class="rs-hick"><div class="rs-choice-grid">'+Array.from({length:2},(_,i)=>btn('choice','옵션 '+(i+1),'Option '+(i+1),ko)).join('')+'</div><strong class="rs-estimate">2 '+t('가지 선택','choices')+' · 0.42s</strong></div>';
  controls=btn('next','선택지 증가','More choices',ko);hint=t('예시 모델 T=0.1+0.2 log₂(n+1), 실제 측정값 아님','Illustrative model T=0.1+0.2 log₂(n+1), not measured.');break;
 case 'rs-access':
  body='<div class="rs-checks">'+[t('이름·레이블','Accessible names'),t('키보드 조작','Keyboard access'),t('대비 점검','Contrast check')].map((label,i)=>'<label><input type="checkbox" data-check="'+i+'" '+(i?'':'checked')+' />'+label+'</label>').join('')+'</div>';
  controls=btn('next','점검 개수 확인','Count checks',ko);hint=t('교육용 점검표이며 WCAG 인증이 아닙니다.','Illustrative checklist, not WCAG certification.');break;
 case 'rs-content':
  body='<div class="rs-content"><label>'+t('제목','Title')+' <input type="text" maxlength="36" data-content="title" value="'+t('디자인 안내','Design guide')+'"></label><output class="rs-json" aria-label="'+t('콘텐츠 미리보기','Content preview')+'"></output></div>';
  controls=btn('next','JSON 갱신','Update schema',ko);hint=t('제목·상태 필드를 구조화한 로컬 데이터 모델입니다.','Locally structured title and status fields.');break;
 case 'rs-handoff':
  body='<div class="rs-handoff"><div class="rs-sample-button">'+t('주요 버튼','Primary button')+'</div><code class="rs-tokens">radius: 10px · padding: 12px</code></div>';
  controls=btn('next','토큰 변경','Change tokens',ko);hint=t('구현자에게 전달할 디자인 토큰·상태를 보여줍니다.','Inspect design tokens and implementation states.');break;
 }
 return '<div class="rs-stage" data-kind="'+esc(key)+'" tabindex="0" role="group" lang="'+(ko?'ko':'en')+'" aria-label="'+esc(t('직접 조작하는 '+item[3]+' 예시','Interactive '+item[2]+' study'))+'"><div class="rs-scene">'+body+'</div><div class="rs-controls">'+controls+'</div><p class="rs-hint">'+hint+'</p><output class="rs-status" role="status" aria-live="polite">'+t('조작을 시작하세요.','Try the controls.')+'</output></div>';
}
function mount(root,key,language='ko',options={}){
 if(!supports(key))throw Error('Missing study '+key);
 const ko=language!=='en',t=(a,b)=>labels(ko,a,b),q=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)],ac=new AbortController(),signal=ac.signal,output=q('.rs-status');
 let stage=0,count=0,start=0,picked=new Set(),timer=null;
 const tell=(a,b)=>{output.textContent=t(a,b);root.dataset.changed=String((Number(root.dataset.changed)||0)+1);};
 const on=(el,name,fn)=>el?.addEventListener(name,fn,{signal});
 const updateStep=(selector)=>all(selector).forEach((el,i)=>el.classList.toggle('active',i===stage));
 const resetTree=()=>{const box=q('.rs-tree-options');if(!box)return;box.replaceChildren();const x=(kind,label)=>{const btn=document.createElement('button');btn.type='button';btn.dataset.rs='nav';btn.dataset.node=kind;btn.textContent=label;box.append(btn);};x('account',t('계정','Account'));x('products',t('상품','Products'));};
 const fillContent=()=>{const input=q('[data-content=title]');if(!input)return;const o=q('.rs-json');o.textContent=JSON.stringify({title:input.value,status:'draft'},null,2);};
 function act(action,el){
  switch(key){
   case 'rs-ia':{
    if(action==='branch'){const box=q('.rs-subtree'),expanded=box.hidden;box.hidden=!expanded;el.setAttribute('aria-expanded',String(expanded));tell(expanded?'하위 경로를 펼쳤습니다.':'하위 경로를 닫았습니다.',expanded?'Expanded child categories.':'Collapsed child categories.');}
    else tell('선택한 메뉴: '+el.textContent,'Selected category: '+el.textContent);
    break;}
   case 'rs-task':stage=Math.max(0,Math.min(2,stage+(action==='back'?-1:1)));updateStep('.rs-step');root.dataset.step=String(stage+1);tell('작업 단계 '+(stage+1)+'/3','Task step '+(stage+1)+'/3');break;
   case 'rs-journey':{stage=(stage+1)%4;updateStep('.rs-journey-stages span');const score=[1,-2,2,3][stage],label=score>0?'+'+score:String(score);q('.rs-journey-score strong').textContent=label;root.dataset.score=String(score);tell('접점 '+(stage+1)+' · 감정 '+label,'Touchpoint '+(stage+1)+' · emotion '+label);break;}
   case 'rs-blueprint':{root.classList.toggle('rs-reveal');tell(root.classList.contains('rs-reveal')?'내부 처리 작업 강조':'고객 접점 강조',root.classList.contains('rs-reveal')?'Highlighted backstage work.':'Highlighted customer touchpoints.');break;}
   case 'rs-persona':{stage=(stage+1)%2;q('.rs-persona-title').textContent=t(stage?'재방문 사용자':'처음 방문한 사용자',stage?'Returning visitor':'First-time visitor');q('.rs-persona-goal').textContent=t(stage?'목표: 지난 설정을 빠르게 변경':'목표: 빠르게 필요한 정보 찾기',stage?'Goal: Change saved settings':'Goal: Find answers quickly');root.dataset.persona=String(stage);tell('가상 페르소나 맥락 변경','Switched the fictional persona.');break;}
   case 'rs-usability':{
    if(action==='start'){start=performance.now();q('.rs-user-result').textContent=t('진행 중','In progress');q('.rs-timer').textContent='00.0 s';tell('로컬 과제 시작','Local task started');root.dataset.task='started';}
    if(action==='complete'){if(!start){tell('먼저 과제를 시작하세요.','Start the task first.');break;}const time=((performance.now()-start)/1000).toFixed(1);q('.rs-timer').textContent=time+' s';q('.rs-user-result').textContent=t('과제 완료','Task complete');root.dataset.task='complete';tell('완료 시간 '+time+'초','Finished in '+time+' seconds');start=0;}
    break;}
   case 'rs-heuristic':{stage=(stage+1)%3;const rules=ko?[['사용자 통제','취소·되돌리기가 가능한가?'],['일관성','같은 작업의 명칭이 일관적인가?'],['상태 가시성','진행 상태가 보이는가?']]:[['User control','Can actions be undone?'],['Consistency','Are similar actions named consistently?'],['Visibility of system status','Can users see progress?']];q('.rs-assess-rule').textContent=rules[stage][0];q('.rs-assess-issue').textContent=rules[stage][1];tell('휴리스틱 '+(stage+1)+'/3','Heuristic '+(stage+1)+'/3');break;}
   case 'rs-walkthrough':{count+=action==='yes'?1:0;stage=(stage+1)%3;const questions=ko?['다음 행동을 알아볼 수 있는가?','정확한 요소를 찾을 수 있는가?','결과를 이해할 수 있는가?']:['Can users identify the next action?','Can they find the right control?','Can they interpret the result?'];q('.rs-question').textContent=questions[stage];q('.rs-assess-issue').textContent=t('단계 ','Step ')+(stage+1)+'/3';tell('가능 응답 '+count+'건','Yes answers: '+count);break;}
   case 'rs-ab':{stage++;const a=42+(stage*3%14),b=49+(stage*5%17);const bars=all('.rs-ab .rs-bar-line');[a,b].forEach((v,i)=>{bars[i].querySelector('i').style.width=v+'%';bars[i].querySelector('strong').textContent=v+'%';});root.dataset.sample=String(stage);tell('가상 표본 '+(stage+1),'Synthetic sample '+(stage+1));break;}
   case 'rs-heatmap':{stage++;all('.rs-heatmap button').forEach((node,i)=>node.style.setProperty('--rs-intensity',String(.14+((i*13+stage*17)%11)/12)));root.dataset.pattern=String(stage);tell('가상 강도 패턴 '+(stage+1),'Synthetic pattern '+(stage+1));break;}
   case 'rs-sort':{const n=Number(el.dataset.index);picked.has(n)?picked.delete(n):picked.add(n);el.classList.toggle('active',picked.has(n));q('.rs-sort-count').textContent=t('그룹에 담긴 카드: ','Grouped cards: ')+picked.size;root.dataset.grouped=String(picked.size);tell('카드 '+(n+1)+'번 분류 상태 변경','Changed grouping of card '+(n+1));break;}
   case 'rs-tree':{
    const box=q('.rs-tree-options'),n=el.dataset.node;
    const make=(id,label)=>{const b=document.createElement('button');b.type='button';b.dataset.rs='nav';b.dataset.node=id;b.textContent=label;box.append(b);};
    box.replaceChildren();
    if(n==='account'){make('profile',t('프로필','Profile'));make('billing',t('결제','Billing'));tell('계정 하위 메뉴','Account submenu');}
    else if(n==='billing'){make('receipt',t('영수증','Receipts'));make('method',t('결제 수단','Payment method'));tell('결제 하위 메뉴','Billing submenu');}
    else if(n==='receipt'){root.dataset.found='true';make('restart',t('다시 탐색','Start over'));tell('영수증 메뉴 찾기 성공','Found the receipts menu');}
    else if(n==='restart') {resetTree();tell('처음부터 탐색합니다.','Navigation reset.');}
    else{make('restart',t('다시 탐색','Start over'));tell('다른 경로입니다.','This is a different path.');}
    break;}
   case 'rs-matrix':{all('.rs-matrix [data-cell]').forEach(x=>x.classList.toggle('active',x===el));root.dataset.cell=el.dataset.cell;tell('선택 상태: '+el.dataset.cell,'Selected state: '+el.dataset.cell);break;}
   case 'rs-fitts':{
    if(action==='toggle'){root.classList.toggle('rs-far');tell(root.classList.contains('rs-far')?'목표 간 거리 증가':'목표 간 거리 축소',root.classList.contains('rs-far')?'Targets farther apart.':'Targets closer together.');}
    else{count++;root.dataset.target=el.dataset.size;root.dataset.attempts=String(count);tell(el.dataset.size==='small'?'작은 목표 선택':'큰 목표 선택',el.dataset.size==='small'?'Small target hit.':'Large target hit.');}
    break;}
   case 'rs-hick':{
    if(action==='next'){stage=(stage+1)%3;const n=[2,4,8][stage];const grid=q('.rs-choice-grid');grid.replaceChildren();for(let i=0;i<n;i++){const b=document.createElement('button');b.type='button';b.dataset.rs='choice';b.textContent=t('옵션 ','Option ')+(i+1);grid.append(b);}const estimate=(.1+.2*Math.log2(n+1)).toFixed(2);q('.rs-estimate').textContent=n+' '+t('가지 선택','choices')+' · '+estimate+'s';root.dataset.choices=String(n);tell('예시 결정 시간 '+estimate+'초','Illustrative model time '+estimate+' seconds');}
    else tell('옵션 선택: '+el.textContent,'Selected: '+el.textContent);
    break;}
   case 'rs-access':{const total=all('[data-check]:checked').length;root.dataset.passed=String(total);tell('점검 선택 '+total+'/3 · 인증 결과 아님','Checks selected '+total+'/3 · not certification');break;}
   case 'rs-content':fillContent();root.dataset.updated='true';tell('구조화된 콘텐츠 갱신','Structured content updated');break;
   case 'rs-handoff':{stage=(stage+1)%3;const rad=[10,16,24][stage],pad=[12,14,18][stage];q('.rs-sample-button').style.borderRadius=rad+'px';q('.rs-sample-button').style.padding=pad+'px';q('.rs-tokens').textContent='radius: '+rad+'px · padding: '+pad+'px';root.dataset.radius=String(rad);tell('디자인 토큰 반영: '+rad+'px','Applied design token: '+rad+'px');break;}
  }
 }
 for(const button of all('[data-rs]'))on(button,'click',()=>act(button.dataset.rs,button));
 // Delegation supports dynamic tree nodes and changed Hick–Hyman choices.
 on(root,'click',e=>{const b=e.target.closest('[data-rs]');if(!b||!root.contains(b))return;if(b.hasAttribute('data-rs-bound'))return;act(b.dataset.rs,b);});
 all('[data-rs]').forEach(b=>b.setAttribute('data-rs-bound','1'));
 if(key==='rs-heatmap')all('.rs-heatmap button').forEach((cell,i)=>on(cell,'click',()=>{all('.rs-heatmap button').forEach(b=>b.classList.toggle('active',b===cell));root.dataset.selected=String(i+1);tell('가상 히트맵 영역 '+(i+1)+' 선택','Selected synthetic heatmap cell '+(i+1));}));
 on(root,'keydown',e=>{if(e.target===root&&(e.key==='Enter'||e.key===' ')){const button=q('[data-rs="next"]')||q('[data-rs="toggle"]');if(button){e.preventDefault();button.click();}}});
 const range=q('[data-rs-range]');on(range,'input',()=>{
  const n=Number(range.value);
  if(key==='rs-funnel'){const rows=all('.rs-funnel .rs-bar-line');[100,n,Math.round(n*.5)].forEach((v,i)=>{rows[i].querySelector('i').style.width=v+'%';rows[i].querySelector('strong').textContent=v+'%';});root.dataset.retention=String(n);tell('중간 단계 유지율 '+n+'%','Mid-step retention '+n+'%');}
  if(key==='rs-regression'){const after=q('.rs-after'),divider=q('.rs-divider');after.style.clipPath='inset(0 '+(100-n)+'% 0 0)';divider.style.left=n+'%';root.dataset.compare=String(n);tell('이후 화면 표시 '+n+'%','After-image visible: '+n+'%');}
 });
 on(q('[data-content=title]'),'input',fillContent);
 if(key==='rs-content')fillContent();
 return {kind:key,dispose(){ac.abort();if(timer)clearTimeout(timer);}};
}
function code(entry,lang='ko',css=''){
 const item=byId.get(entry?.id);if(!item)throw Error('Unknown research entry');
 const title=esc(lang==='en'?item[2]:item[3]);
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — ATLAS original example</title><style>html,body{margin:0;font:16px/1.6 system-ui;background:#111d31;color:white}main{max-width:700px;margin:24px auto;padding:20px}.rs-standalone{height:340px}'+css+'</style></head><body><main><h1>'+title+'</h1><div id="demo" class="rs-standalone"></div></main><script>'+source+';const box=document.getElementById("demo");box.innerHTML=AtlasResearch.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasResearch.mount(box.firstElementChild,'+JSON.stringify(item[1])+','+JSON.stringify(lang)+');window.addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';
}
function attachAtlas32(){
 const host=global.Atlas32;if(!host||host.__atlasResearchAttached)return false;
 host.__atlasResearchAttached=true;
 const prev={recipe:host.recipe,markup:host.markup,art:host.art,mount:host.mount,code:host.code};
 host.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);
 host.markup=(key,lang)=>supports(key)?markup(key,lang):prev.markup(key,lang);
 host.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-research" data-preview-key="'+esc(item[1])+'">'+markup(item[1],lang)+'</div>',mode:'native',previewType:'실행형 설계·검증 시연',key:item[1],specific:true}:prev.art(e,lang);};
 host.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.rs-stage')?[scope]:[...scope.querySelectorAll('.rs-stage')];for(const node of roots)if(!node.__rsMounted)node.__rsMounted=mount(node,node.dataset.kind,node.getAttribute('lang')||'ko');};
 host.code=(e,lang)=>byId.has(e?.id)?code(e,lang,global.AtlasResearch.styles||''):prev.code(e,lang);
 return true;
}
const source='('+initAtlasResearch.toString()+')(window);';
global.AtlasResearch={ITEMS,byId,supports,markup,mount,code,source,attachAtlas32,styles:''};
if(global.Atlas32)attachAtlas32();
})(window);
