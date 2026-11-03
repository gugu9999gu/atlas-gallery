async () => {
 const bucket='/accounts/'+accountId+'/r2/buckets/atlas-gallery-assets/objects/';
 const read=key=>cloudflare.request({method:'GET',path:bucket+'releases/v319/'+key});
 const upload=async(key,body,type)=>{
  const r=await cloudflare.request({method:'PUT',path:bucket+'releases/v320/'+key,body,rawBody:true,contentType:type});
  if(!r.success)throw Error('Upload '+key+' '+JSON.stringify(r.errors));
  return {key,bytes:r.result.size,etag:r.result.etag};
 };
 const [oldHtml,rawCat,rawCov,rawStatus,source]=await Promise.all([
  read('index.html'),read('data/atlas.json'),read('data/preview-coverage.json'),read('data/implementation-status.json'),
  cloudflare.request({method:'GET',path:bucket+'releases/v320/assets/atlas-v320.js'})
 ]);
 const decode=v=>typeof v==='string'?JSON.parse(v):v,cat=decode(rawCat),cov=decode(rawCov),status=decode(rawStatus);
 const items=[...source.matchAll(/\['(dar-[a-f0-9]+)','(perf-[a-z]+)','([^']+)','([^']+)'\]/g)].map(m=>({id:m[1],key:m[2],en:m[3],ko:m[4]}));
 if(items.length!==16||new Set(items.map(x=>x.id)).size!==16||new Set(items.map(x=>x.key)).size!==16)throw Error('Expected sixteen unique existing canonical items');
 const match=oldHtml.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/);
 if(!match)throw Error('Index embedded database missing');
 const inline=JSON.parse(match[1]);
 if(status.version!=='3.19.0'||status.remainingConceptDiagrams!==718||cat.total!==2153||cat.entries.length!==2153||inline.entries.length!==2156||cov.previewModes.native!==627||cov.previewModes.diagram!==718)throw Error('Deployed v319 baseline changed');
 for(const e of items){
  const c=cat.entries.find(x=>x.id===e.id),i=inline.entries.find(x=>x.id===e.id),v=cov.entries.find(x=>x.id===e.id);
  if(!c||!i||!v||v.mode!=='diagram'||c.live_key||i.live_key||c.en!==e.en||i.ko!==e.ko)throw Error('Not a planned matching definition '+e.id+' '+e.en);
  for(const r of [c,i]){
   r.live_key=e.key;r.aliases=((r.aliases||'')+' atlaslive atlasv320').trim();
   r.implementation={release:'3.20.0',kind:'original-browser-frontend-performance-study',key:e.key,runtime:'HTML / CSS / SVG / JavaScript / browser API where supported',scope:'Synthetic rendering/performance states for conceptual explanation; no real CWV measurement or actual SSR/build/bundler backend. Motion examples use browser animation APIs.',network:'none'};
  }
  v.key=e.key;v.mode='native';v.specific=true;v.directInteractive=true;
 }
 cat.version='3.20.0';cat.updated='2026-11-03';inline.version='3.20.0';inline.updated='2026-11-03';
 cov.version='3.20.0';cov.previewModes={...cov.previewModes,native:643,diagram:702};
 const actual={};cov.entries.forEach(e=>actual[e.mode]=(actual[e.mode]||0)+1);
 if(cov.entries.length!==2153||actual.native!==643||actual.diagram!==702||actual.exact!==777||actual['legacy-exact']!==2||actual.effect!==29)throw Error('Preview mode mismatch '+JSON.stringify(actual));
 Object.assign(status,{version:'3.20.0',newInteractive:16,upgradedExisting:16,upgradedFrom:{diagram:16},addedConcepts:0,directInteractive:595,uniqueRecipes:583,specificPreviews:1451,remainingConceptDiagrams:702,previewModes:{...cov.previewModes},previousRelease:'3.19.0',
  entries:items.map(e=>({...e,kind:'browser-dom',group:e.key==='perf-curve'||e.key==='perf-keyframes'||e.key==='perf-stagger'?'애니메이션·VFX 제작':'웹 렌더링·성능·상태',isNew:false,koHint:'직접 조작하는 원본 웹 렌더링·성능·모션 예제. LCP·CLS·INP는 모의값이며 실제 관측값이 아닙니다.',enHint:'Original interactive frontend demonstration. LCP/CLS/INP visuals are synthetic, not real page measurements.'})),
  verification:'2026-11-03: 기존 구현 예정 웹 렌더링·성능·모션 16개를 DOM·SVG·Web Animations/API 브라우저 시연으로 구현. 핵심 규칙 327개 소스 검사 통과. 실제 브라우저 및 운영 검증 결과는 별도 릴리스 기록을 확인하세요.',
  qa:{source:'327 JavaScript rule, catalogue and standalone-generator checks passed',staging:'not yet verified',production:'not yet deployed',limitations:'No real server-side renderer, bundler or live web-vitals collection; browser support varies.'}
 });
 let html=oldHtml.replace(match[1],JSON.stringify(inline).replace(/</g,'\\u003c'));
 const last='<script src="/assets/atlas-v319.js?v=3.19.0"></script>';
 if(!html.includes(last)||!html.includes("collection==='v319'?'atlasv319'")||!html.includes('"v318","v319","new35"'))throw Error('Missing v319 markers in index');
 html=html.replace(last,last+'\n<script src="/assets/atlas-v320.js?v=3.20.0"></script>');
 html=html.replace("collection==='v319'?'atlasv319'","collection==='v320'?'atlasv320':collection==='v319'?'atlasv319'");
 html=html.replace('"v318","v319","new35"','"v318","v319","v320","new35"');
 const nav='data-atlas-collection="v319">';
 if(!html.includes(nav))throw Error('Last release nav not found');
 html=html.replace(nav,'data-atlas-collection="v320">'+String.fromCharCode(39)+'+tr('+String.fromCharCode(39)+'신규 웹 렌더링·모션 16개'+String.fromCharCode(39)+','+String.fromCharCode(39)+'16 frontend and motion studies'+String.fromCharCode(39)+')+'+String.fromCharCode(39)+'</button><button type="button" data-atlas-collection="v319">');
 html=html.replace(/전체 직접 조작 579개/g,'전체 직접 조작 595개').replace(/All 579 interactive cards/g,'All 595 interactive cards');
 const verify=JSON.parse(html.match(/<script id="atlas-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 if(verify.entries.filter(e=>e.aliases?.includes('atlasv320')).length!==16||!html.includes('data-atlas-collection="v320"'))throw Error('Inline v320 items not found');
 const release={version:'3.20.0',canonical:2153,newInteractive:16,upgraded:16,interactive:595,uniqueRecipes:583,specific:1451,planned:702,previewModes:cov.previewModes,release:'staging-prepared',previousRelease:'3.19.0',entries:items,disclaimer:'Original frontend demos. Architecture stages and CWV numbers are synthetic and not live production metrics.'};
 const files=[
  ['data/atlas.json',JSON.stringify(cat),'application/json'],
  ['data/preview-coverage.json',JSON.stringify(cov),'application/json'],
  ['data/implementation-status.json',JSON.stringify(status),'application/json'],
  ['data/implemented320.json',JSON.stringify({version:'3.20.0',entries:items}),'application/json'],
  ['data/release-v320.json',JSON.stringify(release),'application/json'],
  ['index.html',html,'text/html']
 ];
 const results=[];for(const [path,body,type] of files)results.push(await upload(path,body,type));
 return {version:'3.20.0',items:items.length,distribution:actual,hasScript:html.includes('/assets/atlas-v320.js?v=3.20.0'),hasCollection:html.includes('data-atlas-collection="v320"'),results};
}