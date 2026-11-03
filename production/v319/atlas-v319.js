/* ATLAS v3.19 — sixteen original browser-only GIS, map and procedural demonstrations.
 * Illustrative planar or formula-based coordinates; no GPS, remote map data, persistence or network.
 */
(function initAtlasGeo319(global) {
'use strict';
const ITEMS=[
 ['dar-bec6171276e6','map-wang','Wang Tiles','왕 타일'],
 ['dar-eb0f882933d4','map-seed','Seed','시드'],
 ['dar-d599af71db6a','map-simplex','Simplex Noise','심플렉스 노이즈'],
 ['dar-b2a1603af7af','map-wfc','Wave Function Collapse','웨이브 펑션 콜랩스'],
 ['dar-4d7af1c8aafb','map-dem','DEM','수치 표고 모델'],
 ['dar-f5685c0fb1e9','map-erosion','Terrain Erosion','지형 침식'],
 ['dar-019ce12167c2','map-flow','Water Flow Map','물 흐름 맵'],
 ['dar-67ac503913c6','map-raster','Raster Tile','래스터 타일'],
 ['dar-1509e452e1c0','map-vector','Vector Tile','벡터 타일'],
 ['dar-793fb4f01a87','map-xyz','XYZ Tile Scheme','XYZ 타일 체계'],
 ['dar-d6527eef4bb1','map-geojson','GeoJSON','GeoJSON'],
 ['dar-07e6ee29fe0c','map-legend','Map Legend','지도 범례'],
 ['dar-ef9d9e33319b','map-scale','Scale Bar','축척 막대'],
 ['dar-1beb3a7e3abf','map-north','North Arrow','북쪽 표시'],
 ['dar-75099b531490','map-projection','Map Projection','지도 투영'],
 ['dar-ffee68607195','map-latlon','Latitude / Longitude','위도·경도']
];
const CONFIG={
 'map-wang':[2,4,2,1,'모서리 종류','Edge types','새 무늬','New layout','일치 검사','Check joins'],
 'map-seed':[1,100,13,1,'시드 번호','Seed','시드 증가','Next seed','같은 시드 확인','Replay seed'],
 'map-simplex':[1,10,4,1,'공간 주파수','Frequency','시드 변경','Next seed','음영 임곗값','Threshold'],
 'map-wfc':[0,100,40,10,'길 가중치','Path bias','한 칸 확정','Collapse one','전체 해결','Solve all'],
 'map-dem':[1,5,2,1,'고도 강조','Relief','지형 재생성','New terrain','음영 전환','Hillshade'],
 'map-erosion':[1,12,5,1,'임계 경사','Talus threshold','침식 한 단계','Erode once','5단계 진행','Five steps'],
 'map-flow':[1,9,5,1,'화살표 길이','Arrow length','흐름 진행','Advect tracer','등고 배경','Contour overlay'],
 'map-raster':[6,20,12,1,'타일 해상도','Resolution','패턴 재생성','New raster','픽셀 격자','Grid overlay'],
 'map-vector':[1,5,2,1,'확대 단계','Zoom','형상 편집','Edit feature','꼭짓점 표시','Show vertices'],
 'map-xyz':[0,6,3,1,'줌 단계 z','Zoom level z','경도 이동','Move east','위도 이동','Move north'],
 'map-geojson':[1,9,4,1,'지점 속성값','Feature property','Point 추가','Add point','객체 선택','Select feature'],
 'map-legend':[1,10,5,1,'기호 크기','Symbol size','분류 선택','Next category','전체 보기','Show all'],
 'map-scale':[1,12,4,1,'표시 단위/픽셀','Units per pixel','축척 증가','Increase scale','구간 전환','Toggle segments'],
 'map-north':[0,350,30,10,'지도 회전각','Map rotation','10° 회전','Rotate 10°','북쪽 정렬','North up'],
 'map-projection':[-75,75,45,5,'비교 위도','Sample latitude','투영 전환','Switch projection','위도 반전','Flip latitude'],
 'map-latlon':[-80,80,30,5,'위도','Latitude','경도 동쪽 이동','Move east','반구 전환','Flip hemisphere']
};
const SCOPE={
 'map-wang':['공통 모서리 변수를 사용하는 인접 타일 정합 시연. 상용 오토타일 편집기는 아닙니다.','Matching adjacent edges using shared edge constraints; not a production autotiler.'],
 'map-seed':['선형 합동 의사난수의 동일 시드 재현성을 보여줍니다. 암호학적 난수가 아닙니다.','Reproducible linear-congruential pseudo-random output, not cryptographically secure.'],
 'map-simplex':['2D 심플렉스 격자·기울기 합성을 구현합니다. 고도 측정 자료는 아닙니다.','2D simplex gradient noise; not geographic elevation data.'],
 'map-wfc':['16개 연결 마스크의 최소 엔트로피 확정과 제약 전파입니다. 충돌 시 재시도합니다.','Minimum-entropy collapse with adjacency propagation over 16 masks; retries contradictions.'],
 'map-dem':['가상 높이 격자·그림자 계산이며 실제 수치표고모델을 읽지 않습니다.','A synthetic sampled height field and simple hillshade, not real DEM input.'],
 'map-erosion':['차분 기반 열 침식을 시연합니다. 실제 유체·퇴적물 모형이 아닙니다.','Mass-conserving simplified thermal erosion, not a hydrological/sediment solver.'],
 'map-flow':['높이 기울기의 반대 방향을 그립니다. 실제 하천 유량 또는 해류 데이터가 아닙니다.','Downhill height-field gradients and a tracer, not measured water discharge or ocean flow.'],
 'map-raster':['정사각 픽셀의 가상 래스터를 표시합니다. 실제 XYZ 타일 서버는 호출하지 않습니다.','An original sampled raster; does not load a remote map tile.'],
 'map-vector':['SVG 경로와 면을 확대해 벡터 특성을 보여줍니다. 실제 MVT 바이너리 인코딩은 아닙니다.','SVG vector geometry at multiple zooms, not an encoded MVT binary tile.'],
 'map-xyz':['Web Mercator의 표준 XYZ 인덱스를 계산합니다. 네트워크 타일 요청은 하지 않습니다.','Formula-based Web Mercator XYZ indexing, without remote tiles.'],
 'map-geojson':['실제 GeoJSON FeatureCollection 구조를 메모리에서 구성합니다. 좌표는 가상값입니다.','A valid in-memory GeoJSON FeatureCollection with illustrative coordinates.'],
 'map-legend':['범례와 가상 지도 객체를 같은 분류 상태에 맞춰 표시합니다.','A linked category legend and illustrative map symbols.'],
 'map-scale':['화면 단위와 축척 막대의 환산 관계만 시연합니다. 지오데식 미터값은 아닙니다.','Pixel-to-display-unit conversion, not an actual geographic metre scale.'],
 'map-north':['평면 도면을 돌려 북쪽 표시의 상대 방향을 보여줍니다. 자기 편각은 계산하지 않습니다.','Relative map rotation with a north arrow, not magnetic declination.'],
 'map-projection':['등간격 위경도·구형 메르카토르의 위도별 y 분포를 비교합니다.','Equirectangular versus spherical Mercator latitude positions; no regional datum.'],
 'map-latlon':['위·경도와 단순 등간격 평면 좌표를 대응시킵니다. 실제 GPS를 사용하지 않습니다.','WGS-like angular values visualized on a plate carrée grid, not GPS.']
};
const byId=new Map(ITEMS.map(x=>[x[0],x])),byKey=new Map(ITEMS.map(x=>[x[1],x]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['#8bdcc0','#d0b0ee','#e9c78c','#8bbde4','#e7a3ad','#b2d986'];
const seeded=seed=>{let x=(seed>>>0)||1;return ()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296;};};
const coord=(x,y)=>({x,y});
const terrain=(w,h,seed)=>{const rand=seeded(seed),a=rand()*2,b=rand()*2;return Array.from({length:w*h},(_,i)=>{const x=i%w/(w-1),y=Math.floor(i/w)/(h-1);return 17+25*Math.exp(-((x-.3-a*.05)**2+(y-.52)**2)/.06)+22*Math.exp(-((x-.72)**2+(y-.37-b*.04)**2)/.035)+3*Math.sin(x*17+y*11+seed*.1);});};
const neighbors=(i,w,h)=>[i>=w?i-w:-1,i%w<w-1?i+1:-1,i<w*(h-1)?i+w:-1,i%w?i-1:-1].filter(x=>x>=0);
const edge=(mask,dir)=>(mask>>dir)&1; // North=0, East=1, South=2, West=3.
const W=6,H=4;
const rules={
 edge,
 seeded,
 sample:(seed,n)=>{const r=seeded(seed);return Array.from({length:n},()=>r());},
 wang(w,h,types,seed){const r=seeded(seed),horizontal=Array.from({length:w*(h+1)},()=>Math.floor(r()*types)),vertical=Array.from({length:(w+1)*h},()=>Math.floor(r()*types));const cells=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)cells.push([horizontal[y*w+x],vertical[y*(w+1)+x+1],horizontal[(y+1)*w+x],vertical[y*(w+1)+x]]);return cells;},
 wangValid(cells,w,h){let errors=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++){const t=cells[y*w+x];if(x<w-1&&t[1]!==cells[y*w+x+1][3])errors++;if(y<h-1&&t[2]!==cells[(y+1)*w+x][0])errors++;}return errors;},
 simplex(xin,yin,seed){
  const F=.5*(Math.sqrt(3)-1),G=(3-Math.sqrt(3))/6,s=(xin+yin)*F,i=Math.floor(xin+s),j=Math.floor(yin+s),t=(i+j)*G,x0=xin-(i-t),y0=yin-(j-t),i1=x0>y0?1:0,j1=1-i1;
  const pts=[[x0,y0,i,j],[x0-i1+G,y0-j1+G,i+i1,j+j1],[x0-1+2*G,y0-1+2*G,i+1,j+1]];
  const dirs=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];let sum=0;
  for(const [x,y,ix,iy] of pts){let weight=.5-x*x-y*y;if(weight<=0)continue;const hash=(Math.imul(ix,374761393)^Math.imul(iy,668265263)^Math.imul(seed,1274126177))>>>0;const [a,b]=dirs[hash%8];weight*=weight;sum+=weight*weight*(a*x+b*y);}
  return clamp(70*sum,-1,1);
 },
 wfcInitial(){const out=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)out.push(Array.from({length:16},(_,i)=>i).filter(mask=>(y>0||!edge(mask,0))&&(x<W-1||!edge(mask,1))&&(y<H-1||!edge(mask,2))&&(x>0||!edge(mask,3))));return out;},
 wfcPropagate(domains){let updated=true,passes=0;while(updated&&passes++<W*H*16){updated=false;for(let i=0;i<domains.length;i++)for(const [dir,n] of [[0,i-W],[1,i+1],[2,i+W],[3,i-1]]){if(n<0||n>=domains.length||(dir===1&&i%W===W-1)||(dir===3&&i%W===0))continue;const opp=(dir+2)%4,filtered=domains[i].filter(v=>domains[n].some(other=>edge(v,dir)===edge(other,opp)));if(filtered.length<domains[i].length){domains[i]=filtered;updated=true;if(!filtered.length)return false;}}}return true;},
 wfcAdvance(domains,seed,bias){const next=domains.map(x=>x.slice());const candidates=next.map((x,i)=>({i,len:x.length})).filter(x=>x.len>1).sort((a,b)=>a.len-b.len||a.i-b.i);if(!candidates.length)return{domains:next,done:true,ok:true};const random=seeded(seed),min=candidates[0].len,pool=candidates.filter(x=>x.len===min),chosen=pool[Math.floor(random()*pool.length)].i;const values=next[chosen],preferred=values.filter(v=>{const degree=[0,1,2,3].reduce((sum,d)=>sum+edge(v,d),0);return bias>=50?degree>=2:degree<=2;}),list=preferred.length&&random()<Math.abs(bias-50)/55?preferred:values;next[chosen]=[list[Math.floor(random()*list.length)]];const ok=rules.wfcPropagate(next);return {domains:next,done:next.every(x=>x.length===1),ok};},
 thermal(height,w,h,talus){const next=height.slice();for(let i=0;i<height.length;i++){let best=-1,diff=0;for(const j of neighbors(i,w,h)){const d=height[i]-height[j];if(d>diff){diff=d;best=j;}}if(best>=0&&diff>talus){const move=(diff-talus)*.24;next[i]-=move;next[best]+=move;}}return next;},
 xyz(lon,lat,z){const n=2**z,rad=lat*Math.PI/180,x=Math.floor((lon+180)/360*n),y=Math.floor((1-Math.asinh(Math.tan(rad))/Math.PI)/2*n);return {z,x:clamp(x,0,n-1),y:clamp(y,0,n-1)};},
 mercator(lat){const rad=clamp(lat,-85,85)*Math.PI/180;return Math.log(Math.tan(Math.PI/4+rad/2));},
 geojson(points){return {type:'FeatureCollection',features:[{type:'Feature',properties:{name:'park'},geometry:{type:'Polygon',coordinates:[[[20,20],[110,20],[110,97],[20,97],[20,20]]]}},{type:'Feature',properties:{name:'route'},geometry:{type:'LineString',coordinates:[[10,111],[95,73],[190,100],[264,28]]}},...points.map((p,i)=>({type:'Feature',properties:{id:i+1,value:p.value},geometry:{type:'Point',coordinates:[p.x,p.y]}}))]};}
};
const CSS='.g319{display:grid;grid-template-rows:minmax(76px,1fr) auto auto auto auto;width:100%;height:100%;min-width:0;min-height:0;overflow:hidden;background:#122b40;color:#eef8fc;font:14px/1.35 system-ui,sans-serif;isolation:isolate}.g319 *{box-sizing:border-box}.g319-view{display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:3px;overflow:auto;overscroll-behavior:contain;min-height:0;min-width:0;padding:5px 9px;background:radial-gradient(ellipse at 65% 5%,#224b64,#112a3b)}.g319-svg{display:block;flex:1 1 100px;width:100%;height:125px;min-height:76px;max-height:148px;touch-action:manipulation}.g319-view[tabindex]{cursor:crosshair}.g319-note{font:14px/1.3 ui-monospace,monospace;text-align:center;margin:0;white-space:normal;overflow-wrap:anywhere;color:#d1e7f1}.g319-controls{display:flex;gap:4px;flex-wrap:wrap;align-items:center;justify-content:center;padding:5px 6px;border-top:1px solid #3a586c}.g319 button{color:#f2fcff;background:#28526e;border:1px solid #8ba9b9;font:600 14px/1.25 system-ui;min-height:31px;border-radius:7px;padding:5px 7px;cursor:pointer}.g319 button:hover{background:#356d85}.g319 button:focus-visible,.g319 input:focus-visible,.g319 [tabindex]:focus-visible{outline:3px solid #f0cd83;outline-offset:2px}.g319-controls [data-map-action=reset]{margin-left:auto}.g319-slider{display:flex;gap:7px;align-items:center;padding:0 8px 5px;min-width:0}.g319-slider span{white-space:nowrap}.g319-slider input{flex:1;min-width:24px;height:24px;accent-color:#84d4bd}.g319-slider output{min-width:30px;text-align:right;font-variant-numeric:tabular-nums}.g319-status{margin:0;padding:4px 7px;color:#d1f3dd;background:#204135;text-align:center;max-height:40px;overflow:auto}.g319-scope{margin:0;padding:5px 8px;background:#102438;color:#c7dded;max-height:46px;overflow:auto;overscroll-behavior:contain}.g319 .g319-swatch{stroke:#1e3247;stroke-width:1.4}.g319-svg text{font-family:system-ui,sans-serif;font-size:14px}.g319 button,.g319 input,.g319 output,.g319 span,.g319 p,.g319 label{font-size:14px}@media(max-width:390px){.g319-controls button{padding:5px 5px}.g319-view{padding:4px 6px}.g319-slider{gap:4px;padding:0 6px 4px}}@media(prefers-reduced-motion:reduce){.g319 *{transition:none!important;animation:none!important}}html.motion-paused .g319 *,html[data-motion=off] .g319 *{animation:none!important;transition:none!important}@media(forced-colors:active){.g319 button{forced-color-adjust:auto}.g319-svg{border:1px solid CanvasText}}';
let observer;const active=new Set();
function install(){if(document.getElementById('atlas-map-v319'))return;const st=document.createElement('style');st.id='atlas-map-v319';st.textContent=CSS;document.head.append(st);}
function markup(key,lang='ko'){const item=byKey.get(key),a=CONFIG[key],en=lang==='en';if(!item)throw Error('Unknown map study '+key);return '<div class="g319" data-map-key="'+key+'" lang="'+(en?'en':'ko')+'"><div class="g319-view" aria-label="'+esc(item[en?2:3])+'"></div><div class="g319-controls"><button type="button" data-map-action="step">'+esc(a[en?7:6])+'</button><button type="button" data-map-action="alt">'+esc(a[en?9:8])+'</button><button type="button" data-map-action="reset" title="'+(en?'Reset':'초기화')+'" aria-label="'+(en?'Reset':'초기화')+'">↺</button></div><label class="g319-slider"><span>'+esc(a[en?5:4])+'</span><input type="range" data-map-range min="'+a[0]+'" max="'+a[1]+'" step="'+a[3]+'" value="'+a[2]+'"><output>'+a[2]+'</output></label><p class="g319-status" role="status" aria-live="polite">'+(en?'Ready':'준비')+'</p><p class="g319-scope" tabindex="0">'+esc(SCOPE[key][en?1:0])+'</p></div>';}
function mount(root,key=root.dataset.mapKey,lang=root.lang||'ko'){
 if(root.__map319)return root.__map319;if(!byKey.has(key))throw Error('Unknown map preview '+key);
 const en=lang==='en',t=(ko,english)=>en?english:ko,ac=new AbortController(),q=s=>root.querySelector(s),view=q('.g319-view'),range=q('[data-map-range]'),cfg=CONFIG[key];
 let state;
 const point=(x,y,r=4,color='#e9fafc')=>'<circle cx="'+Number(x).toFixed(2)+'" cy="'+Number(y).toFixed(2)+'" r="'+r+'" fill="'+color+'"/>';
 const rect=(x,y,w,h,fill='#244a65',stroke='#466b80')=>'<rect x="'+Number(x).toFixed(2)+'" y="'+Number(y).toFixed(2)+'" width="'+Number(w).toFixed(2)+'" height="'+Number(h).toFixed(2)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width=".8"/>';
 const line=(x,y,a,b,color='#a8d9dc',sw=2)=>'<path d="M'+Number(x).toFixed(2)+' '+Number(y).toFixed(2)+'L'+Number(a).toFixed(2)+' '+Number(b).toFixed(2)+'" stroke="'+color+'" stroke-width="'+sw+'" fill="none" stroke-linecap="round"/>';
 const text=(x,y,str,fill='#eaf7fc',anchor='middle')=>'<text x="'+x+'" y="'+y+'" fill="'+fill+'" text-anchor="'+anchor+'" font-size="14">'+esc(str)+'</text>';
 const svg=(html,label)=>'<svg class="g319-svg" viewBox="0 0 280 135" role="img" aria-label="'+esc(label)+'">'+html+'</svg>';
 function base(){
  return {param:cfg[2],seed:13,actions:0,alt:false,phase:0,lon:38,lat:30,heading:0,chosen:0,selected:0,points:[{x:126,y:67,value:4}],dem:terrain(20,10,13),erosion:terrain(12,7,13),domains:rules.wfcInitial(),collapsed:0,attempt:0,tracer:coord(44,48),changes:0};
 }
 function reset(){state=base();if(key==='map-latlon'||key==='map-projection')state.lat=cfg[2];root.dataset.state='ready';root.dataset.revision='0';render();q('.g319-status').textContent=t('초기화 완료','Reset complete');}
 function touch(){state.actions++;root.dataset.revision=String(state.actions);root.dataset.state='changed';}
 function heights(arr,w,h,shade){const nx=w,ny=h,cw=280/nx,ch=135/ny;let out='',min=Infinity,max=-Infinity;for(const v of arr){min=Math.min(min,v);max=Math.max(max,v);}for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const k=y*nx+x,v=arr[k],value=(v-min)/(max-min||1),dx=(arr[y*nx+Math.min(x+1,nx-1)]-arr[y*nx+Math.max(x-1,0)])*.5,dy=(arr[Math.min(y+1,ny-1)*nx+x]-arr[Math.max(y-1,0)*nx+x])*.5;const brightness=shade?clamp(48-(dx+dy)*4,18,78):30+value*42;const fill='hsl('+(170-Math.round(value*95))+' 48% '+Math.round(brightness)+'%)';out+=rect(x*cw,y*ch,cw+.25,ch+.25,fill,fill);}return{html:out,min,max};}
 function render(){
  const s=state,p=s.param,r=seeded(s.seed);let body='',caption='';
  if(key==='map-wang'){
   const cols=7,rows=5,tiles=rules.wang(cols,rows,p,s.seed),cw=36,ch=23;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const e=tiles[j*cols+i],x=14+i*cw,y=8+j*ch;body+=rect(x,y,cw,ch,'#20445b','#3d637b');for(const [k,[ax,ay,bx,by]] of [[0,[x+7,y,x+cw-7,y]],[1,[x+cw,y+5,x+cw,y+ch-5]],[2,[x+7,y+ch,x+cw-7,y+ch]],[3,[x,y+5,x,y+ch-5]]].entries()){body+=line(ax,ay,bx,by,colors[e[k]%colors.length],3);}body+=point(x+cw/2,y+ch/2,3,'#e7f4f5');}
   caption=t('모서리 불일치 ','Mismatched edges ')+rules.wangValid(tiles,cols,rows)+' / 58';
  } else if(key==='map-seed'){
   const vals=rules.sample(p,35),other=rules.sample(p,35);for(let i=0;i<35;i++){const x=13+(i%7)*37,y=5+Math.floor(i/7)*25,v=vals[i];body+=rect(x,y,33,21,'hsl('+(160+Math.floor(v*140))+' 50% '+Math.floor(35+v*33)+'%)','#53758a');}
   caption=(s.alt?t('재실행 결과 동일: ','Replayed identical: '):t('의사난수 시드 ','Pseudo-random seed '))+(s.alt?String(vals.every((v,i)=>v===other[i])):String(p));
  } else if(key==='map-simplex'){
   const nx=35,ny=17,cw=280/nx,ch=135/ny;let low=1,high=-1;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const v=rules.simplex(x/nx*p*1.4,y/ny*p*1.2,s.seed);low=Math.min(low,v);high=Math.max(high,v);const fill=s.alt?(v>=0?'#9cd7be':'#24465d'):'hsl('+(168+Math.round(v*55))+' 46% '+Math.round(48+v*28)+'%)';body+=rect(x*cw,y*ch,cw+.15,ch+.15,fill,fill);}
   caption=t('노이즈 범위 ','Noise span ')+low.toFixed(2)+' … '+high.toFixed(2);
  } else if(key==='map-wfc'){
   const cols=W,rows=H,cw=42,ch=27;let unresolved=0;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const options=s.domains[y*cols+x],px=14+x*cw,py=8+y*ch;if(options.length!==1)unresolved++;body+=rect(px,py,cw-2,ch-2,'#1e3e57','#5f8394');if(options.length===1){const mask=options[0];for(let d=0;d<4;d++)if(edge(mask,d)){const e=[[px+cw/2,py],[px+cw-2,py+ch/2],[px+cw/2,py+ch-2],[px,py+ch/2]][d];body+=line(px+cw/2,py+ch/2,e[0],e[1],'#91e0bd',5);}body+=point(px+cw/2,py+ch/2,3,'#dff7f0');}else body+=text(px+cw/2,py+ch/2+5,'?', '#b0cfde');}
   caption=t('미확정 칸 ','Uncollapsed ')+unresolved+' / 24 · '+t('재시도 ','restarts ')+s.attempt;
  } else if(key==='map-dem'||key==='map-erosion'){
   const isDem=key==='map-dem',arr=isDem?s.dem:s.erosion,w=isDem?20:12,h=isDem?10:7,geo=heights(isDem?arr.map(v=>v*p):arr,w,h,isDem?!s.alt:false);body=geo.html;caption=(isDem?t('고도 강조 ','Vertical exaggeration ')+p+'× · ':t('열 침식 단계 ','Thermal steps ')+(s.changes+' · '))+geo.min.toFixed(1)+'–'+geo.max.toFixed(1);
  } else if(key==='map-flow'){
   const data=terrain(12,6,s.seed),w=12,h=6;body=heights(data,w,h,false).html;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const k=y*w+x,dx=data[k-1]-data[k+1],dy=data[k-w]-data[k+w],len=Math.hypot(dx,dy)||1,px=(x+.5)*280/w,py=(y+.5)*135/h,ex=px+dx/len*p*1.7,ey=py+dy/len*p*1.7;body+=line(px,py,ex,ey,'#d7effc',1.6)+point(ex,ey,1.5,'#f4e6b2');}
   body+=point(s.tracer.x,s.tracer.y,6,'#f2ce83');caption=t('표식 위치 ','Tracer ')+Math.round(s.tracer.x)+', '+Math.round(s.tracer.y);
  } else if(key==='map-raster'){
   const n=p,c=280/n,rows=Math.max(3,Math.round(n*.45));for(let y=0;y<rows;y++)for(let x=0;x<n;x++){const v=(Math.sin(x*.4+s.seed*.12)+Math.cos(y*.65+s.seed*.08)+2)/4;const fill='hsl('+(100+Math.round(v*110))+' 48% '+Math.round(28+v*43)+'%)';body+=rect(x*c,y*135/rows,c+.2,135/rows+.2,fill,s.alt?'#e1eef0':fill);}
   caption=n+'×'+rows+' '+t('픽셀 격자','sampled pixels');
  } else if(key==='map-vector'){
   const scale=1+(p-1)*.2,shift=140*(1-scale),sy=67*(1-scale);body='<g transform="translate('+shift+' '+sy+') scale('+scale+')"><path d="M18 50 L70 '+(20+(s.changes%6)*8)+' L138 45 L103 105 L35 116 Z" fill="#417b68" stroke="#b1ebcc" stroke-width="2"/><path d="M4 120 Q70 62 141 72 T285 10" fill="none" stroke="#dbb77d" stroke-width="7"/><path d="M18 10 L242 126" fill="none" stroke="#a2d1f1" stroke-width="3"/>'+[coord(40,48),coord(92,74),coord(211,41)].map(pt=>point(pt.x,pt.y,6,'#c6dbe9')).join('')+(s.alt?[coord(18,50),coord(70,20),coord(138,45),coord(103,105),coord(35,116)].map(pt=>point(pt.x,pt.y,3,'#fff')).join(''):'')+'</g>';caption=t('벡터 확대 ','Vector zoom ')+scale.toFixed(1)+'× · '+t('편집 ','edit ')+s.changes;
  } else if(key==='map-xyz'){
   const tile=rules.xyz(s.lon,s.lat,p),cell=35;for(let y=0;y<3;y++)for(let x=0;x<5;x++){const xx=14+x*49,yy=9+y*36,focus=x===2&&y===1;body+=rect(xx,yy,47,34,focus?'#589c8b':'#24506b',focus?'#b6f0cf':'#507a93');if(focus)body+=text(xx+23,yy+23, (tile.x)+','+(tile.y),'#132b3f');}
   caption='z/x/y = '+tile.z+'/'+tile.x+'/'+tile.y+' · '+s.lon.toFixed(0)+'°, '+s.lat.toFixed(0)+'°';
  } else if(key==='map-geojson'){
   const f=rules.geojson(s.points);body=rect(0,0,280,135,'#1d3f55','#315a6a')+'<path d="M20 20L110 20L110 97L20 97Z" fill="#508d68" stroke="#b1e7bc" stroke-width="2"/><path d="M10 111L95 73L190 100L264 28" fill="none" stroke="#edbf82" stroke-width="4"/>'+s.points.map((a,i)=>point(a.x,a.y,6,i===s.selected?'#f8df94':'#bceef0')).join('');
   caption='FeatureCollection · '+f.features.length+' features · Point.value='+p;
  } else if(key==='map-legend'){
   const list=[t('공원','Park'),t('수역','Water'),t('도로','Road')],pts=[coord(26,35),coord(75,79),coord(137,38),coord(199,70),coord(251,44)];body=rect(0,0,280,135,'#1b3d55','#2d5d6d');body+='<path d="M8 98Q140 40 272 109" fill="none" stroke="'+colors[2]+'" stroke-width="5" opacity="'+((s.alt||s.selected===2)?'1':'.2')+'"/>';body+=pts.map((a,i)=>'<g opacity="'+((s.alt||s.selected===i%3)?'1':'.18')+'">'+point(a.x,a.y,(3+p),colors[i%3])+'</g>').join('');body+=rect(150,2,125,54,'#173147','#7390a6');for(let i=0;i<3;i++)body+=point(161,14+i*17,5,colors[i])+text(174,19+i*17,list[i],(s.alt||s.selected===i)?'#f6ffff':'#849cac','start');caption=t('범례 선택 ','Legend selection ')+list[s.selected];
  } else if(key==='map-scale'){
   const sections=s.alt?4:2,width=200,px=width/sections;body=rect(30,35,width,16,'#d8ede5','#d8ede5');for(let i=0;i<sections;i++){body+=rect(30+i*px,35,px,16,i%2?'#e4eee8':'#234f67','#e5eef0')+text(30+i*px,72,String(Math.round(i*px*p)));}
   body+=text(230,72,String(width*p))+line(30,35,230,35,'#cbe9e1',1);caption='200px × '+p+' = '+(200*p)+' '+t('표시 단위','display units');
  } else if(key==='map-north'){
   body='<g transform="rotate('+p+' 140 67)"><path d="M20 40L120 18L249 72L145 116Z" fill="#274d64" stroke="#7299a8" stroke-width="2"/><path d="M35 95L185 28" fill="none" stroke="#7fcaba" stroke-width="6"/><path d="M50 35L215 108" fill="none" stroke="#dfc08d" stroke-width="4"/></g>';const deg=p*Math.PI/180;const nx=140-45*Math.sin(deg),ny=67-45*Math.cos(deg);body+=line(140,67,nx,ny,'#eff3f8',4)+point(nx,ny,5,'#ecbb83')+text(nx,ny-10,'N','#f8efda');caption=t('회전각 ','Rotation ')+p+'° · '+t('북쪽 상대 방향','relative north');
  } else if(key==='map-projection'){
   const toY=lat=>s.alt?67.5-rules.mercator(lat)*21:67.5-lat/90*62;
   body=rect(0,0,280,135,'#173950','#264e60');for(let lon=-180;lon<=180;lon+=60){const x=(lon+180)/360*280;body+=line(x,0,x,135,'#587b8d',.9);}for(let lat=-75;lat<=75;lat+=25){const y=toY(lat);body+=line(0,y,280,y,lat===0?'#e8cc8c':'#64899a',1);}const sample=toY(p);body+=line(0,sample,280,sample,'#94e7b9',3)+point(140,sample,6,'#fcdea1');caption=(s.alt?'Mercator':'Equirectangular')+' · '+p+'° → y '+sample.toFixed(1);
  } else if(key==='map-latlon'){
   const lat=clamp(p,-80,80),lon=s.lon,x=(lon+180)/360*280,y=(90-lat)/180*135;
   body=rect(0,0,280,135,'#1e415a','#2a5265');for(let a=0;a<=280;a+=35)body+=line(a,0,a,135,'#52788c',.7);for(let a=0;a<=135;a+=27)body+=line(0,a,280,a,'#52788c',.7);body+=line(0,y,280,y,'#d8bf86',1.4)+line(x,0,x,135,'#a2dec8',1.4)+point(x,y,6,'#f7e3ba');
   caption=lat.toFixed(0)+'° '+(lat>=0?'N':'S')+' / '+Math.abs(lon).toFixed(0)+'° '+(lon>=0?'E':'W');
  }
  view.innerHTML=svg(body,t('직접 조작 지도 예제','Interactive map example'))+'<p class="g319-note">'+esc(caption)+'</p>';
  q('output').textContent=String(p)+(key==='map-north'?'°':'');
  range.value=String(p);
  root.dataset.label=caption;
  root.dataset.mode=s.alt?'alternative':'primary';
  root.dataset.check=key==='map-wang'?String(rules.wangValid(rules.wang(7,5,p,s.seed),7,5)):key==='map-wfc'?String(s.domains.filter(x=>x.length===1).length):'ready';
 }
 function act(action){
  if(action==='reset'){reset();return;}
  touch();
  if(action==='alt'){
   if(key==='map-wfc'){let steps=0;while(state.domains.some(d=>d.length>1)&&steps++<25)advanceWfc();}
   else if(key==='map-erosion'){for(let i=0;i<5;i++){state.erosion=rules.thermal(state.erosion,12,7,state.param);state.changes++;}}
   else if(key==='map-xyz')state.lat=clamp(state.lat+20,-80,80);
   else if(key==='map-north')state.param=0;
   else if(key==='map-latlon')state.param=-state.param;
   else if(key==='map-projection')state.alt=!state.alt;
   else if(key==='map-legend')state.alt=!state.alt;
   else if(key==='map-geojson')state.selected=(state.selected+1)%state.points.length;
   else state.alt=!state.alt;
  }else{
   if(key==='map-wfc')advanceWfc();
   else if(key==='map-erosion'){state.erosion=rules.thermal(state.erosion,12,7,state.param);state.changes++;}
   else if(key==='map-flow'){
    const w=12,h=6,he=terrain(w,h,state.seed),x=clamp(Math.floor(state.tracer.x/280*w),1,w-2),y=clamp(Math.floor(state.tracer.y/135*h),1,h-2),i=y*w+x,dx=he[i-1]-he[i+1],dy=he[i-w]-he[i+w],length=Math.hypot(dx,dy)||1;
    state.tracer={x:clamp(state.tracer.x+dx/length*state.param*3,5,275),y:clamp(state.tracer.y+dy/length*state.param*3,5,130)};
   }
   else if(key==='map-geojson'){const rand=seeded(state.seed+state.actions);state.points.push({x:15+rand()*250,y:15+rand()*100,value:state.param});if(state.points.length>9)state.points.shift();}
   else if(key==='map-legend')state.selected=(state.selected+1)%3;
   else if(key==='map-scale')state.param=state.param===12?1:state.param+1;
   else if(key==='map-north')state.param=(state.param+10)%360;
   else if(key==='map-projection')state.alt=!state.alt;
   else if(key==='map-latlon'||key==='map-xyz')state.lon=state.lon>=160?-170:state.lon+30;
   else if(key==='map-seed')state.param=state.param>=100?1:state.param+1;
   else if(key==='map-vector')state.changes++;
   else if(key==='map-dem'){state.seed++;state.dem=terrain(20,10,state.seed);}
   else state.seed++;
  }
  render();q('.g319-status').textContent=q('.g319-note')?.textContent||t('변경 완료','Updated');
 }
 function advanceWfc(){
  const c=rules.wfcAdvance(state.domains,state.seed+state.actions+state.collapsed*11,state.param);
  if(!c.ok){state.attempt++;state.domains=rules.wfcInitial();state.seed++;state.collapsed=0;}
  else {state.domains=c.domains;state.collapsed++;}
 }
 root.addEventListener('click',event=>{const btn=event.target.closest('button[data-map-action]');if(!btn||!root.contains(btn))return;event.stopPropagation();act(btn.dataset.mapAction);},{signal:ac.signal});
 range.addEventListener('input',()=>{state.param=clamp(Number(range.value),cfg[0],cfg[1]);touch();if(key==='map-wfc'){state.domains=rules.wfcInitial();state.collapsed=0;}render();q('.g319-status').textContent=cfg[en?5:4]+' '+state.param;},{signal:ac.signal});
 if(key==='map-latlon'||key==='map-dem'){
  view.tabIndex=0;view.setAttribute('aria-label',t('지도를 클릭하거나 방향키로 조절','Click map or use arrow keys'));
  view.addEventListener('pointerdown',event=>{const target=event.target.closest('svg');if(!target)return;const m=target.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());if(key==='map-latlon'){state.lon=clamp(pt.x/280*360-180,-180,179.9);state.param=clamp(Math.round((90-pt.y/135*180)/5)*5,-80,80);}else{state.selected=Math.round(clamp(pt.x/280*19,0,19));}touch();render();q('.g319-status').textContent=q('.g319-note').textContent;},{signal:ac.signal});
  view.addEventListener('keydown',event=>{if(event.target!==view||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();event.stopPropagation();if(key==='map-latlon'){state.lon=clamp(state.lon+(event.key==='ArrowLeft'?-5:event.key==='ArrowRight'?5:0),-180,179.9);state.param=clamp(state.param+(event.key==='ArrowUp'?5:event.key==='ArrowDown'?-5:0),-80,80);}else state.selected=clamp(state.selected+(event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0),0,19);touch();render();q('.g319-status').textContent=q('.g319-note').textContent;},{signal:ac.signal});
 }
 reset();const study={root,key,act,snapshot:()=>JSON.parse(JSON.stringify(state)),dispose(){ac.abort();active.delete(study);delete root.__map319;}};root.__map319=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const x of active)if(!x.root.isConnected)x.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}return study;
}
function code(entry,lang='ko'){const item=byId.get(entry?.id);if(!item)throw Error('Unknown map entry');const en=lang==='en';return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e7eff4;color:#173549;font:16px/1.5 system-ui}main{max-width:660px;margin:auto}h1{font-size:24px}.demo{height:380px;border:1px solid #9bb4c6;border-radius:14px;overflow:hidden}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div id="demo" class="demo"></div><p>'+esc(SCOPE[item[1]][en?1:0])+'</p></main><script>('+initAtlasGeo319.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasMap319.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasMap319.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';}
function attach(){const A=global.Atlas32;if(!A||A.__map319)return false;A.__map319=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-map-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive map/tiling reference':'직접 조작하는 지도·타일 실습'}:prev.art(e,lang);};A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.g319')?[scope]:[...scope.querySelectorAll('.g319')];roots.forEach(node=>mount(node));};A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prev.code(e,lang);return true;}
install();global.AtlasMap319={ITEMS,CONFIG,SCOPE,byId,byKey,rules,markup,mount,code,attach,CSS,version:'3.19.0',activeCount:()=>active.size};attach();
})(window);
