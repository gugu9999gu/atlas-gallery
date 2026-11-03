# ATLAS Gallery Cloudflare production v3.20.0 (2026-11-03)

Production: https://atlas-gallery.app/?lang=ko&collection=v320
Implementation status: https://atlas-gallery.app/implementation-status/
Release evidence: https://atlas-gallery.app/data/release-v320.json

## Counts and deployment

| Metric | v3.19 | v3.20 |
|---|---:|---:|
| Canonical records | 2,153 | 2,153 |
| Direct-interaction cards | 579 | 595 |
| Unique interactive recipes | 567 | 583 |
| Specific previews | 1,435 | 1,451 |
| Remaining concept/planned diagrams | 718 | 702 |

The preview-mode distribution is native 643, exact 777, legacy-exact 2, effect 29, diagram 702. No duplicate canonical dictionary records were added.

Cloudflare production Worker: atlas-gallery.
Deployment ID: 03520804-73ec-4a58-b57b-13291fd337b6.
Worker version ID: fe95a02f-b525-4144-a829-d51a4761967f.
Created: 2026-11-03T05:23:20.1696Z.
Traffic share: 100%, confirmed through Cloudflare Worker deployments.
Previous v3.19 version retained for rollback: 32962d56-5e29-4e64-bed7-de023aec7032.
Previous deployment: 9e321785-9b1e-48e2-8236-41de000c8950.

Immutable previous R2 release: releases/v319/. New versioned R2 release: releases/v320/. Bucket: atlas-gallery-assets. The current production Worker has a fallback chain to the preserved previous release. Do not delete R2 release assets or deploy the separate root repository Worker.

## Upgraded existing canonical references

| Name | Canonical ID | Demo key |
|---|---|---|
| View Transition API | dar-7a8fef28336a | perf-view |
| Critical Rendering Path | dar-5ed4fd3c3b98 | perf-path |
| CSR | dar-c6935fbfa3c2 | perf-csr |
| SSR | dar-1d892b657a92 | perf-ssr |
| SSG | dar-bc155cebac99 | perf-ssg |
| Hydration | dar-374fae2f5384 | perf-hydration |
| Islands Architecture | dar-468e11bd8c6a | perf-islands |
| Code Splitting | dar-1b0ebe710e1e | perf-split |
| Tree Shaking | dar-eed6cddce434 | perf-shake |
| LCP | dar-8fd635d0827e | perf-lcp |
| CLS | dar-3b1910ae945b | perf-cls |
| INP | dar-5b6925abbfd8 | perf-inp |
| Performance Budget | dar-f25fef7d971b | perf-budget |
| Animation Curve | dar-04df56f9d567 | perf-curve |
| Keyframe Animation | dar-c40ef3e4b163 | perf-keyframes |
| Stagger | dar-258b4065f756 | perf-stagger |

Every study has two controls, an adjustable range input, reset, bilingual limitation text and standalone HTML via the existing Atlas32 copy-code bridge. Original identifiers, terminology definitions, source links, prior interactive overlays, advertising settings and Three.js demos remain.

The View Transition example invokes the browser document.startViewTransition API when supported and uses an instant fallback. Keyframe Animation and Stagger use browser Web Animations API. The SSR/SSG/hydration/islands/bundling stages are explicitly labeled small browser models: they do not perform a server build, actual SSR, production bundling, or remote network requests. The LCP/CLS/INP and payload-size figures are synthetic educational inputs, not collected Core Web Vitals or real site metrics.

## Evidence and reproducibility

- production/v320/atlas-v320.js: original browser demonstration module.
- production/v320/prepare-cloudflare.js: versioned application/catalog/coverage builder from v3.19.
- production/v320/prepare-worker.js: versioned Cloudflare Worker builder from v3.19.
- production/v320/worker.mjs: exact deployed Worker source snapshot, 32,195 characters.
- production/v320/qa-browser.js: real Chromium control, slider, reset, code availability, 14px minimum, overflow and earlier adapter checks.
- production/v320/test-algorithms.mjs: deterministic source-level calculation/standalone assertions; run with node production/v320/test-algorithms.mjs.
- .github/workflows/atlas-v320-qa.yml: GitHub Actions workflow, outcome not independently verified during this release.

Tests actually passed:
1. 327 deterministic JavaScript registry, calculation and HTML export assertions; final View Transition label change was rechecked for syntax and runtime behavior.
2. Staging Korean 390px, English 320px and English 1440px: 16/16 cards each with controls, alternative, range, reset, standalone source generation, minimum 14px text and no clipped button or horizontal overflow.
3. Staging verified that older v3.18 Voronoi and v3.19 Wang Tiles adapter mappings still work.
4. Independent Keyframe Animation HTML opened in fresh Chromium at 320px: Web Animations API, state updates, range and reset passed.
5. Independent View Transition API HTML opened in fresh Chromium at 390px: actual document.startViewTransition, changed panel label and reset passed.
6. Production site Korean 390px: 16/16 cards rendered, HTTP 200, header X-Atlas-Version: 3.20.0.
7. Production Korean 320px: 16/16 cards passed control, alternate action, slider, reset, code generation and layout checks.
8. Production deployment and versioned R2 manifest were read back successfully; Worker traffic was 100%.

Verification limitations: not every standalone export combination was executed independently in all browsers; OS clipboard permissions, production Web Vitals, true SSR/SSG/compilation backend work, screen readers, ad operations and universal browser support were not certified.

## Safe rollback

Keep releases/v319/ and the previous Worker version intact. If rollback is needed, inspect the current production Worker deployment and its bindings, deploy the retained v3.19 version (32962d56-5e29-4e64-bed7-de023aec7032) to 100% traffic through the official Cloudflare Worker versions API, then re-check the production X-Atlas-Version header and asset access. Do not deploy the GitHub repository-root Worker, which belongs to a separate static-source lineage.
