import { Link } from "react-router-dom";
import { AppLogo } from "./AppLogo";
import { useI18n } from "../hooks/useI18n";

const footerLinks = [
  {
    titleKey: "nav.product",
    links: [
      { labelKey: "nav.finance", to: "/login" },
      { labelKey: "nav.career", to: "/login" },
      { labelKey: "nav.resume", to: "/login" },
      { labelKey: "nav.advisor", to: "/login" }
    ]
  },
  {
    titleKey: "nav.company",
    links: [
      { labelKey: "nav.about", to: "/" },
      { labelKey: "landing.howEyebrow", to: "/" },
      { labelKey: "landing.pricingEyebrow", to: "/" }
    ]
  },
  {
    titleKey: "common.getStarted",
    links: [
      { labelKey: "common.signIn", to: "/login" },
      { labelKey: "common.createAccount", to: "/register" }
    ]
  }
];

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <AppLogo to="/" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              {t("common.footerDesc")}
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.titleKey}>
              <p className="text-sm font-bold text-neutral-950 dark:text-white">{t(group.titleKey)}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-500 transition hover:text-emerald-600 dark:text-neutral-400 dark:hover:text-emerald-300"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            (c) {new Date().getFullYear()} LifePilot AI - {t("common.footerRights")}
          </p>
          <p>{t("common.footerBuilt")}</p>
        </div>
      </div>
    </footer>
  );
}
