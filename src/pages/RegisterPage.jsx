import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppLogo } from "../components/AppLogo";
import { Button } from "../components/Button";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/app", { replace: true });
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
            <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">
              Build a clearer personal operating system.
            </h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Create a demo account, personalize your profile, and start shaping finance and career
              decisions from one workspace.
            </p>
          </div>

          <section className="surface mx-auto w-full max-w-md rounded-2xl p-6 shadow-premium dark:shadow-premium-dark">
            <h2 className="text-2xl font-bold">Create account</h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              No backend yet. Registration is saved locally.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  Full name
                </label>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="field mt-2"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  Email
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
                  Password
                </label>
                <input
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  className="field mt-2"
                  type="password"
                  minLength={6}
                  autoComplete="new-password"
                  required
                />
              </div>
              {error && (
                <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                Create workspace
                <ArrowRight size={18} />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-300">
                Sign in
              </Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
