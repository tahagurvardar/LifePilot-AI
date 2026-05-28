import { Bot, Send, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { useDemoData } from "../hooks/useDemoData";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { buildAdvisorResponse } from "../utils/finance";

export default function AIAdvisorPage() {
  const { data } = useDemoData();
  const currency = data.preferences.currency;
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useLocalStorage("lifepilot_advisor_messages", [
    {
      role: "assistant",
      text: "Ask me about budgeting, savings, career moves, job applications, or resume focus."
    }
  ]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim()) return;

    const answer = buildAdvisorResponse(question, data, currency);
    setMessages((current) => [
      ...current,
      { role: "user", text: question.trim() },
      { role: "assistant", text: answer }
    ]);
    setQuestion("");
  }

  const quickPrompts = [
    "How can I save more next month?",
    "What career skill should I build?",
    "How should I improve my resume?"
  ];

  return (
    <div>
      <PageHeader
        title="AI Advisor"
        description="Ask a question and get smart mock guidance using your finance and career context."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <Card className="min-h-[620px]" title="Advisor chat">
          <div className="flex h-[460px] flex-col gap-4 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-950">
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
              placeholder="Ask about finance, career, resume, or jobs"
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
              <p className="font-bold text-neutral-950 dark:text-white">Quick questions</p>
              <div className="mt-3 space-y-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setQuestion(prompt)}
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
