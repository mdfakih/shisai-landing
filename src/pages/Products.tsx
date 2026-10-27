import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/layout/PageIntro';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductDialog } from '@/components/products/ProductDialog';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { capabilities } from '@/data/company';
import { findCategory, productCategories } from '@/data/products';
import { cn } from '@/lib/utils';

interface Selection {
  categoryId: string;
  index: number;
}

const categoryIds = productCategories.map((c) => c.id);

const Products = () => {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(categoryIds);

  const selectedCategory = useMemo(
    () => findCategory(selection?.categoryId) ?? null,
    [selection?.categoryId],
  );

  const openProduct = useCallback((categoryId: string, index: number) => {
    setSelection({ categoryId, index });
    setOpen(true);
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (!selection || !selectedCategory) return;
      const n = selectedCategory.products.length;
      setSelection({ ...selection, index: (selection.index + delta + n) % n });
    },
    [selection, selectedCategory],
  );

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <>
      <PageIntro
        index="02"
        eyebrow="Catalogue"
        title={
          <>
            Hygienic fittings,
            <br className="hidden sm:block" />{' '}
            <span className="metal-text">family by family.</span>
          </>
        }
        lead="Six families, forty-plus variants. Standard sanitary dimensions, three stainless grades, your choice of finish. Anything not listed is made to drawing."
        aside={
          <dl className="grid w-full grid-cols-[auto_1fr] gap-x-5 gap-y-2 rounded-lg border border-border bg-card/80 p-5 font-mono text-[11px] uppercase tracking-[0.14em] backdrop-blur md:min-w-[280px]">
            <dt className="text-muted-foreground">Grades</dt>
            <dd className="text-right text-foreground">{capabilities.grades.join(' / ')}</dd>
            <dt className="text-muted-foreground">Finish</dt>
            <dd className="text-right text-foreground">{capabilities.finishes.join(' · ')}</dd>
            <dt className="text-muted-foreground">Sizes</dt>
            <dd className="text-right text-foreground">{capabilities.sizeRange}</dd>
            <dt className="text-muted-foreground">Custom</dt>
            <dd className="text-right text-foreground">To drawing</dd>
          </dl>
        }
      />

      {/* Sticky category rail */}
      <div className="sticky top-[var(--nav-h)] z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container">
          <nav className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 py-2 md:mx-0 md:px-0" aria-label="Product families">
            {productCategories.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => jump(c.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-colors',
                  active === c.id ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-surface hover:text-foreground',
                )}
                aria-current={active === c.id ? 'true' : undefined}
              >
                <span className={cn('font-mono text-[10px]', active === c.id ? 'text-white/70' : 'text-muted-foreground')}>
                  0{i + 1}
                </span>
                {c.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container">
        {productCategories.map((cat, ci) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-28 border-b border-border py-14 last:border-b-0 md:py-20">
            <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="eyebrow mb-3 flex items-center gap-3">
                  <span className="text-primary">0{ci + 1}</span>
                  <span className="h-px w-6 bg-border" />
                  <span>{cat.products.length} variants</span>
                </p>
                <h2 className="display-md text-foreground">{cat.name}</h2>
                <p className="mt-3 max-w-xl text-muted-foreground">{cat.description}.</p>
              </div>
              <div className="flex flex-wrap gap-2 md:col-span-5 md:justify-end">
                <span className="rounded border border-border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground/75">
                  Sizes {cat.sizeRange}
                </span>
                <span className="rounded border border-border px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground/75">
                  {cat.products[0].grades}
                </span>
              </div>
            </Reveal>

            <Reveal threshold={0.03} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {cat.products.map((p, i) => (
                <RevealItem key={p.name} index={i % 4}>
                  <ProductCard product={p} index={i} onOpen={() => openProduct(cat.id, i)} />
                </RevealItem>
              ))}
            </Reveal>
          </section>
        ))}
      </div>

      <ProductDialog
        category={selectedCategory}
        index={selection?.index ?? 0}
        open={open}
        onOpenChange={setOpen}
        onStep={step}
      />

      {/* Custom CTA */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container">
          <Reveal className="corner-marks grid gap-8 px-6 py-10 md:grid-cols-12 md:items-center md:px-10">
            <div className="md:col-span-8">
              <p className="eyebrow mb-3">Not in the list?</p>
              <h2 className="display-md text-foreground">Custom ferrules, spools and manifolds, made from your drawing.</h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Send a dimensioned sketch, a sample photo, or the mating part number. We confirm feasibility and quote within one working day.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:col-span-4 md:flex-col">
              <WhatsAppButton message="Hello Shisai, I need a custom fitting. Sharing a drawing:" />
              <Link
                to="/contact?subject=custom"
                className="group inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Use the enquiry form
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Products;
