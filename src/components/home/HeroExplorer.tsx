import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { TriClamp3D, TriClamp3DHandle, ViewerStatus } from '@/components/brand/TriClamp3D';
import { exhibitDimensions } from '@/components/brand/dimensions';
import type { ExhibitId } from '@/lib/gl/exhibit';
import { cn } from '@/lib/utils';
import { PartTabs, ViewDock } from './HeroControls';
import { DEFAULT_PART, HeroPart, heroParts, partById, tabId, VIEWER_ID } from './heroParts';

const KEY_SPIN: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const warmFittings = () => {
  import('@/lib/gl/fittingExhibits').catch(() => undefined);
};

/** Lift the clamp before the ferrules part; seat the ferrules before the clamp drops. */
function useStagedExplode(exploded: boolean) {
  const [spread, setSpread] = useState(0);
  const [lift, setLift] = useState(0);
  useEffect(() => {
    if (exploded) {
      setLift(1);
      const t = window.setTimeout(() => setSpread(1), 240);
      return () => clearTimeout(t);
    }
    setSpread(0);
    const t = window.setTimeout(() => setLift(0), 280);
    return () => clearTimeout(t);
  }, [exploded]);
  return { spread, lift };
}

/**
 * Hero part explorer: pick a fitting, turn it, explode the joint, cut a
 * section, switch the finish. Always opens on the tri-clamp joint.
 */
export function HeroExplorer() {
  const viewer = useRef<TriClamp3DHandle>(null);
  const [selected, setSelected] = useState<ExhibitId>(DEFAULT_PART);
  const [shown, setShown] = useState<ExhibitId>(DEFAULT_PART);
  const [exploded, setExploded] = useState(false);
  const [section, setSection] = useState(false);
  const [matt, setMatt] = useState(false);
  const [status, setStatus] = useState<ViewerStatus>('loading');
  const [reducedMotion] = useState(prefersReducedMotion);
  // Once any control is used, the drag hint has done its job and only covers callouts.
  const [touched, setTouched] = useState(false);
  const { spread, lift } = useStagedExplode(exploded);

  const part = partById(selected);
  const onScreen = partById(shown);
  const set = exhibitDimensions[shown];
  const dimensions = section ? set.section : exploded && set.exploded ? set.exploded : set.base;

  const view = section ? 'Section A–A' : exploded ? 'Exploded' : 'Assembled';

  const select = useCallback((id: ExhibitId) => {
    setTouched(true);
    setSelected(id);
    setExploded(false);
  }, []);

  // Double-tap opens the part up: the joint explodes, a one-piece fitting is sectioned.
  const onDoubleTap = useCallback(() => {
    if (part.explodable) setExploded((v) => !v);
    else setSection((v) => !v);
  }, [part.explodable]);

  const act = (fn: () => void) => {
    setTouched(true);
    fn();
  };

  const onViewerKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const spin = KEY_SPIN[e.key];
    if (!spin) return;
    e.preventDefault();
    viewer.current?.nudge(spin[0], spin[1]);
  };

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="corner-marks pointer-events-none absolute -inset-3 sm:-inset-6" aria-hidden="true" />
      <p className="sr-only" aria-live="polite">
        {status === 'ready' ? `${onScreen.name}. ${view}. ${matt ? 'Matt' : 'Mirror'} finish.` : ''}
      </p>

      {status !== 'failed' && (
        <PartTabs selected={selected} onSelect={select} onIntent={warmFittings} className="relative z-10 mx-auto w-full max-w-[420px]" />
      )}

      <div
        id={VIEWER_ID}
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={tabId(selected)}
        aria-describedby="hero-viewer-help"
        onKeyDown={onViewerKey}
        className="relative mt-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:mt-2"
      >
        <p id="hero-viewer-help" className="sr-only">
          Drag, or use the arrow keys, to rotate the 3D model.
        </p>
        <div className="animate-float will-change-transform">
          <TriClamp3D
            ref={viewer}
            exhibit={selected}
            spread={spread}
            lift={lift}
            section={section ? 1 : 0}
            matt={matt ? 1 : 0}
            interactive
            autoRotate={!reducedMotion}
            showDims
            dimensions={dimensions}
            hint="Drag to rotate"
            hideHint={touched}
            onExhibitShown={setShown}
            onExhibitError={() => setSelected(shown)}
            onStatus={setStatus}
            onDoubleTap={onDoubleTap}
          />
        </div>
      </div>

      <div className="relative mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        {status !== 'failed' && (
          <ViewDock
            part={part}
            exploded={exploded}
            section={section}
            matt={matt}
            onExplode={() => act(() => setExploded((v) => !v))}
            onSection={() => act(() => setSection((v) => !v))}
            onFinish={() => act(() => setMatt((v) => !v))}
            onReset={() => act(() => viewer.current?.resetView())}
          />
        )}
        <TitleBlock part={onScreen} matt={matt} view={view} />
      </div>
    </div>
  );
}

interface TitleBlockProps {
  part: HeroPart;
  matt: boolean;
  view: string;
}

/** Drawing-sheet title block. Follows the part on screen, not the tab, so it changes with the model. */
function TitleBlock({ part, matt, view }: TitleBlockProps) {
  const sheet = heroParts.indexOf(part) + 1;
  const rows: Array<[string, string]> = [
    ['Part', part.name],
    ['Material', 'SS316L'],
    ['Finish', matt ? 'Matt' : 'Mirror · Ra ≤ 0.8'],
    ['View', view],
    ['Sheet', `Shisai · ${String(sheet).padStart(2, '0')} / ${String(heroParts.length).padStart(2, '0')}`],
  ];
  return (
    <div className="w-full border border-border bg-card/80 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur sm:ml-auto sm:w-fit sm:text-[11px]">
      <dl key={part.id} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 px-3 py-2 animate-in fade-in-0 duration-500">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt>{k}</dt>
            <dd className={cn('text-foreground', k === 'View' && 'text-primary')}>{v}</dd>
          </div>
        ))}
      </dl>
      <Link
        to={`/products#${part.category}`}
        className="group flex items-center justify-between gap-3 border-t border-border px-3 py-1.5 text-primary transition-colors hover:bg-primary/5"
      >
        See all {part.categoryLabel}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
