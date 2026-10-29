(function initAdvanced(global) {
  'use strict';
  const kinds = new Set([
    'click-live','click-haptic','click-overflow','drag-drop','drag-swipe',
    'drag-pinch','drag-sort','drag-reorder','key-shortcut','click-context','click-micro',
    'click-history','click-confirm','input-debounce','track-throttle',
    'click-fade','click-slide','key-navigation','key-focus-trap',
    'key-focus','drag-gesture-transition','scroll-scrub','scroll-timeline'
  ]);
  function supports(kind) { return kinds.has(kind); }
  function markup(kind,language='ko') {
    const ko=language==='ko';
    return `<div class="ix-stage ix-special" data-special="true" data-kind="${kind}" lang="${ko?'ko':'en'}" tabindex="0" role="group" aria-label="${ko?'실제 조작 가능한 인터랙션 예제':'Interactive example with working controls'}"><div class="ix-grid" aria-hidden="true"></div><div class="ix-special-content"></div><output class="ix-readout" aria-live="polite" role="status">${ko?'예제를 직접 조작하세요.':'Interact with the example.'}</output></div>`;
  }
  function mount(root,kind,language='ko',options={}) {
    const ko=language==='ko',area=root.querySelector('.ix-special-content'),out=root.querySelector('.ix-readout');
    const abort=new AbortController(),signal=abort.signal,timers=new Set(),animations=new Set();
    let alive=true;
    const tr=(a,b)=>ko?a:b;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const say=message=>{if(alive)out.textContent=message;};
    const listen=(el,name,fn)=>el.addEventListener(name,fn,{signal});
    const later=(fn,ms)=>{const timer=setTimeout(()=>{timers.delete(timer);if(alive)fn();},ms);timers.add(timer);return timer;};
    const stopTimer=id=>{clearTimeout(id);timers.delete(id);};
    const motion=()=>!global.matchMedia('(prefers-reduced-motion: reduce)').matches&&!options.paused?.();
    const animate=(el,frames,config)=>{if(!motion()||!el?.animate)return;const a=el.animate(frames,config);animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));};
    const button=(id,label)=>`<button type="button" data-action="${id}">${label}</button>`;
    const el=sel=>area.querySelector(sel);
    const action=(id,handler)=>listen(el(`[data-action="${id}"]`),'click',handler);
    const draw=(html,message)=>{area.innerHTML=html;if(message)say(message);};
    const box=(title,inner)=>`<div class="ix-special-box"><strong class="ix-special-title">${title}</strong>${inner}</div>`;
    if(kind==='click-live') {
      draw(box('ARIA LIVE',`<div class="ix-special-actions">${button('polite',tr('일반 알림','Polite update'))}${button('urgent',tr('긴급 알림','Assertive update'))}</div><div class="ix-announcement" role="status" aria-live="polite"></div><div class="ix-announcement" role="alert" hidden></div>`),tr('두 버튼은 서로 다른 알림 우선순위를 사용합니다.','Buttons use different announcement priorities.'));
      let seq=0;
      action('polite',()=>{el('[role="alert"]').hidden=true;el('[role="status"]').textContent=tr(`상태 업데이트 ${++seq}`,`Status update ${++seq}`);say(tr('polite 상태 메시지 전송','Polite live-region update'));});
      action('urgent',()=>{el('[role="status"]').textContent='';const alert=el('[role="alert"]');alert.hidden=false;alert.textContent=tr(`중요한 알림 ${++seq}`,`Important alert ${++seq}`);say(tr('assertive 상태 메시지 전송','Assertive live-region update'));});
    } else if(kind==='click-haptic') {
      draw(box('HAPTIC FEEDBACK',`<div class="ix-special-actions">${button('tap',tr('촉각 피드백 시도','Try haptic feedback'))}</div><div class="ix-pulse-indicator" aria-hidden="true"></div>`),tr('기기가 지원하면 진동 API를 사용합니다.','The Vibration API is used when supported.'));
      action('tap',()=>{let vibrated=false;try{vibrated=global.navigator?.vibrate?.(55)===true;}catch{}animate(el('.ix-pulse-indicator'),[{transform:'scale(.7)',opacity:.5},{transform:'scale(1.5)',opacity:1},{transform:'scale(1)',opacity:.7}],{duration:410});say(vibrated?tr('진동 요청을 전송했습니다.','Vibration requested.'):tr('진동 지원 없음 · 시각 피드백만 표시','Vibration unsupported · visual feedback only'));});
    } else if(kind==='click-overflow') {
      draw(box('OVERFLOW MENU',`<div class="ix-special-actions">${button('menu',tr('더 보기 ⋯','More ⋯'))}</div><div class="ix-pop-menu" role="menu" aria-label="${tr('추가 메뉴','More actions')}" hidden>${button('share',tr('공유','Share'))}${button('save',tr('보관','Save'))}${button('delete',tr('삭제','Delete'))}</div>`));
      const trigger=el('[data-action="menu"]'),menu=el('[role="menu"]'),items=Array.from(menu.querySelectorAll('button'));
      trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');
      const close=()=>{menu.hidden=true;trigger.setAttribute('aria-expanded','false');};
      action('menu',()=>{menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)items[0].focus();});
      for(const item of items)listen(item,'click',()=>{say(tr('선택: ','Selected: ')+item.textContent);close();trigger.focus();});
      listen(root,'keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();close();trigger.focus();}if(!menu.hidden&&['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const ix=items.indexOf(global.document.activeElement),next=(ix+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[next].focus();}});
      listen(global.document,'pointerdown',e=>{if(!root.contains(e.target))close();});
    } else if(kind==='drag-drop') {
      draw(box('DRAG & DROP',`<div class="ix-drop-layout"><button type="button" class="ix-drag-token" data-action="token" aria-label="${tr('이동할 카드','Draggable card')}">CARD</button><div class="ix-drop-zone" role="group" aria-label="${tr('놓기 영역','Drop zone')}">DROP HERE</div></div>`),tr('카드를 오른쪽 영역에 놓거나 Enter를 누르세요.','Drop the card on the target or press Enter.'));
      const token=el('.ix-drag-token'),zone=el('.ix-drop-zone');let start=null,moved=false;
      listen(token,'pointerdown',e=>{start={id:e.pointerId,x:e.clientX,y:e.clientY};moved=false;token.setPointerCapture(e.pointerId);});
      listen(token,'pointermove',e=>{if(!start||e.pointerId!==start.id)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;moved ||=Math.hypot(dx,dy)>4;token.style.transform=`translate(${clamp(dx,-20,150)}px,${clamp(dy,-60,60)}px)`;});
      const dropped=()=>{zone.classList.add('is-complete');zone.textContent=tr('배치 완료','DROPPED');say(tr('카드를 목표 영역에 배치했습니다.','Card placed inside the target zone.'));};
      listen(token,'pointerup',e=>{if(!start||e.pointerId!==start.id)return;const b=zone.getBoundingClientRect();const inZone=e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom;if(inZone)dropped();else say(tr('놓기 영역 밖입니다.','Outside the drop zone.'));token.style.transform='';start=null;});
      listen(token,'pointercancel',()=>{start=null;token.style.transform='';});
      listen(token,'click',()=>{if(!moved)dropped();moved=false;});
    } else if(kind==='drag-swipe') {
      draw(box('SWIPE GESTURE',`<button type="button" class="ix-gesture-card" data-action="swipe">${tr('좌우로 밀어보세요','Swipe left or right')} <span>← →</span></button>`),tr('수평으로 45px 이상 움직이면 방향을 인식합니다.','A 45px horizontal movement recognizes a direction.'));
      const card=el('.ix-gesture-card');let start=null;
      listen(card,'pointerdown',e=>{start={id:e.pointerId,x:e.clientX,y:e.clientY};card.setPointerCapture(e.pointerId);});
      listen(card,'pointermove',e=>{if(!start||start.id!==e.pointerId)return;card.style.transform=`translateX(${clamp(e.clientX-start.x,-85,85)}px)`;});
      listen(card,'pointerup',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x;if(Math.abs(dx)>45){card.textContent=dx<0?'← LEFT':'RIGHT →';say(dx<0?tr('왼쪽 스와이프','Swipe left'):tr('오른쪽 스와이프','Swipe right'));}else say(tr('임계 거리에 미달했습니다.','Below the swipe threshold.'));card.style.transform='';start=null;});
      listen(card,'pointercancel',()=>{start=null;card.style.transform='';});
      listen(card,'keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();say(e.key==='ArrowLeft'?tr('왼쪽 스와이프','Swipe left'):tr('오른쪽 스와이프','Swipe right'));}});
    } else if(kind==='drag-pinch') {
      draw(box('PINCH TO ZOOM',`<div class="ix-pinch-pad" tabindex="0" role="group" aria-label="${tr('두 손가락으로 확대','Pinch zoom surface')}"><div class="ix-zoom-object">ZOOM</div></div><div class="ix-special-actions">${button('minus','−')}${button('plus','＋')}</div>`),tr('두 손가락 핀치 또는 +/− 버튼을 이용하세요.','Pinch with two pointers or use +/− buttons.'));
      const pad=el('.ix-pinch-pad'),target=el('.ix-zoom-object'),points=new Map();let zoom=1,lastDistance=null;
      const drawZoom=()=>{target.style.transform=`scale(${zoom})`;say(`${Math.round(zoom*100)}%`);};
      const change=delta=>{zoom=clamp(zoom+delta,.6,2);drawZoom();};
      action('plus',()=>change(.15));action('minus',()=>change(-.15));
      listen(pad,'pointerdown',e=>{points.set(e.pointerId,{x:e.clientX,y:e.clientY});pad.setPointerCapture(e.pointerId);});
      listen(pad,'pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2){const [a,b]=[...points.values()],distance=Math.hypot(a.x-b.x,a.y-b.y);if(lastDistance!==null)zoom=clamp(zoom*distance/Math.max(1,lastDistance),.6,2);lastDistance=distance;drawZoom();}});
      const end=e=>{points.delete(e.pointerId);lastDistance=null;};listen(pad,'pointerup',end);listen(pad,'pointercancel',end);
      listen(pad,'keydown',e=>{if(['+','=','-'].includes(e.key)){e.preventDefault();change(e.key==='-'?-.15:.15);}});
    } else if(kind==='drag-sort'||kind==='drag-reorder') {
      draw(box('REORDER ITEMS',`<ol class="ix-sort-list"><li><button type="button" class="ix-sort-item">01 · ALPHA</button></li><li><button type="button" class="ix-sort-item">02 · BETA</button></li><li><button type="button" class="ix-sort-item">03 · GAMMA</button></li></ol>`),tr('항목을 세로로 드래그하거나 방향키로 이동하세요.','Drag an item vertically or move it with arrow keys.'));
      const list=el('.ix-sort-list');let dragging=null;
      const shift=(item,dir)=>{const li=item.closest('li'),other=dir<0?li.previousElementSibling:li.nextElementSibling;if(!other)return;if(dir<0)list.insertBefore(li,other);else list.insertBefore(other,li);item.focus();say(tr('새 위치 ','New position ')+([...list.children].indexOf(li)+1)+' / 3');};
      for(const item of list.querySelectorAll('button')){
        listen(item,'pointerdown',e=>{dragging={item,id:e.pointerId,y:e.clientY};item.setPointerCapture(e.pointerId);});
        listen(item,'pointermove',e=>{if(dragging?.item===item&&dragging.id===e.pointerId)item.style.transform=`translateY(${clamp(e.clientY-dragging.y,-35,35)}px)`;});
        listen(item,'pointerup',e=>{if(dragging?.item!==item||dragging.id!==e.pointerId)return;const delta=e.clientY-dragging.y;dragging=null;item.style.transform='';if(Math.abs(delta)>18)shift(item,delta<0?-1:1);});
        listen(item,'pointercancel',()=>{dragging=null;item.style.transform='';});
        listen(item,'keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();shift(item,e.key==='ArrowUp'?-1:1);}});
      }
    } else if(kind==='key-shortcut') {
      draw(box('KEYBOARD SHORTCUT',`<div class="ix-special-actions">${button('open',tr('명령 팔레트 열기','Open command palette'))}</div><kbd>Ctrl / ⌘ + K</kbd><div class="ix-command-palette" hidden tabindex="-1">${tr('명령 팔레트가 열렸습니다. ESC로 닫기','Command palette open. Esc to close.')}</div>`),tr('예제 안에 초점을 둔 다음 단축키를 누르세요.','Focus the demo, then use the shortcut.'));
      const palette=el('.ix-command-palette'),trigger=el('[data-action="open"]');
      const toggle=value=>{palette.hidden=!value;trigger.setAttribute('aria-expanded',String(value));say(value?tr('팔레트 열림','Palette opened'):tr('팔레트 닫힘','Palette closed'));if(value)palette.focus();else trigger.focus();};
      action('open',()=>toggle(palette.hidden));
      listen(root,'keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();toggle(true);}else if(e.key==='Escape'&&!palette.hidden){e.preventDefault();toggle(false);}});
    } else if(kind==='click-context') {
      draw(box('CONTEXT ACTIONS',`<button type="button" class="ix-context-target" data-action="target">${tr('우클릭 또는 Shift+F10','Right-click or Shift+F10')}</button><div class="ix-pop-menu" role="menu" hidden>${button('edit',tr('편집','Edit'))}${button('duplicate',tr('복제','Duplicate'))}</div>`),tr('터치에서는 버튼을 눌러 메뉴를 열 수 있습니다.','Tap the target to open the menu on touch.'));
      const target=el('.ix-context-target'),menu=el('[role="menu"]');
      const show=()=>{menu.hidden=false;target.setAttribute('aria-expanded','true');el('[data-action="edit"]').focus();say(tr('컨텍스트 메뉴가 열렸습니다.','Context menu opened.'));};
      const close=()=>{menu.hidden=true;target.setAttribute('aria-expanded','false');target.focus();};
      action('target',()=>menu.hidden?show():close());
      listen(target,'contextmenu',e=>{e.preventDefault();show();});
      listen(root,'keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();close();}if(e.shiftKey&&e.key==='F10'){e.preventDefault();show();}});
      for(const id of ['edit','duplicate'])action(id,()=>{say(id==='edit'?tr('편집 선택','Edit selected'):tr('복제 선택','Duplicate selected'));close();});
    } else if(kind==='click-micro') {
      draw(box('MICROINTERACTION',`${button('pulse',tr('상태 변경','Change state'))}<div class="ix-pulse-indicator" aria-hidden="true"></div>`));
      let count=0;action('pulse',()=>{++count;const target=el('.ix-pulse-indicator');target.classList.toggle('is-active');animate(target,[{transform:'scale(.7)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:360});say(tr('상호작용 횟수: ','Interactions: ')+count);});
    } else if(kind==='click-history') {
      draw(box('UNDO / REDO',`<div class="ix-special-count">0</div><div class="ix-special-actions">${button('add','+1')}${button('undo',tr('실행 취소','Undo'))}${button('redo',tr('다시 실행','Redo'))}</div>`),tr('값을 변경한 뒤 실행 취소·다시 실행을 사용하세요.','Change the value, then undo or redo.'));
      let history=[0],cursor=0;const label=el('.ix-special-count'),undo=el('[data-action="undo"]'),redo=el('[data-action="redo"]');
      const sync=()=>{label.textContent=history[cursor];undo.disabled=cursor===0;redo.disabled=cursor===history.length-1;say(tr('현재 값 ','Current value ')+history[cursor]);};
      action('add',()=>{history=history.slice(0,cursor+1);history.push(history[cursor]+1);cursor++;sync();});
      action('undo',()=>{if(cursor>0){cursor--;sync();}});
      action('redo',()=>{if(cursor<history.length-1){cursor++;sync();}});
      listen(root,'keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)redo.click();else undo.click();}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo.click();}});sync();
    } else if(kind==='click-confirm') {
      draw(box('CONFIRMATION',`${button('request',tr('항목 삭제 요청','Request deletion'))}<div class="ix-confirm-sheet" role="dialog" aria-modal="true" aria-label="${tr('삭제 확인','Confirm deletion')}" hidden><p>${tr('예제 항목을 삭제할까요?','Delete this sample item?')}</p><div class="ix-special-actions">${button('cancel',tr('취소','Cancel'))}${button('confirm',tr('삭제','Delete'))}</div></div>`));
      const sheet=el('[role="dialog"]'),open=el('[data-action="request"]'),cancel=el('[data-action="cancel"]'),confirm=el('[data-action="confirm"]');
      const show=()=>{sheet.hidden=false;open.setAttribute('aria-expanded','true');cancel.focus();};
      const close=success=>{sheet.hidden=true;open.setAttribute('aria-expanded','false');open.focus();say(success?tr('모의 삭제를 확정했습니다.','Example deletion confirmed.'):tr('취소되어 변경이 없습니다.','Cancelled without changes.'));};
      action('request',show);action('cancel',()=>close(false));action('confirm',()=>close(true));
      listen(root,'keydown',e=>{if(sheet.hidden)return;if(e.key==='Escape'){e.preventDefault();close(false);}if(e.key==='Tab'){const order=[cancel,confirm],next=(order.indexOf(global.document.activeElement)+(e.shiftKey?-1:1)+2)%2;e.preventDefault();order[next].focus();}});
    } else if(kind==='input-debounce') {
      draw(box('DEBOUNCE',`<label class="ix-field-label">${tr('검색어 입력','Type a query')}<input type="text" class="ix-text-input" placeholder="${tr('빠르게 여러 글자를 입력','Type several letters quickly')}" autocomplete="off"></label><div class="ix-filter-result" aria-live="polite">${tr('입력 대기','Waiting for input')}</div>`),tr('마지막 입력 후 400ms가 지나면 한 번 처리합니다.','Only the last input is processed after 400ms.'));
      const input=el('input'),result=el('.ix-filter-result');let pending=null,count=0;
      listen(input,'input',()=>{if(pending)stopTimer(pending);result.textContent=tr('입력 중…','Typing…');pending=later(()=>{pending=null;count++;result.textContent=(input.value||tr('빈 값','Empty'))+' · '+count;say(tr('처리 횟수 ','Processed ')+count);},400);});
    } else if(kind==='track-throttle') {
      draw(box('THROTTLE',`<div class="ix-track-pad" role="group" tabindex="0" aria-label="${tr('포인터 이동 표면','Pointer movement surface')}"><span class="ix-track-dot"></span><span>${tr('여기에서 이동','Move here')}</span></div>`),tr('포인터 좌표를 최대 100ms마다 한 번 갱신합니다.','Coordinates update at most once per 100ms.'));
      const pad=el('.ix-track-pad'),dot=el('.ix-track-dot');let last=-Infinity,updates=0;
      const move=(x,y)=>{const now=performance.now();if(now-last<100)return;last=now;dot.style.left=clamp(x,0,100)+'%';dot.style.top=clamp(y,0,100)+'%';say(tr('샘플 수 ','Samples ')+ ++updates);};
      listen(pad,'pointermove',e=>{const rect=pad.getBoundingClientRect();move((e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100);});
      listen(pad,'keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const x=parseFloat(dot.style.left)||50,y=parseFloat(dot.style.top)||50;move(x+(e.key==='ArrowRight'?10:e.key==='ArrowLeft'?-10:0),y+(e.key==='ArrowDown'?10:e.key==='ArrowUp'?-10:0));}});
    } else if(kind==='click-fade'||kind==='click-slide') {
      const slide=kind==='click-slide';
      draw(box(slide?'SLIDE IN / OUT':'FADE IN / OUT',`${button('toggle',tr('표시 상태 전환','Toggle visibility'))}<div class="ix-motion-target ${slide?'is-slide':''}" aria-hidden="true">ATLAS</div>`));
      const target=el('.ix-motion-target');let visible=true;
      action('toggle',()=>{visible=!visible;target.classList.toggle('is-hidden',!visible);say(visible?tr('대상 표시','Target visible'):tr('대상 숨김','Target hidden'));});
    } else if(kind==='key-navigation') {
      draw(box('KEYBOARD NAVIGATION',`<div class="ix-key-list" role="group" aria-label="${tr('탐색 항목','Navigation items')}">${['ALPHA','BETA','GAMMA'].map((x,i)=>`<button type="button" data-index="${i}" tabindex="${i===0?'0':'-1'}">${x}</button>`).join('')}</div>`),tr('Tab으로 진입하고 방향키·Home·End로 이동합니다.','Tab into the list, then use arrows, Home or End.'));
      const items=Array.from(area.querySelectorAll('.ix-key-list button'));let selected=0;
      const move=i=>{selected=clamp(i,0,items.length-1);items.forEach((b,j)=>b.tabIndex=j===selected?0:-1);items[selected].focus();say(tr('선택 항목 ','Selected item ')+(selected+1));};
      items.forEach((b,i)=>{listen(b,'click',()=>move(i));listen(b,'keydown',e=>{const key=e.key;if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(key)){e.preventDefault();move(key==='Home'?0:key==='End'?items.length-1:selected+(['ArrowDown','ArrowRight'].includes(key)?1:-1));}});});
    } else if(kind==='key-focus-trap') {
      draw(box('FOCUS TRAP',`${button('open',tr('포커스 패널 열기','Open focus panel'))}<div class="ix-confirm-sheet" role="dialog" aria-modal="true" aria-label="${tr('포커스 예제','Focus demo')}" hidden><p>${tr('Tab 키는 이 패널 안에서만 이동합니다.','Tab cycles inside this panel.')}</p><div class="ix-special-actions">${button('first','FIRST')}${button('last','LAST')}${button('close',tr('닫기','Close'))}</div></div>`));
      const sheet=el('[role="dialog"]'),open=el('[data-action="open"]'),items=['first','last','close'].map(x=>el(`[data-action="${x}"]`));
      const close=()=>{sheet.hidden=true;open.focus();say(tr('포커스가 열기 버튼으로 복귀했습니다.','Focus returned to the opener.'));};
      action('open',()=>{sheet.hidden=false;items[0].focus();say(tr('포커스 제한 활성화','Focus trap active'));});action('close',close);
      for(const id of ['first','last'])action(id,()=>say(id.toUpperCase()));
      listen(root,'keydown',e=>{if(sheet.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='Tab'){e.preventDefault();const i=items.indexOf(global.document.activeElement);items[(i+(e.shiftKey?-1:1)+items.length)%items.length].focus();}});
    } else if(kind==='key-focus') {
      draw(box('FOCUS INDICATOR',`<div class="ix-special-actions">${button('one','TAB TARGET A')}${button('two','TAB TARGET B')}</div><p>${tr('키보드 Tab으로 이동할 때 포커스 테두리를 확인하세요.','Use Tab to see the focus-visible outline.')}</p>`));
      for(const id of ['one','two']){const target=el(`[data-action="${id}"]`);target.classList.add('ix-focus-target');listen(target,'focus',()=>say(tr('포커스 대상: ','Focused: ')+id.toUpperCase()));}
    } else if(kind==='drag-gesture-transition') {
      draw(box('GESTURE TRANSITION',`<div class="ix-gesture-transition" tabindex="0" role="slider" aria-label="${tr('전환 진행률','Transition progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ix-gesture-before">BEFORE</div><div class="ix-gesture-after">AFTER</div></div>`),tr('좌우로 드래그하거나 방향키를 누르세요.','Drag horizontally or use arrow keys.'));
      const panel=el('.ix-gesture-transition');let start=null,progress=0;
      const update=value=>{progress=clamp(value,0,100);panel.style.setProperty('--mix',progress+'%');panel.setAttribute('aria-valuenow',String(Math.round(progress)));say(`${Math.round(progress)}%`);};
      listen(panel,'pointerdown',e=>{start=e.pointerId;panel.setPointerCapture(e.pointerId);const r=panel.getBoundingClientRect();update((e.clientX-r.left)/r.width*100);});
      listen(panel,'pointermove',e=>{if(start!==e.pointerId)return;const r=panel.getBoundingClientRect();update((e.clientX-r.left)/r.width*100);});
      listen(panel,'pointerup',()=>start=null);listen(panel,'pointercancel',()=>start=null);
      listen(panel,'keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();update(e.key==='Home'?0:e.key==='End'?100:progress+(e.key==='ArrowLeft'?-10:10));}});
      update(0);
    } else if(kind==='scroll-scrub'||kind==='scroll-timeline') {
      const timeline=kind==='scroll-timeline';
      draw(box(timeline?'SCROLL TIMELINE':'SCROLL SCRUBBING',`<div class="ix-scroll-frame" tabindex="0" aria-label="${tr('스크롤하여 애니메이션 제어','Scroll to control the animation')}"><div class="ix-scroll-content"><div class="ix-scroll-visual">${timeline?'SCROLL':'ROTATE'}</div><p>01 / START</p><div class="ix-scroll-space"></div><p>02 / END</p></div></div><div class="ix-scroll-progress"><span></span></div>`),tr('스크롤 위치와 애니메이션 진행률이 연결됩니다.','Animation progress tracks the local scroll offset.'));
      const frame=el('.ix-scroll-frame'),visual=el('.ix-scroll-visual'),bar=el('.ix-scroll-progress span');
      const update=()=>{const max=Math.max(1,frame.scrollHeight-frame.clientHeight),fraction=clamp(frame.scrollTop/max,0,1);if(timeline){visual.style.transform=`scale(${.65+fraction*.4})`;visual.style.opacity=String(.4+fraction*.6);}else visual.style.transform=`rotate(${Math.round(fraction*280)}deg)`;bar.style.width=Math.round(fraction*100)+'%';say(Math.round(fraction*100)+'%');};
      listen(frame,'scroll',update);update();
    }
    return {kind,dispose(){alive=false;abort.abort();for(const timer of timers)clearTimeout(timer);for(const anim of animations)anim.cancel();}};
  }
  global.AtlasAdvanced={supports,markup,mount,source:'('+initAdvanced.toString()+')(window);'};
})(window);
