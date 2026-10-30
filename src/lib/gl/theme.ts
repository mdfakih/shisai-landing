type Rgb = [number, number, number];

/** Reads an HSL CSS token ("234 54% 30%") as 0..1 RGB. */
function readToken(name: string, fallback: Rgb): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [h, s, l] = raw.split(/\s+/).map((v) => parseFloat(v));
  if ([h, s, l].some((v) => Number.isNaN(v))) return fallback;
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

/** The --background token, for fades into the page. */
export const readBackground = (): Rgb => readToken('--background', [1, 1, 1]);

/** The --dim drawing ink, for section hatching and cut lines. */
export const readInk = (): Rgb => readToken('--dim', [0.14, 0.17, 0.46]);
