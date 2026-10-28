/* Kakao AdFit: two in-flow placements; immutable issued sizes; explicit opt-in.
 * SDK is loaded once, and render(element) is called once per newly visible unit.
 * Do not call the SDK-wide initializer on search, locale changes or load-more.
 */
const AD=JSON.parse(document.getElementById('atlas-ads').textContent);
const adParams=new URL(location.href).searchParams;
const adPreview=adParams.get('adpreview')==='1';
const adConsentKey='atlas-adfit-consent-v1';
const adConsentTTL=180*24*60*60*1000;
const adCache=new Map();
let adSdkPromise=null,adQueue=Promise.resolve();
let adDecision=readAdConsent();
function readAdConsent(){
 if(adParams.get('ads')==='off')return 'denied';
 try{const v=JSON.parse(store.getItem(adConsentKey)||'null');return v&&['granted','denied'].includes(v.choice)&&Number.isFinite(v.at)&&Date.now()-v.at>=0&&Date.now()-v.at<adConsentTTL?v.choice:'unknown';}catch{return 'unknown';}
}
function adsEligible(){return AD.enabled===true&&AD.provider==='adfit'&&location.protocol==='https:'&&(AD.productionHosts||[]).includes(location.hostname)&&!adParams.has('qa')&&!adPreview;}
function adPrivacyBlocked(){return navigator.globalPrivacyControl===true;}
function adsAllowed(){return adsEligible()&&adDecision==='granted'&&!adPrivacyBlocked();}
function adUnits(){return AD.adfit?.units||{};}
function chooseAdUnit(index,width){
 const u=adUnits();let key;
 if(index===0)key=width>=728&&innerWidth>=1024?'desktopLeaderboard':width>=320?'mobileBanner':width>=250?'compactSquare':null;
 else key=width>=300?'rectangle':null;
 const unit=u[key];return unit&&/^DAN-[A-Za-z0-9_-]+$/.test(unit.id)&&unit.width<=width?{...unit,key}:null;
}
function adAvailableWidth(el){return Math.floor(el.clientWidth);}
function adCanShow(rec){return rec.el.isConnected&&document.visibilityState!=='hidden'&&qa('#cards>.term-card').length>=rec.position&&rec.unit&&adAvailableWidth(rec.el)>=rec.unit.width;}
function adFail(rec){clearTimeout(rec.timer);rec.status='empty';rec.el.dataset.state='empty';rec.el.hidden=true;try{if(rec.ins&&typeof window.adfit?.destroy==='function')window.adfit.destroy(rec.ins);}catch{}rec.el.querySelector('.ad-content').replaceChildren();}
function loadAdSdk(){
 if(adSdkPromise)return adSdkPromise;
 adSdkPromise=new Promise((resolve,reject)=>{
  if(!adsAllowed()){reject(new Error('Advertising permission is absent'));return;}
  const s=document.createElement('script');s.id='atlas-adfit-sdk';s.async=true;s.type='text/javascript';s.charset='utf-8';s.src='https://t1.kakaocdn.net/kas/static/ba.min.js';
  const timer=setTimeout(()=>reject(new Error('AdFit SDK timeout')),15000);
  s.onload=()=>{clearTimeout(timer);if(typeof window.adfit?.render==='function')resolve(window.adfit);else reject(new Error('AdFit render API unavailable'));};
  s.onerror=()=>{clearTimeout(timer);reject(new Error('AdFit SDK unavailable'));};
  document.body.appendChild(s);
 });return adSdkPromise;
}
function activateAd(rec){
 if(rec.status!=='idle'||!adsAllowed()||!adCanShow(rec))return;
 rec.status='queued';rec.el.dataset.state='queued';
 adQueue=adQueue.then(async()=>{
  try{
   if(!adsAllowed()||!adCanShow(rec)){rec.status='idle';return;}
   const sdk=await loadAdSdk();
   if(!adsAllowed()||!adCanShow(rec)){rec.status='idle';return;}
   // The SDK's automatic first scan has completed before we create this element.
   const ins=document.createElement('ins');ins.className='kakao_ad_area';ins.style.display='none';
   ins.dataset.adUnit=rec.unit.id;ins.dataset.adWidth=String(rec.unit.width);ins.dataset.adHeight=String(rec.unit.height);
   const onFail='atlasAdFitNoAd'+rec.index,onLoad='atlasAdFitLoaded'+rec.index;
   window[onFail]=()=>adFail(rec);
   window[onLoad]=()=>{clearTimeout(rec.timer);rec.status='filled';rec.el.dataset.state='filled';rec.el.hidden=!(adsAllowed()&&adCanShow(rec));};
   ins.dataset.adOnfail=onFail;ins.dataset.adOnload=onLoad;
   rec.ins=ins;rec.el.querySelector('.ad-content').replaceChildren(ins);rec.status='requested';rec.el.dataset.state='requested';
   rec.timer=setTimeout(()=>adFail(rec),25000);
   sdk.render(ins);
  }catch{adFail(rec);}
 }).catch(()=>adFail(rec));
}
const adObserver='IntersectionObserver'in window?new IntersectionObserver(items=>{
 for(const entry of items)if(entry.isIntersecting){const rec=adCache.get(Number(entry.target.dataset.slot));if(rec)activateAd(rec);}
},{rootMargin:'160px 0px',threshold:0}):null;
function clearAdCards(){
 // Keep connected ad iframes intact; removing or reparenting them can reload ads.
 for(const node of [...q('#cards').children])if(!node.classList.contains('ad-slot'))node.remove();
 for(const rec of adCache.values())rec.el.hidden=true;
}
function appendAdCards(markup,start){
 const root=q('#cards');
 markup.forEach((html,i)=>{const at=start+i+1,anchor=[...root.querySelectorAll(':scope>.ad-slot')].find(el=>Number(el.dataset.after)>=at);if(anchor)anchor.insertAdjacentHTML('beforebegin',html);else root.insertAdjacentHTML('beforeend',html);});
}
function adConsentMarkup(){return `<div class="ad-consent"><b>${tr('선택적 광고 설정','Optional advertising')}</b><p>${tr('허용하면 카카오 애드핏이 광고 제공·측정을 위해 쿠키·기기 및 접속 정보를 처리할 수 있습니다. 거절해도 모든 레퍼런스를 이용할 수 있습니다.','If allowed, Kakao AdFit may process cookies, device and connection information to serve and measure ads. All references remain available if you decline.')}</p><div class="ad-consent-actions"><button type="button" data-ad-choice="granted">${tr('광고 허용','Allow ads')}</button><button type="button" data-ad-choice="denied">${tr('광고 없이 보기','Continue without ads')}</button><a href="/privacy.html?lang=${locale}" target="_blank" rel="noopener noreferrer">${tr('개인정보 안내','Privacy details')} ↗</a></div></div>`;}
function mountAds(){
 if(!adPreview&&!adsEligible())return;
 const cards=qa('#cards>.term-card');
 const positions=(AD.positionsAfterCards||[16,40]).slice(0,Math.min(2,AD.maxSlots||2));
 positions.forEach((position,index)=>{
  let rec=adCache.get(index);
  if(cards.length<position){if(rec)rec.el.hidden=true;return;}
  if(!rec){const el=document.createElement('aside');el.className='ad-slot';el.dataset.slot=String(index);el.dataset.after=String(position);el.innerHTML='<div class="ad-label"></div><div class="ad-content"></div>';cards[position-1].after(el);rec={el,index,position,status:'idle',unit:null};adCache.set(index,rec);}
  const el=rec.el;el.hidden=false;el.setAttribute('aria-label',tr('광고 영역','Advertisement area'));el.querySelector('.ad-label').textContent=tr('광고','Advertisement');
  const target=el.querySelector('.ad-content');
  // Never swap or re-request an already-loaded unit on resize or a filter change.
  if(rec.status==='idle')rec.unit=chooseAdUnit(index,adAvailableWidth(el));
  if(!rec.unit||adAvailableWidth(el)<rec.unit.width){el.hidden=true;return;}
  if(adPreview){el.classList.add('ad-preview');target.style.width=rec.unit.width+'px';target.style.minHeight=rec.unit.height+'px';target.innerHTML=`<b>${rec.unit.width} × ${rec.unit.height} · Kakao AdFit</b><small>${tr('광고 위치 예시 · 실제 광고 요청 없음','Placement preview · no ad requests')}</small>`;return;}
  if(adPrivacyBlocked()||adDecision==='denied'||rec.status==='empty'){el.hidden=true;return;}
  if(adDecision!=='granted'){if(index===0){el.dataset.state='consent';target.style.width='';target.style.minHeight='0';target.innerHTML=adConsentMarkup();}else el.hidden=true;return;}
  if(rec.status==='idle'){target.replaceChildren();target.style.width=rec.unit.width+'px';target.style.minHeight=rec.unit.height+'px';el.dataset.state='idle';if(adObserver){adObserver.unobserve(el);adObserver.observe(el);}else{const r=el.getBoundingClientRect();if(r.bottom>=0&&r.top<innerHeight+160)activateAd(rec);}}
 });
}
function setAdChoice(choice){
 if(!['granted','denied'].includes(choice))return;
 const wasLoaded=!!document.getElementById('atlas-adfit-sdk');adDecision=choice;
 store.setItem(adConsentKey,JSON.stringify({choice,at:Date.now()}));
 const url=new URL(location.href);if(choice==='denied')url.searchParams.set('ads','off');else url.searchParams.delete('ads');history.replaceState(null,'',url);
 document.getElementById('ad-settings-dialog')?.close();
 if(choice==='denied'){
  for(const rec of adCache.values()){clearTimeout(rec.timer);try{if(rec.ins&&typeof window.adfit?.destroy==='function')window.adfit.destroy(rec.ins);}catch{}rec.el.hidden=true;}
  // Unload the third-party SDK as well as its banners on withdrawal.
  if(wasLoaded){location.replace(url.href);return;}
 }
 mountAds();
}
function openAdSettings(){
 let dialog=document.getElementById('ad-settings-dialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='ad-settings-dialog';dialog.className='ad-settings-dialog';dialog.setAttribute('aria-labelledby','ad-settings-title');document.body.appendChild(dialog);dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
 dialog.innerHTML=`<h2 id="ad-settings-title">${tr('광고 설정','Advertising preferences')}</h2><p>${tr('광고 허용 여부는 이 브라우저에 최대 180일 동안 저장됩니다. 언제든지 변경할 수 있습니다.','Your choice is saved in this browser for up to 180 days. You can change it at any time.')}</p>${adPrivacyBlocked()?`<p>${tr('브라우저의 개인정보 보호 신호에 따라 광고를 요청하지 않습니다.','Your browser privacy signal is respected. Advertising requests are disabled.')}</p>`:adConsentMarkup()}<form method="dialog"><button>${tr('닫기','Close')}</button></form>`;
 dialog.showModal();
}
document.addEventListener('click',event=>{
 const choice=event.target.closest('[data-ad-choice]');if(choice){setAdChoice(choice.dataset.adChoice);return;}
 if(event.target.closest('[data-ad-settings]'))openAdSettings();
});
let adResizeTimer;
window.addEventListener('resize',()=>{clearTimeout(adResizeTimer);adResizeTimer=setTimeout(mountAds,180);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)mountAds();});
if(!adObserver)window.addEventListener('scroll',()=>{if(adsAllowed())for(const rec of adCache.values()){const r=rec.el.getBoundingClientRect();if(!rec.el.hidden&&r.bottom>=0&&r.top<innerHeight+160)activateAd(rec);}},{passive:true});

if(adParams.get('adsettings')==='1')setTimeout(openAdSettings,0);
