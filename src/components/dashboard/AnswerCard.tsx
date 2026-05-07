import { ArrowDownRight, ArrowUpRight, Database, Lightbulb, ListChecks, Sparkles, TrendingUp, ChevronRight, Share2 } from "lucide-react";
import type { Answer, AnswerBlock } from "@/lib/mock-data";
import { Sparkline } from "./Sparkline";

function Badge({ tone, children }: { tone: "fact" | "insight"; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        tone === "fact" ? "bg-fact/15 text-fact" : "bg-insight/15 text-insight"
      }`}
    >
      {tone === "fact" ? <Database className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      {tone === "fact" ? "Fact" : "Insight"}
    </span>
  );
}

function BlockRenderer({ block, onFollowup }: { block: AnswerBlock; onFollowup?: (q: string) => void }) {
  switch (block.type) {
    case "kpi":
      return (
        <div className="animate-rise rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{block.label}</div>
              <div className="mt-2 font-mono text-4xl font-semibold tracking-tight text-foreground">{block.value}</div>
            </div>
            <Badge tone="fact" />
          </div>
          {block.delta && (
            <div className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${
              block.deltaDir === "down" ? "text-danger" : block.deltaDir === "up" ? "text-success" : "text-muted-foreground"
            }`}>
              {block.deltaDir === "down" ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              {block.delta}
            </div>
          )}
        </div>
      );
    case "trend":
      return (
        <div className="animate-rise-delay-1 rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> {block.label}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{block.period}</div>
            </div>
            <Badge tone="fact" />
          </div>
          <div className="mt-4">
            <Sparkline points={block.points} height={72} />
          </div>
        </div>
      );
    case "interpretation":
      return (
        <div className="animate-rise-delay-2 rounded-xl bg-surface-1 p-5 ring-insight">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-insight">
              <Lightbulb className="h-3.5 w-3.5" /> Interpretation
            </div>
            <Badge tone="insight" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{block.text}</p>
        </div>
      );
    case "drivers":
      return (
        <div className="animate-rise-delay-2 rounded-xl bg-surface-1 p-5 ring-insight">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-insight">
              <Sparkles className="h-3.5 w-3.5" /> Likely drivers
            </div>
            <Badge tone="insight" />
          </div>
          <ul className="space-y-2">
            {block.items.map((d, i) => (
              <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2/60 px-3 py-2 text-sm">
                <span className="text-foreground/90">{d.label}</span>
                <span className={`font-mono text-xs font-semibold ${d.tone === "neg" ? "text-danger" : d.tone === "pos" ? "text-success" : "text-muted-foreground"}`}>
                  {d.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "breakdown":
      return (
        <div className="animate-rise-delay-3 rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{block.label}</div>
            <Badge tone="fact" />
          </div>
          <div className="divide-y divide-border/60">
            {block.rows.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-foreground/90">{r.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-foreground">{r.value}</span>
                  {r.delta && (
                    <span className={`font-mono text-xs ${r.tone === "neg" ? "text-danger" : "text-success"}`}>{r.delta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "remedials":
      return (
        <div className="animate-rise-delay-3 rounded-xl bg-gradient-to-br from-insight/10 to-transparent p-5 ring-insight">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-insight">
              <ListChecks className="h-3.5 w-3.5" /> Recommended remedials
            </div>
            <Badge tone="insight" />
          </div>
          <ol className="space-y-2.5">
            {block.items.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-insight/20 font-mono text-[10px] font-semibold text-insight">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "followups":
      return (
        <div className="animate-rise-delay-4">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Ask a follow-up</div>
          <div className="flex flex-wrap gap-2">
            {block.items.map((f) => (
              <button
                key={f}
                onClick={() => onFollowup?.(f)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs text-foreground/80 transition hover:border-primary/60 hover:bg-surface-2 hover:text-foreground"
              >
                {f}
                <ChevronRight className="h-3 w-3 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      );
  }
}

export function AnswerCard({ answer, onFollowup }: { answer: Answer; onFollowup?: (q: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3 w-3" /> <span className="font-mono">{answer.source.table}</span>
          </span>
          <span>·</span>
          <span>{answer.source.timeRange}</span>
          <span>·</span>
          <span className="font-mono">{answer.source.rows.toLocaleString()} rows</span>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2 hover:text-foreground">
          <Share2 className="h-3 w-3" /> Share
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {answer.blocks
          .filter((b) => b.type === "kpi" || b.type === "trend")
          .map((b, i) => (
            <BlockRenderer key={i} block={b} />
          ))}
      </div>

      <div className="space-y-3">
        {answer.blocks
          .filter((b) => b.type !== "kpi" && b.type !== "trend" && b.type !== "followups")
          .map((b, i) => (
            <BlockRenderer key={i} block={b} />
          ))}
      </div>

      {answer.blocks
        .filter((b) => b.type === "followups")
        .map((b, i) => (
          <BlockRenderer key={`f-${i}`} block={b} onFollowup={onFollowup} />
        ))}
    </div>
  );
}
