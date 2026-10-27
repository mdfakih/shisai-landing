import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
  /** Classes for the image frame; override the aspect ratio here. */
  frameClassName?: string;
  /** Auto-advance interval in ms; 0 disables. */
  interval?: number;
  /** Called when the user swipes past the first/last image. */
  onOverscroll?: (direction: 1 | -1) => void;
}

const SWIPE_PX = 48;

const ImageCarousel = ({ images, productName, className, frameClassName, interval = 0, onOverscroll }: ImageCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const end = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;

  useEffect(() => {
    setIndex(0);
  }, [images]);

  useEffect(() => {
    if (count <= 1 || paused || interval <= 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(t);
  }, [count, paused, interval]);

  if (count === 0) return null;

  const go = (next: number) => setIndex((next + count) % count);

  const onTouchEnd = () => {
    const s = start.current;
    const e = end.current;
    start.current = null;
    end.current = null;
    if (!s || !e) return;
    const dx = s.x - e.x;
    const dy = s.y - e.y;
    // Ignore mostly-vertical gestures so page scrolling stays natural.
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    const dir: 1 | -1 = dx > 0 ? 1 : -1;
    const atEdge = dir === 1 ? index === count - 1 : index === 0;
    if (count <= 1 || atEdge) {
      onOverscroll?.(dir);
      return;
    }
    go(index + dir);
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn('plate group relative aspect-square overflow-hidden rounded-md', frameClassName)}
        onTouchStart={(e) => (start.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })}
        onTouchMove={(e) => (end.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="grid-paper absolute inset-0 opacity-50" aria-hidden="true" />
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${productName}, view ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            className={cn(
              'absolute inset-0 h-full w-full select-none object-contain p-3 transition-opacity duration-500 sm:p-6',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-all hover:bg-card md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-all hover:bg-card md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded border border-border bg-card/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-foreground/70 backdrop-blur">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1}`}
              className={cn('h-1 rounded-full transition-all duration-300', i === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-steel')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
