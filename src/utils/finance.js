const currencyLocales = {
  AZN: "az-Latn-AZ",
  TRY: "tr-TR",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB"
};

export function formatCurrency(amount, currency = "AZN") {
  return new Intl.NumberFormat(currencyLocales[currency] ?? "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function latestTransactionDate(transactions) {
  if (!transactions.length) {
    return new Date();
  }

  return transactions
    .map((transaction) => new Date(transaction.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];
}

export function isSameMonth(dateString, referenceDate) {
  const date = new Date(dateString);
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  );
}

export function calculateFinanceSummary(data) {
  const transactions = data.transactions ?? [];
  const referenceDate = latestTransactionDate(transactions);
  const monthlyTransactions = transactions.filter((transaction) =>
    isSameMonth(transaction.date, referenceDate)
  );

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const monthlyExpenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalBalance = Number(data.openingBalance ?? 0) + totalIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    savingsRate: Math.max(0, savingsRate),
    referenceDate
  };
}

export function buildMonthlySeries(transactions) {
  const referenceDate = latestTransactionDate(transactions);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      income: 0,
      expenses: 0
    };
  });

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = months.find((item) => item.key === key);
    if (!month) return;

    if (transaction.type === "income") {
      month.income += Number(transaction.amount);
    } else {
      month.expenses += Number(transaction.amount);
    }
  });

  return months.map(({ key, ...month }) => month);
}

export function buildCategorySeries(transactions) {
  const grouped = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] ?? 0) + Number(transaction.amount);
      return acc;
    }, {});

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export function calculateBudgetUsage(data) {
  const summary = calculateFinanceSummary(data);
  const limit = Number(data.budget?.monthlyLimit ?? 0);
  const spent = summary.monthlyExpenses;
  const usage = limit > 0 ? (spent / limit) * 100 : 0;

  return {
    limit,
    spent,
    remaining: Math.max(limit - spent, 0),
    usage,
    overBudget: limit > 0 && spent > limit
  };
}

// 0-100 score blending savings rate, budget adherence, and runway.
export function calculateFinancialHealthScore(data) {
  const summary = calculateFinanceSummary(data);
  const budget = calculateBudgetUsage(data);

  const savingsScore = Math.min(summary.savingsRate, 40) / 40; // up to 40% savings rate = full marks
  const budgetScore = budget.limit > 0 ? Math.max(0, 1 - budget.usage / 100) : 0.6;
  const goalProgress = data.savingsGoal?.target
    ? Math.min(data.savingsGoal.current / data.savingsGoal.target, 1)
    : 0.5;

  const score = savingsScore * 45 + budgetScore * 30 + goalProgress * 25;
  return Math.round(Math.min(Math.max(score, 0), 100));
}

// 0-100 score blending progress score, skill levels, and pipeline activity.
export function calculateCareerReadiness(data) {
  const career = data.career ?? {};
  const progress = Number(career.progressScore ?? 0);
  const skillLevels = career.skillProgress ?? [];
  const avgSkill = skillLevels.length
    ? skillLevels.reduce((sum, skill) => sum + Number(skill.level || 0), 0) / skillLevels.length
    : progress;
  const pipeline = (career.applications ?? []).filter((job) =>
    ["Applied", "Interview", "Offer"].includes(job.status)
  ).length;
  const pipelineScore = Math.min(pipeline / 4, 1) * 100;

  const score = progress * 0.5 + avgSkill * 0.35 + pipelineScore * 0.15;
  return Math.round(Math.min(Math.max(score, 0), 100));
}

const ACTIVITY_LABELS = {
  income: "Income recorded",
  expense: "Expense logged"
};

// Combined, date-sorted feed from transactions and job applications.
export function buildActivityFeed(data, limit = 6) {
  const transactionEvents = (data.transactions ?? []).map((transaction) => ({
    id: `tx-${transaction.id}`,
    kind: "transaction",
    type: transaction.type,
    title: ACTIVITY_LABELS[transaction.type] ?? "Transaction",
    detail: transaction.note || transaction.category,
    amount: transaction.amount,
    category: transaction.category,
    date: transaction.date
  }));

  const applicationEvents = (data.career?.applications ?? []).map((application) => ({
    id: `job-${application.id}`,
    kind: "application",
    status: application.status,
    title: `${application.company} - ${application.status}`,
    detail: application.role,
    date: application.date
  }));

  return [...transactionEvents, ...applicationEvents]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// A short "weekly AI insight" string for the dashboard card.
export function buildWeeklyInsight(data, currency) {
  const summary = calculateFinanceSummary(data);
  const budget = calculateBudgetUsage(data);
  const surplus = Math.max(summary.monthlyIncome - summary.monthlyExpenses, 0);
  const missingSkill = data.career?.missingSkills?.[0] ?? "portfolio storytelling";

  const budgetLine = budget.overBudget
    ? `You are ${formatCurrency(budget.spent - budget.limit, currency)} over your monthly budget, so trim one flexible category this week.`
    : `You are tracking inside your monthly budget with ${formatCurrency(budget.remaining, currency)} of room left.`;

  return `${budgetLine} Protect ${formatCurrency(
    surplus,
    currency
  )} of surplus and spend 3 focused hours on ${missingSkill} to push your career score up.`;
}

const ADVISOR_TYPE_HINTS = {
  finance: ["save", "budget", "spend", "money", "expense", "balance"],
  career: ["career", "job", "skill", "role", "interview", "promotion"],
  saving: ["saving", "save plan", "goal", "emergency", "fund"],
  study: ["study", "learn", "course", "practice", "skill plan"]
};

function detectType(question) {
  const normalized = question.toLowerCase();
  for (const [type, hints] of Object.entries(ADVISOR_TYPE_HINTS)) {
    if (hints.some((hint) => normalized.includes(hint))) return type;
  }
  return "general";
}

/**
 * Generates a smart mock advisor reply. An explicit `type` (finance, career,
 * saving, study) takes priority; otherwise the type is inferred from the text.
 * Demo only — not real financial advice.
 */
export function buildAdvisorResponse(question, data, currency, type = "auto") {
  const summary = calculateFinanceSummary(data);
  const budget = calculateBudgetUsage(data);
  const topExpense = buildCategorySeries(data.transactions)[0];
  const missingSkill = data.career?.missingSkills?.[0] ?? "portfolio storytelling";
  const targetRole = data.career?.targetRole ?? "your target role";
  const activeApplications = (data.career?.applications ?? []).filter((job) =>
    ["Applied", "Interview"].includes(job.status)
  ).length;

  const resolvedType = type && type !== "auto" ? type : detectType(question);

  if (resolvedType === "finance") {
    return `Your savings rate is ${formatPercent(summary.savingsRate)} and you have ${formatCurrency(
      budget.remaining,
      currency
    )} left in this month's budget. Cap ${
      topExpense ? `"${topExpense.name}" near ${formatCurrency(topExpense.value * 0.85, currency)}` : "your largest category"
    } and automate the difference into savings.`;
  }

  if (resolvedType === "saving") {
    const gap = Math.max((data.savingsGoal?.target ?? 0) - (data.savingsGoal?.current ?? 0), 0);
    const monthly = Math.max(summary.monthlyIncome - summary.monthlyExpenses, 0);
    const months = monthly > 0 ? Math.ceil(gap / monthly) : null;
    return `To finish "${data.savingsGoal?.name ?? "your goal"}" you still need ${formatCurrency(
      gap,
      currency
    )}. At your current surplus of ${formatCurrency(monthly, currency)}/month that is roughly ${
      months ? `${months} month${months > 1 ? "s" : ""}` : "a few months"
    }. Set an automatic transfer on payday so the plan runs itself.`;
  }

  if (resolvedType === "career") {
    return `For ${targetRole}, build "${missingSkill}" first. You have ${activeApplications} active application${
      activeApplications === 1 ? "" : "s"
    } — ship one portfolio case study this week and send two tailored follow-ups to keep momentum.`;
  }

  if (resolvedType === "study") {
    return `A focused study plan for ${targetRole}: spend week 1 on fundamentals of "${missingSkill}", week 2 building a small project, and week 3 writing it up as a case study. Aim for 4-5 hours per week and track it like a sprint.`;
  }

  return `Balanced next step: protect ${formatCurrency(
    Math.max(summary.monthlyIncome - summary.monthlyExpenses, 0),
    currency
  )} of monthly surplus, practice "${missingSkill}", and keep your application pipeline warm with one high-quality follow-up today.`;
}
