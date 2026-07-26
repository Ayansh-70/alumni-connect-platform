import { Loader2 } from 'lucide-react';

function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div
      className={`empty-state flex flex-col items-center justify-center gap-4 ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-body font-semibold text-text-primary">{message}</span>
      <span className="grid w-full max-w-xs gap-2 mt-2" aria-hidden="true">
        <span className="h-2 rounded-full bg-border" />
        <span className="h-2 w-3/4 rounded-full bg-border/70" />
      </span>
    </div>
  );
}

export default LoadingState;
