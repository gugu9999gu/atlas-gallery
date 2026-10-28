/* Top-down level-design studies and actual small-grid search implementations. */
function wxSearch(kind){
 const W=11,H=6,start=11,goal=54,blocked=new Set([4,15,26,37,48,30,31,32]),cost=n=>[17,18,19,20,21,28,29,39,40,41,42,43].includes(n)?4:1;
 if(kind==='connectivity')for(let r=0;r<H;r++)blocked.add(r*W+7);
 const dist=new Map([[start,0]]),parent=new Map(),seen=new Set(),visit=[],open=[start];
 const heuristic=n=>Math.abs(n%W-goal%W)+Math.abs(Math.floor(n/W)-Math.floor(goal/W));
 while(open.length){if(!['bfs','flood','connectivity','reachable'].includes(kind))open.sort((a,b)=>dist.get(a)+(kind==='astar'?heuristic(a):0)-dist.get(b)-(kind==='astar'?heuristic(b):0));const n=open.shift();if(seen.has(n))continue;seen.add(n);visit.push(n);if(n===goal&&!['flood','connectivity','reachable'].includes(kind))break;
  for(const m of [n-1,n+1,n-W,n+W]){if(m<0||m>=W*H||blocked.has(m)||seen.has(m)||Math.abs(m%W-n%W)+Math.abs(Math.floor(m/W)-Math.floor(n/W))!==1)continue;const d=dist.get(n)+(['bfs','flood','connectivity','reachable'].includes(kind)?1:cost(m));if(d<(dist.get(m)??Infinity)){dist.set(m,d);parent.set(m,n);open.push(m)}}
 }
 const route=[];let at=goal;while(parent.has(at)){route.unshift(at);at=parent.get(at)}if(route.length)route.unshift(start);
 return {W,H,start,goal,blocked,cost,visit,route};
}
function waveMap(k,t){const C=PC;let b=rect(25,26,250,130,'#f2f6fb',7,'stroke="#d9e2ef"');const top=p=>path(p,C.blue,4);const node=(x,y,s,c=C.blue)=>circ(x,y,12,c)+tx(x,y+3,s,9,'white','middle',700);
 if(['astar','dijkstra','bfs','flood','connectivity','reachable'].includes(k)){
  const d=wxSearch(k),limit=Math.max(1,Math.floor(d.visit.length*t)),visited=new Set(d.visit.slice(0,limit));
  for(let i=0;i<66;i++){const x=35+i%11*21,y=29+Math.floor(i/11)*21,ob=d.blocked.has(i),cost=d.cost(i),color=ob?'#53667d':visited.has(i)?'#afc5f9':cost>1?'#f5e2bd':'#e0e9f5';b+=rect(x,y,19,19,color,2);if(cost>1&&!ob&&k!=='bfs')b+=tx(x+9,y+13,'4',8,C.amber,'middle');}
  const points=d.route.map(i=>[44.5+i%11*21,38.5+Math.floor(i/11)*21]);if(t>.84)b+=path(poly(points),C.teal,3);
  b+=node(44.5+d.start%11*21,38.5+Math.floor(d.start/11)*21,'S',C.teal)+node(44.5+d.goal%11*21,38.5+Math.floor(d.goal/11)*21,'G',C.pink);
  if(k==='connectivity')b+=ln(231,27,231,154,C.pink,2,'stroke-dasharray="3 3"');if(k==='reachable')for(const i of d.visit){const x=35+i%11*21,y=29+Math.floor(i/11)*21;b+=rect(x,y,19,19,'none',2,'stroke="#1cae9b" stroke-width="1.4"');}
  return b+wxCaption(k==='astar'?'priority = cost so far + heuristic':k==='dijkstra'?'priority = accumulated cost':k==='bfs'?'FIFO queue · equal-cost assumption':k==='flood'?'expand connected cells':'reachability study');
 }
 if(['critical','golden','optional','loop','shortcut','choke','flank','sightline','los','landmark','vista','reveal','gating','softgate','hardgate','hub','breadcrumb','cover','arena','safe','backtrack','drop','softlock','kill','navmesh','offmesh'].includes(k)){
  const rooms=[[44,44,58,38],[135,43,60,38],[213,103,44,34],[48,111,55,27]];rooms.forEach(([x,y,w,h])=>b+=rect(x,y,w,h,'#d7e2f0',3,'stroke="#a5b7ce"'));
  if(k==='hub'){b=rect(25,26,250,130,'#f2f6fb',7);for(let i=0;i<5;i++){const a=i*Math.PI*2/5,x=150+90*Math.cos(a),y=91+48*Math.sin(a);b+=ln(150,91,x,y,C.blue,5)+node(x,y,String(i+1));}return b+node(150,91,'H',C.teal)+wxCaption('central hub with independent spokes');}
  b+=path('M72 62L166 62L166 121L234 121','#b3c4dc',12);
  if(['critical','golden','optional','loop','shortcut','choke','flank','backtrack','breadcrumb','gating','hardgate','softgate','softlock'].includes(k)){
   b+=path('M72 62L166 62L166 121L234 121',k==='golden'?C.amber:C.blue,3);
   if(k==='optional')b+=path('M166 92L76 92L76 125',C.teal,3,'none','stroke-dasharray="4 3"')+node(76,125,'?');
   if(k==='loop')b+=path('M234 121L234 63L72 63',C.teal,3)+wxArrow(231,65,198,65,C.teal);
   if(k==='shortcut')b+=path('M72 62L234 121',C.teal,3,'none','stroke-dasharray="4 3"')+tx(108,113,'unlock',8,C.teal);
   if(k==='choke')b+=rect(145,80,15,23,'#53667d',1)+rect(172,80,15,23,'#53667d',1)+wxArrow(164,76,164,105,C.pink,2);
   if(k==='flank')b+=path('M72 62L72 137L234 137L234 121',C.teal,3)+wxArrow(217,137,232,121,C.teal);
   if(k==='backtrack')b+=wxArrow(155,73,108,73,C.pink,3)+wxArrow(154,114,154,83,C.pink,3);
   if(k==='breadcrumb')for(let i=0;i<5;i++)b+=circ(100+i*12,62,3,C.amber);
   if(['gating','hardgate','softgate','softlock'].includes(k)){b+=rect(156,85,20,10,k==='softgate'?C.amber:C.pink,1);if(k==='hardgate')b+=rect(160,70,12,11,C.ink,2)+path('M163 70V66A3 3 0 0 1 169 66V70',C.ink,2);if(k==='softgate')b+=tx(192,94,'Lv. 20',9,C.amber);if(k==='gating')b+=circ(124,120,7,C.amber)+ln(124,120,157,95,C.amber,1,'stroke-dasharray="3 3"');if(k==='softlock')b+=rect(129,112,19,17,C.pink,2)+tx(138,124,'×',11,'white','middle');}
  }else if(k==='sightline'||k==='los'){
   b+=path('M70 62L240 45L239 138Z','none',0,'#e8c99166')+wxArrow(70,62,k==='los'?148:235,k==='los'?91:124,C.amber,2);if(k==='los')b+=rect(145,66,15,65,C.ink,1)+path('M161 93L235 123',C.pink,2,'none','stroke-dasharray="3 3"');}
  else if(['landmark','vista','reveal'].includes(k)){b+=path('M224 45L239 73H209Z',C.purple,2,C.purple)+wxArrow(79,74,221,55,C.amber,2);if(k==='vista')b+=circ(79,74,20,'none','stroke="#1cae9b" stroke-width="2"');if(k==='reveal')b+=path('M114 27V97H183',C.ink,12);}
  else if(k==='cover'||k==='arena'){for(let i=0;i<4;i++)b+=rect(94+i%2*88,73+Math.floor(i/2)*39,25,11,C.ink,2);if(k==='arena')b+=rect(35,35,230,111,'none',4,'stroke="#6174ef" stroke-width="3"');}
  else if(k==='safe')b+=rect(44,107,64,35,'#b1e4d6',5)+tx(76,129,'SAFE',10,C.teal,'middle');
  else if(k==='drop')b+=rect(125,30,18,117,C.ink,1)+wxArrow(111,86,173,116,C.amber,4)+tx(146,149,'one-way',9,C.pink,'middle');
  else if(k==='kill')b+=rect(116,85,91,49,'#eeb5c0',4)+tx(162,113,'KILL VOLUME',9,C.pink,'middle');
  else if(k==='navmesh'){b=rect(25,26,250,130,'#eaf5f1',7);const p=[[38,39],[133,38],[260,42],[259,144],[163,146],[38,143],[121,93],[186,89]];for(const a of [[0,1,6],[1,2,7],[1,7,6],[2,3,7],[3,4,7],[4,6,7],[4,5,6],[5,0,6]])b+=path(poly(a.map(i=>p[i]))+'Z',C.teal,1,'#b7dfd0');}
  else if(k==='offmesh')b+=rect(109,29,23,122,'white',0)+path('M89 105Q127 31 156 106',C.teal,3,'none','stroke-dasharray="5 3"')+node(89,105,'A')+node(156,106,'B');
  b+=node(72,62,'S',C.teal)+node(234,121,'G',C.pink);
  return b+wxCaption(k==='critical'?'required route to the objective':k==='golden'?'recommended experience · may overlap critical path':k==='sightline'?'designed visual corridor':k==='los'?'visibility tested against occlusion':'spatial layout · not a generated game level');
 }
 if(['tileset','tilemap','autotile','collisionlayer','objectlayer','hex','iso','chunk','partition','streaming','scatter','foliage','poisson','heightmap','splat','modular','metrics','blockout','whitebox'].includes(k)){
  if(k==='hex'){for(let r=0;r<4;r++)for(let c=0;c<7;c++){const x=49+c*(Math.sqrt(3)*16)+(r%2)*Math.sqrt(3)*8,y=47+r*24;b+=path(poly(Array.from({length:6},(_,i)=>[x+16*Math.cos(Math.PI/3*i+Math.PI/6),y+16*Math.sin(Math.PI/3*i+Math.PI/6)]))+'Z',C.blue,1,'#d2e0f6')}return b;}
  if(k==='iso'){for(let r=0;r<5;r++)for(let c=0;c<5;c++){const x=150+(c-r)*23,y=39+(c+r)*13;b+=path(`M${x} ${y}l23 13-23 13-23-13Z`,C.blue,1,'#d2e0f6')}return b;}
  if(['scatter','foliage','poisson'].includes(k)){const pts=[];for(let i=0;i<120;i++){const p=[40+rand(81,i)*220,38+rand(99,i)*109];if(k==='poisson'&&pts.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<24))continue;pts.push(p);if(pts.length>(k==='poisson'?35:45))break}for(const [x,y]of pts)b+=k==='foliage'?path(`M${x} ${y-6}l6 12h-12Z`,C.teal,1,C.teal):circ(x,y,3,C.teal);if(k==='poisson')b+=circ(pts[0][0],pts[0][1],24,'none','stroke="#e9a343" stroke-dasharray="3 3"');return b+wxCaption(k==='poisson'?'minimum separation is enforced':'deterministic spatial samples');}
  const small=k==='tileset',cols=small?4:10,rows=small?2:5,size=small?35:22,x0=small?67:39,y0=small?51:35;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const water=(r+c)%6<2,wall=c===4&&r!==3;let color=k==='whitebox'?'#fff':k==='blockout'?'#9eafc2':k==='heightmap'?`hsl(210 5% ${25+65*(Math.sin(c*.6)*Math.sin(r*.8)+1)/2}%)`:k==='splat'?['#7dba99','#a4bd89','#c1ae8d'][(c+r)%3]:water?'#b9d2ee':'#bcd9ca';if(k==='collisionlayer')color=wall?C.pink:'#e5ebf4';b+=rect(x0+c*(size+1),y0+r*(size+1),size,size,color,small?4:0,'stroke="#fff" stroke-width=".5"');if(k==='objectlayer'&&(r+c)%7===1)b+=circ(x0+c*(size+1)+10,y0+r*(size+1)+10,5,C.purple);if(k==='tileset')b+=tx(x0+c*36+17,y0+r*36+22,String(r*4+c),11,C.ink,'middle');}
  if(['chunk','partition','streaming'].includes(k)){for(let i=0;i<3;i++)b+=ln(38+i*77,33,38+i*77,149,C.ink,2)+ln(38,33+i*57,268,33+i*57,C.ink,2);if(k==='chunk')b+=rect(39,35,76,56,'#6174ef55',0);if(k==='streaming')b+=circ(148,90,40,'none','stroke="#e9a343" stroke-width="3"')+node(148,90,'P',C.amber);}
  if(k==='metrics')b+=wxArrow(43,138,249,138,C.pink,1)+tx(150,132,'2.4 m clearance (sample)',8,C.ink,'middle');
  if(k==='modular')b+=rect(67,50,47,47,'none',0,'stroke="#9474dc" stroke-width="4"')+wxArrow(116,73,163,73,C.purple);
  if(k==='autotile')b+=rect(108,80,46,46,'none',1,'stroke="#e9a343" stroke-width="3"');
  return b+wxCaption(k==='tileset'?'source tile palette':k==='tilemap'?'placed tile instances':k==='collisionlayer'?'collision flags, separate from artwork':'layout / terrain schematic');
 }
 return null;
}
waveAdd('map',`
Critical Path|critical|목표 달성에 필수인 진행 경로를 표시합니다.|The required route to complete the objective.
Golden Path|golden|권장 경험 경로이며 핵심 경로와 겹칠 수 있습니다.|The recommended experience may overlap the critical path.
Optional Path|optional|필수 진행에서 벗어나는 선택 분기입니다.|An optional branch leaves the required route.
Looping Path|loop|다시 연결되는 순환 동선입니다.|A route loops back to an earlier location.
Shortcut|shortcut|기존 경로를 줄이는 연결입니다.|A connection shortens an existing route.
Chokepoint|choke|이동 폭이 좁아지는 병목입니다.|A narrow passage constrains movement.
Flanking Route|flank|정면 외 방향으로 접근하는 우회로입니다.|An alternate route enables a side approach.
Sightline|sightline|레벨에서 의도한 긴 시각 통로입니다.|A deliberate visual corridor in a level.
Line of Sight|los|장애물로 가려지는지 확인하는 시야 검사입니다.|Visibility is tested against occluding obstacles.
Landmark|landmark|위치를 인식하게 하는 시각적 기준점입니다.|A recognizable landmark anchors orientation.
Vista|vista|넓은 장면을 조망하는 관측 지점입니다.|A viewpoint reveals an expansive scene.
Reveal|reveal|가려진 공간을 이동 후 드러냅니다.|Movement reveals a previously occluded space.
Gating|gating|조건 충족 여부로 경로를 제한합니다.|Access is restricted until a condition is met.
Soft Gate|softgate|난이도 등의 간접 조건으로 진행을 억제합니다.|Difficulty or other soft constraints discourage entry.
Hard Gate|hardgate|물리적·명시적 조건으로 통과를 차단합니다.|An explicit barrier blocks passage.
Hub and Spoke|hub|중앙 허브에서 여러 경로가 분기합니다.|Independent routes branch from a central hub.
Breadcrumbing|breadcrumb|연속적인 작은 단서로 진행을 유도합니다.|A sequence of small cues guides progression.
Cover Placement|cover|전투 중 몸을 숨길 장애물을 배치합니다.|Obstacles provide cover during combat.
Combat Arena|arena|전투 경계와 엄폐가 있는 공간입니다.|A bounded encounter space contains cover.
Safe Room|safe|위험에서 분리한 안전 구역입니다.|A safe area is separated from danger.
Backtracking|backtrack|이미 방문한 공간을 다시 지나갑니다.|The route revisits an earlier location.
One-way Drop|drop|되돌아갈 수 없는 높이 차 연결입니다.|A drop connects areas in one direction only.
Softlock|softlock|작동은 하지만 목표로 진행할 수 없습니다.|The game runs but the objective is no longer reachable.
Kill Volume|kill|진입 시 사망 처리하는 공간 영역입니다.|Entering the marked volume causes death.
Navigation Mesh|navmesh|걸을 수 있는 공간을 다각형으로 나눕니다.|Walkable space is represented by connected polygons.
Off-mesh Link|offmesh|서로 떨어진 이동 영역을 특수 행동으로 연결합니다.|A special traversal connects separate navigation regions.
A* Search|astar|실제 작은 격자에서 누적 비용과 휴리스틱을 사용합니다.|A real small-grid search uses cost plus a heuristic.
Dijkstra Algorithm|dijkstra|실제 작은 격자에서 누적 비용 순으로 탐색합니다.|A real small-grid search expands by accumulated cost.
Breadth-first Search|bfs|동일 비용을 가정하고 큐 순서대로 확장합니다.|A FIFO search assumes equal edge costs.
Flood Fill|flood|연결된 셀을 순서대로 채우는 예시입니다.|Connected cells are filled progressively.
Connectivity Check|connectivity|공간 분리와 연결 여부를 확인하는 예시입니다.|A schematic checks separation and connectivity.
Reachability|reachable|시작점에서 갈 수 있는 범위를 표시합니다.|The reachable region is marked from the starting point.
Tileset|tileset|맵에 놓기 전의 원본 타일 모음입니다.|A source palette of tiles before placement.
Tilemap|tilemap|타일을 격자 위치에 배치한 결과입니다.|Tile instances are placed at grid positions.
Autotiling|autotile|주변 연결 상태에 맞춰 타일을 선택합니다.|Tiles are selected according to neighboring connections.
Collision Layer|collisionlayer|시각 타일과 별도인 충돌 정보를 표시합니다.|Collision information is separate from visual tiles.
Object Layer|objectlayer|격자 타일 위에 독립된 객체를 배치합니다.|Independent objects are placed over the tile layer.
Hex Grid|hex|여섯 이웃 방향을 갖는 육각 격자입니다.|Hexagonal cells have six neighbor directions.
Isometric Grid|iso|비스듬한 평행투영 격자입니다.|A grid is shown in an isometric projection.
Chunk|chunk|넓은 맵을 나눈 한 구획입니다.|One chunk of a larger subdivided map.
World Partition|partition|월드를 여러 관리 구역으로 나눕니다.|The world is divided into management regions.
World Streaming|streaming|플레이어 주변의 영역을 선택해 로드합니다.|Regions near the player are selected for loading.
Scatter|scatter|오브젝트를 공간에 흩어 배치합니다.|Objects are distributed over an area.
Foliage|foliage|식생 오브젝트를 반복 배치합니다.|Vegetation instances are distributed in a scene.
Poisson Disk Sampling|poisson|결정적 표본 사이의 최소 거리를 검사합니다.|Deterministic samples enforce a minimum separation.
Heightmap|heightmap|높이 정보를 밝기값으로 인코딩합니다.|Height is encoded as grayscale values.
Splat Map|splat|지형 표면의 혼합 가중치 예시입니다.|A schematic of terrain surface blend weights.
Modular Kit|modular|반복 사용 가능한 공간 부품입니다.|Reusable pieces form a modular environment.
Level Metrics|metrics|이동에 필요한 치수를 기준으로 공간을 잡습니다.|Traversal dimensions constrain the layout.
Blockout / Graybox|blockout|장식 전 단순한 덩어리로 공간을 검토합니다.|Simple gray masses test a level before decoration.
Whitebox|whitebox|밝은 단순 형상으로 공간을 검토합니다.|Simple light-colored geometry tests the space.
`,waveMap,{interactive:true});
