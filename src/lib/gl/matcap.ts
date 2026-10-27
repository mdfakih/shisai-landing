/**
 * Procedural chrome matcap. A matcap bakes lighting + reflections into a
 * sphere image indexed by view-space normal, which is why reflections slide
 * across the steel as the object turns. Generated on a canvas: zero bytes
 * downloaded.
 */
export function makeMatcap(size = 256): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  // Base: bright brushed steel falling to dark at the limb.
  const base = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.2, R * 0.05, cx, cy, R);
  base.addColorStop(0, '#f6f8fa');
  base.addColorStop(0.45, '#c9cfd7');
  base.addColorStop(0.8, '#7a828e');
  base.addColorStop(1, '#4a515b');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Environment horizon: light sky above, darker floor below, sharp line between.
  const env = ctx.createLinearGradient(0, 0, 0, size);
  env.addColorStop(0, 'rgba(255,255,255,0.55)');
  env.addColorStop(0.42, 'rgba(255,255,255,0.08)');
  env.addColorStop(0.5, 'rgba(255,255,255,0.0)');
  env.addColorStop(0.52, 'rgba(15,20,30,0.42)');
  env.addColorStop(0.66, 'rgba(60,68,80,0.25)');
  env.addColorStop(1, 'rgba(120,128,140,0.15)');
  ctx.fillStyle = env;
  ctx.fillRect(0, 0, size, size);

  // Thin bright reflection line just above the horizon.
  const line = ctx.createLinearGradient(0, size * 0.44, 0, size * 0.5);
  line.addColorStop(0, 'rgba(255,255,255,0)');
  line.addColorStop(0.6, 'rgba(255,255,255,0.75)');
  line.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = line;
  ctx.fillRect(0, size * 0.44, size, size * 0.06);

  // Key light specular.
  const spec = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.45, 0, cx - R * 0.35, cy - R * 0.45, R * 0.38);
  spec.addColorStop(0, 'rgba(255,255,255,0.95)');
  spec.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, size, size);

  // Cool rim from the right so edges never go flat.
  const rim = ctx.createRadialGradient(cx + R * 0.75, cy + R * 0.1, 0, cx + R * 0.75, cy + R * 0.1, R * 0.5);
  rim.addColorStop(0, 'rgba(190,205,230,0.45)');
  rim.addColorStop(1, 'rgba(190,205,230,0)');
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);

  ctx.restore();
  return c;
}
