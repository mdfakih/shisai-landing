/**
 * Pre-render every route to static HTML after `vite build`.
 *
 * The browser then paints real content (headline, buttons, logo, the joint
 * drawing) as soon as the HTML and CSS arrive, instead of waiting for the
 * JavaScript, and the app hydrates over it. Unknown URLs fall back to
 * spa.html, the plain client-rendered shell (see vercel.json).
 *
 * Usage: vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Same React build as the browser bundle, so markup matches and dev-only warnings stay out.
process.env.NODE_ENV = 'production';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ROUTES = ['/', '/products', '/about', '/certificates', '/contact'];
const ROOT_TAG = '<div id="root"></div>';

/** Route page module for each path, to preload its lazy chunk with the HTML. */
const PAGE_SOURCES = {
  '/products': 'src/pages/Products.tsx',
  '/about': 'src/pages/About.tsx',
  '/certificates': 'src/pages/Certificates.tsx',
  '/contact': 'src/pages/Contact.tsx',
};

async function main() {
  const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
  if (!template.includes(ROOT_TAG)) throw new Error(`index.html has no ${ROOT_TAG}`);
  const manifest = JSON.parse(await fs.readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'));
  const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

  // Shell for URLs that are not pre-rendered (404s, future routes).
  await fs.writeFile(path.join(dist, 'spa.html'), template);

  for (const route of ROUTES) {
    const html = await render(route);
    const page = template
      .replace('<html lang="en">', '<html lang="en" data-prerendered>')
      .replace('</head>', `${preloads(manifest, route, template)}</head>`)
      .replace(ROOT_TAG, `<div id="root">${html}</div>`);
    const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, page);
    console.log(`prerendered ${route.padEnd(14)} ${(page.length / 1024).toFixed(1)} KB`);
  }
  // The manifest was only needed for the preload tags above.
  await fs.rm(path.join(dist, '.vite'), { recursive: true, force: true });
}

/** modulepreload tags for a route's lazy page chunk and its imports, so hydration is not held up. */
function preloads(manifest, route, template) {
  const src = PAGE_SOURCES[route];
  if (!src || !manifest[src]) return '';
  const files = new Set();
  const walk = (key) => {
    const entry = manifest[key];
    if (!entry || files.has(entry.file)) return;
    files.add(entry.file);
    (entry.imports ?? []).forEach(walk);
  };
  walk(src);
  // The entry and vendor chunks are already in the template's head.
  return [...files]
    .filter((f) => !template.includes(`/${f}"`))
    .map((f) => `    <link rel="modulepreload" crossorigin href="/${f}">\n`)
    .join('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
