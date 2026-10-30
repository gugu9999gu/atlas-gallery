# ATLAS production v3.13.0

## Deployment

- Production: https://atlas-gallery.app/
- New collection: https://atlas-gallery.app/?lang=ko&collection=v313
- Status: https://atlas-gallery.app/implementation-status/
- Public release evidence: https://atlas-gallery.app/data/release-v313.json
- Deployed at 2026-10-30T12:52:24.45502Z (2026-10-30 21:52 KST).
- Production version: `788d974c-6523-49ea-a95c-4266b8015fcc`.
- Deployment: `5a02bddb-7fff-4862-8818-fa4329efb79d`, serving 100% of Worker traffic.
- Live production verification passed at 2026-10-30T12:52:58.457Z.
- Source/build/test commit before these release notes: `714e783b8e51a9717057fac207a3dc331056ffdf`.

## Coverage

| Metric | v3.12 | v3.13 |
|---|---:|---:|
| Canonical entries | 2,153 | 2,153 |
| Directly interactive cards | 431 | 455 |
| Distinct interactive recipes | 420 | 443 |
| Specific visual previews, including existing static/animated examples | 1,287 | 1,311 |
| Remaining planned/concept-diagram entries | 866 | 842 |

24 previously planned canonical cards were upgraded. There are 23 distinct new implementations because two pre-existing Neumorphism cards in different categories intentionally share one recipe. No new duplicate dictionary entries were added.

The cards cover Blur Effect, Backdrop Blur, Glassmorphism, Neumorphism (two existing cards), Minimalism, Maximalism, Swiss / International Style, Bauhaus-inspired Design, Brutalist Web Design, Neo-brutalism, Flat Design, Skeuomorphism, Bento Layout, Editorial Design, Y2K Aesthetic, Retro-futurism, Cyberpunk Aesthetic, Art Deco, Memphis Style, Organic Design, Pixel Art, Paper-cut Style, and CRT Aesthetic.

Every new study provides a real editable property, variation and reset. Pixel Art additionally supports clicking or pressing Enter to edit a pixel. These are original CSS visual interpretations, not exhaustive historical definitions or replacements for native 3D renderers. Existing Three.js studies remain available.

## Card usability and filtering

The deployed production baseline lacked the earlier requested name/prompt controls. `card-tools-v313.js` adds Korean and English name-copy icon buttons beside card names and a scrollable, bilingual example prompt with direct copy. Existing code-copy buttons remain in place.

Remaining diagram cards now display `구현 예정` / `Planned` and distinguish concept-diagram code from a completed interactive implementation. The planned/specific filter previously consulted the pre-overlay renderer, incorrectly including implemented cards. The production index now uses `Boolean(art(e).specific)` instead of `referenceView(e).specific`.

The v3.12 indeterminate linear-loading correction is retained: the moving segment is contained by its nested 224-by-10 SVG viewport with `overflow: hidden`.

## Verification actually performed

- Local Chromium: 138 unique-study/language/viewport cases (23 recipes × two languages × three widths), and 48 standalone exported HTML executions (24 cards × two languages). No captured JavaScript errors or measured layout failures remained. Reduced-motion behavior was checked.
- Staging: Korean desktop at 1440px, English mobile at 390px, all 24 slider/variant/reset controls, all catalog/coverage totals, canonical document HTTP responses, and retained older recipe registrations.
- Final staging: copy payloads, two name controls per card, scrolling prompts, actual planned filtering and labels, 14px sampled minimum text, no horizontal page overflow, and the retained loading clip passed.
- Production at 390px: all 24 controls, 48 name-copy buttons, 24 prompt-copy buttons, scrolling prompt areas, correct Korean/English/prompt copy payloads, minimum 14px sampled text, planned filter/labels, and the loading clip passed. Seven new/old assets and bilingual canonical routes returned HTTP 200 with `X-Atlas-Version: 3.13.0`.
- Clipboard writes were intercepted to verify their exact strings; operating-system clipboard permissions were not tested. This is not a claim of WCAG certification or exhaustive cross-browser/device testing.

## Production source and rollback

The repository-root development build is not the deployed production baseline. Do not replace production with the root worker or root static build.

R2 bucket `atlas-gallery-assets` contains the production release snapshot at `releases/v313/`: `worker.mjs`, `index.html`, `assets/`, `data/`, `qa/`, and `deployment.json`. The Worker preserves the existing security policy and binding, serving assets from v313, then the immutable v312 and v39 fallbacks.

Rollback version: `820932e1-fde2-43da-8b03-c44e67af667d` (v3.12). The pre-deployment Worker source, settings and deployment metadata are saved under `releases/v313/rollback/`. Earlier release objects were not overwritten.

The index snapshot preserves all 2,156 records, including three aliases, while the canonical public catalog retains 2,153 entries. Existing definitions, IDs and source-verification labels were preserved. New metadata marks the 24 upgrades, and the home collection selector, coverage JSON, status page, reference index and llms.txt counts were updated.

## Build and rerun smoke tests

Run `node production/v313/build.mjs`. The build explicitly corrects a single truncated CSS color token in the committed style source, then refuses to emit assets unless both SHA-256 checks match the verified deployment:

- `atlas-v313.js`: `ebebbce16f4b4e7cc26112a97a3d3db60f48c05b46631bafefc67156cf5e4150`
- `card-tools-v313.js`: `3f2f3b856696c6ad5be0ea3004005ee38f9ec86ee86766cbcb97ed0b5a1d039e`

`test-browser.py` contains repeatable, read-only Playwright checks for the deployed collection. Install Python Playwright and Chromium, then run `python production/v313/test-browser.py https://atlas-gallery.app`. The standalone local test matrix and production/staging result files are recorded separately; the smoke script is not claimed to reproduce every local visual comparison.
