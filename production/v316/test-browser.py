"""Read-only deployment smoke test.
Install: pip install playwright; playwright install chromium
Run: python production/v316/test-browser.py https://atlas-gallery.app
Clipboard writes are intercepted, not sent to the operating-system clipboard.
The larger local rule-test matrix is recorded separately in the release QA summary.
"""
import argparse
import hashlib
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('origin')
parser.add_argument('--output', default='atlas-v316-browser-results.json')
args = parser.parse_args()
origin = args.origin.rstrip('/')
expected_hash = 'c0ace20753509000210a18814f85e8d524afce16632fd6524e7355f32358cfb6'
results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang, width in [('ko', 390), ('en', 1440)]:
        page = browser.new_page(viewport={'width': width, 'height': 1000})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(origin + '/?qa=1&lang=' + lang + '&collection=v316', wait_until='networkidle')
        assert response and response.status == 200
        assert response.headers.get('x-atlas-version') == '3.16.0'
        page.wait_for_selector('#cards .cb-stage')
        result = page.evaluate('''async () => {
          const ready = await AtlasCardTools.ready;
          const cards = [...document.querySelectorAll('#cards .term-card')];
          const cases = [...document.querySelectorAll('#cards .cb-stage')].map(root => {
            const study = root.__cbStudy;
            root.querySelector('[data-cb=run]').click();
            study.step(1);
            const changed = study.snapshot().actions > 0;
            const input = root.querySelector('input');
            let range = true;
            if (input) {
              input.value = input.max;
              input.dispatchEvent(new Event('input', {bubbles: true}));
              range = study.snapshot().param === Number(input.max);
            }
            root.querySelector('[data-cb=reset]').click();
            const reset = study.snapshot().actions === 0;
            const text = [...root.querySelectorAll('*')].filter(n => n.getClientRects().length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()));
            const minimum = Math.min(...text.map(n => parseFloat(getComputedStyle(n).fontSize)));
            return {key: root.dataset.combat, changed, range, reset, minimum, overflow: root.scrollWidth > root.clientWidth + 1};
          });
          const tools = cards.every(card => card.querySelectorAll('.atlas-name-copy').length === 2 && card.querySelector('.atlas-prompt-text') && card.querySelector('[data-atlas-copy]'));
          const captures = [];
          Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: async text => captures.push(text)}});
          const first = cards[0], entry = Atlas32.bridge.entry(first.dataset.id), lang = Atlas32.bridge.locale();
          for (const type of ['ko', 'en', 'prompt']) first.querySelector('[data-atlas-text-copy="' + type + '"]').click();
          first.querySelector('[data-atlas-copy]').click();
          await new Promise(resolve => setTimeout(resolve, 30));
          const copy = captures[0] === entry.ko && captures[1] === entry.en && captures[2] === AtlasCardTools.promptFor(entry, lang) && captures[3] === Atlas32.code(entry, lang);
          return {cases, tools, copy, counts: Atlas32.bridge.counts(), planned: ready.planned, overflow: document.documentElement.scrollWidth > innerWidth + 1};
        }''')
        assert len(result['cases']) == 24, result
        assert all(c['changed'] and c['range'] and c['reset'] and c['minimum'] >= 14 and not c['overflow'] for c in result['cases']), result
        assert result['tools'] and result['copy'] and not result['overflow'], result
        assert result['counts']['live'] == 527 and result['counts']['recipes'] == 515 and result['planned'] == 770, result
        # Wait until the example is genuinely in view; smooth scrolling can pause offscreen demos.
        air = page.locator('[data-combat=cb-air]')
        air.evaluate("el => el.scrollIntoView({block: 'center', behavior: 'instant'})")
        page.wait_for_timeout(150)
        air.locator('[data-cb=run]').click()
        page.wait_for_timeout(300)
        assert air.evaluate('el => el.__cbStudy.snapshot().frame > 0')
        air.locator('[data-cb=reset]').click()
        radial = page.locator('[data-combat=cb-radial]')
        radial.locator('[data-cb=run]').click()
        page.keyboard.press('ArrowRight')
        page.keyboard.press('Enter')
        assert radial.evaluate('el => el.__cbStudy.snapshot().choice === 1')
        page.evaluate("Atlas32.select('unimplemented')")
        page.wait_for_timeout(50)
        assert page.evaluate("AtlasCombatLab.activeCount() === 0")
        assert page.evaluate("[...document.querySelectorAll('#cards .term-card')].every(c => c.querySelector('.atlas-planned') && !AtlasCombatLab.byId.has(c.dataset.id))")
        asset = page.request.get(origin + '/assets/atlas-v316.js')
        assert asset.status == 200 and hashlib.sha256(asset.body()).hexdigest() == expected_hash
        assert not errors, errors
        results.append({'lang': lang, 'width': width, 'result': result, 'errors': errors})
        page.close()
    browser.close()
Path(args.output).write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': len(results), 'output': args.output}))
