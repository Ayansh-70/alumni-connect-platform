function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="mb-10 overflow-hidden relative p-2 sm:p-4">
      <div className="max-w-3xl relative z-10">
        {eyebrow ? (
          <p className="inline-flex rounded-full border border-brand-100 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-950/30 px-4.5 py-1 text-xs font-black uppercase tracking-[0.25em] text-brand-700 dark:text-brand-400 backdrop-blur-md">
            {eyebrow}
          </p>
        ) : null}
        
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl leading-none">
          <span className="bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            {description}
          </p>
        ) : null}

        {/* Dynamic decorative line */}
        <div className="mt-6 h-[3px] w-20 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-500 dark:to-indigo-400" />
      </div>
    </section>
  );
}

export default PageHeader;
