import type { ExhibitId } from '@/lib/gl/exhibit';

/** What the hero part picker offers. The joint is always first and always the default. */
export interface HeroPart {
  id: ExhibitId;
  /** Short tab label. */
  tab: string;
  /** Title-block "Part" line. */
  name: string;
  /** Spoken name for the viewer. */
  spoken: string;
  /** Catalogue section the part belongs to. */
  category: string;
  categoryLabel: string;
  /** Only the joint comes apart. */
  explodable: boolean;
}

export const heroParts: readonly HeroPart[] = [
  {
    id: 'joint',
    tab: 'Joint',
    name: 'TC joint, DN50',
    spoken: 'Tri-clamp joint, DN50',
    category: 'ferrules',
    categoryLabel: 'ferrules & clamps',
    explodable: true,
  },
  {
    id: 'bend',
    tab: 'Bend',
    name: 'TC bend 90°, DN50',
    spoken: '90 degree tri-clamp bend, DN50',
    category: 'elbows-bends',
    categoryLabel: 'bends',
    explodable: false,
  },
  {
    id: 'tee',
    tab: 'Tee',
    name: 'TC equal tee, DN50',
    spoken: 'Equal tri-clamp tee, DN50',
    category: 'tees',
    categoryLabel: 'tees',
    explodable: false,
  },
  {
    id: 'reducer',
    tab: 'Reducer',
    name: 'TC reducer, 3″ × 2″',
    spoken: 'Concentric tri-clamp reducer, 3 by 2 inch',
    category: 'reducers',
    categoryLabel: 'reducers',
    explodable: false,
  },
];

export const DEFAULT_PART: ExhibitId = 'joint';

export const VIEWER_ID = 'hero-viewer';
export const tabId = (id: ExhibitId): string => `hero-part-${id}`;

export const partById = (id: ExhibitId): HeroPart => heroParts.find((p) => p.id === id) ?? heroParts[0];
