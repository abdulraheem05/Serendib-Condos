# Serendib Condos — Next.js project

A complete, editable rebuild of the supplied Serendib Condos sample. Built with
**Next.js App Router, React, JavaScript, Tailwind CSS 4, Motion for React,
Lucide icons, and Leaflet/OpenStreetMap**. No TypeScript or map API key required.
The original website has not been changed or deployed.

## Quick start

Install a current Node.js LTS release (minimum **20.9**). Then extract the ZIP,
open a terminal in `serendib-condos-nextjs`, and run:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. `npm install` also works; `npm ci` uses the included
lockfile to reproduce the verified dependency set.

For production:

```sh
npm run build
npm start
```

The same URL opens the production app. For a different port, use
`npm start -- --port 3001`.

## Commands

| Command                   | Purpose                                                                                                                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Development server with hot reload                                                                                         |
| `npm run build`           | Optimized Next.js production build                                                                                         |
| `npm start`               | Run the production build                                                                                                   |
| `npm test`                | Project-data and filter tests, including 96 filter combinations                                                            |
| `npm run test:production` | After building, temporarily start a production server and test HTTP responses, assets, image optimization and 404 handling |

## Project structure

```text
serendib-condos-nextjs/
├── app/
│   ├── layout.js             # Global metadata, Leaflet CSS, Tailwind/global styles
│   ├── page.js               # Server-rendered home, process, about and consultation
│   ├── globals.css           # Tailwind import, design tokens and responsive styling
│   ├── loading.js            # Route loading state
│   ├── error.js              # Recoverable route error state
│   └── not-found.js          # Custom 404
├── components/
│   ├── Header.js             # Responsive, keyboard-accessible navigation
│   ├── Explorer.js           # City cards, filters, results and map/grid controls
│   ├── PropertyMap.js        # Client-only Leaflet, street tiles and photo popups
│   ├── ProjectCard.js        # Reusable project card with Next.js Image
│   ├── ProjectDialog.js      # Native accessible modal and project enquiry form
│   └── Reveal.js             # Motion for React; reduced-motion-aware section reveals
├── lib/
│   ├── data.js               # Contact details, city views and project records
│   └── projects.js           # Shared filtering, labels and encoded enquiry links
├── public/assets/            # Supplied logo and local photos, source and license credits
├── tests/projects.test.js    # Node test runner; no extra test dependencies
├── scripts/smoke-production.mjs
├── .env.example              # Production origin and server-only SMTP configuration
├── .gitignore
├── jsconfig.json             # @/ import alias
├── next.config.mjs           # Standard Next.js configuration and response headers
├── postcss.config.mjs        # Tailwind CSS PostCSS plugin
├── package.json
├── package-lock.json         # Exact dependency tree
└── README.md
```

## What changed

- Preserved the sample's branding and single-page navigation, using the supplied replacement logo:
  Home, Properties, How it works, About us and Consultation.
- Removed repetitive pitches, oversize image sections and repeated calls to action.
- Uses a 15.5px body font, compact headings, rounded cards and navy/gold/teal colors.
- Includes responsive mobile navigation, accessible controls, focus restoration,
  subtle card hovers and Motion section animations that respect reduced motion.
- Uses optimized, responsive `next/image` assets without remote font/CDN dependencies.
- Splits the implementation into reusable React components and pure data helpers.
- Loads Leaflet only on the client to avoid `window is not defined` during SSR.
- Shows real OpenStreetMap streets, roads and landmarks as you zoom in.
- City selection updates both markers and project cards and zooms to the city area.
  All Sri Lanka resets the island view; stage and bedroom filters work together.
- Marker popups contain a photo, project name, location and working View Details
  button. Locate focuses an individual marker at street zoom.
- Map/list and card-grid views share one dataset. Consultation and project buttons open enquiry forms.

## Customize your business information

### Project records and precise coordinates

Edit `lib/data.js`. The six projects were retained from the sample's explicitly
labelled demonstration data. They are **not verified actual inventory**. Galle
and Nuwara Eliya deliberately show empty states rather than invented developments.

```js
{
  id: 'unique-project-id',
  name: 'Developer-approved project name',
  stage: 'ongoing', // upcoming | ongoing | completed
  city: 'Colombo',  // must match a key in site.cities
  area: 'Approved address / neighbourhood',
  lat: 6.9065,      // example only: replace with exact approved latitude
  lng: 79.895,      // example only: replace with exact approved longitude
  bedsMin: 1,
  bedsMax: 3,
  price: 'Approved pricing or enquiry wording',
  image: '/assets/your-project.jpg',
  imageAlt: 'An accurate description of the actual photo',
  summary: 'A short, factual description.',
  demo: false      // change only after verifying/replacing the data and photo
}
```

Coordinates are decimal degrees, in **latitude, longitude** order. There are no
artwork offsets. Update `site.cities` to add a city; the filter options are
created automatically. Add a matching card to the city list in `Explorer.js`
if you also want it featured in the destination gallery.

The visible demonstration notices were removed as requested. The underlying sample project data is unchanged; replace it with approved listings before launch.

### Photographs and logo

- `public/assets/hero.jpg`: illustrative home hero.
- `public/assets/aurora.jpg`, `coastline.jpg`, `skyline.jpg`, `garden.jpg`,
  `harbour.jpg`, `lake.jpg`: illustrative property photos; replace with actual
  developer-approved photos or update each record's `image` path.
- `public/assets/colombo.jpg`, `galle.jpg`, `negombo.jpg`, `kandy.jpg`, `nuwara-eliya.jpg`:
  actual photographs of those destinations.
- `public/assets/logo.png`: business logo supplied in Website changes.zip.
- `public/assets/sources.json`: image source, photographer (where available) and
  Unsplash license links. Stock photo credits remain available; the city images and replacement logo were supplied by the site owner.

All photos are bundled locally. No external image CDN is required at runtime.
The named demo developments are not represented as the subjects of stock photos.
A project's popup, card and details intentionally reuse that project's photo
so visitors recognize the same listing across views.

Keep alt text accurate. Recommended replacement sizes: hero at least 1600px wide;
project images at least 900px wide; city photos at least 640px wide. `next/image`
optimizes and serves responsive sizes automatically.

### Copy, styles and email

- Main section copy: `app/page.js`.
- Explorer copy and empty states: `components/Explorer.js`.
- Contact address: `site.email` in `lib/data.js`.
- Color tokens and shared component styling: `app/globals.css`.
- Tailwind utilities: used directly in component `className` values. Tailwind 4
  theme colors are declared in `@theme`; no legacy Tailwind config is necessary.
- Animation: `components/Reveal.js`, using `motion/react` and `useReducedMotion`.

Consultation and project enquiry buttons open a popup form. `app/api/enquiry/route.js` sends submissions to **hello@serendibcondos.com** through SMTP; project enquiries include the selected project name, location and ID. The email address itself remains a normal email link. No database stores submissions.

## Environment and deployment

For local development no environment file is needed. For production, copy
`.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-real-domain.com
```

This sets the origin for social metadata. Vercel's production-domain environment
variable is used automatically when available; local development falls back to
`http://localhost:3000`. Public variables are intentionally not secrets.

### Vercel

Push this folder to your own Git repository and import it in Vercel. It detects
Next.js automatically. Use the default `npm run build` and Next.js output settings;
**do not** use the previous static package's `outputDirectory: "."` configuration.
Set `NEXT_PUBLIC_SITE_URL` to your final domain and deploy.

### Other hosts

Use a host with Node.js and Next.js support. Run `npm ci`, `npm run build`, then
`npm start`. Set `PORT` using the host's standard environment or pass `--port`.
The image optimizer requires the normal Next.js server; this package is not a
plain static export.

## Map service

Leaflet is an npm dependency, and its CSS is imported once in `app/layout.js`.
Tiles come from `https://tile.openstreetmap.org/{z}/{x}/{y}.png` and retain visible
OpenStreetMap attribution. Internet access is required for map tiles.
The cards, local photographs and filters remain usable if tiles fail to load.

Observe the OpenStreetMap tile usage policy:
https://operations.osmfoundation.org/policies/tiles/ . Do not prefetch/cache tiles
for offline use, remove attribution or block valid Referer headers. For substantial
traffic, replace the tile URL and attribution in `PropertyMap.js` with an
appropriate provider. No Mapbox/Google account is connected.

## Verification and remaining launch work

The package includes actual dependencies and lockfile, not placeholder imports.
The production build, filter/data tests and production HTTP smoke test were run
in the build environment. See the delivery message for the final results.

See the final delivery message for completed checks. Real mailbox delivery requires your own SMTP credentials and should be verified after deployment. The project records remain demonstration data even though the visible notices were removed as requested.

Dependency installation requires access to the public npm registry. The ZIP
intentionally excludes `node_modules`, `.next`, credentials and local caches.

## Typography update
Montserrat is bundled locally in public/fonts (Google Fonts, SIL Open Font License). It is a visual approximation of the supplied screenshot. Brand text beside the original logo and the visible hero stock caption were removed as requested. Image source credits remain in the asset documentation.

## Changes from the supplied documents

Applied the supplied logo and five city photographs; replaced Jaffna with Nuwara Eliya and a matching caption/filter; kept Sri Lanka together in the hero heading; moved the destination and property subtitles below their headings; renamed Map/Grid controls; tightened the island map framing; removed the specified captions and notices; and applied the font-size document. Other project records and section copy remain unchanged.

### Activate email delivery

1. Copy `.env.example` to `.env.local` locally, or set the variables in your hosting dashboard.
2. Enter `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` and `SMTP_FROM` from your email provider. Use port 587 with `SMTP_SECURE=false` (STARTTLS), or port 465 with `SMTP_SECURE=true`.
3. The sender must be permitted by that provider. The recipient is fixed to hello@serendibcondos.com; replies go to the visitor email.
4. Restart/redeploy, then submit a real consultation and a project enquiry to verify receipt.

Never use NEXT_PUBLIC_ for SMTP secrets or commit `.env.local`. If SMTP is not configured, the form shows a clear error and never claims the message was sent. Name, phone, email and message are required. Project IDs are validated on the server.

### Verification for this revision

Production build, eight unit tests (including 96 filter combinations), production HTTP/image checks, and browser checks at 1372, 1024, 768, 390 and 360px passed. Both popup forms were submitted through the actual API to an isolated local TLS SMTP test server; recipient, details, project attribution and success states were checked. No test email was sent to the real inbox. Map tiles were blocked by the test environment’s external network restrictions; Leaflet controls, markers, filters and map/grid switching were checked, but external street-tile imagery needs a normal internet connection.
