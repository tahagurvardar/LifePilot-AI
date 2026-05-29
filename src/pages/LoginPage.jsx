import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppLogo } from "../components/AppLogo";
import { Button } from "../components/Button";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "demo@lifepilot.ai", password: "demo123" });
  const [errorKey, setErrorKey] = useState("");
  const redirectTo = location.state?.from?.pathname ?? "/app";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(form.email, form.password);
    if (!result.ok) {
      setErrorKey(result.errorKey ?? "auth.errorInvalid");
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="min-h-screen bg-mist text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-5">
          <AppLogo />
          <ThemeToggle />
        </nav>
        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">{t("auth.welcomeBack")}</h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              {t("auth.loginSubtitle")}
            </p>
            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-sm font-bold text-neutral-950 dark:text-white">{t("auth.demoAccount")}</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {t("auth.email")}: demo@lifepilot.ai<br />
                {t("auth.password")}: demo123
              </p>
            </div>
          </div>

          <section className="surface mx-auto w-full max-w-md rounded-2xl p-6 shadow-premium dark:shadow-premium-dark">
            <h2 className="text-2xl font-bold">{t("auth.signInTitle")}</h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {t("auth.signInHint")}
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  {t("auth.email")}
                </label>
                <input
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="field mt-2"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  {t("auth.password")}
                </label>
                <input
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="field mt-2"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              {errorKey && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {t(errorKey)}
                </p>
              )}
              <Button type="submit" className="w-full">
                {t("auth.continue")}
                <ArrowRight size={18} />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              {t("auth.newHere")}{" "}
              <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-300">
                {t("common.createAccount")}
              </Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
