/** Reads the CSS --background token as 0..1 RGB for the highlight fade. */
export function readBackground(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
  const [h, s, l] = raw.split(/\s+/).map((v) => parseFloat(v));
  if ([h, s, l].some((v) => Number.isNaN(v))) return [1, 1, 1];
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}
