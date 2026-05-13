function EmptyState({ title = 'Nothing to show yet', description, action }) {
  return (
    <div className="empty-state">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-base font-semibold text-slate-900">{title}</p>
        {description ? <p className="mt-2 leading-6 text-slate-600">{description}</p> : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export default EmptyState;
