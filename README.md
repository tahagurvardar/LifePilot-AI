# LifePilot AI

> A portfolio-ready, frontend-only SaaS demo that combines **personal finance** and **career growth** into a single, polished dashboard — with AI-style mock guidance, PDF report export, and English/Turkish language support.

LifePilot AI is built with React, Vite, Tailwind CSS, React Router, and Recharts. All data is stored in the browser via `localStorage`, so the app runs fully without a backend, **no database, and no real AI API**, and deploys cleanly to Vercel.

---

## Overview

LifePilot AI imagines a single workspace where someone can manage their money and their career at the same time. It tracks transactions, budgets, and savings goals; maps skills and job applications; analyzes a resume; and answers questions with context-aware, AI-style mock suggestions. It is a **design and engineering portfolio piece**, not a real financial product.

## Features

- **Landing page** — hero, feature cards, "How it works", demo testimonials, demo pricing, and a professional footer. Fully responsive.
- **Dashboard** — financial health score, career readiness score, weekly AI insight, quick actions, stat cards, charts, and a recent activity feed.
- **Finance** — add / edit / delete transactions, monthly budget limit with usage tracking, category breakdown chart, savings goal tracker, category filtering, empty states, and form validation.
- **Career** — target role, skill progress bars, skills map, project recommendation cards, an interactive 3-month roadmap, and a job application tracker (Applied / Interview / Offer / Rejected).
- **Resume Analyzer** — overall score out of 100, section scores (Summary Quality, Skills Match, Experience Clarity, Project Strength), a missing-keywords list, and a copyable improved summary.
- **AI Advisor** — suggestion types (Finance advice, Career advice, Saving plan, Study plan), smarter mock responses generated from your data, conversation history persisted in `localStorage`, and a clear demo disclaimer.
- **Settings** — profile photo placeholder (initials), editable Name / Role / Country / Currency / Target role, language switch, theme switching, PDF export, and a one-click demo-data reset.
- **PDF report export** — generate a clean, professional PDF (via jsPDF) summarizing finance, career, and resume data, fully client-side. Available on the Dashboard and Settings, with success/error feedback. Includes a clear note that the AI Advisor is demo/mock, not real financial advice.
- **English / Turkish language switch** — a lightweight, frontend-only i18n layer. The selected language persists to `localStorage`, defaults to English, and updates the whole UI instantly without breaking routes or auth. User-entered data is never translated.
- **Polish** — light/dark mode, reusable UI components, loading and empty states, and a safe `localStorage` migration that resets stale demo data after deploys.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Charts | Recharts |
| Icons | lucide-react |
| PDF export | jsPDF (client-side) |
| i18n | Custom hook + dictionary (`src/i18n`) |
| Data | `localStorage` (demo only) |

## Live Demo

Deployed on Vercel as a static Vite build. Open the deployment URL, click **View live demo**, and sign in with the demo account below.

## Demo Account

- **Email:** `demo@lifepilot.ai`
- **Password:** `demo123`

The default demo profile is **Jordan Blake** (Product Manager). You can also register a local account — it is saved to `localStorage` only.

## Screenshots

> Add screenshots or a short GIF here for your portfolio.

```
/screenshots
  landing.png
  dashboard.png
  finance.png
  career.png
  resume.png
  advisor.png
```

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Create a production build
npm run build

# 4. Preview the production build locally
npm run preview
```

The app is frontend-only and ready to deploy on Vercel as a Vite project (build command `npm run build`, output directory `dist`).

## Project Structure

```
src/
  components/   Reusable UI (Card, Button, Badge, ScoreRing, EmptyState, Footer, ExportReportButton, ...)
  data/         Demo data + default profile (demoData.js)
  hooks/        Auth, demo data, theme, i18n, and localStorage hooks
  i18n/         Translation dictionary (en/tr) + translate helper
  layouts/      Dashboard shell (sidebar + top navbar)
  pages/        Landing, Login, Register, Dashboard, Finance, Career, Resume, Advisor, Settings
  utils/        Finance math, scoring, advisor logic, PDF report, storage, migrations
```

## Internationalization (i18n)

The UI ships in **English (default)** and **Turkish**. Language is a global, app-level
setting stored under the `lifepilot_lang` key in `localStorage` and managed by
`I18nProvider` (`src/hooks/useI18n.jsx`). Components read strings with the
`t("namespace.key")` helper; missing Turkish keys fall back to English. Add or edit
copy in `src/i18n/translations.js`. User-entered data and enum values (job statuses,
categories) are intentionally left untranslated.

## Future Improvements

- Real backend with authentication and database persistence.
- Genuine AI integration for the advisor and resume analysis.
- Real bank/transaction import and multi-currency conversion.
- Multiple savings goals and recurring transactions.
- Shared/coach workspaces and exportable reports.
- Automated tests (unit + end-to-end).

## Portfolio Description

LifePilot AI demonstrates end-to-end frontend product thinking: a marketing landing page, an authenticated app shell, data visualization, form handling with validation, derived metrics and scoring, mock AI interactions, theming, responsive design, and clean component architecture — all without a backend. The codebase is intentionally organized and documented so it is easy for another developer (or coding agent) to extend.

> **Disclaimer:** This is a demo project. It does not provide real financial, legal, or career advice, and stores no data outside your browser.
