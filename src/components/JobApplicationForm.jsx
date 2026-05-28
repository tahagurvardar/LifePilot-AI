import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { jobStatuses } from "../data/demoData";
import { Button } from "./Button";

const defaultForm = {
  company: "",
  role: "",
  status: "Applied",
  date: new Date().toISOString().slice(0, 10)
};

export function JobApplicationForm({ onAdd }) {
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
        placeholder="Company"
        type="text"
      />
      <input
        value={form.role}
        onChange={(event) => updateField("role", event.target.value)}
        className="field"
        placeholder="Role"
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
        Track job
      </Button>
    </form>
  );
}
