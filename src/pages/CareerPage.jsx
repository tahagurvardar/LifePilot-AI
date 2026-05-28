import { BriefcaseBusiness, Target, TrendingUp } from "lucide-react";
import { ApplicationTable } from "../components/ApplicationTable";
import { Card } from "../components/Card";
import { JobApplicationForm } from "../components/JobApplicationForm";
import { PageHeader } from "../components/PageHeader";
import { ProgressBar } from "../components/ProgressBar";
import { SkillEditor } from "../components/SkillEditor";
import { StatCard } from "../components/StatCard";
import { useDemoData } from "../hooks/useDemoData";

export default function CareerPage() {
  const {
    data,
    addApplication,
    addSkill,
    removeSkill,
    updateApplication,
    updateCareer,
    updateProfile
  } = useDemoData();
  const activeApplications = data.career.applications.filter((application) =>
    ["Applied", "Interview"].includes(application.status)
  ).length;

  function updateTargetRole(value) {
    updateCareer({ targetRole: value });
    updateProfile({ targetRole: value });
  }

  return (
    <div>
      <PageHeader
        title="Career"
        description="Shape your target role, skills, job applications, and progress score."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Target role"
          value={data.career.targetRole}
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
          title="Career progress score"
          value={`${data.career.progressScore}%`}
          detail="Adjust as your portfolio improves"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Career profile">
          <label className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
            Target role
            <input
              value={data.career.targetRole}
              onChange={(event) => updateTargetRole(event.target.value)}
              className="field mt-2"
              type="text"
            />
          </label>
          <div className="mt-6">
            <ProgressBar
              label="Career Progress"
              value={data.career.progressScore}
              color="indigo"
              detail="Blend of skills, applications, and portfolio readiness."
            />
            <input
              value={data.career.progressScore}
              onChange={(event) => updateCareer({ progressScore: Number(event.target.value) })}
              className="mt-5 w-full accent-emerald-500"
              min="0"
              max="100"
              type="range"
            />
          </div>
        </Card>

        <Card title="Skills map" description="Separate what you have from what to build next.">
          <div className="grid gap-6 lg:grid-cols-2">
            <SkillEditor
              title="Skills list"
              skills={data.career.skills}
              onAdd={(skill) => addSkill(skill, "skills")}
              onRemove={(skill) => removeSkill(skill, "skills")}
            />
            <SkillEditor
              title="Missing skills"
              skills={data.career.missingSkills}
              tone="amber"
              onAdd={(skill) => addSkill(skill, "missingSkills")}
              onRemove={(skill) => removeSkill(skill, "missingSkills")}
            />
          </div>
        </Card>
      </div>

      <Card
        className="mt-6"
        title="Job application tracker"
        description="Add roles and update status as conversations move."
      >
        <JobApplicationForm onAdd={addApplication} />
        <div className="mt-5">
          <ApplicationTable applications={data.career.applications} onUpdate={updateApplication} />
        </div>
      </Card>
    </div>
  );
}
