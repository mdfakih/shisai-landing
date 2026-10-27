import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company, whatsappLink } from '@/data/company';
import { cn } from '@/lib/utils';

const base =
  'group inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none';

interface BtnProps {
  className?: string;
  children?: React.ReactNode;
}

export function PrimaryLink({
  to,
  className,
  children,
}: BtnProps & { to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        'sheen bg-primary text-primary-foreground shadow-[0_8px_24px_-10px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-[0_14px_30px_-10px_hsl(var(--primary)/0.6)]',
        className,
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function GhostLink({ to, className, children }: BtnProps & { to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        'border border-border bg-card/70 text-foreground backdrop-blur hover:border-primary/40 hover:bg-card',
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function WhatsAppButton({
  message,
  className,
  children = 'WhatsApp us',
  variant = 'solid',
}: BtnProps & { message?: string; variant?: 'solid' | 'outline' }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        variant === 'solid'
          ? 'bg-[#25D366] text-white hover:-translate-y-0.5 hover:brightness-95'
          : 'border border-white/25 text-white hover:bg-white/10',
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" />
      {children}
    </a>
  );
}

export function CallButton({ className, variant = 'outline' }: BtnProps & { variant?: 'solid' | 'outline' }) {
  return (
    <a
      href={`tel:${company.phone.e164}`}
      className={cn(
        base,
        variant === 'solid'
          ? 'bg-white text-primary hover:-translate-y-0.5'
          : 'border border-white/25 text-white hover:bg-white/10',
        className,
      )}
    >
      <Phone className="h-4 w-4" />
      {company.phone.display}
    </a>
  );
}
