/* ATLAS pattern studies. Lightweight, honest UI behavior demos; no network or tracking. */
(function initPatterns(global){
'use strict';
const kinds=new Set(['ui-toast','ui-snackbar','ui-tooltip','ui-popover','ui-modal','ui-sheet','ui-drawer','ui-banner','ui-inline','ui-accordion','ui-tabs','ui-segmented','ui-switch','ui-checkbox','ui-radio','ui-slider','ui-steps','ui-quantity','ui-progress','ui-skeleton','ui-carousel','ui-loading','ui-search','ui-fab','ui-dropdown','ui-button','ui-card']);
function supports(kind){return kinds.has(kind);}
function markup(kind,language='ko'){
 const ko=language==='ko',t=(a,b)=>ko?a:b;
 const btn=(action,label,extra='')=>'<button type="button" data-action="'+action+'" '+extra+'>'+label+'</button>';
 const lines='<span class="ix-p-line"></span><span class="ix-p-line short"></span>';
 let scene='';
 if(kind==='ui-toast'||kind==='ui-snackbar'){
  scene='<div class="ix-p-document"><strong>'+t('프로젝트 설정','Project settings')+'</strong><p>'+t('내용을 수정한 후 저장하세요.','Edit and save your changes.')+'</p>'+btn('trigger',t('변경사항 저장','Save changes'))+'</div>'
   +'<div class="ix-p-toast" data-surface aria-hidden="true"><span class="ix-p-check" aria-hidden="true">✓</span><strong>'+t(kind==='ui-snackbar'?'항목을 삭제했습니다':'변경사항을 저장했습니다',kind==='ui-snackbar'?'Item deleted':'Changes saved')+'</strong>'
   +(kind==='ui-snackbar'?btn('undo',t('실행 취소','Undo')):'')+btn('dismiss','×','aria-label="'+t('알림 닫기','Dismiss notification')+'"')+'</div>';
 }else if(kind==='ui-tooltip'){
  scene='<div class="ix-p-center"><div class="ix-p-tooltip" data-surface aria-hidden="true">'+t('추가 정보 보기','More information')+'</div>'+btn('trigger',t('여기에 마우스를 올리세요','Hover or focus here'),'aria-expanded="false"')+'</div>';
 }else if(kind==='ui-popover'||kind==='ui-dropdown'){
  scene='<div class="ix-p-center">'+btn('trigger',kind==='ui-popover'?t('저장 옵션','Save options'):t('메뉴 열기','Open menu'),'aria-expanded="false" aria-haspopup="true"')+
  '<div class="ix-p-popover" data-surface aria-hidden="true"><strong>'+t('빠른 작업','Quick actions')+'</strong>'+btn('option',t('설정 적용','Apply settings'))+btn('dismiss',t('닫기','Close'))+'</div></div>';
 }else if(['ui-modal','ui-sheet','ui-drawer'].includes(kind)){
  scene='<div class="ix-p-document"><strong>'+t('대시보드','Dashboard')+'</strong><p>'+t('기본 페이지가 열려 있습니다.','The main page is visible.')+'</p>'+btn('trigger',t('패널 열기','Open panel'),'aria-expanded="false"')+'</div>'
   +'<div class="ix-p-overlay" data-surface aria-hidden="true"><div class="ix-p-panel"><strong>'+t(kind==='ui-modal'?'확인 대화상자':kind==='ui-sheet'?'하단 시트':'사이드 드로어',kind==='ui-modal'?'Confirmation dialog':kind==='ui-sheet'?'Bottom sheet':'Side drawer')+'</strong><p>'+t('추가 작업을 여기에서 수행합니다.','Perform a contextual action here.')+'</p>'+btn('dismiss',t('닫기','Close'))+'</div></div>';
 }else if(kind==='ui-banner'||kind==='ui-inline'){
  scene='<div class="ix-p-document"><strong>'+t('새로운 알림','Notification')+'</strong><p>'+t('상태가 변경될 때 안내합니다.','A message follows a state change.')+'</p>'+btn('trigger',t('알림 표시','Show notice'))+'</div>'
   +'<div class="ix-p-notice '+(kind==='ui-banner'?'banner':'inline')+'" data-surface aria-hidden="true"><span aria-hidden="true">ⓘ</span><strong>'+t('업데이트가 완료되었습니다','Update completed')+'</strong>'+btn('dismiss','×','aria-label="'+t('닫기','Close')+'"')+'</div>';
 }else if(kind==='ui-accordion'){
  scene='<div class="ix-p-accordion">'+btn('trigger',t('세부 정보','Details')+' <span aria-hidden="true">⌄</span>','aria-expanded="false"')+'<div class="ix-p-collapse" data-surface><p>'+t('패널의 높이와 불투명도가 함께 전환됩니다.','Panel height and opacity transition together.')+'</p></div></div>';
 }else if(kind==='ui-tabs'||kind==='ui-segmented'){
  scene='<div class="ix-p-tabs" role="tablist" aria-label="'+t('예시 탭','Demo tabs')+'">'+btn('tab0',t('개요','Overview'),'role="tab" aria-selected="true"')+btn('tab1',t('활동','Activity'),'role="tab" aria-selected="false"')+'</div><div class="ix-p-tabpanel" role="tabpanel"><strong data-panel-title>'+t('개요','Overview')+'</strong><p data-panel-copy>'+t('선택한 탭의 내용입니다.','Content for the selected tab.')+'</p></div>';
 }else if(['ui-switch','ui-checkbox','ui-radio'].includes(kind)){
  const type=kind==='ui-radio'?'radio':'checkbox',role=kind==='ui-switch'?' role="switch"':'';
  scene='<fieldset class="ix-p-fieldset"><legend>'+t('선택 상태','Selection state')+'</legend><label class="ix-p-choice"><input data-control type="'+type+'" name="pattern-choice"'+role+'/><span>'+t(kind==='ui-switch'?'알림 활성화':kind==='ui-radio'?'옵션 A 선택':'이용약관 동의',kind==='ui-switch'?'Enable alerts':kind==='ui-radio'?'Choose option A':'Agree to terms')+'</span></label>'+(kind==='ui-radio'?'<label class="ix-p-choice"><input data-control type="radio" name="pattern-choice"/><span>'+t('옵션 B 선택','Choose option B')+'</span></label>':'')+'</fieldset>';
 }else if(kind==='ui-slider'){
  scene='<div class="ix-p-input"><label>'+t('밝기 조절','Brightness')+' <output data-value>35%</output></label><input data-control type="range" min="0" max="100" value="35" step="5" aria-label="'+t('밝기','Brightness')+'"/></div>';
 }else if(kind==='ui-steps'){
  scene='<div class="ix-p-stepper"><div class="ix-p-steps"><b class="active">1</b><i></i><b>2</b><i></i><b>3</b></div><strong data-step-label>'+t('단계 1 · 시작','Step 1 · Start')+'</strong>'+btn('next',t('다음 단계','Next step'))+'</div>';
 }else if(kind==='ui-quantity'){
  scene='<div class="ix-p-quantity"><strong>'+t('수량 선택','Quantity')+'</strong><div>'+btn('decrement','−','aria-label="'+t('수량 줄이기','Decrease quantity')+'"')+'<output data-value aria-live="off">1</output>'+btn('increment','+','aria-label="'+t('수량 늘리기','Increase quantity')+'"')+'</div></div>';
 }else if(kind==='ui-progress'){
  scene='<div class="ix-p-progress"><strong>'+t('파일 처리 중','Processing files')+'</strong><progress data-control value="28" max="100"></progress><output data-value>28%</output>'+btn('trigger',t('다시 시작','Restart'))+'</div>';
 }else if(kind==='ui-skeleton'){
  scene='<div class="ix-p-skeleton" aria-hidden="true"><span class="avatar"></span><span></span><span class="short"></span><span></span></div><span class="ix-p-subnote">'+t('콘텐츠가 로드되는 상태를 표현합니다.','An example of a pending content state.')+'</span>';
 }else if(kind==='ui-carousel'){
  scene='<div class="ix-p-carousel"><div class="ix-p-cards" data-cards><div>01<small>'+t('첫 번째','First')+'</small></div><div>02<small>'+t('두 번째','Second')+'</small></div><div>03<small>'+t('세 번째','Third')+'</small></div></div></div><div class="ix-p-carousel-actions">'+btn('prev','‹','aria-label="'+t('이전','Previous')+'"')+'<output data-value>1 / 3</output>'+btn('next','›','aria-label="'+t('다음','Next')+'"')+'</div>';
 }else if(kind==='ui-loading'){
  scene='<div class="ix-p-center"><button data-action="trigger" class="ix-p-loading"><i class="ix-p-spinner" aria-hidden="true"></i><span data-value>'+t('전송하기','Submit')+'</span></button></div>';
 }else if(kind==='ui-search'){
  scene='<div class="ix-p-search"><label>'+t('컴포넌트 검색','Find a component')+'</label><input data-control type="search" autocomplete="off" placeholder="'+t('버튼, 카드 검색','Search buttons, cards')+'" aria-label="'+t('검색','Search')+'"/><div data-surface class="ix-p-suggestions"><button type="button" data-action="suggestion">'+t('버튼','Button')+'</button><button type="button" data-action="suggestion2">'+t('카드','Card')+'</button></div></div>';
 }else if(kind==='ui-fab'){
  scene='<div class="ix-p-center"><div class="ix-p-fab-actions" data-surface>'+btn('option','＋','aria-label="'+t('추가','Add')+'"')+btn('option','★','aria-label="'+t('즐겨찾기','Favorite')+'"')+'</div>'+btn('trigger','＋','class="ix-p-fab" aria-label="'+t('빠른 작업 열기','Open quick actions')+'" aria-expanded="false"')+'</div>';
 }else if(kind==='ui-card'){
  scene='<div class="ix-p-center"><button type="button" data-action="trigger" class="ix-p-card"><span class="ix-p-card-cover"></span><strong>'+t('인터랙티브 카드','Interactive card')+'</strong><small>'+t('호버 또는 클릭','Hover or click')+'</small></button></div>';
 }else{
  scene='<div class="ix-p-center">'+btn('trigger',t('계속하기','Continue'),'class="ix-p-main-button"')+'<span class="ix-p-subnote">'+t('상태에 따른 버튼 반응','Button feedback on action')+'</span></div>';
 }
 return '<div class="ix-stage ix-pattern" data-kind="'+kind+'" lang="'+(ko?'ko':'en')+'" role="group" aria-label="'+t('동작하는 UI 미리보기','Working UI pattern preview')+'"><div class="ix-p-topline"><span>ATLAS / UI MOTION</span><span class="ix-p-indicator" aria-hidden="true"></span></div><div class="ix-p-frame">'+scene+'</div><output class="ix-p-status" role="status" aria-live="polite"></output></div>';
}
function mount(root,kind,language='ko',options={}){
 const ko=language==='ko',t=(a,b)=>ko?a:b,signalController=new AbortController(),signal=signalController.signal;
 const timers=new Set(),q=s=>root.querySelector(s),qa=s=>Array.from(root.querySelectorAll(s));
 let alive=true,visible=false,engaged=false,opened=false,index=0,value=28,number=1,busy=false,loopTimer=null,cycleTimer=null;
 const later=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(alive)fn();},ms);timers.add(id);return id;};
 const cancel=id=>{if(id!==null){clearTimeout(id);timers.delete(id);}};
 const listen=(el,name,fn)=>{if(el)el.addEventListener(name,fn,{signal});};
 const motionOff=()=>global.matchMedia('(prefers-reduced-motion: reduce)').matches||options.paused?.()===true;
 const notify=message=>{if(engaged&&q('.ix-p-status'))q('.ix-p-status').textContent=message;};
 const setOpen=(on,manual=false)=>{
  opened=on;root.classList.toggle('is-open',on);
  qa('[data-surface][aria-hidden]').forEach(el=>el.setAttribute('aria-hidden',String(!on)));
  qa('[data-action="trigger"][aria-expanded]').forEach(el=>el.setAttribute('aria-expanded',String(on)));
  if(manual)notify(on?t('예시가 열렸습니다.','Example opened.'):t('예시가 닫혔습니다.','Example closed.'));
 };
 function setIndex(n){
  index=((n%3)+3)%3;
  root.style.setProperty('--ix-index',String(index));
  const val=q('[data-value]');
  if(kind==='ui-carousel'&&val)val.textContent=(index+1)+' / 3';
  if(kind==='ui-tabs'||kind==='ui-segmented'){
   qa('[role="tab"]').forEach((el,i)=>{el.setAttribute('aria-selected',String(i===index%2));el.tabIndex=i===index%2?0:-1;});
   q('[data-panel-title]').textContent=index%2?t('활동','Activity'):t('개요','Overview');
   q('[data-panel-copy]').textContent=index%2?t('최근 변경사항이 표시됩니다.','Recent changes are shown.'):t('선택한 탭의 내용입니다.','Content for the selected tab.');
  }
 }
 function setValue(n){
  value=Math.min(100,Math.max(0,n));
  const control=q('[data-control]'),output=q('[data-value]');
  if(kind==='ui-progress'&&control){control.value=value;}
  if(kind==='ui-slider'&&control){control.value=value;}
  if(output)output.textContent=Math.round(value)+'%';
  root.style.setProperty('--ix-value',value+'%');
 }
 function showNotice(auto=false){
  setOpen(true);
  cancel(cycleTimer);
  cycleTimer=later(()=>{setOpen(false);},auto?1950:2650);
  if(!auto)notify(t('토스트가 표시되었습니다.','Toast appeared.'));
 }
 function startLoading(){
  if(busy)return;busy=true;root.classList.remove('is-complete');root.classList.add('is-busy');
  const button=q('[data-action="trigger"]'),label=q('[data-value]');
  if(button)button.disabled=true;
  if(label)label.textContent=t('처리 중…','Working…');
  cancel(cycleTimer);
  cycleTimer=later(()=>{
   busy=false;root.classList.remove('is-busy');root.classList.add('is-complete');if(button)button.disabled=false;
   if(label)label.textContent=t('완료 ✓','Complete ✓');
   later(()=>{root.classList.remove('is-complete');if(label)label.textContent=t('전송하기','Submit');},1100);
  },1500);
 }
 function step(auto=false){
  if(!alive)return;
  switch(kind){
   case 'ui-toast':case 'ui-snackbar':case 'ui-banner':case 'ui-inline':showNotice(auto);break;
   case 'ui-accordion':case 'ui-tooltip':case 'ui-popover':case 'ui-dropdown':
   case 'ui-modal':case 'ui-sheet':case 'ui-drawer':case 'ui-fab':setOpen(!opened);break;
   case 'ui-tabs':case 'ui-segmented':setIndex(index===0?1:0);break;
   case 'ui-carousel':setIndex(index+1);break;
   case 'ui-switch':case 'ui-checkbox':{const input=q('[data-control]');if(input)input.checked=!input.checked;break;}
   case 'ui-radio':{const radios=qa('[data-control]');index=(index+1)%radios.length;radios[index].checked=true;break;}
   case 'ui-slider':setValue(value>70?20:value+30);break;
   case 'ui-progress':setValue(value>80?12:value+24);break;
   case 'ui-steps':{index=(index+1)%3;qa('.ix-p-steps b').forEach((b,i)=>{b.classList.toggle('active',i===index);b.classList.toggle('completed',i<index);});const label=q('[data-step-label]');if(label)label.textContent=t('단계 ','Step ')+(index+1);break;}
   case 'ui-quantity':{number=number===5?1:number+1;const out=q('[data-value]');if(out)out.textContent=String(number);break;}
   case 'ui-loading':startLoading();break;
   case 'ui-search':setOpen(!opened);break;
   case 'ui-card':case 'ui-button':root.classList.remove('is-pressed');void root.offsetWidth;root.classList.add('is-pressed');later(()=>root.classList.remove('is-pressed'),600);break;
  }
 }
 function schedule(ms=3200){
  cancel(loopTimer);if(!alive||!visible||document.hidden||engaged)return;
  loopTimer=later(()=>{if(!alive||!visible||document.hidden||engaged)return;if(!motionOff()&&kind!=='ui-skeleton')step(true);schedule(4200);},ms);
 }
 function userAction(action){
  engaged=true;cancel(loopTimer);
  if(action==='dismiss'||action==='undo'){cancel(cycleTimer);setOpen(false,true);notify(action==='undo'?t('실행을 취소했습니다.','Action undone.'):t('닫았습니다.','Dismissed.'));return;}
  if(action==='prev'){setIndex(index-1);return;}
  if(action==='next'&&kind==='ui-carousel'){setIndex(index+1);return;}
  if(action==='next'&&kind==='ui-steps'){step();return;}
  if(action==='decrement'||action==='increment'){number=Math.max(1,Math.min(9,number+(action==='increment'?1:-1)));q('[data-value]').textContent=String(number);return;}
  if(action==='tab0'||action==='tab1'){setIndex(action==='tab0'?0:1);return;}
  if(action==='suggestion'||action==='suggestion2'){q('[data-control]').value=action==='suggestion'?t('버튼','Button'):t('카드','Card');setOpen(false);return;}
  if(action==='option'){setOpen(false);return;}
  if(action==='trigger'){if(['ui-toast','ui-snackbar','ui-banner','ui-inline'].includes(kind))showNotice(false);else step(false);}
 }
 listen(root,'click',event=>{
  const control=event.target.closest('[data-action]');if(!control||!root.contains(control))return;
  if(control.closest('.ix-p-toast')&&control.dataset.action==='trigger')return;
  userAction(control.dataset.action);
 });
 const input=q('input[data-control]');
 if(input)listen(input,'input',()=>{
  engaged=true;cancel(loopTimer);
  if(kind==='ui-slider')setValue(Number(input.value));
  if(kind==='ui-search')setOpen(Boolean(input.value.trim()));
 });
 if(kind==='ui-search')listen(input,'focus',()=>{engaged=true;setOpen(true);});
 if(kind==='ui-tooltip'){
  const anchor=q('[data-action="trigger"]');
  listen(anchor,'pointerenter',()=>{engaged=true;cancel(loopTimer);setOpen(true);});
  listen(anchor,'pointerleave',()=>setOpen(false));
  listen(anchor,'focus',()=>{engaged=true;cancel(loopTimer);setOpen(true);});
  listen(anchor,'blur',()=>setOpen(false));
 }
 listen(root,'keydown',event=>{
  if(event.key==='Escape'&&opened){event.preventDefault();engaged=true;setOpen(false,true);}
  if((kind==='ui-tabs'||kind==='ui-segmented')&&event.target.matches('[role="tab"]')&&['ArrowLeft','ArrowRight'].includes(event.key)){
   event.preventDefault();engaged=true;cancel(loopTimer);setIndex(index+(event.key==='ArrowRight'?1:-1));qa('[role="tab"]')[index%2].focus();
  }
 });
 const onVisibility=()=>{if(document.hidden){cancel(loopTimer);if(!engaged)setOpen(false);}else schedule(850);};
 listen(document,'visibilitychange',onVisibility);
 let observer=null;
 if('IntersectionObserver'in global){
  observer=new IntersectionObserver(entries=>{for(const item of entries){if(item.target!==root)continue;visible=item.isIntersecting&&item.intersectionRatio>.06;root.classList.toggle('is-visible',visible);if(!visible){cancel(loopTimer);if(!engaged)setOpen(false);}else schedule(850);}}, {threshold:[0,.06,.25]});
  observer.observe(root);
 }else{visible=true;root.classList.add('is-visible');schedule(900); }
 if(kind==='ui-slider'||kind==='ui-progress')setValue(kind==='ui-slider'?35:28);
 return {kind,dispose(){alive=false;cancel(loopTimer);cancel(cycleTimer);for(const timer of timers)clearTimeout(timer);timers.clear();observer?.disconnect();signalController.abort();}};
}
global.AtlasPatterns={supports,markup,mount,source:'('+initPatterns.toString()+')(window);'};
})(window);
