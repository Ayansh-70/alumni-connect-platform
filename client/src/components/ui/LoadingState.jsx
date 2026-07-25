function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div
      className={`empty-state flex flex-col items-center justify-center gap-4 ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-100 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm shadow-brand-700/10 dark:border-brand-900/40 dark:bg-slate-950">
        <span className="absolute h-6 w-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-700 dark:border-brand-900 dark:border-t-brand-400" />
      </span>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{message}</span>
      <span className="grid w-full max-w-md gap-2" aria-hidden="true">
        <span className="h-2 rounded-full bg-slate-200/80 dark:bg-slate-800" />
        <span className="h-2 w-3/4 rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
      </span>
    </div>
  );
}

export default LoadingState;
