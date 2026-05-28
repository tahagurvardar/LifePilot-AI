const variants = {
  primary:
    "bg-neutral-950 text-white shadow-lg shadow-neutral-950/15 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
  accent:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600",
  secondary:
    "border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
  ghost:
    "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white",
  danger:
    "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
};

const sizes = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-11 gap-2.5 px-4 text-sm",
  lg: "h-12 gap-3 px-5 text-base"
};

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      className={`focus-ring inline-flex items-center justify-center rounded-lg font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
