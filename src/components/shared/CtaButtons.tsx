import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company, whatsappLink } from '@/data/company';
import { cn } from '@/lib/utils';

const base = 'btn group h-12 pl-6 pr-2.5 text-sm focus-visible:outline-none';

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
        'btn-primary sheen',
        className,
      )}
    >
      {children}
      <span className="btn-chip">
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function GhostLink({ to, className, children }: BtnProps & { to: string }) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        'btn-ghost',
        className,
      )}
    >
      {children}
      <span className="btn-chip">
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
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
          ? 'bg-[#25D366] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-12px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 hover:brightness-105'
          : 'border border-white/25 px-6 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10',
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
          ? 'bg-white px-6 text-primary hover:-translate-y-0.5'
          : 'border border-white/25 px-6 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10',
        className,
      )}
    >
      <Phone className="h-4 w-4" />
      {company.phone.display}
    </a>
  );
}
