export const demoUsers = [
  {
    id: "demo-user",
    name: "Aylin Mammadova",
    email: "demo@lifepilot.ai",
    password: "demo123",
    role: "Product Manager",
    location: "Baku, Azerbaijan"
  }
];

export const currencies = ["AZN", "TRY", "USD"];
export const languages = ["English", "Turkish"];

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

export const jobStatuses = ["Applied", "Interview", "Offer", "Rejected", "Saved"];

export function createDemoData(user = demoUsers[0]) {
  return {
    profile: {
      name: user?.name ?? "Demo User",
      email: user?.email ?? "demo@lifepilot.ai",
      role: user?.role ?? "Product Manager",
      location: user?.location ?? "Baku, Azerbaijan",
      targetRole: "Senior Product Manager"
    },
    preferences: {
      currency: "AZN",
      language: "English"
    },
    openingBalance: 5400,
    savingsGoal: {
      name: "Emergency fund",
      current: 7600,
      target: 12000
    },
    transactions: [
      {
        id: "tx-1",
        type: "income",
        amount: 5200,
        category: "Salary",
        note: "May salary",
        date: "2026-05-03"
      },
      {
        id: "tx-2",
        type: "income",
        amount: 900,
        category: "Freelance",
        note: "Product audit project",
        date: "2026-05-13"
      },
      {
        id: "tx-3",
        type: "expense",
        amount: 1350,
        category: "Housing",
        note: "Rent and utilities",
        date: "2026-05-05"
      },
      {
        id: "tx-4",
        type: "expense",
        amount: 620,
        category: "Food",
        note: "Groceries and cafes",
        date: "2026-05-16"
      },
      {
        id: "tx-5",
        type: "expense",
        amount: 280,
        category: "Transport",
        note: "Metro, taxi, fuel",
        date: "2026-05-19"
      },
      {
        id: "tx-6",
        type: "expense",
        amount: 420,
        category: "Learning",
        note: "AI product course",
        date: "2026-05-21"
      },
      {
        id: "tx-7",
        type: "income",
        amount: 5000,
        category: "Salary",
        note: "April salary",
        date: "2026-04-03"
      },
      {
        id: "tx-8",
        type: "expense",
        amount: 2550,
        category: "Housing",
        note: "April living costs",
        date: "2026-04-15"
      },
      {
        id: "tx-9",
        type: "income",
        amount: 5000,
        category: "Salary",
        note: "March salary",
        date: "2026-03-03"
      },
      {
        id: "tx-10",
        type: "expense",
        amount: 3000,
        category: "Shopping",
        note: "Laptop upgrade",
        date: "2026-03-12"
      },
      {
        id: "tx-11",
        type: "income",
        amount: 4750,
        category: "Salary",
        note: "February salary",
        date: "2026-02-03"
      },
      {
        id: "tx-12",
        type: "expense",
        amount: 2360,
        category: "Health",
        note: "Wellness and insurance",
        date: "2026-02-17"
      }
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
      applications: [
        {
          id: "job-1",
          company: "Northstar Labs",
          role: "Senior Product Manager",
          status: "Interview",
          date: "2026-05-18"
        },
        {
          id: "job-2",
          company: "Finova Studio",
          role: "Growth Product Manager",
          status: "Applied",
          date: "2026-05-11"
        },
        {
          id: "job-3",
          company: "Atlas Cloud",
          role: "Product Lead",
          status: "Saved",
          date: "2026-05-04"
        }
      ]
    }
  };
}
