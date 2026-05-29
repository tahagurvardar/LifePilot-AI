import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { jobStatuses } from "../data/demoData";
import { useI18n } from "../hooks/useI18n";
import { Button } from "./Button";

const defaultForm = {
  company: "",
  role: "",
  status: "Applied",
  date: new Date().toISOString().slice(0, 10)
};

export function JobApplicationForm({ onAdd }) {
  const { t } = useI18n();
  const [form, setForm] = useState(defaultForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onAdd(form);
    setForm(defaultForm);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={form.company}
        onChange={(event) => updateField("company", event.target.value)}
        className="field"
        placeholder={t("career.company")}
        type="text"
      />
      <input
        value={form.role}
        onChange={(event) => updateField("role", event.target.value)}
        className="field"
        placeholder={t("career.role")}
        type="text"
      />
      <select
        value={form.status}
        onChange={(event) => updateField("status", event.target.value)}
        className="field"
      >
        {jobStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        value={form.date}
        onChange={(event) => updateField("date", event.target.value)}
        className="field"
        type="date"
      />
      <Button type="submit" variant="accent">
        <PlusCircle size={18} />
        {t("career.trackJob")}
      </Button>
    </form>
  );
}
