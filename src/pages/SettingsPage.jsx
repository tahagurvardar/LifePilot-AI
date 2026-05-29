import { Moon, RotateCcw, Save, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { countries, currencies, languages } from "../data/demoData";
import { useAuth } from "../hooks/useAuth";
import { useDemoData } from "../hooks/useDemoData";
import { useTheme } from "../hooks/useTheme";

function initialsOf(name) {
  return (name || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function SettingsPage() {
  const { currentUser, updateUser } = useAuth();
  const { data, updatePreferences, updateProfile, resetDemoData } = useDemoData();
  const { theme, setTheme } = useTheme();
  const [profileForm, setProfileForm] = useState(data.profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  function updateField(field, value) {
    setProfileForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateProfile(profileForm);
    updateUser({
      name: profileForm.name,
      email: profileForm.email,
      role: profileForm.role,
      country: profileForm.country
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function handleReset() {
    if (window.confirm("Reset all demo data back to the default Jordan Blake profile?")) {
      resetDemoData();
      setSaved(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Edit your demo profile, currency, country, language, and theme preferences."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card title="Profile" description={currentUser?.email}>
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-indigo-500 text-xl font-bold text-white">
              {initialsOf(profileForm.name) || <UserRound size={26} />}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-950 dark:text-white">
                {profileForm.name || "Your name"}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {profileForm.role || "Your role"}
              </p>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                Photo placeholder uses your initials.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Full name
              <input
                value={profileForm.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="field mt-2"
                type="text"
                required
              />
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Email
              <input
                value={profileForm.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="field mt-2"
                type="email"
                required
              />
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Role
              <input
                value={profileForm.role}
                onChange={(event) => updateField("role", event.target.value)}
                className="field mt-2"
                type="text"
              />
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Target role
              <input
                value={profileForm.targetRole}
                onChange={(event) => updateField("targetRole", event.target.value)}
                className="field mt-2"
                type="text"
              />
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Country
              <select
                value={profileForm.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="field mt-2"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Currency
              <select
                value={data.preferences.currency}
                onChange={(event) => updatePreferences({ currency: event.target.value })}
                className="field mt-2"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center">
              <Button type="submit">
                <Save size={18} />
                Save profile
              </Button>
              {saved && (
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                  Settings saved locally.
                </p>
              )}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Appearance">
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">Theme</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon }
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={`focus-ring flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    theme === value
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Preferences">
            <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Language
              <select
                value={data.preferences.language}
                onChange={(event) => updatePreferences({ language: event.target.value })}
                className="field mt-2"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>
          </Card>

          <Card title="Demo data">
            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Login, profile, transactions, career progress, and advisor messages are stored with
              LocalStorage so the frontend can run without a backend.
            </p>
            <Button variant="danger" size="sm" className="mt-4" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset demo data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
