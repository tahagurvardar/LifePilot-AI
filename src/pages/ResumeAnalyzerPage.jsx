import { CheckCircle2, FileSearch, Lightbulb, Rocket, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useDemoData } from "../hooks/useDemoData";

function buildFeedback(text, targetRole) {
  const hasMetrics = /\d|%|revenue|growth|saved|reduced|increased/i.test(text);
  const hasAI = /ai|machine learning|automation|llm|data/i.test(text);
  const hasProjects = /project|case study|portfolio|launched|built/i.test(text);

  return {
    strengths: [
      hasMetrics
        ? "You already include measurable impact, which makes your achievements easier to trust."
        : "Your resume has a clear base structure that can be upgraded with stronger outcome metrics.",
      `The positioning can map well to ${targetRole} with a tighter summary and role-specific proof.`
    ],
    weaknesses: [
      hasAI
        ? "AI experience is present, but it should be tied to product or business outcomes."
        : "AI or analytics experience is not visible enough for modern product roles.",
      "Several bullets could shift from responsibilities to concrete decisions, results, and scope."
    ],
    improvements: [
      "Rewrite top bullets with action, scope, metric, and business result.",
      "Add a compact skills section with analytics, product discovery, roadmap, and stakeholder tools.",
      "Make the first three lines answer: role, domain, proof, and target direction."
    ],
    projects: [
      hasProjects
        ? "Turn your strongest project into a one-page case study with problem, insight, tradeoffs, and result."
        : "Build a portfolio case study for a personal finance dashboard with user research and metrics.",
      "Create an AI product brief that shows prompt design, evaluation criteria, and launch risks."
    ]
  };
}

function FeedbackBlock({ title, icon: Icon, items, tone }) {
  const toneClass =
    tone === "rose"
      ? "text-rose-600 bg-rose-500/10 dark:text-rose-300"
      : tone === "amber"
        ? "text-amber-600 bg-amber-500/10 dark:text-amber-300"
        : "text-emerald-600 bg-emerald-500/10 dark:text-emerald-300";

  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
          <Icon size={20} />
        </div>
        <h2 className="font-bold text-neutral-950 dark:text-white">{title}</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function ResumeAnalyzerPage() {
  const { data } = useDemoData();
  const [resumeText, setResumeText] = useState(
    "Product Manager with experience launching customer onboarding improvements, running discovery interviews, and coordinating roadmap delivery across design and engineering."
  );
  const [feedback, setFeedback] = useState(null);

  function analyzeResume() {
    setFeedback(buildFeedback(resumeText, data.career.targetRole));
  }

  return (
    <div>
      <PageHeader
        title="Resume Analyzer"
        description="Paste resume text and generate structured mock AI feedback for your target role."
      />

      <Card title="Resume text" description={`Target role: ${data.career.targetRole}`}>
        <textarea
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
          className="field min-h-72 resize-y leading-7"
          placeholder="Paste your resume text here"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {resumeText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
          <Button onClick={analyzeResume} disabled={!resumeText.trim()}>
            <FileSearch size={18} />
            Analyze resume
          </Button>
        </div>
      </Card>

      {feedback && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <FeedbackBlock title="Strengths" icon={CheckCircle2} items={feedback.strengths} />
          <FeedbackBlock title="Weaknesses" icon={TriangleAlert} items={feedback.weaknesses} tone="rose" />
          <FeedbackBlock
            title="Suggested improvements"
            icon={Lightbulb}
            items={feedback.improvements}
            tone="amber"
          />
          <FeedbackBlock title="Recommended projects" icon={Rocket} items={feedback.projects} />
        </div>
      )}
    </div>
  );
}
