/* ATLAS v3.18 — 12 original planar GIS / procedural previews, no network or GPS. */
(function initAtlasGeoLab(global) {
'use strict';
const ITEMS=[
 ['dar-eaf8288da983','geo-voronoi','Voronoi Diagram','보로노이 다이어그램'],
 ['dar-c0ba1313c297','geo-perlin','Perlin Noise','펄린 노이즈'],
 ['dar-c8755d71db8e','geo-fbm','Fractal Brownian Motion','프랙탈 브라운 운동 합성'],
 ['dar-4afe7c548909','geo-bsp','BSP Dungeon','BSP 던전'],
 ['dar-e927a41ade6b','geo-isoline','Isoline','등치선'],
 ['dar-79f90b8cac02','geo-label','Label Collision','라벨 충돌'],
 ['dar-a93cbd09246b','geo-cluster','Marker Clustering','마커 클러스터링'],
 ['dar-84278562ae06','geo-fence','Geofencing','지오펜싱'],
 ['dar-9db3a96cdf3d','geo-join','Spatial Join','공간 결합'],
 ['dar-752c2a37fc6a','geo-buffer','Geospatial Buffer','공간 버퍼'],
 ['dar-5d5cecc2dacb','geo-symbol','Proportional Symbol Map','비례기호 지도'],
 ['dar-200458a776da','geo-general','Map Generalization','지도 일반화']
];
const PARAMETERS={
 'geo-voronoi':[2,8,5,1,'기준점','Sites',''],
 'geo-perlin':[1,10,4,1,'공간 주파수','Frequency',''],
 'geo-fbm':[1,6,4,1,'옥타브 수','Octaves',''],
 'geo-bsp':[1,4,3,1,'분할 깊이','Split depth',''],
 'geo-isoline':[-8,8,1,1,'등치값','Threshold','/10'],
 'geo-label':[0,20,6,2,'라벨 여백','Label padding','px'],
 'geo-cluster':[12,85,35,1,'군집 거리','Cluster radius','px'],
 'geo-fence':[8,272,90,2,'지점 X','Point X',''],
 'geo-join':[0,65,15,1,'B 영역 X 이동','Shift polygon B','px'],
 'geo-buffer':[8,65,28,1,'버퍼 거리','Buffer distance','units'],
 'geo-symbol':[12,43,30,1,'최대 기호 반지름','Max symbol radius','px'],
 'geo-general':[0,18,5,1,'단순화 허용 오차','Tolerance','units']
};
const CONTROLS={
 'geo-voronoi':['새 배치','Regenerate','가장 가까운 점 표시','Show nearest sites'],
 'geo-perlin':['새 시드','Next seed','임곗값 표시','Threshold view'],
 'geo-fbm':['새 시드','Next seed','지속도 전환','Change persistence'],
 'geo-bsp':['새 던전','Regenerate','분할선 표시','Show splits'],
 'geo-isoline':['위상 이동','Shift field','원본 격자 표시','Show samples'],
 'geo-label':['배치 전환','Change layout','제외 라벨 표시','Show rejected'],
 'geo-cluster':['지점 재배치','Regenerate','원본 지점 보기','Show points'],
 'geo-fence':['경로 이동','Next point','경계 반대편','Cross boundary'],
 'geo-join':['지점 추가','Add point','겹침 강조','Highlight overlap'],
 'geo-buffer':['중심 이동','Move source','점 / 선 전환','Point / segment'],
 'geo-symbol':['데이터 교체','Change values','반지름 비교','Compare radius'],
 'geo-general':['원본 겹치기','Overlay original','경로 재생성','New path']
};
const SCOPE={
 'geo-voronoi':['화면 좌표의 격자 샘플에 가장 가까운 점을 배정합니다. 정확한 벡터 경계 계산은 아닙니다.','Nearest sites on a sampled planar grid; not exact vector boundaries.'],
 'geo-perlin':['기울기·페이드 보간 기반 2D 노이즈이며 실제 지형 측정값이 아닙니다.','2D gradient noise with fade interpolation; not measured terrain.'],
 'geo-fbm':['주파수·진폭이 다른 기울기 노이즈 층을 합산합니다.','Combines gradient-noise octaves with increasing frequency and decreasing amplitude.'],
 'geo-bsp':['공간을 재귀 분할하고 각 구역에 방을 배치해 통로로 연결합니다.','Recursive rectangle partitions with rooms linked by corridors.'],
 'geo-isoline':['격자 스칼라 필드에서 등치선 교차점을 선형 보간합니다.','Interpolated marching-squares segments over sampled scalar values.'],
 'geo-label':['축 정렬 사각형의 겹침을 순차 판정합니다. 전문 지도 라벨 배치기는 아닙니다.','Greedy axis-aligned label collision, not a cartographic label solver.'],
 'geo-cluster':['화면상 거리 그래프의 연결 요소를 묶습니다. 지도 확대 단계는 모델링하지 않습니다.','Connected components under screen-space distance, not zoom-aware geospatial clustering.'],
 'geo-fence':['가상의 평면 다각형에 대한 점 포함을 계산합니다. 실제 위치·GPS는 읽지 않습니다.','Planar point-in-polygon; no GPS, location access or geodesic calculation.'],
 'geo-join':['가상의 두 다각형에 들어 있는 지점을 결합합니다. 실제 공간 데이터베이스는 아닙니다.','Point-in-polygon membership in illustrative polygons; not a spatial database join.'],
 'geo-buffer':['좌표 단위가 화면인 유클리드 버퍼입니다. 실제 미터·위경도 기반 연산은 아닙니다.','Euclidean buffer in display units, not a geodesic metre buffer.'],
 'geo-symbol':['값에 비례하는 면적을 제곱근 반지름으로 구현합니다. 가상 수치입니다.','Area-proportional symbols via square-root radii, using illustrative values.'],
 'geo-general':['Douglas–Peucker 선 단순화입니다. 지도 위상·의미 보존은 별도 검증이 필요합니다.','Douglas–Peucker simplification; topology and cartographic meaning are not preserved.']
};
const byId=new Map(ITEMS.map(e=>[e[0],e])),byKey=new Map(ITEMS.map(e=>[e[1],e]));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette=['#74bfb1','#bba0e3','#dfb577','#85b5e5','#d2919e','#86c6d4','#bfd193','#b2a9cd'];
const rng=seed=>{let x=seed>>>0;return ()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296;};};
const field=(x,y,phase=0)=>Math.sin(x*.042+phase)*Math.cos(y*.053-phase)+.35*Math.sin((x+y)*.077+phase);
const rules={
 inside(p,poly){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)hit=!hit;}return hit;},
 distSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);},
 simplify(points,tolerance){if(points.length<3)return points.slice();let k=0,d=0;for(let i=1;i<points.length-1;i++){const t=rules.distSegment(points[i],points[0],points[points.length-1]);if(t>d){d=t;k=i;}}if(d<=tolerance)return [points[0],points[points.length-1]];return [...rules.simplify(points.slice(0,k+1),tolerance).slice(0,-1),...rules.simplify(points.slice(k),tolerance)];},
 cluster(points,threshold){const p=points.map((_,i)=>i),find=i=>p[i]===i?i:(p[i]=find(p[i]));for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)if(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)<=threshold)p[find(j)]=find(i);const m=new Map();points.forEach((v,i)=>{const k=find(i);if(!m.has(k))m.set(k,[]);m.get(k).push(v);});return [...m.values()].map(arr=>({points:arr,x:arr.reduce((a,b)=>a+b.x,0)/arr.length,y:arr.reduce((a,b)=>a+b.y,0)/arr.length,n:arr.length}));},
 noise(x,y,seed){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j;const fade=t=>t*t*t*(t*(t*6-15)+10),lerp=(a,b,t)=>a+(b-a)*t;function grad(ix,iy){let h=(Math.imul(ix,374761393)^Math.imul(iy,668265263)^Math.imul(seed,2246822519))>>>0;h=Math.imul(h^(h>>>13),1274126177)>>>0;const angle=h/4294967296*Math.PI*2;return [Math.cos(angle),Math.sin(angle)];}function dot(dx,dy,ox,oy){const g=grad(i+dx,j+dy);return g[0]*(ox-dx)+g[1]*(oy-dy);}return clamp(lerp(lerp(dot(0,0,u,v),dot(1,0,u,v),fade(u)),lerp(dot(0,1,u,v),dot(1,1,u,v),fade(u)),fade(v))*1.45,-1,1);},
 fbm(x,y,seed,octaves,persistence=.5){let sum=0,amp=1,total=0;for(let i=0;i<octaves;i++){sum+=rules.noise(x*2**i,y*2**i,seed+i*73)*amp;total+=amp;amp*=persistence;}return sum/total;},
 bsp(depth,seed){const rand=rng(seed),leaves=[],splits=[],corridors=[];function subdivide(box,d){if(!d){const pad=4,room={x:box.x+pad+rand()*2,y:box.y+pad+rand()*2,w:Math.max(5,box.w-2*pad-2),h:Math.max(5,box.h-2*pad-2)};leaves.push(room);return{x:room.x+room.w/2,y:room.y+room.h/2};}let vertical=box.w>=box.h;if(box.w<30)vertical=false;if(box.h<30)vertical=true;const ratio=.38+rand()*.24;if(vertical){const a=box.w*ratio,x=box.x+a;splits.push({x1:x,y1:box.y,x2:x,y2:box.y+box.h});const l=subdivide({...box,w:a},d-1),r=subdivide({...box,x,w:box.w-a},d-1);corridors.push([l,r]);return l;}const a=box.h*ratio,y=box.y+a;splits.push({x1:box.x,y1:y,x2:box.x+box.w,y2:y});const l=subdivide({...box,h:a},d-1),r=subdivide({...box,y,h:box.h-a},d-1);corridors.push([l,r]);return l;}subdivide({x:12,y:10,w:256,h:110},depth);return{leaves,splits,corridors};},
 isolines(values,w,h,threshold){const paths=[];const edges=[[0,1],[1,2],[2,3],[3,0]];for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){const pts=[{x,y},{x:x+1,y},{x:x+1,y:y+1},{x,y:y+1}],val=[values[y*w+x],values[y*w+x+1],values[(y+1)*w+x+1],values[(y+1)*w+x]],cuts=[];for(const [a,b] of edges)if((val[a]<threshold)!==(val[b]<threshold)){const t=(threshold-val[a])/(val[b]-val[a]);cuts.push({x:pts[a].x+(pts[b].x-pts[a].x)*t,y:pts[a].y+(pts[b].y-pts[a].y)*t});}if(cuts.length===2)paths.push([cuts[0],cuts[1]]);else if(cuts.length===4){paths.push([cuts[0],cuts[1]],[cuts[2],cuts[3]]);}}return paths;}
};
const css='.geo-stage{display:grid;grid-template-rows:minmax(75px,1fr) auto auto auto auto;height:100%;width:100%;min-width:0;min-height:0;overflow:hidden;isolation:isolate;background:#142c40;color:#e9f7ff;font:14px/1.35 system-ui,sans-serif}.geo-stage *{box-sizing:border-box;font-size:14px}.geo-visual{min-height:0;min-width:0;padding:6px 10px 3px;display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:3px;overflow:auto;background:radial-gradient(ellipse at 60% 10%,#234b60,#10283b)}.geo-canvas{width:100%;height:112px;max-height:138px;min-height:72px;flex:1 1 90px;touch-action:manipulation;display:block}.geo-canvas[tabindex]{cursor:crosshair}.geo-note{font:14px/1.2 ui-monospace,monospace;text-align:center;color:#d4e9f6;margin:0;overflow-wrap:anywhere}.geo-controls{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;padding:5px 6px;border-top:1px solid #32536a}.geo-stage button{font:600 14px/1.2 system-ui;color:#f0faff;background:#23516c;border:1px solid #7e9eb3;border-radius:7px;min-height:30px;padding:5px 7px;cursor:pointer}.geo-stage button:hover{background:#386781}.geo-stage button:focus-visible,.geo-stage input:focus-visible,.geo-stage [tabindex]:focus-visible{outline:3px solid #f7ce74;outline-offset:2px}.geo-controls [data-geo=reset]{margin-left:auto;min-width:32px}.geo-slider{display:flex;gap:6px;align-items:center;padding:0 9px 4px;min-width:0}.geo-slider span{white-space:nowrap}.geo-slider input{min-width:30px;flex:1;height:24px;accent-color:#81d7bd}.geo-slider output{min-width:36px;text-align:right;font-variant-numeric:tabular-nums}.geo-status{margin:0;padding:3px 8px;background:#1b3d37;color:#cdeade;text-align:center;max-height:41px;overflow:auto}.geo-scope{margin:0;padding:4px 8px;background:#102338;color:#bdd4e5;max-height:42px;overflow:auto;overscroll-behavior:contain}.geo-stage .geo-marker{cursor:move}@media(max-width:390px){.geo-controls button{padding:5px}.geo-slider{padding:0 6px 4px;gap:4px}.geo-visual{padding:5px 6px}}@media(prefers-reduced-motion:reduce){.geo-stage *{animation:none!important;transition:none!important}}html.motion-paused .geo-stage *,html[data-motion=off] .geo-stage *{animation:none!important;transition:none!important}@media(forced-colors:active){.geo-stage button{forced-color-adjust:auto}.geo-canvas{border:1px solid CanvasText}}';
let observer;const active=new Set();
function install(){if(document.getElementById('atlas-geo-v318'))return;const st=document.createElement('style');st.id='atlas-geo-v318';st.textContent=css;document.head.append(st);}
function markup(key,lang='ko'){
 const item=byKey.get(key),p=PARAMETERS[key],a=CONTROLS[key],en=lang==='en';if(!item)throw Error('Unknown geo study '+key);
 return '<div class="geo-stage" data-geo-key="'+key+'" lang="'+(en?'en':'ko')+'"><div class="geo-visual" aria-label="'+esc(item[en?2:3])+'"></div><div class="geo-controls"><button type="button" data-geo="step">'+a[en?1:0]+'</button><button type="button" data-geo="alt">'+a[en?3:2]+'</button><button type="button" data-geo="reset" aria-label="'+(en?'Reset':'초기화')+'" title="'+(en?'Reset':'초기화')+'">↺</button></div><label class="geo-slider"><span>'+p[en?5:4]+'</span><input data-geo-range type="range" min="'+p[0]+'" max="'+p[1]+'" value="'+p[2]+'" step="'+p[3]+'"><output>'+p[2]+p[6]+'</output></label><p class="geo-status" role="status" aria-live="polite">'+(en?'Ready · use the controls':'준비 · 버튼으로 조작하세요')+'</p><p class="geo-scope" tabindex="0">'+SCOPE[key][en?1:0]+'</p></div>';
}
function mount(root,key=root.dataset.geoKey,lang=root.lang||'ko'){
 if(root.__geoStudy)return root.__geoStudy;if(!byKey.has(key))throw Error('Unknown geo study '+key);
 const en=lang==='en',t=(ko,eng)=>en?eng:ko,ac=new AbortController(),q=selector=>root.querySelector(selector),visual=q('.geo-visual'),range=q('[data-geo-range]'),param=PARAMETERS[key];
 let s,disposed=false;
 const svg=(content,label)=>'<svg class="geo-canvas" viewBox="0 0 280 135" role="img" aria-label="'+esc(label)+'">'+content+'</svg>';
 const dot=(x,y,r=4,c='#eff6ff')=>'<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+r+'" fill="'+c+'"/>';
 const path=(points,color='#c6e9f1',width=2,closed=false)=>'<path d="'+points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join('')+(closed?'Z':'')+'" stroke="'+color+'" stroke-width="'+width+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
 const readout=x=>'<p class="geo-note">'+esc(x)+'</p>';
 const rect=(x,y,w,h,fill='#37617c',stroke='#6e94a5')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1"/>';
 const randPoints=(seed,n)=>{const r=rng(seed),p=[];for(let i=0;i<n;i++)p.push({x:18+r()*244,y:13+r()*109});return p;};
 function base(){return {param:param[2],seed:13,actions:0,alt:false,phase:0,points:randPoints(13,16),pointer:{x:90,y:64}};}
 function say(x){q('.geo-status').textContent=x;}
 function mark(){s.actions++;root.dataset.state='changed';root.dataset.revision=String(s.actions);}
 function draw(){
  let content='',desc='';
  const p=s.param,r=rng(s.seed);
  if(key==='geo-voronoi'){
   const sites=randPoints(s.seed,p),nx=35,ny=17,cw=280/nx,ch=135/ny;let cells='';
   for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const pt={x:(x+.5)*cw,y:(y+.5)*ch};const d=sites.map(site=>Math.hypot(pt.x-site.x,pt.y-site.y)),id=d.indexOf(Math.min(...d));cells+=rect(x*cw,y*ch,cw+.1,ch+.1,palette[id%palette.length],palette[id%palette.length]);}
   content=cells+(s.alt?sites.map((pt,i)=>path([pt,{x:140,y:68}], '#d1e2f066',.5)).join(''):'')+sites.map((pt,i)=>dot(pt.x,pt.y,4,'#172d45')).join('');
   desc=t('최근접 영역 ','Nearest-site cells ')+sites.length;
  }else if(key==='geo-perlin'||key==='geo-fbm'){
   const nx=35,ny=17,cw=280/nx,ch=135/ny;let rects='',min=Infinity,max=-Infinity;for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const a=x/nx*p*1.3,b=y/ny*p*1.3,v=key==='geo-fbm'?rules.fbm(a,b,s.seed,p,s.alt?.7:.5):rules.noise(a,b,s.seed);min=Math.min(min,v);max=Math.max(max,v);const light=Math.round(20+(v+1)*28);let color='hsl('+(170+Math.round(v*50))+' 42% '+light+'%)';if(key==='geo-perlin'&&s.alt)color=v>=0?'#9ad8ba':'#27485e';rects+=rect(x*cw,y*ch,cw+.15,ch+.15,color,color);}
   content=rects;desc=t('샘플 범위 ','Sample range ')+min.toFixed(2)+' … '+max.toFixed(2);
  }else if(key==='geo-bsp'){
   const o=rules.bsp(p,s.seed);content=rect(10,8,260,115,'#192d42','#6e94a5')+(s.alt?o.splits.map(a=>'<path d="M'+a.x1+' '+a.y1+'L'+a.x2+' '+a.y2+'" stroke="#d0ab6a" stroke-width="1"/>').join(''):'')+o.corridors.map(pair=>path([{x:pair[0].x,y:pair[0].y},{x:pair[1].x,y:pair[0].y},{x:pair[1].x,y:pair[1].y}],'#9bbac6',5)).join('')+o.leaves.map(a=>rect(a.x,a.y,a.w,a.h,'#326c69','#9de3b5')).join('');
   desc=o.leaves.length+t('개 방 / ',' rooms / ')+o.corridors.length+t('개 연결',' corridors');
  }else if(key==='geo-isoline'){
   const nx=24,ny=12,values=[];for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)values.push(field(x*280/(nx-1),y*135/(ny-1),s.phase));const segs=rules.isolines(values,nx,ny,p/10);
   content=rect(0,0,280,135,'#163a4a','#365b69')+(s.alt?values.map((v,i)=>dot((i%nx)*280/(nx-1),Math.floor(i/nx)*135/(ny-1),1.3,v>=p/10?'#ddbd7e':'#5ba3b7')).join(''):'')+segs.map(seg=>path(seg.map(z=>({x:z.x*280/(nx-1),y:z.y*135/(ny-1)})),'#b8f5d3',2)).join('');
   desc=t('등치선 선분 ','Segments ')+segs.length+' · level '+(p/10).toFixed(1);
  }else if(key==='geo-label'){
   const pts=randPoints(s.seed,14),accepted=[],rejected=[];for(const [i,pt] of pts.entries()){const label={x:clamp(pt.x,2,222),y:clamp(pt.y,16,115),w:45,h:15};const overlaps=accepted.some(r=>!(label.x>r.x+r.w+p||label.x+label.w+p<r.x||label.y>r.y+r.h+p||label.y+label.h+p<r.y));(overlaps?rejected:accepted).push({...label,i});}
   content=pts.map(pt=>dot(pt.x,pt.y,2,'#d5e6ef')).join('')+[...accepted,...(s.alt?rejected:[])].map(b=>rect(b.x,b.y,b.w,b.h,accepted.includes(b)?'#31566b':'#694852',accepted.includes(b)?'#a6d8e2':'#d09f9f')+'<text x="'+(b.x+3)+'" y="'+(b.y+12)+'" font-size="14" fill="#f4f9ff">L'+String(b.i+1).padStart(2,'0')+'</text>').join('');
   desc=accepted.length+t('개 배치 / ',' placed / ')+rejected.length+t('개 충돌',' collisions');
  }else if(key==='geo-cluster'){
   const pts=randPoints(s.seed,18),groups=rules.cluster(pts,p);
   content=(s.alt?pts.map(pt=>dot(pt.x,pt.y,2.5,'#cbdce8')).join(''):'')+groups.map((g,i)=>'<circle cx="'+g.x.toFixed(2)+'" cy="'+g.y.toFixed(2)+'" r="'+(g.n===1?6:clamp(6+g.n*2.1,8,29))+'" fill="'+palette[i%palette.length]+'" stroke="#e5f2ff" stroke-width="1.5"/>'+(g.n>1?'<text x="'+g.x.toFixed(2)+'" y="'+(g.y+5).toFixed(2)+'" text-anchor="middle" font-size="14" font-weight="700" fill="#11263c">'+g.n+'</text>':'')).join('');
   desc=pts.length+t('개 지점 → ',' points → ')+groups.length+t('개 군집',' clusters');
  }else if(key==='geo-fence'){
   const poly=[{x:65,y:25},{x:170,y:14},{x:228,y:70},{x:158,y:116},{x:80,y:95}],inside=rules.inside({x:p,y:s.pointer.y},poly);
   content=path(poly,inside?'#8ce4b7':'#ebb185',3,true)+'<path d="M0 '+s.pointer.y+'H280" stroke="#66899b" stroke-dasharray="4 4"/>'+dot(p,s.pointer.y,8,inside?'#8ce4b7':'#ebb185');
   desc=(inside?t('경계 내부','Inside geofence'):t('경계 외부','Outside geofence'))+' · ('+p+','+Math.round(s.pointer.y)+')';
  }else if(key==='geo-join'){
   const a=[{x:18,y:19},{x:144,y:19},{x:144,y:115},{x:18,y:115}],b=[{x:103+p,y:40},{x:218+p,y:40},{x:218+p,y:125},{x:103+p,y:125}],pts=randPoints(s.seed,16).concat(s.actions>0?Array.from({length:Math.min(5,s.actions)},(_,i)=>({x:120+i*9,y:52+i*10})):[]);
   let both=0;content=path(a,'#71bbb0',2,true)+path(b,'#dfba86',2,true);pts.forEach(pt=>{const x=rules.inside(pt,a),y=rules.inside(pt,b);if(x&&y)both++;content+=dot(pt.x,pt.y,s.alt&&x&&y?6:3,x&&y?'#f2df99':x?'#73caad':y?'#efb285':'#7b98a9');});
   desc=both+t('개 지점이 양쪽 영역에 포함',' points in both polygons');
  }else if(key==='geo-buffer'){
   const x=s.pointer.x,y=s.pointer.y;
   if(s.alt)content='<path d="M'+(x-50)+' '+(y-16)+' L'+(x+50)+' '+(y+16)+'" fill="none" stroke="#7dc2af" stroke-linecap="round" stroke-width="'+(2*p)+'" opacity=".45"/>'+path([{x:x-50,y:y-16},{x:x+50,y:y+16}],'#c5f5ed',2);
   else content='<circle cx="'+x+'" cy="'+y+'" r="'+p+'" fill="#77bfab" opacity=".5" stroke="#bdf0df" stroke-width="3"/>'+dot(x,y,4);
   desc=t('버퍼 거리 ','Buffer radius ')+p+t(' 화면 단위',' display units');
  }else if(key==='geo-symbol'){
   const values=[8,26,65,12,100,39],locations=[{x:39,y:38},{x:110,y:38},{x:194,y:37},{x:64,y:99},{x:147,y:98},{x:234,y:97}],v=s.seed%2?values:values.map((x,i)=>values[(i+3)%6]);let areas=[];
   content=locations.map((pt,i)=>{const radius=s.alt?p*v[i]/100:p*Math.sqrt(v[i]/100);areas.push(radius*radius);return'<circle cx="'+pt.x+'" cy="'+pt.y+'" r="'+radius.toFixed(2)+'" fill="'+palette[i]+'" stroke="#e3f3f9" stroke-width="1.3" opacity=".88"/>';}).join('');
   desc=(s.alt?t('반지름 비례(비교용)','Radius-scaled comparison'):t('면적 비례','Area-proportional'))+' · '+v.join('/');
  }else if(key==='geo-general'){
   const r=rng(s.seed),points=Array.from({length:26},(_,i)=>({x:8+i*10.5,y:65+Math.sin(i*.52)*27+(r()-.5)*15})),simple=rules.simplify(points,p);
   content=(s.alt?path(points,'#6b9fac',1.5):'')+path(simple,'#b8efd4',3)+simple.map(pt=>dot(pt.x,pt.y,2,'#e5fbf3')).join('');
   desc=points.length+' → '+simple.length+t('개 꼭짓점',' vertices');
  }
  visual.innerHTML=svg(content,t('지도·절차 생성 시연','Map and procedural demo'))+readout(desc);
  range.value=String(s.param);q('output').textContent=s.param+param[6];root.dataset.label=desc;root.dataset.mode=s.alt?'alternative':'primary';
 }
 function act(type){
  if(type==='reset'){s=base();root.dataset.state='ready';root.dataset.revision='0';draw();say(t('초기화했습니다.','Reset.'));return;}
  mark();
  if(type==='alt'){
   s.alt=!s.alt;if(key==='geo-fence'){s.param=s.param>140?30:235;}else if(key==='geo-label')s.seed+=2;
  }else if(type==='step'){
   if(key==='geo-fence')s.param=s.param>=255?25:s.param+32;
   else if(key==='geo-join'){s.actions=Math.min(5,s.actions);}
   else if(key==='geo-buffer')s.pointer={x:45+rng(s.seed+1)()*190,y:25+rng(s.seed+3)()*85};
   else if(key==='geo-isoline')s.phase+=.4;
   else s.seed+=1;
  }
  draw();say(visual.querySelector('.geo-note')?.textContent||t('결과 갱신','Updated'));
 }
 root.addEventListener('click',event=>{const b=event.target.closest('[data-geo]');if(!b||!root.contains(b))return;event.stopPropagation();act(b.dataset.geo);},{signal:ac.signal});
 range.addEventListener('input',()=>{s.param=clamp(Number(range.value),param[0],param[1]);mark();draw();say(param[en?5:4]+' '+s.param);},{signal:ac.signal});
 if(['geo-fence','geo-buffer'].includes(key)){
  visual.tabIndex=0;visual.setAttribute('aria-label',t('방향키로 지점 이동, 영역 클릭 가능','Use arrows or click to move point'));
  visual.addEventListener('pointerdown',event=>{const target=event.target.closest('svg');if(!target)return;const matrix=target.getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());if(key==='geo-fence'){s.param=clamp(Math.round(point.x),8,272);s.pointer.y=clamp(point.y,8,127);}else s.pointer={x:clamp(point.x,8,272),y:clamp(point.y,8,127)};mark();draw();say(q('.geo-note').textContent);},{signal:ac.signal});
  visual.addEventListener('keydown',event=>{if(event.target!==visual||!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();event.stopPropagation();const dx=event.key==='ArrowLeft'?-8:event.key==='ArrowRight'?8:0,dy=event.key==='ArrowUp'?-8:event.key==='ArrowDown'?8:0;if(key==='geo-fence'){s.param=clamp(s.param+dx,8,272);s.pointer.y=clamp(s.pointer.y+dy,8,127);}else{s.pointer.x=clamp(s.pointer.x+dx,8,272);s.pointer.y=clamp(s.pointer.y+dy,8,127);}mark();draw();say(q('.geo-note').textContent);},{signal:ac.signal});
 }
 act('reset');
 const study={root,key,snapshot:()=>JSON.parse(JSON.stringify(s)),act,dispose(){disposed=true;ac.abort();active.delete(study);delete root.__geoStudy;}};root.__geoStudy=study;active.add(study);
 if(!observer&&typeof MutationObserver==='function'){observer=new MutationObserver(()=>{for(const item of active)if(!item.root.isConnected)item.dispose();});observer.observe(document.documentElement,{childList:true,subtree:true});}
 return study;
}
function code(entry,lang='ko'){
 const item=byId.get(entry?.id);if(!item)throw Error('Unknown geo example');
 const en=lang==='en';
 return '<!doctype html><html lang="'+(en?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(item[en?2:3])+' — ATLAS</title><style>body{margin:0;padding:20px;background:#e8edf4;color:#19364a;font:16px/1.5 system-ui}main{max-width:660px;margin:auto}h1{font-size:24px}.demo{height:360px;border:1px solid #9bb4c6;border-radius:14px;overflow:hidden}p{font-size:14px}</style></head><body><main><h1>'+esc(item[en?2:3])+'</h1><div class="demo" id="demo"></div><p>'+esc(SCOPE[item[1]][en?1:0])+'</p></main><script>('+initAtlasGeoLab.toString()+')(window);const host=document.getElementById("demo");host.innerHTML=AtlasGeoLab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasGeoLab.mount(host.firstElementChild);addEventListener("pagehide",()=>study.dispose(),{once:true});</'+'script></body></html>';
}
function attach(){
 const A=global.Atlas32;if(!A||A.__geo318)return false;A.__geo318=true;
 const prior={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};
 A.recipe=e=>byId.get(e?.id)?.[1]||prior.recipe(e);
 A.art=(e,lang)=>{const item=byId.get(e?.id);return item?{html:'<div class="scene scene-geo-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',specific:true,previewType:lang==='en'?'Interactive planar map study':'직접 조작하는 지도·GIS 예제'}:prior.art(e,lang);};
 A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prior.markup(key,lang);
 A.mount=(scope=document)=>{prior.mount(scope);const roots=scope.matches?.('.geo-stage')?[scope]:[...scope.querySelectorAll('.geo-stage')];roots.forEach(el=>mount(el));};
 A.code=(e,lang)=>byId.has(e?.id)?code(e,lang):prior.code(e,lang);
 return true;
}
install();global.AtlasGeoLab={ITEMS,PARAMETERS,CONTROLS,SCOPE,byId,byKey,rules,markup,mount,code,attach,css,version:'3.18.0',activeCount:()=>active.size};attach();
})(window);
