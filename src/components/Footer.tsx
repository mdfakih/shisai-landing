import { Mail, Phone, MapPin, FileText } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          {/* Company Info */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg inline-block shadow-sm hover:shadow-md transition-shadow duration-300">
              <img
                src={logo}
                alt="Shisai Steel Industries"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
              Manufacturing high-quality hygienic stainless steel pipe fittings
              since 2009. Trusted by industries worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <FileText className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">GST:</span>{' '}
                27DBFPP0939E1ZM
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-5 text-base md:text-lg">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm md:text-base text-muted-foreground hover:text-foreground transition-colors group">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <a
                  href="https://www.google.co.in/maps/dir//19.42259000,72.85411000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  UNIT NO 13, SINGH INDUSTRIAL ESTATE, NR. KALIMATA MANDIR,
                  KHERPADA, WALIV, VASAI-EAST, PALGHAR, Maharashtra, 401208
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm md:text-base text-muted-foreground group">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <a
                  href="tel:+919992252256"
                  className="hover:text-primary transition-colors font-medium"
                >
                  +91 9992252256
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm md:text-base text-muted-foreground group">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:triclover.india@gmail.com"
                  className="hover:text-primary transition-colors font-medium"
                >
                  triclover.india@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm md:text-base text-muted-foreground group">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                <a
                  href="mailto:shisaisteel@gmail.com"
                  className="hover:text-primary transition-colors font-medium"
                >
                  shisaisteel@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm md:text-base text-muted-foreground text-center sm:text-left">
              © {currentYear} Shisai Steel Industries. All rights reserved.
            </p>
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-right">
              GST: 27DBFPP0939E1ZM
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
