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
      <PageHeader
        title="Finance"
        description="Track income, expenses, budget, savings rate, transactions, categories, and goal progress."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.totalBalance, currency)}
          detail="Available demo balance"
          icon={WalletCards}
          color="emerald"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(summary.monthlyIncome, currency)}
          detail="Income in latest active month"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(summary.monthlyExpenses, currency)}
          detail="Expenses in latest active month"
          icon={ReceiptText}
          color="rose"
        />
        <StatCard
          title="Savings Rate"
          value={formatPercent(summary.savingsRate)}
          detail="Monthly surplus efficiency"
          icon={PiggyBank}
          color="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Add transaction" description="Create income or expense records for the demo.">
          <TransactionForm onSubmit={addTransaction} />
        </Card>

        <Card
          title="Monthly budget"
          description="Set a spending limit and watch usage update live."
          action={budget.overBudget ? <Badge tone="rose"><AlertTriangle size={13} />Over budget</Badge> : null}
        >
          <ProgressBar
            label="Budget used"
            value={budget.usage}
            color={budget.overBudget ? "amber" : "emerald"}
            detail={`${formatCurrency(budget.spent, currency)} spent of ${formatCurrency(
              budget.limit,
              currency
            )} this month`}
          />
          <label className="mt-5 block text-sm font-bold text-neutral-700 dark:text-neutral-200">
            Monthly limit
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
              ? `You are ${formatCurrency(budget.spent - budget.limit, currency)} over the limit.`
              : `${formatCurrency(budget.remaining, currency)} left for this month.`}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card title="Income and expense charts" description="Compare monthly movement with Recharts.">
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

        <Card title="Expense categories" description="Top spending areas.">
          {categorySeries.length === 0 ? (
            <EmptyState
              icon={PieChartIcon}
              title="No expenses to break down"
              description="Add an expense transaction to see your category breakdown chart."
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

      <Card className="mt-6" title="Savings goal" description={data.savingsGoal.name}>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ProgressBar
              label={data.savingsGoal.name}
              value={savingsProgress}
              detail={`${formatCurrency(data.savingsGoal.current, currency)} saved of ${formatCurrency(
                data.savingsGoal.target,
                currency
              )}`}
            />
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900">
              <Target size={20} className="text-emerald-600 dark:text-emerald-300" />
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {formatCurrency(
                  Math.max(data.savingsGoal.target - data.savingsGoal.current, 0),
                  currency
                )}{" "}
                left to reach your goal.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Current saved
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
              Target
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
        title="Transaction list"
        description="Filter, edit, and remove demo transactions."
        action={
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="field min-w-40"
            aria-label="Filter by category"
          >
            <option value="All">All categories</option>
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
              ? "Add your first income or expense to see it listed here."
              : `No transactions in "${categoryFilter}". Try a different category.`
          }
        />
      </Card>
    </div>
  );
}
