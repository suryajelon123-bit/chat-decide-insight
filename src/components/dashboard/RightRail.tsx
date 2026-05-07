import { Calendar, Database, Filter, Info, MapPin, ShieldCheck } from "lucide-react";
import type { Answer } from "@/lib/mock-data";

type Props = {
  region: string;
  onRegionChange: (r: string) => void;
  program: string;
  onProgramChange: (p: string) => void;
  dateRange: string;
  onDateRangeChange: (d: string) => void;
  latestAnswer?: Answer;
};

const REGIONS = ["All India", "North", "South", "East", "West"];
const PROGRAMS = ["All programs", "Literacy", "Numeracy", "Health", "Skills"];
const RANGES = ["Today", "Last 7 days", "Last 30 days", "This quarter"];

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

export function RightRail({ region, onRegionChange, program, onProgramChange, dateRange, onDateRangeChange, latestAnswer }: Props) {
  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-border bg-surface-1/60 xl:flex">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3 w-3" /> Active context
        </div>
        <div className="mt-3 space-y-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> Region</div>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => <Pill key={r} active={region === r} onClick={() => onRegionChange(r)}>{r}</Pill>)}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Database className="h-3 w-3" /> Program</div>
            <div className="flex flex-wrap gap-1.5">
              {PROGRAMS.map((p) => <Pill key={p} active={program === p} onClick={() => onProgramChange(p)}>{p}</Pill>)}
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Calendar className="h-3 w-3" /> Date range</div>
            <div className="flex flex-wrap gap-1.5">
              {RANGES.map((d) => <Pill key={d} active={dateRange === d} onClick={() => onDateRangeChange(d)}>{d}</Pill>)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Info className="h-3 w-3" /> Source trace
        </div>
        {latestAnswer ? (
          <div className="mt-3 space-y-3 text-xs">
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Table</div>
              <div className="mt-1 font-mono text-foreground">{latestAnswer.source.table}</div>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Filters applied</div>
              <ul className="mt-1.5 space-y-1">
                {latestAnswer.source.filters.map((f) => (
                  <li key={f} className="font-mono text-foreground/80">· {f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Time range</div>
              <div className="mt-1 text-foreground/90">{latestAnswer.source.timeRange}</div>
            </div>
            <div className="rounded-lg bg-surface-2 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Rows scanned</div>
              <div className="mt-1 font-mono text-foreground">{latestAnswer.source.rows.toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">Source trace will appear here once you ask a question.</p>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex items-start gap-2 rounded-lg bg-surface-2 p-3 text-[11px] text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
          <span>
            <span className="font-semibold text-foreground/90">Grounded responses.</span> Metric values come from validated queries. Insights and remedials are AI-generated and clearly labeled.
          </span>
        </div>
      </div>
    </aside>
  );
}
