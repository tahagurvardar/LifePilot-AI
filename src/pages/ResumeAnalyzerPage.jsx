import {
  Check,
  Copy,
  FileSearch,
  Loader2,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { ScoreRing } from "../components/ScoreRing";
import { useDemoData } from "../hooks/useDemoData";

const TARGET_KEYWORDS = [
  "metrics",
  "roadmap",
  "stakeholder",
  "analytics",
  "experiment",
  "AI",
  "revenue",
  "discovery",
  "launch",
  "strategy"
];

function scoreSection(condition, high, mid, low) {
  return condition === "high" ? high : condition === "mid" ? mid : low;
}

// Detailed mock analysis. Each section gets a 0-100 score plus a short note,
// and an overall score is the rounded average. Demo only.
function analyze(text, targetRole) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const hasMetrics = /\d|%|revenue|growth|saved|reduced|increased|kpi/i.test(text);
  const hasAction = /led|launched|built|shipped|drove|owned|delivered|created/i.test(text);
  const hasProjects = /project|case study|portfolio|launched|built/i.test(text);
  const hasSkills = /sql|analytics|roadmap|stakeholder|research|strategy|figma|python/i.test(text);
  const summaryLength = words.slice(0, 40).join(" ").length;

  const missingKeywords = TARGET_KEYWORDS.filter((kw) => !lower.includes(kw.toLowerCase()));
  const matchedKeywords = TARGET_KEYWORDS.filter((kw) => lower.includes(kw.toLowerCase()));

  const summaryQuality = scoreSection(
    summaryLength > 80 && hasAction ? "high" : summaryLength > 40 ? "mid" : "low",
    86,
    64,
    42
  );
  const skillsMatch = Math.round((matchedKeywords.length / TARGET_KEYWORDS.length) * 100);
  const experienceClarity = scoreSection(
    hasMetrics && hasAction ? "high" : hasAction ? "mid" : "low",
    88,
    62,
    40
  );
  const projectStrength = scoreSection(
    hasProjects && hasMetrics ? "high" : hasProjects ? "mid" : "low",
    84,
    60,
    38
  );

  const sections = [
    {
      key: "summary",
      title: "Summary Quality",
      score: summaryQuality,
      note:
        summaryQuality >= 80
          ? "Strong, action-led opening that sets context quickly."
          : summaryQuality >= 60
            ? "Decent summary, but tighten the first two lines and lead with a result."
            : "Summary is thin. Open with role, domain, and one measurable proof point."
    },
    {
      key: "skills",
      title: "Skills Match",
      score: skillsMatch,
      note:
        skillsMatch >= 70
          ? `Good alignment with ${targetRole} expectations.`
          : `Add more role-specific keywords for ${targetRole}; see the missing list.`
    },
    {
      key: "experience",
      title: "Experience Clarity",
      score: experienceClarity,
      note:
        experienceClarity >= 80
          ? "Bullets show action, scope, and measurable outcomes."
          : experienceClarity >= 60
            ? "Shift bullets from responsibilities to decisions and results."
            : "Quantify impact: add numbers, scope, and the business result."
    },
    {
      key: "projects",
      title: "Project Strength",
      score: projectStrength,
      note:
        projectStrength >= 80
          ? "Projects read like case studies with clear outcomes."
          : projectStrength >= 60
            ? "Turn your strongest project into a one-page case study."
            : "Add a portfolio project with problem, insight, and metric."
    }
  ];

  const overall = Math.round(sections.reduce((sum, s) => sum + s.score, 0) / sections.length);

  const improvedSummary = `${targetRole} with a track record of turning ${
    hasMetrics ? "measurable outcomes" : "user and business problems"
  } into shipped products. ${
    hasSkills ? "Combines" : "Building"
  } product strategy, analytics, and stakeholder management to drive roadmap decisions. Recently ${
    hasProjects ? "led" : "exploring"
  } an AI-focused initiative with clear success metrics and a bias for fast, evidence-based iteration.`;

  return {
    overall,
    wordCount,
    sections,
    missingKeywords,
    matchedKeywords,
    improvedSummary
  };
}

function scoreTone(score) {
  if (score >= 75) return "emerald";
  if (score >= 55) return "amber";
  return "rose";
}

export default function ResumeAnalyzerPage() {
  const { data } = useDemoData();
  const [resumeText, setResumeText] = useState(
    "Product Manager with experience launching customer onboarding improvements, running discovery interviews, and coordinating roadmap delivery across design and engineering."
  );
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  function analyzeResume() {
    setAnalyzing(true);
    setCopied(false);
    // Small delay so the mock analysis shows a loading state.
    window.setTimeout(() => {
      setResult(analyze(resumeText, data.career.targetRole));
      setAnalyzing(false);
    }, 600);
  }

  async function copySummary() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.improvedSummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Resume Analyzer"
        description="Paste resume text and generate a score plus structured mock AI feedback for your target role."
      />

      <Card title="Resume text" description={`Target role: ${data.career.targetRole}`}>
        <textarea
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
          className="field min-h-72 resize-y leading-7"
          placeholder="Paste your resume text here"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{wordCount} words</p>
          <Button onClick={analyzeResume} disabled={!resumeText.trim() || analyzing}>
            {analyzing ? <Loader2 size={18} className="animate-spin" /> : <FileSearch size={18} />}
            {analyzing ? "Analyzing..." : "Analyze resume"}
          </Button>
        </div>
      </Card>

      {result && !analyzing && (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <Card title="Resume score" description="Overall, out of 100.">
              <div className="flex flex-col items-center gap-4">
                <ScoreRing value={result.overall} tone={scoreTone(result.overall)} size={148} label="/ 100" />
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                  {result.overall >= 75
                    ? "Strong resume. Polish the lowest section to stand out."
                    : result.overall >= 55
                      ? "Solid base. A few targeted edits will lift this quickly."
                      : "Early draft. Focus on metrics and keywords next."}
                </p>
              </div>
            </Card>

            <Card title="Section breakdown" description="Summary, skills, experience, and projects.">
              <div className="space-y-5">
                {result.sections.map((section) => (
                  <div key={section.key}>
                    <ProgressBar label={section.title} value={section.score} color={scoreTone(section.score)} />
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{section.note}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="Missing keywords" description="Terms that strengthen alignment with the target role.">
              {result.missingKeywords.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Nice — your resume already covers the key terms we check for.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword) => (
                    <Badge key={keyword} tone="rose">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
              {result.matchedKeywords.length > 0 && (
                <>
                  <p className="mt-5 text-sm font-bold text-neutral-700 dark:text-neutral-200">Already included</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.matchedKeywords.map((keyword) => (
                      <Badge key={keyword} tone="emerald">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card
              title="Improved summary"
              description="A polished, copyable rewrite you can adapt."
              action={
                <Button variant="secondary" size="sm" onClick={copySummary}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              }
            >
              <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300" />
                <p className="text-sm leading-7 text-neutral-700 dark:text-neutral-200">
                  {result.improvedSummary}
                </p>
              </div>
              <p className="mt-3 text-xs text-neutral-400 dark:text-neutral-500">
                Demo AI-style suggestion. Review and personalize before using.
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
