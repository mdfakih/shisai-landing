import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Below-the-fold image hint: keeps Chrome from boosting the first few large
 * images ahead of the CSS, fonts and scripts on slow connections. React 18
 * does not know `fetchPriority`, so the lowercase HTML attribute is spread in.
 */
export const lowFetchPriority = { fetchpriority: "low" } as Record<string, string>;
