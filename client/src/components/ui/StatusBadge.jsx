const STATUS_STYLES = {
  ACTIVE: 'border-success/20 bg-success/10 text-success',
  APPROVED: 'border-success/20 bg-success/10 text-success',
  ACCEPTED: 'border-success/20 bg-success/10 text-success',
  VERIFIED: 'border-success/20 bg-success/10 text-success',
  COMPLETED: 'border-info/20 bg-info/10 text-info',
  PENDING: 'border-warning/20 bg-warning/10 text-warning',
  READ: 'border-border bg-bg-secondary text-text-secondary',
  INACTIVE: 'border-border bg-bg-secondary text-text-secondary',
  DRAFT: 'border-border bg-bg-secondary text-text-secondary',
  REJECTED: 'border-danger/20 bg-danger/10 text-danger',
  BLOCKED: 'border-danger/20 bg-danger/10 text-danger'
};

function StatusBadge({ value, className = '' }) {
  const normalizedValue = String(value || 'UNKNOWN').toUpperCase();
  const style = STATUS_STYLES[normalizedValue] || 'border-border bg-surface text-text-secondary';

  return <span className={`status-badge ${style} ${className}`.trim()}>{normalizedValue}</span>;
}

export default StatusBadge;
