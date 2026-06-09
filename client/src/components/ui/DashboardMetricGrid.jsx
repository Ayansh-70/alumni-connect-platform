function DashboardMetricGrid({ metrics }) {
  if (!metrics?.length) {
    return null;
  }

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="surface-muted">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {metric.label}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
            <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-700 dark:border-brand-900/40 dark:bg-brand-950/30 dark:text-brand-400">
              {metric.caption}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default DashboardMetricGrid;
