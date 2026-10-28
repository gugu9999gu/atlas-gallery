"""Rebuild the standalone gallery from editable local source (standard library only)."""
from pathlib import Path
import json,re,hashlib
ROOT=Path(__file__).resolve().parents[1]
def embed(value):
    return json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')
def main():
    text=(ROOT/'src/layout.html').read_text(encoding='utf-8')
    for marker,filename in [('ATLAS_DATA','atlas-gallery-bilingual.json'),('ATLAS_I18N','i18n.json'),('ATLAS_ADS','advertising.json')]:
        text=text.replace('/*__'+marker+'__*/',embed(json.loads((ROOT/'data'/filename).read_text(encoding='utf-8'))))
    text=text.replace('/*__STYLE_0__*/',(ROOT/'src/style.css').read_text(encoding='utf-8'))
    app=(ROOT/'src/app.js').read_text(encoding='utf-8')
    modules='\n'.join((ROOT/'src/previews'/name).read_text(encoding='utf-8') for name in ['core.js','motion.js','vfx.js','maps.js','model.js','finalize.js'])
    if app.count('/*__WAVE_MODULES__*/')!=1: raise RuntimeError('Expected one preview module marker')
    app=app.replace('/*__WAVE_MODULES__*/',modules)
    text=text.replace('/*__APP_0__*/',app)
    if re.search(r'/\*__(?:ATLAS_|APP_|STYLE_)',text):
        raise RuntimeError('A build placeholder was not replaced')
    out=ROOT/'public/index.html';out.write_text(text,encoding='utf-8')
    print(json.dumps({'path':str(out),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()},indent=2))
if __name__=='__main__':main()
