import {
  AlertTriangle,
  PieChart as PieChartIcon,
  PiggyBank,
  ReceiptText,
  Target,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";
import { transactionCategories } from "../data/demoData";
import { useDemoData } from "../hooks/useDemoData";
import { useI18n } from "../hooks/useI18n";
import {
  buildCategorySeries,
  buildMonthlySeries,
  calculateBudgetUsage,
  calculateFinanceSummary,
  formatCurrency,
  formatPercent
} from "../utils/finance";

const pieColors = ["#10b981", "#4f46e5", "#f59e0b", "#ef4444", "#14b8a6", "#6366f1"];

export default function FinancePage() {
  const {
    data,
    addTransaction,
    removeTransaction,
    updateTransaction,
    updateBudget,
    updateSavingsGoal
  } = useDemoData();
  const { t } = useI18n();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const currency = data.preferences.currency;
  const summary = calculateFinanceSummary(data);
  const budget = calculateBudgetUsage(data);
  const monthlySeries = buildMonthlySeries(data.transactions);
  const categorySeries = buildCategorySeries(data.transactions);
  const savingsProgress = (data.savingsGoal.current / data.savingsGoal.target) * 100;
  const filteredTransactions = useMemo(() => {
    if (categoryFilter === "All") return data.transactions;
    return data.transactions.filter((transaction) => transaction.category === categoryFilter);
  }, [categoryFilter, data.transactions]);

  return (
    <div>
      <PageHeader title={t("finance.title")} description={t("finance.desc")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("dashboard.totalBalance")}
          value={formatCurrency(summary.totalBalance, currency)}
          detail={t("dashboard.totalBalanceDetail")}
          icon={WalletCards}
          color="emerald"
        />
        <StatCard
          title={t("dashboard.monthlyIncome")}
          value={formatCurrency(summary.monthlyIncome, currency)}
          detail={t("dashboard.monthlyIncomeDetail")}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title={t("dashboard.monthlyExpenses")}
          value={formatCurrency(summary.monthlyExpenses, currency)}
          detail={t("dashboard.expensesDriftDetail")}
          icon={ReceiptText}
          color="rose"
        />
        <StatCard
          title={t("dashboard.savingsRate")}
          value={formatPercent(summary.savingsRate)}
          detail={t("dashboard.savingsRateDetail")}
          icon={PiggyBank}
          color="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title={t("finance.addTransaction")} description={t("finance.addTransactionDesc")}>
          <TransactionForm onSubmit={addTransaction} />
        </Card>

        <Card
          title={t("finance.monthlyBudget")}
          description={t("finance.monthlyBudgetDesc")}
          action={budget.overBudget ? <Badge tone="rose"><AlertTriangle size={13} />{t("finance.overBudget")}</Badge> : null}
        >
          <ProgressBar
            label={t("finance.budgetUsed")}
            value={budget.usage}
            color={budget.overBudget ? "amber" : "emerald"}
            detail={t("finance.spentOf", {
              spent: formatCurrency(budget.spent, currency),
              limit: formatCurrency(budget.limit, currency)
            })}
          />
          <label className="mt-5 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
            {t("finance.monthlyLimit")}
            <input
              value={data.budget.monthlyLimit}
              onChange={(event) =>
                updateBudget({ monthlyLimit: Math.max(0, Number(event.target.value)) })
              }
              className="field mt-2"
              type="number"
              min="0"
            />
          </label>
          <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
            {budget.overBudget
              ? t("finance.overByAmount", {
                  amount: formatCurrency(budget.spent - budget.limit, currency)
                })
              : t("finance.leftThisMonth", { amount: formatCurrency(budget.remaining, currency) })}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card title={t("finance.charts")} description={t("finance.chartsDesc")}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={48} />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="expenses" fill="#f59e0b" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t("finance.categories")} description={t("finance.categoriesDesc")}>
          {categorySeries.length === 0 ? (
            <EmptyState
              icon={PieChartIcon}
              title={t("finance.noExpenses")}
              description={t("finance.noExpensesDesc")}
            />
          ) : (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySeries}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={102}
                      paddingAngle={4}
                      isAnimationActive={false}
                    >
                      {categorySeries.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value, currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2">
                {categorySeries.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: pieColors[index % pieColors.length] }}
                      />
                      {item.name}
                    </span>
                    <span className="font-bold text-neutral-950 dark:text-white">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <Card className="mt-6" title={t("finance.savingsGoal")} description={data.savingsGoal.name}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ProgressBar
              label={data.savingsGoal.name}
              value={savingsProgress}
              detail={t("finance.savedOf", {
                current: formatCurrency(data.savingsGoal.current, currency),
                target: formatCurrency(data.savingsGoal.target, currency)
              })}
            />
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <Target size={20} className="text-emerald-600 dark:text-emerald-300" />
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {t("finance.leftToReach", {
                  amount: formatCurrency(
                    Math.max(data.savingsGoal.target - data.savingsGoal.current, 0),
                    currency
                  )
                })}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              {t("finance.currentSaved")}
              <input
                value={data.savingsGoal.current}
                onChange={(event) =>
                  updateSavingsGoal({ current: Math.max(0, Number(event.target.value)) })
                }
                className="field mt-2"
                type="number"
                min="0"
              />
            </label>
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              {t("finance.target")}
              <input
                value={data.savingsGoal.target}
                onChange={(event) =>
                  updateSavingsGoal({ target: Math.max(1, Number(event.target.value)) })
                }
                className="field mt-2"
                type="number"
                min="1"
              />
            </label>
          </div>
        </div>
      </Card>

      <Card
        className="mt-6"
        title={t("finance.transactionList")}
        description={t("finance.transactionListDesc")}
        action={
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="field min-w-40"
            aria-label={t("finance.filterByCategory")}
          >
            <option value="All">{t("finance.allCategories")}</option>
            {transactionCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        }
      >
        <TransactionList
          transactions={filteredTransactions}
          currency={currency}
          onRemove={removeTransaction}
          onUpdate={updateTransaction}
          emptyMessage={
            categoryFilter === "All"
              ? t("finance.emptyAll")
              : t("finance.emptyFiltered", { category: categoryFilter })
          }
        />
      </Card>
    </div>
  );
}
