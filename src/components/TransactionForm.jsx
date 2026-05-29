import { PlusCircle, Save, X } from "lucide-react";
import { useState } from "react";
import { transactionCategories } from "../data/demoData";
import { useI18n } from "../hooks/useI18n";
import { Button } from "./Button";

const today = () => new Date().toISOString().slice(0, 10);

function emptyForm() {
  return {
    type: "expense",
    amount: "",
    category: "Food",
    note: "",
    date: today()
  };
}

function validate(form) {
  const errors = {};
  const amount = Number(form.amount);

  if (form.amount === "" || Number.isNaN(amount)) {
    errors.amount = "Enter an amount.";
  } else if (amount <= 0) {
    errors.amount = "Amount must be greater than 0.";
  } else if (amount > 1_000_000) {
    errors.amount = "Amount looks too large.";
  }

  if (!form.category) errors.category = "Pick a category.";

  if (!form.date) {
    errors.date = "Pick a date.";
  } else if (Number.isNaN(new Date(form.date).getTime())) {
    errors.date = "Date is not valid.";
  }

  return errors;
}

/**
 * Shared form used for both creating and editing a transaction.
 * Pass `initialValues` + `mode="edit"` to reuse it inside the list.
 */
export function TransactionForm({ onSubmit, onCancel, initialValues, mode = "add" }) {
  const { t } = useI18n();
  const [form, setForm] = useState(() => ({ ...emptyForm(), ...initialValues }));
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({ ...form, amount: Number(form.amount) });
    if (mode === "add") setForm(emptyForm());
  }

  const isEdit = mode === "edit";

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      <select
        value={form.type}
        onChange={(event) => updateField("type", event.target.value)}
        className="field"
        aria-label={t("finance.expense")}
      >
        <option value="expense">{t("finance.expense")}</option>
        <option value="income">{t("finance.income")}</option>
      </select>

      <div>
        <input
          value={form.amount}
          onChange={(event) => updateField("amount", event.target.value)}
          className="field"
          min="1"
          step="0.01"
          placeholder={t("finance.amount")}
          type="number"
          aria-label={t("finance.amount")}
          aria-invalid={Boolean(errors.amount)}
        />
        {errors.amount && (
          <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-300">{errors.amount}</p>
        )}
      </div>

      <select
        value={form.category}
        onChange={(event) => updateField("category", event.target.value)}
        className="field"
        aria-label={t("finance.category")}
      >
        {transactionCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div>
        <input
          value={form.date}
          onChange={(event) => updateField("date", event.target.value)}
          className="field"
          type="date"
          aria-label={t("career.date")}
          aria-invalid={Boolean(errors.date)}
        />
        {errors.date && (
          <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-300">{errors.date}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="accent" className="flex-1">
          {isEdit ? <Save size={18} /> : <PlusCircle size={18} />}
          {isEdit ? t("common.save") : t("common.add")}
        </Button>
        {isEdit && onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} aria-label={t("common.cancel")}>
            <X size={18} />
          </Button>
        )}
      </div>

      <input
        value={form.note}
        onChange={(event) => updateField("note", event.target.value)}
        className="field md:col-span-2 xl:col-span-5"
        placeholder={t("finance.note")}
        type="text"
        aria-label={t("finance.note")}
      />
    </form>
  );
}
