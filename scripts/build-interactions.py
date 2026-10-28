"""Build v3.2 from the existing reviewed sources; no credentials or network calls.
The gallery and exported examples share the same renderers. npm vendors pinned Three.js.
"""
from pathlib import Path
from collections import Counter
import json, re, hashlib, html, shutil
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'
VERSION='3.2.0'
DATE='2026-10-28'
ORIGIN='https://atlas-gallery.app'

def load(name):return json.loads((ROOT/'data'/name).read_text(encoding='utf-8'))
def embed(v):return json.dumps(v,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')
def esc(v):return html.escape(str(v or ''),quote=True)
def minimum_css(s):
    s=re.sub(r'(font-size\s*:\s*)(\d*\.?\d+)px',lambda m:m[1]+str(max(14,float(m[2]))).removesuffix('.0')+'px',s,flags=re.I)
    s=re.sub(r'(font\s*:\s*[^;{}]*?)(\d*\.?\d+)px(?=[/\s])',lambda m:m[1]+str(max(14,float(m[2]))).removesuffix('.0')+'px',s,flags=re.I)
    return s

def merge():
    db=load('atlas-gallery-bilingual.json');lang=load('i18n.json')
    category_names={'호버·포커스':'Hover and focus','포인터 추적':'Pointer tracking','클릭·탭 피드백':'Click and tap feedback','드래그·제스처':'Drag and gesture','실시간 3D':'Real-time 3D'}
    existing={e['en'].lower():e for e in db['entries'] if not e.get('canonical_id')}
    added=[];upgraded=[]
    for line in (ROOT/'data/interaction-recipes.tsv').read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):continue
        key,en,ko,engine,category,description,english=line.split('|')
        if en.lower() in existing:
            e=existing[en.lower()];upgraded.append(e['id'])
        else:
            e={'id':'atlas-ix-'+key,'domain':'인터랙션 실습','category':category,'kind':'용어·패턴','en':en,'ko':ko,'description':description,
               'usage':'카드 안에서 포인터·터치·키보드로 직접 조작하고, 코드 복사로 독립 HTML 예제를 확인합니다.',
               'notes':'직접 제작한 학습용 예제입니다. 제품 제공자의 공식 데모가 아니며, 적용 전에 접근성·성능·사용 목적을 검토하세요.',
               'ecosystem':'Three.js 0.180.0 / WebGL' if engine=='three' else 'HTML / CSS / JavaScript / Pointer Events',
               'aliases':en+'; '+ko,'source_url':'https://threejs.org/docs/' if engine=='three' else 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events',
               'source_scope':'구현 API 참고문서','source_status':'공식 링크 수록·개별 본문 미확인','source_checked_on':'',
               'origin':'ATLAS original interactive example','group':'concepts','term_class':'설명형 실무 명칭','related_ids':[],
               'translations':{'en':{'description':english,'usage':'Interact with pointer, touch or keyboard inside the card. Copy code produces a standalone HTML example.',
                 'notes':'An original learning example, not an official vendor demo. Review accessibility, performance and product requirements before reuse.'}}}
            db['entries'].append(e);existing[en.lower()]=e;added.append(e['id'])
        e['demo']={'key':key,'engine':engine,'version':VERSION,'input':['pointer','touch','keyboard'],'code':'standalone-html','category':category}
        e['preview']={'engine':'three-webgl' if engine=='three' else 'dom-interactive','key':key,'classification':'interactive','sampleData':False}
        e['modified_on']=DATE
    for category,english in category_names.items():
        if not any(c['name']==category and c.get('domain')=='인터랙션 실습' for c in db['categories']):
            db['categories'].append({'id':'IX'+str(list(category_names).index(category)+1),'name':category,'domain':'인터랙션 실습','count':0})
        lang['en']['categories'][category]=english
    lang['en']['domains']['인터랙션 실습']='Interaction Lab';lang['ko']['domains']['인터랙션 실습']='인터랙션 실습'
    canonical=[e for e in db['entries'] if not e.get('canonical_id')]
    counts=Counter((e['domain'],e['category']) for e in canonical)
    for c in db['categories']:c['count']=counts[(c.get('domain'),c['name'])]
    db['metadata']['version']=VERSION;db['metadata']['modified_on']=DATE
    db['metadata']['interaction_edition']={'version':VERSION,'total':len(added)+len(upgraded),'new':len(added),'upgraded':len(upgraded),'three':sum(e.get('demo',{}).get('engine')=='three' for e in canonical)}
    return db,lang,added,upgraded

def ref_path(e,language):return ('/en' if language=='en' else '')+'/reference/'+e['id']+'/'
def field(e,name,language):return e.get('translations',{}).get('en',{}).get(name,e.get(name,'')) if language=='en' else e.get(name,'')

def reference_document(e,language,db,lang):
    english=language=='en';name=e['en'] if english else e['ko'];title=name+' — ATLAS Gallery'
    path=ref_path(e,language);url=ORIGIN+path;other=ref_path(e,'ko' if english else 'en')
    definition=field(e,'description',language);usage=field(e,'usage',language);notes=field(e,'notes',language)
    category=lang[language]['categories'].get(e['category'],e['category']);domain=lang[language]['domains'].get(e['domain'],e['domain'])
    glossary=('/en' if english else '')+'/references/'
    aliases=e.get('aliases',[]);aliases=[x.strip() for x in re.split('[;|,]',aliases) if x.strip()] if isinstance(aliases,str) else aliases
    sources=[]
    if e.get('source_url'):sources.append({'title':'Reference document' if english else '참고 문서','url':e['source_url']})
    for s in e.get('sources',[]):
        if isinstance(s,dict) and s.get('url') and s['url'] not in [x['url'] for x in sources]:sources.append(s)
    sources=[s for s in sources if re.match(r'^https?://',s['url'])]
    structured={'@context':'https://schema.org','@graph':[
        {'@type':'WebPage','@id':url+'#page','url':url,'name':title,'inLanguage':language,'dateModified':e.get('modified_on',DATE),'mainEntity':{'@id':url+'#term'},'isPartOf':{'@id':ORIGIN+'/#website'}},
        {'@type':'DefinedTerm','@id':url+'#term','name':name,'alternateName':list(dict.fromkeys([e['en'],e['ko']]+aliases)), 'description':definition,'termCode':e['id'],'url':url,'inDefinedTermSet':{'@type':'DefinedTermSet','@id':ORIGIN+glossary,'name':'ATLAS Gallery Design Reference Atlas','url':ORIGIN+glossary}},
        {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'ATLAS Gallery','item':ORIGIN+'/'},{'@type':'ListItem','position':2,'name':'References' if english else '용어 색인','item':ORIGIN+glossary},{'@type':'ListItem','position':3,'name':name,'item':url}]}]}
    example_label=('Three.js / real WebGL' if english else 'Three.js / 실제 WebGL') if e.get('demo',{}).get('engine')=='three' else ('Interactive HTML / CSS / JavaScript' if english else '직접 조작하는 HTML / CSS / JavaScript') if e.get('demo') else ('Illustrative study, not original product code' if english else '설명용 시각 예시 · 제품 원본 코드가 아닙니다')
    code_note='The gallery card provides a direct Copy code button. New interactive examples export the same runnable implementation; older concepts export the illustrative preview, not the referenced library itself.' if english else '갤러리 카드의 코드 복사 버튼에서 바로 복사할 수 있습니다. 직접 조작 예제는 같은 실행 구현을, 기존 개념 항목은 설명용 미리보기 코드를 제공합니다. 라이브러리 자체의 원본 코드를 뜻하지 않습니다.'
    sibling_ids=list(dict.fromkeys(e.get('compare_ids',[])+e.get('related_ids',[])))[:8]
    index={x['id']:x for x in db['entries']}
    relatives=[index[i] for i in sibling_ids if i in index and not index[i].get('canonical_id') and i!=e['id']]
    relatives_html=''.join('<li><a href="'+ref_path(x,language)+'">'+esc(x['en'] if english else x['ko'])+'</a></li>' for x in relatives)
    source_html=''.join('<li><a rel="noopener noreferrer" href="'+esc(s['url'])+'">'+esc(s.get('title') or s['url'])+'</a></li>' for s in sources)
    source_status=lang[language].get('status',{}).get(e.get('source_status',''),e.get('source_status',''))
    demo_html=''
    if e.get('demo'):
        recipe={**e['demo'],'title':e['en']}
        demo_html='<div id="reference-demo" class="ix-demo"></div><button type="button" id="reference-copy">'+('Copy example code' if english else '예제 코드 복사')+'</button><span id="copy-status" role="status"></span><script src="/assets/interaction-kit.js" defer></script><script type="application/json" id="reference-recipe">'+embed(recipe)+'</script><script src="/assets/reference-demo.js" defer></script>'
    body=f'''<nav aria-label="{'Breadcrumb' if english else '현재 위치'}"><a href="/?lang={language}">ATLAS</a><span> / </span><a href="{glossary}">{'References' if english else '용어 색인'}</a></nav><main><header><p class="eyebrow">{esc(domain)} / {esc(category)}</p><h1>{esc(name)}</h1><p class="alternate">{esc(e['ko'] if english else e['en'])}</p><p class="definition">{esc(definition)}</p><div class="actions"><a class="primary" href="/?lang={language}#term={esc(e['id'])}">{'Open gallery example' if english else '갤러리 예제 열기'} →</a><a href="{other}">{'한국어' if english else 'English'}</a><a href="{path}index.md">Markdown</a></div></header><section><h2>{'When to use it' if english else '어디에 사용하나요?'}</h2><p>{esc(usage)}</p></section><section><h2>{'Distinctions and cautions' if english else '구분할 점과 주의사항'}</h2><p>{esc(notes)}</p>{('<p>'+esc(field(e,'difference',language))+'</p>') if e.get('difference') else ''}</section><section><h2>{'Example and code' if english else '미리보기와 코드'}</h2><p class="badge">{esc(example_label)}</p><p>{code_note}</p>{demo_html}</section>{('<section><h2>'+('Related references' if english else '관련 레퍼런스')+'</h2><ul>'+relatives_html+'</ul></section>') if relatives else ''}<section><h2>{'Sources and editorial scope' if english else '출처와 편집 범위'}</h2><ul>{source_html}</ul><p>{esc(source_status)}</p><p>{'Definitions and translations are edited by ATLAS. Reference links are not endorsements or proof that every sentence is quoted from the linked source. The examples use synthetic content.' if english else '정의와 번역은 ATLAS가 편집한 설명입니다. 참고 링크가 제공자의 인증이나 모든 문장의 직접 인용을 의미하지 않습니다. 예시 값은 가상 데이터입니다.'}</p></section><dl><dt>ID</dt><dd>{esc(e['id'])}</dd><dt>{'Implementation environment' if english else '구현 환경'}</dt><dd>{esc(e.get('ecosystem'))}</dd><dt>{'Last edited' if english else '최종 편집일'}</dt><dd>{esc(e.get('modified_on',DATE))}</dd></dl></main><footer><a href="/about.html?lang={language}">{'About and sources' if english else '소개·출처'}</a> · <a href="/privacy.html?lang={language}">{'Privacy' if english else '개인정보 안내'}</a><p>스투피아드 · 868-24-02133 · 2026-화성동탄-0527</p></footer>'''
    doc=f'''<!doctype html><html lang="{language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(definition[:250])}"><link rel="canonical" href="{url}"><link rel="alternate" hreflang="ko" href="{ORIGIN+ref_path(e,'ko')}"><link rel="alternate" hreflang="en" href="{ORIGIN+ref_path(e,'en')}"><link rel="alternate" hreflang="x-default" href="{ORIGIN+ref_path(e,'ko')}"><link rel="alternate" type="text/markdown" href="{url}index.md"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:type" content="article"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(definition[:250])}"><meta property="og:url" content="{url}"><link rel="stylesheet" href="/assets/reference.css"><link rel="stylesheet" href="/assets/interaction-style.css"><script type="application/ld+json">{embed(structured)}</script></head><body>{body}</body></html>'''
    md=f'''# {name}\n\n{e['en']} / {e['ko']}\n\nCanonical: {url}\nID: {e['id']}\nLanguage: {language}\nCategory: {domain} / {category}\nLast edited: {e.get('modified_on',DATE)}\n\n## {'Definition' if english else '정의'}\n\n{definition}\n\n## {'Usage' if english else '사용처'}\n\n{usage}\n\n## {'Cautions' if english else '주의사항'}\n\n{notes}\n\n## {'Example' if english else '예제'}\n\n{example_label}\n{code_note}\nGallery: {ORIGIN}/?lang={language}#term={e['id']}\n\n## {'Sources' if english else '출처'}\n\n'''+''.join('- '+s.get('title','Reference')+': '+s['url']+'\n' for s in sources)
    return doc,md

REFERENCE_CSS='''*{box-sizing:border-box}html{font-size:16px}body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:16px;line-height:1.8;background:#f6f8fc;color:#17223b;margin:0}nav,main,footer{max-width:960px;margin:auto;padding:24px}nav{font-size:16px}main{background:white;border:1px solid #dde4ee;border-radius:20px;padding:40px}h1{font-size:clamp(28px,5vw,44px);line-height:1.25;margin:8px 0}h2{font-size:24px;line-height:1.4}p,li,dd,dt,a,button,code,pre,small{font-size:max(14px,1em)}p{overflow-wrap:anywhere}section{margin:36px 0}.definition{font-size:19px;line-height:1.8}.eyebrow,.badge{font-size:14px;color:#325790}.alternate{color:#536079;font-size:18px}.actions{display:flex;flex-wrap:wrap;gap:20px;align-items:center}.primary,button{border:1px solid #c5d3e6;padding:12px 18px;border-radius:10px;background:#eaf2ff;color:#174781;font-size:16px}.primary{background:#2159d2;color:white;text-decoration:none}a{color:#174fbc;text-underline-offset:4px}a:focus-visible,button:focus-visible{outline:3px solid #ffb400;outline-offset:4px}li{margin:8px 0}ul{padding-left:24px}dl{border-top:1px solid #dde4ee;padding-top:24px}dt{font-weight:700}dd{margin:0 0 16px;overflow-wrap:anywhere}.ix-demo{height:360px;border-radius:18px;overflow:hidden;margin:20px 0}footer{color:#526079;font-size:14px}.term-index{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:14px;list-style:none;padding:0}.term-index li{border:1px solid #dde4ee;border-radius:10px;padding:14px}.term-index a{font-size:16px}.term-index span{display:block;font-size:14px}@media(max-width:600px){nav,main,footer{padding:20px}main{border-radius:0}.definition{font-size:17px}.ix-demo{height:300px}}'''
REFERENCE_DEMO='''document.addEventListener('DOMContentLoaded',()=>{const p=JSON.parse(document.getElementById('reference-recipe').textContent),lang=document.documentElement.lang;AtlasKit.mount(document.getElementById('reference-demo'),p,lang);document.getElementById('reference-copy').addEventListener('click',async()=>{const s=document.getElementById('copy-status');try{const r=await fetch('/assets/interaction-style.css');if(!r.ok)throw new Error('style');const code=AtlasKit.code(p,lang,await r.text());await navigator.clipboard.writeText(code);s.textContent=lang==='ko'?' 복사되었습니다.':' Copied.';}catch{s.textContent=lang==='ko'?' 복사 권한을 확인하거나 갤러리에서 복사하세요.':' Check clipboard permission or copy from the gallery.';}});});'''

def main():
    db,lang,added,upgraded=merge();canonical=[e for e in db['entries'] if not e.get('canonical_id')]
    css='\n'.join((ROOT/'src'/p).read_text(encoding='utf-8') for p in ['style.css','advertising.css','interactive/style.css','interactive/layout.css'])
    css=minimum_css(css)
    app=(ROOT/'src/app.js').read_text(encoding='utf-8')
    modules='\n'.join((ROOT/'src/previews'/name).read_text(encoding='utf-8') for name in ['core.js','motion.js','vfx.js','maps.js','model.js','finalize.js'])
    app=app.replace('/*__WAVE_MODULES__*/',modules).replace('/*__ADFIT_MODULE__*/',(ROOT/'src/advertising.js').read_text(encoding='utf-8'))
    old="previewFilter==='all'||(previewFilter==='expanded'?waveRegistry.has(e.en):(previewFilter==='specific')===referenceView(e).specific)"
    new="previewFilter==='all'||(previewFilter==='interactive'?!!e.demo:previewFilter==='three'?e.demo?.engine==='three':(previewFilter==='expanded'?waveRegistry.has(e.en):(previewFilter==='specific')===referenceView(e).specific))"
    if old not in app:raise RuntimeError('Expected preview filter not found')
    app=app.replace(old,new)
    bridge=(ROOT/'src/interactive/bridge.js').read_text(encoding='utf-8')
    if app.count('\ninit();\n')!=1:raise RuntimeError('Expected one app init')
    app=app.replace('\ninit();\n','\n'+bridge+'\ninit();enhanceInit();\n')
    app=re.sub(r'font-size="\$\{size\}"','font-size="${Math.max(14,size)}"',app)
    text=(ROOT/'src/layout.html').read_text(encoding='utf-8')
    for marker,v in [('ATLAS_DATA',db),('ATLAS_I18N',lang),('ATLAS_ADS',load('advertising.json'))]:text=text.replace('/*__'+marker+'__*/',embed(v))
    text=text.replace('/*__STYLE_0__*/',css)
    kit=(ROOT/'src/interactive/kit.js').read_text(encoding='utf-8')
    kit_prefix='<script>'+kit+'</script>\n<script>window.ATLAS_INTERACTION_CSS='+embed((ROOT/'src/interactive/style.css').read_text(encoding='utf-8'))+';</script>\n'
    text=text.replace('<script>\n/*__APP_0__*/',kit_prefix+'<script>\n/*__APP_0__*/')
    if 'window.ATLAS_INTERACTION_CSS' not in text:text=text.replace('<script>/*__APP_0__*/',kit_prefix+'<script>/*__APP_0__*/')
    text=text.replace('/*__APP_0__*/',app)
    if re.search(r'/\*__(?:ATLAS_|APP_|STYLE_|ADFIT_|WAVE_)',text):raise RuntimeError('Unreplaced placeholder')
    text=text.replace('</head>','<link rel="alternate" type="text/plain" href="/llms.txt"><link rel="alternate" type="application/json" href="/catalog.json"></head>')
    text=text.replace('<noscript>','<noscript><p><a href="/references/">전체 용어 설명 / All reference definitions</a></p>',1)
    OUT.mkdir(exist_ok=True);(OUT/'index.html').write_text(text,encoding='utf-8')
    asset=OUT/'assets';asset.mkdir(exist_ok=True)
    (asset/'interaction-kit.js').write_text(kit,encoding='utf-8');(asset/'interaction-style.css').write_text((ROOT/'src/interactive/style.css').read_text(encoding='utf-8'),encoding='utf-8');(asset/'reference.css').write_text(REFERENCE_CSS,encoding='utf-8');(asset/'reference-demo.js').write_text(REFERENCE_DEMO,encoding='utf-8')
    vendor=ROOT/'node_modules/three/build';target=asset/'vendor';target.mkdir(exist_ok=True)
    if vendor.exists():
        shutil.copyfile(vendor/'three.module.min.js',target/'three-0.180.0.module.min.js');shutil.copyfile(vendor/'three.core.min.js',target/'three.core.min.js');shutil.copyfile(vendor.parent/'LICENSE',target/'THREE-LICENSE.txt')
    urls=[ORIGIN+'/'];full_md=[]
    for e in canonical:
        for language in ('ko','en'):
            doc,md=reference_document(e,language,db,lang);path=ref_path(e,language);folder=OUT/path.strip('/');folder.mkdir(parents=True,exist_ok=True);(folder/'index.html').write_text(doc,encoding='utf-8');(folder/'index.md').write_text(md,encoding='utf-8');urls.append(ORIGIN+path)
            full_md.append(md)
    for language in ('ko','en'):
        folder=OUT/('en/references' if language=='en' else 'references');folder.mkdir(parents=True,exist_ok=True)
        path=('/en' if language=='en' else '')+'/references/'
        groups=[]
        for category in db['categories']:
            items=[e for e in canonical if e['category']==category['name'] and e['domain']==category['domain']]
            if not items:continue
            heading=lang[language]['categories'].get(category['name'],category['name'])
            links=''.join('<li><a href="'+ref_path(e,language)+'">'+esc(e['en'] if language=='en' else e['ko'])+'</a><span>'+esc(e['ko'] if language=='en' else e['en'])+'</span></li>' for e in items)
            groups.append('<section><h2>'+esc(heading)+'</h2><ul class="term-index">'+links+'</ul></section>')
        name='Design reference index' if language=='en' else '디자인 레퍼런스 전체 색인'
        doc='<!doctype html><html lang="'+language+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+name+' — ATLAS Gallery</title><meta name="description" content="'+str(len(canonical))+' design definitions, examples, implementation notes and source links."><link rel="canonical" href="'+ORIGIN+path+'"><link rel="stylesheet" href="/assets/reference.css"></head><body><nav><a href="/?lang='+language+'">ATLAS Gallery</a> · <a href="'+('/references/' if language=='en' else '/en/references/')+'">'+('한국어' if language=='en' else 'English')+'</a></nav><main><h1>'+name+'</h1><p>'+str(len(canonical))+' references · '+str(len(db['categories']))+' categories</p>'+''.join(groups)+'</main></body></html>'
        (folder/'index.html').write_text(doc,encoding='utf-8');urls.append(ORIGIN+path)
    # Keep existing policy wording and category documents; change typography only.
    for file in OUT.glob('*.html'):
        if file.name=='index.html':continue
        raw=minimum_css(file.read_text(encoding='utf-8'))
        raw=re.sub(r'<style id="atlas-minimum-text">.*?</style>','',raw,flags=re.S)
        raw=raw.replace('</head>','<style id="atlas-minimum-text">small,code,kbd{font-size:14px}input,select,button,textarea{font-size:16px}</style></head>')
        file.write_text(raw,encoding='utf-8')
    catalog={'version':VERSION,'origin':ORIGIN,'modified':DATE,'scope':'ATLAS editorial definitions; example data is synthetic; not official vendor endorsements','count':len(canonical),'references':[{'id':e['id'],'en':e['en'],'ko':e['ko'],'category':e['category'],'definition':{'ko':e.get('description',''),'en':field(e,'description','en')},'url':ORIGIN+ref_path(e,'ko'),'en_url':ORIGIN+ref_path(e,'en'),'markdown':ORIGIN+ref_path(e,'ko')+'index.md','interactive':bool(e.get('demo')),'sources':([e.get('source_url')] if e.get('source_url') else [])} for e in canonical]}
    (OUT/'catalog.json').write_text(embed(catalog)+'\n',encoding='utf-8')
    llms=f'''# ATLAS Gallery

> Korean and English design-reference encyclopedia with {len(canonical)} canonical definitions and original visual studies.

This file is a navigation aid, not a requirement for inclusion in AI search. Prefer the language-specific canonical reference pages when citing a definition. Do not describe illustrative studies as official product implementations.

## Navigation
- [Korean glossary]({ORIGIN}/references/): All canonical Korean definition pages.
- [English glossary]({ORIGIN}/en/references/): English definition pages.
- [JSON catalogue]({ORIGIN}/catalog.json): Stable IDs, bilingual definitions and canonical links.
- [Full bilingual text]({ORIGIN}/llms-full.txt): Complete definition, usage, caution and source text.
- [Interaction lab]({ORIGIN}/?lang=en&collection=interactions): {len(added)+len(upgraded)} runnable examples; each card exposes Copy code.
- [Sitemap]({ORIGIN}/sitemap.xml): Canonical indexable URLs.
- [Editorial scope]({ORIGIN}/about.html): Attribution and verification scope.

## Reference format
- Korean: /reference/<id>/
- English: /en/reference/<id>/
- Readable Markdown: append index.md to a reference URL.

Version: {VERSION}
Edited: {DATE}
Operator: 스투피아드
'''
    (OUT/'llms.txt').write_text(llms,encoding='utf-8');(OUT/'llms-full.txt').write_text('\n\n---\n\n'.join(full_md),encoding='utf-8')
    for f in ['about.html','privacy.html','terms.html','advertising.html','catalog.html']:urls.append(ORIGIN+'/'+f)
    urls += [ORIGIN+'/'+f.name for f in sorted(OUT.glob('category-*.html'))]
    sitemap='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+esc(url)+'</loc></url>' for url in dict.fromkeys(urls))+'</urlset>'
    (OUT/'sitemap.xml').write_text(sitemap,encoding='utf-8')
    # Preserve operator crawler rules, replacing only the sitemap pointer.
    oldrobots=(OUT/'robots.txt').read_text(encoding='utf-8') if (OUT/'robots.txt').exists() else 'User-agent: *\nAllow: /\n'
    oldrobots=re.sub(r'^Sitemap:.*$','',oldrobots,flags=re.M|re.I).rstrip()
    (OUT/'robots.txt').write_text(oldrobots+'\nSitemap: '+ORIGIN+'/sitemap.xml\n',encoding='utf-8')
    redirects=[]
    for e in db['entries']:
        if e.get('canonical_id'):
            for language in ('ko','en'):redirects.append(ref_path(e,language)+' '+ref_path({'id':e['canonical_id']},language)+' 301')
    (OUT/'_redirects').write_text('\n'.join(redirects)+'\n',encoding='utf-8')
    (ROOT/'qa').mkdir(exist_ok=True)
    receipt={'version':VERSION,'records':len(db['entries']),'canonical':len(canonical),'categories':len(db['categories']),'recipes':len(added)+len(upgraded),'new_ids':added,'upgraded_ids':upgraded,'three':sum(e.get('demo',{}).get('engine')=='three' for e in canonical),'reference_pages':len(canonical)*2,'index_sha256':hashlib.sha256((OUT/'index.html').read_bytes()).hexdigest(),'index_bytes':(OUT/'index.html').stat().st_size,'vendor_available':(target/'three-0.180.0.module.min.js').exists()}
    (ROOT/'qa/build-v32.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');(ROOT/'qa/expanded-data-v32.json').write_text(embed(db)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in receipt.items() if not k.endswith('_ids')},indent=2))
if __name__=='__main__':main()
