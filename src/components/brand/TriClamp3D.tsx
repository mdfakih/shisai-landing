import { useEffect, useRef, useState } from 'react';
import { Move3d } from 'lucide-react';
import { PartId, TriClampAssembly } from '@/components/brand/TriClampAssembly';
import { DimensionOverlay, DimensionOverlayHandle } from '@/components/brand/DimensionOverlay';
import type { Dimension } from '@/components/brand/dimensions';
import type { SceneOptions, TriClampScene } from '@/lib/gl/triclampScene';
import { readBackground } from '@/lib/gl/theme';
import { cn } from '@/lib/utils';

interface TriClamp3DProps {
  spread?: number;
  lift?: number;
  highlight?: PartId | null;
  interactive?: boolean;
  autoRotate?: boolean;
  fit?: SceneOptions['fit'];
  yaw?: number;
  pitch?: number;
  /** Show "drag to rotate" until the first interaction. */
  hint?: string;
  /** Fill the parent box (parent must size it) instead of using the drawing aspect ratio. */
  fill?: boolean;
  /** Dimension lines on the SVG placeholder. */
  showDims?: boolean;
  /** Live engineering callouts that track the 3D model. */
  dimensions?: Dimension[];
  className?: string;
}

/**
 * Real 3D tri-clamp joint. Loads the WebGL module after first paint and
 * cross-fades from the SVG drawing. Falls back to the SVG when WebGL is
 * unavailable.
 */
export function TriClamp3D({
  spread = 0,
  lift = 0,
  highlight = null,
  interactive = true,
  autoRotate = false,
  fit,
  fill = false,
  yaw,
  pitch,
  hint,
  showDims = false,
  dimensions,
  className,
}: TriClamp3DProps) {
  const overlayRef = useRef<DimensionOverlayHandle>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<TriClampScene | null>(null);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Boot the renderer when idle; keep the SVG until it is drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let idleHandle = 0;
    const boot = async () => {
      try {
        const mod = await import('@/lib/gl/triclampScene');
        if (disposed) return;
        const scene = new mod.TriClampScene(canvas, {
          spread,
          lift,
          highlight,
          interactive,
          autoRotate,
          fit,
          yaw,
          pitch,
          onInteract: () => setInteracted(true),
          onFrame: dimensions ? (ctx) => overlayRef.current?.update(ctx) : undefined,
        });
        scene.setBackground(readBackground());
        sceneRef.current = scene;
        canvas.style.cursor = interactive ? 'grab' : '';
        requestAnimationFrame(() => !disposed && setReady(true));
      } catch {
        /* no WebGL: SVG stays */
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
    // Initial values only; later changes go through setState below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setState({ spread, lift, highlight, interactive, autoRotate });
  }, [spread, lift, highlight, interactive, autoRotate]);

  useEffect(() => {
    if (fit) sceneRef.current?.setFit(fit);
  }, [fit?.halfW, fit?.halfH]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pause when off-screen; refresh background on theme change.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => sceneRef.current?.setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    const mo = new MutationObserver(() => sceneRef.current?.setBackground(readBackground()));
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
            interacted ? 'opacity-0' : 'opacity-100',
          )}
        >
          <Move3d className="h-3.5 w-3.5 text-primary" />
          {hint}
        </div>
      )}
    </div>
  );
}
