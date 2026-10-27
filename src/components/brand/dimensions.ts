import type { GroupId } from '@/lib/gl/parts';
import { BAND_HALF, BAND_RO, BOLT_Y, FERRULE_LEN, GASKET_HALF, RO, TUBE_LEN, WING_X } from '@/lib/gl/parts';

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

/* The "right" group is the tube whose open end faces the camera at rest. */
const nearTubeMid = GASKET_HALF + FERRULE_LEN + TUBE_LEN * 0.6;
const nearTubeEnd = GASKET_HALF + FERRULE_LEN + TUBE_LEN;

/** Engineering callouts for the hero. Positions are in each group's local mm. */
export const heroDimensions: Dimension[] = [
  {
    kind: 'linear',
    id: 'od',
    group: 'right',
    a: [0, RO, nearTubeMid],
    b: [0, -RO, nearTubeMid],
    label: 'Ø 50.8',
  },
  {
    kind: 'linear',
    id: 'band',
    group: 'clamp',
    a: [0, -(BAND_RO + 16), -BAND_HALF],
    b: [0, -(BAND_RO + 16), BAND_HALF],
    label: 'DIN 32676',
  },
  {
    kind: 'leader',
    id: 'ra',
    group: 'right',
    at: [0, 0, nearTubeEnd],
    offset: [-34, 72],
    label: 'Ra ≤ 0.8 µm',
  },
  {
    kind: 'leader',
    id: 'clamp',
    group: 'clamp',
    at: [WING_X, BOLT_Y, 0],
    offset: [64, -46],
    label: 'Tri Clover® clamp',
  },
];
