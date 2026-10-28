/**
 * Procedural product models for the catalogue viewer. All sizes in mm at
 * DN50 (2") so every family reads at the same scale as the hero joint.
 */
import { box, cylinder, Geometry, lathe, Profile } from './geometry';
import { compose, Mat4, multiply, rotationX, rotationY, translation } from './math';
import { buildParts } from './parts';
import { bend, runTube, saddleTube, tube } from './sweep';

export interface MeshSpec {
  geometry: Geometry;
  local: Mat4;
  tint: [number, number, number];
  contrast: number;
}

export interface ModelSpec {
  meshes: MeshSpec[];
  fit: { halfW: number; halfH: number };
  yaw: number;
  pitch: number;
}

export type ModelKind = 'ferrule' | 'spool' | 'bend' | 'tee' | 'reducer' | 'clamp' | 'pipeclamp' | 'baseplate' | 'flange';

export interface ModelOptions {
  /** Bend angle in degrees. */
  angle?: number;
  /** Tri-clamp ferrule faces on the open ends. */
  tc?: boolean;
  long?: boolean;
  collar?: boolean;
  eccentric?: boolean;
  unequal?: boolean;
  flange?: 'weldneck' | 'slipon' | 'blind' | 'threaded';
}

const RO = 25.4;
const RI = 23.8;
const RF = 32;
const RB = 38.1; // 3" outer radius for reducers
const STEEL: [number, number, number] = [1, 1, 1];
const HOLE: [number, number, number] = [0.14, 0.15, 0.18];

const steel = (geometry: Geometry, local: Mat4 = translation(0, 0, 0)): MeshSpec => ({ geometry, local, tint: STEEL, contrast: 1 });

/** Tri-clamp flange ring with its face at z = 0 and body toward -z. */
function tcRing(ro = RO, ri = RI, rf = RF): Geometry {
  const p: Profile = [
    [ri, -4.2],
    [ro, -4.2],
    [rf - 1.2, -4.2],
    [rf, -3.2],
    [rf, -0.6],
    [rf - 0.6, 0],
    [ri + 0.4, 0],
    [ri, -0.4],
  ];
  return lathe(p);
}

/** Ring whose outward face is +Z at `at`; `flip` for a -Z facing end. */
const faceOut = (at: [number, number, number], flip = false, ring = tcRing()): MeshSpec =>
  steel(ring, flip ? compose(translation(...at), rotationY(Math.PI)) : translation(...at));

function ferrule(o: ModelOptions): MeshSpec[] {
  const len = o.long ? 90 : 40;
  const m = [steel(tube(RO, RI, -len, -4.2 + 0.01)), faceOut([0, 0, 0])];
  if (o.collar) m.push(steel(lathe([[RO - 0.1, -len + 6], [RO + 3.2, -len + 6], [RO + 3.2, -len + 18], [RO - 0.1, -len + 18]])));
  return m;
}

function spool(): MeshSpec[] {
  const h = 64;
  return [steel(tube(RO, RI, -h + 4, h - 4)), faceOut([0, 0, h]), faceOut([0, 0, -h], true)];
}

function bendModel(o: ModelOptions): MeshSpec[] {
  const a = ((o.angle ?? 90) * Math.PI) / 180;
  const R = 76;
  const tan = 24;
  const end: [number, number, number] = [R - R * Math.cos(a), 0, R * Math.sin(a)];
  const endFrame = compose(translation(...end), rotationY(a));
  const m = [steel(bend(RO, RI, R, a)), steel(tube(RO, RI, -tan, 0)), steel(tube(RO, RI, 0, tan), endFrame)];
  if (o.tc) {
    m.push(faceOut([0, 0, -tan], true));
    m.push(steel(tcRing(), multiply(endFrame, translation(0, 0, tan))));
  }
  return m;
}

function tee(o: ModelOptions): MeshSpec[] {
  const half = 55;
  const bro = o.unequal ? RO * 0.75 : RO;
  const bri = o.unequal ? RI * 0.75 : RI;
  const up = rotationX(-Math.PI / 2);
  // Run tube along Z; branch stood up along +Y with rotationX(-90°), which
  // puts the run axis on the branch's local Y, as saddleTube expects.
  // Hole through the run matches the branch bore; the branch's inner wall
  // runs down to the run bore and covers the cut face.
  const m = [steel(runTube(RO, RI, -half, half, bri)), steel(saddleTube(bro, bri, RO, RI, half), up)];
  if (o.tc) {
    m.push(faceOut([0, 0, half]), faceOut([0, 0, -half], true));
    m.push(steel(tcRing(bro, bri, bro + 6.6), multiply(up, translation(0, 0, half))));
  }
  return m;
}

/** Offset the small end so one side stays flat (eccentric reducer). */
function shearY(g: Geometry, z0: number, z1: number, dy: number): Geometry {
  const positions = new Float32Array(g.positions);
  for (let i = 0; i < positions.length; i += 3) {
    const t = Math.min(1, Math.max(0, (positions[i + 2] - z0) / (z1 - z0)));
    positions[i + 1] -= dy * t;
  }
  return { ...g, positions };
}

function reducer(o: ModelOptions): MeshSpec[] {
  const p: Profile = [
    [RB, -38],
    [RB, -22],
    [RO, 22],
    [RO, 38],
    [RI, 38],
    [RI, 22],
    [RB - 1.6, -22],
    [RB - 1.6, -38],
  ];
  let body = lathe(p);
  if (o.eccentric) body = shearY(body, -22, 22, RB - RO);
  const m = [steel(body)];
  if (o.tc) {
    const small = o.eccentric ? translation(0, -(RB - RO), 38) : translation(0, 0, 38);
    m.push(steel(tcRing(), small));
    m.push(steel(tcRing(RB, RB - 1.6, RB + 6.6), compose(translation(0, 0, -38), rotationY(Math.PI))));
  }
  return m;
}

function clamp(): MeshSpec[] {
  return buildParts()
    .filter((p) => p.group === 'clamp')
    .map((p) => ({ geometry: p.geometry, local: p.local, tint: p.tint, contrast: p.contrast }));
}

function pipeClamp(withPlate: boolean): MeshSpec[] {
  const r = RO + 3.5;
  const stem = 26;
  const m = [
    steel(lathe([[RO + 0.4, -7], [r, -7], [r, 7], [RO + 0.4, 7]])),
    steel(box(6, 14, 10), translation(-4.5, r + 7, 0)),
    steel(box(6, 14, 10), translation(4.5, r + 7, 0)),
    steel(cylinder(2.2, -9, 9, 16), compose(translation(0, r + 9, 0), rotationY(Math.PI / 2))),
    steel(box(9, stem, 9), translation(0, -(r + stem / 2), 0)),
  ];
  if (withPlate) m.push(steel(box(64, 4, 44), translation(0, -(r + stem + 2), 0)));
  return m;
}

function basePlate(): MeshSpec[] {
  // Plate, square stem, round boss on top (cylinder built along Z, stood up).
  return [steel(box(64, 4, 44), translation(0, -16, 0)), steel(box(9, 28, 9)), steel(cylinder(9, 14, 20, 32), rotationX(-Math.PI / 2))];
}

function flange(kind: ModelOptions['flange'] = 'slipon'): MeshSpec[] {
  const rb = kind === 'blind' ? 0.01 : RO + 0.5;
  const disc: Profile = [
    [rb, -1.5],
    [46, -1.5],
    [46, 0],
    [76, 0],
    [76, 14],
  ];
  const hub: Profile =
    kind === 'blind'
      ? [[rb, 14]]
      : kind === 'weldneck'
        ? [[40, 14], [40, 22], [RO + 2.6, 50], [rb, 50]]
        : [[36, 14], [36, 28], [rb, 28]];
  const m = [steel(lathe([...disc, ...hub]))];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    m.push({ geometry: cylinder(7, -1.6, 14.1, 20), local: translation(Math.cos(a) * 60, Math.sin(a) * 60, 0), tint: HOLE, contrast: 0.15 });
  }
  return m;
}

function build(kind: ModelKind, o: ModelOptions): MeshSpec[] {
  switch (kind) {
    case 'ferrule':
      return ferrule(o);
    case 'spool':
      return spool();
    case 'bend':
      return bendModel(o);
    case 'tee':
      return tee(o);
    case 'reducer':
      return reducer(o);
    case 'clamp':
      return clamp();
    case 'pipeclamp':
      return pipeClamp(true);
    case 'baseplate':
      return basePlate();
    case 'flange':
      return flange(o.flange);
  }
}

/** Recentre on the bounding box and derive framing extents. */
function centre(meshes: MeshSpec[]): ModelSpec {
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
  const c = [0, 1, 2].map((k) => (min[k] + max[k]) / 2);
  const d = [0, 1, 2].map((k) => max[k] - min[k]);
  const shift = translation(-c[0], -c[1], -c[2]);
  const radius = Math.hypot(d[0], d[2]) / 2;
  return {
    meshes: meshes.map((m) => ({ ...m, local: multiply(shift, m.local) })),
    fit: { halfW: radius * 1.12, halfH: Math.max(d[1] / 2, radius * 0.55) * 1.18 },
    yaw: 0.9,
    pitch: 0.32,
  };
}

const has = (name: string, ...needles: string[]) => needles.some((n) => name.toLowerCase().includes(n.toLowerCase()));

/** Pick a model from the catalogue entry. Every family has one. */
export function modelFor(categoryId: string, productName: string): ModelSpec {
  const tc = has(productName, 'tri clamp', 'tc ');
  const resolve = (): [ModelKind, ModelOptions] => {
    switch (categoryId) {
      case 'elbows-bends':
        return ['bend', { angle: has(productName, '180') ? 180 : has(productName, '45') ? 45 : 90, tc }];
      case 'ferrules':
        if (has(productName, 'spool')) return ['spool', {}];
        return ['ferrule', { long: has(productName, 'long'), collar: has(productName, 'socket', 'thread') }];
      case 'tees':
        return ['tee', { tc, unequal: has(productName, 'unequal') }];
      case 'reducers':
        return ['reducer', { tc, eccentric: has(productName, 'eccentric') }];
      case 'clamps':
        if (has(productName, 'base plate')) return ['baseplate', {}];
        if (has(productName, 'pipe', 'u-clamp', 'c-clamp')) return ['pipeclamp', {}];
        return ['clamp', {}];
      case 'flanges':
        return ['flange', { flange: has(productName, 'weld neck') ? 'weldneck' : has(productName, 'blind') ? 'blind' : has(productName, 'thread') ? 'threaded' : 'slipon' }];
      default:
        return ['spool', {}];
    }
  };
  const [kind, opts] = resolve();
  return centre(build(kind, opts));
}
