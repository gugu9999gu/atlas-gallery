# ATLAS v3.2.3 — interactive foundations and visual regression

Edited: 2026-10-29. Scope: source and browser-rendered previews, not deployment verification.

## Existing terms upgraded

18 existing canonical terms retain their original `dar-*` IDs and gain real, copyable HTML/CSS/JavaScript previews:
Accessible Name, Focus Order, Contrast Ratio, Touch Accessibility, Error Prevention,
Error Identification, Typography Scale, Type Hierarchy, Spacing Scale, Elevation,
Shadow Token, Stroke / Border, Design Variant, Component State, Bento Layout,
Specificity, clamp(), Scroll Margin.

The examples are original demonstrations, not vendor implementations or WCAG conformance certificates.

## Scope and progress

- Canonical reference entries: **2,167**.
- Specific preview renderers: **1,118 (51.59%)**, compared with 1,100 (50.76%) in v3.2.2.
- Remaining concept diagrams: **1,049**.
- Runnable recipe definitions: **133**, including 24 Three.js scenes.
- Original English/Korean definitions and stable reference URLs are retained.

## Visual QA

- The preceding v3.2.2 branch rendered and automatically inspected all 2,167 reference cards. It repaired 46 detected SVG label overlaps, with zero remaining under the then-current automated thresholds.
- This release reviewed the 18 newly upgraded card previews at 250 px viewport height using Chromium and a 6×3 contact sheet.
- All 18 previews displayed visible content, zero directly rendered text elements below 14 CSS px, and zero JavaScript page errors. Two intentionally scroll-clipped descendants in Scroll Margin stay inside its own scroll container.
- All 18 examples exported runnable standalone HTML and passed interaction tests locally. The main CI runs the full regression suite and its own browser environment.
- Contrast Ratio calculates relative luminance against the actual dark background (`#080808`) before comparing with a 4.5:1 AA normal-text reference threshold.

## Preservation and limitations

AdFit placement/consent implementation, Three.js renderer pooling, Korean/English reference pages, reduced-motion behavior, and per-card code copying remain unmodified in their core logic. The build includes the new foundations CSS in the standalone HTML export.

Full cross-device visual appearance and accessibility certification require separate device testing and expert review. Successful GitHub CI or Worker `--dry-run` does **not** prove Cloudflare production deployment.
