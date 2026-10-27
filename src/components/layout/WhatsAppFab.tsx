import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/data/company';

/** Floating WhatsApp entry point. Indian B2B buyers expect this. */
const WhatsAppFab = () => (
  <a
    href={whatsappLink('Hello Shisai Steel, I have an enquiry about your fittings.')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105 sm:bottom-6 sm:right-6"
  >
    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" aria-hidden="true" />
    <MessageCircle className="relative h-5 w-5" />
  </a>
);

export default WhatsAppFab;
