const STATUS_STYLES = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  VERIFIED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  COMPLETED: 'border-sky-200 bg-sky-50 text-sky-700',
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  READ: 'border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700',
  INACTIVE: 'border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700',
  DRAFT: 'border-slate-200 bg-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
  BLOCKED: 'border-rose-200 bg-rose-50 text-rose-700'
};

function StatusBadge({ value, className = '' }) {
  const normalizedValue = String(value || 'UNKNOWN').toUpperCase();
  const style = STATUS_STYLES[normalizedValue] || 'border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700';

  return <span className={`status-badge ${style} ${className}`.trim()}>{normalizedValue}</span>;
}

export default StatusBadge;
