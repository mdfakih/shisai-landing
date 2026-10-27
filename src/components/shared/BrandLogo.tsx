import logo from '@/assets/logo.webp';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  /** Pixel height; width is derived from the trimmed logo's 431:160 ratio. */
  height?: number;
}

export function BrandLogo({ className, height = 40 }: BrandLogoProps) {
  const width = Math.round((height * 431) / 160);
  return (
    <img
      src={logo}
      alt="Shisai Steel Industries"
      width={width}
      height={height}
      decoding="async"
      className={cn('block h-auto select-none dark:[filter:invert(1)_hue-rotate(180deg)_brightness(1.2)]', className)}
      style={{ height, width }}
      draggable={false}
    />
  );
}
