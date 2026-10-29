/* ATLAS original foundations lab: focused previews, not vendor demonstrations. */
(function initFoundations(global){
'use strict';
const KINDS=new Set(['fnd-name','fnd-focus-order','fnd-contrast','fnd-touch','fnd-prevent','fnd-error',
'fnd-type-scale','fnd-type-hierarchy','fnd-spacing','fnd-elevation','fnd-shadow','fnd-stroke',
'fnd-variant','fnd-state','fnd-bento','fnd-specificity','fnd-clamp','fnd-scroll-margin']);
const supports=kind=>KINDS.has(kind);
const titleFor={
 'fnd-name':'ACCESSIBLE NAME','fnd-focus-order':'FOCUS ORDER','fnd-contrast':'CONTRAST RATIO',
 'fnd-touch':'TOUCH TARGET','fnd-prevent':'ERROR PREVENTION','fnd-error':'ERROR IDENTIFICATION',
 'fnd-type-scale':'TYPOGRAPHY SCALE','fnd-type-hierarchy':'TYPE HIERARCHY','fnd-spacing':'SPACING SCALE',
 'fnd-elevation':'ELEVATION','fnd-shadow':'SHADOW TOKEN','fnd-stroke':'STROKE / BORDER',
 'fnd-variant':'DESIGN VARIANT','fnd-state':'COMPONENT STATE','fnd-bento':'BENTO LAYOUT',
 'fnd-specificity':'CSS SPECIFICITY','fnd-clamp':'CLAMP()','fnd-scroll-margin':'SCROLL MARGIN'
};
function markup(kind,language='ko'){
 const ko=language==='ko';
 const button=(name,korean,english,attrs='')=>`<button type="button" data-act="${name}" ${attrs}>${ko?korean:english}</button>`;
 const range=(min,max,value,label)=>`<label class="ix-fnd-range">${ko?label[0]:label[1]} <input type="range" min="${min}" max="${max}" value="${value}" step="1" aria-label="${ko?label[0]:label[1]}"></label>`;
 let inside='';
 switch(kind){
 case 'fnd-name':inside=`<div class="ix-fnd-demo"><button class="ix-fnd-icon" type="button" aria-label="${ko?'저장':'Save'}">★</button><span class="ix-fnd-explain">aria-label="${ko?'저장':'Save'}"</span></div>${button('toggle', '접근 가능한 이름 바꾸기','Change accessible name')}`;break;
 case 'fnd-focus-order':inside=`<div class="ix-fnd-focus-list"><button type="button">01 · A</button><button type="button">02 · B</button><button type="button">03 · C</button></div>${button('focus','다음 요소로 초점 이동','Focus next item')}`;break;
 case 'fnd-contrast':inside=`<div class="ix-fnd-contrast-swatch" style="color:rgb(180,180,180)">Aa / 123</div>${range(80,255,180,['텍스트 명도','Text brightness'])}<strong class="ix-fnd-score">9.0:1</strong>`;break;
 case 'fnd-touch':inside=`<div class="ix-fnd-touch-target"><button type="button" aria-label="${ko?'탭 목표':'Tap target'}">＋</button></div>${button('toggle','터치 영역 44px 전환','Toggle 44px target')}`;break;
 case 'fnd-prevent':inside=`<div class="ix-fnd-confirm"><div class="ix-fnd-confirm-step">${ko?'데이터를 삭제하시겠습니까?':'Delete this example item?'}</div><div class="ix-fnd-actions">${button('request','삭제 요청','Request delete')}${button('cancel','취소','Cancel','hidden')}${button('confirm','확인','Confirm','hidden')}</div></div>`;break;
 case 'fnd-error':inside=`<form class="ix-fnd-form" novalidate><label>${ko?'이메일 주소':'Email address'}<input type="email" required placeholder="name@example.com" autocomplete="off"></label><div class="ix-fnd-error-note" aria-live="polite"></div>${button('validate','검증하기','Validate')}</form>`;break;
 case 'fnd-type-scale':inside=`<div class="ix-fnd-type-demo">Aa · ATLAS</div>${range(16,38,24,['글자 크기','Type size'])}`;break;
 case 'fnd-type-hierarchy':inside=`<div class="ix-fnd-hierarchy"><strong>H1 · PRIMARY</strong><b>H2 · SECONDARY</b><span>Body · Supporting text</span></div>${button('toggle','계층 비교','Compare hierarchy')}`;break;
 case 'fnd-spacing':inside=`<div class="ix-fnd-spaces"><span>A</span><span>B</span><span>C</span></div>${button('next','간격 단계 변경','Next spacing step')}`;break;
 case 'fnd-elevation':inside=`<div class="ix-fnd-elevated">CARD · LEVEL 1</div>${range(0,4,1,['높이 단계','Elevation level'])}`;break;
 case 'fnd-shadow':inside=`<div class="ix-fnd-shadow-card">SHADOW / 01</div>${button('next','그림자 토큰 변경','Next shadow token')}`;break;
 case 'fnd-stroke':inside=`<div class="ix-fnd-stroke-card">BORDER</div>${range(1,8,2,['테두리 두께','Border width'])}`;break;
 case 'fnd-variant':inside=`<div class="ix-fnd-variant-row"><button class="ix-fnd-variant-sample">BUTTON</button></div>${button('next','버튼 변형 변경','Change button variant')}`;break;
 case 'fnd-state':inside=`<div class="ix-fnd-state-display"><button class="ix-fnd-state-sample" type="button">READY</button></div>${button('next','다음 상태','Next component state')}`;break;
 case 'fnd-bento':inside=`<div class="ix-fnd-bento"><div>01</div><div>02</div><div>03</div><div>04</div></div>${button('toggle','레이아웃 변경','Toggle layout')}`;break;
 case 'fnd-specificity':inside=`<div class="ix-fnd-specificity-box"><span>SELECTOR TARGET</span><small>.card { color: blue; }</small></div>${button('next','선택자 우선순위 변경','Next selector')}`;break;
 case 'fnd-clamp':inside=`<div class="ix-fnd-clamp-preview">CLAMP()</div>${range(320,1080,540,['가상 뷰포트 폭','Virtual viewport width'])}<span class="ix-fnd-clamp-formula">clamp(16px, 5vw, 32px)</span>`;break;
 case 'fnd-scroll-margin':inside=`<div class="ix-fnd-scroll"><div class="ix-fnd-sticky">STICKY HEADER · 40px</div><div class="ix-fnd-scroll-space">01 · START</div><div class="ix-fnd-scroll-target" tabindex="-1">02 · TARGET</div><div class="ix-fnd-scroll-space">03 · END</div></div>${button('jump','두 번째 항목으로 이동','Jump to section 2')}`;break;
 default:inside=button('toggle','비교하기','Compare');
 }
 return `<div class="ix-stage ix-foundation" data-kind="${kind}" data-state="idle" role="group" tabindex="0" lang="${ko?'ko':'en'}" aria-label="${ko?'실제 조작 가능한 시각 원리 예시':'Interactive visual foundations example'}"><div class="ix-fnd-shell"><div class="ix-fnd-heading">${titleFor[kind]}</div><div class="ix-fnd-workspace">${inside}</div></div><output class="ix-fnd-output" role="status" aria-live="polite">${ko?'값을 조작하거나 버튼을 누르세요.':'Use the slider or controls.'}</output></div>`;
}
function mount(root,kind,language='ko',options={}){
 const ko=language==='ko',ac=new AbortController(),signal=ac.signal,timers=new Set(),areas=root.querySelector('.ix-fnd-workspace'),status=root.querySelector('.ix-fnd-output');
 let seq=0,alive=true;
 const emit=(a,b)=>{if(alive)status.textContent=ko?a:b;};
 const act=name=>root.querySelector('[data-act="'+name+'"]');
 const on=(el,event,fn)=>el?.addEventListener(event,fn,{signal});
 const watch=(el,fn)=>{on(el,'input',fn);fn();};
 const changeState=state=>{root.dataset.state=state;};
 const later=(fn,ms)=>{const t=setTimeout(()=>{timers.delete(t);if(alive)fn();},ms);timers.add(t);};
 switch(kind){
 case 'fnd-name':{
  const btn=root.querySelector('.ix-fnd-icon'),label=root.querySelector('.ix-fnd-explain');
  on(act('toggle'),'click',()=>{const name=btn.getAttribute('aria-label')===(ko?'저장':'Save')?(ko?'즐겨찾기':'Favorite'):(ko?'저장':'Save');btn.setAttribute('aria-label',name);label.textContent='aria-label="'+name+'"';emit('접근 가능한 이름: '+name,'Accessible name: '+name);changeState('active');});break;
 }
 case 'fnd-focus-order':{
  const buttons=[...root.querySelectorAll('.ix-fnd-focus-list button')];
  buttons.forEach((button,i)=>on(button,'focus',()=>{seq=i;emit('현재 초점 '+(i+1)+' / 3','Focused item '+(i+1)+' / 3');}));
  on(act('focus'),'click',()=>{seq=(seq+1)%buttons.length;buttons[seq].focus();changeState('active');});break;
 }
 case 'fnd-contrast':{
  const slider=root.querySelector('input[type=range]'),label=root.querySelector('.ix-fnd-score'),swatch=root.querySelector('.ix-fnd-contrast-swatch');
  const compute=()=>{const v=+slider.value/255,bg=8/255,lum=c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4),ratio=(lum(v)+.05)/(lum(bg)+.05);
   label.textContent=ratio.toFixed(2)+':1';swatch.style.color=`rgb(${slider.value},${slider.value},${slider.value})`;label.classList.toggle('ix-fnd-pass',ratio>=4.5);emit(ratio>=4.5?'일반 글자 대비 기준 AA 충족':'일반 글자 대비 기준 AA 미달',ratio>=4.5?'WCAG AA normal-text contrast met':'Below WCAG AA normal-text contrast');changeState('active');};watch(slider,compute);break;
 }
 case 'fnd-touch':{
  const target=root.querySelector('.ix-fnd-touch-target button');on(act('toggle'),'click',()=>{const large=root.classList.toggle('ix-fnd-large');const pixels=large?44:28;emit('터치 영역 '+pixels+'×'+pixels+'px','Touch target '+pixels+'×'+pixels+'px');changeState('active');});on(target,'click',()=>emit('터치 입력이 인식됐습니다.','Tap acknowledged.'));break;
 }
 case 'fnd-prevent':{
  const request=act('request'),cancel=act('cancel'),confirm=act('confirm'),step=root.querySelector('.ix-fnd-confirm-step');
  const toggle=(pending)=>{request.hidden=pending;cancel.hidden=!pending;confirm.hidden=!pending;};
  on(request,'click',()=>{toggle(true);step.textContent=ko?'확인 후에만 삭제 처리':'Confirm before the action';cancel.focus();emit('확인 대기 · 아직 삭제하지 않았습니다.','Awaiting confirmation · nothing deleted');changeState('active');});
  on(cancel,'click',()=>{toggle(false);request.focus();emit('취소했습니다. 변경 없음.','Cancelled with no changes.');changeState('active');});
  on(confirm,'click',()=>{toggle(false);step.textContent=ko?'시뮬레이션 삭제 완료':'Example deleted';request.focus();emit('사용자 확인 후 실행됐습니다.','Action applied after confirmation.');changeState('active');});
  on(root,'keydown',e=>{if(e.key==='Escape'&&!cancel.hidden){e.preventDefault();cancel.click();}});break;
 }
 case 'fnd-error':{
  const form=root.querySelector('form'),input=form.querySelector('input'),note=form.querySelector('.ix-fnd-error-note');
  on(form,'submit',e=>{e.preventDefault();const good=input.validity.valid;input.setAttribute('aria-invalid',String(!good));note.textContent=good?(ko?'형식 확인 완료':'Email format accepted'):(ko?'유효한 이메일 주소를 입력하세요.':'Enter a valid email address.');emit(note.textContent,note.textContent);changeState('active');});
  on(act('validate'),'click',()=>form.requestSubmit());break;
 }
 case 'fnd-type-scale':{
  const input=root.querySelector('input'),sample=root.querySelector('.ix-fnd-type-demo');watch(input,()=>{sample.style.fontSize=input.value+'px';emit('글자 크기 '+input.value+'px','Type size '+input.value+'px');changeState('active');});break;
 }
 case 'fnd-type-hierarchy':{
  on(act('toggle'),'click',()=>{const grouped=root.classList.toggle('ix-fnd-flat');emit(grouped?'제목과 본문 크기가 비슷해졌습니다.':'단계별 크기와 굵기가 구분됩니다.',grouped?'Flattened text hierarchy':'Distinct hierarchy restored');changeState('active');});break;
 }
 case 'fnd-spacing':{
  const sample=root.querySelector('.ix-fnd-spaces');let i=0;const steps=[4,8,16,24];
  on(act('next'),'click',()=>{i=(i+1)%steps.length;sample.style.gap=steps[i]+'px';emit('간격 '+steps[i]+'px','Gap '+steps[i]+'px');changeState('active');});break;
 }
 case 'fnd-elevation':{
  const slider=root.querySelector('input'),card=root.querySelector('.ix-fnd-elevated');watch(slider,()=>{const level=+slider.value;card.style.boxShadow=`0 ${level*4+2}px ${level*8+5}px rgba(8,20,44,${(.12+level*.07).toFixed(2)})`;card.style.transform=`translateY(${-level*2}px)`;card.textContent='CARD · LEVEL '+level;emit('높이 단계 '+level,'Elevation level '+level);changeState('active');});break;
 }
 case 'fnd-shadow':{
  const card=root.querySelector('.ix-fnd-shadow-card');let index=0;const tokens=[['SHADOW / 01','0 3px 7px #08132635'],['SHADOW / 02','0 9px 19px #08132644'],['SHADOW / 03','0 19px 34px #08132666']];
  on(act('next'),'click',()=>{index=(index+1)%tokens.length;card.textContent=tokens[index][0];card.style.boxShadow=tokens[index][1];emit('그림자 토큰 '+(index+1),'Shadow token '+(index+1));changeState('active');});break;
 }
 case 'fnd-stroke':{
  const slider=root.querySelector('input'),card=root.querySelector('.ix-fnd-stroke-card');watch(slider,()=>{card.style.borderWidth=slider.value+'px';emit('테두리 '+slider.value+'px','Border '+slider.value+'px');changeState('active');});break;
 }
 case 'fnd-variant':{
  let index=0;const btn=root.querySelector('.ix-fnd-variant-sample');on(act('next'),'click',()=>{index=(index+1)%3;btn.dataset.variant=['primary','secondary','ghost'][index];emit('버튼 변형: '+btn.dataset.variant,'Button variant: '+btn.dataset.variant);changeState('active');});break;
 }
 case 'fnd-state':{
  const target=root.querySelector('.ix-fnd-state-sample');let index=0;const states=['ready','loading','success','disabled'];on(act('next'),'click',()=>{index=(index+1)%4;const state=states[index];target.textContent=state.toUpperCase();target.disabled=state==='disabled';target.setAttribute('aria-busy',String(state==='loading'));target.dataset.state=state;emit('컴포넌트 상태: '+state,'Component state: '+state);changeState('active');});break;
 }
 case 'fnd-bento':{
  on(act('toggle'),'click',()=>{const special=root.classList.toggle('ix-fnd-bento-alt');emit(special?'넓은 주요 패널 강조':'균일한 패널 배치',special?'Featured panel layout':'Uniform grid layout');changeState('active');});break;
 }
 case 'fnd-specificity':{
  let index=0;const sample=root.querySelector('.ix-fnd-specificity-box');const rules=[['.card','0-1-0','blue'],['#feature','1-0-0','purple'],['button','0-0-1','green']];on(act('next'),'click',()=>{index=(index+1)%3;const [selector,weight,color]=rules[index];sample.querySelector('small').textContent=selector+' { color: '+color+'; }';sample.style.color=color;emit(selector+' · specificity '+weight,selector+' · specificity '+weight);changeState('active');});break;
 }
 case 'fnd-clamp':{
  const slider=root.querySelector('input'),target=root.querySelector('.ix-fnd-clamp-preview');watch(slider,()=>{const px=Math.min(32,Math.max(16,+slider.value*.05));target.style.fontSize=px.toFixed(1)+'px';emit('가상 폭 '+slider.value+'px → 글자 '+px.toFixed(1)+'px','Virtual width '+slider.value+'px → font '+px.toFixed(1)+'px');changeState('active');});break;
 }
 case 'fnd-scroll-margin':{
  const scroller=root.querySelector('.ix-fnd-scroll'),target=root.querySelector('.ix-fnd-scroll-target');on(act('jump'),'click',()=>{scroller.scrollTop=Math.max(0,target.offsetTop-scroller.offsetTop-40);target.focus({preventScroll:true});emit('상단 40px 여백을 유지하며 이동','Target positioned below 40px sticky header');changeState('active');});break;
 }
 }
 return {kind,dispose(){alive=false;ac.abort();for(const t of timers)clearTimeout(t);}};
}
global.AtlasFoundations={supports,markup,mount,source:'('+initFoundations.toString()+')(window);'};
})(window);
