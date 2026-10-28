/* Schematic geometry previews. These SVG diagrams are not advertised as WebGL renders. */
function waveModel(k,t){let b='';const C=PC;
 if(['mesh','vertex','edge','face','polygon','tris','topology','edgeloop','normal','bevel','extrude','inset','subdivision','boolean','decimate','nonmanifold','localworld'].includes(k)){
  b=wxCube(150,93,47,k==='mesh'||k==='topology'||k==='edge'||k==='vertex'?'wire':'solid');
  if(k==='vertex')b+=wxDots([[150,46],[197,69.5],[197,116.5],[150,140],[103,116.5],[103,69.5],[150,93]],C.pink,5);
  if(k==='edge')b+=ln(150,93,197,69.5,C.pink,5)+ln(197,69.5,197,116.5,C.pink,5);
  if(k==='face')b+=path('M150 93L197 69.5V116.5L150 140Z',C.pink,2,'#ecacc1');
  if(k==='polygon')b=path('M82 53L178 36L232 94L177 144L74 129Z',C.blue,3,'#cad8f6')+wxDots([[82,53],[178,36],[232,94],[177,144],[74,129]],C.pink,4);
  if(k==='tris')b=path('M34 126L70 51L108 126Z',C.blue,2,'#cedafb')+rect(126,65,60,60,'#bbe0d7',0,'stroke="#1cae9b" stroke-width="2"')+path('M226 48L266 73L255 124L214 131L199 88Z',C.purple,2,'#dbd1f1');
  if(k==='topology')b+=ln(103,69.5,150,140,C.teal,2)+ln(150,46,197,116.5,C.teal,2);
  if(k==='edgeloop')b+=path('M103 94L150 116L197 94L150 70Z',C.pink,4);
  if(k==='normal')b+=wxArrow(173,105,231,105,C.pink,3)+wxArrow(150,70,150,29,C.teal,3)+wxArrow(125,103,81,121,C.amber,3);
  if(k==='bevel')b=path('M119 51L174 51L194 70V121L174 140H119L99 121V70Z',C.blue,2,'#c6d5f5')+path('M119 65H174L182 73V118L174 127H119L111 118V73Z',C.teal,2,'#e3ebfa');
  if(k==='extrude')b+=path(`M150 93L197 69.5L${197+t*50} ${69.5-t*21}L${150+t*50} ${93-t*21}Z`,C.pink,2,'#e5bfd9')+wxArrow(215,98,215+t*35,98-t*26,C.pink,2);
  if(k==='inset')b+=path('M158 97L188 82V112L158 128Z',C.pink,3,'#d1dcf7');
  if(k==='subdivision'){b=rect(45,55,76,76,'#a8bce8',0,'stroke="#6174ef" stroke-width="2"')+wxArrow(131,93,166,93,C.teal)+rect(184,55,76,76,'#c0d4f0',25,'stroke="#6174ef" stroke-width="2"');}
  if(k==='boolean')b=circ(128,93,45,'#b9c9f2')+rect(135,56,65,74,'#e2b8cb',2)+path('M135 49V137',C.pink,2,'none','stroke-dasharray="4 3"')+tx(150,165,'union / difference / intersection',9,C.muted,'middle');
  if(k==='decimate'){b=path(poly(Array.from({length:12},(_,i)=>[89+43*Math.cos(i*Math.PI/6),93+43*Math.sin(i*Math.PI/6)]))+'Z',C.blue,2,'#d0dafa')+wxArrow(142,93,166,93,C.teal)+path('M212 47L256 124H168Z',C.blue,2,'#d0dafa');}
  if(k==='nonmanifold')b+=path('M150 93L150 140L221 153Z',C.pink,2,'#ebb3c9')+circ(150,117,6,C.pink);
  if(k==='localworld')b+=wxArrow(70,125,70,77,C.teal,2)+wxArrow(70,125,110,125,C.pink,2)+wxArrow(150,93,183,57,C.teal,2)+wxArrow(150,93,184,115,C.pink,2);
  return b+wxCaption(k==='vertex'?'points':k==='edge'?'line segments between vertices':k==='face'?'surface bounded by edges':k==='normal'?'directions perpendicular to faces':'geometry schematic');
 }
 if(['uv','unwrap','island','seam','density','trim','udim','mipmap','normalmap','bump','displacement','roughness','metallic','albedo','ao','emission','transmission','fov','clip','frustum','occlusion','backface','depth','orbit','pan','dolly'].includes(k)){
  if(['uv','unwrap','island','seam','density','trim','udim','mipmap','normalmap'].includes(k)){
   if(k==='mipmap'){[1,.72,.5,.3,.15].forEach((s,i)=>{let z=60*s;b+=rect(32+i*51,95-z/2,z,z,i%2?C.teal:C.blue,0)+tx(32+i*51+z/2,143,'L'+i,9,C.muted,'middle')});return b+wxCaption('progressively smaller texture levels');}
   if(k==='seam')return wxCube()+path('M150 44L196 67V115L150 138',C.pink,4)+wxCaption('cut edges for unwrapping');
   if(k==='unwrap'){b=wxCube(68,91,30)+wxArrow(106,91,140,91,C.teal);[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]].forEach(([x,y])=>b+=rect(151+x*25,51+y*25,24,24,'#c7d7f7',0,'stroke="#6174ef"'));return b+wxCaption('3D surface → 2D net');}
   for(let r=0;r<4;r++)for(let c=0;c<7;c++){let x=41+c*31,y=36+r*29,fill=k==='normalmap'?`rgb(${120+c*8},${110+r*12},245)`:k==='udim'?(r+c)%2?'#cad8f3':'#e5ecf7':(r+c)%2?'#afc5ed':'#eef3fc';b+=rect(x,y,30,28,fill,0);if(k==='udim')b+=tx(x+15,y+18,String(1001+r*10+c),7,C.ink,'middle');}
   if(k==='uv')return wxCube(72,90,35)+wxArrow(116,89,159,89,C.teal)+rect(173,48,90,90,'#d5e2f6',0,'stroke="#6174ef"')+wxDots([[177,132],[257,132],[257,52],[177,52]],C.pink,4)+ln(177,132,257,52,C.blue,2)+tx(177,145,'U →',10,C.ink)+tx(264,60,'V',10,C.ink)+wxCaption('surface vertex ↔ texture coordinate');
   if(k==='island')b+=path('M63 60L132 48L139 104L76 123Z',C.pink,2,'#edb2cd66')+path('M166 51L231 68L199 128Z',C.teal,2,'#8acebc55');
   if(k==='density')b+=rect(43,39,71,48,'none',0,'stroke="#d86b8e" stroke-width="3"')+rect(160,40,94,94,'none',0,'stroke="#1cae9b" stroke-width="3"');
   if(k==='trim')for(let i=0;i<4;i++)b+=rect(39,37+i*28,219,22,palette[i],0);
   return b+wxCaption(k==='udim'?'multiple numbered UV tiles':k==='normalmap'?'RGB encodes surface directions':k==='island'?'separate connected UV regions':'texture-coordinate study');
  }
  if(['fov','clip','frustum','occlusion','backface','depth','orbit','pan','dolly'].includes(k)){
   b=wxCube(166,91,30)+rect(38,81,27,22,C.ink,3);
   if(k==='orbit')b+=`<ellipse cx="166" cy="100" rx="90" ry="40" fill="none" stroke="${C.blue}" stroke-width="2"/>`+circ(166+90*Math.cos(t*6.28),100+40*Math.sin(t*6.28),7,C.pink);
   else if(k==='pan')b+=wxArrow(45,141,111,141,C.pink,3)+wxArrow(139,141,205,141,C.pink,3);
   else if(k==='dolly')b+=wxArrow(72,91,124,91,C.pink,4)+wxCube(231,94,15+t*17);
   else{b+=path(`M65 92L245 ${k==='fov'?92-(20+t*40):37}L245 ${k==='fov'?92+(20+t*40):148}Z`,C.blue,2,'#6174ef11');if(k==='clip')b+=ln(97,75,97,109,C.pink,3)+ln(229,42,229,140,C.pink,3);if(k==='frustum')b+=rect(122,37,21,20,C.teal,2)+rect(219,29,21,20,C.pink,2);if(k==='occlusion')b+=rect(122,50,17,87,C.ink,2)+path('M141 83L191 83V110H141Z',C.pink,2,'none','stroke-dasharray="4 3"');if(k==='backface')b+=wxArrow(179,101,227,118,C.pink,2);if(k==='depth')b+=tx(120,147,'near 0',8,C.ink)+tx(230,159,'far 1',8,C.muted);}
   return b+wxCaption('camera / visibility schematic');
  }
  if(k==='displacement')return path('M44 121L60 109L77 126L94 96L111 121L130 88L148 119L167 101L189 122L215 96L254 121',C.blue,3)+ln(40,135,260,135,C.grid,2)+wxCaption('geometry and silhouette change');
  if(k==='bump')return rect(47,61,207,68,'#a9bddf',0)+[0,1,2,3,4,5].map(i=>path(`M${53+i*33} 108q12 -32 24 0`,C.blue,3)).join('')+wxCaption('shading detail · silhouette unchanged');
  const uid='wxmat-'+k;const stops=k==='albedo'?'<stop stop-color="#7399d6"/><stop offset="1" stop-color="#7399d6"/>':k==='roughness'?'<stop stop-color="#eef6ff"/><stop offset=".55" stop-color="#7a97bf"/><stop offset="1" stop-color="#364b6e"/>':'<stop stop-color="#ffffff"/><stop offset=".18" stop-color="#b2d2f4"/><stop offset=".3" stop-color="#3e5d87"/><stop offset=".8" stop-color="#9bb4d4"/><stop offset="1" stop-color="#2e4265"/>';
  b=`<defs><radialGradient id="${uid}" cx="35%" cy="28%">${stops}</radialGradient></defs>`;
  if(k==='ao')b+=`<ellipse cx="150" cy="137" rx="54" ry="9" fill="#536c9277"/>`;
  if(k==='transmission')b+=rect(89,70,125,38,C.teal,2);
  b+=circ(150,91,43,`url(#${uid})`,`opacity="${k==='transmission'?.45:1}"`);
  if(k==='emission')b+=circ(150,91,48,'none','stroke="#9cdcf2" stroke-width="7" opacity=".4"');
  return b+wxCaption(k==='roughness'?'broad highlight · rough surface':k==='metallic'?'conductor-like colored reflection':k==='albedo'?'base color without lighting':'material-property illustration');
 }
 return null;
}
waveAdd('model',`
Mesh|mesh|정점·모서리·면으로 구성한 표면 구조입니다.|A surface structure built from vertices, edges and faces.
Vertex|vertex|형태를 구성하는 점을 강조합니다.|Points forming the geometry are highlighted.
Edge|edge|정점 사이의 모서리를 강조합니다.|Edges connecting vertices are highlighted.
Face|face|모서리로 둘러싸인 면을 강조합니다.|A bounded surface face is highlighted.
Polygon|polygon|여러 정점으로 닫힌 다각형입니다.|Multiple vertices form a closed polygon.
Triangle / Quad / N-gon|tris|정점 수에 따른 다각형 차이입니다.|Polygons differ by their number of vertices.
Topology|topology|정점·모서리 연결 구조를 표시합니다.|The connectivity of vertices and edges is shown.
Edge Loop|edgeloop|연속해서 이어지는 모서리 띠입니다.|A continuous sequence of connected edges forms a loop.
Surface Normal|normal|면에 수직인 방향을 표시합니다.|Directions perpendicular to surfaces are shown.
Bevel|bevel|날카로운 모서리를 잘라 완화합니다.|Sharp edges are replaced by beveled surfaces.
Extrude|extrude|면을 이동하며 새 측면을 생성합니다.|A face is extended while new side surfaces are formed.
Inset|inset|기존 면 안쪽에 새 경계를 만듭니다.|A new boundary is created inside an existing face.
Subdivision Surface|subdivision|분할과 보간으로 더 부드러운 표면을 만듭니다.|Subdivision and interpolation produce a smoother surface.
Boolean Modeling|boolean|합집합·차집합·교집합을 사용하는 모델링입니다.|Modeling uses union, difference and intersection operations.
Decimation|decimate|형태를 근사하며 면 수를 줄입니다.|Face count is reduced while approximating the shape.
Non-manifold Geometry|nonmanifold|정상적인 표면 연결 조건을 벗어난 형상입니다.|Geometry violates ordinary manifold surface connectivity.
Local / World Space|localworld|물체 기준 축과 장면 기준 축을 비교합니다.|Object-local and world-reference axes are compared.
UV Mapping|uv|표면 위치를 2D 텍스처 좌표에 대응시킵니다.|Surface locations map to two-dimensional texture coordinates.
UV Unwrap|unwrap|연결된 입체 표면을 평면으로 펼칩니다.|Connected surfaces are unfolded into a plane.
UV Island|island|UV 공간에서 분리된 연결 영역입니다.|An island is a separate connected region in UV space.
UV Seam|seam|UV를 펼칠 때 자르는 경계입니다.|Marked edges act as cuts during UV unwrapping.
Texel Density|density|면적당 텍스처 해상도 비율을 비교합니다.|Texture resolution per surface area is compared.
Trim Sheet|trim|반복 사용 가능한 재질 띠를 묶습니다.|Reusable material strips are arranged in one texture.
UDIM|udim|번호가 붙은 여러 UV 타일을 사용합니다.|Multiple numbered UV tiles are used.
Mipmap|mipmap|작아지는 텍스처 단계들을 표시합니다.|Successively smaller texture levels are shown.
Normal Map|normalmap|색 채널로 표면 방향을 표현합니다.|Color channels encode surface directions.
Bump Map|bump|윤곽을 바꾸지 않고 명암상 요철을 표현합니다.|Shading detail changes without changing the silhouette.
Displacement Map|displacement|실제 표면 위치와 윤곽이 변합니다.|Surface positions and the silhouette change.
Roughness|roughness|거친 표면의 넓은 하이라이트를 표현합니다.|A rough surface produces a broader highlight.
Metallic|metallic|금속성 반사의 원리를 표현합니다.|A schematic of conductor-like reflection.
Albedo / Base Color|albedo|조명 효과를 제외한 기본색입니다.|Base color is shown without lighting effects.
Ambient Occlusion|ao|접촉·틈새 주변의 가려진 빛을 표현합니다.|Occluded light is indicated around contacts and crevices.
Emission|emission|표면 자체에서 빛이 나오는 표현입니다.|A surface appears self-luminous.
Transmission|transmission|표면 뒤의 배경이 투과되는 표현입니다.|Background content appears through a surface.
Field of View|fov|카메라가 보는 각도 범위입니다.|The camera sees an angular field of view.
Near / Far Clip Plane|clip|렌더링 깊이의 근거리·원거리 경계입니다.|Near and far boundaries clip rendered depth.
Frustum Culling|frustum|카메라 시야 밖 객체를 제외합니다.|Objects outside the viewing frustum are excluded.
Occlusion Culling|occlusion|앞 물체에 완전히 가려진 객체를 제외합니다.|Fully occluded objects can be excluded.
Back-face Culling|backface|뒤를 향한 면을 제외합니다.|Back-facing surfaces are culled.
Depth Buffer|depth|화면 위치별 깊이값을 보관합니다.|A depth value is stored for each screen location.
Orbit Controls|orbit|대상 주위를 카메라가 돕니다.|The camera orbits around a target.
Pan Controls|pan|화면 평면 방향으로 시점을 옮깁니다.|The view translates parallel to the screen plane.
Zoom / Dolly|dolly|대상과 카메라 사이 거리가 바뀌는 돌리 예시입니다.|This illustrates dolly motion, changing camera distance rather than focal length.
`,waveModel,{interactive:true});
