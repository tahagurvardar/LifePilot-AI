import {
  BriefcaseBusiness,
  PiggyBank,
  ReceiptText,
  TrendingUp,
  WalletCards
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { useDemoData } from "../hooks/useDemoData";
import {
  buildAdvisorResponse,
  buildMonthlySeries,
  calculateFinanceSummary,
  formatCurrency,
  formatPercent
} from "../utils/finance";

export default function DashboardPage() {
  const { data } = useDemoData();
  const currency = data.preferences.currency;
  const summary = calculateFinanceSummary(data);
  const monthlySeries = buildMonthlySeries(data.transactions);
  const savingsProgress = (data.savingsGoal.current / data.savingsGoal.target) * 100;
  const recentTransactions = data.transactions.slice(0, 4);
  const recentApplications = data.career.applications.slice(0, 3);
  const advisorNote = buildAdvisorResponse("What should I do this week?", data, currency);

  return (
    <div>
      <PageHeader
        title={`Good to see you, ${data.profile.name.split(" ")[0]}`}
        description="Your finance and career signals are synced into one practical command center."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(summary.totalBalance, currency)}
          detail="All demo transactions plus opening balance"
          icon={WalletCards}
          color="emerald"
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(summary.monthlyIncome, currency)}
          detail="Latest active month"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(summary.monthlyExpenses, currency)}
          detail="Track categories before they drift"
          icon={ReceiptText}
          color="rose"
        />
        <StatCard
          title="Savings Rate"
          value={formatPercent(summary.savingsRate)}
          detail="Surplus divided by income"
          icon={PiggyBank}
          color="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card title="Income and expenses" description="Six-month view of cash movement.">
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

        <Card title="Career progress" description={data.career.targetRole}>
          <div className="grid gap-6">
            <div className="rounded-2xl bg-neutral-950 p-5 text-white dark:bg-white dark:text-neutral-950">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness size={24} />
                <div>
                  <p className="text-sm opacity-70">Score</p>
                  <p className="text-4xl font-bold">{data.career.progressScore}%</p>
                </div>
              </div>
            </div>
            <ProgressBar
              label="Savings Goal"
              value={savingsProgress}
              detail={`${formatCurrency(data.savingsGoal.current, currency)} of ${formatCurrency(
                data.savingsGoal.target,
                currency
              )}`}
            />
            <div>
              <p className="text-sm font-bold text-neutral-950 dark:text-white">AI Advisor</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {advisorNote}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Recent transactions">
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-950"
              >
                <div>
                  <p className="font-bold text-neutral-950 dark:text-white">
                    {transaction.note || transaction.category}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {transaction.category} - {transaction.date}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-neutral-900 dark:text-white"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount, currency)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Application pipeline">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySeries}>
                <defs>
                  <linearGradient id="careerLine" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="url(#careerLine)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800/60"
              >
                <div>
                  <p className="font-bold text-neutral-950 dark:text-white">{application.company}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{application.role}</p>
                </div>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
