import { useState } from 'react';
import { Cpu, Flame, Gauge, Hand, Layers, RotateCw, ScanLine, Scissors, Sparkles } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PageIntro } from '@/components/layout/PageIntro';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { PrimaryLink } from '@/components/shared/CtaButtons';
import { PhotoBackdrop } from '@/components/shared/PhotoBackdrop';
import { brands, company, machinery } from '@/data/company';
import { cn } from '@/lib/utils';

import teamImg from '@/assets/aboutUs/wirn13mf-1000x1000.webp';
import pressImg from '@/assets/aboutUs/119264350-location-1650277650595-500x500-photoutils-com--1000x1000.webp';
import certImg from '@/assets/aboutUs/screenshot-2024-03-04-133102-1000x1000.webp';
import regImg from '@/assets/aboutUs/3-1000x1000.webp';
import storeImg from '@/assets/aboutUs/119264350-location-1650277598370-500x500-photoutils-com--1000x1000.webp';
import mfgImg from '@/assets/aboutUs/119264350-location-1653469114346-500x500-photoutils-com--1000x1000.webp';
import loc1 from '@/assets/aboutUs/119264350-location-1653469118790-1000x1000.webp';
import loc2 from '@/assets/aboutUs/119264350-location-1653469114346-1000x1000.webp';
import loc3 from '@/assets/aboutUs/119264350-location-1655279259456-1000x1000.webp';

const album = [
  { src: pressImg, alt: 'Power press line', tall: true },
  { src: teamImg, alt: 'Shisai team at an industry exhibition' },
  { src: mfgImg, alt: 'Manufacturing bay' },
  { src: storeImg, alt: 'Finished goods store', tall: true },
  { src: loc1, alt: 'Works, Vasai East' },
  { src: certImg, alt: 'Certifications on display' },
  { src: loc2, alt: 'Machining section' },
  { src: regImg, alt: 'Certificate of registration' },
  { src: loc3, alt: 'Company premises' },
];

/** One icon per brochure machine, in list order. */
const machineIcons = [Cpu, Layers, Gauge, RotateCw, Flame, Sparkles, ScanLine, Scissors, Hand];

const facts = [
  ['Founded', String(company.foundedYear)],
  ['Location', 'Vasai East, Palghar, Maharashtra'],
  ['Nature of business', 'Manufacturer · Wholesaler · Trader'],
  ['Leadership', `${company.ceo}, CEO`],
  ['GSTIN', company.gst],
  ['Brands', brands.join(' · ')],
];

const values = [
  ['Precision', 'Dimensions held to standard sanitary geometry so parts interchange without rework.'],
  ['Finish', 'In-house polishing to matt or mirror, because surface is the hygiene spec.'],
  ['Traceability', 'Grade and heat details marked and documented on request.'],
  ['Responsiveness', 'Quotes within one working day; custom parts from a sketch.'],
];

const About = () => {
  const [lightbox, setLightbox] = useState<(typeof album)[number] | null>(null);

  return (
    <>
      <PageIntro
        index="03"
        eyebrow="Company"
        title={
          <>
            A works in Vasai,
            <br className="hidden sm:block" />{' '}
            built around <span className="metal-text">one joint.</span>
          </>
        }
        lead={`Since ${company.foundedYear}, Shisai Steel Industries has manufactured hygienic stainless steel fittings for process lines across India. One product family, done thoroughly.`}
        aside={
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card/80 px-4 py-3 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0ZM6.4 12l-4-4 1.13-1.13L6.4 9.74l6.07-6.07L13.6 4.8Z" fill="currentColor" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">GST verified</p>
              <p className="font-mono text-[11px] tracking-wider text-muted-foreground">{company.gst}</p>
            </div>
          </div>
        }
      />

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal variant="clip" className="aspect-[4/3] lg:col-span-6">
            <div className="duotone h-full w-full rounded-lg">
              <img src={teamImg} alt="Shisai Steel Industries team at an exhibition" loading="lazy" decoding="async" width={960} height={430} className="h-full w-full object-cover" />
            </div>
            <span className="corner-marks pointer-events-none absolute -inset-3" aria-hidden="true" />
            <p className="absolute bottom-4 left-4 z-[1] font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80">Industry exhibition · 2025</p>
          </Reveal>
          <div className="lg:col-span-6 lg:pl-6">
            <SectionHeading
              index="01"
              eyebrow="Who we are"
              title="Manufacturer first. Everything else follows."
            />
            <Reveal delay={120} className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              <p>
                Established in {company.foundedYear} at Vasai, Shisai Steel Industries manufactures, wholesales and trades stainless steel bends, Tri Clover® clamps, pipe holding clamps, elbows, cross tees and the ferrules that join them.
              </p>
              <p>
                Over the years we have built a customer base through a network of branches across India and a simple commitment: precision-engineered fittings that meet global sanitary standards for pharmaceutical, food and beverage, dairy and biotechnology lines.
              </p>
              <p>
                Under the guidance of {company.ceo}, CEO, whose long experience in the industry shapes how we read a customer's requirement, the company continues to grow at a notable rate.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Facts */}
      <section className="border-y border-border bg-surface py-16 md:py-20">
        <div className="container">
          <Reveal threshold={0.1} className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map(([k, v], i) => (
              <RevealItem key={k} index={i} className="border-t border-border pt-4">
                <p className="eyebrow">{k}</p>
                <p className="mt-2 text-base font-semibold tracking-tight text-foreground">{v}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading index="02" eyebrow="How we work" title="Four things we do not compromise." />
          </div>
          <Reveal threshold={0.05} className="lg:col-span-8">
            <div className="border-b border-border">
              {values.map(([t, d], i) => (
                <RevealItem key={t} index={i} className="grid gap-2 border-t border-border py-6 sm:grid-cols-[4rem_1fr_2fr] sm:gap-6">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">{t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Machinery */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container">
          <SectionHeading
            index="03"
            eyebrow="Plant & machinery"
            title="The floor that makes the parts."
            lead="Pressing, turning, welding, polishing and marking in one unit, so lead times and tolerances stay in our hands."
          />
          <Reveal threshold={0.1} className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {machinery.map((m, i) => {
              const Icon = machineIcons[i] ?? Cpu;
              return (
                <RevealItem
                  key={m.name}
                  index={i}
                  className="corner-marks group flex flex-col bg-card p-5 transition-colors hover:bg-primary/[0.03] sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/[0.08] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.purpose}</p>
                  <p className="mt-4 border-t border-border pt-3 text-[13px] leading-snug text-foreground/80">
                    <span className="eyebrow mr-2 text-primary">Why</span>
                    {m.benefit}
                  </p>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Album */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading index="04" eyebrow="On the floor" title="Inside the works." />
          <Reveal threshold={0.05} className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" style={{ gridAutoRows: '160px' }}>
            {album.map((img, i) => (
              <RevealItem key={img.src} index={i} className={cn(img.tall && 'row-span-2')}>
                <button
                  type="button"
                  onClick={() => setLightbox(img)}
                  className="duotone group h-full w-full rounded-lg text-left focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Open photo: ${img.alt}`}
                >
                  <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 left-3 z-10 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85 opacity-0 transition-opacity group-hover:opacity-100">
                    {img.alt}
                  </span>
                </button>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="navy-surface relative overflow-hidden py-20 text-white md:py-28">
        <PhotoBackdrop src={loc3} />
        <div className="container relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeading
              tone="dark"
              index="05"
              eyebrow="Where we are going"
              title="The preferred partner for hygienic stainless solutions, worldwide."
              lead="We are expanding our product portfolio, strengthening partnerships with industry leaders, and investing in technology, sustainable practice and skills, so that the next decade of process lines can rely on us the way the last one did."
            />
          </div>
          <Reveal delay={150} className="lg:col-span-4 lg:justify-self-end">
            <PrimaryLink to="/contact" className="bg-white text-primary hover:bg-white/90 hover:text-primary-deep">
              Work with us
            </PrimaryLink>
          </Reveal>
        </div>
      </section>

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none [&>button]:bg-white/90 [&>button]:text-foreground [&>button]:opacity-100">
          {lightbox && (
            <figure>
              <img src={lightbox.src} alt={lightbox.alt} className="max-h-[85vh] w-full rounded-lg object-contain" />
              <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white/80">{lightbox.alt}</figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default About;
