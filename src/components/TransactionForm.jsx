import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { transactionCategories } from "../data/demoData";
import { Button } from "./Button";

const defaultForm = {
  type: "expense",
  amount: "",
  category: "Food",
  note: "",
  date: new Date().toISOString().slice(0, 10)
};

export function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(defaultForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;

    onAdd(form);
    setForm(defaultForm);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <select
        value={form.type}
        onChange={(event) => updateField("type", event.target.value)}
        className="field"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input
        value={form.amount}
        onChange={(event) => updateField("amount", event.target.value)}
        className="field"
        min="1"
        placeholder="Amount"
        type="number"
      />
      <select
        value={form.category}
        onChange={(event) => updateField("category", event.target.value)}
        className="field"
      >
        {transactionCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        value={form.date}
        onChange={(event) => updateField("date", event.target.value)}
        className="field"
        type="date"
      />
      <Button type="submit" variant="accent" className="xl:col-span-1">
        <PlusCircle size={18} />
        Add transaction
      </Button>
      <input
        value={form.note}
        onChange={(event) => updateField("note", event.target.value)}
        className="field md:col-span-2 xl:col-span-5"
        placeholder="Note"
        type="text"
      />
    </form>
  );
}
