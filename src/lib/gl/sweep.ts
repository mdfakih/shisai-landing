/**
 * Swept geometry for bends and straight tube. A bend is a hollow torus
 * segment: outer wall, inner wall and two annular end caps. The centreline
 * starts at the origin heading +Z and curves toward +X about a centre at
 * (R, 0, 0). The end point is (R - R cos a, 0, R sin a) with tangent
 * (sin a, 0, cos a), which is what rotationY(a) maps +Z onto.
 */
import { Geometry } from './geometry';

interface Builder {
  pos: number[];
  nor: number[];
  idx: number[];
}

const push = (b: Builder, p: number[], n: number[]) => {
  b.pos.push(...p);
  b.nor.push(...n);
};

/** Quad strip between two rings of `around + 1` vertices starting at `a` and `b`. */
function stitch(b: Builder, a: number, c: number, around: number) {
  for (let i = 0; i < around; i++) {
    b.idx.push(a + i, c + i, a + i + 1, a + i + 1, c + i, c + i + 1);
  }
}

function finish(b: Builder): Geometry {
  return {
    positions: new Float32Array(b.pos),
    normals: new Float32Array(b.nor),
    indices: new Uint16Array(b.idx),
  };
}

/** Hollow bend. `angle` in radians, `bendR` is the centreline radius. */
export function bend(ro: number, ri: number, bendR: number, angle: number, along = 40, around = 36): Geometry {
  const b: Builder = { pos: [], nor: [], idx: [] };
  const ring = (t: number, r: number, sign: 1 | -1) => {
    const start = b.pos.length / 3;
    const cx = bendR - bendR * Math.cos(t);
    const cz = bendR * Math.sin(t);
    // Radial direction in the bend plane (points from the tube centre toward the bend centre).
    const nx = Math.cos(t);
    const nz = -Math.sin(t);
    for (let i = 0; i <= around; i++) {
      const phi = (i / around) * Math.PI * 2;
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      push(b, [cx + r * cp * nx, r * sp, cz + r * cp * nz], [sign * cp * nx, sign * sp, sign * cp * nz]);
    }
    return start;
  };
  // Outer and inner walls.
  for (const [r, sign] of [[ro, 1], [ri, -1]] as Array<[number, 1 | -1]>) {
    let prev = ring(0, r, sign);
    for (let s = 1; s <= along; s++) {
      const cur = ring((s / along) * angle, r, sign);
      stitch(b, prev, cur, around);
      prev = cur;
    }
  }
  // End caps: annulus at t = 0 (normal -Z) and t = angle (normal +T).
  for (const [t, dir] of [[0, -1], [angle, 1]] as Array<[number, 1 | -1]>) {
    const tx = Math.sin(t) * dir;
    const tz = Math.cos(t) * dir;
    const a = ring(t, ro, 1);
    const c = ring(t, ri, 1);
    // Overwrite the normals just pushed so the cap faces along the tangent.
    for (let i = (a * 3); i < b.pos.length; i += 3) {
      b.nor[i] = tx;
      b.nor[i + 1] = 0;
      b.nor[i + 2] = tz;
    }
    stitch(b, a, c, around);
  }
  return finish(b);
}

/**
 * Branch tube for a tee, along +Z, trimmed where it meets a run tube whose
 * axis is Y (so a vertex at x sits on the run surface at z = sqrt(R² - x²)).
 * Each wall starts on the run surface it joins: outer wall on the run's
 * outside, inner wall on the bore. Open at the bottom, annular cap on top.
 */
export function saddleTube(ro: number, ri: number, runRo: number, runRi: number, len: number, around = 48): Geometry {
  const b: Builder = { pos: [], nor: [], idx: [] };
  const ring = (r: number, zOf: (x: number) => number, n: (cp: number, sp: number) => number[]) => {
    const start = b.pos.length / 3;
    for (let i = 0; i <= around; i++) {
      const phi = (i / around) * Math.PI * 2;
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      push(b, [r * cp, r * sp, zOf(r * cp)], n(cp, sp));
    }
    return start;
  };
  const onRun = (runR: number) => (x: number) => Math.sqrt(Math.max(0, runR * runR - x * x));
  const top = () => len;
  const out = (cp: number, sp: number) => [cp, sp, 0];
  const inn = (cp: number, sp: number) => [-cp, -sp, 0];
  const up = () => [0, 0, 1];
  stitch(b, ring(ro, onRun(runRo), out), ring(ro, top, out), around);
  stitch(b, ring(ri, onRun(runRi), inn), ring(ri, top, inn), around);
  stitch(b, ring(ro, top, up), ring(ri, top, up), around);
  return finish(b);
}

/**
 * Run tube for a tee: hollow tube along Z with a hole of radius holeR
 * cut through both walls on the +Y side, centred at z = 0. The hole edge
 * is the true cylinder/cylinder intersection, z = ±sqrt(holeR² - x²), so
 * it lines up with the saddle on the branch.
 */
export function runTube(ro: number, ri: number, z0: number, z1: number, holeR: number, around = 72): Geometry {
  const b: Builder = { pos: [], nor: [], idx: [] };
  const quad = (p: number[][], n: number[]) => {
    const k = b.pos.length / 3;
    p.forEach((v) => push(b, v, n));
    b.idx.push(k, k + 1, k + 2, k, k + 2, k + 3);
  };
  // Half-length of the cut at this angle, 0 when the wall is untouched there.
  const cut = (r: number, phi: number) => {
    const x = r * Math.cos(phi);
    if (Math.sin(phi) <= 0 || Math.abs(x) >= holeR) return 0;
    return Math.sqrt(holeR * holeR - x * x);
  };
  for (const [r, sign] of [[ro, 1], [ri, -1]] as Array<[number, 1 | -1]>) {
    for (let i = 0; i < around; i++) {
      const p0 = (i / around) * Math.PI * 2;
      const p1 = ((i + 1) / around) * Math.PI * 2;
      const c0 = cut(r, p0);
      const c1 = cut(r, p1);
      const a = [r * Math.cos(p0), r * Math.sin(p0)];
      const c = [r * Math.cos(p1), r * Math.sin(p1)];
      const n = [sign * Math.cos((p0 + p1) / 2), sign * Math.sin((p0 + p1) / 2), 0];
      if (c0 === 0 && c1 === 0) {
        quad([[a[0], a[1], z0], [c[0], c[1], z0], [c[0], c[1], z1], [a[0], a[1], z1]], n);
      } else {
        quad([[a[0], a[1], z0], [c[0], c[1], z0], [c[0], c[1], -c1], [a[0], a[1], -c0]], n);
        quad([[a[0], a[1], c0], [c[0], c[1], c1], [c[0], c[1], z1], [a[0], a[1], z1]], n);
      }
    }
  }
  const ring = (z: number, r: number, n: number[]) => {
    const start = b.pos.length / 3;
    for (let i = 0; i <= around; i++) {
      const phi = (i / around) * Math.PI * 2;
      push(b, [r * Math.cos(phi), r * Math.sin(phi), z], n);
    }
    return start;
  };
  stitch(b, ring(z0, ro, [0, 0, -1]), ring(z0, ri, [0, 0, -1]), around);
  stitch(b, ring(z1, ro, [0, 0, 1]), ring(z1, ri, [0, 0, 1]), around);
  return finish(b);
}

/** Open hollow tube along Z from z0 to z1 with annular ends. */
export function tube(ro: number, ri: number, z0: number, z1: number, around = 48): Geometry {
  const b: Builder = { pos: [], nor: [], idx: [] };
  const ring = (z: number, r: number, n: (cp: number, sp: number) => number[]) => {
    const start = b.pos.length / 3;
    for (let i = 0; i <= around; i++) {
      const phi = (i / around) * Math.PI * 2;
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      push(b, [r * cp, r * sp, z], n(cp, sp));
    }
    return start;
  };
  const out = (cp: number, sp: number) => [cp, sp, 0];
  const inn = (cp: number, sp: number) => [-cp, -sp, 0];
  stitch(b, ring(z0, ro, out), ring(z1, ro, out), around);
  stitch(b, ring(z0, ri, inn), ring(z1, ri, inn), around);
  const down = () => [0, 0, -1];
  const up = () => [0, 0, 1];
  stitch(b, ring(z0, ro, down), ring(z0, ri, down), around);
  stitch(b, ring(z1, ro, up), ring(z1, ri, up), around);
  return finish(b);
}
