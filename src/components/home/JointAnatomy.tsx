import { useCallback, useMemo } from 'react';
import { ChevronDown, MousePointer2 } from 'lucide-react';
import { TriClamp3D } from '@/components/brand/TriClamp3D';
import { PartId } from '@/components/brand/TriClampAssembly';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { cn } from '@/lib/utils';

interface Step {
  part: PartId | null;
  label: string;
  title: string;
  body: string;
  /** Scroll progress that shows this step's state. */
  at: number;
}

const steps: Step[] = [
  {
    part: 'ferrule',
    label: 'Ferrule',
    title: 'Two ferrules, orbital-weld ready',
    body: 'Butt-weld or socket-weld ferrules in SS304, 316 or 316L, faced square so the joint seats true. Short, long and custom lengths.',
    at: 0.06,
  },
  {
    part: 'gasket',
    label: 'Gasket',
    title: 'A flush, crevice-free seal',
    body: 'The ferrule face is held to DIN 32676 geometry so standard silicone, EPDM or PTFE gaskets sit flush with the bore. No step, no dead leg.',
    at: 0.34,
  },
  {
    part: 'clamp',
    label: 'Clamp',
    title: 'Tri Clover® clamp closes it',
    body: 'Our registered Tri Clover® range of single-pin and heavy-duty clamps. Wing nut for tool-free opening during CIP and inspection.',
    at: 0.62,
  },
  {
    part: null,
    label: 'Joint',
    title: 'One hygienic joint. No dead legs.',
    body: 'Mirror or matt internal finish, dimensionally interchangeable with global sanitary fittings. Material test certificates on request.',
    at: 0.9,
  },
];

const BANDS = [0.2, 0.48, 0.76];
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const seg = (p: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))));

/**
 * Scroll-pinned assembly. Ferrules seat first, then the clamp drops.
 * Steps are an accordion; clicking one scrolls to the matching progress,
 * so the same animation plays either way.
 */
export function JointAnatomy() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  const { spread, lift, active } = useMemo(() => {
    const spread = 1 - seg(progress, 0.14, 0.42);
    const lift = 1 - seg(progress, 0.46, 0.74);
    const active = BANDS.findIndex((b) => progress < b);
    return { spread, lift, active: active === -1 ? steps.length - 1 : active };
  }, [progress]);

  const jumpTo = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + steps[i].at * range, behavior: 'smooth' });
    },
    [ref],
  );

  const highlight = steps[active].part;
  const started = progress > 0.03;

  return (
    <section ref={ref} className="relative h-[320vh] bg-surface" aria-label="Anatomy of a hygienic joint">
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden">
        <div className="grid-paper absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_70%_at_30%_50%,black,transparent)]" aria-hidden="true" />

        <div className="container relative flex flex-1 flex-col py-5 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
          {/* Heading */}
          <div className="mb-3 flex items-center justify-between lg:absolute lg:left-0 lg:top-10 lg:mb-0 lg:px-10">
            <p className="eyebrow flex items-center gap-3">
              <span className="text-primary">02</span>
              <span className="h-px w-6 bg-border" />
              <span>Anatomy of a hygienic joint</span>
            </p>
          </div>

          {/* Visual */}
          <div className="relative mx-auto w-full max-w-[560px] lg:col-span-7 lg:max-w-none">
            <TriClamp3D
              spread={spread}
              lift={lift}
              highlight={highlight}
              interactive
              hint="Drag to inspect"
              fit={{ halfW: 175, halfH: 140 }}
              yaw={-0.85}
              pitch={0.3}
            />
            {/* progress rail */}
            <div className="mt-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Exploded</span>
              <span className="relative h-px flex-1 bg-border">
                <span
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: `${Math.min(100, Math.max(0, (progress / 0.76) * 100))}%` }}
                />
                {BANDS.map((b) => (
                  <span key={b} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-border" style={{ left: `${(b / 0.76) * 100}%` }} />
                ))}
              </span>
              <span>Assembled</span>
            </div>
            {/* scroll nudge */}
            <div
              className={cn(
                'pointer-events-none absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/30 bg-card/85 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary backdrop-blur transition-all duration-500',
                started ? '-translate-y-2 opacity-0' : 'opacity-100',
              )}
              aria-hidden="true"
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              Scroll to assemble
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </div>
          </div>

          {/* Steps as an accordion */}
          <ol className="mt-4 space-y-2 lg:col-span-5 lg:mt-0" aria-label="Assembly steps">
            {steps.map((s, i) => {
              const isActive = i === active;
              const done = i < active;
              return (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-expanded={isActive}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'group w-full rounded-lg border text-left transition-[background-color,border-color,box-shadow,transform] duration-500 [transition-timing-function:var(--ease-out-expo)]',
                      isActive
                        ? 'border-primary/50 bg-card shadow-[0_18px_40px_-28px_hsl(var(--primary)/0.5)] lg:translate-x-1'
                        : 'border-border/70 bg-transparent hover:border-primary/30 hover:bg-card/60',
                    )}
                  >
                    <div className="flex items-center gap-4 px-4 py-3 sm:px-5">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-500',
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : done
                              ? 'border-primary/40 text-primary'
                              : 'border-border text-muted-foreground',
                        )}
                      >
                        0{i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn('eyebrow transition-colors', isActive && 'text-primary')}>{s.label}</p>
                        <h3
                          className={cn(
                            'truncate text-[15px] font-semibold tracking-tight transition-colors duration-500 sm:text-lg',
                            isActive ? 'text-foreground' : 'text-foreground/60 group-hover:text-foreground/85',
                          )}
                        >
                          {s.title}
                        </h3>
                      </div>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]',
                          isActive && 'rotate-180 text-primary',
                        )}
                      />
                    </div>
                    {/* Accordion body: grid-rows trick animates height without JS */}
                    <div
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:var(--ease-out-expo)]',
                        isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-4 pb-4 pl-[3.75rem] text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pl-[4rem]">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
