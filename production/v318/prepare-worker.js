async () => {
 const base='/accounts/'+accountId+'/r2/buckets/atlas-gallery-assets/objects/';
 const old=await cloudflare.request({method:'GET',path:base+'releases/v317/worker.mjs'});
 let w=old;
 function replace(before,after,required=true){
   if(!w.includes(before)){if(required)throw Error('Missing worker marker: '+before.slice(0,90));return;}
   w=w.replace(before,after);
 }
 replace("const VERSION='3.17.0',BASE='https://atlas-gallery.app',PREFIX='releases/v317/'","const VERSION='3.18.0',BASE='https://atlas-gallery.app',PREFIX='releases/v318/'");
 replace("const assets={'/assets/atlas-v317.js':","const assets={'/assets/atlas-v318.js':'application/javascript; charset=utf-8','/data/implemented318.json':'application/json; charset=utf-8','/data/release-v318.json':'application/json; charset=utf-8','/assets/atlas-v317.js':");
 replace("||await env.STATIC.get('releases/v316/'+key)","||await env.STATIC.get('releases/v317/'+key)||await env.STATIC.get('releases/v316/'+key)");
 replace('<script src="/assets/atlas-v317.js?v=3.17.0"></script>','<script src="/assets/atlas-v317.js?v=3.17.0"></script><script src="/assets/atlas-v318.js?v=3.18.0"></script>');
 replace("'/data/release-v317.json'].includes(path)","'/data/release-v317.json','/data/release-v318.json'].includes(path)");
 replace('551 interactive reference cards using 539 distinct example implementations','563 interactive reference cards using 551 distinct example implementations');
 replace('Try 551 interactive reference cards','Try 563 interactive reference cards');
 replace('직접 조작 가능한 레퍼런스 551개','직접 조작 가능한 레퍼런스 563개');
 replace('existing AI, narrative and simulation references upgraded to interactive 2D studies.','existing planar map and GIS references upgraded to interactive SVG studies.');
 replace('기존 AI·내러티브·시뮬레이션 레퍼런스 ','기존 지도·GIS·절차 생성 레퍼런스 ');
 replace('These are original in-memory 2D algorithm studies, not native game engines, trained AI models or persistent services. Dialogue is authored and telemetry records explicit demo events only. Each card states its limits. Existing Three.js studies remain available.',
  'These are original planar SVG simulations of geospatial concepts with synthetic coordinates. They are not GPS tools, a production GIS library, geodesic calculation or real location services. Existing Three.js studies remain available.');
 replace('이번 예제는 AI 판단·분기·시간 계산·절차 생성을 직접 조작하는 2D 브라우저 시연입니다. 네이티브 게임 엔진이나 학습 모델이 아니며 상태는 메모리에만 유지됩니다. 대화는 작성된 분기이고 계측은 직접 입력한 가상 사건만 기록합니다. 기존 Three.js 예제는 유지됩니다.',
  '이번 예제는 가상의 평면 좌표와 SVG로 지도·GIS·절차 생성 원리를 직접 조작하는 브라우저 시연입니다. 실제 위치·GPS·지오데식 거리 계산이나 상용 GIS와 동일하지 않으며 기존 Three.js 예제와 광고 설정은 유지됩니다.');
 replace('Explore the 24 new AI and simulation studies','Explore 12 new map and GIS studies');
 replace('이번 AI·시뮬레이션 예제 24개','이번 지도·GIS 예제 12개');
 replace('collection=v317','collection=v318');
 if(w.length<30000||!w.includes('PREFIX=')||w.includes("const VERSION='3.17.0'"))throw Error('Worker source integrity failed');
 const r=await cloudflare.request({method:'PUT',path:base+'releases/v318/worker.mjs',body:w,rawBody:true,contentType:'application/javascript; charset=utf-8'});
 if(!r.success)throw Error(JSON.stringify(r.errors));
 const got=await cloudflare.request({method:'GET',path:base+'releases/v318/worker.mjs'});
 return {sourceChars:old.length,modifiedChars:w.length,validated:got===w,upload:{key:r.result.key,etag:r.result.etag,size:r.result.size},markers:{v318main:w.includes("PREFIX='releases/v318/'"),hasSource:w.includes('/assets/atlas-v318.js?v=3.18.0'),priorFallback:w.includes("get('releases/v317/'+key)"),statusLink:w.includes('collection=v318')}};
}