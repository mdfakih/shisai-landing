import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, Moon, Phone, Sun, X } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { company } from "@/data/company";
import { useTheme } from "@/hooks/useTheme";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Products", path: "/products" },
  { name: "Quality", path: "/certificates" },
  { name: "Company", path: "/about" },
  { name: "Contact", path: "/contact" },
] as const;

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tapping the page you're already on leaves the pathname unchanged, so the
  // close-on-route-change effect never fires. Close here and go back to top.
  const onMobileNav = (path: string) => {
    setOpen(false);
    if (path === location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
          scrolled || open
            ? "border-b border-border bg-background/85 shadow-[0_1px_0_0_hsl(var(--border)),0_12px_32px_-24px_rgba(20,25,60,0.35)] backdrop-blur-md"
            : "border-b border-transparent bg-background/90",
        )}
      >
        <div className="container flex h-[var(--nav-h)] items-center justify-between">
          <Link
            to="/"
            className="relative z-10 flex items-center"
            aria-label="Shisai Steel Industries home"
          >
            <BrandLogo height={38} />
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "link-draw text-[13.5px] font-medium tracking-wide transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-foreground/75 hover:text-foreground",
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle theme={theme} onToggle={toggle} className="mr-1" />
            <a
              href={`tel:${company.phone.e164}`}
              className="flex items-center gap-2 text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="tabular">{company.phone.display}</span>
            </a>
            <Link
              to="/contact"
              className="btn btn-primary sheen group h-10 gap-2.5 pl-4 pr-1.5 text-[13px]"
            >
              Request a quote
              <span className="btn-chip h-7 w-7">
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>

          <ThemeToggle theme={theme} onToggle={toggle} className="ml-auto mr-2 md:hidden" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay. Lives outside <header>: its backdrop-filter would
          otherwise become the containing block for this fixed panel. */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-[var(--nav-h)] bottom-0 z-40 flex flex-col bg-background transition-[opacity,visibility] duration-300 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav
          className="container flex flex-1 flex-col justify-center gap-1 py-8"
          aria-label="Mobile"
        >
          <NavLink
            to="/"
            end
            className="mobile-link"
            onClick={() => onMobileNav("/")}
            style={{ transitionDelay: open ? "60ms" : "0ms" }}
          >
            <span className="eyebrow w-8">00</span>Home
          </NavLink>
          {navLinks.map((link, i) => (
            <NavLink
              key={link.path}
              to={link.path}
              className="mobile-link"
              onClick={() => onMobileNav(link.path)}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <span className="eyebrow w-8">0{i + 1}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
        <div className="container border-t border-border py-6">
          <a
            href={`tel:${company.phone.e164}`}
            className="flex items-center gap-3 text-base font-medium text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" />
            {company.phone.display}
          </a>
          <p className="eyebrow mt-3">{company.address.short}</p>
        </div>
      </div>

      <style>{`
        .mobile-link {
          display: flex; align-items: center; gap: 1rem;
          font-size: 2rem; line-height: 1.1; font-weight: 700; letter-spacing: -0.03em;
          padding: 0.85rem 0; border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
          opacity: 0; transform: translateY(14px);
          transition: opacity .5s var(--ease-out-expo), transform .6s var(--ease-out-expo), color .3s;
        }
        #mobile-menu.visible .mobile-link { opacity: 1; transform: none; }
        /* Current page. NavLink sets aria-current; plain utilities can't beat
           the unlayered .mobile-link color above, so style it here. */
        .mobile-link[aria-current="page"] {
          color: hsl(var(--primary-bright));
          border-bottom-color: hsl(var(--primary-bright) / 0.5);
        }
        .mobile-link[aria-current="page"] .eyebrow { color: hsl(var(--primary-bright)); }
        .mobile-link[aria-current="page"]::after {
          content: ""; margin-left: auto; width: 0.5rem; height: 0.5rem; border-radius: 9999px;
          background: hsl(var(--primary-bright));
          box-shadow: 0 0 0 4px hsl(var(--primary-bright) / 0.18);
        }
      `}</style>
    </>
  );
};

export default Navigation;
