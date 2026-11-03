async () => {
 const bucket='/accounts/'+accountId+'/r2/buckets/atlas-gallery-assets/objects/';
 const get=key=>cloudflare.request({method:'GET',path:bucket+'releases/v318/'+key});
 const put=async(key,body,contentType)=>{
  const r=await cloudflare.request({method:'PUT',path:bucket+'releases/v319/'+key,body,rawBody:true,contentType});
  if(!r.success)throw Error(key+' upload failed '+JSON.stringify(r.errors));
  return {key,size:r.result.size,etag:r.result.etag};
 };
 const [original,catRaw,covRaw,statusRaw,src]=await Promise.all([
  get('index.html'),get('data/atlas.json'),get('data/preview-coverage.json'),
  get('data/implementation-status.json'),
  cloudflare.request({method:'GET',path:bucket+'releases/v319/assets/atlas-v319.js'})
 ]);
 const decode=x=>typeof x==='string'?JSON.parse(x):x,cat=decode(catRaw),cov=decode(covRaw),status=decode(statusRaw);
 const matches=[...src.matchAll(/\['(dar-[a-f0-9]+)','(map-[a-z]+)','([^']+)','([^']+)'\]/g)];
 const entries=matches.map(m=>({id:m[1],key:m[2],en:m[3],ko:m[4]}));
 if(entries.length!==16||new Set(entries.map(e=>e.id)).size!==16||new Set(entries.map(e=>e.key)).size!==16)throw Error('Source targets are not 16 distinct canonical IDs');
 const match=original.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/);
 if(!match)throw Error('App embedded catalog absent');
 const embedded=JSON.parse(match[1]);
 if(cat.entries.length!==2153||embedded.entries.length!==2156||cat.total!==2153||status.version!=='3.18.0'||status.remainingConceptDiagrams!==734||cov.previewModes.native!==611)throw Error('Production 3.18 baseline does not match');
 for(const e of entries){
  const a=cat.entries.find(x=>x.id===e.id),b=embedded.entries.find(x=>x.id===e.id),c=cov.entries.find(x=>x.id===e.id);
  if(!a||!b||!c||c.mode!=='diagram'||a.live_key||b.live_key||a.en!==e.en||b.ko!==e.ko)throw Error('ID already implemented or mismatched: '+e.id);
  for(const x of [a,b]){
   x.live_key=e.key;x.aliases=((x.aliases||'')+' atlaslive atlasv319').trim();
   x.implementation={release:'3.19.0',kind:'original-browser-map-and-procedural-study',key:e.key,runtime:'HTML / CSS / SVG / JavaScript',scope:'Interactive browser demonstrations with synthetic data or explicit map-coordinate formulas. Not external map tiles, GPS, geographic analysis service, or certified geodesic GIS.',network:'none'};
  }
  c.mode='native';c.specific=true;c.directInteractive=true;c.key=e.key;
 }
 cat.version='3.19.0';cat.updated='2026-11-03';embedded.version='3.19.0';embedded.updated='2026-11-03';
 cov.version='3.19.0';cov.previewModes={...cov.previewModes,native:627,diagram:718};
 const expectedModeCounts={native:627,exact:777,'legacy-exact':2,effect:29,diagram:718},actualCounts={};
 cov.entries.forEach(x=>actualCounts[x.mode]=(actualCounts[x.mode]||0)+1);
 if(Object.entries(expectedModeCounts).some(([k,v])=>actualCounts[k]!==v))throw Error('Preview counting error '+JSON.stringify(actualCounts));
 Object.assign(status,{version:'3.19.0',newInteractive:16,upgradedExisting:16,upgradedFrom:{diagram:16},addedConcepts:0,directInteractive:579,uniqueRecipes:567,specificPreviews:1435,remainingConceptDiagrams:718,previewModes:{...cov.previewModes},previousRelease:'3.18.0',
  verification:'신규 지도·GIS·절차 생성 16개는 독자적인 SVG/JavaScript 원리 시연입니다. 구문과 규칙 검사 461개 성공. 실제 전체 브라우저·화면·접근성 검사는 별도 결과를 확인하세요.',
  qa:{algorithm:'461 algorithm, registry, standalone export and syntax checks passed',staging:'Pending',production:'Pending',limitations:'Original synthetic examples; no external tile server/GPS, no vendor GIS equivalence.'},
  entries:entries.map(e=>({...e,kind:'browser-svg',group:['map-wang','map-seed','map-simplex','map-wfc','map-dem','map-erosion','map-flow'].includes(e.key)?'타일맵·절차 생성·탐색':'지도 시각화·지리정보',isNew:false,
   koHint:'가상 지도 데이터와 절차 규칙을 직접 조작하는 SVG 예제입니다. 실제 지오데식 거리 또는 GPS 서비스가 아닙니다.',
   enHint:'Original interactive SVG map study with synthetic data or explicit formulas; not a GPS or production GIS service.'}))
 });
 let html=original.replace(match[1],JSON.stringify(embedded).replace(/</g,'\\u003c'));
 const last='<script src="/assets/atlas-v318.js?v=3.18.0"></script>';
 if(!html.includes(last)||!html.includes("collection==='v318'?'atlasv318'")||!html.includes('"v317","v318","new35"'))throw Error('Missing v318 app upgrade markers');
 html=html.replace(last,last+'\n<script src="/assets/atlas-v319.js?v=3.19.0"></script>');
 html=html.replace("collection==='v318'?'atlasv318'","collection==='v319'?'atlasv319':collection==='v318'?'atlasv318'");
 html=html.replace('"v317","v318","new35"','"v317","v318","v319","new35"');
 const nav='data-atlas-collection="v318">';
 if(!html.includes(nav))throw Error('Previous release navigation missing');
 html=html.replace(nav,'data-atlas-collection="v319">'+String.fromCharCode(39)+'+tr('+String.fromCharCode(39)+'신규 지도·타일 16개'+String.fromCharCode(39)+','+String.fromCharCode(39)+'16 new map and tile studies'+String.fromCharCode(39)+')+'+String.fromCharCode(39)+'</button><button type="button" data-atlas-collection="v318">');
 html=html.replace(/전체 직접 조작 563개/g,'전체 직접 조작 579개').replace(/All 563 interactive cards/g,'All 579 interactive cards');
 const updated=JSON.parse(html.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 if(updated.entries.filter(e=>e.aliases?.includes('atlasv319')).length!==16||!html.includes('data-atlas-collection="v319"'))throw Error('Embedding v319 failed');
 const manifest={version:'3.19.0',canonical:2153,newInteractive:16,upgraded:16,interactive:579,uniqueRecipes:567,specific:1435,planned:718,previewModes:expectedModeCounts,release:'staging-prepared',previousRelease:'3.18.0',entries,disclaimer:'Original learning examples using synthetic map data, not production GIS or GPS.'};
 const files=[
  ['data/atlas.json',JSON.stringify(cat),'application/json'],
  ['data/preview-coverage.json',JSON.stringify(cov),'application/json'],
  ['data/implementation-status.json',JSON.stringify(status),'application/json'],
  ['data/implemented319.json',JSON.stringify({version:'3.19.0',entries}),'application/json'],
  ['data/release-v319.json',JSON.stringify(manifest),'application/json'],
  ['index.html',html,'text/html']
 ];
 const uploads=[];for(const [k,body,type] of files)uploads.push(await put(k,body,type));
 return {version:'3.19.0',upgraded:entries.length,counts:actualCounts,hasScript:html.includes('/assets/atlas-v319.js?v=3.19.0'),hasPreset:html.includes('"v318","v319","new35"'),uploads};
}