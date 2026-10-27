import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { company, whatsappLink } from '@/data/company';
import { productCategories } from '@/data/products';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="container py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <BrandLogo height={44} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Manufacturer of hygienic stainless steel tube fittings for pharmaceutical,
              food, dairy and biotech process lines. Vasai, India. Since {company.foundedYear}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['SS304', 'SS316', 'SS316L'].map((g) => (
                <span key={g} className="rounded border border-border bg-card px-2 py-1 font-mono text-[11px] tracking-wider text-foreground/80">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Products</p>
            <ul className="space-y-3 text-sm">
              {productCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/products#${c.id}`}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">Company</p>
            <ul className="space-y-3 text-sm">
              {[
                ['About us', '/about'],
                ['Quality & certificates', '/certificates'],
                ['Contact', '/contact'],
                ['Request a quote', '/contact?subject=quote'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-foreground/80 transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={company.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed text-foreground/80 transition-colors hover:text-primary"
                >
                  {company.address.lines.slice(0, 3).map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${company.phone.e164}`} className="tabular text-foreground/80 hover:text-primary">
                  {company.phone.display}
                </a>
              </li>
              {company.emails.map((email) => (
                <li key={email} className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${email}`} className="break-all text-foreground/80 hover:text-primary">
                    {email}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappLink('Hello Shisai, I would like a quotation.')}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Chat on WhatsApp
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <p className="font-mono tracking-wider">GSTIN {company.gst}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
