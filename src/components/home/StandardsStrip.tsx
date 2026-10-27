import { Marquee } from '@/components/shared/Marquee';
import { capabilities } from '@/data/company';

const items = [
  ...capabilities.standards,
  ...capabilities.grades,
  `Sizes ${capabilities.sizeRange}`,
  ...capabilities.finishes.map((f) => `${f} finish`),
  'Tri Clover® clamps',
  'Custom ferrules to drawing',
];

/** Slow mono ticker of grades, finishes and dimensional standards. */
export function StandardsStrip() {
  return (
    <div className="border-y border-border bg-surface">
      <Marquee
        items={items}
        duration={55}
        className="py-4 text-foreground/70 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
        itemClassName="font-mono text-[12px] uppercase tracking-[0.2em]"
      />
    </div>
  );
}
