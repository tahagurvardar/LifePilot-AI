import { PiggyBank, ReceiptText, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
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
import { Card } from "../components/Card";
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
  calculateFinanceSummary,
  formatCurrency,
  formatPercent
} from "../utils/finance";

const pieColors = ["#10b981", "#4f46e5", "#f59e0b", "#ef4444", "#14b8a6", "#6366f1"];

export default function FinancePage() {
  const { data, addTransaction, removeTransaction, updateSavingsGoal } = useDemoData();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const currency = data.preferences.currency;
  const summary = calculateFinanceSummary(data);
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
        description="Track income, expenses, savings rate, transactions, categories, and your goal progress."
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
          <TransactionForm onAdd={addTransaction} />
        </Card>

        <Card title="Savings goal" description={data.savingsGoal.name}>
          <ProgressBar
            label="Emergency fund"
            value={savingsProgress}
            detail={`${formatCurrency(data.savingsGoal.current, currency)} saved of ${formatCurrency(
              data.savingsGoal.target,
              currency
            )}`}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
              Current saved
              <input
                value={data.savingsGoal.current}
                onChange={(event) =>
                  updateSavingsGoal({ current: Math.max(0, Number(event.target.value)) })
                }
                className="field mt-2"
                type="number"
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
              />
            </label>
          </div>
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
          <div className="h-80">
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
        </Card>
      </div>

      <Card
        className="mt-6"
        title="Transaction list"
        description="Filter transactions by category and remove demo entries."
        action={
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="field min-w-40"
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
        />
      </Card>
    </div>
  );
}
