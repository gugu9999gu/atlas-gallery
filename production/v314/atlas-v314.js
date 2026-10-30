/* ATLAS v3.14 — browser interaction and accessibility studies. No network or storage. */
(function initAtlasInteractionLab(global) {
'use strict';
const ITEMS=[
 ['dar-57844d130862','ax-contrast','WCAG','웹 콘텐츠 접근성 지침'],
 ['dar-8cfbdc21134f','ax-aria','ARIA','접근성 리치 인터넷 애플리케이션'],
 ['dar-9ea514a8f561','ax-semantic','Semantic HTML','의미론적 HTML'],
 ['dar-ee539945151c','ax-reader','Screen Reader','스크린 리더'],
 ['dar-b5e4c3947681','ax-captions','Captions','자막'],
 ['dar-c6fce7061f57','ax-highcontrast','High Contrast Mode','고대비 모드'],
 ['dar-b81c3cb4249e','ax-icons','Iconography','아이코노그래피'],
 ['dar-676fc24147ca','ax-glyph','Glyph','글리프'],
 ['dar-45e83dd66970','ax-affordance','Affordance','어포던스'],
 ['dar-396ee9c708db','ax-signifier','Signifier','시그니파이어'],
 ['dar-6fed3b688213','ax-feedback','Feedback Loop','피드백 루프'],
 ['dar-b83d02947ded','ax-content','Content-first Design','콘텐츠 우선 설계'],
 ['dar-4531712194da','ax-fallback','Graceful Degradation','우아한 성능 저하'],
 ['dar-7b2d06cacd74','ax-css','CSS','종속형 스타일 시트'],
 ['dar-4e13d21092d7','ax-native','Native Widget','네이티브 위젯'],
 ['dar-75bab50b35a2','ax-eventloop','Event Loop','이벤트 루프'],
 ['dar-b8f6e0fe87b3','ax-callback','Callback','콜백'],
 ['dar-a88b3ef032f0','ax-signals','Signal and Slot','시그니파이어'],
 ['dar-78b8904b259c','ax-modelview','Model–View','모델·뷰 구조'],
 ['dar-3222f8d4aaf2','ax-mvc','MVC','모델·뷰·컨트롤러'],
 ['dar-c80a6746122a','ax-mvvm','MVVM','모델·뷰·뷰모델'],
 ['dar-4cfe0e2f8b85','ax-binding','Data Binding','데이터 바인딩'],
 ['dar-d99ab9a17a3a','ax-layout','Layout Manager','레이아웃 관리자'],
 ['dar-6f8c0d3586eb','ax-size','Size Policy','크기 정책']
];
const SCOPES={
 'ax-contrast':['WCAG 대비 항목만 검사 · 전체 준수 판정 아님','Contrast criterion only; not a WCAG conformance audit'],
 'ax-aria':['실제 aria-expanded와 hidden 상태를 연결','Actual aria-expanded and hidden states are linked'],
 'ax-semantic':['브라우저의 details·summary·article 사용','Native details, summary and article elements'],
 'ax-reader':['실제 live region 시연 · 스크린 리더 자체는 아님','Live-region study, not a screen reader implementation'],
 'ax-captions':['가상 미디어의 자막 타임라인 · 실제 영상 없음','Caption timeline for simulated media; no video'],
 'ax-highcontrast':['앱 내부 대비 테마 · OS 설정은 변경하지 않음','In-app contrast theme; does not change OS settings'],
 'ax-icons':['동일한 SVG 격자에 공통 굵기·끝 모양 적용','Shared stroke weight and caps on one SVG grid'],
 'ax-glyph':['기호와 실제 글리프의 서체 차이 비교','Compare font-dependent shapes of one character'],
 'ax-affordance':['범위 입력의 실제 키보드·포인터 조작','Actual pointer and keyboard range control'],
 'ax-signifier':['안내 표시만 전환 · 버튼 동작은 동일','Only the cue changes; the action stays the same'],
 'ax-feedback':['로컬 저장 동작 시연 · 서버 전송 없음','Local save-feedback study; no server request'],
 'ax-content':['같은 레이아웃에 실제 길이가 다른 콘텐츠','Real short/long content in the same responsive layout'],
 'ax-fallback':['기능 미지원 상태를 모의 전환 · 핵심 링크 유지','Simulated capability loss; core link stays available'],
 'ax-css':['CSS 사용자 정의 속성과 실제 computed style','CSS custom properties and actual computed styles'],
 'ax-native':['브라우저 기본 컨트롤 · OS/Qt 위젯 실행 아님','Browser-native controls, not OS/Qt widget execution'],
 'ax-eventloop':['JavaScript 동기 코드·마이크로태스크·타이머','Real JavaScript sync, microtask and timer execution'],
 'ax-callback':['타이머 완료 시 등록된 실제 콜백 실행','A real registered callback runs after a timer'],
 'ax-signals':['EventTarget로 원리 시연 · Qt 런타임 아님','EventTarget analogy; not the Qt runtime'],
 'ax-modelview':['하나의 모델을 두 개의 뷰에 반영','One model updates two separate views'],
 'ax-mvc':['입력 → 컨트롤러 → 모델 → 뷰의 실제 분리','Input → controller → model → view separation'],
 'ax-mvvm':['뷰모델의 파생 상태와 입력 검증','Derived view-model state and input validation'],
 'ax-binding':['단방향·양방향 연결 비교 · 네트워크 없음','Compare one-way and two-way binding; no network'],
 'ax-layout':['CSS Grid/Flex로 배치 원리 시연 · Qt 아님','Layout principles via CSS Grid/Flex; not Qt'],
 'ax-size':['CSS flex로 고정·확장 크기 정책 비교','Compare fixed and expanding sizing through CSS flex']
};
const ACTIONS={
 'ax-contrast':['대비 비교','Compare'], 'ax-aria':['펼치기/접기','Expand/collapse'],
 'ax-semantic':['상세 열기/닫기','Toggle details'], 'ax-reader':['장바구니 추가','Add item'],
 'ax-captions':['재생/일시정지','Play/pause'], 'ax-highcontrast':['대비 전환','Toggle contrast'],
 'ax-icons':['끝 모양 변경','Change caps'], 'ax-glyph':['서체 변경','Change font'],
 'ax-affordance':['손잡이 이동','Move handle'], 'ax-signifier':['안내 전환','Toggle cue'],
 'ax-feedback':['로컬 저장','Save locally'], 'ax-content':['콘텐츠 교체','Swap content'],
 'ax-fallback':['기능 지원 전환','Toggle capability'], 'ax-css':['테마 변경','Change theme'],
 'ax-native':['기본값 변경','Change values'], 'ax-eventloop':['순서 실행','Run sequence'],
 'ax-callback':['작업 실행','Run task'], 'ax-signals':['신호 보내기','Emit signal'],
 'ax-modelview':['모델 +10','Model +10'], 'ax-mvc':['추가 명령','Add command'],
 'ax-mvvm':['입력 예시','Sample input'], 'ax-binding':['연결 방향 전환','Toggle direction'],
 'ax-layout':['배치 변경','Change layout'], 'ax-size':['정책 전환','Toggle policy']
};
const byId=new Map(ITEMS.map(x=>[x[0],x])),byKey=new Map(ITEMS.map(x=>[x[1],x]));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`
.ax-stage{font:14px/1.45 system-ui,sans-serif;color:#20304a;background:#edf2f8;height:100%;width:100%;min-height:0;display:flex;flex-direction:column;overflow:hidden;isolation:isolate;--ax-accent:#315b94;--ax-gap:8px;--ax-radius:12px}
.ax-stage *,.ax-stage *::before,.ax-stage *::after{box-sizing:border-box}.ax-stage [hidden]{display:none!important}.ax-stage p{margin:0}.ax-stage button,.ax-stage input,.ax-stage select,.ax-stage textarea,.ax-stage output,.ax-stage summary,.ax-stage code,.ax-stage small{font:inherit;font-size:14px}
.ax-body{flex:1;min-height:0;min-width:0;overflow:auto;padding:12px;overscroll-behavior:contain;scrollbar-width:thin;display:flex;flex-direction:column;gap:8px}.ax-body>*{flex-shrink:0;min-width:0}.ax-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.ax-row>*{min-width:0}.ax-stage label{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:14px}.ax-stage label:has(input[type=range]){width:100%}.ax-stage input[type=range]{flex:1;min-width:40px;max-width:100%;height:30px;margin:0;accent-color:#315b94}.ax-stage input[type=color]{width:42px;height:30px;padding:2px;border:1px solid #8296ae}.ax-stage input[type=text],.ax-stage input[type=number],.ax-stage select{min-width:0;max-width:100%;padding:5px 7px;color:#20304a;background:white;border:1px solid #7890ad;border-radius:5px}.ax-stage input[type=number]{width:74px}.ax-stage input[type=checkbox]{width:18px;height:18px;accent-color:#315b94}.ax-stage input[type=text]{width:145px}.ax-stage button{padding:6px 10px;border:1px solid #6c88ac;border-radius:7px;min-height:32px;background:#fff;color:#183452;cursor:pointer;white-space:normal}.ax-stage button:disabled{cursor:not-allowed;opacity:.6}.ax-stage :is(button,input,select,summary,a,[tabindex]):focus-visible{outline:3px solid #ba7000;outline-offset:2px}.ax-stage summary{cursor:pointer}.ax-tools{flex:none;display:flex;gap:8px;padding:7px 10px;border-top:1px solid #bac9db;background:#dfe8f3}.ax-tools button:first-child{flex:1;background:#254a78;color:white}.ax-scope{flex:none;margin:0!important;padding:5px 10px;color:#36506c;background:#e5edf7;font-size:14px;line-height:1.35;max-height:48px;overflow:auto}.ax-log{display:block;min-height:24px;padding:5px 8px;border-left:3px solid #597ca5;background:#fff;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px}.ax-panel{padding:10px;border:1px solid #a9bad0;background:#fff;border-radius:8px}.ax-sample{padding:12px;border-radius:8px;text-align:center;word-break:break-word}.ax-value{font-size:23px;font-weight:700}.ax-meter{height:14px;border-radius:20px;background:#c1cfe1;overflow:hidden}.ax-meter>i{display:block;height:100%;width:var(--ax-fill,40%);background:var(--ax-accent);transition:width .2s}.ax-tags{display:flex;flex-wrap:wrap;gap:5px}.ax-tags span{border:1px solid #839dbb;padding:3px 7px;border-radius:5px;background:white}
.ax-contrast-sample{font:16px/1.4 system-ui;padding:8px}.ax-disclosure{background:#fff;border-left:4px solid #315b94;padding:8px}.ax-semantic-article{border:1px solid #9bb0c8;background:#fff;padding:10px}.ax-semantic-article h3{margin:0 0 5px;font-size:18px!important}.ax-semantic-article details{margin-top:7px}.ax-screen{background:#18364e;color:#fff;padding:8px;border-radius:8px;text-align:center;min-height:55px}.ax-caption{background:#000d;color:white;padding:4px 7px;display:block;margin-top:7px;font-size:14px}.ax-clock{font-variant-numeric:tabular-nums}.ax-theme{padding:12px;border:1px solid #849bb8;background:#dae6f4;color:#183452;border-radius:8px}.ax-theme[data-high=true]{background:#000;color:#fff;border:3px solid #000}.ax-theme[data-high=true] button{background:#000;color:#ffed70;border:2px solid #ffed70}.ax-icons{display:flex;align-items:center;justify-content:space-around;padding:12px;background:white;border-radius:8px}.ax-icons svg{width:45px;height:45px;stroke:#234770;fill:none;stroke-width:var(--ax-stroke,2);stroke-linecap:var(--ax-cap,round);stroke-linejoin:round}.ax-glyph{font-size:48px;line-height:1.1;text-align:center;background:#fff;padding:8px}.ax-track{height:35px;background:#bdcde1;border-radius:25px;position:relative;margin:5px 14px}.ax-knob{position:absolute;left:var(--ax-fill,40%);top:50%;transform:translate(-50%,-50%);width:29px;height:29px;border:3px solid white;background:#315b94;border-radius:50%;box-shadow:0 2px 3px #2346}.ax-cue{display:inline-block;margin-left:8px;color:#285690;font-weight:700}.ax-feedback-flow{display:flex;gap:5px;flex-wrap:wrap}.ax-feedback-flow span{padding:4px 7px;background:white;border:1px solid #9bb0c8;border-radius:4px}.ax-feedback-flow span[data-active=true]{background:#254a78;color:white}.ax-content-card{display:grid;grid-template-columns:42px minmax(0,1fr);gap:10px;background:white;padding:10px;border-radius:8px}.ax-content-art{height:42px;background:linear-gradient(135deg,#5879a7,#add2cd);border-radius:8px}.ax-content-card h3{font-size:17px!important;line-height:1.3;margin:0 0 5px;overflow-wrap:anywhere}.ax-fallback-card{padding:12px;border:1px solid #8da5c0;background:white;border-radius:8px;box-shadow:0 4px 12px #29466826}.ax-fallback-card a{color:#204e8e;text-decoration:underline}.ax-fallback-card[data-basic=true]{background:Canvas;color:CanvasText;border-radius:0;box-shadow:none}.ax-css-box{display:flex;gap:var(--ax-gap);padding:12px;background:var(--ax-accent);border-radius:var(--ax-radius);color:white;min-height:60px;align-items:center}.ax-css-box span{border:1px solid #ffffffa0;padding:5px}.ax-event-order{margin:0;padding-left:28px}.ax-event-order li{padding:2px 0;font-size:14px}.ax-columns{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ax-columns>div{min-width:0;background:white;padding:8px;border:1px solid #a4b7cf;border-radius:8px;overflow-wrap:anywhere}.ax-columns strong{display:block;font-size:14px;margin-bottom:5px}.ax-layout{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;min-height:65px}.ax-layout[data-layout=column]{display:flex;flex-direction:column}.ax-layout[data-layout=row]{display:flex;flex-wrap:wrap}.ax-layout>span{background:#c5d8ef;border:1px solid #7c9bbf;padding:8px;min-width:0;flex:1;text-align:center;border-radius:5px}.ax-size-host{width:100%;background:#d0dcec;padding:6px;border:1px dashed #5c7899}.ax-size-layout{display:flex;gap:6px;min-width:0;min-height:55px}.ax-size-layout>span{display:grid;place-items:center;min-width:0;background:white;border:1px solid #809bbd;overflow:hidden}.ax-fixed{flex:0 0 64px}.ax-flex{flex:1}.ax-size-layout[data-expand=true] .ax-fixed{flex:1}
@media(prefers-reduced-motion:reduce){.ax-stage *{animation:none!important;transition:none!important}}html.motion-paused .ax-stage *,html[data-motion=off] .ax-stage *{animation:none!important;transition:none!important}@media(forced-colors:active){.ax-stage button,.ax-stage input,.ax-stage select{forced-color-adjust:auto}.ax-meter,.ax-meter>i{border:1px solid CanvasText}.ax-icons svg{stroke:CanvasText}}
`;
let sequence=0;
const active=new Set();
let observer=null;
function install(){if(!document.getElementById('atlas-interaction-v314')){const s=document.createElement('style');s.id='atlas-interaction-v314';s.textContent=css;document.head.append(s);}}
function scope(key,en){return SCOPES[key][en?1:0];}
function markup(key,lang='ko'){if(!byKey.has(key))throw Error('Unknown interaction study '+key);const en=lang==='en';return '<section class="ax-stage" data-ax-key="'+key+'" lang="'+(en?'en':'ko')+'" aria-label="'+escape(byKey.get(key)[en?2:3])+'"><div class="ax-body" tabindex="0" aria-label="'+(en?'Scrollable interactive example':'스크롤 가능한 조작 예제')+'"></div><div class="ax-tools"><button type="button" data-ax="run">'+ACTIONS[key][en?1:0]+'</button><button type="button" data-ax="reset">'+(en?'Reset':'초기화')+'</button></div><p class="ax-scope">'+scope(key,en)+'</p></section>';}
function contrast(a,b){const lum=hex=>{const v=hex.replace('#','');return [.2126,.7152,.0722].reduce((sum,w,i)=>{let c=parseInt(v.slice(i*2,i*2+2),16)/255;c=c<=.04045?c/12.92:((c+.055)/1.055)**2.4;return sum+w*c;},0);};const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function mount(root,key=root.dataset.axKey,lang=root.lang||'ko'){
 if(root.__axStudy)return root.__axStudy;if(!byKey.has(key))throw Error('Unknown interaction study '+key);
 const en=lang==='en',t=(a,b)=>en?b:a,ac=new AbortController(),timers=new Set();let epoch=0,disposed=false,state,model,viewModel,controller,signalTarget,slotHandlers;
 const q=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
 const field=(name,label,type='text',value='')=>'<label>'+label+'<input data-field="'+name+'" type="'+type+'" value="'+escape(value)+'"></label>';
 const slider=(name,label,min,max,value,step=1)=>'<label>'+label+'<input data-field="'+name+'" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+value+'"><output data-out="'+name+'">'+value+'</output></label>';
 const check=(name,label,checked=true)=>'<label><input data-field="'+name+'" type="checkbox"'+(checked?' checked':'')+'>'+label+'</label>';
 const button=(action,label)=>'<button type="button" data-ax="'+action+'">'+label+'</button>';
 const log='<output class="ax-log" data-result aria-live="polite" aria-atomic="true"></output>';
 function cancel(){epoch++;timers.forEach(clearTimeout);timers.clear();}
 function later(fn,ms){const token=epoch;const id=setTimeout(()=>{timers.delete(id);if(!disposed&&token===epoch)fn();},ms);timers.add(id);return id;}
 function say(text){const target=q('[data-result]');if(target&&target.textContent!==text)target.textContent=text;if(root.dataset.result!==String(text))root.dataset.result=String(text);}
 function set(name,text){const el=q('[data-out="'+name+'"]');if(el)el.textContent=text;}
 function input(name){return q('[data-field="'+name+'"]');}
 function html(){const id='ax314-'+(++sequence);switch(key){
 case 'ax-contrast':return '<div class="ax-row">'+field('fg',t('글자','Text'),'color','#24344a')+field('bg',t('배경','Background'),'color','#ffffff')+'</div><p class="ax-contrast-sample">'+t('이 문장의 색 대비를 확인하세요.','Check the contrast of this sentence.')+'</p>'+log;
 case 'ax-aria':return button('disclose',t('도움말','Help'))+'<div class="ax-disclosure" id="'+id+'" hidden>'+t('Enter 또는 Space로 열고 닫습니다.','Press Enter or Space to expand and collapse.')+'</div>'+log;
 case 'ax-semantic':return '<article class="ax-semantic-article"><h3>'+t('의미 있는 제목','A meaningful heading')+'</h3><p>'+t('제목과 본문을 HTML로 구분합니다.','HTML separates the heading and body.')+'</p><details><summary>'+t('구조 확인','Inspect structure')+'</summary><p>article → h3 + p + details</p></details></article>'+log;
 case 'ax-reader':return '<div class="ax-panel"><span aria-hidden="true">▣ </span>'+t('장바구니','Cart')+' <strong data-out="cart">0</strong></div><div class="ax-log" role="status" aria-live="polite" aria-atomic="true" data-live>'+t('장바구니가 비어 있습니다.','Your cart is empty.')+'</div><code>role="status" · aria-live="polite"</code>';
 case 'ax-captions':return '<div class="ax-screen"><span class="ax-clock" data-clock>0.0 / 9.0 s</span><span class="ax-caption" data-caption></span></div>'+slider('time',t('시점','Seek'),0,9,0,.1)+check('cc',t('자막 표시','Show captions'))+log;
 case 'ax-highcontrast':return '<div class="ax-theme" data-high="false"><strong>'+t('중요한 상태','Important status')+'</strong><p>'+t('색뿐 아니라 선과 문구로도 구분','Distinguished by outlines and text too')+'</p>'+button('inside',t('선택','Select'))+'</div>'+log;
 case 'ax-icons':return '<div class="ax-icons" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8M6 10v11h12V10M10 21v-7h4v7"/></svg><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg><svg viewBox="0 0 24 24"><path d="M4 6h16l-2 14H6L4 6ZM8 6V4h8v2M10 10v6M14 10v6"/></svg></div>'+slider('stroke',t('선 굵기','Stroke'),1,4,2,.5)+log;
 case 'ax-glyph':return '<div class="ax-glyph" aria-hidden="true">&amp; Ag</div>'+field('glyph',t('문자','Character'),'text','& Ag')+log;
 case 'ax-affordance':return '<div class="ax-track" aria-hidden="true"><i class="ax-knob"></i></div>'+slider('position',t('손잡이 위치','Handle position'),0,100,40)+log;
 case 'ax-signifier':return '<div class="ax-panel">'+button('activate',t('다음 단계','Next step'))+'<span class="ax-cue" aria-hidden="true">→ '+t('클릭','Click')+'</span></div>'+log;
 case 'ax-feedback':return '<div class="ax-feedback-flow"><span data-step="0">'+t('행동','Action')+'</span><span data-step="1">'+t('처리','Process')+'</span><span data-step="2">'+t('완료','Complete')+'</span></div>'+field('draft',t('메모','Note'),'text',t('샘플 메모','Sample note'))+log;
 case 'ax-content':return '<article class="ax-content-card"><div class="ax-content-art" aria-hidden="true"></div><div><h3 data-title></h3><p data-copy></p></div></article>'+log;
 case 'ax-fallback':return '<div class="ax-fallback-card" data-basic="false"><strong>'+t('핵심 정보는 남습니다.','Core content remains.')+'</strong><p><a href="#'+id+'" data-local-link>'+t('요약으로 이동','Go to summary')+'</a></p><details open><summary>'+t('확장 정보','Enhanced details')+'</summary><p>'+t('지원 여부와 무관하게 내용 제공','Content remains without the enhancement')+'</p></details><p id="'+id+'" tabindex="-1" data-summary hidden>'+t('기본 요약: 정보와 링크를 유지합니다.','Basic summary: content and links stay available.')+'</p></div>'+log;
 case 'ax-css':return '<div class="ax-css-box"><span>A</span><span>B</span><span>C</span></div>'+slider('gap',t('간격','Gap'),0,24,8,2)+slider('radius',t('모서리','Radius'),0,24,12,2)+log;
 case 'ax-native':return '<div class="ax-panel">'+check('nativeCheck',t('기본 체크박스','Native checkbox'))+'<label>'+t('기본 선택','Native select')+'<select data-field="choice"><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></label></div>'+log;
 case 'ax-eventloop':return '<ol class="ax-event-order" data-order></ol><code>sync → microtask → timer</code>'+log;
 case 'ax-callback':return slider('delay',t('대기(ms)','Delay (ms)'),100,1200,300,100)+'<div class="ax-meter" aria-hidden="true"><i></i></div>'+log;
 case 'ax-signals':return '<div class="ax-row">'+check('slotA','Slot A')+check('slotB','Slot B')+'</div><div class="ax-columns"><div><strong>Slot A</strong><output data-out="slotA">0</output></div><div><strong>Slot B</strong><output data-out="slotB">0</output></div></div>'+log;
 case 'ax-modelview':return '<div class="ax-columns"><div><strong>'+t('텍스트 뷰','Text view')+'</strong><output class="ax-value" data-out="model">30</output></div><div><strong>'+t('막대 뷰','Bar view')+'</strong><div class="ax-meter" role="meter" aria-label="'+t('모델 값','Model value')+'" aria-valuemin="0" aria-valuemax="100"><i></i></div></div></div>'+log;
 case 'ax-mvc':return '<div class="ax-row">'+button('decrement','−')+'<output class="ax-value" data-out="count">0</output>'+button('increment','+')+'</div><code>Controller → Model → View</code>'+log;
 case 'ax-mvvm':return field('name',t('이름','Name'),'text','')+'<div class="ax-panel"><output data-out="greeting"></output></div>'+button('commit',t('확인','Confirm'))+log;
 case 'ax-binding':return slider('bound',t('모델','Model'),0,100,35)+field('boundView',t('뷰 입력','View input'),'number',35)+'<code data-direction></code>'+log;
 case 'ax-layout':return '<div class="ax-layout" data-layout="grid"><span>A</span><span>B</span><span>C</span></div>'+slider('gap',t('간격','Gap'),0,20,7)+log;
 case 'ax-size':return '<div class="ax-size-host"><div class="ax-size-layout" data-expand="false"><span class="ax-fixed">A</span><span class="ax-flex">B</span></div></div>'+slider('width',t('가용 폭','Available width'),60,100,100)+log;
 }}
 function renderContrast(){const a=input('fg').value,b=input('bg').value,r=contrast(a,b);q('.ax-contrast-sample').style.color=a;q('.ax-contrast-sample').style.background=b;root.dataset.ratio=String(r);root.dataset.aa=String(r>=4.5);say(r.toFixed(2)+':1 · '+t('일반 텍스트 AA ','Normal text AA ')+(r>=4.5?t('통과','pass'):t('미달','fail')));}
 function captions(){const x=state.time;q('[data-clock]').textContent=x.toFixed(1)+' / 9.0 s';input('time').value=x;set('time',x.toFixed(1));const cue=x<3?t('[잔잔한 음악]','[Soft music]'):x<6?t('안녕하세요. 아틀라스입니다.','Hello. This is ATLAS.'):x<9?t('[문이 닫히는 소리]','[Door closes]'):t('[끝]','[End]');q('[data-caption]').textContent=cue;q('[data-caption]').hidden=!input('cc').checked;root.dataset.time=x.toFixed(1);say(state.playing?t('재생 중','Playing'):t('일시정지 · 시점을 조절하세요.','Paused · adjust the timeline.'));}
 function captionTick(){if(!state.playing)return;state.time=Math.min(9,Math.round((state.time+.1)*10)/10);if(state.time>=9)state.playing=false;captions();if(state.playing)later(captionTick,100);}
 function modelView(){set('model',model.value);q('.ax-meter').style.setProperty('--ax-fill',model.value+'%');q('.ax-meter').setAttribute('aria-valuenow',model.value);say('Model.value = '+model.value);}
 function content(){q('[data-title]').textContent=state.alt?t('실제 정보의 길이가 달라도 무너지지 않는 카드','A card that adapts to the actual length of its content'):t('짧은 제목','Short title');q('[data-copy]').textContent=state.alt?t('긴 설명은 줄바꿈되고 높이가 늘어납니다. 고정 높이로 문장을 자르지 않고 내용을 먼저 담습니다.','Long copy wraps and increases the content height rather than being truncated to fit an arbitrary box.'):t('정보를 먼저 배치합니다.','Start with the information.');say(state.alt?t('긴 콘텐츠 · 내부 스크롤 가능','Long content · scrollable when needed'):t('짧은 콘텐츠','Short content'));}
 function applyBinding(value){const n=Math.max(0,Math.min(100,Number(value)||0));model.value=n;input('bound').value=n;input('boundView').value=n;set('bound',n);root.dataset.model=n;say('Model.value = '+n);}
 function bindingMode(){input('boundView').readOnly=!state.twoWay;q('[data-direction]').textContent=state.twoWay?'Model ↔ View':'Model → View';root.dataset.twoWay=String(state.twoWay);}
 function setup(){
  cancel();for(const k of Object.keys(root.dataset))if(k!=='axKey')delete root.dataset[k];state={alt:false,actions:0,cart:0,time:0,playing:false,slotA:0,slotB:0,emits:0,twoWay:true,font:0,activated:0,phase:0};model={value:30,count:0};root.dataset.actions='0';root.dataset.state='ready';root.dataset.result='';q('.ax-body').innerHTML=html();q('[data-ax=run]').disabled=false;root.style.removeProperty('--ax-fill');
  if(key==='ax-contrast')renderContrast();
  else if(key==='ax-aria'){const b=q('[data-ax=disclose]'),panel=q('.ax-disclosure');b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',panel.id);say('aria-expanded = false');}
  else if(key==='ax-semantic')say('article · h3 · p · details · summary');
  else if(key==='ax-reader')root.dataset.result=q('[data-live]').textContent;
  else if(key==='ax-captions')captions();
  else if(key==='ax-highcontrast')say(t('일반 테마','Standard theme'));
  else if(key==='ax-icons'){root.style.setProperty('--ax-stroke','2');root.style.setProperty('--ax-cap','round');say('stroke-width: 2 · linecap: round');}
  else if(key==='ax-glyph'){q('.ax-glyph').style.fontFamily='serif';say('font-family: serif');}
  else if(key==='ax-affordance'){root.style.setProperty('--ax-fill','40%');say(t('방향키 또는 포인터로 조작','Use arrow keys or a pointer'));}
  else if(key==='ax-signifier')say(t('안내 있음 · 버튼을 눌러 보세요.','Cue visible · try the button.'));
  else if(key==='ax-feedback')say(t('입력한 메모는 이 예제 안에서만 처리합니다.','The note stays within this example.'));
  else if(key==='ax-content')content();
  else if(key==='ax-fallback')say(t('확장 표시 · 실제 지원 여부를 바꾸지는 않음','Enhanced view · capability is simulated'));
  else if(key==='ax-css'){root.style.setProperty('--ax-gap','8px');root.style.setProperty('--ax-radius','12px');root.style.setProperty('--ax-accent','#315b94');say('gap: 8px · border-radius: 12px');}
  else if(key==='ax-native')say('checked: true · value: A');
  else if(key==='ax-eventloop')say(t('실행하면 실제 호출 순서를 기록합니다.','Run to record the actual execution order.'));
  else if(key==='ax-callback'){q('.ax-meter').style.setProperty('--ax-fill','0%');say(t('콜백 대기','Callback idle'));}
  else if(key==='ax-signals'){signalTarget=new EventTarget();slotHandlers={slotA:()=>set('slotA',++state.slotA),slotB:()=>set('slotB',++state.slotB)};for(const name of ['slotA','slotB'])signalTarget.addEventListener('value',slotHandlers[name]);say(t('연결할 수신 함수를 선택하세요.','Choose which slots receive the signal.'));}
  else if(key==='ax-modelview')modelView();
  else if(key==='ax-mvc'){const render=()=>{set('count',model.count);root.dataset.count=model.count;say('Controller → Model.count = '+model.count+' → View');};controller={dispatch(delta){model.count=Math.max(0,Math.min(99,model.count+delta));render();}};render();q('[data-ax=decrement]').setAttribute('aria-label',t('감소','Decrease'));q('[data-ax=increment]').setAttribute('aria-label',t('증가','Increase'));}
  else if(key==='ax-mvvm'){viewModel={name:'',get canConfirm(){return this.name.trim().length>=2;},get greeting(){return this.canConfirm?t('안녕하세요, ','Hello, ')+this.name.trim():t('이름을 2자 이상 입력하세요.','Enter at least two characters.');},setName(value){this.name=value;set('greeting',this.greeting);q('[data-ax=commit]').disabled=!this.canConfirm;root.dataset.valid=String(this.canConfirm);say('ViewModel.canConfirm = '+this.canConfirm);}};input('name').maxLength=40;viewModel.setName('');}
  else if(key==='ax-binding'){input('boundView').min='0';input('boundView').max='100';applyBinding(35);bindingMode();}
  else if(key==='ax-layout')say('display: grid · 3 columns');
  else if(key==='ax-size')say('A: 64px · B: flex: 1');
 }
 function disclose(){const b=q('[data-ax=disclose]'),panel=q('.ax-disclosure'),open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));panel.hidden=!open;say('aria-expanded = '+open);}
 function run(){state.actions++;root.dataset.actions=state.actions;root.dataset.state='changed';switch(key){
 case 'ax-contrast':state.alt=!state.alt;input('fg').value=state.alt?'#777777':'#24344a';input('bg').value='#ffffff';renderContrast();break;
 case 'ax-aria':disclose();break;
 case 'ax-semantic':q('details').open=!q('details').open;say('details.open = '+q('details').open);break;
 case 'ax-reader':set('cart',++state.cart);q('[data-live]').textContent=t('장바구니에 상품 ','Cart now contains ')+state.cart+t('개가 있습니다.',' item(s).');root.dataset.result=q('[data-live]').textContent;break;
 case 'ax-captions':state.playing=!state.playing;if(state.playing){if(state.time>=9)state.time=0;cancel();later(captionTick,100);}else cancel();captions();break;
 case 'ax-highcontrast':state.alt=!state.alt;q('.ax-theme').dataset.high=String(state.alt);say(state.alt?t('고대비 테마','High-contrast theme'):t('일반 테마','Standard theme'));break;
 case 'ax-icons':state.alt=!state.alt;root.style.setProperty('--ax-cap',state.alt?'butt':'round');say('stroke-width: '+input('stroke').value+' · linecap: '+(state.alt?'butt':'round'));break;
 case 'ax-glyph':state.font=(state.font+1)%3;const font=['serif','sans-serif','monospace'][state.font];q('.ax-glyph').style.fontFamily=font;say('font-family: '+font);break;
 case 'ax-affordance':input('position').value=(+input('position').value+25)%101;rangeChanged('position');break;
 case 'ax-signifier':state.alt=!state.alt;q('.ax-cue').hidden=state.alt;say(state.alt?t('안내 없음 · 동작은 동일','Cue hidden · same action'):t('안내 표시','Cue visible'));break;
 case 'ax-feedback':cancel();state.phase=1;all('[data-step]').forEach(n=>n.dataset.active=String(n.dataset.step==='1'));q('[data-ax=run]').disabled=true;say(t('처리 중…','Processing…'));const draft=input('draft').value;later(()=>{model.note=draft;state.phase=2;q('[data-ax=run]').disabled=false;all('[data-step]').forEach(n=>n.dataset.active=String(n.dataset.step==='2'));say(t('로컬 완료: ','Locally completed: ')+model.note);},350);break;
 case 'ax-content':state.alt=!state.alt;content();break;
 case 'ax-fallback':state.alt=!state.alt;q('.ax-fallback-card').dataset.basic=String(state.alt);q('details').hidden=state.alt;q('[data-summary]').hidden=!state.alt;q('[data-local-link]').textContent=state.alt?t('기본 요약으로 이동','Go to basic summary'):t('요약으로 이동','Go to summary');say(state.alt?t('기본 모드 · 링크와 내용 유지','Basic mode · link and content retained'):t('확장 모드','Enhanced mode'));break;
 case 'ax-css':state.alt=!state.alt;root.style.setProperty('--ax-accent',state.alt?'#335f52':'#315b94');say('background: '+getComputedStyle(q('.ax-css-box')).backgroundColor);break;
 case 'ax-native':input('nativeCheck').checked=!input('nativeCheck').checked;input('choice').value=input('choice').value==='A'?'B':'A';say('checked: '+input('nativeCheck').checked+' · value: '+input('choice').value);break;
 case 'ax-eventloop':{cancel();q('[data-order]').replaceChildren();const token=epoch,order=[];const append=s=>{if(disposed||token!==epoch)return;order.push(s);const li=document.createElement('li');li.textContent=s;q('[data-order]').append(li);say(order.join(' → '));root.dataset.order=order.join('|');};append('1 · sync');queueMicrotask(()=>append('3 · microtask'));later(()=>append('4 · timer'),0);append('2 · sync end');break;}
 case 'ax-callback':cancel();q('[data-ax=run]').disabled=true;q('.ax-meter').style.setProperty('--ax-fill','30%');say(t('등록한 콜백을 기다리는 중','Waiting for the registered callback'));const callback=()=>{model.count++;root.dataset.callbacks=model.count;q('.ax-meter').style.setProperty('--ax-fill','100%');q('[data-ax=run]').disabled=false;say('onComplete() · '+model.count);};later(callback,+input('delay').value);break;
 case 'ax-signals':state.emits++;signalTarget.dispatchEvent(new Event('value'));say('emit #'+state.emits+' → A:'+state.slotA+' / B:'+state.slotB);break;
 case 'ax-modelview':model.value=(model.value+10)%110;modelView();break;
 case 'ax-mvc':controller.dispatch(1);break;
 case 'ax-mvvm':input('name').value=state.alt?'':t('아틀라스','Atlas');state.alt=!state.alt;viewModel.setName(input('name').value);break;
 case 'ax-binding':state.twoWay=!state.twoWay;bindingMode();say(state.twoWay?t('양방향: 두 입력 모두 모델 변경','Two-way: both inputs update the model'):t('단방향: 모델 입력만 변경 가능','One-way: only the model input is editable'));break;
 case 'ax-layout':{const layout=['grid','row','column'][state.actions%3];q('.ax-layout').dataset.layout=layout;say(layout==='grid'?'display: grid · 3 columns':'display: flex · '+layout);break;}
 case 'ax-size':state.alt=!state.alt;q('.ax-size-layout').dataset.expand=String(state.alt);say(state.alt?'A: flex: 1 · B: flex: 1':'A: 64px · B: flex: 1');break;
 }}
 function rangeChanged(name){const el=input(name);set(name,el.value);if(key==='ax-affordance'){root.style.setProperty('--ax-fill',el.value+'%');say(t('위치: ','Position: ')+el.value+'%');}else if(key==='ax-icons'){root.style.setProperty('--ax-stroke',el.value);say('stroke-width: '+el.value);}else if(key==='ax-css'){root.style.setProperty('--ax-'+name,el.value+'px');say('gap: '+getComputedStyle(q('.ax-css-box')).gap+' · radius: '+getComputedStyle(q('.ax-css-box')).borderRadius);}else if(key==='ax-layout'){q('.ax-layout').style.gap=el.value+'px';say('gap: '+el.value+'px');}else if(key==='ax-size'){q('.ax-size-host').style.width=el.value+'%';say(t('가용 폭: ','Available width: ')+el.value+'%');}else if(key==='ax-callback')say(t('다음 작업 대기: ','Next task delay: ')+el.value+'ms');}
 root.addEventListener('input',e=>{const name=e.target.dataset.field;if(!name)return;root.dataset.state='changed';if(key==='ax-contrast')renderContrast();else if(key==='ax-glyph'){q('.ax-glyph').textContent=e.target.value.slice(0,12);say('U+ '+[...e.target.value.slice(0,12)].map(c=>c.codePointAt(0).toString(16).toUpperCase()).join(' '));}else if(key==='ax-captions'){if(name==='time'){state.time=+e.target.value;state.playing=false;cancel();}captions();}else if(key==='ax-native')say('checked: '+input('nativeCheck').checked+' · value: '+input('choice').value);else if(key==='ax-mvvm')viewModel.setName(e.target.value);else if(key==='ax-binding'){if(name==='bound'||state.twoWay)applyBinding(e.target.value);}else if(key==='ax-signals'){signalTarget.removeEventListener('value',slotHandlers[name]);if(e.target.checked)signalTarget.addEventListener('value',slotHandlers[name]);say(name+' '+(e.target.checked?t('연결됨','connected'):t('연결 해제','disconnected')));}else if(e.target.type==='range')rangeChanged(name);},{signal:ac.signal});
 root.addEventListener('click',e=>{const b=e.target.closest('[data-ax]');if(!b||!root.contains(b))return;const action=b.dataset.ax;if(action==='reset'){setup();return;}if(action==='run'){run();return;}if(action==='disclose')disclose();if(action==='activate')say(t('실행 횟수: ','Activation count: ')+(++state.activated));if(action==='inside')say(t('선택됨 · 색상 외 문구로도 표시','Selected · also conveyed in text'));if(action==='increment')controller.dispatch(1);if(action==='decrement')controller.dispatch(-1);if(action==='commit'&&viewModel.canConfirm)say(t('확인: ','Confirmed: ')+viewModel.name.trim());},{signal:ac.signal});
 root.addEventListener('click',e=>{const link=e.target.closest('[data-local-link]');if(link){e.preventDefault();const summary=q('[data-summary]');summary.hidden=false;summary.focus();say(t('기본 내용으로 이동했습니다.','Moved to the core content.'));}},{signal:ac.signal});
 root.addEventListener('toggle',e=>{if(key==='ax-semantic'&&e.target.matches('details'))say('details.open = '+e.target.open);},{capture:true,signal:ac.signal});
 const stop=()=>{if(key==='ax-captions'&&state.playing){state.playing=false;cancel();captions();}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:ac.signal});
 const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}):null;io?.observe(root);
 setup();
 const study={root,key,dispose(){disposed=true;cancel();ac.abort();io?.disconnect();active.delete(study);delete root.__axStudy;}};root.__axStudy=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const s of active)if(!s.root.isConnected)s.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown entry');const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e6ecf4;font:16px/1.6 system-ui;color:#183452}main{max-width:620px;margin:auto}h1{font-size:24px}.demo{height:360px;border:1px solid #91a8c4;border-radius:12px;overflow:hidden}p{font-size:14px}</style></head><body><main><h1>'+escape(item[en?2:3])+'</h1><div class="demo" id="demo"></div><p>'+escape(scope(item[1],en))+'</p></main><script>('+initAtlasInteractionLab.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasInteractionLab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasInteractionLab.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){const A=global.Atlas32;if(!A||A.__interaction314)return false;A.__interaction314=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-interaction-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive browser study':'직접 조작하는 브라우저 예제'}:prev.art(e,lang);};A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.ax-stage')?[scope]:[...scope.querySelectorAll('.ax-stage')];roots.forEach(el=>mount(el));};A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prev.code(e,lang);return true;}
install();global.AtlasInteractionLab={ITEMS,SCOPES,ACTIONS,byId,byKey,markup,mount,code,contrast,attach,css,version:'3.14.0',activeCount:()=>active.size};attach();
})(window);
