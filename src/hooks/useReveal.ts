import { useEffect, useRef } from 'react';

interface RevealOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Root margin, e.g. '0px 0px -10% 0px' to trigger a little early. */
  rootMargin?: string;
  /** Reveal once (default) or toggle each time. */
  once?: boolean;
}

/**
 * Adds `is-in` to the ref'd element when it scrolls into view.
 * CSS does all the animating; this only flips a class.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  once = true,
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-in');
          }
        });
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
