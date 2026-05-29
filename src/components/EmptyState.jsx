export function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 py-10 text-center dark:border-white/15 ${className}`}
    >
      {Icon && (
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-500/10 text-neutral-500 dark:text-neutral-300">
          <Icon size={22} />
        </div>
      )}
      <p className="mt-4 text-sm font-bold text-neutral-950 dark:text-white">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
