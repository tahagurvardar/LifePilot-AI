import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  PiggyBank,
  Plus,
  ReceiptText,
  Sparkles,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { ExportReportButton } from "../components/ExportReportButton";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { ScoreRing } from "../components/ScoreRing";
import { StatCard } from "../components/StatCard";
import { useDemoData } from "../hooks/useDemoData";
import { useI18n } from "../hooks/useI18n";
import {
  buildActivityFeed,
  buildMonthlySeries,
  buildWeeklyInsight,
  calculateBudgetUsage,
  calculateCareerReadiness,
  calculateFinanceSummary,
  calculateFinancialHealthScore,
  formatCurrency,
  formatPercent
} from "../utils/finance";

const quickActions = [
  { to: "/app/finance", labelKey: "dashboard.addTransaction", icon: Plus, tone: "emerald" },
  { to: "/app/career", labelKey: "dashboard.trackJob", icon: BriefcaseBusiness, tone: "indigo" },
  { to: "/app/resume", labelKey: "dashboard.analyzeResume", icon: FileText, tone: "amber" },
  { to: "/app/advisor", labelKey: "dashboard.askAdvisor", icon: Sparkles, tone: "rose" }
];

const actionTones = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-300"
};

function statusTone(status) {
  if (status === "Offer") return "emerald";
  if (status === "Interview") return "amber";
  if (status === "Rejected") return "rose";
  return "indigo";
}

export default function DashboardPage() {
  const { data } = useDemoData();
  const { t } = useI18n();
  const currency = data.preferences.currency;
  const firstName = (data.profile.name || "there").split(" ")[0];
  const summary = calculateFinanceSummary(data);
  const monthlySeries = buildMonthlySeries(data.transactions);
  const budget = calculateBudgetUsage(data);
  const savingsProgress = (data.savingsGoal.current / data.savingsGoal.target) * 100;
  const healthScore = calculateFinancialHealthScore(data);
  const readinessScore = calculateCareerReadiness(data);
  const activity = buildActivityFeed(data, 6);
  const weeklyInsight = buildWeeklyInsight(data, currency);

  return (
    <div>
      <PageHeader
        title={t("dashboard.greeting", { name: firstName })}
        description={t("dashboard.subtitle")}
        action={<ExportReportButton />}
      />

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
          detail={
            budget.limit > 0
              ? t("dashboard.expensesBudgetDetail", {
                  usage: formatPercent(budget.usage),
                  limit: formatCurrency(budget.limit, currency)
                })
              : t("dashboard.expensesDriftDetail")
          }
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

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card title={t("dashboard.financialHealth")} description={t("dashboard.financialHealthDesc")}>
          <div className="flex items-center gap-5">
            <ScoreRing value={healthScore} tone="emerald" label="/ 100" />
            <div className="space-y-2 text-sm">
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.savingsRateLabel")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {formatPercent(summary.savingsRate)}
                </span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.budgetUsed")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {budget.limit > 0 ? formatPercent(budget.usage) : "-"}
                </span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.goal")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {formatPercent(savingsProgress)}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card title={t("dashboard.careerReadiness")} description={data.career.targetRole}>
          <div className="flex items-center gap-5">
            <ScoreRing value={readinessScore} tone="indigo" label="/ 100" />
            <div className="space-y-2 text-sm">
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.progress")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {data.career.progressScore}%
                </span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.activeApplications")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {
                    data.career.applications.filter((job) =>
                      ["Applied", "Interview"].includes(job.status)
                    ).length
                  }
                </span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400">
                {t("dashboard.skillsTracked")}{" "}
                <span className="font-bold text-neutral-950 dark:text-white">
                  {(data.career.skillProgress ?? []).length}
                </span>
              </p>
            </div>
          </div>
        </Card>

        <Card title={t("dashboard.weeklyInsight")} description={t("dashboard.weeklyInsightDesc")}>
          <div className="flex h-full flex-col">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Sparkles size={20} />
              </div>
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{weeklyInsight}</p>
            </div>
            <Link to="/app/advisor" className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-300">
              {t("dashboard.openAdvisor")} &rarr;
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-6" title={t("dashboard.quickActions")} description={t("dashboard.quickActionsDesc")}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ to, labelKey, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className="focus-ring flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:-translate-y-0.5 hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-lg ${actionTones[tone]}`}>
                <Icon size={18} />
              </span>
              {t(labelKey)}
            </Link>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card title={t("dashboard.incomeExpenses")} description={t("dashboard.incomeExpensesDesc")}>
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

        <Card title={t("dashboard.savingsGoal")} description={data.savingsGoal.name}>
          <ProgressBar
            label={data.savingsGoal.name}
            value={savingsProgress}
            detail={`${formatCurrency(data.savingsGoal.current, currency)} of ${formatCurrency(
              data.savingsGoal.target,
              currency
            )}`}
          />
          <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white dark:bg-white dark:text-neutral-950">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={24} />
              <div>
                <p className="text-sm opacity-70">{t("dashboard.careerScore")}</p>
                <p className="text-4xl font-bold">{data.career.progressScore}%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card
        className="mt-6"
        title={t("dashboard.recentActivity")}
        description={t("dashboard.recentActivityDesc")}
        action={
          <Link to="/app/finance" className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
            {t("dashboard.viewAll")}
          </Link>
        }
      >
        <div className="space-y-3">
          {activity.map((event) => {
            const title =
              event.kind === "transaction"
                ? t(event.type === "income" ? "finance.income" : "finance.expense")
                : event.title;
            return (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-950"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      event.kind === "application"
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
                        : event.type === "income"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                    }`}
                  >
                    {event.kind === "application" ? (
                      <BriefcaseBusiness size={18} />
                    ) : event.type === "income" ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-neutral-950 dark:text-white">
                      {title}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {event.detail} - {event.date}
                    </p>
                  </div>
                </div>
                {event.kind === "transaction" ? (
                  <p
                    className={`shrink-0 text-sm font-bold ${
                      event.type === "income"
                        ? "text-emerald-600 dark:text-emerald-300"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {event.type === "income" ? "+" : "-"}
                    {formatCurrency(event.amount, currency)}
                  </p>
                ) : (
                  <Badge tone={statusTone(event.status)}>{event.status}</Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
