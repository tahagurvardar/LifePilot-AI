import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { currencies, languages } from "../data/demoData";
import { useAuth } from "../hooks/useAuth";
import { useDemoData } from "../hooks/useDemoData";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { currentUser, updateUser } = useAuth();
  const { data, updatePreferences, updateProfile } = useDemoData();
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
      location: profileForm.location
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Edit your demo profile, currency, language, and theme preferences."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card title="Profile edit form" description={currentUser?.email}>
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
              Current role
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
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200 md:col-span-2">
              Location
              <input
                value={profileForm.location}
                onChange={(event) => updateField("location", event.target.value)}
                className="field mt-2"
                type="text"
              />
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
          <Card title="Preferences">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-200">
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
              <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-200">
                Theme selection
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value)}
                  className="field mt-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
          </Card>

          <Card title="Demo data">
            <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              Login, profile, transactions, career progress, and advisor messages are stored with
              LocalStorage so the frontend can run without a backend.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
