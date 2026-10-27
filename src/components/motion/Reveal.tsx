import { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'clip' | 'none';

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** Delay in ms before this element animates. */
  delay?: number;
  /** Element tag to render. */
  as?: ElementType;
  /** When true, children with `.reveal-child` stagger via --i. */
  stagger?: boolean;
  threshold?: number;
  once?: boolean;
  style?: CSSProperties;
  id?: string;
}

const variantClass: Record<Variant, string> = {
  up: 'reveal',
  left: 'reveal reveal-left',
  right: 'reveal reveal-right',
  scale: 'reveal reveal-scale',
  clip: 'reveal reveal-clip',
  none: '',
};

/** Wrapper that fades/slides children in when scrolled into view. */
export function Reveal({
  children,
  className,
  variant = 'up',
  delay = 0,
  as: Tag = 'div',
  threshold,
  once,
  style,
  id,
}: RevealProps) {
  const ref = useReveal<HTMLElement>({ threshold, once });
  const Comp = Tag as ElementType;
  return (
    <Comp
      ref={ref}
      id={id}
      className={cn(variantClass[variant], className)}
      style={{ ...style, ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

/** Child of a stagger group. Set `index` to control order. */
export function RevealItem({
  children,
  index = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: ElementType;
}) {
  const Comp = Tag as ElementType;
  return (
    <Comp className={cn('reveal-child', className)} style={{ ['--i' as string]: index }}>
      {children}
    </Comp>
  );
}
