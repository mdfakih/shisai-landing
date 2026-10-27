import { TriClamp3D } from '@/components/brand/TriClamp3D';
import { heroDimensions } from '@/components/brand/dimensions';
import { Reveal } from '@/components/motion/Reveal';
import { GhostLink, PrimaryLink } from '@/components/shared/CtaButtons';
import { company, stats } from '@/data/company';

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
        className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.08),transparent)]"
        aria-hidden="true"
      />

      <div className="container relative grid min-h-[calc(100svh-var(--nav-h))] grid-cols-1 items-center gap-10 py-14 lg:grid-cols-12 lg:gap-6 lg:py-10">
        {/* Copy */}
        <div className="min-w-0 lg:col-span-6">
          <Reveal delay={60}>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Est. {company.foundedYear} · Vasai, India<span className="hidden sm:inline"> · SS304 / 316 / 316L</span>
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="display-xl mt-6 text-foreground">
              <span className="metal-text">Stainless fittings</span>{' '}
              <span className="block">for lines that can’t afford contamination.</span>
            </h1>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tri-clamp ferrules, bends, tees, reducers and clamps, machined and polished
              in-house for pharmaceutical, food, dairy and biotech process lines.
            </p>
          </Reveal>
          <Reveal delay={380} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryLink to="/products">Explore the catalogue</PrimaryLink>
            <GhostLink to="/contact?subject=quote">Send a drawing for quote</GhostLink>
          </Reveal>

          <Reveal delay={520} className="mt-12 grid max-w-md grid-cols-3 divide-x divide-border">
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

        {/* 3D object */}
        <Reveal variant="scale" delay={240} className="relative min-w-0 lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[640px]">
            <div className="corner-marks pointer-events-none absolute -inset-3 sm:-inset-6" aria-hidden="true" />
            <div className="animate-float will-change-transform">
              <TriClamp3D
                interactive
                autoRotate
                showDims
                dimensions={heroDimensions}
                hint="Drag to rotate"
                fit={{ halfW: 172, halfH: 92 }}
                yaw={-0.95}
                pitch={0.36}
              />
            </div>

            {/* Title block, like a drawing sheet */}
            <div className="mt-2 ml-auto grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1 border border-border bg-card/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur sm:text-[11px]">
              <span>Part</span>
              <span className="text-foreground">TC joint, DN50</span>
              <span>Material</span>
              <span className="text-foreground">SS316L</span>
              <span>Finish</span>
              <span className="text-foreground">Mirror · Ra ≤ 0.8</span>
              <span>Drawn by</span>
              <span className="text-foreground">Shisai · Sheet 01</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex" aria-hidden="true">
        <span className="eyebrow">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-border">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-primary animate-[scrollcue_1.8s_ease-in-out_infinite]" />
        </span>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(220%)}}`}</style>
    </section>
  );
}
