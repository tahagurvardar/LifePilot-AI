import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  ShieldCheck,
  WalletCards
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";
import { AppLogo } from "../components/AppLogo";
import { Button } from "../components/Button";
import { ThemeToggle } from "../components/ThemeToggle";

const previewData = [
  { month: "Jan", income: 4300, expense: 2400 },
  { month: "Feb", income: 4700, expense: 2360 },
  { month: "Mar", income: 5000, expense: 3000 },
  { month: "Apr", income: 5000, expense: 2550 },
  { month: "May", income: 6100, expense: 2670 }
];

const featureSections = [
  {
    icon: WalletCards,
    title: "Finance clarity",
    copy: "Track balance, income, expenses, category trends, and savings goals in one calm dashboard."
  },
  {
    icon: BriefcaseBusiness,
    title: "Career momentum",
    copy: "Plan target roles, compare current and missing skills, and keep every job application moving."
  },
  {
    icon: FileText,
    title: "Resume feedback",
    copy: "Paste resume text and get structured mock feedback for strengths, gaps, projects, and next edits."
  },
  {
    icon: BrainCircuit,
    title: "AI advisor",
    copy: "Ask practical questions and receive smart demo guidance based on your finance and career context."
  }
];

function DashboardPreview() {
  return (
    <div className="surface overflow-hidden rounded-2xl shadow-premium dark:shadow-premium-dark">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          Dashboard
        </span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Total Balance", "31,420 AZN", "emerald"],
              ["Savings Rate", "56%", "indigo"],
              ["Monthly Income", "6,100 AZN", "emerald"],
              ["Career Progress", "74%", "amber"]
            ].map(([label, value, tone]) => (
              <div
                key={label}
                className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
              >
                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">{label}</p>
                <p
                  className={`mt-2 text-xl font-bold ${
                    tone === "amber"
                      ? "text-amber-600 dark:text-amber-300"
                      : tone === "indigo"
                        ? "text-indigo-600 dark:text-indigo-300"
                        : "text-emerald-600 dark:text-emerald-300"
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="h-56 rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={previewData}>
                <defs>
                  <linearGradient id="landingIncome" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#landingIncome)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-48 rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={previewData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="expense" fill="#f59e0b" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <p className="text-sm font-bold text-neutral-950 dark:text-white">Ask your advisor</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              You can reach your savings goal faster by protecting the May surplus and building one AI
              product portfolio case.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mist text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-soft-grid bg-[size:36px_36px] opacity-70 dark:opacity-20" />
        <div className="absolute right-[-12rem] top-24 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
        <div className="absolute left-[-10rem] bottom-8 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-400/10" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-5">
            <AppLogo />
            <div className="flex items-center gap-2">
              <ThemeToggle compact />
              <Link
                to="/login"
                className="focus-ring hidden rounded-lg px-4 py-2 text-sm font-bold text-neutral-700 transition hover:bg-white dark:text-neutral-200 dark:hover:bg-white/10 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Get started
                  <ArrowRight size={17} />
                </Button>
              </Link>
            </div>
          </nav>

          <div className="grid flex-1 content-center gap-8 py-10">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold tracking-normal text-neutral-950 dark:text-white sm:text-6xl lg:text-7xl">
                LifePilot AI
              </h1>
              <p className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-neutral-800 dark:text-neutral-100 sm:text-3xl">
                Plan money. Grow career. Move with clarity.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
                Your AI copilot for financial focus and career momentum. Track spending, build
                skills, manage applications, and turn everyday choices into a practical plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get started
                    <ArrowRight size={19} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-16 dark:border-white/10 dark:bg-neutral-900">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {featureSections.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-2xl border border-neutral-200 p-5 dark:border-white/10">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-mist py-16 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-normal text-neutral-950 dark:text-white">
              Private by design, useful from the first login.
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
              This first version is frontend-only. Demo data stays in LocalStorage, which makes the
              project simple to inspect, reset, and deploy.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "No backend required for the demo",
                "Reusable React components and routes",
                "Vercel-ready Vite build"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle2 className="text-emerald-500" size={19} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-neutral-950 p-6 text-white dark:bg-white dark:text-neutral-950">
              <BarChart3 size={26} />
              <p className="mt-6 text-3xl font-bold">56%</p>
              <p className="mt-2 text-sm opacity-75">Demo monthly savings rate</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-900">
              <ShieldCheck className="text-indigo-500" size={26} />
              <p className="mt-6 text-3xl font-bold">Local</p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Data lives in the browser for this portfolio build.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
