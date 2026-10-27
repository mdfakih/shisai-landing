import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const META_COLORS: Record<Theme, string> = { light: '#2f2f78', dark: '#0b0d1a' };

const readTheme = (): Theme => {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = META_COLORS[theme];
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode); theme still applies for the session */
  }
};

/**
 * Light / dark switch. The initial class is set by an inline script in
 * index.html before first paint, so this hook only reads and toggles it.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    // Follow OS changes only while the user has not chosen explicitly.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        stored = null;
      }
      if (stored) return;
      const next: Theme = e.matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const set = useCallback((next: Theme) => {
    applyTheme(next);
    setTheme(next);
  }, []);

  const toggle = useCallback(() => set(theme === 'dark' ? 'light' : 'dark'), [set, theme]);

  return { theme, set, toggle, isDark: theme === 'dark' };
}
