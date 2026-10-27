import { useEffect, useRef, useState } from 'react';

/**
 * Returns 0..1 progress of how far the ref'd element has scrolled
 * through the viewport. 0 = top of element hits bottom of viewport,
 * 1 = bottom of element hits top. Throttled to animation frames.
 */
export function useScrollProgress<T extends HTMLElement>(offset = 0) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const compute = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      const scrolled = -rect.top + offset;
      const p = Math.min(1, Math.max(0, scrolled / total));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [offset]);

  return { ref, progress };
}
