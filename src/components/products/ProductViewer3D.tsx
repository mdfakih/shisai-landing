import { useEffect, useRef, useState } from 'react';
import { Move3d } from 'lucide-react';
import type { ProductScene } from '@/lib/gl/productScene';
import { readBackground } from '@/lib/gl/theme';
import { cn } from '@/lib/utils';

interface ProductViewer3DProps {
  categoryId: string;
  productName: string;
  className?: string;
}

type Status = 'loading' | 'ready' | 'failed';

/**
 * Drag-to-rotate model of a catalogue part. The WebGL module and the
 * procedural geometry load on first mount, so the catalogue page itself
 * pays nothing until someone opens the 3D tab.
 */
export function ProductViewer3D({ categoryId, productName, className }: ProductViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ProductScene | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    (async () => {
      try {
        const [{ ProductScene }, { modelFor }] = await Promise.all([import('@/lib/gl/productScene'), import('@/lib/gl/models')]);
        if (disposed) return;
        const scene = new ProductScene(canvas, {
          model: modelFor(categoryId, productName),
          onInteract: () => setInteracted(true),
        });
        scene.setBackground(readBackground());
        sceneRef.current = scene;
        requestAnimationFrame(() => !disposed && setStatus('ready'));
      } catch {
        if (!disposed) setStatus('failed');
      }
    })();
    const mo = new MutationObserver(() => sceneRef.current?.setBackground(readBackground()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      disposed = true;
      mo.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // Mount once; product changes go through setModel below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    import('@/lib/gl/models').then(({ modelFor }) => scene.setModel(modelFor(categoryId, productName)));
  }, [categoryId, productName]);

  return (
    <div className={cn('plate relative select-none overflow-hidden rounded-md', className)}>
      <div className="grid-paper absolute inset-0 opacity-60" aria-hidden="true" />
      <canvas
        ref={canvasRef}
        aria-label={`3D model of ${productName}`}
        role="img"
        className={cn('absolute inset-0 h-full w-full touch-none transition-opacity duration-500', status === 'ready' ? 'opacity-100' : 'opacity-0')}
      />
      {status === 'loading' && (
        <p className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Loading model</p>
      )}
      {status === 'failed' && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">3D view is not available on this device.</p>
      )}
      {status === 'ready' && (
        <div
          className={cn(
            'pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur transition-opacity duration-500',
            interacted ? 'opacity-0' : 'opacity-100',
          )}
        >
          <Move3d className="h-3.5 w-3.5 text-primary" />
          Drag to rotate
        </div>
      )}
      <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Representative model · DN50</span>
    </div>
  );
}
