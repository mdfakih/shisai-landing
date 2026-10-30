import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import WhatsAppFab from '@/components/layout/WhatsAppFab';
import ScrollToTop from '@/components/ScrollToTop';
import Home from '@/pages/Home';

// Secondary routes split out so the landing page ships the smallest bundle.
const Products = lazy(() => import('@/pages/Products'));
const Certificates = lazy(() => import('@/pages/Certificates'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center pt-[var(--nav-h)]" role="status" aria-live="polite">
    <span className="eyebrow">Loading…</span>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <main key={location.pathname} className="page-enter">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
};

/** The whole site. The router comes from the entry: BrowserRouter in the browser, StaticRouter when pre-rendering. */
const App = () => (
  <TooltipProvider>
    <Toaster />
    <ScrollToTop />
    <Navigation />
    <AppRoutes />
    <Footer />
    <WhatsAppFab />
  </TooltipProvider>
);

export default App;
