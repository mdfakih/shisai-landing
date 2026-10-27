import { useCallback, useEffect, useMemo, useRef } from 'react';
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
 * Desktop: steps are an accordion. Phones: a horizontal snap strip you can
 * swipe. Either way, selecting a step scrolls to the matching progress so
 * the same animation plays.
 */
export function JointAnatomy() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const stripRef = useRef<HTMLOListElement>(null);
  const stripLock = useRef(0);

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

  // Keep the mobile strip centred on the active step as the page scrolls.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !strip.offsetParent) return;
    const card = strip.children[active] as HTMLElement | undefined;
    if (!card) return;
    const target = card.offsetLeft - (strip.clientWidth - card.clientWidth) / 2;
    if (Math.abs(strip.scrollLeft - target) < 4) return;
    stripLock.current = performance.now();
    strip.scrollTo({ left: target, behavior: 'smooth' });
  }, [active]);

  // When the user swipes the strip, follow with the page.
  const onStripScroll = useCallback(() => {
    const strip = stripRef.current;
    if (!strip || performance.now() - stripLock.current < 700) return;
    const centre = strip.scrollLeft + strip.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(strip.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - centre);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (nearest !== active) {
      stripLock.current = performance.now();
      jumpTo(nearest);
    }
  }, [active, jumpTo]);

  const highlight = steps[active].part;
  const started = progress > 0.03;

  return (
    <section ref={ref} className="relative h-[320vh] bg-surface" aria-label="Anatomy of a hygienic joint">
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden">
        <div className="grid-paper absolute inset-0 opacity-60 [mask-image:radial-gradient(80%_70%_at_30%_50%,black,transparent)]" aria-hidden="true" />

        <div className="container relative flex min-h-0 flex-1 flex-col py-4 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-0">
          {/* Heading */}
          <p className="eyebrow mb-2 flex items-center gap-3 lg:absolute lg:left-0 lg:top-10 lg:mb-0 lg:px-10">
            <span className="text-primary">02</span>
            <span className="h-px w-6 bg-border" />
            <span>Anatomy of a hygienic joint</span>
          </p>

          {/* Visual: width capped by viewport height so it always fits above the steps */}
          <div className="relative mx-auto w-full max-w-[min(560px,62svh)] lg:col-span-7 lg:max-w-none">
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
            <div
              className={cn(
                'pointer-events-none absolute left-1/2 top-2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-primary/30 bg-card/85 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-primary backdrop-blur transition-all duration-500',
                started ? '-translate-y-2 opacity-0' : 'opacity-100',
              )}
              aria-hidden="true"
            >
              <MousePointer2 className="h-3.5 w-3.5" />
              Scroll to assemble
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </div>
          </div>

          {/* Progress rail */}
          <div className="mx-auto mt-1 flex w-full max-w-[560px] items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:col-span-7 lg:max-w-none">
            <span>Exploded</span>
            <span className="relative h-px flex-1 bg-border">
              <span className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${Math.min(100, Math.max(0, (progress / 0.76) * 100))}%` }} />
              {BANDS.map((b) => (
                <span key={b} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-border" style={{ left: `${(b / 0.76) * 100}%` }} />
              ))}
            </span>
            <span>Assembled</span>
          </div>

          {/* Steps: accordion on desktop */}
          <ol className="hidden space-y-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:block" aria-label="Assembly steps">
            {steps.map((s, i) => (
              <li key={s.label}>
                <StepCard step={s} index={i} active={i === active} done={i < active} onSelect={() => jumpTo(i)} />
              </li>
            ))}
          </ol>

          {/* Steps: swipeable strip on phones */}
          <div className="relative mt-3 min-h-0 lg:hidden">
            <ol
              ref={stripRef}
              onScroll={onStripScroll}
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1"
              aria-label="Assembly steps"
            >
              {steps.map((s, i) => (
                <li key={s.label} className="w-[82%] shrink-0 snap-center sm:w-[70%]">
                  <StripCard step={s} index={i} active={i === active} onSelect={() => jumpTo(i)} />
                </li>
              ))}
            </ol>
            <div className="mt-2 flex items-center justify-center gap-1.5" aria-hidden="true">
              {steps.map((s, i) => (
                <span
                  key={s.label}
                  className={cn('h-1 rounded-full transition-all duration-300', i === active ? 'w-6 bg-primary' : 'w-1.5 bg-border')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  step: Step;
  index: number;
  active: boolean;
  done?: boolean;
  onSelect: () => void;
}

function StepCard({ step, index, active, done, onSelect }: CardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'group w-full rounded-lg border text-left transition-[background-color,border-color,box-shadow,transform] duration-500 [transition-timing-function:var(--ease-out-expo)]',
        active
          ? 'border-primary/50 bg-card shadow-[0_18px_40px_-28px_hsl(var(--primary)/0.5)] translate-x-1'
          : 'border-border/70 bg-transparent hover:border-primary/30 hover:bg-card/60',
      )}
    >
      <div className="flex items-center gap-4 px-5 py-3">
        <Badge index={index} active={active} done={done} />
        <div className="min-w-0 flex-1">
          <p className={cn('eyebrow transition-colors', active && 'text-primary')}>{step.label}</p>
          <h3 className={cn('truncate text-lg font-semibold tracking-tight transition-colors duration-500', active ? 'text-foreground' : 'text-foreground/60 group-hover:text-foreground/85')}>
            {step.title}
          </h3>
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]', active && 'rotate-180 text-primary')} />
      </div>
      {/* grid-rows accordion; min-h-0 on the inner row is required for WebKit to collapse to 0fr */}
      <div className={cn('grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:var(--ease-out-expo)]', active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="min-h-0 overflow-hidden">
          <p className="px-5 pb-4 pl-[4rem] text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
      </div>
    </button>
  );
}

function StripCard({ step, index, active, onSelect }: CardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'step' : undefined}
      className={cn(
        'flex h-full w-full flex-col rounded-lg border bg-card p-4 text-left transition-[border-color,box-shadow,opacity] duration-500',
        active ? 'border-primary/50 shadow-[0_18px_40px_-28px_hsl(var(--primary)/0.5)]' : 'border-border/70 opacity-70',
      )}
    >
      <div className="flex items-center gap-3">
        <Badge index={index} active={active} />
        <div className="min-w-0">
          <p className={cn('eyebrow', active && 'text-primary')}>{step.label}</p>
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">{step.title}</h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>
    </button>
  );
}

function Badge({ index, active, done }: { index: number; active: boolean; done?: boolean }) {
  return (
    <span
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] transition-colors duration-500',
        active ? 'border-primary bg-primary text-primary-foreground' : done ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground',
      )}
    >
      0{index + 1}
    </span>
  );
}
