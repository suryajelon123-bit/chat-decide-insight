import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LeftRail } from "@/components/dashboard/LeftRail";
import { RightRail } from "@/components/dashboard/RightRail";
import { ChatThread } from "@/components/dashboard/ChatThread";
import { Composer } from "@/components/dashboard/Composer";
import { generateAnswer, SUGGESTED_PROMPTS, type Language, type Turn } from "@/lib/mock-data";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lumen — Conversational Analytics Workspace" },
      { name: "description", content: "Ask metric questions in natural language. Get grounded answers, trend interpretations, likely causes, and recommended actions." },
    ],
  }),
});

function Index() {
  const [role, setRole] = useState("Program Manager");
  const [language, setLanguage] = useState<Language>("en");
  const [region, setRegion] = useState("North");
  const [program, setProgram] = useState("Literacy");
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);

  const suggestions = SUGGESTED_PROMPTS[role] ?? [];

  const handleAsk = (q: string) => {
    if (busy) return;
    const userTurn: Turn = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
      language,
      createdAt: new Date().toISOString(),
    };
    setTurns((t) => [...t, userTurn]);
    setBusy(true);
    setTimeout(() => {
      const answer = generateAnswer(q, language);
      setTurns((t) => [...t, { id: crypto.randomUUID(), role: "assistant", answer }]);
      setBusy(false);
    }, 900);
  };

  const latestAnswer = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      const t = turns[i];
      if (t.role === "assistant") return t.answer;
    }
    return undefined;
  }, [turns]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <LeftRail
        role={role}
        onRoleChange={setRole}
        language={language}
        onLanguageChange={setLanguage}
        onNewThread={() => setTurns([])}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface-1/60 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground lg:hidden">
              <PanelLeftOpen className="h-4 w-4" />
            </button>
            <div>
              <div className="text-sm font-semibold tracking-tight">Decision workspace</div>
              <div className="text-[11px] text-muted-foreground">
                <span className="text-foreground/80">{role}</span> · {region} · {program} · {dateRange}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Connected · 12 datasets
            </span>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground xl:hidden">
              <PanelRightOpen className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <ChatThread turns={turns} busy={busy} onFollowup={handleAsk} />
        </div>

        <Composer onSubmit={handleAsk} suggestions={suggestions} busy={busy} />
      </main>

      <RightRail
        region={region}
        onRegionChange={setRegion}
        program={program}
        onProgramChange={setProgram}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        latestAnswer={latestAnswer}
      />
    </div>
  );
}
