import { Link } from 'react-router-dom';

function DashboardActionGrid({ actions }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/10"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-sky-400 to-emerald-400 opacity-80" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{action.eyebrow || 'Workspace'}</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">{action.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-slate-900">
              Open
              <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

export default DashboardActionGrid;
