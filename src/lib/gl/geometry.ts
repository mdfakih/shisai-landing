import type { Mat4 } from './math';

/**
 * Geometry generators. Everything in the tri-clamp joint except the lugs is a
 * surface of revolution, so a closed 2D profile revolved around Z covers it.
 */
export interface Geometry {
  positions: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
}

/** [radius, z] pairs, listed so that outward normals follow the right-hand rule. */
export type Profile = Array<[number, number]>;

export function lathe(profile: Profile, segments = 72): Geometry {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const n = profile.length;
  for (let s = 0; s < n; s++) {
    const [r0, z0] = profile[s];
    const [r1, z1] = profile[(s + 1) % n];
    const dr = r1 - r0;
    const dz = z1 - z0;
    const len = Math.hypot(dr, dz) || 1;
    const nr = dz / len;
    const nz = -dr / len;
    const base = pos.length / 3;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const c = Math.cos(a);
      const si = Math.sin(a);
      pos.push(r0 * c, r0 * si, z0, r1 * c, r1 * si, z1);
      nor.push(nr * c, nr * si, nz, nr * c, nr * si, nz);
    }
    for (let i = 0; i < segments; i++) {
      const k = base + i * 2;
      idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
  }
  return {
    positions: new Float32Array(pos),
    normals: new Float32Array(nor),
    indices: new Uint16Array(idx),
  };
}

/** Mirror a profile across z = 0, keeping normals outward. */
export const mirrorZ = (profile: Profile): Profile =>
  [...profile].reverse().map(([r, z]) => [r, -z] as [number, number]);

/** Axis-aligned box centred on the origin with flat-shaded faces. */
export function box(w: number, h: number, d: number): Geometry {
  const x = w / 2;
  const y = h / 2;
  const z = d / 2;
  // Each face: normal, then four corners in CCW order.
  const faces: Array<[number[], number[][]]> = [
    [[0, 0, 1], [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]]],
    [[0, 0, -1], [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]]],
    [[0, 1, 0], [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]]],
    [[0, -1, 0], [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z]]],
    [[1, 0, 0], [[x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z]]],
    [[-1, 0, 0], [[-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z]]],
  ];
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  faces.forEach(([n, corners], f) => {
    corners.forEach((c) => {
      pos.push(...c);
      nor.push(...n);
    });
    const k = f * 4;
    idx.push(k, k + 1, k + 2, k, k + 2, k + 3);
  });
  return {
    positions: new Float32Array(pos),
    normals: new Float32Array(nor),
    indices: new Uint16Array(idx),
  };
}

/** Straight cylinder along Z from z0 to z1 (closed ends). */
export const cylinder = (r: number, z0: number, z1: number, segments = 48): Geometry =>
  lathe(
    [
      [0.001, z0],
      [r, z0],
      [r, z1],
      [0.001, z1],
    ],
    segments,
  );

export interface Bounds {
  centre: [number, number, number];
  size: [number, number, number];
}

/** Axis-aligned bounds of meshes after their placement matrices. */
export function boundsOf(meshes: ReadonlyArray<{ geometry: Geometry; local: Mat4 }>): Bounds {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const m of meshes) {
    const p = m.geometry.positions;
    const l = m.local;
    for (let i = 0; i < p.length; i += 3) {
      const x = p[i];
      const y = p[i + 1];
      const z = p[i + 2];
      const w = [l[0] * x + l[4] * y + l[8] * z + l[12], l[1] * x + l[5] * y + l[9] * z + l[13], l[2] * x + l[6] * y + l[10] * z + l[14]];
      for (let k = 0; k < 3; k++) {
        if (w[k] < min[k]) min[k] = w[k];
        if (w[k] > max[k]) max[k] = w[k];
      }
    }
  }
  const at = (k: number) => (min[k] + max[k]) / 2;
  const span = (k: number) => max[k] - min[k];
  return { centre: [at(0), at(1), at(2)], size: [span(0), span(1), span(2)] };
}
