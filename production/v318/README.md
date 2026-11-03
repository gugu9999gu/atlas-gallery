# ATLAS Gallery — Cloudflare production v3.18.0 (2026-11-03)

Production: https://atlas-gallery.app/?lang=ko&collection=v318
Status: https://atlas-gallery.app/implementation-status/
Release metadata: https://atlas-gallery.app/data/release-v318.json

## Deployment result

- Canonical references: 2,153 (unchanged)
- Interactive cards: 551 → 563 (+12)
- Unique implementations: 539 → 551 (+12)
- Specific previews: 1,407 → 1,419 (+12)
- Concept diagrams remaining: 746 → 734 (−12)
- New preview modes: native 611, exact 777, legacy-exact 2, effect 29, diagram 734
- Cloudflare Worker: atlas-gallery, production traffic 100%
- Production deployment ID: dcd68e9a-fa65-4f55-9ce8-ae45d4779776
- Production Worker version ID: 2d84c75a-198f-4ac3-8f54-5936be897ab8
- Previous v3.17.0 Worker version ID retained for rollback: b0bad105-e487-46f1-9304-28186b6c0ca7
- R2 release assets: atlas-gallery-assets / releases/v318/
- Previous R2 assets: releases/v317/ (preserved)

This production lineage is separate from the GitHub root static-source v3.2.x lineage. Never deploy the root worker.mjs as a replacement for this production Worker.

## Upgraded existing IDs and preview keys

| Term | Canonical ID | Preview key |
| --- | --- | --- |
| Voronoi Diagram | dar-eaf8288da983 | geo-voronoi |
| Perlin Noise | dar-c0ba1313c297 | geo-perlin |
| Fractal Brownian Motion | dar-c8755d71db8e | geo-fbm |
| BSP Dungeon | dar-4afe7c548909 | geo-bsp |
| Isoline | dar-e927a41ade6b | geo-isoline |
| Label Collision | dar-79f90b8cac02 | geo-label |
| Marker Clustering | dar-a93cbd09246b | geo-cluster |
| Geofencing | dar-84278562ae06 | geo-fence |
| Spatial Join | dar-9db3a96cdf3d | geo-join |
| Geospatial Buffer | dar-752c2a37fc6a | geo-buffer |
| Proportional Symbol Map | dar-5d5cecc2dacb | geo-symbol |
| Map Generalization | dar-200458a776da | geo-general |

All new previews implement original JavaScript/SVG interactions with adjustable parameters, two controls, reset, bilingual limitations, and standalone HTML code export. Existing source attribution, descriptions, canonical IDs, older overlays, and advertising infrastructure remain.

## Code and validation

- atlas-v318.js: 12 original planar-geometry and procedurally generated previews, Atlas32 adapter, standalone export.
- worker.mjs: exact deployed Cloudflare Worker snapshot.
- prepare-cloudflare.js: build v318 index/catalog and coverage from preserved v317 release.
- prepare-worker.js: create v318 Worker from the preserved v317 Worker.
- qa-browser.js: in-browser interaction, input, 14px and clipping checks.
- test-live.py: Playwright 320/390/1440px x Korean/English, 24 standalone HTML exports and canonical document checks.
- GitHub Actions workflow: .github/workflows/atlas-v318-qa.yml. No completed CI result was confirmed in this session.

Confirmed: 234 source syntax/algorithm/standalone-generation assertions passed; 12/12 Korean 390px staging cards passed interaction/range/reset/export/font/overflow test; production 390px rendered all 12; production 320px passed all 12 interaction/range/reset/export/font/overflow tests; production API reported v3.18 at 100% traffic.

Not confirmed: English/desktop full-matrix browser results and 24 isolated standalone HTML executions. Follow-up Cloudflare Browser Rendering requests returned HTTP 429. This is an original illustrative planar implementation, not GPS, real GIS data, geodesic accuracy, universal accessibility certification, or cross-browser certification.

Rollback: preserve the previous Worker version and v317 R2 prefix; deploy the previous version at 100% through official Cloudflare Worker version deployments and verify the live version/header. Never overwrite the preserved v317 objects.
