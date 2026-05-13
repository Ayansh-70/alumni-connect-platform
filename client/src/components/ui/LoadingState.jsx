function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div
      className={`empty-state flex items-center gap-3 ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700" />
      <span>{message}</span>
    </div>
  );
}

export default LoadingState;
