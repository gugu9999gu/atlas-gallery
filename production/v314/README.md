# ATLAS production v3.14.0

## Verified production deployment

Production: https://atlas-gallery.app/
New collection: https://atlas-gallery.app/?lang=ko&collection=v314
Status: https://atlas-gallery.app/implementation-status/
Machine-readable release evidence: https://atlas-gallery.app/data/release-v314.json

Worker deployment `f42ed345-8501-4877-be08-f428980d0ea3` was created at `2026-10-30T15:18:18.832129Z`. Version `8aae8475-04e1-432d-96cd-9c064418727e` serves 100% of production traffic. Production verification completed at `2026-10-30T15:20:13.149Z`.

## Coverage

| Metric | v3.13 | v3.14 |
|---|---:|---:|
| Canonical catalog entries | 2,153 | 2,153 |
| Directly interactive cards | 455 | 479 |
| Distinct interactive implementations | 443 | 467 |
| Specific previews, including existing static/animated references | 1,311 | 1,335 |
| Remaining planned/concept-diagram cards | 842 | 818 |

All 24 upgrades are existing planned records. No new duplicate dictionary records were created. The embedded app catalog retains its 2,156 records including three aliases; the public canonical catalog remains 2,153 entries.

## Implemented cards

Accessibility (6): WCAG contrast study, ARIA disclosure state, Semantic HTML, Screen Reader live-region study, Captions timeline, High Contrast Mode.

UI/design behavior (8): Iconography, Glyph, Affordance, Signifier, Feedback Loop, Content-first Design, Graceful Degradation, CSS.

Events and architecture (10): Native Widget, Event Loop, Callback, Signal and Slot, Model–View, MVC, MVVM, Data Binding, Layout Manager, Size Policy.

Each card has a specific working interaction, reset, bilingual explanatory scope and standalone HTML/CSS/JavaScript export through the existing card copy action. The examples perform real browser operations: unrounded sRGB contrast calculations; aria-expanded/hidden synchronization; native details; polite live-region changes; editable caption cues; shared SVG stroke properties; actual task/microtask ordering; timer callbacks; EventTarget listener connection/disconnection; separate model/controller/view logic; derived view-model validation; one-way/two-way bindings; and CSS Grid/Flex sizing.

## Scope boundaries

These are browser reference studies, not complete implementations of every named platform or discipline. The WCAG card tests the normal-text contrast criterion only, not overall conformance. The Screen Reader card demonstrates a real live region but is not a screen reader and does not synthesize speech. Captions use a simulated timeline, not an actual media file. High Contrast Mode changes the example's theme, not the OS. Native Widget uses browser controls; Signal and Slot, Layout Manager and Size Policy demonstrate principles in JavaScript/CSS rather than running Qt. Graceful Degradation intentionally simulates a capability change. The local-save feedback card does not send a server request or persist a note.

These limits are displayed on the cards and exported examples. No external network calls or persistent browser storage were added by the v3.14 overlay. Existing Three.js studies, advertising configuration, source verification labels, definitions and IDs remain unchanged.

## Verification performed

The final deployed asset was tested in local Chromium: 24 cards × Korean/English × widths 320/390/1440 = 144 layout/action/reset cases, plus 48 separately executed standalone HTML exports. All passed, with no captured JavaScript errors, no measured horizontal overflow in the tested example containers and a minimum 14px for inspected visible text. The rendered review sheet was also inspected.

Nineteen additional behavioral checks passed: black/white and identical contrast results; unrounded AA threshold; actual sync/microtask/timer ordering; disconnected signal listener; two-way binding; one-way readonly state and model-to-view update; invalid/valid view-model input; cancellation on reset; caption cue and visibility; valid ARIA controls target; detached-example cleanup; real Enter and Space disclosure interaction; real ArrowRight range interaction; and reduced-motion behavior.

Staging and production were both tested on Korean mobile (390px) and English desktop (1440px). Each run checked all 24 actions/resets, two name-copy controls and prompt/code controls per card, exact name/prompt/standalone HTML clipboard payloads, 14px inspected text, horizontal bounds, all coverage totals, the planned filter and labels, detached-example cleanup, retained v3.13 style registrations and the earlier linear-loading clipping fix. Nine new/old asset and canonical/document paths returned HTTP 200 with X-Atlas-Version: 3.14.0.

The English canonical Data Binding document was also executed at 390px on staging and production. Two-way and one-way binding, reset, code export, prompt UI, canonical URL, structured term identity, minimum text size and horizontal bounds passed.

Clipboard writes were intercepted to verify their payloads; operating-system clipboard permissions were not tested. Screen-reader speech, every browser/device combination and full WCAG conformance were not tested. Existing advertising configuration was preserved, not re-certified for ad delivery.

## Deployment assets and rollback

The production snapshot is in R2 bucket `atlas-gallery-assets` under `releases/v314/`: worker.mjs, index.html, assets/atlas-v314.js, data/, qa/, deployment.json and rollback/.

The qa/ directory includes local-summary.json, runtime-check.js, canonical-check.js, staging-ko-390.json, staging-en-1440.json, staging-canonical.json, production-ko-390.json, production-en-1440.json and production-canonical.json. These contain the actual Cloudflare Browser Rendering checks and their results.

Rollback version: `788d974c-6523-49ea-a95c-4266b8015fcc` (v3.13). The original Worker, settings and deployment record were saved before deployment under releases/v314/rollback/. Earlier release objects were not overwritten. Asset lookup falls back from v314 to v313, v312 and v39. Status and the current release manifest bypass edge caching so their post-deployment verification flags do not stay stale.

The repository-root development Worker is not the production baseline. Do not deploy it over the current production Worker.

## Build integrity

Source commit: `cda4f52c6c39eb8962cd9c58363f4a7f0f86231c`.
Build commit: `402e561875b0fcf0363b08084da79c52a763fc99`.

Run `node production/v314/build.mjs`. The build normalizes the Signal and Slot Korean display label against the existing catalog, then emits only when the asset SHA-256 exactly matches the locally tested and deployed bytes:

`fc9c6d03cb845435c126bf2be3a5bd7c9ed1578873040e18d8ce41756e58fba2` (39,539 UTF-8 bytes).

## Primary technical references checked during implementation

- W3C WCAG 2.2 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C ARIA APG Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- WHATWG HTML event loops: https://html.spec.whatwg.org/multipage/webappapis.html#event-loops
- Qt Signals & Slots, used to distinguish the browser analogy from a real Qt implementation: https://doc.qt.io/qt-6/signalsandslots.html
