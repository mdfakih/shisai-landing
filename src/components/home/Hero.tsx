import { Reveal } from '@/components/motion/Reveal';
import { GhostLink, PrimaryLink } from '@/components/shared/CtaButtons';
import { company, stats } from '@/data/company';
import { HeroExplorer } from './HeroExplorer';

const heroStats = stats.slice(0, 3);

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-[var(--nav-h)]">
      {/* Drawing-sheet background */}
      <div
        className="grid-paper absolute inset-0 [mask-image:radial-gradient(120%_90%_at_70%_20%,black_30%,transparent_75%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.08),transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent)]"
        aria-hidden="true"
      />

      <div className="container relative grid min-h-[calc(100svh-var(--nav-h))] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-6 lg:py-10">
        {/* Copy */}
        <div className="min-w-0 lg:col-span-6">
          <Reveal eager delay={60}>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Since {company.foundedYear} · Vasai, India<span className="hidden sm:inline"> · SS304 / 316 / 316L</span>
            </p>
          </Reveal>
          <Reveal eager delay={160}>
            <h1 className="display-xl mt-6 text-foreground">
              <span className="metal-text">Hygienic fittings.</span>{' '}
              <span className="block">Connecting you to quality.</span>
            </h1>
          </Reveal>
          <Reveal eager delay={280}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tri-clamp ferrules, bends, tees, reducers, valves and clamps, pressed, machined
              and polished in-house for pharmaceutical, food, dairy and biotech lines that
              cannot afford contamination.
            </p>
          </Reveal>
          <Reveal eager delay={380} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink to="/products">Explore the catalogue</PrimaryLink>
            <GhostLink to="/contact?subject=quote">Send a drawing for quote</GhostLink>
          </Reveal>

          <Reveal eager delay={520} className="mt-12 grid max-w-md grid-cols-3 divide-x divide-border">
            {heroStats.map((s) => (
              <div key={s.label} className="px-4 first:pl-0">
                <p className="tabular text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {s.value}
                  <span className="text-primary">{s.suffix}</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Interactive part explorer */}
        <Reveal eager variant="scale" delay={240} className="relative min-w-0 lg:col-span-6">
          <HeroExplorer />
        </Reveal>
      </div>

    </section>
  );
}
