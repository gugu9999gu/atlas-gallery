# ATLAS Preview Visual Review — 2026-10-30

## Scope and evidence

- Reviewed the baseline `main` commit `050f5c8e` portable Chromium snapshot: **2,189 canonical references** (1,140 specific visual/interactive previews, 1,049 concept diagrams).
- Existing `qa/visual-audit/{specific,diagram}/metrics.json` reports **zero** detected SVG label collisions, offstage SVG labels, sub-14px text, and empty frames at its static-screenshot thresholds. This does not prove that each concept is semantically accurate or that every animation works.
- Inspected original 26 motion-graphics contact previews and retested all **162 distinct DOM/CSS interactive recipe keys** with Playwright at **320×250**, **360×250**, and **650×340**. Checked 26 motion-graphics studies also at **248×182**.
- A prior 248×182 *audit capture* of generic DOM interactive examples (minimum stage height 250px) clipped replay/action controls, even though they were fully visible in the real 250px live card. The new audit deliberately checks live content at actual rendering sizes rather than treating the compact contact sheet as a functional test.

## Findings and repairs

1. **Title and artwork collision**: motion-graphics headings overlapped kinetic typography, lower thirds, SVG effects, and motion paths in compressed captures. Placed the heading in its own strip and dedicated the remaining area to animated artwork.
2. **Empty/weak initial frames**: typewriter, character stagger, logo reveal, stroke drawing, and alpha/luma matte could appear blank when the frame was not actively animating. An offscreen/paused poster now displays recognizable content. Negative timeline offset gives the visible animation a meaningful first frame while retaining its actual movement.
3. **Tight control spacing**: compact motion thumbnails wrapped the Korean play/pause labels and clipped the control/status rows. The toolbar now keeps button labels on one line, uses responsive container rules and follows the allocated preview height. Re-play, pause, playback speed and keyboard operation remain available.
4. **Long labels and reduced motion**: shortened the speed-ramping mini caption and adjusted compact type sizing. System `prefers-reduced-motion` and the gallery's global motion pause preserve a static representation.

## Browser regression and limits

`python scripts/test-preview-layout.py` validates **162 × 3 + 26 = 512** geometry samples; tests visible motion advancing and stopping on pause, reports JavaScript errors, and saves `qa/live-preview-layout-v325.json`. It runs in the interaction CI workflow alongside the existing full interaction, WebGL, SEO and AdFit checks.

Keep the baseline 2,189-card static audit and the 162-item live-layout check separate. The static audit does not simulate all possible pointer/scroll/animation states; the live check does not establish third-party rendering parity or replace manual cross-device review. Neither a green CI job nor GitHub merge verifies Cloudflare production deployment.
