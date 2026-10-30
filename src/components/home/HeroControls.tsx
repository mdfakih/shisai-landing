import { KeyboardEvent, ReactNode, useRef } from 'react';
import { Expand, RotateCcw, Shrink, Slice, Sparkles } from 'lucide-react';
import type { ExhibitId } from '@/lib/gl/exhibit';
import { cn } from '@/lib/utils';
import { HeroPart, heroParts, tabId, VIEWER_ID } from './heroParts';

/* ---------- Part picker ---------- */

const glyphs: Record<ExhibitId, ReactNode> = {
  joint: <path d="M2 9h6M2 15h6M16 9h6M16 15h6M8 5.5h8v13H8z" />,
  bend: <path d="M4 21v-7a10 10 0 0 1 10-10h7M10 21v-7a4 4 0 0 1 4-4h7" />,
  tee: <path d="M2 12h7V3h6v9h7M2 19h20M2 12v7M22 12v7" />,
  reducer: <path d="M2 5h6l8 4.5h6M2 19h6l8-4.5h6M2 5v14M22 9.5v5" />,
};

function PartGlyph({ id }: { id: ExhibitId }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      {glyphs[id]}
    </svg>
  );
}

interface PartTabsProps {
  selected: ExhibitId;
  onSelect: (id: ExhibitId) => void;
  /** Warm the fittings module before the first click. */
  onIntent?: () => void;
  className?: string;
}

/** Segmented tabs with a sliding thumb. Arrow keys move between parts. */
export function PartTabs({ selected, onSelect, onIntent, className }: PartTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, heroParts.findIndex((p) => p.id === selected));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    const jump = e.key === 'Home' ? 0 : e.key === 'End' ? heroParts.length - 1 : null;
    if (!step && jump === null) return;
    e.preventDefault();
    const next = jump ?? (index + step + heroParts.length) % heroParts.length;
    onSelect(heroParts[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Choose a part to inspect"
      onKeyDown={onKeyDown}
      onPointerEnter={onIntent}
      onFocus={onIntent}
      onTouchStart={onIntent}
      className={cn(
        'relative grid grid-cols-4 rounded-full border border-border bg-card/80 p-1 shadow-[0_8px_24px_-18px_hsl(var(--primary)/0.6)] backdrop-blur',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="btn-primary absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/4)] rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {heroParts.map((p, i) => {
        const active = p.id === selected;
        return (
          <button
            key={p.id}
            ref={(el) => (refs.current[i] = el)}
            id={tabId(p.id)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={VIEWER_ID}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(p.id)}
            className={cn(
              'relative z-10 flex h-9 items-center justify-center gap-1.5 rounded-full px-2 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 sm:px-3 sm:text-[11px]',
              active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <PartGlyph id={p.id} />
            {p.tab}
            <span className="sr-only">, {p.spoken}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- View dock ---------- */

interface DockButtonProps {
  pressed?: boolean;
  /** Visible text, also the accessible name. */
  text?: string;
  /** Accessible name for an icon-only button. */
  label?: string;
  icon: ReactNode;
  onClick: () => void;
}

function DockButton({ pressed, label, text, icon, onClick }: DockButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={text ? undefined : label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        text ? 'px-3.5' : 'w-9',
        pressed
          ? 'bg-primary text-primary-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.2)]'
          : 'text-foreground/75 hover:bg-primary/10 hover:text-foreground',
      )}
    >
      {icon}
      {text}
    </button>
  );
}

interface ViewDockProps {
  part: HeroPart;
  exploded: boolean;
  section: boolean;
  matt: boolean;
  onExplode: () => void;
  onSection: () => void;
  onFinish: () => void;
  onReset: () => void;
  className?: string;
}

const icon = 'h-3.5 w-3.5';

/** Viewport toolbar, like a CAD viewer's: explode, section, finish, reset. */
export function ViewDock({ part, exploded, section, matt, onExplode, onSection, onFinish, onReset, className }: ViewDockProps) {
  return (
    <div
      role="group"
      aria-label="View options"
      aria-controls={VIEWER_ID}
      className={cn('inline-flex items-center gap-0.5 rounded-full border border-border bg-card/80 p-1 backdrop-blur', className)}
    >
      {part.explodable && (
        <DockButton
          pressed={exploded}
          text="Explode"
          icon={exploded ? <Shrink className={icon} /> : <Expand className={icon} />}
          onClick={onExplode}
        />
      )}
      <DockButton pressed={section} text="Section" icon={<Slice className={icon} />} onClick={onSection} />
      <DockButton pressed={matt} text="Matt" icon={<Sparkles className={icon} />} onClick={onFinish} />
      <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
      <DockButton label="Reset view" icon={<RotateCcw className={icon} />} onClick={onReset} />
    </div>
  );
}
