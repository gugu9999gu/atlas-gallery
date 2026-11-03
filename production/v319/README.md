# ATLAS Gallery v3.19.0 — production release (2026-11-03)

Production: https://atlas-gallery.app/?lang=ko&collection=v319

Status: https://atlas-gallery.app/implementation-status/

Machine-readable release: https://atlas-gallery.app/data/release-v319.json

## Coverage

| Metric | v3.18 | v3.19 |
|---|---:|---:|
| Canonical records | 2,153 | 2,153 |
| Directly interactive cards | 563 | 579 |
| Unique interactive implementations | 551 | 567 |
| Specific previews | 1,419 | 1,435 |
| Remaining planned concept diagrams | 734 | 718 |

Preview modes: native 627, exact 777, legacy-exact 2, effect 29, diagram 718.

The existing canonical record IDs, descriptions, external references, earlier code-copy tools, Three.js studies, and advertising configuration were preserved.

## New study keys and records

| English | Canonical ID | Study |
|---|---|---|
| Wang Tiles | dar-bec6171276e6 | map-wang |
| Seed | dar-eb0f882933d4 | map-seed |
| Simplex Noise | dar-d599af71db6a | map-simplex |
| Wave Function Collapse | dar-b2a1603af7af | map-wfc |
| DEM | dar-4d7af1c8aafb | map-dem |
| Terrain Erosion | dar-f5685c0fb1e9 | map-erosion |
| Water Flow Map | dar-019ce12167c2 | map-flow |
| Raster Tile | dar-67ac503913c6 | map-raster |
| Vector Tile | dar-1509e452e1c0 | map-vector |
| XYZ Tile Scheme | dar-793fb4f01a87 | map-xyz |
| GeoJSON | dar-d6527eef4bb1 | map-geojson |
| Map Legend | dar-07e6ee29fe0c | map-legend |
| Scale Bar | dar-ef9d9e33319b | map-scale |
| North Arrow | dar-1beb3a7e3abf | map-north |
| Map Projection | dar-75099b531490 | map-projection |
| Latitude / Longitude | dar-ffee68607195 | map-latlon |

These are original, self-contained HTML/SVG/JavaScript studies with two controls, range input, reset, bilingual limits and independent HTML export through the Atlas32 code-copy adapter. Implementations demonstrate tile joins, reproducible seeded algorithms, minimum-entropy WFC constraints, illustrative DEM and thermal erosion, downhill direction vectors, raster and zoomable vector geometry, Web Mercator XYZ indexing, GeoJSON feature structures, linked legends, display-unit scale bars, rotation-aligned north, two latitude projections and coordinate selectors.

No example loads GPS, remote maps, real DEM observations, geodetic precision or external mapping service. Vector Tile illustrates SVG geometry, not MVT binary encoding. These are teaching references, not production GIS implementations or vendor demonstrations.

## Production deployment and rollback

- Cloudflare Worker: atlas-gallery.
- Version: 3.19.0.
- Deployment: 9e321785-9b1e-48e2-8236-41de000c8950.
- Worker version: 32962d56-5e29-4e64-bed7-de023aec7032.
- Created: 2026-11-03 13:54:48 Korea time.
- Cloudflare traffic: 100% confirmed.
- Assets: R2 bucket atlas-gallery-assets, prefix releases/v319/.
- Previous v3.18 deployment: dcd68e9a-fa65-4f55-9ce8-ae45d4779776.
- Previous Worker version: 2d84c75a-198f-4ac3-8f54-5936be897ab8.
- Existing v3.18 and older R2 release prefixes are preserved. Rollback requires deploying the previous Worker version and checking the live version header.

## Implemented and verified

Source module: production/v319/atlas-v319.js.
Build scripts: production/v319/prepare-cloudflare.js and prepare-worker.js.
Production Worker source snapshot: production/v319/worker.mjs.
Algorithm regression: node production/v319/test-algorithms.mjs.
DOM/browser assertions: production/v319/qa-browser.js.

Source-level JS assertions passed for 461 algorithm, catalogue and HTML-export cases; presentation fixes were then syntax-checked. Real Cloudflare Chromium staging passed 16/16 card controls, range, reset, code generation, font size (14px minimum) and clipping checks for Korean 390px, English 320px and English 1440px. Prior v3.17 AI and v3.18 GIS adapter mappings remained available. WFC standalone export passed a fresh Chromium 320px load, step, solve, range and reset. Real production Korean 390px rendered 16/16, and production Korean 320px passed 16/16 interactive/regression cases.

Not certified: full separate browser runs for all standalone exports, all browser engines/devices, operating-system clipboard permissions, actual geospatial/meteorological measurements, comprehensive accessibility testing, advertising legal compliance.

The GitHub repository-root v3.2.x static-source lineage is separate from Cloudflare production v3.19: do not overwrite the production Worker with repository-root Worker/Wrangler configuration.
