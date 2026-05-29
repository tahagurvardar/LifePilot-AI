import {
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Gauge,
  Lightbulb,
  Map as MapIcon,
  Target,
  TrendingUp
} from "lucide-react";
import { ApplicationTable } from "../components/ApplicationTable";
import { Badge } from "../components/Badge";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { JobApplicationForm } from "../components/JobApplicationForm";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { SkillEditor } from "../components/SkillEditor";
import { StatCard } from "../components/StatCard";
import { useDemoData } from "../hooks/useDemoData";
import { useI18n } from "../hooks/useI18n";
import { calculateCareerReadiness } from "../utils/finance";

export default function CareerPage() {
  const {
    data,
    addApplication,
    addSkill,
    removeSkill,
    toggleRoadmapStep,
    updateApplication,
    updateCareer,
    updateProfile
  } = useDemoData();
  const { t } = useI18n();
  const career = data.career;
  const activeApplications = career.applications.filter((application) =>
    ["Applied", "Interview"].includes(application.status)
  ).length;
  const readiness = calculateCareerReadiness(data);
  const skillProgress = career.skillProgress ?? [];
  const recommendations = career.projectRecommendations ?? [];
  const roadmap = career.roadmap ?? [];

  function updateTargetRole(value) {
    updateCareer({ targetRole: value });
    updateProfile({ targetRole: value });
  }

  return (
    <div>
      <PageHeader title={t("career.title")} description={t("career.desc")} />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title={t("career.targetRole")}
          value={career.targetRole}
          detail={t("career.editableBelow")}
          icon={Target}
          color="indigo"
        />
        <StatCard
          title={t("career.activeApplications")}
          value={activeApplications}
          detail={t("career.appliedOrInterviewing")}
          icon={BriefcaseBusiness}
          color="emerald"
        />
        <StatCard
          title={t("career.progressScore")}
          value={`${career.progressScore}%`}
          detail={t("career.progressScoreDetail")}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title={t("career.careerReadiness")}
          value={`${readiness}`}
          detail={t("career.readinessDetail")}
          icon={Gauge}
          color="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title={t("career.careerProfile")}>
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
            {t("career.targetRole")}
            <input
              value={career.targetRole}
              onChange={(event) => updateTargetRole(event.target.value)}
              className="field mt-2"
              type="text"
            />
          </label>
          <div className="mt-6">
            <ProgressBar
              label={t("career.careerProgress")}
              value={career.progressScore}
              color="indigo"
              detail={t("career.careerProgressDetail")}
            />
            <input
              value={career.progressScore}
              onChange={(event) => updateCareer({ progressScore: Number(event.target.value) })}
              className="mt-5 w-full accent-emerald-500"
              min="0"
              max="100"
              type="range"
              aria-label={t("career.progressScore")}
            />
          </div>
        </Card>

        <Card title={t("career.skillProgress")} description={t("career.skillProgressDesc")}>
          {skillProgress.length === 0 ? (
            <EmptyState icon={Gauge} title={t("career.noSkills")} description={t("career.noSkillsDesc")} />
          ) : (
            <div className="space-y-5">
              {skillProgress.map((skill, index) => (
                <ProgressBar
                  key={skill.name}
                  label={skill.name}
                  value={skill.level}
                  color={index % 3 === 0 ? "emerald" : index % 3 === 1 ? "indigo" : "amber"}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6" title={t("career.skillsMap")} description={t("career.skillsMapDesc")}>
        <div className="grid gap-6 lg:grid-cols-2">
          <SkillEditor
            title={t("career.skillsList")}
            skills={career.skills}
            onAdd={(skill) => addSkill(skill, "skills")}
            onRemove={(skill) => removeSkill(skill, "skills")}
          />
          <SkillEditor
            title={t("career.missingSkills")}
            skills={career.missingSkills}
            tone="amber"
            onAdd={(skill) => addSkill(skill, "missingSkills")}
            onRemove={(skill) => removeSkill(skill, "missingSkills")}
          />
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title={t("career.recommendations")} description={t("career.recommendationsDesc")}>
          {recommendations.length === 0 ? (
            <EmptyState icon={Lightbulb} title={t("career.recommendations")} />
          ) : (
            <div className="space-y-4">
              {recommendations.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-neutral-200 p-4 dark:border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} tone="indigo">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card title={t("career.roadmap")} description={t("career.roadmapDesc")}>
          {roadmap.length === 0 ? (
            <EmptyState icon={MapIcon} title={t("career.roadmap")} />
          ) : (
            <ol className="relative space-y-5 border-l border-neutral-200 pl-6 dark:border-white/10">
              {roadmap.map((step) => (
                <li key={step.id} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleRoadmapStep(step.id)}
                    aria-label={t("career.done")}
                    className="focus-ring absolute -left-[34px] top-0 rounded-full bg-white dark:bg-neutral-900"
                  >
                    {step.done ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <Circle size={20} className="text-neutral-300 dark:text-neutral-600" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      {step.phase}
                    </span>
                    {step.done && <Badge tone="emerald">{t("career.done")}</Badge>}
                  </div>
                  <h3
                    className={`mt-1 text-sm font-bold ${
                      step.done
                        ? "text-neutral-500 line-through dark:text-neutral-400"
                        : "text-neutral-950 dark:text-white"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card
        className="mt-6"
        title={t("career.jobTracker")}
        description={t("career.jobTrackerDesc")}
      >
        <JobApplicationForm onAdd={addApplication} />
        <div className="mt-5">
          <ApplicationTable applications={career.applications} onUpdate={updateApplication} />
        </div>
      </Card>
    </div>
  );
}
