import { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

interface PageIntroProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** Inner-page header on the engineering grid. */
export function PageIntro({ index, eyebrow, title, lead, aside, className }: PageIntroProps) {
  return (
    <section className={cn('relative overflow-hidden border-b border-border bg-surface pt-[calc(var(--nav-h)+3rem)] pb-12 md:pt-[calc(var(--nav-h)+5rem)] md:pb-16', className)}>
      <div className="steel-grain absolute inset-0" aria-hidden="true" />
      <div className="grid-paper absolute inset-0 opacity-70 [mask-image:linear-gradient(180deg,black,transparent_90%)]" aria-hidden="true" />
      <div className="container relative">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <Reveal eager className="min-w-0 md:col-span-8">
            <p className="eyebrow mb-4 flex items-center gap-3">
              <span className="text-primary">{index}</span>
              <span className="h-px w-6 bg-border" />
              <span>{eyebrow}</span>
            </p>
            <h1 className="display-xl text-foreground">{title}</h1>
            {lead && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{lead}</p>}
          </Reveal>
          {aside && (
            <Reveal eager delay={150} className="md:col-span-4 md:justify-self-end">
              {aside}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
