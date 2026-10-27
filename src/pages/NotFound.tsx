import { PrimaryLink } from '@/components/shared/CtaButtons';

const NotFound = () => (
  <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-surface pt-[var(--nav-h)]">
    <div className="grid-paper absolute inset-0 opacity-70" aria-hidden="true" />
    <div className="container relative">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="display-xl text-foreground">
        <span className="text-stroke">Page</span> not found.
      </h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        The part number you followed does not exist. Try the catalogue or head back home.
      </p>
      <div className="mt-8 flex gap-3">
        <PrimaryLink to="/">Back to home</PrimaryLink>
      </div>
    </div>
  </section>
);

export default NotFound;
