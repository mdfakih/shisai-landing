import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { z } from 'zod';
import { PageIntro } from '@/components/layout/PageIntro';
import { Reveal } from '@/components/motion/Reveal';
import { useToast } from '@/hooks/use-toast';
import { company, whatsappLink } from '@/data/company';
import { allProductNames } from '@/data/products';
import { cn } from '@/lib/utils';

const subjects = [
  { id: 'quote', label: 'Request a quotation' },
  { id: 'custom', label: 'Custom part from drawing' },
  { id: 'application', label: 'Discuss an application' },
  { id: 'docs', label: 'Documentation / certificates' },
  { id: 'other', label: 'Something else' },
] as const;

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s()-]{7,18}$/, 'Enter a valid phone number'),
  subject: z.enum(['quote', 'custom', 'application', 'docs', 'other']),
  product: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell us a little more (sizes, grade, finish, quantity)').max(2000),
});

type Enquiry = z.infer<typeof enquirySchema>;
type Errors = Partial<Record<keyof Enquiry, string>>;

const buildMessage = (d: Enquiry): string =>
  [
    `Enquiry: ${subjects.find((s) => s.id === d.subject)?.label}`,
    d.product ? `Product: ${d.product}` : null,
    `Name: ${d.name}${d.company ? ` (${d.company})` : ''}`,
    `Phone: ${d.phone}`,
    `Email: ${d.email}`,
    '',
    d.message,
  ]
    .filter((l) => l !== null)
    .join('\n');

const fieldClass =
  'h-11 w-full rounded-md border border-input bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15';

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-2 block">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Google map embed that only mounts when scrolled near. */
function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="corner-marks relative aspect-[16/10] overflow-hidden rounded-lg bg-surface sm:aspect-[21/9]">
      {show ? (
        <iframe
          src={company.address.embedUrl}
          title="Shisai Steel Industries location"
          className="h-full w-full border-0 grayscale-[0.4] contrast-[1.05] dark:[filter:invert(0.92)_hue-rotate(180deg)_grayscale(0.35)_contrast(0.95)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="grid-paper absolute inset-0" aria-hidden="true" />
      )}
    </div>
  );
}

const Contact = () => {
  const { toast } = useToast();
  const [params] = useSearchParams();
  const productNames = useMemo(allProductNames, []);

  const initialSubject = (subjects.find((s) => s.id === params.get('subject'))?.id ?? 'quote') as Enquiry['subject'];
  const [data, setData] = useState<Enquiry>({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: initialSubject,
    product: params.get('product') ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');

  const update = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as keyof Enquiry;
        if (!next[k]) next[k] = i.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    const body = buildMessage(parsed.data);
    if (channel === 'whatsapp') {
      window.open(whatsappLink(body), '_blank', 'noopener,noreferrer');
    } else {
      const subject = `Enquiry: ${subjects.find((s) => s.id === parsed.data.subject)?.label}`;
      window.location.href = `mailto:${company.emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    toast({
      title: channel === 'whatsapp' ? 'Opening WhatsApp' : 'Opening your email app',
      description: 'Your enquiry is pre-filled. Send it and we will reply within one working day.',
    });
  };

  return (
    <>
      <PageIntro
        index="05"
        eyebrow="Contact"
        title={
          <>
            Tell us the spec.
            <br className="hidden sm:block" />{' '}
            <span className="metal-text">We take it from there.</span>
          </>
        }
        lead="Sizes, grade, finish, quantity. A drawing or photo helps. Replies within one working day, Monday to Saturday."
      />

      <section className="py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <form onSubmit={onSubmit} noValidate className="rounded-lg border border-border bg-card p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <input id="name" className={fieldClass} value={data.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" required />
                </Field>
                <Field label="Company" htmlFor="company" error={errors.company}>
                  <input id="company" className={fieldClass} value={data.company} onChange={(e) => update('company', e.target.value)} autoComplete="organization" />
                </Field>
                <Field label="Email" htmlFor="email" error={errors.email}>
                  <input id="email" type="email" className={fieldClass} value={data.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" required />
                </Field>
                <Field label="Phone / WhatsApp" htmlFor="phone" error={errors.phone}>
                  <input id="phone" type="tel" className={fieldClass} value={data.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" placeholder="+91" required />
                </Field>
                <Field label="Enquiry type" htmlFor="subject" error={errors.subject}>
                  <select id="subject" className={fieldClass} value={data.subject} onChange={(e) => update('subject', e.target.value as Enquiry['subject'])}>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Product (optional)" htmlFor="product" error={errors.product}>
                  <input id="product" list="product-names" className={fieldClass} value={data.product} onChange={(e) => update('product', e.target.value)} placeholder="e.g. 90° TC Bend" />
                  <datalist id="product-names">
                    {productNames.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
                </Field>
              </div>
              <div className="mt-5">
                <Field label="Requirement" htmlFor="message" error={errors.message}>
                  <textarea
                    id="message"
                    rows={5}
                    className={cn(fieldClass, 'h-auto resize-y py-3')}
                    value={data.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder={'Sizes, grade (304 / 316 / 316L), finish, quantity, delivery location.'}
                    required
                  />
                </Field>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex rounded-md border border-border p-1 text-sm" role="radiogroup" aria-label="Send via">
                  {(['whatsapp', 'email'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={channel === c}
                      onClick={() => setChannel(c)}
                      className={cn(
                        'flex items-center gap-2 rounded px-3 py-1.5 font-medium transition-colors',
                        channel === c ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {c === 'whatsapp' ? <MessageCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      {c === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary sheen h-12 px-6 text-sm"
                >
                  <Send className="h-4 w-4" />
                  Send enquiry
                </button>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Your message opens pre-filled in {channel === 'whatsapp' ? 'WhatsApp' : 'your email app'}. Nothing is stored on this website.
              </p>
            </form>
          </Reveal>

          {/* Details */}
          <div className="space-y-4 lg:col-span-5">
            <Reveal delay={100} className="rounded-lg border border-border bg-card p-6">
              <p className="eyebrow mb-5">Reach us</p>
              <ul className="space-y-5 text-sm">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <a href={`tel:${company.phone.e164}`} className="tabular block text-base font-semibold text-foreground hover:text-primary">
                      {company.phone.display}
                    </a>
                    <a href={`tel:${company.phoneAlt.e164}`} className="tabular block text-base font-semibold text-foreground hover:text-primary">
                      {company.phoneAlt.display}
                    </a>
                    <p className="text-muted-foreground">Call or WhatsApp</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="space-y-1">
                    {company.emails.map((m) => (
                      <a key={m} href={`mailto:${m}`} className="block break-all font-medium text-foreground hover:text-primary">
                        {m}
                      </a>
                    ))}
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <a href={company.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="leading-relaxed text-foreground/85 hover:text-primary">
                      {company.address.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </a>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Also at {company.address.alsoAt}</p>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={180} className="navy-surface rounded-lg p-6 text-white">
              <p className="eyebrow mb-4 flex items-center gap-2 text-white/60">
                <Clock className="h-3.5 w-3.5" /> Working hours · IST
              </p>
              <dl className="divide-y divide-white/10 text-sm">
                {company.hours.map((h) => (
                  <div key={h.days} className="flex justify-between py-2.5">
                    <dt className="text-white/70">{h.days}</dt>
                    <dd className="tabular font-semibold">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        <div className="container mt-12">
          <Reveal>
            <LazyMap />
            <p className="mt-3 text-xs text-muted-foreground">
              Vasai East, Palghar. About 50 km north of Mumbai via the Western Express Highway and NH-48.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
