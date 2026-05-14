import { Calendar, Database, Filter, Info, Layers, MapPin, ShieldCheck } from "lucide-react";
import {
  PROGRAM_KEYS,
  PROGRAM_LABELS,
  RANGES_OPT,
  STATE_KEYS,
  STATE_LABELS,
  UI,
  type Answer,
  type Language,
  type ProgramKey,
  type StateKey,
} from "@/lib/mock-data";

type Props = {
  state: StateKey;
  onStateChange: (s: StateKey) => void;
  program: ProgramKey;
  onProgramChange: (p: ProgramKey) => void;
  rangeKey: string;
  onRangeChange: (r: string) => void;
  latestAnswer?: Answer;
  language: Language;
};

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function RightRail({ state, onStateChange, program, onProgramChange, rangeKey, onRangeChange, latestAnswer, language }: Props) {
  const t = UI[language];
  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-border bg-surface-1/60 xl:flex">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3 w-3" /> {t.contextHeader}
        </div>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Layers className="h-3 w-3" /> {t.program}</div>
            <div className="flex flex-wrap gap-1.5">
              {PROGRAM_KEYS.map((p) => (
                <Pill key={p} active={program === p} onClick={() => onProgramChange(p)}>{PROGRAM_LABELS[language][p]}</Pill>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {t.state}</div>
            <div className="flex flex-wrap gap-1.5">
              {STATE_KEYS.map((s) => (
                <Pill key={s} active={state === s} onClick={() => onStateChange(s)}>{STATE_LABELS[language][s]}</Pill>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Calendar className="h-3 w-3" /> {t.dateRange}</div>
            <div className="flex flex-wrap gap-1.5">
              {RANGES_OPT[language].map((r) => (
                <Pill key={r.key} active={rangeKey === r.key} onClick={() => onRangeChange(r.key)}>{r.label}</Pill>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Info className="h-3 w-3" /> {t.sourceTrace}
        </div>
        {latestAnswer ? (
          <div className="mt-3 space-y-3 text-xs">
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.table}</div>
              <div className="mt-1 font-mono text-foreground">{latestAnswer.source.table}</div>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.filters}</div>
              <ul className="mt-1.5 space-y-1">
                {latestAnswer.source.filters.map((f) => (
                  <li key={f} className="font-mono text-foreground/80">· {f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.timeRange}</div>
              <div className="mt-1 text-foreground/90">{latestAnswer.source.timeRange}</div>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.rows}</div>
              <div className="mt-1 font-mono text-foreground">{latestAnswer.source.rows.toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">—</p>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-start gap-2 rounded-lg bg-surface-2 p-3 text-[11px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
          <span>{t.groundedNote}</span>
        </div>
        <div className="mt-2 flex items-center justify-center">
          <a href="https://elevate.shikshalokam.org/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <Database className="h-3 w-3" /> {t.trustChip}
          </a>
        </div>
      </div>
    </aside>
  );
}
