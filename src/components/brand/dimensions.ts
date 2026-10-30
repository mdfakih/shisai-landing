import type { ExhibitId } from '@/lib/gl/exhibit';
import type { GroupId } from '@/lib/gl/parts';
import { BAND_HALF, BAND_RI, BAND_RO, BOLT_Y, FERRULE_LEN, GASKET_HALF, RF, RI, RO, TUBE_LEN, WING_X } from '@/lib/gl/parts';
import { BEND_R, BEND_TAN, FIT_RB, FIT_RF, FIT_RI, FIT_RO, TEE_HALF } from '@/lib/gl/specs';

type Vec3 = readonly [number, number, number];

/** A dimension line between two model points, label offset perpendicular. */
export interface LinearDim {
  kind: 'linear';
  id: string;
  group: GroupId;
  a: Vec3;
  b: Vec3;
  label: string;
}

/** A leader from a model point to a label floating at a screen offset. */
export interface LeaderDim {
  kind: 'leader';
  id: string;
  group: GroupId;
  at: Vec3;
  /** Screen-space offset of the label from the anchor, px. */
  offset: readonly [number, number];
  label: string;
}

export type Dimension = LinearDim | LeaderDim;

/** Callouts per view of one exhibit. Section anchors sit on the cut faces that survive. */
export interface DimensionSet {
  base: Dimension[];
  exploded?: Dimension[];
  section: Dimension[];
}

/* ---------- Joint. The "right" group is the tube whose open end faces the camera at rest. ---------- */

const nearTubeMid = GASKET_HALF + FERRULE_LEN + TUBE_LEN * 0.6;
const nearTubeEnd = GASKET_HALF + FERRULE_LEN + TUBE_LEN;

const jointOd: Dimension = {
  kind: 'linear',
  id: 'od',
  group: 'right',
  a: [0, RO, nearTubeMid],
  b: [0, -RO, nearTubeMid],
  label: 'Ø 50.8',
};

const jointClamp: Dimension = {
  kind: 'leader',
  id: 'clamp',
  group: 'clamp',
  at: [WING_X, BOLT_Y, 0],
  offset: [64, -46],
  label: 'Tri Clover® clamp',
};

const joint: DimensionSet = {
  base: [
    jointOd,
    {
      kind: 'linear',
      id: 'band',
      group: 'clamp',
      a: [0, -(BAND_RO + 16), -BAND_HALF],
      b: [0, -(BAND_RO + 16), BAND_HALF],
      label: 'DIN 32676',
    },
    { kind: 'leader', id: 'ra', group: 'right', at: [0, 0, nearTubeEnd], offset: [-34, 72], label: 'Ra ≤ 0.8 µm' },
    jointClamp,
  ],
  exploded: [
    jointOd,
    { kind: 'leader', id: 'ferrule', group: 'right', at: [0, RF, GASKET_HALF + 2], offset: [36, -52], label: 'Ferrule ×2' },
    { kind: 'leader', id: 'gasket', group: 'gasket', at: [0, -(RF - 1.5), 0], offset: [-40, 58], label: 'Gasket' },
    jointClamp,
  ],
  section: [
    jointOd,
    { kind: 'leader', id: 'seal', group: 'gasket', at: [0, RI + 0.5, 0], offset: [-48, -70], label: 'Crevice-free seal' },
    {
      kind: 'leader',
      id: 'clamp-cut',
      group: 'clamp',
      at: [0, (BAND_RI + BAND_RO) / 2, BAND_HALF * 0.5],
      offset: [70, -52],
      label: 'Tri Clover® clamp',
    },
    { kind: 'leader', id: 'ra-bore', group: 'right', at: [-RI * 0.6, -RI * 0.8, nearTubeMid], offset: [-30, 64], label: 'Ra ≤ 0.8 µm' },
  ],
};

/* ---------- Fittings, in the catalogue models' own frames. ---------- */

const wallMid = (FIT_RO + FIT_RI) / 2;
const sectionMark = (at: Vec3, offset: readonly [number, number]): Dimension => ({
  kind: 'leader',
  id: 'section',
  group: 'body',
  at,
  offset,
  label: 'Section A–A',
});

// 90° bend: first leg up +Z from the origin, turning toward +X about (BEND_R, 0, 0).
const arc = Math.PI / 4;
const outer = BEND_R + FIT_RO; // extrados radius about the bend centre
const extrados: Vec3 = [BEND_R - outer * Math.cos(arc), 0, outer * Math.sin(arc)];
const bendOd: Dimension = {
  kind: 'linear',
  id: 'od',
  group: 'body',
  a: [-FIT_RO, 0, -BEND_TAN * 0.45],
  b: [FIT_RO, 0, -BEND_TAN * 0.45],
  label: 'Ø 50.8',
};
const bendBase: Dimension[] = [
  bendOd,
  { kind: 'leader', id: 'angle', group: 'body', at: extrados, offset: [-46, -44], label: '90° sweep' },
  {
    kind: 'leader',
    id: 'tc',
    group: 'body',
    at: [BEND_R + BEND_TAN, 0, BEND_R + FIT_RF - 2],
    offset: [40, 40],
    label: 'TC ends ×2',
  },
];
const midWall = BEND_R - wallMid;
const bend: DimensionSet = {
  base: bendBase,
  section: [...bendBase, sectionMark([BEND_R - midWall * Math.cos(arc), 0, midWall * Math.sin(arc)], [52, -58])],
};

// Equal tee: run along Z, branch up +Y, section plane x = 0.
const teeBase: Dimension[] = [
  { kind: 'linear', id: 'od', group: 'body', a: [0, FIT_RO, TEE_HALF * 0.72], b: [0, -FIT_RO, TEE_HALF * 0.72], label: 'Ø 50.8' },
  { kind: 'leader', id: 'tc', group: 'body', at: [0, TEE_HALF, -(FIT_RF - 2)], offset: [-48, -36], label: '3 × TC ends' },
];
const tee: DimensionSet = {
  base: teeBase,
  section: [...teeBase, sectionMark([0, -wallMid, TEE_HALF * 0.3], [56, 34])],
};

// Concentric reducer: 3" end at -Z, 2" end at +Z, quarter section like the joint.
const coneR = (FIT_RB + FIT_RO) / 2;
const reducerBase: Dimension[] = [
  { kind: 'linear', id: 'big', group: 'body', a: [0, FIT_RB, -30], b: [0, -FIT_RB, -30], label: 'Ø 76.2' },
  { kind: 'linear', id: 'small', group: 'body', a: [0, FIT_RO, 30], b: [0, -FIT_RO, 30], label: 'Ø 50.8' },
  // On the cone, on the near side that survives the quarter cut.
  { kind: 'leader', id: 'type', group: 'body', at: [coneR * 0.9, -coneR * 0.44, 0], offset: [44, 52], label: 'Concentric' },
];
const reducer: DimensionSet = {
  base: reducerBase,
  section: [...reducerBase, sectionMark([0, wallMid, 30], [48, -54])],
};

export const exhibitDimensions: Record<ExhibitId, DimensionSet> = { joint, bend, tee, reducer };
