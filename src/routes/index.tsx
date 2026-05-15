import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LeftRail } from "@/components/dashboard/LeftRail";
import { RightRail } from "@/components/dashboard/RightRail";
import { ChatThread } from "@/components/dashboard/ChatThread";
import { Composer } from "@/components/dashboard/Composer";
import {
  generateAnswer,
  PROGRAM_LABELS,
  RANGES_OPT,
  STATE_LABELS,
  SUGGESTED_PROMPTS,
  UI,
  type Language,
  type ProgramKey,
  type StateKey,
  type Turn,
} from "@/lib/mock-data";
import { Download, FileSpreadsheet, FileText, FileType, PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportCSV, exportExcel, exportPDF } from "@/lib/export-conversation";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lumen — MITRA Conversational Insights" },
      { name: "description", content: "Ask anything about MITRA — Bihar Chaupal, Karnataka Chavadi, and Micro-Improvement story conversations. Multilingual: English, हिन्दी, தமிழ், ಕನ್ನಡ." },
    ],
  }),
});

function Index() {
  const [role, setRole] = useState<string>("Program Manager");
  const typedRole = (role as "Program Manager" | "Org Admin" | "Tenant Admin");
  const [language, setLanguage] = useState<Language>("en");
  const [stateFilter, setStateFilter] = useState<StateKey>("all");
  const [program, setProgram] = useState<ProgramKey>("all");
  const [rangeKey, setRangeKey] = useState<string>("30d");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);

  const t = UI[language];
  const starters = SUGGESTED_PROMPTS[language];
  const rangeLabel = RANGES_OPT[language].find((r) => r.key === rangeKey)?.label ?? rangeKey;
  const contextLine = `${role} · ${PROGRAM_LABELS[language][program]} · ${STATE_LABELS[language][stateFilter]} · ${rangeLabel}`;

  const handleAsk = (q: string) => {
    if (busy) return;
    const userTurn: Turn = {
      id: crypto.randomUUID(),
      role: "user",
      text: q,
      language,
      createdAt: new Date().toISOString(),
    };
    setTurns((prev) => [...prev, userTurn]);
    setBusy(true);
    setTimeout(() => {
      const answer = generateAnswer(q, language, { program, state: stateFilter, rangeKey, rangeLabel });
      setTurns((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", answer }]);
      setBusy(false);
    }, 800);
  };

  const latestAnswer = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      const turn = turns[i];
      if (turn.role === "assistant") return turn.answer;
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
              <div className="text-sm font-semibold tracking-tight">{t.appTagline}</div>
              <div className="text-[11px] text-muted-foreground">{contextLine}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://elevate.shikshalokam.org/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success md:inline-flex"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              {t.trustChip}
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={turns.length === 0}
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-fact to-insight px-3 py-1.5 text-xs font-semibold text-background shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export conversation</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportPDF(turns, language, contextLine)}>
                  <FileType className="mr-2 h-4 w-4 text-rose-500" />
                  <div className="flex flex-col">
                    <span className="text-sm">PDF report</span>
                    <span className="text-[10px] text-muted-foreground">Conversation + KPI snapshot</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportExcel(turns, language, contextLine)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-sm">Excel workbook</span>
                    <span className="text-[10px] text-muted-foreground">Metrics · Conversation · Breakdowns · Sources</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportCSV(turns, language)}>
                  <FileText className="mr-2 h-4 w-4 text-sky-500" />
                  <div className="flex flex-col">
                    <span className="text-sm">CSV file</span>
                    <span className="text-[10px] text-muted-foreground">Flat row-per-block export</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground xl:hidden">
              <PanelRightOpen className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1">
          <ChatThread turns={turns} busy={busy} onFollowup={handleAsk} language={language} starters={starters} />
        </div>

        <Composer onSubmit={handleAsk} suggestions={starters.slice(0, 3)} busy={busy} language={language} />
      </main>

      <RightRail
        state={stateFilter}
        onStateChange={setStateFilter}
        program={program}
        onProgramChange={setProgram}
        rangeKey={rangeKey}
        onRangeChange={setRangeKey}
        latestAnswer={latestAnswer}
        language={language}
      />
    </div>
  );
}
