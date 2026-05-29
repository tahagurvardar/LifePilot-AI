const toneColors = {
  emerald: "#10b981",
  indigo: "#4f46e5",
  amber: "#f59e0b",
  rose: "#ef4444"
};

// Lightweight circular progress ring built with an SVG so it needs no extra deps.
export function ScoreRing({ value = 0, size = 120, stroke = 10, tone = "emerald", label }) {
  const bounded = Math.min(Math.max(Number(value) || 0, 0), 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (bounded / 100) * circumference;
  const color = toneColors[tone] ?? toneColors.emerald;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-2xl font-bold text-neutral-950 dark:text-white">{Math.round(bounded)}</p>
          {label && (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
