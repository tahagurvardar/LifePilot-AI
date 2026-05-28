import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function AppLogo({ to = "/", compact = false }) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-500 text-white shadow-lg shadow-emerald-500/20">
        <Compass size={22} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-base font-bold tracking-normal text-neutral-950 dark:text-white">
            LifePilot AI
          </p>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Finance and career copilot
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Link to={to} className="focus-ring rounded-xl">
      {content}
    </Link>
  );
}
