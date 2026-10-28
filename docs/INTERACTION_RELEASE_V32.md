# ATLAS interaction release 3.2.0

## Implementation

- Every gallery card exposes Copy code without opening its detail drawer.
- 72 interactive recipes: 48 DOM/CSS/Pointer Events examples and 24 real Three.js/WebGL scenes.
- 57 new references and 15 upgrades of existing terms. Existing term IDs and aliases are preserved.
- New examples copy standalone HTML using the same implementation as the gallery. Legacy references copy their explanatory visual study; they do not claim to be a referenced product or library's implementation.
- Copied Three.js examples use pinned Three.js 0.180.0 from a CDN. Serve the copied file over HTTP(S). The production gallery vendors Three.js on its own origin.
- The gallery uses one WebGL renderer shared by visible scenes, with each rendered frame copied to a display canvas. It does not create one WebGL context per card.
- Scenes and event listeners are released when cards are removed. Reduced-motion preferences, keyboard interactions and explicit unavailable states are supported.

## Typography

Author-controlled text has a minimum 14 CSS-pixel size. The stylesheet build normalizes smaller literal sizes; runtime checks also cover SVG labels after viewport scaling. External advertising creative is controlled by the ad provider and is not rewritten by the site.

## Search and answer-engine readability

- Stable Korean `/reference/<id>/` and English `/en/reference/<id>/` pages contain the full definition, uses, cautions and source links in initial HTML.
- 4,332 language-specific definition pages, with canonical links, reciprocal hreflang, Open Graph metadata, DefinedTerm and BreadcrumbList structured data.
- `/references/`, `/en/references/`, `/catalog.json`, per-term `index.md`, `/sitemap.xml`, `/llms.txt` and `/llms-full.txt` provide discovery paths.
- Structured descriptions match the visible definition. Sources retain their original verification scope.
- `llms.txt` is an optional navigation aid, not a ranking standard or a guarantee of inclusion. Search crawling, indexing and citation by AI systems remain external decisions.
- Existing operator robots rules are preserved; the sitemap pointer is updated. No crawler is given different hidden content.

## Advertising and privacy

Existing AdFit consent, GPC behavior, the two in-flow positions, original unit sizes, no-fill handling and operator identity are retained. QA and ad-placement preview do not make live ad requests. Pointer movement is processed locally and is not analytics tracking.

## Development

```sh
npm install
npm run check
npm run build
python -m pip install -r requirements-test.txt
python -m playwright install chromium
python scripts/test-interactions.py
```

- `src/interactive/kit.js`: shared runnable implementation and standalone export.
- `src/interactive/style.css`: example appearance and transitions.
- `src/interactive/bridge.js`: integration with cards, filters and clipboard.
- `src/interactive/layout.css`: readable layout and direct card actions.
- `data/interaction-recipes.tsv`: bilingual recipe definitions.
- `scripts/build-interactions.py`: gallery and crawlable static-page build.
- `worker-v32.mjs`, `wrangler-v32.jsonc`: static-asset deployment for the existing domain.

The original private R2 store remains available for rollback. New static pages and assets are deployed atomically with the Worker. Production release must use a reviewed commit after CI succeeds; a build result is not itself proof of a successful public deployment.
