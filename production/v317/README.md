# ATLAS production v3.17.0

## Verified production deployment

Production: https://atlas-gallery.app/
New cards: https://atlas-gallery.app/?lang=ko&collection=v317
Implementation status: https://atlas-gallery.app/implementation-status/
Machine-readable release evidence: https://atlas-gallery.app/data/release-v317.json

Deployment `2ae6136c-aa4a-4ead-aed8-698e4bffaee5` was created at `2026-11-02T06:22:21.479548Z` (2026-11-02 15:22 KST). Worker version `b0bad105-e487-46f1-9304-28186b6c0ca7` serves 100% of production traffic. Final production verification completed at `2026-11-02T06:26:17.632Z`.

## Coverage

| Metric | v3.16 | v3.17 |
|---|---:|---:|
| Canonical entries | 2,153 | 2,153 |
| Directly interactive cards | 527 | 551 |
| Distinct interactive recipe keys | 515 | 539 |
| Specific previews, including prior static/animated examples | 1,383 | 1,407 |
| Remaining planned/concept-diagram entries | 770 | 746 |

All 24 upgrades are existing planned records, with 24 distinct new recipe keys. No dictionary entries or duplicates were added. The embedded app catalog retains 2,156 records including three aliases. The public canonical catalog remains 2,153 entries. Both live runtime inspection and coverage JSON reported native 599, exact 777, legacy-exact 2, effect 29 and diagram 746.

## Implemented studies

AI decisions and encounters (9): Behavior Tree, Utility AI, GOAP, Blackboard, Steering Behavior, Perception System, Aggro, Spawn System and Encounter.

Narrative behavior (4): Branching Dialogue, Quest Graph, Bark and Cutscene.

Runtime and state (6): Entity Component System, Prefab / Packed Scene, Game Loop, Fixed Timestep, Delta Time and Telemetry.

Procedural rules and navigation (5): Flow Field, Cellular Automata, Graph Grammar, L-system and Terrain Rules.

Every card has actual browser state transitions, primary and alternative controls, reset, Korean/English explanations, explicit scope notes and independently executable HTML/CSS/JavaScript code through the existing card copy action. Fifteen cards expose a native range input; six have opt-in continuous playback. Existing Korean-name and English-name copy icons, scrollable example prompts and prompt-copy controls remain available.

The examples enforce their own stated rules: the behavior tree evaluates selector/sequence nodes with SUCCESS/FAILURE/RUNNING; GOAP performs uniform-cost planning with prerequisites and effects and replans after a tool is removed; shared blackboard changes are read by both agents; steering acceleration is bounded; sight checks range, angle and a wall; spawning obeys capacity and simulated intervals; encounter composition respects its budget; dialogue gates progression with trust and a key; the final quest requires both parent goals; bark cooldown suppresses duplicates; and cutscene cues fire once when crossed.

The ECS updates only objects containing both position and velocity. Prefab-like instances are deep copies, so damage does not alter the template or other instances. Game Loop separates input, model update and visible rendering. Fixed Timestep retains a residual accumulator with 20ms steps; Delta Time compares equal simulated time at different frame rates. Telemetry records only explicit simulated success/failure button presses, retains a bounded local history and performs no network upload.

The 9-by-5 Flow Field uses BFS distances and will not move through blocked cells. Cellular Automata implements B3/S23 with dead boundaries. Graph Grammar rewrites room nodes into a sequence or fork while retaining terminal connectivity. L-system performs actual string rewriting and turtle drawing. Terrain Rules recalculates N/E/S/W four-bit masks after tile edits.

Playback stops when an example leaves the viewport, the document becomes hidden, the global motion setting disables it, or the example is removed. Reduced-motion mode advances one manual step rather than starting playback. Reset cancels the pending animation frame. Detached instances dispose listeners and observers. Steering and perception support scoped keyboard arrows as well as pointer target placement.

## Explicit scope limits

These are original, small, in-memory 2D DOM/SVG/CSS/JavaScript studies, not complete game engines, trained AI models, native Unreal/Godot runtimes or persistent backend services. They add no external artwork, network request, audio, persistent browser storage or extra engine dependency.

Utility and threat values are illustrative, not validated game balancing. GOAP has three cost-one actions. Steering omits collision response; perception has one occluding wall. Spawn and bark time are simulated explicitly. Dialogue is authored, not generative. Cutscene is a hand-authored SVG timeline, not a video file. Prefab demonstrates independent copies, not engine asset inheritance. Telemetry logs only the user's explicit demo events in memory, not general browsing behavior. Graph Grammar is capped at 12 nodes, L-system at four generations, and the editable grids at 9 by 5 cells. Reload clears demo state. These limits are displayed on the cards and exported examples.

Existing definitions, IDs, source-verification labels, prior style/accessibility/game/combat examples, Three.js references and assets, and advertising configuration were preserved. Advertising delivery was not re-certified. No 2D sample is presented as a replacement for the existing real Three.js studies.

## Verification actually performed

The exact deployed asset passed local Chromium/Playwright checks:

- 144 layout/action/alternative/range/reset cases: 24 cards × Korean/English × viewport widths 320/390/1440.
- 48 separately executed standalone HTML exports: 24 cards in both languages, each in a fresh browser page.
- 73 algorithm, state, real-keyboard, playback and reduced-motion checks. The names are preserved in `local-qa-summary.json`.
- No captured local JavaScript errors or failed cases. Inspected visible text in the new studies was at least 14px; no measured horizontal overflow or clipped toolbar controls remained. The rendered 24-card review sheet was inspected.

Representative rule checks included replanning, quest prerequisites, bounded spawning, budget constraints, independent instance copies, fixed-step invariance under partitioned frame times, delta-time movement across frame rates, unreachable BFS cells, a stable block and a period-two blinker, graph connectivity and unique IDs, L-system segment counts, terrain mask boundaries, real Enter/Space/range-arrow input, target movement by keyboard, offscreen pausing, reset cancellation and instance cleanup.

Staging and production each passed Korean mobile at 390px and English desktop at 1440px. Every integration run checked all 24 studies' actions/alternatives/ranges/reset, name/prompt/code control presence, scrolling prompts, inspected 14px text, horizontal and toolbar bounds, visible animation and its reset, catalog/runtime coverage, planned filter and labels, detached-instance cleanup, earlier recipe registrations, the retained indeterminate-loading clip and nine new/old asset or document routes returning HTTP 200 with X-Atlas-Version: 3.17.0.

Exact Korean-name, English-name, prompt and standalone-code clipboard payloads were checked on a representative card in each integration run. All 48 standalone exports were executed separately in the local matrix. Clipboard writes were intercepted; operating-system clipboard permission behavior was not tested.

Two canonical documents were independently executed at 390px on both staging and production. The Korean GOAP document passed initial plan, prerequisites, replanning after tool removal, goal completion and reset. The English Flow Field document passed a fully blocked route and successful navigation after reset. Both also passed code export, prompt presence, canonical URL, structured term identity, inspected minimum text size and horizontal bounds.

One staging canonical request hit the Browser Rendering rate limit; it was subsequently retried successfully before deployment. The initial local export harness reused a JavaScript realm; it was corrected to run each standalone document in a fresh page, and the entire final export matrix passed. These were test execution issues, not waived product failures.

This is not an exhaustive cross-browser/device test, screen-reader speech test or full accessibility certification.

## Source, reproducibility and rollback

Source commit: `e1be7e6ede95091e918b3db8ff9c5c1b0d16ba1b`.
Build commit: `afdcf3fd0bdd57006f79251b99673bdaca8207b9`.
Reproducible local layout/export test commit: `66efb51b1890c5cc56185f583531c1c850c65f81`.
Local QA summary commit: `60744ac5ff6a38c89934ae5777f66bd910138f37`.

Run `node production/v317/build.mjs`. It checks syntax, requires 24 unique record IDs and recipe keys, and refuses to emit output unless the source SHA-256 matches the tested/deployed bytes:

`8f2cc5e2289309b055d7f22dbcbefb86d39c8958c5e6df995d0a65ce982c595e` — 45,309 UTF-8 bytes.

The GitHub source was transferred to R2 only after matching that digest. Staging and production independently hashed the served asset and matched it again. `test-local.py` reproduces the 144 layout cases, 48 standalone executions and review sheet; the additional behavioral checks are listed separately in `local-qa-summary.json`.

The production snapshot is in R2 bucket `atlas-gallery-assets`, prefix `releases/v317/`: worker.mjs, index.html, assets/atlas-v317.js, data/, qa/, deployment.json and rollback/. QA contains local-summary.json, runtime-check.js, canonical-check.js, staging-ko-390.json, staging-en-1440.json, production-ko-390.json, production-en-1440.json and staging/production canonical results for both GOAP and Flow Field.

Rollback version: `8a9994a3-9804-43df-974e-ca4497631f1c` (v3.16). The original live Worker source, settings and deployment record were saved under releases/v317/rollback/ before deployment. The active version and bindings/compatibility/usage settings were rechecked immediately before writing production to avoid overwriting concurrent changes. Earlier release objects were not overwritten. Asset lookup falls back through v316, v315, v314, v313, v312 and v39. Implementation status and the current release manifest bypass edge caching so verification flags remain current.

The repository-root development Worker is not the deployed production baseline. Do not deploy it over the production Worker.

## Primary implementation references checked

- W3C ARIA APG Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- W3C ARIA APG keyboard-interface guidance: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- Epic Games Behavior Tree Overview, used for terminology and to distinguish these browser studies from Unreal: https://dev.epicgames.com/documentation/unreal-engine/behavior-tree-in-unreal-engine---overview
- Godot official documentation source on idle and physics processing, used to distinguish frame-based and fixed-step updates rather than claim a Godot runtime: https://github.com/godotengine/godot-docs/blob/master/tutorials/scripting/idle_and_physics_processing.rst
