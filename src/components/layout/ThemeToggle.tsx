import { Moon, Sun } from 'lucide-react';
import { Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

/** Sun / moon switch. Icons cross-fade and rotate; transform-only. */
export function ThemeToggle({ theme, onToggle, className }: ThemeToggleProps) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]',
          dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]',
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  );
}
