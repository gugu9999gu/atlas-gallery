from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'public/index.html').read_text().replace("get('qa')==='1'","get('qa')!=='0'")
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1120},device_scale_factor=1)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(source,wait_until='load')
    page.locator('#language-select').select_option('ko')
    page.locator('[data-quick="데이터 시각화"]').click()
    page.wait_for_timeout(250)
    page.screenshot(path='/mnt/data/atlas-gallery-charts-live-design.png')
    page.evaluate("atlasQA.open('dar-591d4726c6a6')")
    page.wait_for_timeout(250)
    page.screenshot(path='/mnt/data/atlas-gallery-progress-comparison.png')
    page.locator('#close-drawer').click()
    page.locator('#language-select').select_option('en')
    page.set_viewport_size({'width':390,'height':1000})
    page.wait_for_timeout(200)
    page.screenshot(path='/mnt/data/atlas-gallery-mobile-en.png')
    print(json.dumps({'errors':errors,'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth'),'cards':page.locator('.term-card').count()},indent=2))
    browser.close()
