function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="mb-8 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-700">{eyebrow}</p> : null}
      <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
    </section>
  );
}

export default PageHeader;
