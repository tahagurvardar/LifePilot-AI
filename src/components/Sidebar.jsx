import {
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  WalletCards,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { AppLogo } from "./AppLogo";
import { Button } from "./Button";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/finance", label: "Finance", icon: WalletCards },
  { to: "/app/career", label: "Career", icon: BriefcaseBusiness },
  { to: "/app/resume", label: "Resume Analyzer", icon: FileText },
  { to: "/app/advisor", label: "AI Advisor", icon: MessageSquareText },
  { to: "/app/settings", label: "Settings", icon: Settings }
];

export function Sidebar({ onClose }) {
  const { logout, currentUser } = useAuth();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-neutral-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-neutral-950">
      <div className="flex items-center justify-between gap-3">
        <AppLogo to="/app" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="focus-ring rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="mt-8 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-neutral-950 text-white shadow-lg shadow-neutral-950/10 dark:bg-white dark:text-neutral-950"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
        <p className="text-sm font-bold text-neutral-950 dark:text-white">
          {currentUser?.name ?? "Demo user"}
        </p>
        <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Your workspace is saved locally in this browser.
        </p>
        <Button variant="ghost" size="sm" className="mt-3 w-full justify-start" onClick={logout}>
          <LogOut size={17} />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
