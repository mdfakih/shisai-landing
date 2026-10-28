import { cn } from '@/lib/utils';

interface PhotoBackdropProps {
  src: string;
  className?: string;
}

/**
 * Faint works photo behind a navy band. Luminosity blend keeps the navy,
 * the gradient keeps the left-hand copy readable.
 */
export function PhotoBackdrop({ src, className }: PhotoBackdropProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full scale-105 object-cover opacity-[0.22] mix-blend-luminosity [filter:grayscale(1)_contrast(1.1)_blur(1.5px)]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--primary-deep))_0%,hsl(var(--primary-deep)/0.55)_45%,hsl(var(--primary-deep)/0.75)_100%)]" />
    </div>
  );
}
