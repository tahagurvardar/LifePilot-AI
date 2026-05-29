import { Link } from "react-router-dom";
import { AppLogo } from "./AppLogo";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Finance", to: "/login" },
      { label: "Career", to: "/login" },
      { label: "Resume Analyzer", to: "/login" },
      { label: "AI Advisor", to: "/login" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About (demo)", to: "/" },
      { label: "How it works", to: "/" },
      { label: "Pricing", to: "/" }
    ]
  },
  {
    title: "Get started",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <AppLogo to="/" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              A portfolio demo of an AI-style copilot for personal finance and career growth. Frontend
              only, with data stored locally in your browser.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-bold text-neutral-950 dark:text-white">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-500 transition hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} LifePilot AI - demo project. Not a real financial service.</p>
          <p>Built with React, Vite, Tailwind CSS, and Recharts.</p>
        </div>
      </div>
    </footer>
  );
}
