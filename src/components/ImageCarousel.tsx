import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
  /** Auto-advance interval in ms; 0 disables. */
  interval?: number;
}

const SWIPE_PX = 50;

const ImageCarousel = ({ images, productName, className, interval = 0 }: ImageCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const endX = useRef(0);
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
    const d = startX.current - endX.current;
    if (!startX.current || !endX.current || count <= 1) return;
    if (d > SWIPE_PX) go(index + 1);
    if (d < -SWIPE_PX) go(index - 1);
    startX.current = 0;
    endX.current = 0;
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className="group relative aspect-square overflow-hidden rounded-md plate"
        onTouchStart={(e) => (startX.current = e.targetTouches[0].clientX)}
        onTouchMove={(e) => (endX.current = e.targetTouches[0].clientX)}
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
              'absolute inset-0 h-full w-full select-none object-contain p-4 transition-opacity duration-500 sm:p-6',
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
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground opacity-0 shadow-sm transition-all hover:bg-card group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground opacity-0 shadow-sm transition-all hover:bg-card group-hover:opacity-100 focus:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute right-3 top-3 rounded border border-border bg-card/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-foreground/70 backdrop-blur">
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
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                i === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-steel',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
