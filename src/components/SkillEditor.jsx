import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../hooks/useI18n";

export function SkillEditor({ title, skills, tone = "emerald", onAdd, onRemove }) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const chipClass =
    tone === "amber"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";

  function handleSubmit(event) {
    event.preventDefault();
    onAdd(value);
    setValue("");
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-neutral-950 dark:text-white">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${chipClass}`}
          >
            {skill}
            <button
              type="button"
              onClick={() => onRemove(skill)}
              aria-label={`Remove ${skill}`}
              className="rounded-full p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="field"
          placeholder={t("career.addSkill")}
          type="text"
        />
        <button
          type="submit"
          aria-label={`Add ${title}`}
          className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-neutral-950 text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
