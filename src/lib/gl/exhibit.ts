/**
 * An exhibit is one thing the hero viewer can show: the tri-clamp joint, or
 * a one-piece fitting. The joint lives here so the hero pays nothing extra
 * until someone picks another part (see fittingExhibits.ts).
 */
import { Bounds, boundsOf } from './geometry';
import { buildParts, PartSpec } from './parts';

export type ExhibitId = 'joint' | 'bend' | 'tee' | 'reducer';

export type Vec3 = readonly [number, number, number];

/** [nx, ny, nz, w]: the side where dot(p, n) > w is cut away. */
export type CutPlane = readonly [number, number, number, number];

export interface Fit {
  halfW: number;
  halfH: number;
}

export interface Exhibit {
  id: ExhibitId;
  parts: PartSpec[];
  bounds: Bounds;
  /** Model-space point the camera looks at. */
  centre: Vec3;
  /** Half extents (mm) kept inside the frame. */
  fit: Fit;
  /** Framing and aim while exploded. Only the joint comes apart. */
  exploded?: { fit: Fit; centre: Vec3 };
  yaw: number;
  pitch: number;
  /**
   * Section planes in model space. A point is removed only when it is beyond
   * both, so one real plane plus NO_PLANE is a half section and two real
   * planes a quarter section.
   */
  cut: readonly [CutPlane, CutPlane];
}

/** A plane every point is beyond. */
export const NO_PLANE: CutPlane = [0, 0, 0, -1];

let joint: Exhibit | null = null;

export function jointExhibit(): Exhibit {
  if (joint) return joint;
  const parts = buildParts();
  joint = {
    id: 'joint',
    parts,
    bounds: boundsOf(parts),
    centre: [0, 0, 0],
    fit: { halfW: 172, halfH: 92 },
    exploded: { fit: { halfW: 222, halfH: 104 }, centre: [0, 40, 0] },
    yaw: -0.95,
    pitch: 0.36,
    // Quarter section through the axis, on the side that faces the camera at rest.
    cut: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ],
  };
  return joint;
}
