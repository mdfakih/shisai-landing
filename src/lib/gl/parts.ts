import { box, cylinder, Geometry, lathe, mirrorZ, Profile } from './geometry';
import { compose, Mat4, rotationY, translation } from './math';

export type PartId = 'tube' | 'ferrule' | 'gasket' | 'clamp';
export type GroupId = 'left' | 'right' | 'gasket' | 'clamp';

export interface PartSpec {
  id: string;
  part: PartId;
  group: GroupId;
  geometry: Geometry;
  /** Placement inside the group. */
  local: Mat4;
  /** Multiplied with the matcap sample. */
  tint: [number, number, number];
  /** 1 = full matcap, 0 = flat. Gasket uses a low value. */
  contrast: number;
}

/* Dimensions in mm, DN50 tri-clamp joint (DIN 32676 proportions). */
export const RO = 25.4; // tube outer radius
export const RI = 23.8; // bore radius
export const RF = 32.0; // ferrule flange radius
export const FERRULE_LEN = 30;
export const TUBE_LEN = 118;
export const GASKET_HALF = 1.5;
export const BAND_RI = 33.2;
export const BAND_RO = 38.5;
export const BAND_HALF = 8;
/** Bolt centre height above the axis; the wing nut sits at +x on it. */
export const BOLT_Y = BAND_RO + 7.5 + 3.5;
export const WING_X = 15.5;

export const SPREAD_MM = 48; // per side when exploded
export const LIFT_MM = 82; // clamp lift when exploded

const STEEL: [number, number, number] = [1, 1, 1];
const DARK_STEEL: [number, number, number] = [0.55, 0.57, 0.62];

/** Ferrule with its joint face at z = 0 and the tube continuing toward -z. */
const ferruleProfile: Profile = [
  [RI, -FERRULE_LEN],
  [RO, -FERRULE_LEN],
  [RO, -4.2],
  [RF - 1.2, -4.2],
  [RF, -3.2],
  [RF, -0.6],
  [RF - 0.6, 0],
  [RI + 0.4, 0],
  [RI, -0.4],
];

const tubeProfile: Profile = [
  [RI, -TUBE_LEN],
  [RO, -TUBE_LEN],
  [RO, 0],
  [RI, 0],
];

const gasketProfile: Profile = [
  [RI + 0.5, -GASKET_HALF],
  [RF - 1.5, -GASKET_HALF],
  [RF - 1.5, GASKET_HALF],
  [RI + 0.5, GASKET_HALF],
];

const bandProfile: Profile = [
  [BAND_RI, -BAND_HALF],
  [BAND_RO - 1.4, -BAND_HALF],
  [BAND_RO, -BAND_HALF + 1.6],
  [BAND_RO, BAND_HALF - 1.6],
  [BAND_RO - 1.4, BAND_HALF],
  [BAND_RI, BAND_HALF],
];

const alongX = (m: Mat4) => compose(m, rotationY(Math.PI / 2));

export function buildParts(): PartSpec[] {
  const ferrule = lathe(ferruleProfile);
  const ferruleR = lathe(mirrorZ(ferruleProfile));
  const tube = lathe(tubeProfile, 64);
  const tubeR = lathe(mirrorZ(tubeProfile), 64);
  const gasket = lathe(gasketProfile, 64);
  const band = lathe(bandProfile);
  const lug = box(5, 17, 13);
  const bolt = cylinder(2.4, -15.5, 15.5, 24);
  const hub = cylinder(5, -2.4, 2.4, 24);
  const wing = box(2.6, 9, 4.4);
  const nut = cylinder(4.6, -2.2, 2.2, 6);
  const hinge = box(11, 7, 15);
  const pin = cylinder(1.6, -8.5, 8.5, 16);

  const g = GASKET_HALF;
  const lugY = BAND_RO + 7.5;
  const boltY = BOLT_Y;

  return [
    { id: 'tubeL', part: 'tube', group: 'left', geometry: tube, local: translation(0, 0, -g - FERRULE_LEN), tint: STEEL, contrast: 1 },
    { id: 'ferruleL', part: 'ferrule', group: 'left', geometry: ferrule, local: translation(0, 0, -g), tint: STEEL, contrast: 1 },
    { id: 'gasket', part: 'gasket', group: 'gasket', geometry: gasket, local: translation(0, 0, 0), tint: [1, 1, 1], contrast: 0.22 },
    { id: 'ferruleR', part: 'ferrule', group: 'right', geometry: ferruleR, local: translation(0, 0, g), tint: STEEL, contrast: 1 },
    { id: 'tubeR', part: 'tube', group: 'right', geometry: tubeR, local: translation(0, 0, g + FERRULE_LEN), tint: STEEL, contrast: 1 },
    { id: 'band', part: 'clamp', group: 'clamp', geometry: band, local: translation(0, 0, 0), tint: STEEL, contrast: 1 },
    { id: 'lugA', part: 'clamp', group: 'clamp', geometry: lug, local: translation(-5.6, lugY, 0), tint: STEEL, contrast: 1 },
    { id: 'lugB', part: 'clamp', group: 'clamp', geometry: lug, local: translation(5.6, lugY, 0), tint: STEEL, contrast: 1 },
    { id: 'bolt', part: 'clamp', group: 'clamp', geometry: bolt, local: alongX(translation(0, boltY, 0)), tint: STEEL, contrast: 1 },
    { id: 'hub', part: 'clamp', group: 'clamp', geometry: hub, local: alongX(translation(15.5, boltY, 0)), tint: STEEL, contrast: 1 },
    { id: 'wingUp', part: 'clamp', group: 'clamp', geometry: wing, local: translation(15.5, boltY + 7, 0), tint: STEEL, contrast: 1 },
    { id: 'wingDown', part: 'clamp', group: 'clamp', geometry: wing, local: translation(15.5, boltY - 7, 0), tint: STEEL, contrast: 1 },
    { id: 'nut', part: 'clamp', group: 'clamp', geometry: nut, local: alongX(translation(-15, boltY, 0)), tint: STEEL, contrast: 1 },
    { id: 'hinge', part: 'clamp', group: 'clamp', geometry: hinge, local: translation(0, -(BAND_RO + 2.5), 0), tint: STEEL, contrast: 1 },
    { id: 'pin', part: 'clamp', group: 'clamp', geometry: pin, local: translation(0, -(BAND_RO + 2.5), 0), tint: DARK_STEEL, contrast: 0.7 },
  ];
}
