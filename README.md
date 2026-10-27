# Shisai Steel Industries — website

Marketing site for a hygienic stainless steel fittings manufacturer in Vasai, India.
Vite + React 18 + TypeScript + Tailwind, deployed on Vercel.

## Run

```sh
npm install
npm run dev        # http://localhost:8080
npm run build      # production bundle in dist/
npm run preview    # serve dist/ locally
npm run typecheck
npm run lint
```

## Structure

```
src/
  data/           company.ts (contact, stats, certificates), products.ts (catalogue)
  components/
    brand/        TriClamp3D.tsx — WebGL tri-clamp joint (hero + exploded view),
                  TriClampAssembly.tsx — SVG placeholder / no-WebGL fallback,
                  dimensions.ts + DimensionOverlay.tsx — callouts anchored to 3D points
    home/         one file per home-page section
    layout/       Navigation, Footer, PageIntro, WhatsAppFab
    motion/       Reveal.tsx — IntersectionObserver reveal wrapper
    products/     ProductCard, ProductDialog
    shared/       SectionHeading, Marquee, CtaButtons, BrandLogo
  hooks/          useReveal, useScrollProgress, useCountUp, useScrollSpy, useTheme
  lib/gl/         hand-written WebGL viewer: math, lathe geometry, matcap, scene
  pages/          Home, Products, About, Certificates, Contact, NotFound
scripts/
  optimize-images.mjs       converts new JPG/PNG assets to WebP, trims the logo
  render-certificates.mjs   renders page 1 of each certificate PDF to WebP previews
```

## Editing content

- **Contact details, hours, GST, stats, certificates** → `src/data/company.ts`
- **Products** → `src/data/products.ts` (add images under `src/assets/products/`,
  then run `npm run optimize:images` to convert them to WebP)
- **Certificate PDFs** → `public/certificates/`, then run
  `node scripts/render-certificates.mjs` to regenerate the image previews in
  `public/certificates/previews/` (the site shows these instead of PDF iframes)

Items in `company.ts` marked `verify` (dimensional standards, Ra values) should be
confirmed with the client before launch.

## Performance notes

- No animation or 3D libraries. The hero object is a ~5 KB gzipped hand-written
  WebGL viewer (`src/lib/gl`) that lazy-loads after first paint and cross-fades
  from an inline SVG. Surfaces of revolution are generated from 2D profiles and
  shaded with a procedural matcap. Falls back to the SVG without WebGL.
- Page motion is CSS transforms driven by IntersectionObserver and a rAF scroll
  listener. The anatomy section's steps are clickable and scroll to the matching
  assembly state.
- Secondary routes are code-split; the landing page ships ~100 KB gzipped JS.
- All raster assets are WebP; product shots are cropped and capped at 560 px.
- Certificates are previewed as pre-rendered WebP images, never PDF iframes;
  the PDF downloads only on request. The Google Map iframe mounts only when
  scrolled near.
- Every animation respects `prefers-reduced-motion`.

## Theme

Light and dark, toggled from the nav and persisted in `localStorage` under `theme`.
An inline script in `index.html` applies the stored or OS preference before first
paint. Tokens live in `src/index.css` (`:root` and `.dark`). Product photo tiles use
`.plate`, which stays light in dark mode because the source photos have white
backgrounds.

## Enquiry form

There is no backend. The form validates with Zod and opens a pre-filled
WhatsApp chat or `mailto:` link. Swap `onSubmit` in `src/pages/Contact.tsx` for a
fetch to a form service if server-side capture is needed later.
