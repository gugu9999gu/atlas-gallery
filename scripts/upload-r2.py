"""Explicit, opt-in upload of this app's public text assets. No embedded credentials.
Dry run: python scripts/upload-r2.py
Apply: set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in your environment,
       then python scripts/upload-r2.py --apply
The token must be authorized for the intended account and R2 bucket.
"""
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import quote
from urllib.error import HTTPError,URLError
import argparse,os,json,time
ROOT=Path(__file__).resolve().parents[1]
BUCKET='atlas-gallery-assets'
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--apply',action='store_true');args=ap.parse_args()
    files=[p for p in sorted((ROOT/'public').rglob('*'))if p.is_file()and p.name not in {'_headers','_redirects'}]
    if not args.apply:
        print(json.dumps({'mode':'dry-run','bucket':BUCKET,'files':len(files),'bytes':sum(p.stat().st_size for p in files)},indent=2));return
    token=os.environ.get('CLOUDFLARE_API_TOKEN','');account=os.environ.get('CLOUDFLARE_ACCOUNT_ID','')
    if not token or not account:raise SystemExit('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID locally; do not paste them into source files.')
    if len(account)!=32 or any(c not in '0123456789abcdef'for c in account.lower()):raise SystemExit('Invalid account identifier')
    for p in files:
        key=p.relative_to(ROOT/'public').as_posix();url=f'https://api.cloudflare.com/client/v4/accounts/{account}/r2/buckets/{BUCKET}/objects/{quote(key,safe="")}'
        req=Request(url,data=p.read_bytes(),method='PUT',headers={'Authorization':'Bearer '+token,'Content-Type':'application/octet-stream'})
        for attempt in range(3):
            try:
                with urlopen(req,timeout=60)as response:
                    if response.status not in (200,201,204):raise RuntimeError('Unexpected upload status')
                break
            except HTTPError as exc:
                if exc.code in (429,500,502,503,504)and attempt<2:time.sleep(2**(attempt+1));continue
                raise SystemExit(f'Upload failed for {key}: HTTP {exc.code}')
            except URLError:
                if attempt<2:time.sleep(2**(attempt+1));continue
                raise SystemExit(f'Network error while uploading {key}')
        print('Uploaded',key)
    print('Assets uploaded. Deploy worker.mjs using the supplied wrangler.jsonc and bump its cache version for a new release.')
if __name__=='__main__':main()
