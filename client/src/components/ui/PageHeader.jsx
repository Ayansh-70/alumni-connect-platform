function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur sm:p-8">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        {description ? <p className="mt-4 text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
    </section>
  );
}

export default PageHeader;
