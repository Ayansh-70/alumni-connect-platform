function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="mb-8 overflow-hidden relative p-2 sm:p-4">
      <div className="max-w-3xl relative z-10">
        {eyebrow ? (
          <p className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-badge font-bold uppercase tracking-wider text-primary mb-4">
            {eyebrow}
          </p>
        ) : null}
        
        <h1 className="text-display font-bold tracking-tight text-text-primary leading-tight">
          {title}
        </h1>
        
        {description ? (
          <p className="mt-3 text-body text-text-secondary max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default PageHeader;
