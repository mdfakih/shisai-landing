import { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Numbered datasheet-style heading used across all sections. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <Reveal
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <p
        className={cn(
          'eyebrow mb-4 flex items-center gap-3',
          align === 'center' && 'justify-center',
          dark && 'text-white/60',
        )}
      >
        {index && <span className={cn('text-primary', dark && 'text-white')}>{index}</span>}
        {index && <span className={cn('h-px w-6 bg-border', dark && 'bg-white/30')} />}
        <span>{eyebrow}</span>
      </p>
      <h2 className={cn('display-lg', dark ? 'text-white' : 'text-foreground')}>{title}</h2>
      {lead && (
        <p
          className={cn(
            'mt-5 text-base leading-relaxed sm:text-lg',
            dark ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
