/* ATLAS 3.10 - original standalone UI interaction studies. No telemetry or external assets. */
(function Atlas40Module(manifest, styleText) {
  'use strict';
  const byId = new Map(manifest.map(x => [x.id, x]));
  const byKey = new Map(manifest.map(x => [x.key, x]));
  const active = new Map();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const translate = (ko, en, language) => language === 'en' ? en : ko;
  const stylesheetId = 'atlas-v310-style';
  function injectStyle() {
    if (document.getElementById(stylesheetId)) return;
    const css = document.createElement('style'); css.id = stylesheetId; css.textContent = styleText; document.head.append(css);
  }
  function markup(key, language='ko') {
    const item = byKey.get(key); if (!item) throw Error('Unknown ATLAS40 reference: '+key);
    const t = (a,b) => translate(a,b,language);
    const button = (action,label,extra='') => `<button type="button" data-a40="${action}" ${extra}>${esc(label)}</button>`;
    let body = '', initial = t('직접 조작해 보세요.','Try this interactive example.');
    switch(item.kind) {
      case 'overflow': body = `${button('toggle',t('더 보기 ···','More ···'),'aria-haspopup="menu" aria-expanded="false"')}<div class="a40-menu" role="menu" hidden>${button('first',t('공유','Share'),'role="menuitem"')}${button('second',t('보관','Archive'),'role="menuitem"')}${button('third',t('삭제','Delete'),'role="menuitem"')}</div>`;break;
      case 'sort': body = `<ol class="a40-sort">${['ALPHA','BETA','GAMMA'].map((x,i)=>`<li><button type="button" class="a40-sort-item" data-a40="sort" aria-label="${t('순서 변경','Reorder')} ${x}">${i+1}. ${x}</button></li>`).join('')}</ol>`;initial=t('위아래 드래그 또는 방향키로 순서를 변경하세요.','Drag up/down or use the arrow keys to reorder.');break;
      case 'shortcut': body = `${button('toggle',t('명령 팔레트 열기','Open command palette'),'aria-expanded="false"')}<div class="a40-shortcut">Ctrl / ⌘ + K</div><div class="a40-menu" role="dialog" aria-label="Command palette" hidden><p>${t('명령 팔레트가 열렸습니다.','Command palette opened.')}</p>${button('close',t('닫기','Close'))}</div>`;break;
      case 'context': body = `${button('target',t('우클릭 / Shift+F10','Right-click / Shift+F10'),'aria-haspopup="menu" aria-expanded="false"')}<div class="a40-menu" role="menu" hidden>${button('first',t('편집','Edit'),'role="menuitem"')}${button('second',t('복제','Duplicate'),'role="menuitem"')}</div>`;break;
      case 'confirm': body = `${button('request',t('예제 항목 삭제','Delete sample item'))}<div class="a40-confirm" role="dialog" aria-modal="true" aria-label="${t('삭제 확인','Confirm deletion')}" hidden><p>${t('정말 이 예제 항목을 삭제할까요?','Delete this example item?')}</p>${button('cancel',t('취소','Cancel'))}${button('confirm',t('삭제','Delete'))}</div>`;break;
      case 'entrance': body = `<div class="a40-motion a40-enter" data-motion>HELLO.</div>${button('run',t('등장 재생','Replay entrance'))}`;initial=t('화면 등장 시 위로 나타납니다.','Enters upward when the study appears.');break;
      case 'exit': body = `<div class="a40-motion" data-motion>GOODBYE.</div>${button('run',t('퇴장 재생','Play exit'))}${button('reset',t('복원','Reset'))}`;break;
      case 'fade': body = `<div class="a40-motion" data-motion>FADE</div>${button('run',t('표시 전환','Toggle visibility'))}`;break;
      case 'slide': body = `<div class="a40-motion" data-motion>SLIDE</div>${button('run',t('슬라이드 전환','Toggle slide'))}`;break;
      case 'easing': body = `<div class="a40-lane"><span class="a40-dot" data-motion></span></div><label class="a40-field">${t('이징 선택','Choose easing')}<select class="a40-select"><option value="ease-in">ease-in</option><option value="ease-out">ease-out</option><option value="ease-in-out">ease-in-out</option></select></label>${button('run',t('이동 재생','Replay movement'))}`;break;
      case 'touch': body = `<div class="a40-touch">${button('first',t('선택 A','Select A'))}${button('second',t('선택 B','Select B'))}</div><p class="a40-small">${t('두 버튼의 터치 영역은 최소 44px입니다.','Each touch target is at least 44px.')}</p>`;break;
      case 'transition': body = `<div class="a40-motion a40-transition" data-motion>TRANSITION</div>${button('run',t('속성 전환','Toggle transition'))}`;break;
    }
    return `<section class="a40-study" data-atlas40="${esc(key)}" lang="${language}" role="group" tabindex="0" aria-label="${esc(language==='en'?item.en:item.ko)}"><div class="a40-stage"><span class="a40-overline">ATLAS · INTERACTIVE STUDY</span><strong class="a40-title">${esc(language==='en'?item.en:item.ko)}</strong><div class="a40-control">${body}</div></div><output class="a40-status" role="status" aria-live="polite">${initial}</output></section>`;
  }
  function mount(scope=document) {
    injectStyle();
    const roots = scope.matches?.('[data-atlas40]')?[scope]:[...scope.querySelectorAll('[data-atlas40]')];
    roots.forEach(root=>{if(active.has(root))return;const key=root.dataset.atlas40,item=byKey.get(key);if(!item)return;
      const ac = new AbortController(),timers = new Set(),animations = new Set();
      const signal=ac.signal, q=x=>root.querySelector(x), all=x=>[...root.querySelectorAll(x)];
      const lang=root.getAttribute('lang')||'ko', t=(a,b)=>translate(a,b,lang);
      let state=false, down=null, previousFocus=null;
      const status=q('.a40-status'),motion=q('[data-motion]');
      const tell=text=>{status.textContent=text;};
      const bind=(el,event,fn)=>el?.addEventListener(event,fn,{signal});
      const delay=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(root.isConnected)fn();},ms);timers.add(id);};
      const play=(el,from,to,duration=500,easing='ease-out')=>{if(!el)return;for(const a of animations)a.cancel();animations.clear();if(reduced()){Object.assign(el.style,to);return;}const a=el.animate([from,to],{duration,easing,fill:'forwards'});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));return a;};
      const trigger=q('[data-a40="toggle"]')||q('[data-a40="target"]');
      const menu=q('.a40-menu');
      const menuItems=()=>all('.a40-menu button');
      function setMenu(open){if(!menu)return;state=open;menu.hidden=!open;trigger?.setAttribute('aria-expanded',String(open));if(open){menuItems()[0]?.focus();tell(t('메뉴가 열렸습니다.','Menu opened.'));}else{trigger?.focus();tell(t('메뉴가 닫혔습니다.','Menu closed.'));}}
      function animateRun(kind){if(!motion)return; if(kind==='entrance'){motion.style.opacity='1';play(motion,{opacity:0,transform:'translateY(30px) scale(.92)'},{opacity:1,transform:'translateY(0) scale(1)'},620,'cubic-bezier(.2,.8,.3,1)');tell(t('등장 애니메이션 실행','Entrance animation played.'));}
        if(kind==='exit'){play(motion,{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(80px)'},560,'ease-in');tell(t('퇴장 애니메이션 실행','Exit animation played.'));}
        if(kind==='fade'){state=!state;motion.style.opacity=state?'0':'1';tell(state?t('숨김','Hidden'):t('표시','Visible'));}
        if(kind==='slide'){state=!state;motion.style.transform=state?'translateX(110px)':'translateX(0)';motion.style.opacity=state?'0':'1';tell(state?t('오른쪽으로 퇴장','Slid out to the right.'):t('원래 위치로 복귀','Returned to its position.'));}
        if(kind==='easing'){const easing=q('select')?.value||'ease-in-out';play(motion,{transform:'translateX(0)'},{transform:'translateX(165px)'},900,easing);tell(t('이징: ','Easing: ')+easing);}
        if(kind==='transition'){state=!state;motion.classList.toggle('is-on',state);tell(state?t('전환 완료','Transition complete.'):t('원래 상태','Initial state.'));}
      }
      if(['overflow','context','shortcut'].includes(item.kind)) {
        bind(trigger,'click',()=>setMenu(!state));
        if(item.kind==='context')bind(trigger,'contextmenu',e=>{e.preventDefault();setMenu(true);});
        if(item.kind==='shortcut')bind(root,'keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setMenu(true);}});
        bind(root,'keydown',e=>{if(e.key==='Escape'&&state){e.preventDefault();setMenu(false);}if(e.shiftKey&&e.key==='F10'&&item.kind==='context'){e.preventDefault();setMenu(true);}if(state&&['ArrowUp','ArrowDown'].includes(e.key)&&item.kind!=='shortcut'){e.preventDefault();const items=menuItems(),i=items.indexOf(document.activeElement);items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}});
        for(const b of menuItems())bind(b,'click',()=>{tell(t('선택: ','Selected: ')+b.textContent);state=false;menu.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus();});
      }
      if(item.kind==='sort'){
        const list=q('.a40-sort');
        const reorder=(el,dy)=>{const li=el.closest('li'),neighbor=dy<0?li.previousElementSibling:li.nextElementSibling;if(!neighbor)return;if(dy<0)list.insertBefore(li,neighbor);else list.insertBefore(neighbor,li);el.focus();tell(t('새 위치: ','New position: ')+([...list.children].indexOf(li)+1)+' / 3');};
        for(const btn of all('.a40-sort-item')){
          bind(btn,'pointerdown',e=>{down={id:e.pointerId,y:e.clientY,el:btn};btn.setPointerCapture(e.pointerId);});
          bind(btn,'pointermove',e=>{if(down?.el!==btn||down.id!==e.pointerId)return;btn.style.transform=`translateY(${Math.max(-35,Math.min(35,e.clientY-down.y))}px)`;});
          bind(btn,'pointerup',e=>{if(down?.el!==btn||down.id!==e.pointerId)return;const v=e.clientY-down.y;down=null;btn.style.transform='';if(Math.abs(v)>18)reorder(btn,v);});
          bind(btn,'pointercancel',()=>{down=null;btn.style.transform='';});
          bind(btn,'keydown',e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();reorder(btn,e.key==='ArrowUp'?-1:1);}});
        }
      }
      if(item.kind==='confirm'){
        const dialog=q('[role="dialog"]'),open=q('[data-a40="request"]'),cancel=q('[data-a40="cancel"]'),confirm=q('[data-a40="confirm"]');
        const close=accepted=>{dialog.hidden=true;open.focus();tell(accepted?t('예제 삭제 확인 · 서버 요청 없음','Example deletion confirmed; no server request.'):t('취소되었습니다.','Cancelled.'));};
        bind(open,'click',()=>{previousFocus=document.activeElement;dialog.hidden=false;cancel.focus();tell(t('확인 대화상자가 열렸습니다.','Confirmation opened.'));});
        bind(cancel,'click',()=>close(false));bind(confirm,'click',()=>close(true));
        bind(root,'keydown',e=>{if(dialog.hidden)return;if(e.key==='Escape'){e.preventDefault();close(false);}if(e.key==='Tab'){const items=[cancel,confirm],i=items.indexOf(document.activeElement);e.preventDefault();items[(i+(e.shiftKey?-1:1)+items.length)%items.length].focus();}});
      }
      if(['entrance','exit','fade','slide','easing','transition'].includes(item.kind)){
        bind(q('[data-a40="run"]'),'click',()=>animateRun(item.kind));
        bind(q('[data-a40="reset"]'),'click',()=>{for(const a of animations)a.cancel();animations.clear();if(motion){motion.style.opacity='1';motion.style.transform='';}tell(t('초기화되었습니다.','Reset.'));});
        if(item.kind==='entrance'&&!reduced()){
          if('IntersectionObserver' in window){const obs=new IntersectionObserver(values=>{if(values.some(v=>v.isIntersecting)){obs.disconnect();animateRun('entrance');}},{threshold:.2});obs.observe(root);bind(root,'atlas-dispose',()=>obs.disconnect());}
          else delay(()=>animateRun('entrance'),180);
        }
      }
      if(item.kind==='touch'){for(const b of all('[data-a40]'))bind(b,'click',()=>{all('[data-a40]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));tell(t('선택: ','Selected: ')+b.textContent);});}
      const rec={dispose(){root.dispatchEvent(new Event('atlas-dispose'));ac.abort();for(const id of timers)clearTimeout(id);for(const a of animations)a.cancel();active.delete(root);}};
      active.set(root,rec);
    });
    for(const [root,r] of active)if(!root.isConnected)r.dispose();
  }
  function code(entry,language='ko'){
    const item=byId.get(entry.id);if(!item)return null;
    const title=esc(language==='en'?item.en:item.ko);
    const body=`<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — ATLAS study</title><style>body{font:16px/1.5 system-ui,sans-serif;background:#eaf0fa;margin:0;padding:20px;color:#14233c}main{max-width:650px;margin:auto}.a40-demo{height:340px}${styleText}</style></head><body><main><h1>${title}</h1><p>${translate('독립 실행되는 학습용 시각 예제입니다.','Standalone educational interactive example.',language)}</p><div id="demo" class="a40-demo"></div></main>`;
    return body+'<script>'+api.source+';document.getElementById("demo").innerHTML=Atlas40.markup('+JSON.stringify(item.key)+','+JSON.stringify(language)+');Atlas40.mount(document.getElementById("demo"));</'+'script></body></html>';
  }
  const source='('+Atlas40Module.toString()+')('+JSON.stringify(manifest)+','+JSON.stringify(styleText)+')';
  const api={version:'3.10.0',manifest,source,markup,mount,code,byId,stats:()=>({runnable:manifest.length,mounted:active.size})};
  window.Atlas40=api;
  injectStyle();
  const atlas=window.Atlas32;
  if(atlas){
    const old={recipe:atlas.recipe,art:atlas.art,mount:atlas.mount,code:atlas.code,markup:atlas.markup};
    atlas.version='3.10.0';
    atlas.recipe=e=>byId.get(e?.id)?.key||old.recipe(e);
    atlas.markup=(key,lang)=>byKey.has(key)?markup(key,lang):old.markup(key,lang);
    atlas.art=(e,lang)=>{const entry=byId.get(e?.id);return entry?{html:`<div class="scene scene-a40" data-preview-key="${esc(entry.key)}">${markup(entry.key,lang)}</div>`,mode:'native',previewType:'실행형 인터랙션 예시',key:entry.key,specific:true}:old.art(e,lang);};
    atlas.mount=(scope=document)=>{old.mount(scope);mount(scope);};
    atlas.code=(e,lang)=>byId.has(e.id)?code(e,lang):old.code(e,lang);
  }
})([
  {id:'dar-61b3f6bc4056',key:'a40-overflow',en:'Overflow Button',ko:'더보기 버튼',kind:'overflow'},
  {id:'dar-f35047952796',key:'a40-sort',en:'Sort by Dragging',ko:'드래그 정렬',kind:'sort'},
  {id:'dar-708c2361303f',key:'a40-shortcut',en:'Keyboard Shortcut',ko:'키보드 단축키',kind:'shortcut'},
  {id:'dar-2d873c2e10bf',key:'a40-context',en:'Contextual Actions',ko:'컨텍스트 액션',kind:'context'},
  {id:'dar-63839e533a64',key:'a40-confirm',en:'Confirmation Pattern',ko:'확인 패턴',kind:'confirm'},
  {id:'dar-3b91d7023dc3',key:'a40-entrance',en:'Entrance Animation',ko:'등장 애니메이션',kind:'entrance'},
  {id:'dar-062ca5cf5e1c',key:'a40-exit',en:'Exit Animation',ko:'퇴장 애니메이션',kind:'exit'},
  {id:'dar-48430ce158a6',key:'a40-fade',en:'Fade In / Out',ko:'페이드 인·아웃',kind:'fade'},
  {id:'dar-33493183cd83',key:'a40-slide',en:'Slide In / Out',ko:'슬라이드 인·아웃',kind:'slide'},
  {id:'dar-b63a09cd4d89',key:'a40-easing',en:'Ease-in / Ease-out',ko:'이즈 인·아웃',kind:'easing'},
  {id:'dar-0b387ee82481',key:'a40-touch',en:'Touch Accessibility',ko:'터치 접근성',kind:'touch'},
  {id:'dar-75ac70d863ca',key:'a40-transition',en:'CSS Transitions',ko:'CSS 트랜지션',kind:'transition'}
], `
.a40-study{position:relative;display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:9px;min-height:238px;height:100%;padding:14px;color:#ecf7ff;background:radial-gradient(circle at 75% 20%,#31517e,#132541 72%);font:14px/1.4 system-ui,sans-serif;overflow:hidden;isolation:isolate;border-radius:12px}
.a40-stage{text-align:center;min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}.a40-overline{font-size:14px;font-weight:750;color:#b2d6f9;letter-spacing:.06em}.a40-title{font-size:18px;line-height:1.25;color:#fff;max-width:100%;overflow-wrap:anywhere}.a40-control{position:relative;width:100%;display:flex;flex-direction:column;gap:9px;align-items:center;justify-content:center;min-height:100px}.a40-control button,.a40-control select{font:700 14px/1.3 system-ui,sans-serif;border:1px solid #9cbbde;background:#365e91;border-radius:9px;padding:9px 12px;min-height:44px;min-width:44px;color:#fff;cursor:pointer}.a40-control button:hover{background:#4e7bb0}.a40-control button:focus-visible,.a40-control select:focus-visible,.a40-study:focus-visible{outline:3px solid #ffe39f;outline-offset:2px}.a40-control button[aria-pressed=true]{background:#276a59}.a40-status{display:block;position:relative;font-size:14px;min-height:25px;text-align:center;overflow-wrap:anywhere;color:#d4e8ff;background:#0e223bb3;padding:4px 6px;border-radius:6px}.a40-menu{position:absolute;z-index:6;top:calc(100% - 50px);left:50%;transform:translateX(-50%);min-width:165px;background:#16304d;border:1px solid #81aacd;border-radius:10px;padding:6px;box-shadow:0 7px 25px #020c19c9;display:flex;flex-direction:column;gap:4px}.a40-menu[hidden],.a40-confirm[hidden]{display:none!important}.a40-menu p,.a40-confirm p{font-size:14px}.a40-menu button{width:100%;text-align:left}.a40-sort{width:min(100%,220px);padding:0;margin:0;list-style:none;display:grid;gap:5px}.a40-sort>li{margin:0}.a40-sort-item{width:100%;touch-action:none;text-align:left;cursor:grab}.a40-shortcut{font-size:14px;color:#bbd8f9}.a40-confirm{position:absolute;z-index:10;top:0;left:5%;width:90%;background:#102745;padding:12px;border:1px solid #80a9d0;border-radius:10px;box-shadow:0 0 0 70vmax #030911b5}.a40-confirm button{margin:3px}.a40-motion{display:grid;place-items:center;width:145px;min-height:65px;background:linear-gradient(135deg,#5dbcd6,#4770bb);border-radius:13px;font-size:18px;font-weight:900;letter-spacing:.04em;box-shadow:0 8px 22px #05122e80;transition:transform .5s ease,opacity .5s}.a40-transition.is-on{transform:translateY(-12px) scale(1.07);background:#379b8d;box-shadow:0 14px 27px #08192a}.a40-lane{height:72px;width:min(100%,245px);border:1px solid #53749c;border-radius:10px;position:relative;background:#0b1b30}.a40-dot{position:absolute;top:18px;left:17px;width:35px;height:35px;border-radius:50%;background:#81e3d1;box-shadow:0 0 15px #7fe9dc}.a40-field{font-size:14px;display:flex;gap:6px;align-items:center}.a40-field select{min-height:38px}.a40-touch{display:flex;gap:10px}.a40-touch button{min-height:48px;min-width:90px}.a40-small{font-size:14px;margin:0}.scene-a40{height:100%;min-height:238px}.scene-a40 .a40-study{width:100%}.a40-demo .a40-study{height:340px}.a40-demo{min-height:250px}@media(prefers-reduced-motion:reduce){.a40-study *{transition-duration:.01ms!important;animation-duration:.01ms!important}}`);