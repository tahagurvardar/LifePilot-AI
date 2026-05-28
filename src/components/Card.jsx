export function Card({ children, className = "", title, description, action }) {
  return (
    <section className={`surface rounded-2xl p-5 ${className}`}>
      {(title || description || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-base font-bold text-neutral-950 dark:text-white">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
