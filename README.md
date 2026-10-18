# Serendib Condos — Next.js rebuild

A complete, self-contained Next.js site for Serendib Condos. It rebuilds the visual storytelling of the reference "Horizonte" site: an oversized wordmark over imagery, a cream concept section, a pinned horizontal gallery, an editorial section, and a map with a selected-property card. It uses the Serendib brand: Ringle Bold, Google Sans, `#0D1C31`, `#C9A66B`, `#FFFFFF`, and the supplied logo.

All property content is **demonstration content** carried over from the original HTML prototype. It is flagged as such on the site.

## Stack

- Next.js 15 (App Router), React 19, **JavaScript / JSX only**
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, via `@tailwindcss/postcss`)
- GSAP + ScrollTrigger for scroll storytelling (pinned hero, scrubbed concept text, pinned horizontal gallery, sticky-image steps, reveals)
- `clsx`
- Fonts are self-hosted from `public/assets/fonts`. There are no runtime network dependencies.

## Run locally

Requires Node 18.18 or newer.

```bash
npm install        # also creates package-lock.json
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint
```

## Folder structure

```
src/
  app/            layout.js, page.js, globals.css (tokens, @font-face, motion keyframes), icon.png
  components/     one file per section + map/explorer components
  data/
    properties.js        single source of truth for all properties (map, list, panel, dialog)
    site.js              copy, nav, stages, locations, bedroom options, enquiry helper
    sriLankaGeometry.js  generated island silhouette + projection fit + city labels
  hooks/useScrollAnimations.js   useScrollScene(): GSAP matchMedia + cleanup
  lib/            animation-utils.js, filters.js, map-layout.js
public/assets/    fonts/, logo/, images/
source-assets/    original fonts (TTF), map sample, original logo (not used at runtime)
tools/generate-images.py   optional generator for the illustrated scene images
```

## The unified Sri Lanka map

`PropertyExplorer` is the single owner of state: stage, view, filters, selection, hover preview, and the dialog. Markers, the list, the counts, and the detail panel are all derived from `filterProperties(properties, { stage, location, bedrooms })`. The data is never duplicated per stage and there is only one map.

- **Stage selector:** Upcoming (default), Ongoing, Completed. It is an ARIA tablist with arrow-key support. Changing the stage clears the selection.
- **Map / List toggle:** Map is the default. The selection persists when you switch views.
- **Stage markers (brand colours only):** Upcoming is a gold circle. Ongoing is a navy diamond with a gold outline. Completed is a white circle with a gold ring and a navy check.
- **Hover:** one preview card glides between markers on desktop. It also appears on keyboard focus.
- **Click or tap:** selects the property and opens a persistent detail panel. It is a bottom sheet on small screens and a column on wide ones. "Full details" opens an accessible dialog with a focus trap, Escape to close, and focus return.
- **Filters:** location and bedrooms use shared logic. When nothing matches, an in-page empty state appears (no `alert()`). Enquiry uses the existing `mailto:` to hello@serendibcondos.com.
- **Silhouette:** traced from `source-assets/reference/sri-lanka-map-sample.png` and simplified into an SVG path. Latitude and longitude are mapped to the SVG with an affine fit, so pins sit on land. Nearby pins (the Colombo cluster) are spread with leader lines by `layoutPins()`.
- **Map caveat:** the map is illustrative and not survey-accurate. Pin positions are approximate.

## Updating properties

Edit `src/data/properties.js`. Each entry has `stage` (`upcoming` | `ongoing` | `completed`), `lat` / `lng`, a location, bedrooms, images, and the original copy.

- Use `mapNudge` to adjust a pin by a few SVG units without changing its coordinates.
- Bedrooms ranges are derived into `bedsMin` / `bedsMax`.
- Images live in `public/assets/images`.

## Animation and motion

- GSAP setup is in `src/lib/animation-utils.js` and `src/hooks/useScrollAnimations.js`.
- Animations use `gsap.matchMedia()`. Desktop gets pinned and horizontal scenes. With `prefers-reduced-motion`, or on narrow screens, sections fall back to a static or stacked layout with all content visible.
- Initial hidden states are applied by GSAP, so the page is fully readable without JavaScript.
- Cleanup reverts the matchMedia context, which is safe in React Strict Mode.
- Interaction states (panel, sheet, view switch, marker pulse) are CSS keyframes. They are neutralised by the reduced-motion media query.
- Lenis and Leaflet are not used. The scroll is native and the map is custom SVG.

## Fonts and licensing

- **Ringle** (Bold, Medium, Italic) is the supplied display font, used unmodified. Please confirm you hold web-embedding rights for it.
- **Google Sans** is the supplied secondary font. The ZIP had Medium and Bold only, with no Regular. Medium serves weights 400–500 and Bold serves 600–700. They are Latin-subset WOFF files made from the supplied TTFs, and the original TTFs are kept in `source-assets/fonts`.
- `font-synthesis: none` is set, so the browser never fakes weights.

## Images

The photographs in `public/assets/images` are **generated brand-palette illustrations**, made with `tools/generate-images.py` (needs `pillow` and `numpy`). They are placeholders for real project photography. Replace them with files of the same name, or update the paths in `src/data/properties.js` and the section components.

## What was and wasn't verified

The build environment had no access to the npm registry, so:

- **Not run:** `npm install`, `next build`, and ESLint. No `package-lock.json` is included. `npm install` will create one on first run. Dependency ranges are in `package.json`.
- **Not run:** the real GSAP / ScrollTrigger runtime. Pinning, scrubbing, and horizontal travel are written to GSAP's documented API but not exercised.
- **Verified with a separate harness (outside this project):** server-side render plus hydration of the real components, CSS compiled with the real Tailwind v4 compiler, and a headless Chromium pass. That pass covered the font loading, no console errors, no horizontal overflow at 1440 px and 390 px, and 25 desktop and 8 mobile interaction assertions: stage switching, hover preview, selection persistence, list/map parity, filters and empty state, dialog focus handling, and the bottom sheet. In that harness `next/image`, `clsx` and `gsap` were stubbed.

## Known limitations

- The map is stylised, not cartographically exact.
- The sections follow the reference's layout and motion language, but the imagery is illustrated, so it is not pixel-identical.
- Property data is demonstration content, and the prices and details are not offers.
