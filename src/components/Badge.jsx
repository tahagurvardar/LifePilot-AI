const tones = {
  neutral: "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300"
};

export function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tones[tone] ?? tones.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
