import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { industries } from '@/data/company';

/** Industries as a datasheet table rather than the usual icon-card grid. */
export function Industries() {
  return (
    <section className="py-20 md:py-28">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              index="01"
              eyebrow="Built for"
              title={
                <>
                  Sectors where the surface finish is the spec.
                </>
              }
              lead="Every fitting we ship ends up inside a line that gets cleaned-in-place, steamed, or inspected. We size, grade and polish for that reality."
            />
            <Reveal delay={200} className="mt-8">
              <Link
                to="/contact?subject=application"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Discuss your application
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>

        <Reveal className="lg:col-span-8" threshold={0.05}>
          <div className="border-b border-border">
            {industries.map((ind, i) => (
              <RevealItem key={ind.id} index={i} className="spec-row group cursor-default">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <span className="text-lg font-semibold tracking-tight text-foreground transition-transform duration-500 group-hover:translate-x-1 sm:text-xl">
                  {ind.name}
                </span>
                <span className="hidden text-sm leading-snug text-muted-foreground md:block">
                  {ind.note}
                </span>
                <span className="justify-self-end whitespace-nowrap rounded border border-border bg-card px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground/75 transition-colors group-hover:border-primary/40 group-hover:text-primary">
                  {ind.spec}
                </span>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
