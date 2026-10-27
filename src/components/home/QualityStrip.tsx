import { ArrowUpRight, FileCheck2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { certificates } from '@/data/company';

export function QualityStrip() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <SectionHeading
          index="05"
          eyebrow="Quality & compliance"
          align="center"
          title="Registered, assessed, and documented."
          lead="Our registrations and the Tri Clover® trademark are public documents. Material test certificates and dimensional reports are available on request with every order."
        />

        <Reveal threshold={0.1} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {certificates.map((c, i) => (
            <RevealItem key={c.id} index={i}>
              <Link
                to={`/certificates#${c.id}`}
                className="group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.45)]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/8 text-primary">
                    <FileCheck2 className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="mt-8">
                  <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground">{c.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.issuer}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
