/* Motion families use explicit timing functions and named transition studies. */
function waveMotion(k,t){
 const C=PC, curve=(f,c=C.blue)=>path(poly(Array.from({length:61},(_,i)=>[39+i*3.6,139-94*f(i/60)])),c,2.4);
 let b='';
 const timing={easing:x=>x*x*(3-2*x),bezier:x=>x*x*(3-2*x),interpolate:x=>x,tween:x=>x,stiffness:x=>1-Math.exp(-6*x)*Math.cos(15*x),damping:x=>1-Math.exp(-4*x)*Math.cos(12*x),mass:x=>1-Math.exp(-3*x)*Math.cos(7*x),undershoot:x=>x*x*(3*x-2),curve:x=>x*x,timing:x=>Math.min(1,x*1.6)};
 if(timing[k]){const f=timing[k];b=wxGrid()+curve(f)+ln(39+216*t,31,39+216*t,145,C.pink,1,'stroke-dasharray="3 3"')+circ(39+216*t,139-94*f(t),5,C.pink)+tx(41,27,'VALUE',9,C.ink)+tx(250,158,'TIME →',9,C.ink,'end');if(k==='stiffness'||k==='damping'||k==='mass')b+=curve(x=>1-Math.exp(-(k==='damping'?9:4)*x)*Math.cos((k==='stiffness'?7:12)*x),C.teal)+tx(46,158,'two parameter values',8,C.teal);if(k==='bezier')b+=ln(39,139,100,139,C.amber,1)+ln(194,45,255,45,C.amber,1)+circ(100,139,4,C.amber)+circ(194,45,4,C.amber);return b;}
 if(k==='motiontoken')return wxBox(41,34,83,30,'duration.fast',C.blue)+wxBox(41,77,83,30,'ease.standard',C.teal)+wxArrow(127,49,172,63,C.blue)+wxArrow(127,91,172,84,C.teal)+rect(179,47,85,58,'#edf2fd',7,'stroke="#a1b4ed"')+tx(221,71,'button',11,C.ink,'middle')+tx(221,92,'160 ms',9,C.blue,'middle')+wxArrow(127,91,173,133,C.teal)+wxBox(179,117,85,28,'dialog',C.purple)+wxCaption('named values reused across components');
 if(['keyframe','animation','timeline','sequence','choreography','motiontoken','spec'].includes(k)){
  b=ln(50,58,261,58,C.grid,3)+[0,1,2].map(i=>rect(47+i*104,53,10,10,C.blue,1,'transform="rotate(45 '+(52+i*104)+' 58)"')+tx(52+i*104,39,['0 ms','400 ms','800 ms'][i],9,C.muted,'middle')).join('');
  (k==='keyframe'?[0]:[0,1,2]).forEach(i=>{let offset=k==='sequence'?i*63:k==='choreography'?i*28:k==='timeline'?i*18:0; b+=tx(24,86+i*24,['move','scale','fade'][i],8)+rect(50+offset,75+i*24,k==='sequence'?60:160-offset,14,palette[i],3)});
  b+=ln(50+t*210,45,50+t*210,148,C.pink,2);if(k==='motiontoken'||k==='spec')b+=tx(150,168,'duration: 240ms · easing: standard',9,C.ink,'middle');return b;
 }
 if(['budget','pacing','jank'].includes(k)){
  for(let i=0;i<12;i++){const v=k==='jank'&&i%5===2?90:k==='pacing'?[25,75,30,70][i%4]:40;b+=rect(37+i*19,142-v,12,v,i%5===2&&k==='jank'?C.pink:C.blue,2)}
  return b+ln(32,85,269,85,C.amber,1.5,'stroke-dasharray="3 3"')+tx(266,77,'16.7 ms reference',9,C.amber,'end')+wxCaption(k==='budget'?'60 Hz example · not a device benchmark':'uneven frame delivery');
 }
 if(['scrolltrigger','scrolldriven','scrub','scrolltimeline','viewtimeline','reveal','pinning','parallax','inertia','overscroll','rubber','dragelastic','snapback','snappoint','velocity','dismiss','pull'].includes(k)){
  const y=30+t*103;b=rect(37,26,184,124,'#fff',7,'stroke="#cbd7e9"')+rect(229,26,5,124,'#e0e7f0',2)+rect(229,29+t*90,5,30,C.blue,2);
  if(k==='parallax')b+=rect(53,48+t*8,132,45,'#c9d8f1',5)+rect(80,78+t*23,112,43,C.blue,5)+wxArrow(191,56,191,91,C.teal);
  else if(['inertia','overscroll','rubber','dragelastic','snapback','snappoint','velocity','dismiss'].includes(k)){
   const x=k==='snappoint'?55+Math.round(t*3)*37:k==='snapback'?55+(1-t)*112:55+t*112;
   b+=rect(48,82,160,33,'#e4ebfa',5)+rect(x,83,k==='rubber'?35+20*t:35,31,C.blue,5)+wxArrow(65,68,177,68,C.teal);
   if(k==='snappoint')for(let i=0;i<4;i++)b+=circ(72+37*i,124,3,C.amber);
   if(k==='dismiss')b+=tx(125,105,'×',16,C.pink,'middle');
  }else{for(let i=0;i<3;i++){let yy=37+i*35-t*24;const alpha=k==='scrolltrigger'?t>.5?1:.2:k==='reveal'||k==='viewtimeline'?Math.min(1,.15+t*1.4):1;b+=rect(51,k==='pinning'&&i===0?37:yy,154,25,i===0?C.blue:'#d9e3f3',4,`opacity="${alpha}"`)}b+=ln(37,100,221,100,C.pink,1,'stroke-dasharray="3 3"');if(k==='pull')b+=path('M111 42A13 13 0 1 1 138 48',C.teal,3);}
  return b+wxCaption(k==='scrolltrigger'?'threshold → play once':k==='scrolldriven'||k==='scrub'?'scroll position ↔ progress':k==='pinning'?'pinned header · moving content':'scroll / gesture study');
 }
 if(['squash','anticipation','follow','overlap','secondary','arc'].includes(k)){
  const x=45+t*210,y=k==='arc'?135-75*Math.sin(Math.PI*t):125-67*Math.abs(Math.sin(Math.PI*t));
  b=ln(30,145,270,145,C.grid,2)+path('M45 125Q150 -20 255 125',C.grid,1,'none','stroke-dasharray="4 4"');
  if(k==='anticipation'){b+=circ(50-16*Math.sin(t*Math.PI*2),124,15,C.teal)+wxArrow(53,91,26,91,C.pink)+wxArrow(80,91,201,91,C.blue);}
  else b+=`<ellipse cx="${x}" cy="${y}" rx="${k==='squash'?14+8*Math.cos(t*Math.PI*2):15}" ry="${k==='squash'?19-7*Math.cos(t*Math.PI*2):15}" fill="${C.blue}"/>`;
  if(['follow','overlap','secondary'].includes(k))b+=path(`M${x} ${y}Q${x-18} ${y+25} ${x-44} ${y+5}`,C.teal,8)+circ(x-52,y+6,k==='secondary'?4:7,C.teal);
  return b+wxCaption(k==='arc'?'curved trajectory':k==='squash'?'volume impression · shape changes':'primary action / secondary response');
 }
 if(['shared','hero','container','layout','flip','expand','master','page','snapshot','transition','gesture','interrupt','reverse','retarget','focus','progress','check','notification','micro','spatial','temporal'].includes(k)){
  if(['check','micro'].includes(k))return circ(150,88,37,C.teal)+path('M129 87L145 104L175 68','white',5,'none',`stroke-dasharray="${t*80} 80"`)+wxCaption('action → state change → feedback');
  if(k==='progress')return rect(40,85,220,14,C.grid,7)+rect(40,85,220*t,14,C.blue,7)+tx(150,68,Math.round(t*100)+'%',20,C.ink,'middle');
  if(k==='notification')return rect(37,31,226,118,'white',8,'stroke="#dce5f0"')+wxBox(100,40+(1-t)*50,150,32,'New message',C.blue);
  if(k==='focus')return [0,1,2].map(i=>wxBox(38+i*80,77,66,32,['First','Second','Third'][i],i===Math.min(2,Math.floor(t*3))?C.blue:'#b5c1d9')+(i===Math.min(2,Math.floor(t*3))?rect(34+i*80,73,74,40,'none',7,'stroke="#e9a343" stroke-width="3"'):'')).join('');
  b=rect(25,31,110,122,'#fff',5,'stroke="#dce5f0"')+rect(165,31,110,122,'#fff',5,'stroke="#dce5f0"');
  if(['shared','hero','container','spatial'].includes(k)){const x=39+t*144,y=48-t*3,w=74+t*7,h=k==='container'?27+70*t:44+49*t;b+=rect(x,y,w,h,C.blue,7)+wxArrow(137,100,160,100,C.teal);}
  else if(k==='expand')b+=rect(39,49,82,20+72*t,C.blue,5)+tx(80,141,'height',9,C.muted,'middle');
  else if(k==='layout'||k==='flip'){for(let i=0;i<3;i++){b+=rect(37,44+i*32,85,24,palette[i],4)+rect(179,44+((i+1)%3)*32,82,24,palette[i],4);}b+=wxArrow(138,94,159,94);}
  else{b+=rect(38,44,83,90,C.blue,4,`opacity="${1-t}"`)+rect(178,44,83,90,C.teal,4,`opacity="${t}"`);if(['interrupt','reverse','retarget'].includes(k))b+=wxArrow(160,92,139,92,C.pink);}
  return b+wxCaption(k==='flip'?'First → Last → Invert → Play':k==='container'?'one surface expands into another':'source state → destination state');
 }
 return null;
}
waveAdd('motion',`
Easing|easing|시간에 따른 값의 변화율을 곡선으로 표시합니다.|The curve shows how the value changes over time.
Interpolation|interpolate|두 값 사이의 중간값을 계산합니다.|Intermediate values are calculated between endpoints.
Cubic Bézier Easing|bezier|제어점이 있는 시간 곡선의 예시입니다.|A timing curve with visible control handles.
Stiffness|stiffness|스프링 강성 차이에 따른 진동 주기를 비교합니다.|Compare oscillation rates for different spring stiffness values.
Damping|damping|같은 진동의 감쇠 속도를 비교합니다.|Compare how quickly oscillations decay.
Mass|mass|질량 변화에 따른 느린 응답을 비교합니다.|Compare the slower response of greater simulated mass.
Undershoot|undershoot|시작값 아래로 내려갔다가 목표로 이동합니다.|The value initially moves below its starting point.
Keyframe|keyframe|명시한 시점과 속성값을 표시합니다.|Explicit time points and property tracks are shown.
Animation Timeline|timeline|여러 속성의 시작·종료 시점을 비교합니다.|Compare start and end times across property tracks.
Motion Choreography|choreography|요소들이 시간차를 두고 반응하는 구성입니다.|Elements respond with deliberately offset timing.
Motion Token|motiontoken|재사용하는 시간·이징 값의 예시입니다.|An example of reusable duration and easing values.
Frame Budget|budget|60Hz 화면의 예시 예산선이며 실측 성능이 아닙니다.|An illustrative 60 Hz budget, not a measured benchmark.
Frame Pacing|pacing|프레임 시간 간격이 고르지 않은 상태입니다.|Frame delivery intervals are uneven.
Jank|jank|일부 프레임이 예산을 넘는 끊김 예시입니다.|Some frames exceed the illustrative budget.
Scroll-triggered Animation|scrolltrigger|임계점을 넘으면 재생되는 방식입니다.|Playback starts after crossing a threshold.
Scroll-driven Animation|scrolldriven|스크롤 위치와 진행률이 연속적으로 연결됩니다.|Progress continuously follows scroll position.
Scroll Reveal|reveal|뷰포트 진입에 따라 콘텐츠를 드러냅니다.|Content is revealed as it enters the viewport.
Sticky Pinning|pinning|주변 콘텐츠가 이동해도 특정 요소가 고정됩니다.|One element stays fixed while surrounding content moves.
Parallax|parallax|전경과 배경의 이동량을 다르게 설정합니다.|Foreground and background move at different rates.
Rubber Banding|rubber|경계를 벗어난 정도에 따라 늘어나는 표현입니다.|The surface stretches beyond its boundary.
Snap-back|snapback|놓은 요소가 원래 위치로 돌아갑니다.|A released element returns to its origin.
Snap Point|snappoint|연속 위치 대신 지정된 정착점에 맞춥니다.|Movement settles at predefined positions.
Drag-to-dismiss|dismiss|카드를 끌어 화면에서 제거합니다.|A card is dragged away to dismiss it.
Pull-to-refresh Motion|pull|당기기 입력과 갱신 표시의 관계입니다.|Pull input is connected to a refresh indicator.
Squash and Stretch|squash|동작에 따라 눌림과 늘어남을 표현합니다.|A moving shape alternately compresses and stretches.
Anticipation|anticipation|본동작 전에 반대 방향으로 준비합니다.|Preparation moves opposite to the main action.
Follow-through|follow|본체 뒤를 보조 부분이 따라갑니다.|Secondary parts follow the main body.
Secondary Motion|secondary|주 동작을 보완하는 작은 움직임입니다.|A smaller movement supports the main action.
Motion Arc|arc|움직임이 직선 대신 곡선을 따릅니다.|Motion follows a curved trajectory.
Shared Element Transition|shared|두 화면에서 같은 요소의 연결을 유지합니다.|The same element remains continuous across views.
Container Transform|container|한 표면이 다른 표면으로 확장됩니다.|One surface expands into another.
Layout Animation|layout|배치가 바뀌는 동안 위치를 연결합니다.|Positions are connected while layout changes.
Expand / Collapse Motion|expand|콘텐츠 영역의 크기를 단계적으로 바꿉니다.|A content region expands or collapses.
Page Transition|page|페이지 사이의 퇴장과 진입을 표현합니다.|A page exits while another enters.
Focus Transition|focus|입력 초점이 이동하는 경로를 표시합니다.|A visible focus indicator moves between controls.
Progress Interpolation|progress|완료율 변경을 연속값으로 연결합니다.|Completion changes are interpolated continuously.
Success Check Animation|check|성공 표시의 선을 순서대로 드러냅니다.|A success mark is revealed along its stroke.
Notification Arrival Motion|notification|새 알림이 화면에 들어오는 예시입니다.|A new notification enters the interface.
`,waveMotion,{interactive:true});
