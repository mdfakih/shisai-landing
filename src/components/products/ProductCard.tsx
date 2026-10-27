import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  index: number;
  onOpen: () => void;
}

export function ProductCard({ product, index, onOpen }: ProductCardProps) {
  const cover = product.images[0];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="sheen group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.45)] focus-visible:border-primary"
    >
      <div className="relative aspect-square overflow-hidden plate">
        <div className="grid-paper absolute inset-0 opacity-50" aria-hidden="true" />
        <img
          src={cover}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={560}
          height={560}
          className="relative h-full w-full object-contain p-5 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {String(index + 1).padStart(2, '0')}
        </span>
        {product.images.length > 1 && (
          <span className="absolute right-3 top-3 rounded border border-border bg-card/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-foreground/70">
            {product.images.length} views
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground">
            {product.name}
          </h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]">
          <dt className="text-muted-foreground">Size</dt>
          <dd className="text-right text-foreground/85">{product.sizes}</dd>
          <dt className="text-muted-foreground">Grade</dt>
          <dd className="text-right text-foreground/85">{product.grades}</dd>
          <dt className="text-muted-foreground">Finish</dt>
          <dd className="text-right text-foreground/85">{product.finish}</dd>
        </dl>
      </div>
    </button>
  );
}
