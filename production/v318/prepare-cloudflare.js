async () => {
 const base='/accounts/'+accountId+'/r2/buckets/atlas-gallery-assets/objects/';
 const read=key=>cloudflare.request({method:'GET',path:base+'releases/v317/'+key});
 const upload=async(key,body,type)=>{
   const r=await cloudflare.request({method:'PUT',path:base+'releases/v318/'+key,body,rawBody:true,contentType:type});
   if(!r.success)throw Error(key+' upload: '+JSON.stringify(r.errors));
   return {key,bytes:Number(r.result.size),etag:r.result.etag};
 };
 const [htmlBase,catRaw,covRaw,statusRaw,source]=await Promise.all([
   read('index.html'),read('data/atlas.json'),read('data/preview-coverage.json'),
   read('data/implementation-status.json'),
   cloudflare.request({method:'GET',path:base+'releases/v318/assets/atlas-v318.js'})
 ]);
 const entries=[...source.matchAll(/\['(dar-[a-f0-9]+)','(geo-[a-z]+)','([^']+)','([^']+)'\]/g)]
  .map(m=>({id:m[1],key:m[2],en:m[3],ko:m[4]}));
 if(entries.length!==12||new Set(entries.map(e=>e.id)).size!==12||new Set(entries.map(e=>e.key)).size!==12)throw Error('Bad source IDs');
 const catalog=JSON.parse(catRaw),cov=JSON.parse(covRaw),status=JSON.parse(statusRaw);
 const embedMatch=htmlBase.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/);
 if(!embedMatch)throw Error('Missing embedded catalog');
 const embedded=JSON.parse(embedMatch[1]);
 if(catalog.entries.length!==2153||embedded.entries.length!==2156||catalog.total!==2153||status.remainingConceptDiagrams!==746)throw Error('Baseline changed unexpectedly');
 for(const e of entries){
   const a=catalog.entries.find(x=>x.id===e.id),b=embedded.entries.find(x=>x.id===e.id),v=cov.entries.find(x=>x.id===e.id);
   if(!a||!b||!v||v.mode!=='diagram'||a.live_key||b.live_key||a.en!==e.en||b.ko!==e.ko)throw Error('Target not planned canonical '+e.id);
   for(const x of [a,b]){
     x.live_key=e.key;
     x.aliases=((x.aliases||'')+' atlaslive atlasv318').trim();
     x.implementation={release:'3.18.0',kind:'original-planar-map-interaction',key:e.key,runtime:'HTML / SVG / CSS / JavaScript',scope:'Synthetic planar coordinates; no GPS, real-world distance, geodesic geometry or external mapping API. Explicit scope per card.',network:'none'};
   }
   v.mode='native';v.specific=true;v.directInteractive=true;v.key=e.key;
 }
 catalog.version='3.18.0';catalog.updated='2026-11-03';embedded.version='3.18.0';embedded.updated='2026-11-03';
 cov.version='3.18.0';
 cov.previewModes={...cov.previewModes,native:611,diagram:734};
 Object.assign(status,{version:'3.18.0',newInteractive:12,upgradedExisting:12,addedConcepts:0,directInteractive:563,uniqueRecipes:551,specificPreviews:1419,remainingConceptDiagrams:734,previewModes:{...cov.previewModes},previousRelease:'3.17.0',
  entries:entries.map(e=>({...e,kind:'browser-svg',group:e.key==='geo-voronoi'||e.key==='geo-perlin'||e.key==='geo-fbm'||e.key==='geo-bsp'?'타일맵·절차 생성·탐색':'지도 시각화·지리정보',isNew:false,koHint:'가상 평면 좌표와 SVG로 직접 조작하는 지도·GIS 원리 시연입니다. 실제 위치나 지리 서비스와 연결되지 않습니다.',enHint:'Interactive browser demonstration with synthetic planar geometry. No GPS or real geospatial service.'})),
  verification:'2026-11-03: 기존 미구현 항목 12개에 원본 브라우저 기반 평면 지도·공간 연산을 연결했습니다. 소스 구문과 알고리즘·독립 HTML 생성 테스트 통과. 이 기록은 전 브라우저·모든 화면 조합이나 상용 GIS 정확도 인증이 아닙니다.'
 });
 const modeCount={};cov.entries.forEach(e=>modeCount[e.mode]=(modeCount[e.mode]||0)+1);
 if(cov.entries.length!==2153||modeCount.native!==611||modeCount.diagram!==734||catalog.entries.length!==2153||embedded.entries.length!==2156)throw Error('Coverage arithmetic invalid '+JSON.stringify(modeCount));
 let html=htmlBase.replace(embedMatch[1],JSON.stringify(embedded).replace(/</g,'\\u003c'));
 const oldScript='<script src="/assets/atlas-v317.js?v=3.17.0"></script>';
 if(!html.includes(oldScript)||!html.includes("collection==='v317'?'atlasv317'")||!html.includes('"v317","new35"'))throw Error('App release markers missing');
 html=html.replace(oldScript,oldScript+'\n<script src="/assets/atlas-v318.js?v=3.18.0"></script>');
 html=html.replace("collection==='v317'?'atlasv317'","collection==='v318'?'atlasv318':collection==='v317'?'atlasv317'");
 html=html.replace('"v317","new35"','"v317","v318","new35"');
 const nav='data-atlas-collection="v317">';
 if(!html.includes(nav))throw Error('Existing release nav missing');
 html=html.replace(nav,'data-atlas-collection="v318">'+String.fromCharCode(39)+'+tr('+String.fromCharCode(39)+'신규 지도·GIS 12개'+String.fromCharCode(39)+','+String.fromCharCode(39)+'12 new map/GIS studies'+String.fromCharCode(39)+')+'+String.fromCharCode(39)+'</button><button type="button" data-atlas-collection="v317">');
 html=html.replace(/전체 직접 조작 551개/g,'전체 직접 조작 563개').replace(/All 551 interactive cards/g,'All 563 interactive cards');
 const parsed=JSON.parse(html.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 if(parsed.entries.filter(e=>e.aliases?.includes('atlasv318')).length!==12||!html.includes('data-atlas-collection="v318"'))throw Error('Post-build app validation failed');
 const preview={version:'3.18.0',upgradedExisting:12,canonical:2153,interactive:563,uniqueRecipes:551,specific:1419,planned:734,release:'staging-prepared',previousRelease:'3.17.0',entries,notice:'Original planar demos, not geodesic GIS implementation.'};
 const tasks=[
   ['data/atlas.json',JSON.stringify(catalog),'application/json'],
   ['data/preview-coverage.json',JSON.stringify(cov),'application/json'],
   ['data/implementation-status.json',JSON.stringify(status),'application/json'],
   ['data/implemented318.json',JSON.stringify({version:'3.18.0',entries}),'application/json'],
   ['data/release-v318.json',JSON.stringify(preview),'application/json'],
   ['index.html',html,'text/html']
 ];
 const uploads=[];for(const [key,body,type] of tasks)uploads.push(await upload(key,body,type));
 return {version:'3.18.0',entries:entries.length,counts:modeCount,hasScript:html.includes('/assets/atlas-v318.js?v=3.18.0'),hasPreset:html.includes('"v317","v318","new35"'),uploads};
}