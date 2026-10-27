/**
 * One-off asset pipeline: converts raster assets to WebP, trims the logo,
 * crops the IndiaMART frame off product shots. Re-run after adding images.
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('src/assets');
const RASTER = /\.(jpe?g|png)$/i;

const jobs = [
  { dir: 'products', width: 560, quality: 78, cropPct: 0.065 },
  { dir: 'aboutUs', width: 960, quality: 74, cropPct: 0 },
];

async function convertDir({ dir, width, quality, cropPct }) {
  const abs = path.join(ROOT, dir);
  const files = (await readdir(abs)).filter((f) => RASTER.test(f));
  let before = 0;
  let after = 0;
  for (const file of files) {
    const src = path.join(abs, file);
    const out = src.replace(RASTER, '.webp');
    const meta = await sharp(src).metadata();
    const cx = Math.round(meta.width * cropPct);
    const cy = Math.round(meta.height * cropPct);
    let img = sharp(src);
    if (cropPct > 0) {
      img = img.extract({
        left: cx,
        top: cy,
        width: meta.width - cx * 2,
        height: meta.height - cy * 2,
      });
    }
    await img
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out);
    before += (await stat(src)).size;
    after += (await stat(out)).size;
    await unlink(src);
  }
  console.log(
    `${dir}: ${files.length} files, ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  );
}

async function trimLogo() {
  const src = path.join(ROOT, 'logo.png');
  const trimmed = sharp(src).trim({ threshold: 10 });
  await trimmed
    .clone()
    .resize({ height: 160 })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(ROOT, 'logo-trimmed.png'));
  await trimmed
    .clone()
    .resize({ height: 160 })
    .webp({ quality: 90, lossless: false })
    .toFile(path.join(ROOT, 'logo.webp'));
  const s1 = (await stat(path.join(ROOT, 'logo.webp'))).size;
  console.log(`logo.webp: ${(s1 / 1024).toFixed(1)}KB`);
}

async function sampleLogoColors() {
  const { data, info } = await sharp(path.join(ROOT, 'logo.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });
  const buckets = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b, a = 255] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 200) continue;
    if (r > 235 && g > 235 && b > 235) continue;
    const key = `${r >> 4},${g >> 4},${b >> 4}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }
  const top = [...buckets.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  console.log('logo color buckets (r,g,b >>4):', top);
}

for (const job of jobs) await convertDir(job);
await trimLogo();
await sampleLogoColors();
