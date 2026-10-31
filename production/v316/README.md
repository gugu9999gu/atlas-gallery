# ATLAS production v3.16.0

## Verified production deployment

Production: https://atlas-gallery.app/
New cards: https://atlas-gallery.app/?lang=ko&collection=v316
Implementation status: https://atlas-gallery.app/implementation-status/
Machine-readable release evidence: https://atlas-gallery.app/data/release-v316.json

Deployment `8356766a-018d-4b8f-89ad-5f2976d0d9a8` was created at `2026-10-31T00:45:29.51634Z` (2026-10-31 09:45 KST). Worker version `8a9994a3-9804-43df-974e-ca4497631f1c` serves 100% of production traffic. Final production verification completed at `2026-10-31T00:48:18.175Z`.

## Coverage

| Metric | v3.15 | v3.16 |
|---|---:|---:|
| Canonical entries | 2,153 | 2,153 |
| Directly interactive cards | 503 | 527 |
| Distinct interactive recipe keys | 491 | 515 |
| Specific previews, including existing static/animated examples | 1,359 | 1,383 |
| Remaining planned/concept-diagram entries | 794 | 770 |

24 existing planned records were upgraded. No duplicate dictionary records were added. The embedded app catalog retains 2,156 records including three aliases; the public canonical catalog remains 2,153 entries. Both the coverage JSON and the live renderer reported native 575, exact 777, legacy-exact 2, effect 29 and diagram 770.

## Newly implemented cards

Combat, movement and timing (17): Collision Shape, Startup Frames, Active Frames, Recovery Frames, Hitstun, Knockback, Telegraph, Input Buffer, Air Control, Acceleration and Deceleration, Aim Assist, Lock-on, Animation Cancel, Combo System, Time to Kill, Damage Falloff and Friendly Fire.

Game UI and state (7): HUD, Health Bar, Interaction Prompt, Inventory Grid, Hotbar, Radial Menu and Finite State Machine.

All 24 have working browser state, reset, Korean/English descriptions, visible scope notes and independently runnable HTML/CSS/JavaScript code through the existing card copy action. Twenty have a native range input. Existing Korean-name and English-name copy icons, scrollable prompts and prompt-copy controls are preserved.

Timing examples support playback and frame/step controls. The implementation prevents repeated hits during one active window, rejects a new attack during recovery, blocks movement during hitstun, distinguishes valid and expired buffered input, and permits an animation cancel only inside the stated active window. Knockback uses exponential damping with an integrated displacement; air control combines horizontal acceleration with gravity; acceleration/deceleration use elapsed time. Aim assistance applies only inside a stated radius and supports pointer movement. Lock-on retains a stable target selection while positions change.

The game-UI examples keep health within 0–100 and synchronize its accessible value, gate interactions by distance, move/swap inventory slots without losing items, track separate hotbar charges, support keyboard navigation in the radial menu, and transition between idle/patrol/chase states. The closed radial-menu preview includes a visible directional diagram rather than an empty scene.

Animations stop when an example leaves the viewport, the document becomes hidden, the global motion preference disables them, or the example is removed. Reduced-motion mode uses manual advancement rather than continuous playback. Reset cancels the pending animation frame. Detached instances dispose their listeners and observers.

## Explicit scope limits

These are original 2D DOM/SVG/CSS/JavaScript reference studies, not a complete game engine, a native physics engine or validated game balancing. Values and units are illustrative and stated on the cards. Logical combat-frame playback runs at 20 frames per second for inspection; it is not a claim about a particular commercial game's frame data.

The TTK example assumes 100 HP, four hits per second, the first hit at time zero and every hit connecting. The falloff example uses its own piecewise-linear rule. Knockback omits collision response. Inventory and UI state are in memory only and reset on reload. No persistent storage, server request, external artwork, audio or additional engine dependency was added by the overlay. No new 3D effect is disguised as a 2D replacement: the existing Three.js references and assets remain intact.

Existing definitions, IDs, source-verification labels, earlier game-system/style/accessibility examples and advertising configuration were preserved. Advertising delivery was not re-certified.

## Verification actually performed

The exact deployed source passed local Chromium/Playwright checks:

- 144 layout/action/reset cases: 24 cards × Korean/English × viewport widths 320/390/1440.
- 48 separately executed standalone HTML exports: 24 cards in both languages.
- 62 rule, real-keyboard, animation and reduced-motion checks. `local-qa-summary.json` records the individual passing checks.
- No captured local JavaScript errors or failed cases. Inspected visible text in the new examples was at least 14px. No measured horizontal overflow or clipped visible controls remained. The rendered 24-card review sheet was inspected.

Staging and production each passed Korean mobile at 390px and English desktop at 1440px. Every run checked all 24 cards' actions, available ranges and resets; name/prompt/code controls; scrollable prompts; text and control bounds; a visible running animation; open radial-menu fit and Escape; the 527/515/770 counts; planned labels/filter; detached-instance cleanup; earlier game/style/accessibility recipe registration; the retained indeterminate-loading clip; and nine new/old asset and document routes returning HTTP 200 with X-Atlas-Version: 3.16.0.

Exact Korean-name, English-name, prompt and standalone-HTML clipboard payloads were checked on a representative card in each integration run. All standalone HTML exports were executed separately in the local matrix. Clipboard writes were intercepted; operating-system clipboard permission behavior was not tested.

Two canonical documents were executed at 390px on both staging and production: the English Inventory Grid document passed move/swap/item-count conservation, reset, code export, prompt, canonical URL and structured-term identity checks; the Korean Input Buffer document passed the 6-frame valid/7-frame expired boundary, reset and the same document checks. Both had minimum 14px inspected text and no measured horizontal page overflow.

The first staging animation assertion ran before smooth scrolling had reached the card, so the offscreen-pausing rule correctly prevented playback. The test now scrolls instantly and waits for viewport intersection; the repeated check passed without changing production code. The original failed test record is retained. Browser-rendering rate limits temporarily interrupted additional canonical tests; all four canonical checks were subsequently completed successfully before final verification was marked true.

This is not an exhaustive cross-browser/device test, screen-reader speech test or full accessibility certification.

## Source, reproducibility and rollback

Source commit: `7dffd68e47d589363286e314bbe1e39e0fab23fd`.
Build commit: `143a282f7336c24846e3ab708e1abe24d04c056e`.
Deployed-browser smoke-test commit: `eda022a0c5991aaa99972f990d74200a4eefe1c2`.
Local QA summary commit: `06370ca3023ba97750ab4fe5deed6920f86cd081`.

Run `node production/v316/build.mjs`. It checks the JavaScript syntax, requires 24 distinct recipes, and refuses to emit output unless the source SHA-256 matches the tested/deployed bytes:

`c0ace20753509000210a18814f85e8d524afce16632fd6524e7355f32358cfb6` — 38,568 UTF-8 bytes.

GitHub source was transferred to R2 only after matching that digest. Staging and production independently hashed the served asset and matched it again. `test-browser.py` provides repeatable read-only deployment smoke checks; the actual integration runs used the scripts preserved in the release's R2 QA directory.

The production snapshot is in R2 bucket `atlas-gallery-assets`, prefix `releases/v316/`: worker.mjs, index.html, assets/atlas-v316.js, data/, qa/, deployment.json and rollback/. QA includes local-summary.json, runtime-check.js, canonical-check.js, staging/production mobile and desktop results, and staging/production results for both canonical documents.

Rollback version: `6d1e4300-f3e2-4ad9-bc37-0fe64db5af7f` (v3.15). Before deployment, the prior Worker source, settings and deployment metadata were saved under releases/v316/rollback/. The active version was rechecked immediately before the production write to avoid overwriting concurrent changes. Earlier release objects were not overwritten. Asset lookup falls back through v315, v314, v313, v312 and v39. Implementation status and the current release manifest bypass edge caching so verification flags remain current.

The repository-root development Worker is not the deployed production baseline. Do not deploy it over the production Worker.

## Primary implementation references checked

- MDN 2D collision detection: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
- W3C ARIA APG Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- W3C ARIA APG keyboard-interface guidance: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- Godot CharacterBody2D documentation, used for terminology and to distinguish browser movement studies from a native engine runtime: https://docs.godotengine.org/en/4.5/classes/class_characterbody2d.html
