import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { productCategories } from '@/data/products';
import { cn, lowFetchPriority } from '@/lib/utils';

/** Six families in a bento layout; the first gets the hero slot. */
export function ProductFamilies() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Product families"
            title="Everything between two tube ends."
            lead="Forty-plus variants across six families, all interchangeable with standard sanitary dimensions."
          />
          <Reveal delay={150} className="shrink-0">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-semibold text-primary"
            >
              Full catalogue
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal threshold={0.05} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {productCategories.map((cat, i) => {
            const feature = i === 0;
            const cover = cat.products[0].images[0];
            return (
              <RevealItem
                key={cat.id}
                index={i}
                className={cn(feature && 'sm:col-span-2 lg:row-span-2')}
              >
                <Link
                  to={`/products#${cat.id}`}
                  className={cn(
                    'sheen group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.45)]',
                  )}
                >
                  <div
                    className={cn(
                      'relative overflow-hidden plate',
                      feature ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]',
                    )}
                  >
                    <div className="grid-paper absolute inset-0 opacity-50" aria-hidden="true" />
                    <img
                      src={cover}
                      alt={cat.name}
                      loading="lazy"
                      {...lowFetchPriority}
                      decoding="async"
                      width={560}
                      height={560}
                      className="relative h-full w-full object-contain p-6 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] sm:p-8"
                    />
                    <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      0{i + 1}
                    </span>
                    <span className="absolute right-4 top-4 rounded border border-border bg-card/80 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-foreground/70 backdrop-blur">
                      {cat.sizeRange}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-t border-border p-5">
                    <div>
                      <h3 className={cn('font-semibold tracking-tight text-foreground', feature ? 'text-2xl' : 'text-lg')}>
                        {cat.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cat.blurb}</p>
                      <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                        {cat.products.length} variants
                      </p>
                    </div>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
