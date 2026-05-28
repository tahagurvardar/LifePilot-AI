const currencyLocales = {
  AZN: "az-Latn-AZ",
  TRY: "tr-TR",
  USD: "en-US"
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

export function buildAdvisorResponse(question, data, currency) {
  const normalizedQuestion = question.toLowerCase();
  const summary = calculateFinanceSummary(data);
  const topExpense = buildCategorySeries(data.transactions)[0];
  const missingSkill = data.career.missingSkills[0] ?? "portfolio storytelling";
  const activeApplications = data.career.applications.filter((job) =>
    ["Applied", "Interview"].includes(job.status)
  ).length;

  if (normalizedQuestion.includes("save") || normalizedQuestion.includes("budget")) {
    return `Your current savings rate is ${formatPercent(summary.savingsRate)}. Keep the learning budget, but cap the largest expense category${
      topExpense ? `, ${topExpense.name}, near ${formatCurrency(topExpense.value * 0.85, currency)}` : ""
    } next month and move the difference into "${data.savingsGoal.name}".`;
  }

  if (normalizedQuestion.includes("career") || normalizedQuestion.includes("job")) {
    return `For ${data.career.targetRole}, focus this week on ${missingSkill}. You have ${activeApplications} active applications, so a strong move is to ship one portfolio case study and send two tailored follow-ups.`;
  }

  if (normalizedQuestion.includes("resume") || normalizedQuestion.includes("cv")) {
    return `Your resume should connect money and career impact: quantify roadmap results, mention analytics tools, and add one AI product project that maps directly to ${data.career.targetRole}.`;
  }

  return `Your strongest next step is a balanced sprint: protect ${formatCurrency(
    Math.max(summary.monthlyIncome - summary.monthlyExpenses, 0),
    currency
  )} of monthly surplus, practice ${missingSkill}, and keep your application pipeline warm with one high-quality follow-up today.`;
}
