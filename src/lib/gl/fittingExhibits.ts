/**
 * One-piece fittings for the hero viewer, built from the catalogue models.
 * Loaded on demand the first time someone picks one, so the joint-only
 * hero stays as light as before.
 */
import { CutPlane, Exhibit, ExhibitId, NO_PLANE } from './exhibit';
import { boundsOf } from './geometry';
import { buildMeshes, ModelKind, ModelOptions } from './models';

export type FittingId = Exclude<ExhibitId, 'joint'>;

interface Recipe {
  kind: ModelKind;
  opts: ModelOptions;
  yaw: number;
  pitch: number;
  cut: readonly [CutPlane, CutPlane];
}

const recipes: Record<FittingId, Recipe> = {
  // Half section through the bend plane, seen from above.
  bend: { kind: 'bend', opts: { angle: 90, tc: true }, yaw: -2.5, pitch: 0.62, cut: [[0, 1, 0, 0], NO_PLANE] },
  // Half section through both axes: the whole flow path of the tee.
  tee: { kind: 'tee', opts: { tc: true }, yaw: -1.2, pitch: 0.3, cut: [[1, 0, 0, 0], NO_PLANE] },
  // Quarter section like the joint.
  reducer: {
    kind: 'reducer',
    opts: { tc: true },
    yaw: -0.95,
    pitch: 0.36,
    cut: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
    ],
  },
};

const cache = new Map<FittingId, Exhibit>();

export function fittingExhibit(id: FittingId): Exhibit {
  const hit = cache.get(id);
  if (hit) return hit;
  const r = recipes[id];
  const meshes = buildMeshes(r.kind, r.opts);
  const bounds = boundsOf(meshes);
  const [sx, sy, sz] = bounds.size;
  // The part turns about Y, so its horizontal reach is the XZ half-diagonal.
  const reach = Math.max(Math.hypot(sx, sz) / 2, 70);
  const ex: Exhibit = {
    id,
    parts: meshes.map((m, i) => ({ id: `${id}-${i}`, part: null, group: 'body', ...m })),
    bounds,
    centre: bounds.centre,
    // Generous margins: the callouts sit outside the part.
    fit: { halfW: reach * 1.34, halfH: Math.max(sy / 2 + 10, reach * 0.6) * 1.34 },
    yaw: r.yaw,
    pitch: r.pitch,
    cut: r.cut,
  };
  cache.set(id, ex);
  return ex;
}
