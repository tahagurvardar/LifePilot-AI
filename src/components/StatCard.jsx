const colorMap = {
  emerald: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-300",
  indigo: "from-indigo-500/20 to-sky-500/10 text-indigo-600 dark:text-indigo-300",
  amber: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-300",
  rose: "from-rose-500/20 to-pink-500/10 text-rose-600 dark:text-rose-300"
};

export function StatCard({ title, value, detail, icon: Icon, color = "emerald" }) {
  return (
    <article className="surface rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-premium dark:hover:shadow-premium-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{value}</p>
        </div>
        {Icon && (
          <div
            className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colorMap[color]}`}
          >
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}
      </div>
      {detail && <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{detail}</p>}
    </article>
  );
}
