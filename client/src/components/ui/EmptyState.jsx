import { Inbox } from 'lucide-react';

function EmptyState({ title = 'Nothing to show yet', description, action }) {
  return (
    <div className="empty-state">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-level-1">
          <Inbox className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <p className="text-body font-semibold text-text-primary">{title}</p>
        {description ? <p className="mt-2 text-caption text-text-secondary">{description}</p> : null}
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export default EmptyState;
