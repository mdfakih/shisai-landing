import { useState } from 'react';
import { Download, ExternalLink, Eye, FileCheck2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageIntro } from '@/components/layout/PageIntro';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { WhatsAppButton } from '@/components/shared/CtaButtons';
import { Certificate, certificates, company } from '@/data/company';

const pdfPreviewUrl = (file: string) => `${encodeURI(file)}#toolbar=0&navpanes=0&view=FitH`;

/** Mobile browsers render PDF iframes poorly; open the file directly there. */
const prefersNativeViewer = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

const documentation = [
  ['Material test certificate', 'Grade and heat number for the raw material, on request with the order.'],
  ['Dimensional report', 'Key dimensions against the agreed standard, for critical items.'],
  ['Surface finish', 'Matt or mirror finish declared per item; Ra values on request.'],
  ['Laser marking', 'Grade and lot marking on request for traceability through the line.'],
];

const Certificates = () => {
  const [preview, setPreview] = useState<Certificate | null>(null);

  const openPreview = (c: Certificate) => {
    if (prefersNativeViewer()) {
      window.open(c.file, '_blank', 'noopener,noreferrer');
      return;
    }
    setPreview(c);
  };

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
        lead="Registrations, the ZED assessment and our Tri Clover® trademark, downloadable as issued. Order-specific documentation is listed below."
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <Reveal threshold={0.05} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c, i) => (
              <RevealItem key={c.id} index={i}>
                <article id={c.id} className="group flex h-full scroll-mt-28 flex-col rounded-lg border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_50px_-30px_hsl(var(--primary)/0.45)]">
                  <div className="corner-marks m-3 flex aspect-[16/10] flex-col justify-between bg-surface p-5">
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-card text-primary shadow-sm">
                        <FileCheck2 className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Doc 0{i + 1} · PDF
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-foreground">{c.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{c.issuer}</p>
                    </div>
                  </div>
                  <p className="px-5 pt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                  <div className="mt-auto flex gap-2 p-5">
                    <button
                      type="button"
                      onClick={() => openPreview(c)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                    <a
                      href={c.file}
                      download
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      aria-label={`Download ${c.title}`}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <a
                      href={c.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      aria-label={`Open ${c.title} in a new tab`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              </RevealItem>
            ))}

            {/* Trust card */}
            <RevealItem index={certificates.length}>
              <div className="navy-surface flex h-full flex-col justify-between rounded-lg p-6 text-white">
                <div>
                  <p className="eyebrow text-white/60">Verification</p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">Need a copy on letterhead, or a specific MTC?</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Tell us the order or product and we will send the matching documents. GSTIN {company.gst}.
                  </p>
                </div>
                <WhatsAppButton
                  variant="outline"
                  className="mt-6"
                  message="Hello Shisai, please share documentation for:"
                >
                  Request documents
                </WhatsAppButton>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
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

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="flex h-[90vh] max-w-5xl flex-col gap-0 p-0">
          <DialogHeader className="border-b border-border px-6 py-4 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight">{preview?.title}</DialogTitle>
            <DialogDescription className="text-xs">{preview?.issuer}</DialogDescription>
          </DialogHeader>
          {preview && (
            <iframe
              key={preview.id}
              src={pdfPreviewUrl(preview.file)}
              title={preview.title}
              className="h-full w-full flex-1 bg-surface"
              loading="lazy"
            />
          )}
          <div className="flex justify-end gap-2 border-t border-border px-6 py-3">
            {preview && (
              <a href={preview.file} download className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:border-primary/40 hover:text-primary">
                <Download className="h-4 w-4" /> Download
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Certificates;
