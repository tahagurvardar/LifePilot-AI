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
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildAdvisorResponse } from "../utils/finance";

const suggestionTypes = [
  { id: "auto", label: "Auto", icon: Bot },
  { id: "finance", label: "Finance advice", icon: WalletCards },
  { id: "career", label: "Career advice", icon: TrendingUp },
  { id: "saving", label: "Saving plan", icon: PiggyBank },
  { id: "study", label: "Study plan", icon: GraduationCap }
];

const typePrompts = {
  auto: "How can I improve this month?",
  finance: "How should I manage my budget this month?",
  career: "What career skill should I build next?",
  saving: "Build me a plan to hit my savings goal.",
  study: "Give me a study plan for my target role."
};

const initialMessages = [
  {
    role: "assistant",
    type: "auto",
    text: "Ask me about budgeting, savings, career moves, job applications, or a study plan. Pick a suggestion type for more focused guidance."
  }
];

export default function AIAdvisorPage() {
  const { data } = useDemoData();
  const currency = data.preferences.currency;
  const [question, setQuestion] = useState("");
  const [activeType, setActiveType] = useState("auto");
  const [messages, setMessages] = useLocalStorage("lifepilot_advisor_messages", initialMessages);

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
    setMessages(initialMessages);
  }

  return (
    <div>
      <PageHeader
        title="AI Advisor"
        description="Ask a question and get smart mock guidance using your finance and career context."
        action={
          <Button variant="secondary" size="sm" onClick={clearConversation}>
            <Trash2 size={16} />
            Clear chat
          </Button>
        }
      />

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300" />
        <p className="text-sm leading-6 text-amber-800 dark:text-amber-200">
          These are demo, AI-style suggestions generated locally from your sample data. They are not
          real financial, legal, or career advice.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <Card className="min-h-[620px]" title="Advisor chat" description="Choose a suggestion type, then ask.">
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestionTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveType(id);
                  if (!question.trim()) setQuestion(typePrompts[id]);
                }}
                className={`focus-ring inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  activeType === id
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex h-[420px] flex-col gap-4 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-950">
            {messages.map((message, index) => {
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
                          {suggestionTypes.find((t) => t.id === message.type)?.label ?? message.type}
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
              placeholder="Ask about finance, career, saving, or study"
              type="text"
            />
            <Button type="submit" variant="accent">
              <Send size={18} />
              Send
            </Button>
          </form>
        </Card>

        <Card title="Context used">
          <div className="space-y-4 text-sm">
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
              <p className="font-bold text-neutral-950 dark:text-white">Finance</p>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Currency: {currency}. Goal: {data.savingsGoal.name}.
              </p>
            </div>
            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
              <p className="font-bold text-neutral-950 dark:text-white">Career</p>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                Target: {data.career.targetRole}. Score: {data.career.progressScore}%.
              </p>
            </div>
            <div>
              <p className="font-bold text-neutral-950 dark:text-white">Suggested questions</p>
              <div className="mt-3 space-y-2">
                {Object.entries(typePrompts).map(([type, prompt]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActiveType(type);
                      setQuestion(prompt);
                    }}
                    className="focus-ring w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-sm font-semibold text-neutral-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                  >
                    {prompt}
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
