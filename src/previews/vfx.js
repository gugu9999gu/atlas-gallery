/* Particle studies use deterministic sample trajectories; the slider changes simulation time. */
function waveVfx(k,t,e){
 const C=PC;let b=rect(24,26,252,130,'#17263e',9),a=26+t*49;
 const dot=(x,y,r=3,c='#84dbf2',extra='')=>circ(x,y,r,c,extra);
 const tail=s=>tx(150,172,s,9,C.muted,'middle');
 if(['lifetime','age','colorlife','sizelife','rotlife','vellife'].includes(k)){
  b+=ln(47,125,251,125,'#5a7091',2);
  for(let i=0;i<6;i++){const u=i/5,x=47+i*41,y=k==='vellife'?100-45*u*u:85,r=k==='sizelife'?3+16*Math.sin(u*Math.PI):9;
   const color=k==='colorlife'?`hsl(${35+u*180} 70% 68%)`:'#9edcf5';
   b+=k==='rotlife'?rect(x-9,y-9,18,18,color,2,`transform="rotate(${u*180} ${x} ${y})"`):dot(x,y,r,color,`opacity="${k==='lifetime'?1-u*.85:1}"`);
   b+=tx(x,143,k==='age'?u.toFixed(1):Math.round(u*100)+'%',8,'#b5c5dd','middle');}
  b+=ln(47+t*204,48,47+t*204,130,C.amber,2,'stroke-dasharray="3 3"');return b+tail(k==='age'?'normalized age = elapsed / lifetime':'birth → attribute changes → death');
 }

 if(k==='vector'||k==='flowfield'||k==='curl'){
  const field=(x,y)=>k==='curl'?[Math.sin((x-29)/39)*Math.cos((y-30)/29),-Math.cos((x-29)/39)*Math.sin((y-30)/29)]:[-(y-91)/70,(x-150)/110];
  for(let r=0;r<4;r++)for(let c=0;c<7;c++){const x=48+c*33,y=46+r*30,[dx,dy]=field(x,y);b+=wxArrow(x,y,x+13*dx,y+13*dy,'#729abd',1.1);}
  if(k==='vector')b+=wxArrow(150,91,197,113,'#edd081',3)+tx(179,76,'v = (dx, dy)',10,'#edd081','middle');
  else if(k==='flowfield'){for(let i=0;i<4;i++){const rr=24+i*13,pts=Array.from({length:41},(_,j)=>[150+rr*Math.cos(j*.12+i),91+rr*.6*Math.sin(j*.12+i)]);b+=path(poly(pts),'#81d7e3',1.8);b+=dot(150+rr*Math.cos(t*4.8+i),91+rr*.6*Math.sin(t*4.8+i),4,'#e1f6ff');}}
  else{for(let i=0;i<9;i++){let x=60+(i%3)*75,y=54+Math.floor(i/3)*35,pts=[[x,y]];for(let j=0;j<22;j++){const [dx,dy]=field(x,y);x+=dx*2.5;y+=dy*2.5;pts.push([x,y]);}b+=path(poly(pts),'#a6bafb',1.2);const pt=pts[Math.min(21,Math.floor(t*21))];b+=dot(pt[0],pt[1],3,'#e1dcff');}}
  return b+tail(k==='vector'?'vectors attached to locations':k==='flowfield'?'trajectories guided by sampled vectors':'curl-like field study · not a noise implementation');
 }
 if(k==='event')return b+wxBox(31,66,67,40,'Collision',C.blue)+wxArrow(102,86,124,86,C.amber)+wxBox(128,66,60,40,'Event',C.purple)+wxArrow(192,86,214,86,C.amber)+dot(242,86,10,C.amber)+[0,1,2,3,4].map(i=>{const a=i*1.25;return dot(242+Math.cos(a)*25,86+Math.sin(a)*25,3,'#b4dfff')}).join('')+tail('event payload → receiver → new particles');
 if(k==='sheet'){
  const frame=Math.min(7,Math.floor(t*8));for(let i=0;i<8;i++){const x=37+i%4*25,y=53+Math.floor(i/4)*37;b+=rect(x,y,23,32,i===frame?'#e6bd6a':'#2d4667',2)+dot(x+11,y+16,2+i*.85,'#bddef5')+tx(x+11,y+27,String(i+1),7,'white','middle');}
  b+=wxArrow(144,88,172,88,C.amber)+rect(183,48,74,84,'#283d5d',5)+dot(220,89,8+frame*3,'#b9dcff')+tx(220,149,'FRAME '+(frame+1),10,'#dbe9ff','middle');return b+tail('sheet sampling → rendered frame · overlaps flipbooks');
 }
 if(k==='teleport'){
  b+=`<ellipse cx="78" cy="102" rx="27" ry="47" fill="none" stroke="#a5b9fa" stroke-width="4"/><ellipse cx="222" cy="102" rx="27" ry="47" fill="none" stroke="#77d8d3" stroke-width="4"/>`;
  b+=wxGroup(wxCube(t<.5?78:222,100,17),`opacity="${Math.abs(t-.5)*2}"`)+path('M103 83Q150 33 196 83','#adc7ec',1.5,'none','stroke-dasharray="4 4"');return b+tail('source fades out · destination fades in');
 }
 if(k==='rainsplash'){
  const u=(t*.97)%1;b+=ln(36,124,264,124,'#7ab3d5',2);
  if(t<.42)b+=dot(150,45+t*175,5,'#c4efff');
  for(let i=0;i<10;i++){const a=(i-4.5)*.22,age=Math.max(0,(t-.4)/.6);if(age>0)b+=dot(150+Math.sin(a)*age*93,123-Math.cos(a)*Math.sin(age*Math.PI)*53,2.5,'#b6e7fa');}
  b+=`<ellipse cx="150" cy="125" rx="${10+u*45}" ry="${2+u*9}" fill="none" stroke="#8bbce7" stroke-width="1.5"/>`;return b+tail('drop impact → ejected droplets + surface ripple');
 }
 if(['gravity','drag','attractor','repulsor','vortex','turbulence','curl','brownian','vector','flowfield','collision','bounce','friction','sdf','depthcollision','inherit','spline','flocking','localspace','worldspace'].includes(k)){
  if(['vector','flowfield','curl'].includes(k))for(let r=0;r<4;r++)for(let c=0;c<7;c++){let x=47+c*33,y=47+r*29,ang=Math.atan2(y-90,x-150)+Math.PI/2; b+=wxArrow(x,y,x+12*Math.cos(ang),y+12*Math.sin(ang),'#537d9f',1);}
  if(['attractor','repulsor','vortex','sdf'].includes(k))b+=circ(150,91,k==='sdf'?24:10,'none','stroke="#e9a343" stroke-width="2"');
  if(['collision','bounce','friction','depthcollision'].includes(k))b+=ln(36,133,266,133,'#9aafca',2);
  if(k==='spline')b+=path('M38 128C80 21 209 160 265 50','#4c7196',2);
  const pt=(u,i)=>{const off=(i%7-3)*5;
   switch(k){
    case 'gravity':return [43+205*u,113-150*u+175*u*u+off];
    case 'drag':return [43+205*(1-Math.exp(-3*u)),63+off*2];
    case 'attractor':{let ang=i*2.4;return [150+(1-u)*100*Math.cos(ang),91+(1-u)*52*Math.sin(ang)];}
    case 'repulsor':{let ang=i*2.4;return [150+u*100*Math.cos(ang),91+u*52*Math.sin(ang)];}
    case 'vortex':return [150+(60-35*u)*Math.cos(i*.8+u*7),91+(43-25*u)*Math.sin(i*.8+u*7)];
    case 'turbulence':return [43+205*u,90+23*Math.sin(u*19+i*.8)+12*Math.cos(u*33)];
    case 'curl':case 'vector':case 'flowfield':return [150+70*Math.cos(u*5+i*.4),91+45*Math.sin(u*5+i*.4)];
    case 'brownian':return [55+160*u+20*Math.sin(i*10),90+32*Math.sin(i*2.4+t*2)];
    case 'collision':return [43+205*u,53+Math.min(80,u*125)+off*.3];
    case 'bounce':return [43+205*u,132-Math.abs(Math.sin(u*Math.PI*3))*70*(1-u*.6)];
    case 'friction':return [43+205*(1-Math.exp(-3*u)),127+off*.12];
    case 'sdf':return [43+205*u,91-Math.max(0,Math.sin(u*Math.PI))*33+off*.3];
    case 'depthcollision':return [43+180*u,52+Math.min(78,u*160)+off*.12];
    case 'inherit':return [50+195*u+22*t,90+off*2];
    case 'spline':{let q=1-u;return [q*q*q*38+3*q*q*u*80+3*q*u*u*209+u*u*u*265,q*q*q*128+3*q*q*u*21+3*q*u*u*160+u*u*u*50];}
    case 'flocking':return [63+160*u,92+off+13*Math.sin(u*5)];
    case 'localspace':return [65+65*t+120*u,92+off];
    case 'worldspace':return [65+120*u,92+off];
   }
  };
  for(let i=0;i<25;i++){const u=((i/25)+t*.33)%1,[x,y]=pt(u,i);b+=dot(Math.min(267,x),Math.min(148,y),2+i%3,'#8bd5ec',`opacity="${.35+u*.6}"`);}
  if(['localspace','worldspace','inherit'].includes(k))b+=wxBox(42+65*t,115,24,20,'E',C.pink);
  if(k==='depthcollision')b+=rect(181,38,12,94,'#6a82aa',0);
  return b+tail(k==='localspace'?'particles follow the emitter frame':k==='worldspace'?'particles remain in the world frame':'deterministic trajectory study · scrub time');
 }
 if(['spawnrate','burst','shape','spawnpos','velocity','random','seed','prewarm','loop','oneshot','subemitter','event','sprite','stretched','mesh','billboard','trailtime','ribbonwidth','geotrail'].includes(k)){
  if(['trailtime','ribbonwidth','geotrail'].includes(k)){
   const points=Array.from({length:35},(_,i)=>{const u=i/34;return [40+220*u,91+36*Math.sin(u*5)]});
   if(k==='ribbonwidth')for(let i=0;i<34;i++)b+=ln(...points[i],...points[i+1],'#a7cbff',2+15*Math.sin(i/34*Math.PI));
   else for(let i=Math.floor(k==='trailtime'?(1-t)*27:0);i<34;i++)b+=ln(...points[i],...points[i+1],k==='geotrail'?'#9c8af0':'#7cd8de',k==='geotrail'?9:5,`opacity="${i/34}"`);
   return b+tail(k==='trailtime'?'older trail samples expire':'width and geometry follow the path');
  }
  const n=k==='spawnrate'?Math.round(6+38*t):k==='oneshot'&&t>.87?0:25;
  for(let i=0;i<n;i++){const u=i/Math.max(1,n-1),angle=i*2.39996,r=16+t*52;let x=50+u*198,y=91+(rand(72,i)-.5)*60;
   if(k==='burst'){x=150+Math.cos(angle)*r;y=91+Math.sin(angle)*r*.65;}
   if(k==='shape'){x=70+u*170;y=91+(i%2?1:-1)*u*48;}
   if(k==='spawnpos'){x=80+(i%5)*34;y=53+Math.floor(i/5)*20;}
   if(k==='velocity'){x=50+u*195;y=125-u*74+(i%3)*4;}
   if(k==='prewarm'){x=45+u*212;y=143-(u*113+37*t)%108;}
   if(k==='seed'){x=45+rand(Math.floor(t*10)+1,i)*210;y=45+rand(72,i)*98;}
   if(k==='subemitter'||k==='event'){x=44+u*110;y=54+u*77;if(i>15){x=154+(i-16)*11;y=128-Math.sin((i-16)/8*Math.PI)*35;}}
   if(k==='mesh')b+=path(`M${x-4} ${y}L${x} ${y-7}L${x+7} ${y}L${x+2} ${y+7}Z`,'#c0ddff',1,'#7297d2');
   else if(k==='stretched')b+=ln(x,y,x+12,y-4,'#bdefff',2);
   else if(k==='sprite')b+=rect(x-4,y-4,8,8,'#bdd8ff',0);
   else if(k==='billboard')b+=rect(x-5,y-5,10,10,'none',0,'stroke="#a2d9f9"');
   else b+=dot(x,y,2+i%3,k==='random'?palette[i%5]:'#b6ddff');
  }
  b+=dot(k==='burst'?150:47,91,7,C.amber);
  if(k==='loop')b+=path('M247 126A17 17 0 1 1 246 91','#ecd17b',2)+wxArrow(246,91,255,98,'#ecd17b');
  if(k==='event')b+=tx(157,145,'COLLISION → SPAWN',8,'#eac16e');
  return b+tail(k==='burst'?'simultaneous emission':k==='spawnrate'?'particles per unit time':k==='prewarm'?'start from a pre-simulated state':'emission / renderer study');
 }
 if(['atlas','flipbook','sheet','noise','erosion','mask','alphaclip','channel','fresnel','rim','additive','multiply','alpha','premultiplied','distort','flowmap','displace'].includes(k)){
  if(['atlas','flipbook','sheet','noise','erosion','mask','alphaclip','channel','flowmap'].includes(k)){
   for(let r=0;r<4;r++)for(let c=0;c<6;c++){const x=42+c*36,y=39+r*25,n=r*6+c,v=rand(907,n);let color=k==='channel'?['#df6674','#68bb8b','#6f9ee9'][c%3]:k==='mask'?`hsl(210 0% ${Math.round(v*100)}%)`:k==='alphaclip'?v>t?'white':'#26354a':k==='noise'?`hsl(210 10% ${15+v*75}%)`:'#324e72';
    if(k==='erosion'&&v<t)continue;b+=rect(x,y,32,21,color,2);
    if(['atlas','flipbook','sheet'].includes(k))b+=dot(x+16,y+10,k==='atlas'?3+n%6:2+n/3,'#9edbfa');
    if(k==='flowmap')b+=wxArrow(x+5,y+15,x+24,y+5+(n%3)*5,['#dc869f','#79cbbc'][n%2],1);
   }
   if(k==='flipbook'||k==='sheet'){const f=Math.min(23,Math.floor(t*24));b+=rect(41+f%6*36,38+Math.floor(f/6)*25,34,23,'none',3,'stroke="#e9a343" stroke-width="2"');}
   return b+tail(k==='atlas'?'many independent assets in one image':k==='noise'?'deterministic sample noise, not Perlin noise':k==='mask'?'mask controls visibility':k==='alphaclip'?'discard pixels below threshold':'inspect channels / frame selection');
  }
  if(['fresnel','rim'].includes(k)){b+=circ(150,90,44,'#274565','stroke="#9fe1f2" stroke-width="'+(k==='rim'?7:3)+'"')+circ(150,90,35,'none','stroke="#507793" stroke-width="3" opacity=".6"')+wxArrow(218,83,193,83,C.amber);return b+tail(k==='rim'?'grazing-angle rim mask':'stronger reflection at grazing angles');}
  if(['additive','multiply','alpha','premultiplied'].includes(k)){const fill=k==='multiply'?'#56674f':k==='additive'?'#d2f5ff':'#9e91c5';b+=circ(126,90,39,'#6d8fe5')+circ(176,90,39,'#da8ba9',`opacity="${k==='alpha'?t:.7}"`);b+=path('M151 59Q177 90 151 121Q125 90 151 59Z','none',0,fill);if(k==='premultiplied')b+=rect(79,141,143,4,'#94d4f4',2);return b+tail(k==='additive'?'source + destination':k==='multiply'?'source × destination':k==='premultiplied'?'RGB already multiplied by alpha':'source α + destination (1−α)');}
  if(k==='displace'){for(let r=0;r<5;r++)b+=path(poly(Array.from({length:18},(_,i)=>[39+i*13,43+r*22+Math.sin(i*.7+t*5)*12])),'#87b9e7',1.5);return b+tail('vertices move; the silhouette changes');}
  for(let r=0;r<7;r++)b+=path(poly(Array.from({length:30},(_,i)=>[34+i*8,39+r*17+14*Math.sin(i*.3+t*6)*Math.exp(-(((i-15)/7)**2))])),'#7cb9e9',1);
  return b+tail('screen sampling coordinates are offset');
 }
 if(['slash','projectile','charge','cast','channeling','target','aura','shield','shieldhit','heal','teleport','summon','disintegrate','critical','loot','fire','smoke','dust','motes','debris','rain','rainsplash','snow','fog','foam','ripple','wake','lightning','electric','wind','leaves','fireflies','flare','vignette','damage','radial','speed','zoom','impulse','dof','motionblur','lensdirt','impact'].includes(k)){
  if(['vignette','damage','dof','motionblur','lensdirt','zoom','impulse'].includes(k)){
   b+=wxCube(150+(k==='impulse'?Math.sin(t*32)*8:0),88,k==='zoom'?30+25*t:33);
   if(k==='vignette'||k==='damage')for(let i=0;i<5;i++)b+=rect(25+i*4,27+i*4,250-i*8,128-i*8,'none',8,`stroke="${k==='damage'?'#d75b76':'#080f1b'}" stroke-width="9" opacity="${.6-i*.1}"`);
   if(k==='motionblur')for(let i=1;i<5;i++)b+=wxGroup(wxCube(150-i*14,88,33),`opacity="${.15-i*.025}"`);
   if(k==='dof')b+=wxGroup(circ(65,74,18,'#a0c6e8')+circ(242,115,24,'#86a1ca'),'style="filter:blur(7px)"');
   if(k==='lensdirt')for(let i=0;i<15;i++)b+=dot(38+rand(56,i)*225,39+rand(22,i)*100,3+rand(88,i)*10,'#a9c4de','opacity=".2"');
   return b+tail('camera / screen-space illustration');
  }
  if(['shield','shieldhit','aura','charge','teleport','summon','target','ripple','rainsplash','wake','channeling','cast'].includes(k)){
   const yy=['target','ripple','rainsplash','wake'].includes(k)?112:92;
   const rings=k==='shield'?1:k==='shieldhit'?3:4;
   for(let i=0;i<rings;i++){const rr=14+((t+i/rings)%1)*40;b+=`<ellipse cx="${k==='wake'?90+i*30:150}" cy="${yy}" rx="${rr}" ry="${['target','ripple','rainsplash','wake','summon'].includes(k)?rr*.35:rr}" fill="none" stroke="${k==='shield'||k==='shieldhit'?'#8dc7ff':k==='charge'?'#d5aaff':'#79e3d7'}" stroke-width="${k==='shield'?5:2}" opacity="${1-i*.15}"/>`;}
   if(['teleport','summon','channeling','cast'].includes(k))b+=rect(k==='cast'?50:132,44,k==='cast'?170:36,89,'#9285e9',7,'opacity=".4"');
   if(k==='shieldhit')b+=wxArrow(224,54,186,79,C.amber,3);
   if(k==='target')b+=ln(150,91,150,132,'#a8f5f0',1)+ln(116,112,184,112,'#a8f5f0',1);
   if(k==='charge')for(let i=0;i<8;i++){const ang=i*Math.PI/4;b+=wxArrow(150+Math.cos(ang)*64,92+Math.sin(ang)*54,150+Math.cos(ang)*35,92+Math.sin(ang)*28,'#c7b4fb',1);}
   return b+tail(k==='target'?'ground-plane aim area':k==='shieldhit'?'impact on a protective surface':'layered energy / surface response');
  }
  if(k==='slash')return b+path('M61 139Q86 35 245 48Q147 59 61 139Z','#b7d9ff',1,'#a5caff')+path('M61 139Q120 67 240 48','#eeeaff',3)+tail('curved blade arc, not a straight beam');
  if(k==='projectile')return b+ln(50,103,90+140*t,73,'#91bcff',6)+dot(90+140*t,73,10,'#e1f6ff')+tail('moving head with a trailing tail');
  if(k==='loot')return b+rect(140,38,20,101,'#b7a4ff',5,'opacity=".7"')+rect(127,126,46,20,'#d2b475',3)+tail('persistent vertical item marker');
  if(k==='heal'){for(let i=0;i<8;i++){const x=72+(i%4)*51,y=58+Math.floor(i/4)*57-15*t;b+=rect(x-3,y-11,6,22,'#7ce2b2',1)+rect(x-11,y-3,22,6,'#7ce2b2',1)}return b+tail('upward recovery symbols');}
  if(k==='critical')return b+path('M150 37L161 72L206 56L182 85L239 102L186 111L203 146L163 126L143 150L133 118L83 131L106 100L65 74L123 77Z','#ffcc8f',1,'#e88481')+tx(150,104,'CRIT!',23,'#ffffff','middle',800)+tail('single emphasized impact');
  if(['lightning','electric','wind','speed','radial','flare','impact'].includes(k)){
   if(k==='lightning')b+=path('M58 50L118 75L96 96L172 85L151 116L244 132','#a9d9ff',4);
   else if(k==='electric')for(let i=0;i<8;i++){const an=i*Math.PI/4;b+=path(`M150 91L${150+25*Math.cos(an)} ${91+20*Math.sin(an)}L${150+43*Math.cos(an+.2)} ${91+37*Math.sin(an+.2)}L${150+64*Math.cos(an)} ${91+52*Math.sin(an)}`,'#b3caff',2);}
   else if(k==='wind')for(let i=0;i<5;i++)b+=path(`M40 ${48+i*22}Q147 ${25+i*22} 255 ${52+i*22}`,'#aad8e9',1.5);
   else if(k==='flare')b+=ln(39,90,260,90,'#b3e6ff',4)+dot(150,90,19,'#e9faff')+dot(100,90,8,'#648ce1')+dot(212,90,6,'#bc99dd');
   else for(let i=0;i<20;i++){const an=i*Math.PI/10,r=k==='impact'?20:38;b+=ln(150+Math.cos(an)*r,91+Math.sin(an)*r*.6,150+Math.cos(an)*(k==='radial'?91:105),91+Math.sin(an)*(k==='radial'?50:60),k==='impact'?'#ffc88c':'#a2bfeb',k==='radial'?5:1.5);}
   return b+tail('direction / energy / impact study');
  }
  for(let i=0;i<29;i++){const u=rand(12,i),v=rand(74,i),x=38+u*222;let y=38+((v+t*.5)%1)*106,r=2+v*3,c='#badfff';
   if(k==='fire'){const z=i/28;y=141-z*100;x;const xx=150+(u-.5)*(64*(1-z)+8);b+=dot(xx,y,6+8*(1-z),z>.65?'#f4bd68':'#ed7864',`opacity="${.5+v*.4}"`);continue;}
   if(k==='smoke'||k==='dust'||k==='fog'){const xx=k==='smoke'?150+(u-.5)*65:x; y=k==='smoke'?142-(v+t*.3)%1*105:k==='dust'?115+(v-.5)*44:55+v*75;r=k==='fog'?28:10+v*16;c='#849bb4';b+=dot(xx,y,r,c,'opacity=".18"');continue;}
   if(k==='rain')b+=ln(x,y,x-4,y+14,'#9bc1e5',1);
   else if(k==='debris'||k==='disintegrate')b+=rect(x,y,4+v*5,4+v*5,k==='debris'?'#b6a49a':'#b9a5ed',0,`transform="rotate(${u*180} ${x} ${y})" opacity="${k==='disintegrate'?1-t*.7:1}"`);
   else if(k==='leaves')b+=`<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="#c6a776" transform="rotate(${v*180} ${x} ${y})"/>`;
   else if(k==='foam')b+=dot(x,109+v*30,3+v*4,'none','stroke="#c7edf3" stroke-width="1"');
   else b+=dot(x,y,k==='motes'||k==='fireflies'?1.7:r,k==='fireflies'?'#dff4a8':c,`opacity="${.3+v*.6}"`);
  }
  return b+tail('synthetic effect sample · scrub time');
 }
 return null;
}
waveAdd('vfx',`
Particle Lifetime|lifetime|입자의 생성부터 소멸까지를 비교합니다.|Compare a particle from birth to expiration.
Normalized Age|age|경과 시간을 수명으로 나눈 0~1 값입니다.|Elapsed time divided by lifetime gives a 0–1 value.
Color over Lifetime|colorlife|수명 진행에 따라 색을 바꿉니다.|Color changes over the particle lifetime.
Size over Lifetime|sizelife|수명 진행에 따라 크기를 바꿉니다.|Particle size changes over its lifetime.
Rotation over Lifetime|rotlife|수명 진행에 따라 각도를 바꿉니다.|Particle orientation changes over its lifetime.
Velocity over Lifetime|vellife|수명 진행에 따라 속도를 바꿉니다.|Particle velocity changes over its lifetime.
Gravity Force|gravity|중력으로 아래로 굽는 궤적입니다.|Gravity bends a ballistic trajectory downward.
Drag Force|drag|항력 때문에 이동 속도가 줄어듭니다.|Drag progressively reduces speed.
Attractor|attractor|입자가 중심으로 모입니다.|Particles move toward a center.
Repulsor|repulsor|입자가 중심에서 멀어집니다.|Particles move away from a center.
Vortex Force|vortex|회전하며 중심 주변을 도는 궤적입니다.|Particles spiral around a center.
Turbulence|turbulence|흐름에 불규칙한 변동이 섞입니다.|Irregular variation is added to the flow.
Curl Noise|curl|소용돌이형 흐름의 원리를 그린 도식입니다.|An illustrative swirling field, not a numerical curl-noise solver.
Vector Field|vector|위치별 방향 벡터를 표시합니다.|Direction vectors are shown at sampled positions.
Particle Flow Field|flowfield|벡터장을 따르는 입자 흐름입니다.|Particles follow a sampled direction field.
Brownian Motion|brownian|불규칙한 변위의 설명용 샘플입니다.|Illustrative irregular displacements, not a physical Brownian solver.
Particle Collision|collision|표면에서 입자가 멈추는 예시입니다.|Particles stop when they reach a surface.
Restitution|bounce|충돌 후 반발하며 높이가 줄어듭니다.|Bounce height decreases after collisions.
Collision Friction|friction|접촉면을 따라 움직임이 감속합니다.|Tangential motion slows along the contact surface.
SDF Collision|sdf|거리장 표면을 피해 흐르는 원리입니다.|A schematic path avoids a signed-distance surface.
Depth-buffer Collision|depthcollision|화면에 보이는 깊이 표면의 충돌 예시입니다.|A schematic collision against visible depth surfaces.
Inherit Velocity|inherit|이미터 이동 속도가 입자에 더해집니다.|Emitter velocity contributes to particle motion.
Local-space Simulation|localspace|이미터의 좌표계를 따라 입자도 이동합니다.|Particles follow the emitter coordinate frame.
World-space Simulation|worldspace|이미터가 움직여도 입자는 월드 좌표에 남습니다.|Particles remain in world coordinates as the emitter moves.
Spline-following Particles|spline|입자가 지정한 곡선 경로를 따릅니다.|Particles follow a defined spline curve.
Particle Flocking|flocking|정렬된 무리 이동의 원리 예시입니다.|A schematic of aligned group motion.
Spawn Rate|spawnrate|단위 시간당 생성 입자 수를 나타냅니다.|The rate specifies particles generated per unit time.
Burst Emission|burst|여러 입자를 한꺼번에 방출합니다.|Multiple particles are emitted simultaneously.
Emission Shape|shape|원뿔 모양 생성 범위를 표시합니다.|A cone-shaped emission region is shown.
Spawn Position|spawnpos|생성 위치의 분포를 표시합니다.|The distribution of initial positions is shown.
Initial Velocity|velocity|입자의 최초 이동 방향과 속도입니다.|The initial direction and speed of particles.
Spawn Randomization|random|입자별 색·크기·위치를 다르게 설정합니다.|Initial particle properties vary across samples.
Random Seed|seed|같은 시드에서 같은 배치를 재현합니다.|The same seed reproduces the same arrangement.
Prewarm|prewarm|이미 진행된 상태에서 효과가 시작됩니다.|The effect starts from a pre-simulated state.
Looping Emitter|loop|주기적으로 반복되는 방출입니다.|Emission repeats in cycles.
One-shot Effect|oneshot|한 번 방출한 뒤 소멸합니다.|A single emission expires without repeating.
Sub-emitter|subemitter|부모 입자에서 자식 입자가 생성됩니다.|Child particles are emitted from parent particles.
Particle Event|event|충돌 사건이 새로운 방출을 일으킵니다.|A collision event triggers a new emission.
Sprite Particle|sprite|평면 스프라이트로 입자를 그립니다.|Particles are rendered as flat sprites.
Stretched Billboard|stretched|속도 방향으로 늘어난 평면 입자입니다.|Flat particles stretch along their velocity.
Mesh Particle|mesh|입자를 입체 메시 형태로 표시합니다.|Particles are represented by mesh shapes.
Billboard|billboard|카메라를 향하는 평면 표현입니다.|A planar representation faces the camera.
Trail Lifetime|trailtime|오래된 궤적 샘플이 순차적으로 사라집니다.|Older trail samples expire in sequence.
Ribbon Width Curve|ribbonwidth|경로를 따라 리본의 폭이 달라집니다.|Ribbon width changes along the path.
Geometry Trail|geotrail|경로를 연결한 연속 기하 띠입니다.|A continuous geometric strip follows a path.
Texture Atlas|atlas|독립된 자산 여러 개를 한 장에 배치합니다.|Independent assets are packed into a single image.
Flipbook Texture|flipbook|시간 순서의 프레임을 한 장에 배치합니다.|Sequential animation frames are packed into a sheet.
Texture Sheet Animation|sheet|시트에서 현재 프레임을 골라 표시합니다.|A current frame is selected from a texture sheet.
Noise Texture|noise|무작위 밝기 샘플을 텍스처로 표현합니다.|Deterministic random brightness samples form a texture.
Erosion Mask|erosion|임계값에 따라 가려지는 영역이 커집니다.|A threshold progressively removes covered regions.
Alpha Mask|mask|밝기값으로 가시 영역을 제어합니다.|Mask values control visible areas.
Alpha Clip|alphaclip|임계값 미만의 픽셀을 버립니다.|Pixels below an alpha threshold are discarded.
Channel Packing|channel|채널별 데이터를 한 텍스처에 모읍니다.|Separate data is packed into texture channels.
Flow Map|flowmap|방향 데이터로 텍스처 이동을 유도합니다.|Directional data guides texture movement.
Fresnel Effect|fresnel|비스듬한 관측각에서 강해지는 반사를 표현합니다.|Reflection strengthens at grazing viewing angles.
Fresnel Rim Mask|rim|비스듬한 관측각 부분을 마스크로 추출합니다.|Grazing-angle regions are isolated as a rim mask.
Additive Blending|additive|색 성분을 더해 밝아지는 합성입니다.|Color components are added, producing brighter overlap.
Multiplicative Blending|multiply|색 성분을 곱해 어두워지는 합성입니다.|Color components multiply, producing darker overlap.
Alpha Blending|alpha|투명도에 따라 배경과 혼합합니다.|The source mixes with the background using alpha.
Premultiplied Alpha|premultiplied|색에 알파를 미리 곱한 합성 입력입니다.|The input RGB values have already been multiplied by alpha.
Distortion Shader|distort|샘플링 위치를 바꾸어 화면을 왜곡합니다.|Sampling coordinates are offset to distort the image.
Vertex Displacement|displace|실제 정점 위치를 바꿉니다.|Vertex positions are displaced.
Slash Effect|slash|검의 움직임을 곡선형 검기로 표시합니다.|A curved arc follows a blade strike.
Projectile Effect|projectile|이동하는 머리와 뒤따르는 꼬리입니다.|A moving projectile head leaves a tail.
Charge-up Effect|charge|중심으로 에너지가 모이는 준비 단계입니다.|Energy converges during a charge-up phase.
Cast Effect|cast|시전 순간의 방출을 표시합니다.|A cast releases energy at a distinct moment.
Channeling Effect|channeling|에너지 연결이 지속되는 표현입니다.|An energy connection persists while channeling.
Ground Target Indicator|target|지면 위의 조준·범위 표시입니다.|A targeting area is shown on the ground plane.
Aura|aura|대상 주변에 유지되는 효과입니다.|An effect persists around its subject.
Shield Effect|shield|대상을 감싸는 보호 표면입니다.|A protective surface surrounds the subject.
Shield Hit Ripple|shieldhit|방어막 표면에 충격 파문이 퍼집니다.|An impact ripple spreads across a shield surface.
Heal Effect|heal|회복을 뜻하는 상승 기호입니다.|Rising symbols communicate recovery.
Teleport Effect|teleport|위치 전환을 알리는 수직 에너지 표현입니다.|Vertical energy marks a location transition.
Summoning Effect|summon|바닥의 소환 표식과 생성 위치입니다.|A ground marker identifies a summoning location.
Disintegration Effect|disintegrate|형체가 작은 조각으로 분리됩니다.|A form breaks into small fragments.
Critical Hit Effect|critical|일반 타격보다 강조된 충격입니다.|An impact is emphasized beyond an ordinary hit.
Loot Beam|loot|아이템 위치를 알리는 지속 빛기둥입니다.|A persistent vertical beam marks loot.
Fire Effect|fire|위로 좁아지는 따뜻한 입자 형태입니다.|Warm particles narrow toward the top of a flame.
Smoke Plume|smoke|위로 확산하는 반투명 연기입니다.|Translucent smoke spreads upward.
Dust Puff|dust|지면 부근에 짧게 퍼지는 먼지입니다.|A short dust cloud spreads near the ground.
Dust Motes|motes|공간에 흩어진 작은 부유 입자입니다.|Small suspended particles are distributed in space.
Debris|debris|분리된 고체 조각의 파편입니다.|Separate solid fragments represent debris.
Rain Streak|rain|방향성 있는 가는 빗줄기입니다.|Thin directional streaks represent rain.
Rain Splash|rainsplash|표면에 빗방울이 닿아 퍼집니다.|Rain impact spreads across a surface.
Snow Particles|snow|천천히 이동하는 작은 눈 입자입니다.|Small snow particles drift through the scene.
Fog|fog|넓게 겹치는 낮은 불투명도 영역입니다.|Broad translucent regions overlap as fog.
Foam|foam|표면 가까이 모이는 거품 무늬입니다.|Bubbles cluster near a surface.
Water Ripple|ripple|수면에 동심 파문이 퍼집니다.|Concentric ripples spread over the water surface.
Water Wake|wake|움직인 물체 뒤로 파문이 이어집니다.|Waves trail behind a moving object.
Lightning Arc|lightning|두 위치를 연결하는 번개 경로입니다.|A jagged lightning path connects locations.
Electric Spark|electric|한 지점에서 짧은 전기 가지가 퍼집니다.|Short electrical branches spread from a point.
Wind Streak|wind|흐름 방향을 나타내는 완만한 선입니다.|Soft curved lines indicate airflow.
Falling Leaves|leaves|방향이 다른 낙엽 입자가 떨어집니다.|Leaf particles fall with different orientations.
Fireflies|fireflies|어두운 공간에 작은 발광점이 흩어집니다.|Small luminous points scatter through darkness.
Lens Flare|flare|밝은 광원에 따른 렌즈성 번짐입니다.|A bright source produces a lens-like flare.
Lens Dirt|lensdirt|렌즈 표면 얼룩이 빛에 드러납니다.|Light reveals marks on the lens surface.
Vignette|vignette|화면 가장자리를 어둡게 처리합니다.|The edges of the image are darkened.
Damage Vignette|damage|가장자리의 피해색으로 피격을 알립니다.|A colored edge overlay indicates damage.
Radial Blur|radial|중심에서 방사 방향으로 번집니다.|Blur extends radially from a center.
Speed Lines|speed|방사형 선으로 속도감을 강조합니다.|Radial lines emphasize speed.
Camera Impulse|impulse|짧은 충격으로 카메라 위치가 흔들립니다.|A brief impulse offsets the camera position.
Zoom Punch|zoom|순간적으로 확대해 충격을 강조합니다.|A brief zoom emphasizes impact.
Depth of Field|dof|초점 밖 전경·배경이 흐려집니다.|Foreground and background outside focus are blurred.
Motion Blur|motionblur|이동 방향을 따라 형상이 번집니다.|Shapes smear along their direction of movement.
Impact Spark|impact|충돌 지점에서 불꽃이 방사됩니다.|Sparks radiate from an impact point.
`,waveVfx,{interactive:true});
