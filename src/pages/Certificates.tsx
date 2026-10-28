import { useState } from 'react';
import { Download, ExternalLink, FileCheck2, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageIntro } from '@/components/layout/PageIntro';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { Certificate, certificates, company } from '@/data/company';

/** Page-one renders made by scripts/render-certificates.mjs. */
const preview = (id: string, size: 'card' | 'full') => `/certificates/previews/${id}-${size}.webp`;

const documentation = [
  ['Material test certificate', 'Grade and heat number for the raw material, on request with the order.'],
  ['Dimensional report', 'Key dimensions against the agreed standard, for critical items.'],
  ['Surface finish', 'Matt or mirror finish declared per item; Ra values on request.'],
  ['Laser marking', 'Grade and lot marking on request for traceability through the line.'],
];

const Certificates = () => {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <>
      <PageIntro
        index="04"
        eyebrow="Quality & compliance"
        title={
          <>
            Public documents,
            <br className="hidden sm:block" />{' '}
            <span className="metal-text">open to inspection.</span>
          </>
        }
        lead="Registrations, the ZED assessment and our Tri Clover® trademark, shown as issued. Tap any document to read it; download the original PDF when you need it on file."
      />

      <section className="py-12 md:py-24">
        <div className="container">
          <Reveal threshold={0.05} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c, i) => (
              <RevealItem key={c.id} index={i}>
                <article
                  id={c.id}
                  className="group flex h-full scroll-mt-28 flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.45)]"
                >
                  {/* Document peek: top of page one, fixed height so no engine can inflate it */}
                  <button
                    type="button"
                    onClick={() => setOpen(c)}
                    className="relative block h-52 w-full overflow-hidden border-b border-border bg-surface text-left sm:h-56"
                    aria-label={`Read ${c.title}`}
                  >
                    <img
                      src={preview(c.id, 'card')}
                      alt={`${c.title}, page one`}
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={905}
                      className="absolute inset-x-6 top-5 mx-auto w-[calc(100%-3rem)] rounded-t-sm object-cover object-top shadow-[0_18px_40px_-20px_rgba(20,25,60,0.45)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
                    />
                    <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Doc 0{i + 1} · PDF
                    </span>
                    <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
                  </button>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <FileCheck2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground">{c.title}</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">{c.issuer}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                    <div className="mt-auto flex gap-2 pt-5">
                      <button
                        type="button"
                        onClick={() => setOpen(c)}
                        className="btn btn-primary h-10 flex-1 text-sm"
                      >
                        <ZoomIn className="h-4 w-4" /> Read
                      </button>
                      <a
                        href={c.file}
                        download
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        aria-label={`Download ${c.title} as PDF`}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}

            <RevealItem index={certificates.length}>
              <div className="navy-surface flex h-full min-h-[260px] flex-col justify-between rounded-lg p-6 text-white">
                <div>
                  <p className="eyebrow text-white/60">Verification</p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">Need a copy on letterhead, or a specific MTC?</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Tell us the order or product and we will send the matching documents. GSTIN {company.gst}.
                  </p>
                </div>
                <WhatsAppButton variant="outline" className="mt-6" message="Hello Shisai, please share documentation for:">
                  Request documents
                </WhatsAppButton>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-14 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading index="02" eyebrow="With every order" title="Documentation we provide on request." />
          </div>
          <Reveal threshold={0.05} className="lg:col-span-8">
            <div className="border-b border-border">
              {documentation.map(([t, d], i) => (
                <RevealItem key={t} index={i} className="grid gap-2 border-t border-border py-5 sm:grid-cols-[4rem_1fr_2fr] sm:gap-6">
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <h3 className="text-base font-semibold tracking-tight text-foreground">{t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reader: the rendered page as an image, so it works on every device */}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col gap-0 rounded-none p-0 sm:h-[92vh] sm:w-[calc(100vw-2rem)] sm:max-w-3xl sm:rounded-lg [&>button]:z-20 [&>button]:h-9 [&>button]:w-9 [&>button]:rounded-full [&>button]:bg-card/90 [&>button]:opacity-100 [&>button]:shadow-sm">
          <DialogHeader className="border-b border-border px-5 py-4 pr-16 text-left">
            <DialogTitle className="text-base font-semibold tracking-tight sm:text-lg">{open?.title}</DialogTitle>
            <DialogDescription className="text-xs">{open?.issuer}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto bg-surface p-3 sm:p-6">
            {open && (
              <img
                src={preview(open.id, 'full')}
                alt={`${open.title}, page one`}
                decoding="async"
                width={1400}
                height={1981}
                className="mx-auto h-auto w-full max-w-[820px] rounded-sm bg-white shadow-[0_24px_60px_-30px_rgba(20,25,60,0.5)]"
              />
            )}
            <p className="mx-auto mt-3 max-w-[820px] text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Page 1 · open the PDF for all pages
            </p>
          </div>
          {open && (
            <div className="flex justify-end gap-2 border-t border-border px-4 py-3 sm:px-6">
              <a
                href={open.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:border-primary/40 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" /> Open PDF
              </a>
              <a
                href={open.file}
                download
                className="btn btn-primary h-10 px-4 text-sm"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Certificates;
