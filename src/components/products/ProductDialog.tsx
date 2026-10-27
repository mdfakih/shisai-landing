import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCarousel from '@/components/ImageCarousel';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { ProductCategory } from '@/data/products';

interface ProductDialogProps {
  category: ProductCategory | null;
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStep: (delta: number) => void;
}

export function ProductDialog({ category, index, open, onOpenChange, onStep }: ProductDialogProps) {
  const product = category?.products[index];
  if (!category || !product) return null;
  const count = category.products.length;
  const quoteMsg = `Hello Shisai, please quote: ${product.name} (${category.name}). Size / grade / finish / qty:`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-4xl overflow-y-auto rounded-lg p-0 sm:w-full">
        <div className="grid md:grid-cols-2">
          <div className="border-b border-border bg-surface p-5 md:border-b-0 md:border-r md:p-7">
            <ImageCarousel images={product.images} productName={product.name} />
          </div>
          <div className="flex flex-col p-5 sm:p-7">
            <DialogHeader className="text-left">
              <p className="eyebrow mb-2">
                {category.name} · {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">{product.name}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </DialogDescription>
            </DialogHeader>

            <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
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

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
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
              <div className="mt-auto flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
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
