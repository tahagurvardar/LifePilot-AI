import { ArrowDownRight, ArrowUpRight, Pencil, ReceiptText, Trash2 } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { TransactionForm } from "./TransactionForm";
import { useI18n } from "../hooks/useI18n";
import { formatCurrency } from "../utils/finance";

export function TransactionList({ transactions, currency, onRemove, onUpdate, emptyMessage }) {
  const { t } = useI18n();
  const [editingId, setEditingId] = useState(null);

  if (!transactions.length) {
    return (
      <EmptyState
        icon={ReceiptText}
        title={t("finance.noTransactions")}
        description={emptyMessage ?? t("finance.emptyAll")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10">
      <div className="divide-y divide-neutral-200 dark:divide-white/10">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income";
          const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

          if (editingId === transaction.id) {
            return (
              <div key={transaction.id} className="bg-neutral-50 p-4 dark:bg-neutral-900">
                <TransactionForm
                  mode="edit"
                  initialValues={transaction}
                  onSubmit={(updates) => {
                    onUpdate?.(transaction.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            );
          }

          return (
            <div
              key={transaction.id}
              className="grid grid-cols-[1fr_auto] gap-3 bg-white px-4 py-3 dark:bg-neutral-950 sm:grid-cols-[1.4fr_0.8fr_0.7fr_auto]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl ${
                    isIncome
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-950 dark:text-white">
                    {transaction.note || transaction.category}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <p
                  className={`text-sm font-bold ${
                    isIncome
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount, currency)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:hidden">
                  {transaction.date}
                </p>
              </div>
              <p className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:block">
                {transaction.date}
              </p>
              <div className="flex items-center gap-1">
                {onUpdate && (
                  <button
                    type="button"
                    onClick={() => setEditingId(transaction.id)}
                    aria-label={t("common.edit")}
                    className="focus-ring rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(transaction.id)}
                  aria-label={t("common.delete")}
                  className="focus-ring rounded-lg p-2 text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
