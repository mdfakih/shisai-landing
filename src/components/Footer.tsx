import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={logo} alt="Shisai Steel Industries" className="h-12 w-auto brightness-90 dark:brightness-110" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manufacturing high-quality hygienic stainless steel pipe fittings since 2001. Trusted by pharmaceutical, food & beverage, and biotechnology industries worldwide.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <a href="http://www.tcfittings.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                www.tcfittings.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/certificates" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                  Certificates
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">Product Categories</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Clamps & Ferrules</li>
              <li className="text-sm text-muted-foreground">Tees & Connectors</li>
              <li className="text-sm text-muted-foreground">Elbows & Reducers</li>
              <li className="text-sm text-muted-foreground">Valves & Manifolds</li>
              <li className="text-sm text-muted-foreground">Gaskets & Flanges</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>Unit No. 13, Singh Ind. Estate, Kherpada, Waliv, Vasai East-401208</span>
              </li>
              <li className="space-y-2">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <a href="tel:+919992252256" className="hover:text-primary transition-colors">+91 9992252256</a>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground ml-7">
                  <a href="tel:+919082780156" className="hover:text-primary transition-colors">+91 9082780156</a>
                </div>
              </li>
              <li className="space-y-2">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  <a href="mailto:shisaistee@gmail.com" className="hover:text-primary transition-colors">shisaistee@gmail.com</a>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground ml-7">
                  <a href="mailto:triclover.india@gmail.com" className="hover:text-primary transition-colors">triclover.india@gmail.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Shisai Steel Industries. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Serving Pharmaceutical, Food & Beverage, Dairy, and Biotechnology Industries
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
