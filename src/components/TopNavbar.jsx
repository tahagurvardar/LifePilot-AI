import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import { getInitials } from "../utils/user";

const titleKeys = {
  "/app": "nav.dashboard",
  "/app/finance": "nav.finance",
  "/app/career": "nav.career",
  "/app/resume": "nav.resume",
  "/app/advisor": "nav.advisor",
  "/app/settings": "nav.settings"
};

export function TopNavbar({ onMenuClick }) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { t } = useI18n();
  const title = titleKeys[location.pathname] ? t(titleKeys[location.pathname]) : t("common.appName");
  const initials = getInitials(currentUser?.name);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-mist/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/80 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="focus-ring rounded-lg p-2 text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-white/10 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("nav.workspace")}
          </p>
          <h2 className="truncate text-lg font-bold text-neutral-950 dark:text-white">{title}</h2>
        </div>

        <div className="hidden min-w-72 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400 md:flex">
          <Search size={17} />
          <span>{t("nav.search")}</span>
        </div>

        <ThemeToggle compact />

        <button
          type="button"
          aria-label="Notifications"
          className="focus-ring hidden h-10 w-10 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:grid"
        >
          <Bell size={18} />
        </button>

        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-sm font-bold text-white">
          {initials || "LP"}
        </div>
      </div>
    </header>
  );
}
