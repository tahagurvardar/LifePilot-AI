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
      <PageHeader
        title="Career"
        description="Shape your target role, skills, roadmap, project ideas, and job applications."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Target role"
          value={career.targetRole}
          detail="Editable below"
          icon={Target}
          color="indigo"
        />
        <StatCard
          title="Active applications"
          value={activeApplications}
          detail="Applied or interviewing"
          icon={BriefcaseBusiness}
          color="emerald"
        />
        <StatCard
          title="Progress score"
          value={`${career.progressScore}%`}
          detail="Adjust as your portfolio improves"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Career readiness"
          value={`${readiness}`}
          detail="Blended score out of 100"
          icon={Gauge}
          color="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Career profile">
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
            Target role
            <input
              value={career.targetRole}
              onChange={(event) => updateTargetRole(event.target.value)}
              className="field mt-2"
              type="text"
            />
          </label>
          <div className="mt-6">
            <ProgressBar
              label="Career Progress"
              value={career.progressScore}
              color="indigo"
              detail="Blend of skills, applications, and portfolio readiness."
            />
            <input
              value={career.progressScore}
              onChange={(event) => updateCareer({ progressScore: Number(event.target.value) })}
              className="mt-5 w-full accent-emerald-500"
              min="0"
              max="100"
              type="range"
              aria-label="Career progress score"
            />
          </div>
        </Card>

        <Card title="Skill progress" description="How strong each core skill is right now.">
          {skillProgress.length === 0 ? (
            <EmptyState icon={Gauge} title="No skills tracked yet" description="Add skills below to track their progress." />
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

      <Card className="mt-6" title="Skills map" description="Separate what you have from what to build next.">
        <div className="grid gap-6 lg:grid-cols-2">
          <SkillEditor
            title="Skills list"
            skills={career.skills}
            onAdd={(skill) => addSkill(skill, "skills")}
            onRemove={(skill) => removeSkill(skill, "skills")}
          />
          <SkillEditor
            title="Missing skills"
            skills={career.missingSkills}
            tone="amber"
            onAdd={(skill) => addSkill(skill, "missingSkills")}
            onRemove={(skill) => removeSkill(skill, "missingSkills")}
          />
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Project recommendations" description="Portfolio ideas mapped to your target role.">
          {recommendations.length === 0 ? (
            <EmptyState icon={Lightbulb} title="No recommendations" />
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

        <Card title="Career roadmap" description="A 3-month plan toward your target role.">
          {roadmap.length === 0 ? (
            <EmptyState icon={MapIcon} title="No roadmap yet" />
          ) : (
            <ol className="relative space-y-5 border-l border-neutral-200 pl-6 dark:border-white/10">
              {roadmap.map((step) => (
                <li key={step.id} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleRoadmapStep(step.id)}
                    aria-label={step.done ? "Mark step as not done" : "Mark step as done"}
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
                    {step.done && <Badge tone="emerald">Done</Badge>}
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
        title="Job application tracker"
        description="Add roles and update status as conversations move."
      >
        <JobApplicationForm onAdd={addApplication} />
        <div className="mt-5">
          <ApplicationTable applications={career.applications} onUpdate={updateApplication} />
        </div>
      </Card>
    </div>
  );
}
