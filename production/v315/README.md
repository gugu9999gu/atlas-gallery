# ATLAS production v3.15.0

## Verified deployment

Production: https://atlas-gallery.app/
New cards: https://atlas-gallery.app/?lang=ko&collection=v315
Status: https://atlas-gallery.app/implementation-status/
Public release evidence: https://atlas-gallery.app/data/release-v315.json

Deployment `026fc860-8698-488f-b0f5-82279ed04abc` was created at `2026-10-30T16:07:13.651673Z` (2026-10-31 01:07 KST). Worker version `6d1e4300-f3e2-4ad9-bc37-0fe64db5af7f` serves 100% of production traffic. Production verification completed at `2026-10-30T16:08:46.257Z`.

## Coverage

| Metric | v3.14 | v3.15 |
|---|---:|---:|
| Canonical entries | 2,153 | 2,153 |
| Directly interactive cards | 479 | 503 |
| Distinct interactive recipe keys | 467 | 491 |
| Specific previews, including prior static/animated references | 1,335 | 1,359 |
| Remaining planned/concept-diagram cards | 818 | 794 |

24 existing planned records were upgraded; no new dictionary records or duplicates were added. The embedded app catalog still includes 2,156 records, including three aliases. Runtime classification and the coverage JSON both reported native 551, exact 777, legacy-exact 2, effect 29 and diagram 794.

## Implemented studies

Core Loop, Meta Loop, Game Mechanic, Player Agency, Meaningful Choice, Risk–Reward, Feedback Loop, Positive Feedback Loop, Negative Feedback Loop, Skill Tree, Tech Tree, Unlock, Difficulty Curve, Dynamic Difficulty, Resource Economy, Source and Sink, Crafting, Loot Table, Random Number Generation, Procedural Content Generation, Permadeath, Checkpoint, Save State and New Game Plus.

Each study has real browser state transitions, reset, Korean/English labels, visible state output, concise scope notes and standalone HTML/CSS/JavaScript export using the existing card copy action. Fourteen studies have an adjustable range. Buttons work with the keyboard, range inputs retain native arrow-key behavior, and short feedback animations respect reduced motion. Detached studies remove event listeners through AbortController and MutationObserver cleanup.

Examples enforce their rules rather than only changing labels: skill branches are mutually exclusive, technology research checks both prerequisite parents, crafting consumes actual inventory values, spending cannot exceed available resources, source/sink accounting conserves resources, weighted random selection normalizes weights, repeated seeds reproduce sequences, 2D procedural maps contain a connected start-to-goal route, death clears the character reward, checkpoints restore a recorded position, save snapshots are deep copies, and New Game Plus resets stage progress while carrying power forward.

## Explicit scope limits

These are original, deterministic, in-memory browser studies, not complete games or game engines. All graphics are 2D DOM/SVG/CSS; no new 3D renderer was substituted for the existing Three.js studies.

The random-number study uses a simple 32-bit linear congruential generator for reproducibility, not security. Probabilistic rewards are purely virtual: no money, payment, gambling service or real prize is involved. Difficulty curves and dynamic difficulty use stated illustrative formulas, not measured player-performance evidence or validated game balancing. Save State uses an in-memory JSON deep copy, not a persistent storage service; reload clears it. The metaprogression and permadeath studies also reset on reload. The map study is a bounded 12-by-7 walk with a connected route, not a complete level generator.

No external network requests, persistent browser storage, audio, external artwork or additional engine dependency were introduced by this overlay. Existing definitions, source-verification labels, IDs, v3.13 style registrations, v3.14 accessibility registrations, Three.js assets and advertising configuration were preserved. Advertising delivery was not re-certified.

## Tests actually performed

The exact deployed asset passed local Chromium/Playwright tests:

- 144 layout/action/reset cases: 24 cards × Korean/English × widths 320/390/1440.
- 48 separately executed standalone HTML exports: all 24 cards in both languages.
- 47 additional rule/keyboard/reduced-motion checks. These include mutually exclusive branches, both-parent prerequisites, budget constraints, feedback direction, bounded dynamic difficulty, conservation, deep-copy save/restore, death/reset, seeded sequence and weighted-draw reproducibility, plus connectivity/bounds for all 99 selectable map seeds.
- No captured local JavaScript errors or failed checks. Inspected visible text was at least 14px. No measured horizontal overflow or clipped controls remained in the tested example containers. The rendered 24-card review sheet was inspected.

Staging and production each passed Korean mobile at 390px and English desktop at 1440px. Each run exercised actions/reset/ranges on all 24 new cards, checked name/prompt/code control presence, inspected text size and horizontal/control bounds, validated catalog and runtime coverage counts, checked the 794-item planned classification/filter, confirmed prior style/accessibility recipe registration, checked detached-study disposal and the retained indeterminate-loading clip, and verified nine new/old asset/document routes returned HTTP 200 with X-Atlas-Version: 3.15.0.

Exact Korean-name, English-name, prompt and standalone-code clipboard payloads were checked on a representative card in each integration run. All standalone code exports were separately executed locally. Clipboard writes were intercepted: OS clipboard permission behavior was not tested.

The English canonical Save State document was executed at 390px on both staging and production. Independent snapshot storage, restore, reset, code export, prompt presence, canonical URL, structured term identity, minimum inspected text and horizontal bounds all passed.

This is not a claim of exhaustive cross-browser/device testing, screen-reader speech testing or full accessibility certification.

## Source, artifacts and rollback

Source commit: `7651e8815f65f3f8b9c4f6397cae88737ffd56b7`.
Build commit: `672d82ace6160caac54b27edc0fb9210ca10786b`.

Run `node production/v315/build.mjs`. It refuses to emit output unless the source has the verified SHA-256:

`884eb9e28000410a768749fb239ee96554e533b5b8191c17f68d79048fcee2a2` — 35,952 UTF-8 bytes.

The GitHub source was transferred to R2 only after matching that hash. Staging and production then independently hashed the served JavaScript and matched the same value.

The deployed snapshot is in R2 bucket `atlas-gallery-assets`, prefix `releases/v315/`: worker.mjs, index.html, assets/atlas-v315.js, data/, qa/, deployment.json and rollback/. QA contains local-summary.json, runtime-check.js, canonical-check.js, staging-ko-390.json, staging-en-1440.json, staging-canonical.json, production-ko-390.json, production-en-1440.json and production-canonical.json.

Rollback version: `8aae8475-04e1-432d-96cd-9c064418727e` (v3.14). The original Worker, settings and deployment metadata were preserved under releases/v315/rollback/ before deployment. The live version was checked again immediately before upload to avoid overwriting concurrent production changes. Earlier release objects were not overwritten. Asset lookup falls back through v314, v313, v312 and v39. Status and the current release manifest bypass edge caching so verification flags remain current.

The repository-root development Worker is not the production baseline. Do not deploy it over the production Worker.

## Primary implementation references checked

- W3C ARIA APG Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Godot random-number generation documentation, for the reproducible-seed principle rather than a claim of using the Godot runtime: https://docs.godotengine.org/en/latest/tutorials/math/random_number_generation.html
