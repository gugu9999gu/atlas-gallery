# ATLAS Gallery v3.10.0 — production overlay

Production URL: https://atlas-gallery.app/

This release builds on the separately deployed Cloudflare ATLAS v3.9.0 production Worker and its **immutable R2 assets**, rather than replacing production with the GitHub v3.2.3 application. The older Worker version remains deployable as a rollback.

## Changes (2026-10-29)

- Preserve all 2,153 canonical references and the entire v3.9 catalog.
- Upgrade 12 previously explanatory diagrams (existing `dar-*` identifiers) to runnable, source-copyable original DOM/CSS/JavaScript examples. The new implementation is `atlas-v310.js`, which patches `window.Atlas32.recipe/art/markup/mount/code` and delegates unchanged entries to v3.9.
- Native/specific preview coverage: **1,235 / 2,153 (57.36%) → 1,247 / 2,153 (57.92%)**. Remaining diagrams: **918 → 906**.
- Direct interactive cards: **379 → 391**, unique implementations: **368 → 380**.
- Coverage upgrade types: overflow button; drag sorting; keyboard shortcut; contextual actions; confirmation; entrance, exit, fade, slide and easing animations; touch accessibility; CSS transitions.
- AdFit and other existing scripts, layout, 3D renderer, R2 backup data, bilingual canonical pages, and content security policy remain intact.

## Verification

- Chromium: 12 of 12 controls changed state, and all 12 exported standalone HTML examples ran with no reported JavaScript errors; minimum rendered text 14px and no horizontal page overflow at 390px.
- Release staged first on Worker `atlas-gallery-v310-preview` and checked on its workers.dev URL. The new `dar-61b3f6bc4056` preview rendered on the staging detail panel.
- Production Worker `atlas-gallery` deployed at 100% on Cloudflare: version `671bbe43-9dba-485e-8f61-80d17be4e7d8`, deployment `80c3a20b-8b34-4c8d-92dc-58e0c2767086`.
- Cloudflare Browser Rendering fetched **https://atlas-gallery.app/?lang=ko#term=dar-61b3f6bc4056** and verified the real `data-atlas40="a40-overflow"` example and Korean “전체 직접 조작 391개” button.
- This evidence does **not** certify all devices/browsers, WCAG compliance or real advertising fill.

## Source of truth and rollback

This GitHub directory includes the independently authored v3.10 interactive overlay, not a verbatim copy of every existing production file. The active production R2 release namespace is `releases/v310/`; it includes `index.html`, `worker.mjs`, `assets/atlas-v310.js`, `data/atlas.json`, `data/preview-coverage.json`, `data/implementation-status.json`, `data/implemented40.json` and `deployment.json`. Unmodified resources fall back to `releases/v39/` through the Worker. Both v3.9 files and the prior deploy remain preserved.

To roll back after a regression, use the Cloudflare Worker deployment API or dashboard to restore **v3.9 version `6e4de119-e473-49ef-900b-2300e0bcbccd` to 100%**. Do not delete R2 objects and do not deploy the GitHub v3.2.3 Worker over this production route.

Further progress should be measured against the **actual production baseline of 2,153 canonical references**, not the separate GitHub development baseline of 2,167 entries.
