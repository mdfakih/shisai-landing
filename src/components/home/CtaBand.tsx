import { Mail } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { CallButton, WhatsAppButton } from '@/components/shared/CtaButtons';
import { company } from '@/data/company';

export function CtaBand() {
  return (
    <section className="navy-surface relative overflow-hidden py-20 text-white md:py-28">
      {/* brushed steel diagonal */}
      <div
        className="metal-surface pointer-events-none absolute -right-24 -top-24 h-[140%] w-[38%] rotate-[14deg] opacity-[0.16] [mask-image:linear-gradient(90deg,transparent,black_30%)]"
        aria-hidden="true"
      />
      <div className="container relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8">
          <p className="eyebrow mb-4 text-white/60">06 · Start an enquiry</p>
          <h2 className="display-lg text-white">
            Send us the drawing.
            <br />
            <span className="text-white/60">We quote within one working day.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Share sizes, grade, finish and quantity. For non-standard ferrules or manifolds,
            a sketch or a photo on WhatsApp is enough to begin.
          </p>
        </Reveal>
        <Reveal delay={150} className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
          <WhatsAppButton message="Hello Shisai, I would like a quotation. Sizes / grade / finish / qty:" />
          <a
            href={`mailto:${company.emails[0]}?subject=${encodeURIComponent('Quotation request')}`}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Mail className="h-4 w-4" />
            Email a drawing
          </a>
          <CallButton />
        </Reveal>
      </div>
    </section>
  );
}
