// Bump DATA_VERSION whenever the demo data shape or default profile changes.
// runMigrations() (see utils/migrations.js) uses it to safely reset stale demo
// data in the browser, so old saved profiles never linger after a deploy.
export const DATA_VERSION = 2;

export const demoUsers = [
  {
    id: "demo-user",
    name: "Jordan Blake",
    email: "demo@lifepilot.ai",
    password: "demo123",
    role: "Product Manager",
    country: "United States"
  }
];

export const currencies = ["USD", "EUR", "GBP", "TRY", "AZN"];
export const languages = ["English", "Turkish"];
export const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "Turkey",
  "Azerbaijan",
  "Canada",
  "Remote / Global"
];

export const transactionCategories = [
  "Salary",
  "Freelance",
  "Investments",
  "Housing",
  "Food",
  "Transport",
  "Learning",
  "Health",
  "Shopping",
  "Savings"
];

// The four core statuses requested for the tracker. "Saved" stays for backward
// compatibility with previously stored demo applications.
export const jobStatuses = ["Applied", "Interview", "Offer", "Rejected", "Saved"];

export function createDemoData(user = demoUsers[0]) {
  return {
    version: DATA_VERSION,
    profile: {
      name: user?.name ?? "Jordan Blake",
      email: user?.email ?? "demo@lifepilot.ai",
      role: user?.role ?? "Product Manager",
      country: user?.country ?? "United States",
      targetRole: "Senior Product Manager"
    },
    preferences: {
      currency: "USD",
      language: "English"
    },
    openingBalance: 5400,
    budget: {
      monthlyLimit: 3200
    },
    savingsGoal: {
      name: "Emergency fund",
      current: 7600,
      target: 12000
    },
    transactions: [
      { id: "tx-1", type: "income", amount: 5200, category: "Salary", note: "May salary", date: "2026-05-03" },
      { id: "tx-2", type: "income", amount: 900, category: "Freelance", note: "Product audit project", date: "2026-05-13" },
      { id: "tx-3", type: "expense", amount: 1350, category: "Housing", note: "Rent and utilities", date: "2026-05-05" },
      { id: "tx-4", type: "expense", amount: 620, category: "Food", note: "Groceries and cafes", date: "2026-05-16" },
      { id: "tx-5", type: "expense", amount: 280, category: "Transport", note: "Metro, taxi, fuel", date: "2026-05-19" },
      { id: "tx-6", type: "expense", amount: 420, category: "Learning", note: "AI product course", date: "2026-05-21" },
      { id: "tx-7", type: "income", amount: 5000, category: "Salary", note: "April salary", date: "2026-04-03" },
      { id: "tx-8", type: "expense", amount: 2550, category: "Housing", note: "April living costs", date: "2026-04-15" },
      { id: "tx-9", type: "income", amount: 5000, category: "Salary", note: "March salary", date: "2026-03-03" },
      { id: "tx-10", type: "expense", amount: 3000, category: "Shopping", note: "Laptop upgrade", date: "2026-03-12" },
      { id: "tx-11", type: "income", amount: 4750, category: "Salary", note: "February salary", date: "2026-02-03" },
      { id: "tx-12", type: "expense", amount: 2360, category: "Health", note: "Wellness and insurance", date: "2026-02-17" }
    ],
    career: {
      targetRole: "Senior Product Manager",
      progressScore: 74,
      skills: [
        "Product strategy",
        "Stakeholder management",
        "Agile delivery",
        "SQL basics",
        "Market research",
        "Roadmapping"
      ],
      missingSkills: ["Advanced analytics", "AI product design", "Financial modeling"],
      skillProgress: [
        { name: "Product strategy", level: 82 },
        { name: "Stakeholder management", level: 76 },
        { name: "Data & analytics", level: 58 },
        { name: "AI product design", level: 41 },
        { name: "Financial modeling", level: 35 }
      ],
      projectRecommendations: [
        {
          id: "rec-1",
          title: "AI Budgeting Assistant case study",
          description:
            "Design an AI-powered budgeting flow end to end: problem framing, prompt design, guardrails, and a success metric.",
          tags: ["AI product", "Fintech", "Discovery"]
        },
        {
          id: "rec-2",
          title: "Career analytics dashboard",
          description:
            "Build a dashboard that scores job-search momentum so you can demonstrate analytics and product sense together.",
          tags: ["Analytics", "Dashboards"]
        },
        {
          id: "rec-3",
          title: "Pricing experiment teardown",
          description:
            "Pick a SaaS product, model two pricing tiers, and write the experiment plan you would run as PM.",
          tags: ["Financial modeling", "Strategy"]
        }
      ],
      roadmap: [
        {
          id: "road-1",
          phase: "Month 1",
          title: "Sharpen the analytics core",
          description: "Finish an advanced analytics course and rebuild one dashboard with real metrics.",
          done: true
        },
        {
          id: "road-2",
          phase: "Month 2",
          title: "Ship an AI product case study",
          description: "Publish a portfolio case study covering prompt design, evaluation, and launch risks.",
          done: false
        },
        {
          id: "road-3",
          phase: "Month 3",
          title: "Run a senior-level interview loop",
          description: "Complete two mock interviews and convert one active application into an offer conversation.",
          done: false
        }
      ],
      applications: [
        { id: "job-1", company: "Northstar Labs", role: "Senior Product Manager", status: "Interview", date: "2026-05-18" },
        { id: "job-2", company: "Finova Studio", role: "Growth Product Manager", status: "Applied", date: "2026-05-11" },
        { id: "job-3", company: "Atlas Cloud", role: "Product Lead", status: "Offer", date: "2026-05-04" },
        { id: "job-4", company: "Brightline", role: "Senior PM, Payments", status: "Rejected", date: "2026-04-22" }
      ]
    }
  };
}

// Merge stored workspace data over the latest defaults so older saved sessions
// gain any new fields (budget, skillProgress, roadmap, ...) without crashing.
export function hydrateDemoData(stored, user = demoUsers[0]) {
  const defaults = createDemoData(user);
  if (!stored || typeof stored !== "object") return defaults;

  return {
    ...defaults,
    ...stored,
    profile: { ...defaults.profile, ...stored.profile },
    preferences: { ...defaults.preferences, ...stored.preferences },
    budget: { ...defaults.budget, ...stored.budget },
    savingsGoal: { ...defaults.savingsGoal, ...stored.savingsGoal },
    transactions: Array.isArray(stored.transactions) ? stored.transactions : defaults.transactions,
    career: {
      ...defaults.career,
      ...stored.career,
      skills: stored.career?.skills ?? defaults.career.skills,
      missingSkills: stored.career?.missingSkills ?? defaults.career.missingSkills,
      skillProgress: stored.career?.skillProgress ?? defaults.career.skillProgress,
      projectRecommendations:
        stored.career?.projectRecommendations ?? defaults.career.projectRecommendations,
      roadmap: stored.career?.roadmap ?? defaults.career.roadmap,
      applications: stored.career?.applications ?? defaults.career.applications
    }
  };
}
