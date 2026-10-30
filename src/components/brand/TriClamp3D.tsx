import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Move3d } from 'lucide-react';
import { PartId, TriClampAssembly } from '@/components/brand/TriClampAssembly';
import { DimensionOverlay, DimensionOverlayHandle } from '@/components/brand/DimensionOverlay';
import type { Dimension } from '@/components/brand/dimensions';
import type { Exhibit, ExhibitId } from '@/lib/gl/exhibit';
import type { SceneOptions, TriClampScene } from '@/lib/gl/triclampScene';
import { readBackground, readInk } from '@/lib/gl/theme';
import { cn } from '@/lib/utils';

export type ViewerStatus = 'loading' | 'ready' | 'failed';

/** Imperative controls for toolbars and keyboard handlers. */
export interface TriClamp3DHandle {
  resetView: () => void;
  /** Keyboard spin, in arrow-key steps. */
  nudge: (dYaw: number, dPitch: number) => void;
}

interface TriClamp3DProps {
  /** Which part to show. Changing it swaps with a transition. */
  exhibit?: ExhibitId;
  spread?: number;
  lift?: number;
  highlight?: PartId | null;
  /** 0..1 section cut. */
  section?: number;
  /** 0..1 matt finish. */
  matt?: number;
  interactive?: boolean;
  autoRotate?: boolean;
  fit?: SceneOptions['fit'];
  yaw?: number;
  pitch?: number;
  /** Show "drag to rotate" until the first interaction. */
  hint?: string;
  /** Fade the hint early, e.g. once the user has found other controls. */
  hideHint?: boolean;
  /** Fill the parent box (parent must size it) instead of using the drawing aspect ratio. */
  fill?: boolean;
  /** Dimension lines on the SVG placeholder. */
  showDims?: boolean;
  /** Live engineering callouts that track the 3D model. */
  dimensions?: Dimension[];
  /** Fires when a newly requested part is actually on screen. */
  onExhibitShown?: (id: ExhibitId) => void;
  /** A part's module failed to load (offline, stale deploy). The old part stays. */
  onExhibitError?: (id: ExhibitId) => void;
  onStatus?: (status: ViewerStatus) => void;
  onDoubleTap?: () => void;
  className?: string;
}

const loadExhibit = async (id: ExhibitId): Promise<Exhibit> => {
  if (id === 'joint') return (await import('@/lib/gl/exhibit')).jointExhibit();
  return (await import('@/lib/gl/fittingExhibits')).fittingExhibit(id);
};

/**
 * Real 3D tri-clamp joint and fittings. Loads the WebGL module after first
 * paint and cross-fades from the SVG drawing. Falls back to the SVG when
 * WebGL is unavailable.
 */
export const TriClamp3D = forwardRef<TriClamp3DHandle, TriClamp3DProps>(function TriClamp3D(
  {
    exhibit = 'joint',
    spread = 0,
    lift = 0,
    highlight = null,
    section = 0,
    matt = 0,
    interactive = true,
    autoRotate = false,
    fit,
    fill = false,
    yaw,
    pitch,
    hint,
    hideHint = false,
    showDims = false,
    dimensions,
    onExhibitShown,
    onExhibitError,
    onStatus,
    onDoubleTap,
    className,
  },
  ref,
) {
  const overlayRef = useRef<DimensionOverlayHandle>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<TriClampScene | null>(null);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Latest props: the scene boots on idle, so anything changed before then must be read here.
  const current = { exhibit, spread, lift, highlight, section, matt, interactive, autoRotate, fit, yaw, pitch };
  const callbacks = { onExhibitShown, onExhibitError, onStatus, onDoubleTap };
  const latest = useRef({ ...current, ...callbacks });
  latest.current = { ...current, ...callbacks };
  const request = useRef(0);

  // Swap parts. Only the latest request wins if several are in flight.
  const requestExhibit = useCallback((id: ExhibitId) => {
    const ticket = ++request.current;
    loadExhibit(id)
      .then((ex) => {
        if (ticket === request.current) sceneRef.current?.setExhibit(ex);
      })
      .catch(() => {
        if (ticket === request.current) latest.current.onExhibitError?.(id);
      });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      resetView: () => sceneRef.current?.resetView(),
      nudge: (dYaw, dPitch) => sceneRef.current?.nudge(dYaw, dPitch),
    }),
    [],
  );

  // Boot the renderer when idle; keep the SVG until it is drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let idleHandle = 0;
    const boot = async () => {
      try {
        // Always boot on the joint (bundled with the scene); a part picked meanwhile swaps in after.
        const [mod, first] = await Promise.all([import('@/lib/gl/triclampScene'), loadExhibit('joint')]);
        if (disposed) return;
        const p = latest.current;
        const scene = new mod.TriClampScene(canvas, {
          exhibit: first,
          spread: p.spread,
          lift: p.lift,
          highlight: p.highlight,
          section: p.section,
          matt: p.matt,
          interactive: p.interactive,
          autoRotate: p.autoRotate,
          fit: p.fit,
          yaw: p.yaw,
          pitch: p.pitch,
          onInteract: () => setInteracted(true),
          onFrame: dimensions ? (ctx) => overlayRef.current?.update(ctx) : undefined,
          onSwap: (ex) => latest.current.onExhibitShown?.(ex.id),
          onDoubleTap: () => latest.current.onDoubleTap?.(),
        });
        scene.setBackground(readBackground());
        scene.setInk(readInk());
        sceneRef.current = scene;
        canvas.style.cursor = p.interactive ? 'grab' : '';
        latest.current.onExhibitShown?.(first.id);
        if (latest.current.exhibit !== first.id) requestExhibit(latest.current.exhibit);
        requestAnimationFrame(() => {
          if (disposed) return;
          setReady(true);
          latest.current.onStatus?.('ready');
        });
      } catch {
        /* no WebGL: SVG stays */
        if (!disposed) latest.current.onStatus?.('failed');
      }
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    if (w.requestIdleCallback) idleHandle = w.requestIdleCallback(boot, { timeout: 1200 });
    else idleHandle = window.setTimeout(boot, 150);
    return () => {
      disposed = true;
      if (w.cancelIdleCallback && w.requestIdleCallback) w.cancelIdleCallback(idleHandle);
      else clearTimeout(idleHandle);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // Initial values only; later changes go through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setState({ spread, lift, highlight, interactive, autoRotate, section, matt });
  }, [spread, lift, highlight, interactive, autoRotate, section, matt]);

  useEffect(() => {
    if (sceneRef.current) requestExhibit(exhibit);
  }, [exhibit, requestExhibit]);

  useEffect(() => {
    if (fit) sceneRef.current?.setFit(fit);
  }, [fit?.halfW, fit?.halfH]); // eslint-disable-line react-hooks/exhaustive-deps

  // New callouts need one frame to be placed, even if the scene is idle.
  useEffect(() => {
    sceneRef.current?.redraw();
  }, [dimensions]);

  // Pause when off-screen; refresh colours on theme change.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => sceneRef.current?.setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    const mo = new MutationObserver(() => {
      sceneRef.current?.setBackground(readBackground());
      sceneRef.current?.setInk(readInk());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  const fallbackExplode = Math.max(spread, lift);

  return (
    <div ref={wrapRef} className={cn('relative select-none', fill && 'h-full w-full', className)}>
      <TriClampAssembly
        explode={fallbackExplode}
        highlight={highlight}
        showDims={showDims && !ready}
        showShadow
        className={cn('transition-opacity duration-700', fill && 'absolute inset-0 h-full w-full', ready && 'opacity-0')}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          'absolute inset-0 h-full w-full touch-pan-y transition-opacity duration-700',
          ready ? 'opacity-100' : 'opacity-0',
        )}
      />
      {dimensions && (
        <DimensionOverlay
          ref={overlayRef}
          dimensions={dimensions}
          className={cn('transition-opacity duration-700', ready ? 'opacity-100' : 'opacity-0')}
        />
      )}
      {hint && ready && (
        <div
          className={cn(
            'pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur transition-opacity duration-500',
            fill ? 'top-[calc(50%+min(34%,150px))]' : 'bottom-2',
            interacted || hideHint ? 'opacity-0' : 'opacity-100',
          )}
        >
          <Move3d className="h-3.5 w-3.5 text-primary" />
          {hint}
        </div>
      )}
    </div>
  );
});
