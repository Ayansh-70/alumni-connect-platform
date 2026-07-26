function DashboardMetricGrid({ metrics }) {
  if (!metrics?.length) {
    return null;
  }

  return (
    <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="surface-card">
          <p className="text-caption font-semibold uppercase tracking-wider text-text-secondary">
            {metric.label}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <p className="text-page font-bold tracking-tight text-text-primary">{metric.value}</p>
            <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-badge font-semibold text-primary">
              {metric.caption}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}

export default DashboardMetricGrid;
