/* Included inside the existing application closure, before init(). */
const ixRecipes=new Map(entries.filter(e=>e.demo).map(e=>[e.id,{...e.demo,title:e.en}]));
const ixOldArt=art,ixOldView=referenceView,ixOldNotice=previewNotice,ixOldControls=demoControls;
referenceView=function(e){return e.demo?{html:'',mode:e.demo.engine==='three'?'webgl':'interactive',type:'실시간 모션 예시',key:e.demo.key,specific:true}:ixOldView(e);};
art=function(e){
 if(!e.demo)return ixOldArt(e);
 const engine=e.demo.engine==='three'?'THREE.JS / WEBGL':'HTML · CSS · JAVASCRIPT';
 return {html:`<div class="scene scene-live" data-preview-key="${esc(e.demo.key)}"><span class="live-engine-label">${engine}</span><div class="ix-demo" data-live-demo="${esc(e.id)}" data-engine="${esc(e.demo.engine)}">${e.demo.engine==='three'?`<p class="ix-three-loading">${tr('실제 3D 미리보기','Real 3D preview')}</p>`:AtlasKit.markup(e.demo.key,locale)}</div></div>`,mode:e.demo.engine==='three'?'webgl':'interactive',previewType:'실시간 모션 예시',key:e.demo.key,specific:true};
};
previewNotice=function(e,a){return e.demo?tr('이 예제는 카드 안에서 실제로 실행됩니다. 코드 복사는 같은 구현의 독립 HTML을 제공합니다. 마우스 움직임은 이 예제 내부에서만 처리하며 분석 서버로 전송하지 않습니다.','This example runs inside the card. Copy code returns standalone HTML using the same implementation. Pointer movement stays inside the example and is not transmitted to an analytics server.')+(e.demo.engine==='three'?tr(' Three.js 0.180.0 · 실제 WebGL 렌더링.',' Three.js 0.180.0 · real WebGL rendering.'):''):ixOldNotice(e,a);};
demoControls=function(e){return e.demo?'':ixOldControls(e);};
const ixOldCard=card;
function referencePath(e,language=locale){return (language==='en'?'/en':'')+'/reference/'+encodeURIComponent(e.canonical_id||e.id)+'/';}
card=function(e){
 let html=ixOldCard(e);
 const kind=e.demo?.engine==='three'?'Three.js':e.demo?'HTML · CSS · JS':waveRegistry.get(e.en)?.interactive?tr('SVG 모션 예시','SVG motion study'):tr('미리보기 코드','Preview code');
 html=html.replace('<span class="card-link">'+t('more')+' '+icon('arrow')+'</span>','');
 const actions=`<div class="card-code-actions"><button type="button" class="copy-card-code" data-copy-code="${esc(e.id)}" aria-label="${esc(localTitle(e)+' · '+tr('코드 복사','Copy code'))}">${icon('copy')}<span>${tr('코드 복사','Copy code')}</span></button><span class="code-format">${esc(kind)}</span><a class="reference-permalink" href="${referencePath(e)}" title="${tr('설명 문서 열기','Read reference page')}">${icon('external')}<span class="sr-only">${tr('설명 문서','Reference page')}</span></a><button type="button" data-open="${esc(e.id)}" class="card-detail-button">${tr('자세히','Details')}</button></div>`;
 return html.replace(/<\/div><\/article>$/,actions+'</div></article>');
};
comparisonMarkup=function(e){
 const ids=[e.id,...(e.compare_ids||[])],seen=new Set(),items=ids.map(id=>byId.get(id)).filter(x=>x&&!seen.has(x.id)&&seen.add(x.id)).slice(0,6);if(items.length<2)return '';
 return `<section class="drawer-section comparison-section"><h4>${tr('나란히 비교하기','Compare side by side')}</h4><div class="compare-grid">${items.map(x=>`<div class="compare-card ${x.id===e.id?'current':''}">${art(x).html}<button type="button" data-related="${esc(x.id)}"><h5>${esc(localTitle(x))}</h5></button><p>${esc(localText(x,'difference')||localText(x,'description'))}</p></div>`).join('')}</div></section>`;
};
let ixObserver,ixResizeTimer;
const ixMountedRoots=new WeakSet();
function enforceMinimumText(root=document){
 const targets=[...(root.querySelectorAll?.('svg text')||[])];
 for(const el of targets){
  if(!el.isConnected||!el.getClientRects().length)continue;
  const matrix=el.getScreenCTM();if(!matrix)continue;
  const scale=Math.min(Math.hypot(matrix.a,matrix.b),Math.hypot(matrix.c,matrix.d));if(scale<=0)continue;
  const original=Number(el.dataset.originalFont||parseFloat(getComputedStyle(el).fontSize)||14);el.dataset.originalFont=String(original);
  const font=Math.max(original,14/scale);el.style.setProperty('font-size',font+'px','important');
 }
 for(const el of (root.querySelectorAll?.('button,input,select,textarea,small,output,span,p,a,b,strong,label,h1,h2,h3,h4,h5,h6,li,code,kbd,summary,div')||[])){
  if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
  const size=parseFloat(getComputedStyle(el).fontSize);if(size>0&&size<14)el.style.setProperty('font-size','14px','important');
 }
}
function hydrateLive(root=document){
 AtlasKit.cleanup();
 root.querySelectorAll('[data-live-demo]').forEach(el=>{
  if(ixMountedRoots.has(el))return;const e=byId.get(el.dataset.liveDemo);if(!e?.demo)return;
  ixMountedRoots.add(el);
  if(ixObserver)ixObserver.observe(el);else void AtlasKit.mount(el,e.demo,locale,{paused:()=>motionPaused});
 });
 requestAnimationFrame(()=>enforceMinimumText(root));
}
const ixOldNext=renderNext;
renderNext=function(count=PAGE){ixOldNext(count);hydrateLive(q('#cards'));};
const ixOldDetail=renderDetail;
renderDetail=function(id){ixOldDetail(id);const e=byId.get(id);if(!e)return;
 const actions=q('.drawer-actionbar');if(actions){const button=document.createElement('button');button.type='button';button.dataset.copyCode=e.id;button.innerHTML=icon('code')+' '+tr('코드 복사','Copy code');actions.prepend(button);}
 hydrateLive(q('#detail-body'));
};
const ixOldClose=closeDetail;
closeDetail=function(){ixOldClose();AtlasKit.cleanup();};
const ixOldPreviewControls=renderPreviewControls;
renderPreviewControls=function(){const keep=previewFilter;ixOldPreviewControls();const select=q('#preview-filter');for(const [value,ko,en] of [['interactive','실행형 인터랙션','Live interactions'],['three','실제 3D · Three.js','Real 3D · Three.js']]){const o=document.createElement('option');o.value=value;o.textContent=tr(ko,en);select.append(o);}select.value=keep;};
const ixOldFeature=renderFeature;
renderFeature=function(){ixOldFeature();const feature=q('#analytics-feature');let lab=q('#interactive-feature');if(!lab){lab=document.createElement('section');lab.id='interactive-feature';lab.className='interactive-feature';feature.before(lab);}lab.innerHTML=`<div><span class="eyebrow">INTERACTION LAB / 3.2</span><h2>${tr('움직여 보고, 눌러 보고, 코드로 가져가세요.','Move it. Click it. Make it yours.')}</h2><p>${tr('호버·클릭·포인터 추적부터 실제 입체 카드까지. 카드에서 바로 실행하고 전체 HTML 코드를 복사하세요.','From hover and pointer effects to real 3D cards. Try each example in its card and copy the complete HTML.')}</p></div><div class="interactive-feature-actions"><button type="button" data-live-collection="interactive">${tr('인터랙션','Interactions')} <b>${ixRecipes.size}</b> ${icon('arrow')}</button><button type="button" data-live-collection="three">Three.js <b>${entries.filter(e=>e.demo?.engine==='three').length}</b></button><a href="${locale==='en'?'/en':''}/references/">${tr('검색 가능한 용어집','Crawlable glossary')} ↗</a></div>`;};
function collectionLive(kind){
 previewFilter=kind;setDomain('all');renderPreviewControls();const url=new URL(location.href);url.searchParams.set('collection',kind==='three'?'three':'interactions');try{history.replaceState(null,'',url);}catch{}q('#gallery').scrollIntoView({behavior:animateScroll()});
}
function collectedKeyframes(){let rules='';for(const sheet of document.styleSheets){try{for(const rule of sheet.cssRules)if(rule.type===CSSRule.KEYFRAMES_RULE)rules+=rule.cssText+'\n';}catch{}}return rules;}
function portablePreview(entry){
 const source=q(`.term-card[data-id="${entry.id}"] .scene`)||(state.active===entry.id?q('#detail-body>.scene'):null);
 if(!source)throw new Error('Preview not available for copying');
 const copy=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
 const props=['display','position','top','left','right','bottom','width','height','min-width','min-height','max-width','max-height','padding','margin','box-sizing','border','border-radius','background','color','opacity','box-shadow','text-shadow','font-family','font-size','font-weight','line-height','letter-spacing','text-align','white-space','overflow','transform','transform-origin','clip-path','filter','fill','stroke','stroke-width','stroke-dasharray','stroke-dashoffset','align-items','justify-content','flex-direction','gap','grid-template-columns','place-items','animation-name','animation-duration','animation-delay','animation-iteration-count','animation-timing-function','animation-direction','animation-fill-mode'];
 for(let i=0;i<copies.length;i++){const style=getComputedStyle(originals[i]);for(const p of props){const v=style.getPropertyValue(p);if(v)copies[i].style.setProperty(p,p==='font-size'?Math.max(14,parseFloat(v)||14)+'px':v);}copies[i].removeAttribute('inert');copies[i].removeAttribute('aria-hidden');}
 copy.removeAttribute('inert');copy.removeAttribute('aria-hidden');copy.style.margin='0';copy.style.maxWidth='100%';copy.style.minHeight='250px';copy.querySelectorAll('.preview-label,.preview-zoom').forEach(n=>n.remove());
 return copy.outerHTML;
}
function exportCode(entry){
 if(entry.demo)return AtlasKit.code({...entry.demo,title:localTitle(entry)},locale,window.ATLAS_INTERACTION_CSS||'');
 const wave=waveRegistry.get(entry.en),description=localText(entry,'description'),head=`<!doctype html>\n<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(localTitle(entry))} — ATLAS study</title><style>body{font:16px/1.7 system-ui,sans-serif;background:#edf2fa;color:#172842;padding:24px;margin:0}main{max-width:700px;margin:auto}h1{font-size:26px}button,input,output{font:inherit}button{padding:8px 15px}svg{max-width:100%;height:auto}svg text{font-size:14px}#preview{min-height:260px;display:grid;place-items:center;background:#f7f9ff;border-radius:16px}#preview>svg{width:100%}label{display:block;margin-top:18px}input{width:80%;accent-color:#4c6dff}.preview-paused *{animation-play-state:running!important}${collectedKeyframes()}</style></head><body><main><h1>${esc(localTitle(entry))}</h1><p>${esc(description)}</p><p>${esc(tr('직접 제작한 설명용 시각화입니다. 해당 제품·라이브러리 자체의 구현 코드가 아닙니다.','This is an original explanatory visualization, not the implementation of the referenced product or library.'))}</p>`;
 if(wave?.interactive){
  const frames=Array.from({length:21},(_,i)=>waveView(entry,i/20).html),serialized=JSON.stringify(frames).replace(/</g,'\\u003c');
  return head+`<div id="preview">${frames[12]}</div><label>${tr('시간·진행 위치','Time / progress')} <input id="time" type="range" min="0" max="20" step="1" value="12"><output id="value">60%</output></label><button id="play">${tr('재생','Play')}</button><script>const frames=${serialized};const slider=document.getElementById('time'),preview=document.getElementById('preview'),value=document.getElementById('value');let timer;function draw(i){preview.innerHTML=frames[i];slider.value=i;value.value=i*5+'%';}slider.addEventListener('input',()=>{clearInterval(timer);draw(Number(slider.value));});document.getElementById('play').addEventListener('click',()=>{clearInterval(timer);if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(20);return;}let i=0;draw(0);timer=setInterval(()=>{draw(++i);if(i===20)clearInterval(timer);},90);});window.addEventListener('pagehide',()=>clearInterval(timer));</`+`script></main></body></html>`;
 }
 return head+'<div id="preview">'+portablePreview(entry)+'</div></main></body></html>';
}
function manualCode(text){
 let dlg=q('#copy-code-dialog');if(!dlg){dlg=document.createElement('dialog');dlg.id='copy-code-dialog';dlg.className='copy-code-dialog';document.body.append(dlg);}
 dlg.innerHTML=`<h2>${tr('코드 직접 복사','Copy the code manually')}</h2><p>${tr('브라우저가 자동 복사를 허용하지 않았습니다. 선택된 코드를 복사하세요.','The browser did not allow automatic copying. Copy the selected code below.')}</p><textarea spellcheck="false" aria-label="${tr('독립 실행 HTML 코드','Standalone HTML code')}"></textarea><form method="dialog"><button>${tr('닫기','Close')}</button></form>`;dlg.querySelector('textarea').value=text;dlg.showModal();dlg.querySelector('textarea').focus();dlg.querySelector('textarea').select();
}
async function copyCodeFromCard(button){
 const e=byId.get(button.dataset.copyCode);if(!e)return;let text;
 try{text=exportCode(e);}catch(error){announce(tr('코드를 생성하지 못했습니다. 페이지를 다시 불러오세요.','Code could not be generated. Reload the page.'));return;}
 let ok=false;
 try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);ok=true;}}catch{}
 if(!ok){const input=document.createElement('textarea');input.value=text;input.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px';document.body.append(input);input.select();try{ok=document.execCommand('copy');}catch{}input.remove();button.focus({preventScroll:true});}
 if(!ok){manualCode(text);return;}
 const old=button.innerHTML;button.innerHTML=icon('check')+' '+tr('복사됨','Copied');button.classList.add('copied');announce(tr('독립 실행 HTML 코드를 복사했습니다.','Standalone HTML code copied.'));setTimeout(()=>{if(button.isConnected){button.innerHTML=old;button.classList.remove('copied');}},1800);
}
document.addEventListener('click',event=>{
 const copy=event.target.closest('[data-copy-code]');if(copy){event.preventDefault();event.stopImmediatePropagation();void copyCodeFromCard(copy);return;}
 const collection=event.target.closest('[data-live-collection]');if(collection){event.preventDefault();event.stopImmediatePropagation();collectionLive(collection.dataset.liveCollection);return;}
},true);
function enhanceInit(){
 if('IntersectionObserver'in window)ixObserver=new IntersectionObserver(items=>{for(const item of items)if(item.isIntersecting){ixObserver.unobserve(item.target);const e=byId.get(item.target.dataset.liveDemo);if(e?.demo)void AtlasKit.mount(item.target,e.demo,locale,{paused:()=>motionPaused});}},{rootMargin:'100px'});
 hydrateLive(document);enforceMinimumText(document);
 const preset=new URL(location.href).searchParams.get('collection');if(preset==='interactions'||preset==='three')collectionLive(preset==='three'?'three':'interactive');
 window.addEventListener('resize',()=>{clearTimeout(ixResizeTimer);ixResizeTimer=setTimeout(()=>enforceMinimumText(document),120);});
 const meta=document.createElement('link');meta.rel='alternate';meta.type='text/plain';meta.title='ATLAS machine-readable index';meta.href='/llms.txt';document.head.append(meta);
 if(new URL(location.href).searchParams.get('qa')==='1')Object.defineProperty(window,'atlasInteractiveQA',{value:{recipes:()=>entries.filter(e=>e.demo).map(e=>({id:e.id,en:e.en,ko:e.ko,...e.demo})),code:id=>exportCode(byId.get(id)),stats:()=>AtlasKit.stats(),enforce:enforceMinimumText,collection:collectionLive,minimum:14}});
}
