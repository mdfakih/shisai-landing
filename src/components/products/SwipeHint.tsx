import type { CSSProperties } from 'react';
import { ChevronLeft, ChevronRight, Pointer } from 'lucide-react';
import { cn } from '@/lib/utils';

// Fingertip of lucide's Pointer glyph, as a fraction of the icon box.
const TIP_X = 8 / 24;
const TIP_Y = 2.5 / 24;

const SIZES = {
  sm: { w: 68, h: 30, icon: 22, d: 13, line: 7, chev: 12, trail: 2 },
  lg: { w: 132, h: 62, icon: 40, d: 28, line: 15, chev: 16, trail: 3 },
} as const;

interface SwipeGlyphProps {
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Animated hand that presses, drags sideways and lifts, leaving a trail,
 * so the gesture reads without words. Static under reduced motion.
 */
export function SwipeGlyph({ size = 'sm', className }: SwipeGlyphProps) {
  const s = SIZES[size];
  const mid = s.w / 2;
  return (
    <span
      aria-hidden="true"
      className={cn('relative block shrink-0', className)}
      style={{ width: s.w, height: s.h, '--swipe-d': `${s.d}px` } as CSSProperties}
    >
      <ChevronLeft
        className="absolute left-0 text-muted-foreground"
        style={{ top: s.line - s.chev / 2, width: s.chev, height: s.chev }}
      />
      <ChevronRight
        className="absolute right-0 text-muted-foreground"
        style={{ top: s.line - s.chev / 2, width: s.chev, height: s.chev }}
      />
      <span
        className="absolute origin-right animate-swipe-trail rounded-full bg-gradient-to-r from-primary/70 to-primary/0 motion-reduce:animate-none"
        style={{ top: s.line - s.trail / 2, left: mid - s.d, width: s.d * 2, height: s.trail }}
      />
      <Pointer
        strokeWidth={size === 'lg' ? 1.75 : 2}
        className="absolute animate-swipe-hand text-primary [filter:drop-shadow(0_0_2px_hsl(var(--card)))] motion-reduce:animate-none"
        style={{
          top: s.line - s.icon * TIP_Y,
          left: mid - s.icon * TIP_X,
          width: s.icon,
          height: s.icon,
          transformOrigin: `${TIP_X * 100}% ${TIP_Y * 100}%`,
        }}
      />
    </span>
  );
}

/** First-open coach mark laid over the swipeable panel. Purely visual. */
export function SwipeCoach({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center bg-background/55 px-6 pt-[14%] animate-in fade-in-0 duration-300"
    >
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card px-6 pb-4 pt-5 text-center shadow-xl">
        <SwipeGlyph size="lg" />
        <p className="text-sm font-semibold text-foreground">Swipe left or right</p>
        <p className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground">on this panel to browse more {label}</p>
      </div>
    </div>
  );
}
