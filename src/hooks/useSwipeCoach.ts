import { useCallback, useEffect, useState } from 'react';

const SEEN_KEY = 'shisai:swipe-coach-seen';
const DELAY_MS = 500; // let the sheet finish opening first
const SHOW_MS = 3900; // two loops of the swipe animation

const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/** True on phones/tablets, where swiping is the main way to browse. */
export function useCoarsePointer() {
  const [touch, setTouch] = useState(isTouch);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const sync = () => setTouch(mq.matches);
    // Safari < 14 only has the legacy listener API.
    if (mq.addEventListener) {
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }
    mq.addListener(sync);
    return () => mq.removeListener(sync);
  }, []);
  return touch;
}

function hasSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false; // storage blocked: show it, it is only a hint
  }
}

function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage blocked; the hint may show again next visit */
  }
}

/**
 * One-time coach mark that demonstrates the swipe gesture the first time a
 * touch user opens the product sheet. Dismissed by any touch or after two loops.
 */
export function useSwipeCoach(open: boolean, enabled: boolean) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!open || !enabled || !isTouch() || hasSeen()) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => {
      markSeen();
      setShow(true);
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [open, enabled]);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => setShow(false), SHOW_MS);
    return () => window.clearTimeout(t);
  }, [show]);

  const dismiss = useCallback(() => setShow(false), []);
  return { show, dismiss };
}
