import {
  Bot,
  GraduationCap,
  Info,
  PiggyBank,
  Send,
  Trash2,
  TrendingUp,
  UserRound,
  WalletCards
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useDemoData } from "../hooks/useDemoData";
import { useI18n } from "../hooks/useI18n";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildAdvisorResponse } from "../utils/finance";

const suggestionTypes = [
  { id: "auto", labelKey: "advisor.typeAuto", promptKey: "advisor.promptAuto", icon: Bot },
  { id: "finance", labelKey: "advisor.typeFinance", promptKey: "advisor.promptFinance", icon: WalletCards },
  { id: "career", labelKey: "advisor.typeCareer", promptKey: "advisor.promptCareer", icon: TrendingUp },
  { id: "saving", labelKey: "advisor.typeSaving", promptKey: "advisor.promptSaving", icon: PiggyBank },
  { id: "study", labelKey: "advisor.typeStudy", promptKey: "advisor.promptStudy", icon: GraduationCap }
];

export default function AIAdvisorPage() {
  const { data } = useDemoData();
  const { t } = useI18n();
  const currency = data.preferences.currency;
  const [question, setQuestion] = useState("");
  const [activeType, setActiveType] = useState("auto");
  // Stored without a translated welcome string so the disclaimer can localize freely.
  const [messages, setMessages] = useLocalStorage("lifepilot_advisor_messages", []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim()) return;

    const answer = buildAdvisorResponse(question, data, currency, activeType);
    setMessages((current) => [
      ...current,
      { role: "user", text: question.trim() },
      { role: "assistant", type: activeType, text: answer }
    ]);
    setQuestion("");
  }

  function clearConversation() {
    setMessages([]);
  }

  // The welcome bubble is rendered (not stored) so it always matches the language.
  const renderedMessages = messages.length
    ? messages
    : [{ role: "assistant", type: "auto", text: t("advisor.welcome") }];

  return (
    <div>
      <PageHeader
        title={t("advisor.title")}
        description={t("advisor.desc")}
        action={
          <Button variant="secondary" size="sm" onClick={clearConversation}>
            <Trash2 size={16} />
            {t("advisor.clearChat")}
          </Button>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300" />
        <p className="text-sm leading-6 text-amber-800 dark:text-amber-200">{t("advisor.disclaimer")}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <Card className="min-h-[620px]" title={t("advisor.chat")} description={t("advisor.chatDesc")}>
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestionTypes.map(({ id, labelKey, promptKey, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveType(id);
                  if (!question.trim()) setQuestion(t(promptKey));
                }}
                className={`focus-ring inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  activeType === id
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                }`}
              >
                <Icon size={14} />
                {t(labelKey)}
              </button>
            ))}
          </div>

          <div className="flex h-[420px] flex-col gap-4 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-950">
            {renderedMessages.map((message, index) => {
              const isUser = message.role === "user";
              const Icon = isUser ? UserRound : Bot;

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <Icon size={18} />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      isUser
                        ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                        : "bg-white text-neutral-700 shadow-sm dark:bg-neutral-900 dark:text-neutral-200"
                    }`}
                  >
                    {!isUser && message.type && message.type !== "auto" && (
                      <span className="mb-2 block">
                        <Badge tone="emerald">
                          {(() => {
                            const match = suggestionTypes.find((item) => item.id === message.type);
                            return match ? t(match.labelKey) : message.type;
                          })()}
                        </Badge>
                      </span>
                    )}
                    {message.text}
                  </div>
                  {isUser && (
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                      <Icon size={18} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="field"
              placeholder={t("advisor.inputPlaceholder")}
              type="text"
            />
            <Button type="submit" variant="accent">
              <Send size={18} />
              {t("common.send")}
            </Button>
          </form>
        </Card>

        <Card title={t("advisor.contextUsed")}>
          <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
              <p className="font-bold text-neutral-950 dark:text-white">{t("advisor.finance")}</p>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                {t("advisor.financeContext", { currency, goal: data.savingsGoal.name })}
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
              <p className="font-bold text-neutral-950 dark:text-white">{t("advisor.career")}</p>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                {t("advisor.careerContext", {
                  role: data.career.targetRole,
                  score: data.career.progressScore
                })}
              </p>
            </div>
            <div>
              <p className="font-bold text-neutral-950 dark:text-white">{t("advisor.suggestedQuestions")}</p>
              <div className="mt-3 space-y-2">
                {suggestionTypes.map(({ id, promptKey }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveType(id);
                      setQuestion(t(promptKey));
                    }}
                    className="focus-ring w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-sm font-semibold text-neutral-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                  >
                    {t(promptKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
