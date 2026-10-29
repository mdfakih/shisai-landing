import { useEffect, useState } from 'react';
import { Box, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCarousel from '@/components/ImageCarousel';
import { ProductViewer3D } from '@/components/products/ProductViewer3D';
import { SwipeCoach, SwipeGlyph } from '@/components/products/SwipeHint';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { ProductCategory } from '@/data/products';
import { useCoarsePointer, useSwipeCoach } from '@/hooks/useSwipeCoach';
import { useSwipeNav } from '@/hooks/useSwipeNav';
import { cn } from '@/lib/utils';

interface ProductDialogProps {
  category: ProductCategory | null;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStep: (delta: number) => void;
}

type View = 'photo' | '3d';
const VIEWS: Array<{ id: View; label: string; Icon: typeof Box }> = [
  { id: 'photo', label: 'Photos', Icon: ImageIcon },
  { id: '3d', label: '3D model', Icon: Box },
];
const FRAME = 'aspect-auto h-[30dvh] min-h-[168px] sm:h-auto sm:aspect-square';
const STEP_BTN = 'group inline-flex h-11 items-center gap-2 rounded-full text-sm font-semibold text-foreground/80 transition-colors hover:text-primary';
const STEP_CHIP = 'flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-primary/40 group-hover:bg-primary/5';

/**
 * Product detail. On phones it is a full-height sheet: image capped to the
 * top of the screen, details below. The details panel follows the finger and
 * swipes between products; swiping past the last image does the same.
 */
export function ProductDialog({ category, index, open, onOpenChange, onStep }: ProductDialogProps) {
  const [dir, setDir] = useState<1 | -1>(1);
  const [view, setView] = useState<View>('photo');
  const count = category?.products.length ?? 0;
  const touch = useCoarsePointer();
  const coach = useSwipeCoach(open, count > 1);

  const step = (d: 1 | -1) => {
    if (count <= 1) return;
    setDir(d);
    onStep(d);
  };
  const swipe = useSwipeNav<HTMLDivElement>(step, count > 1);

  // Back to photos whenever the sheet is reopened.
  useEffect(() => {
    if (open) setView('photo');
  }, [open]);

  const product = category?.products[index];
  if (!category || !product) return null;
  const quoteMsg = `Hello Shisai, please quote: ${product.name} (${category.name}). Size / grade / finish / qty:`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Phone: full-height sheet. Desktop: centred card.
          'flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none p-0',
          'sm:h-auto sm:max-h-[92vh] sm:w-[calc(100vw-2rem)] sm:max-w-4xl sm:rounded-lg',
          '[&>button]:z-30 [&>button]:h-9 [&>button]:w-9 [&>button]:rounded-full [&>button]:bg-card/90 [&>button]:opacity-100 [&>button]:shadow-sm [&>button>svg]:mx-auto',
        )}
      >
        <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
          {/* Image */}
          <div className="border-b border-border bg-surface px-4 pb-2 pt-3 sm:p-6 md:border-b-0 md:border-r md:p-7">
            {view === 'photo' ? (
              <ImageCarousel key={product.name} images={product.images} productName={product.name} frameClassName={FRAME} onOverscroll={step} />
            ) : (
              <ProductViewer3D categoryId={category.id} productName={product.name} className={FRAME} />
            )}
            <div className="mt-2.5 flex justify-center gap-1 rounded-full border border-border bg-card/70 p-1 sm:mt-3" role="tablist" aria-label="Product view">
              {VIEWS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors',
                    view === id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Details: the whole panel is the swipe surface */}
          <div
            className="relative flex min-h-0 touch-pan-y flex-col"
            onTouchStart={(e) => {
              coach.dismiss();
              swipe.handlers.onTouchStart(e);
            }}
            onTouchMove={swipe.handlers.onTouchMove}
            onTouchEnd={swipe.handlers.onTouchEnd}
            onTouchCancel={swipe.handlers.onTouchCancel}
          >
            <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden p-4 sm:p-7">
              <div
                key={product.name}
                className={cn('animate-in fade-in-0 duration-300', dir === 1 ? 'slide-in-from-right-4' : 'slide-in-from-left-4')}
              >
                <div ref={swipe.target} className={cn(coach.show && 'animate-swipe-peek motion-reduce:animate-none')}>
                  <DialogHeader className="text-left">
                    <p className="eyebrow mb-2">
                      {category.name} · {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                    </p>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">{product.name}</DialogTitle>
                    <DialogDescription className="text-sm leading-relaxed text-muted-foreground">{product.description}</DialogDescription>
                  </DialogHeader>

                  <dl className="mt-4 divide-y divide-border border-y border-border text-sm sm:mt-5">
                    {[
                      ['Size range', product.sizes],
                      ['Grades', product.grades],
                      ['Finish', product.finish],
                      ['Family', category.name],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                        <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {/* Grid, not flex-1: flex-basis 0 in a column collapsed the h-12 buttons on phones. */}
                  <div className="mt-5 grid gap-2.5 sm:max-md:grid-cols-2">
                    <WhatsAppButton message={quoteMsg} className="w-full">
                      Quote on WhatsApp
                    </WhatsAppButton>
                    <Link
                      to={`/contact?subject=quote&product=${encodeURIComponent(product.name)}`}
                      className="btn btn-ghost h-12 w-full px-6 text-sm"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      Enquiry form
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {count > 1 && (
              <nav
                aria-label="Browse products"
                className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-border bg-card px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-5"
              >
                <button type="button" onClick={() => step(-1)} aria-label="Previous product" className={cn(STEP_BTN, 'justify-self-start pr-3')}>
                  <span className={STEP_CHIP}>
                    <ChevronLeft className="h-4 w-4" />
                  </span>
                  Prev
                </button>

                {touch ? (
                  <span className="flex flex-col items-center gap-0.5">
                    <SwipeGlyph />
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">Swipe</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    {category.products.map((p, i) => (
                      <span key={p.name} className={cn('h-1 rounded-full transition-all duration-300', i === index ? 'w-5 bg-primary' : 'w-1.5 bg-border')} />
                    ))}
                  </span>
                )}

                <button type="button" onClick={() => step(1)} aria-label="Next product" className={cn(STEP_BTN, 'justify-self-end pl-3')}>
                  Next
                  <span className={STEP_CHIP}>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              </nav>
            )}

            {coach.show && <SwipeCoach label={category.name} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
