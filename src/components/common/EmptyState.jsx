const EmptyState = ({ icon: Icon, title, description, action }) => (
  <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
    {Icon && (
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon aria-hidden="true" size={36} />
      </div>
    )}
    <div className="max-w-sm space-y-1">
      <h1 className="text-xl font-semibold text-base-content">{title}</h1>
      <p className="text-sm text-base-content/60">{description}</p>
    </div>
    {action}
  </section>
);

export default EmptyState;
