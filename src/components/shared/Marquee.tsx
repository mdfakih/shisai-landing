import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
  items: readonly ReactNode[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
}

/** CSS-only infinite ticker. Content duplicated once for the loop. */
export function Marquee({
  items,
  duration = 40,
  reverse = false,
  className,
  itemClassName,
  separator,
}: MarqueeProps) {
  const track = [...items, ...items];
  return (
    <div
      className={cn('marquee-group relative overflow-hidden', className)}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
      aria-hidden="true"
    >
      <div className={cn('marquee', reverse && 'marquee-reverse')}>
        {track.map((item, i) => (
          <span key={i} className={cn('flex shrink-0 items-center', itemClassName)}>
            {item}
            {separator ?? <span className="mx-8 h-1 w-1 rounded-full bg-current opacity-40" />}
          </span>
        ))}
      </div>
    </div>
  );
}
