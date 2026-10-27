import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Dimension } from '@/components/brand/dimensions';
import type { FrameContext } from '@/lib/gl/triclampScene';
import { cn } from '@/lib/utils';

export interface DimensionOverlayHandle {
  /** Reposition every annotation from the latest projection. */
  update: (ctx: FrameContext) => void;
}

interface DimensionOverlayProps {
  dimensions: Dimension[];
  className?: string;
}

const TICK = 5;
const LABEL_GAP = 16;
const SHOULDER = 12;
const MIN_LINE_PX = 12;
const CHAR_PX = 7.2;
const EDGE_PAD = 6;

/**
 * SVG layer drawn over the WebGL canvas. Elements are created once and moved
 * by direct attribute writes each frame, so React never re-renders per frame.
 */
export const DimensionOverlay = forwardRef<DimensionOverlayHandle, DimensionOverlayProps>(
  function DimensionOverlay({ dimensions, className }, ref) {
    const svgRef = useRef<SVGSVGElement>(null);
    const nodes = useRef<Record<string, Record<string, SVGElement | null>>>({});

    const bind = (id: string, key: string) => (el: SVGElement | null) => {
      nodes.current[id] ??= {};
      nodes.current[id][key] = el;
    };

    useImperativeHandle(ref, () => ({
      update(ctx) {
        const svg = svgRef.current;
        if (!svg) return;
        svg.setAttribute('viewBox', `0 0 ${ctx.width} ${ctx.height}`);
        const cx = ctx.width / 2;
        const cy = ctx.height / 2;

        for (const d of dimensions) {
          const n = nodes.current[d.id];
          if (!n) continue;
          const g = n.g as SVGGElement | null;
          if (!g) continue;

          if (d.kind === 'linear') {
            const a = ctx.project(d.a, d.group);
            const b = ctx.project(d.b, d.group);
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy);
            if (!a.visible || !b.visible || len < MIN_LINE_PX) {
              g.setAttribute('opacity', '0');
              continue;
            }
            g.setAttribute('opacity', '1');
            // Unit perpendicular, pointing away from the canvas centre.
            let px = -dy / len;
            let py = dx / len;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            if ((mx - cx) * px + (my - cy) * py < 0) {
              px = -px;
              py = -py;
            }
            setLine(n.line, a.x, a.y, b.x, b.y);
            setLine(n.ta, a.x - px * TICK, a.y - py * TICK, a.x + px * TICK, a.y + py * TICK);
            setLine(n.tb, b.x - px * TICK, b.y - py * TICK, b.x + px * TICK, b.y + py * TICK);
            const t = n.text as SVGTextElement | null;
            if (t) {
              t.setAttribute('x', String(mx + px * LABEL_GAP));
              t.setAttribute('y', String(my + py * LABEL_GAP + 4));
              t.setAttribute('text-anchor', Math.abs(px) < 0.35 ? 'middle' : px > 0 ? 'start' : 'end');
            }
          } else {
            const p = ctx.project(d.at, d.group);
            if (!p.visible) {
              g.setAttribute('opacity', '0');
              continue;
            }
            g.setAttribute('opacity', '1');
            // Flip the leader to the other side if the label would leave the canvas.
            const textW = d.label.length * CHAR_PX + SHOULDER + 10;
            let ox = d.offset[0];
            const wantsRight = ox >= 0;
            const overflowsRight = p.x + ox + textW > ctx.width - EDGE_PAD;
            const overflowsLeft = p.x + ox - textW < EDGE_PAD;
            if ((wantsRight && overflowsRight) || (!wantsRight && overflowsLeft)) ox = -ox;
            const lx = p.x + ox;
            const ly = Math.min(ctx.height - EDGE_PAD, Math.max(EDGE_PAD + 8, p.y + d.offset[1]));
            setLine(n.line, p.x, p.y, lx, ly);
            const dot = n.dot as SVGCircleElement | null;
            if (dot) {
              dot.setAttribute('cx', String(p.x));
              dot.setAttribute('cy', String(p.y));
            }
            const right = ox >= 0;
            const sx = lx + (right ? SHOULDER : -SHOULDER);
            setLine(n.shoulder, lx, ly, sx, ly);
            const t = n.text as SVGTextElement | null;
            if (t) {
              t.setAttribute('x', String(sx + (right ? 5 : -5)));
              t.setAttribute('y', String(ly + 4));
              t.setAttribute('text-anchor', right ? 'start' : 'end');
            }
          }
        }
      },
    }));

    return (
      <svg
        ref={svgRef}
        className={cn('pointer-events-none absolute inset-0 h-full w-full overflow-visible', className)}
        aria-hidden="true"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
        fontSize="11"
        letterSpacing="0.08em"
        style={{ paintOrder: 'stroke fill' }}
      >
        {dimensions.map((d) => (
          <g key={d.id} ref={bind(d.id, 'g')} opacity="0" className="transition-opacity duration-300">
            <line ref={bind(d.id, 'line')} strokeDasharray={d.kind === 'leader' ? '3 3' : undefined} />
            {d.kind === 'linear' ? (
              <>
                <line ref={bind(d.id, 'ta')} />
                <line ref={bind(d.id, 'tb')} />
              </>
            ) : (
              <>
                <circle ref={bind(d.id, 'dot')} r="2.4" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5" />
                <line ref={bind(d.id, 'shoulder')} />
              </>
            )}
            <text
              ref={bind(d.id, 'text')}
              fill="hsl(var(--primary))"
              stroke="hsl(var(--background))"
              strokeWidth="3"
              strokeLinejoin="round"
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    );
  },
);

function setLine(el: SVGElement | null | undefined, x1: number, y1: number, x2: number, y2: number) {
  if (!el) return;
  el.setAttribute('x1', x1.toFixed(1));
  el.setAttribute('y1', y1.toFixed(1));
  el.setAttribute('x2', x2.toFixed(1));
  el.setAttribute('y2', y2.toFixed(1));
}
