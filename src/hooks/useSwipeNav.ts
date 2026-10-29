import { useRef } from 'react';

const COMMIT_PX = 56;
const FLICK_PX = 24;
const FLICK_SPEED = 0.45; // px per ms
const AXIS_LOCK_PX = 8;
const SPRING = 'transform 260ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 260ms ease';

const FLICK_STALE_MS = 100; // a pause before lifting cancels the flick

interface Drag {
  x: number;
  y: number;
  dx: number;
  axis: 'x' | 'y' | null;
  /** Last sample and smoothed velocity, so a flick is judged on the final moves. */
  lx: number;
  lt: number;
  v: number;
}

/**
 * Horizontal swipe with drag-follow: the `target` element tracks the finger,
 * then either commits (finger left = next, right = previous) or springs back.
 * Vertical drags are left to native scrolling.
 */
export function useSwipeNav<T extends HTMLElement>(onSwipe: (dir: 1 | -1) => void, enabled = true) {
  const target = useRef<T>(null);
  const drag = useRef<Drag | null>(null);

  const moveTo = (x: number, animate: boolean) => {
    const el = target.current;
    if (!el) return;
    el.style.transition = animate ? SPRING : 'none';
    el.style.transform = x ? `translate3d(${x}px, 0, 0)` : '';
    el.style.opacity = x ? String(1 - Math.min(Math.abs(x) / 480, 0.3)) : '';
  };

  const cancel = () => {
    drag.current = null;
    moveTo(0, true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!enabled) return;
    // A second finger means pinch or a stray touch, not a swipe.
    if (e.touches.length > 1) {
      if (drag.current) cancel();
      return;
    }
    const p = e.touches[0];
    drag.current = { x: p.clientX, y: p.clientY, dx: 0, axis: null, lx: p.clientX, lt: e.timeStamp, v: 0 };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current;
    if (!d || e.touches.length > 1) return;
    const p = e.touches[0];
    const dx = p.clientX - d.x;
    const dy = p.clientY - d.y;
    if (!d.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK_PX) return;
      d.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
    }
    if (d.axis !== 'x') return;
    const dt = e.timeStamp - d.lt;
    if (dt > 0) d.v = 0.8 * ((p.clientX - d.lx) / dt) + 0.2 * d.v;
    d.lx = p.clientX;
    d.lt = e.timeStamp;
    d.dx = dx;
    moveTo(dx * 0.85, false);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const d = drag.current;
    if (!d || e.touches.length > 0) return;
    drag.current = null;
    if (d.axis !== 'x') return;
    const dist = Math.abs(d.dx);
    const v = e.timeStamp - d.lt > FLICK_STALE_MS ? 0 : d.v;
    const flick = dist >= FLICK_PX && Math.abs(v) >= FLICK_SPEED && Math.sign(v) === Math.sign(d.dx);
    if (dist >= COMMIT_PX || flick) {
      // The caller re-keys the content, so the next item mounts fresh.
      moveTo(0, false);
      onSwipe(d.dx < 0 ? 1 : -1);
      return;
    }
    moveTo(0, true);
  };

  return { target, handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: cancel } };
}
