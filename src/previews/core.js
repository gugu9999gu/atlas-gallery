/* ATLAS preview expansion. Original SVG studies, not screenshots of third-party products.
 * Exact English-name registration only; unknown terms retain the honest concept fallback.
 * Included inside app.js's closure by scripts/build.py. */
const waveRegistry = new Map();
function waveAdd(family, rows, draw, options={}) {
 for (const row of rows.trim().split('\n')) {
  const [name,key,ko,en]=row.split('|');
  if (!name || !key || !ko || !en || waveRegistry.has(name)) throw new Error('Invalid preview registration: '+name);
  waveRegistry.set(name,{family,key,ko,en,draw,interactive:!!options.interactive,motion:!!options.motion});
 }
}
const wxGroup=(body,extra='')=>`<g ${extra}>${body}</g>`;
const wxArrow=(x,y,x2,y2,c=PC.blue,w=2)=>{const a=Math.atan2(y2-y,x2-x),r=6;return ln(x,y,x2,y2,c,w)+path(`M${x2-r*Math.cos(a-.55)} ${y2-r*Math.sin(a-.55)}L${x2} ${y2}L${x2-r*Math.cos(a+.55)} ${y2-r*Math.sin(a+.55)}`,c,w);};
const wxBox=(x,y,w,h,text,c=PC.blue)=>rect(x,y,w,h,c,5)+tx(x+w/2,y+h/2+3,text,9,'white','middle',650);
const wxDots=(pts,c=PC.blue,r=3)=>pts.map(([x,y])=>circ(x,y,r,c)).join('');
const wxCaption=(s)=>tx(150,169,s,9,PC.muted,'middle');
const wxGrid=()=>[0,1,2,3,4].map(i=>ln(30,35+i*28,270,35+i*28,PC.grid,1)+ln(30+i*60,35,30+i*60,147,PC.grid,1)).join('');
const wxCube=(x=150,y=90,s=46,kind='solid')=>{
 const p=[[x,y-s],[x+s,y-s/2],[x+s,y+s/2],[x,y+s],[x-s,y+s/2],[x-s,y-s/2],[x,y]];
 const face=(a,c)=>path(poly(a.map(i=>p[i]))+'Z',PC.blue,1.5,kind==='wire'?'none':c);
 return face([0,1,6,5],'#b9c5fa')+face([5,6,3,4],'#879bea')+face([6,1,2,3],'#6276d4');
};
function waveView(e, value=.6){
 const item=waveRegistry.get(e.en);if(!item)return null;
 const amount=Number.isFinite(value)?Math.min(1,Math.max(0,value)):.6;
 const body=item.draw(item.key,amount,e);
 if(typeof body!=='string'||!body.length)throw new Error('Empty preview: '+e.en);
 return {html:svgFrame(e,body),mode:item.motion?'native':'exact',type:item.motion?'실시간 모션 예시':'개념 시각화',key:`wave1-${item.family}-${item.key}`,specific:true};
}
function waveControls(e){const d=waveRegistry.get(e.en);if(!d?.interactive)return '';return `<div class="demo-controls wave-controls"><label for="wave-progress">${tr('시간·진행 위치','Time / progress')}</label><input id="wave-progress" type="range" min="0" max="100" value="60" step="1" aria-valuetext="60%"><output id="wave-output" for="wave-progress">60%</output><button type="button" id="wave-reset" class="drawer-pill clickable">${tr('초기화','Reset')}</button></div><p class="wave-help">${esc(tr(d.ko,d.en))}</p>`;}
function waveNotice(e){const d=waveRegistry.get(e.en);if(!d)return '';return tr(d.ko,d.en)+' '+(d.family==='vfx'||d.family==='model'?tr('직접 제작한 원리 시각화이며 실제 게임 엔진 렌더링은 아닙니다.','An original explanatory visualization, not a game-engine render.'):tr('직접 제작한 예시이며 실제 사용자·서비스 데이터는 사용하지 않습니다.','An original study; no real user or service data is used.'));}
function waveSetProgress(value){const e=byId.get(state.active);if(!e||!waveRegistry.has(e.en))return;const v=Math.min(100,Math.max(0,Number(value)||0)),stage=q('#detail-body > .scene .reference-stage');if(stage)stage.innerHTML=waveView(e,v/100).html;const input=q('#wave-progress'),output=q('#wave-output');if(input){input.value=String(v);input.setAttribute('aria-valuetext',v+'%');}if(output)output.textContent=v+'%';}

/* One user-initiated playback at a time. No hundreds-of-cards animation loop. */
let wavePlayback=null,waveAnimationFrame=0;
function waveStop(){if(waveAnimationFrame)cancelAnimationFrame(waveAnimationFrame);waveAnimationFrame=0;wavePlayback=null;}
function wavePlay(entry,stage,detail=false){
 waveStop();const study=waveRegistry.get(entry?.en);
 if(!study?.interactive||!stage||motionPaused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const session={entry,stage,detail,start:performance.now(),last:-1};wavePlayback=session;
 const tick=now=>{if(wavePlayback!==session||!stage.isConnected||document.hidden||motionPaused){waveStop();return;}const t=Math.min(1,(now-session.start)/2200);
  if(now-session.last>55||t===1){stage.innerHTML=waveView(entry,t).html;session.last=now;if(detail){const range=q('#wave-progress'),output=q('#wave-output'),value=Math.round(t*100);if(range){range.value=value;range.setAttribute('aria-valuetext',value+'%');}if(output)output.textContent=value+'%';}}
  if(t<1)waveAnimationFrame=requestAnimationFrame(tick);else waveStop();
 };waveAnimationFrame=requestAnimationFrame(tick);
}
function installWaveInteractions(){
 const cards=q('#cards');
 const start=ev=>{const card=ev.target.closest('.term-card');if(!card||card.contains(ev.relatedTarget))return;const e=byId.get(card.dataset.id);if(waveRegistry.has(e?.en))wavePlay(e,q('.reference-stage',card));};
 const stop=ev=>{const card=ev.target.closest('.term-card');if(!card||card.contains(ev.relatedTarget))return;if(wavePlayback&&!wavePlayback.detail)waveStop();};
 cards.addEventListener('pointerover',start);cards.addEventListener('pointerout',stop);cards.addEventListener('focusin',start);cards.addEventListener('focusout',stop);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)waveStop();});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',ev=>{if(ev.matches)waveStop();});
}
