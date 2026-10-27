import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll to top on route change, or to the hash target if there is one. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // Lazy routes render after a tick; retry briefly until the anchor exists.
      let tries = 0;
      const seek = () => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top, behavior: 'smooth' });
        } else if (tries++ < 20) {
          setTimeout(seek, 60);
        }
      };
      seek();
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
