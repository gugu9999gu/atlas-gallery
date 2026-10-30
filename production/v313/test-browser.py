"""Run: pip install playwright; playwright install chromium
python production/v313/test-browser.py https://atlas-gallery.app
The target is read-only. Clipboard is stubbed so test runs never change a real clipboard.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('origin')
parser.add_argument('--output', default='atlas-v313-qa.json')
args = parser.parse_args()
origin = args.origin.rstrip('/')
results = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    for lang, width in [('ko', 1440), ('en', 390)]:
        page = browser.new_page(viewport={'width': width, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(origin + '/?qa=1&collection=v313&lang=' + lang, wait_until='networkidle')
        assert response and response.status == 200
        page.wait_for_selector('#cards .st-stage')
        result = page.evaluate('''async () => {
          const ready = await AtlasCardTools.ready;
          const cases = [...document.querySelectorAll('#cards .st-stage')].map(node => {
            const input = node.querySelector('input');
            input.value = input.max;
            input.dispatchEvent(new Event('input', {bubbles: true}));
            const valueOK = Number(node.dataset.value) === Number(input.max);
            node.querySelector('.st-toolbar [data-st=variant]').click();
            const variantOK = node.dataset.variant === '1';
            node.querySelector('[data-st=reset]').click();
            const resetOK = Number(node.dataset.value) === AtlasStyleLab.CONFIG[node.dataset.style][4];
            return {key: node.dataset.style, valueOK, variantOK, resetOK};
          });
          const cards = [...document.querySelectorAll('#cards .term-card')];
          const tools = cards.every(card => card.querySelectorAll('.atlas-name-copy').length === 2 && card.querySelector('.atlas-prompt-text') && card.querySelector('[data-atlas-copy]'));
          const captures = [];
          Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {writeText: async text => captures.push(text)}});
          const first = cards[0];
          for (const field of ['ko', 'en', 'prompt']) first.querySelector('[data-atlas-text-copy="' + field + '"]').click();
          await Promise.resolve();
          const expected = Atlas32.bridge.entry(first.dataset.id);
          const clipboardOK = captures[0] === expected.ko && captures[1] === expected.en && captures[2].includes(expected.en);
          const counts = Atlas32.bridge.counts();
          const overflow = document.documentElement.scrollWidth > innerWidth + 1;
          Atlas32.select('unimplemented');
          const remaining = [...document.querySelectorAll('#cards .term-card')];
          const plannedOK = remaining.length > 0 && remaining.every(card => card.querySelector('.atlas-planned'));
          return {cases, tools, clipboardOK, counts, overflow, plannedOK, planned: ready.planned};
        }''')
        assert len(result['cases']) == 24, result
        assert all(c['valueOK'] and c['variantOK'] and c['resetOK'] for c in result['cases']), result
        assert result['tools'] and result['clipboardOK'] and result['plannedOK'] and not result['overflow'], result
        assert result['counts']['live'] == 455 and result['counts']['recipes'] == 443, result
        assert result['planned'] == 842, result
        assert not errors, errors
        results.append({'lang': lang, 'width': width, 'result': result, 'errors': errors})
        page.close()
    browser.close()
Path(args.output).write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'passed': len(results), 'output': args.output}))
