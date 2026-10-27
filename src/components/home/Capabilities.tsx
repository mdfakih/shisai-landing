import { Check } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { Marquee } from '@/components/shared/Marquee';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { useCountUp } from '@/hooks/useCountUp';
import { machinery, stats, Stat } from '@/data/company';
import pressShop from '@/assets/aboutUs/119264350-location-1650277650595-500x500-photoutils-com--1000x1000.webp';
import polishing from '@/assets/aboutUs/119264350-location-1653469114346-500x500-photoutils-com--1000x1000.webp';

const points = [
  'Pressing, machining and polishing under one roof',
  'Mirror or matt internal finish to your specification',
  'Laser marking for grade and heat-number traceability',
  'Custom ferrules, spools and manifolds from your drawing',
];

function StatBlock({ stat }: { stat: Stat }) {
  const [ref, value] = useCountUp<HTMLDivElement>(stat.value);
  return (
    <div ref={ref} className="border-l border-border pl-4">
      <p className="tabular text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {value}
        <span className="text-primary">{stat.suffix}</span>
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
    </div>
  );
}

export function Capabilities() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="container grid items-center gap-12 lg:grid-cols-12">
        {/* Photos */}
        <div className="relative lg:col-span-6">
          <Reveal variant="clip" className="aspect-[4/3]" style={{ ['--reveal-cover' as string]: 'hsl(var(--surface))' }}>
            <div className="duotone h-full w-full rounded-lg">
              <img
              src={pressShop}
              alt="Power press line at the Shisai works, Vasai"
              loading="lazy"
              decoding="async"
              width={960}
              height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="corner-marks pointer-events-none absolute -inset-3" aria-hidden="true" />
            <p className="absolute bottom-4 left-4 z-[1] font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80">
              Press shop · Unit 13, Waliv
            </p>
          </Reveal>
          <Reveal
            variant="right"
            delay={200}
            className="duotone absolute -bottom-8 -right-3 hidden w-[44%] rounded-lg border-4 border-surface shadow-2xl sm:block"
          >
            <img
              src={polishing}
              alt="Machining bay"
              loading="lazy"
              decoding="async"
              width={960}
              height={1280}
              className="aspect-square h-full w-full object-cover"
            />
          </Reveal>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6 lg:pl-8">
          <SectionHeading
            index="04"
            eyebrow="In-house capability"
            title="From sheet and tube to a polished, marked fitting."
            lead="We do not trade finished parts. Each fitting is pressed, machined, welded and polished at our own works, so tolerances and finish are ours to control."
          />
          <Reveal delay={150} className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <StatBlock key={s.label} stat={s} />
            ))}
          </Reveal>
          <Reveal delay={250} as="ul" className="mt-9 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground/85 sm:text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      <div className="mt-20 border-y border-border bg-card/60">
        <Marquee
          items={machinery}
          reverse
          duration={45}
          className="py-3 text-foreground/55 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
          itemClassName="font-mono text-[11px] uppercase tracking-[0.22em]"
          separator={<span className="mx-6 text-primary/50">/</span>}
        />
      </div>
    </section>
  );
}
