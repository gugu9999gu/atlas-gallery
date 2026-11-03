async () => {
 const b='/accounts/'+accountId+'/r2/buckets/atlas-gallery-assets/objects/';
 const original=await cloudflare.request({method:'GET',path:b+'releases/v319/worker.mjs'});
 let w=original;
 function replace(from,to){if(!w.includes(from))throw Error('Missing baseline Worker marker: '+from.slice(0,90));w=w.replace(from,to);}
 replace("const VERSION='3.19.0',BASE='https://atlas-gallery.app',PREFIX='releases/v319/'","const VERSION='3.20.0',BASE='https://atlas-gallery.app',PREFIX='releases/v320/'");
 replace("const assets={'/assets/atlas-v319.js':","const assets={'/assets/atlas-v320.js':'application/javascript; charset=utf-8','/data/implemented320.json':'application/json; charset=utf-8','/data/release-v320.json':'application/json; charset=utf-8','/assets/atlas-v319.js':");
 replace("||await env.STATIC.get('releases/v318/'+key)","||await env.STATIC.get('releases/v319/'+key)||await env.STATIC.get('releases/v318/'+key)");
 replace('<script src="/assets/atlas-v319.js?v=3.19.0"></script>','<script src="/assets/atlas-v319.js?v=3.19.0"></script><script src="/assets/atlas-v320.js?v=3.20.0"></script>');
 replace("'/data/release-v319.json'].includes(path)","'/data/release-v319.json','/data/release-v320.json'].includes(path)");
 replace('579 interactive reference cards using 567 distinct example implementations','595 interactive reference cards using 583 distinct example implementations');
 replace('Try 579 interactive reference cards','Try 595 interactive reference cards');
 replace('직접 조작 가능한 레퍼런스 579개','직접 조작 가능한 레퍼런스 595개');
 replace('existing tile generation, geospatial data and map-display references upgraded to interactive SVG studies.','existing web rendering, performance and animation references upgraded to interactive browser studies.');
 replace('기존 지도·GIS·절차 생성 레퍼런스 ','기존 웹 렌더링·성능·모션 레퍼런스 ');
 replace('These are original planar SVG simulations of geospatial concepts with synthetic coordinates. They are not GPS tools, a production GIS library, geodesic calculation or real location services. Existing Three.js studies remain available.','These are original interactive browser studies of frontend architecture, loading, synthetic Core Web Vitals and animation timing. No real SSR/SSG backend, bundler, production performance measurement or network timing is run. Existing Three.js and GIS studies remain available.');
 replace('이번 예제는 가상의 평면 좌표와 SVG로 지도·GIS·절차 생성 원리를 직접 조작하는 브라우저 시연입니다. 실제 위치·GPS·지오데식 거리 계산이나 상용 GIS와 동일하지 않으며 기존 Three.js 예제와 광고 설정은 유지됩니다.','이번 예제는 웹 렌더링 구조·성능 지표·브라우저 모션을 직접 조작하는 원리 시연입니다. LCP·CLS·INP는 모의 수치이며 실제 SSR·정적 사이트 생성·번들러나 네트워크 성능을 측정하지 않습니다. 기존 3D·GIS 예제와 광고 설정은 유지됩니다.');
 replace('Explore 16 new map, GIS and tiling studies','Explore 16 new frontend, performance and motion studies');
 replace('이번 지도·타일 예제 16개','이번 웹 렌더링·모션 예제 16개');
 replace('collection=v319','collection=v320');
 if(!w.includes("PREFIX='releases/v320/'")||!w.includes("get('releases/v319/'+key)")||!w.includes("/assets/atlas-v320.js?v=3.20.0")||w.length<31000)throw Error('Worker v320 output validation failed');
 const upload=await cloudflare.request({method:'PUT',path:b+'releases/v320/worker.mjs',body:w,rawBody:true,contentType:'application/javascript'});
 if(!upload.success)throw Error('R2 worker write '+JSON.stringify(upload.errors));
 const verify=await cloudflare.request({method:'GET',path:b+'releases/v320/worker.mjs'});
 if(verify!==w)throw Error('R2 Worker mismatch');
 return {version:'3.20.0',baselineChars:original.length,workerChars:w.length,r2Key:upload.result?.key,verified:true};
}