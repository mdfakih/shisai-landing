import { useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCarousel from '@/components/ImageCarousel';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { ProductCategory } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductDialogProps {
  category: ProductCategory | null;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStep: (delta: number) => void;
}

const SWIPE_PX = 56;

/**
 * Product detail. On phones it is a full-height sheet: image capped to the
 * top 38% of the screen, details below. Swipe left/right anywhere in the
 * details (or past the last image) to move between products.
 */
export function ProductDialog({ category, index, open, onOpenChange, onStep }: ProductDialogProps) {
  const [dir, setDir] = useState<1 | -1>(1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const product = category?.products[index];
  if (!category || !product) return null;
  const count = category.products.length;
  const quoteMsg = `Hello Shisai, please quote: ${product.name} (${category.name}). Size / grade / finish / qty:`;

  const step = (d: 1 | -1) => {
    if (count <= 1) return;
    setDir(d);
    onStep(d);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const dx = s.x - e.changedTouches[0].clientX;
    const dy = s.y - e.changedTouches[0].clientY;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    step(dx > 0 ? 1 : -1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Phone: full-height sheet. Desktop: centred card.
          'flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none p-0',
          'sm:h-auto sm:max-h-[92vh] sm:w-[calc(100vw-2rem)] sm:max-w-4xl sm:rounded-lg',
          '[&>button]:z-20 [&>button]:h-9 [&>button]:w-9 [&>button]:rounded-full [&>button]:bg-card/90 [&>button]:opacity-100 [&>button]:shadow-sm [&>button>svg]:mx-auto',
        )}
      >
        <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] md:grid-cols-2 md:grid-rows-1">
          {/* Image */}
          <div className="border-b border-border bg-surface px-4 pb-2 pt-3 sm:p-6 md:border-b-0 md:border-r md:p-7">
            <ImageCarousel
              key={product.name}
              images={product.images}
              productName={product.name}
              frameClassName="aspect-auto h-[30dvh] min-h-[168px] sm:h-auto sm:aspect-square"
              onOverscroll={step}
            />
          </div>

          {/* Details */}
          <div
            key={product.name}
            className={cn(
              'flex min-h-0 flex-col overflow-y-auto p-4 sm:p-7',
              'animate-in fade-in-0 duration-300',
              dir === 1 ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
            )}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
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

            <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row">
              <WhatsAppButton message={quoteMsg} className="flex-1">
                Quote on WhatsApp
              </WhatsAppButton>
              <Link
                to={`/contact?subject=quote&product=${encodeURIComponent(product.name)}`}
                className="group inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Enquiry form
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {count > 1 && (
              <div className="mt-auto flex items-center justify-between pt-5">
                <button type="button" onClick={() => step(-1)} className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:hidden">Swipe</span>
                <button type="button" onClick={() => step(1)} className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
