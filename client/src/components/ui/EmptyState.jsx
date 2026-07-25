function EmptyState({ title = 'Nothing to show yet', description, action }) {
  return (
    <div className="empty-state">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-brand-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-brand-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-base font-bold text-slate-950 dark:text-white">{title}</p>
        {description ? <p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">{description}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export default EmptyState;
