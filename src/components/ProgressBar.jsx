export function ProgressBar({ value, label, detail, color = "emerald" }) {
  const boundedValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  const fill =
    color === "indigo"
      ? "from-indigo-500 to-sky-400"
      : color === "amber"
        ? "from-amber-500 to-orange-400"
        : "from-emerald-500 to-teal-400";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{label}</span>
        <span className="font-bold text-neutral-950 dark:text-white">{Math.round(boundedValue)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fill}`}
          style={{ width: `${boundedValue}%` }}
        />
      </div>
      {detail && <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{detail}</p>}
    </div>
  );
}
