import {
  ArrowDownRight, ArrowUpRight, Database, Lightbulb, ListChecks,
  Sparkles, TrendingUp, ChevronRight, Share2, Target, BarChart3,
  Brain, AlertCircle, CheckCircle2, Minus, Bot, Layers, Shield,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { UI, type Answer, type AnswerBlock, type Language } from "@/lib/mock-data";
import { Sparkline } from "./Sparkline";

function SandwichLabel({ icon: Icon, label, hint }: { icon: typeof Target; label: string; hint: string }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-3">
        <Icon className="h-3 w-3 text-foreground/70" />
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80">{label}</span>
      <span className="text-[10px] text-muted-foreground">· {hint}</span>
    </div>
  );
}

function Badge({ tone, language }: { tone: "fact" | "insight"; language: Language }) {
  const t = UI[language];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
      tone === "fact" ? "bg-fact/15 text-fact" : "bg-insight/15 text-insight"
    }`}>
      {tone === "fact" ? <Database className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
      {tone === "fact" ? t.fact : t.insight}
    </span>
  );
}

function BarFill({ pct, tone }: { pct: number; tone?: "pos" | "neg" }) {
  const color = tone === "neg" ? "bg-danger/40" : tone === "pos" ? "bg-success/35" : "bg-fact/30";
  return (
    <div className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700" style={{ width: `${pct}%` }}>
      <div className={`h-full rounded-lg ${color}`} />
    </div>
  );
}

function DimBadge({ dim, tone }: { dim: string; tone: "neg" | "pos" | "neutral" }) {
  const colors = {
    neg: "bg-danger/20 text-danger border-danger/30",
    pos: "bg-success/20 text-success border-success/30",
    neutral: "bg-fact/20 text-fact border-fact/30",
  };
  return (
    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold ${colors[tone]}`}>
      {dim}
    </span>
  );
}

function BlockRenderer({ block, onFollowup, language }: {
  block: AnswerBlock;
  onFollowup?: (q: string) => void;
  language: Language;
}) {
  const t = UI[language];

  switch (block.type) {

    case "kpi": {
      const isDown = block.deltaDir === "down";
      const isUp = block.deltaDir === "up";
      return (
        <div className="animate-rise relative overflow-hidden rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-fact to-fact/30" />
          <div className="flex items-start justify-between pl-2">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</div>
              <div className="mt-2 font-mono text-4xl font-bold tracking-tight text-gradient">{block.value}</div>
            </div>
            <Badge tone="fact" language={language} />
          </div>
          {block.delta && (
            <div className={`mt-3 pl-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isDown ? "bg-danger/15 text-danger" : isUp ? "bg-success/15 text-success" : "bg-muted/40 text-muted-foreground"
            }`}>
              {isDown ? <ArrowDownRight className="h-3.5 w-3.5" /> : isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              {block.delta}
            </div>
          )}
        </div>
      );
    }

    case "trend":
      return (
        <div className="animate-rise-delay-1 rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-fact" /> {block.label}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{block.period}</div>
            </div>
            <Badge tone="fact" language={language} />
          </div>
          <div className="mt-4">
            <Sparkline points={block.points} height={80} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>min {Math.min(...block.points).toLocaleString()}</span>
            <span className="text-fact font-semibold">max {Math.max(...block.points).toLocaleString()}</span>
          </div>
        </div>
      );

    case "breakdown": {
      const maxVal = Math.max(...block.rows.map((r) => parseFloat(r.value.replace(/[^0-9.]/g, "")) || 1));
      return (
        <div className="animate-rise-delay-3 rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</div>
            <Badge tone="fact" language={language} />
          </div>
          <div className="space-y-1.5">
            {block.rows.map((r) => {
              const num = parseFloat(r.value.replace(/[^0-9.]/g, "")) || 0;
              const pct = maxVal > 0 ? Math.max(6, (num / maxVal) * 100) : 6;
              return (
                <div key={r.name} className="relative overflow-hidden rounded-lg px-3 py-2.5">
                  <BarFill pct={pct} tone={r.tone} />
                  <div className="relative flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-foreground/90 leading-snug">{r.name}</span>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="font-mono font-semibold text-foreground">{r.value}</span>
                      {r.delta && (
                        <span className={`font-mono text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                          r.tone === "neg" ? "bg-danger/15 text-danger" : "bg-success/15 text-success"
                        }`}>{r.delta}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case "drivers":
      return (
        <div className="animate-rise-delay-2 rounded-xl bg-surface-1 p-5 ring-insight">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-insight">
              <Sparkles className="h-3.5 w-3.5" /> {t.drivers}
            </div>
            <Badge tone="insight" language={language} />
          </div>
          <ul className="space-y-2.5">
            {block.items.map((d, i) => (
              <li key={i} className={`relative flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm ${
                d.tone === "neg"
                  ? "border-danger/25 bg-danger/5"
                  : d.tone === "pos"
                  ? "border-success/25 bg-success/5"
                  : "border-fact/20 bg-fact/5"
              }`}>
                <DimBadge dim={d.impact} tone={d.tone} />
                <span className="flex-1 leading-snug text-foreground/90 pt-0.5">{d.label}</span>
                {d.tone === "neg" ? (
                  <AlertCircle className="h-4 w-4 shrink-0 text-danger/70 mt-0.5" />
                ) : d.tone === "pos" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success/70 mt-0.5" />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      );

    case "interpretation":
      return (
        <div className="animate-rise-delay-2 relative overflow-hidden rounded-xl bg-surface-1 p-5 ring-insight">
          <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-insight to-insight/20" />
          <div className="mb-3 flex items-center justify-between pl-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-insight">
              <Lightbulb className="h-3.5 w-3.5" /> {t.interpretation}
            </div>
            <Badge tone="insight" language={language} />
          </div>
          <p className="pl-2 text-sm leading-relaxed text-foreground/90">{block.text}</p>
        </div>
      );

    case "remedials":
      return (
        <div className="animate-rise-delay-3 overflow-hidden rounded-xl ring-insight" style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--insight) 8%, var(--surface-1)) 0%, var(--surface-1) 100%)" }}>
          <div className="border-b border-insight/20 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-insight">
              <ListChecks className="h-3.5 w-3.5" /> {t.remedials}
            </div>
            <Badge tone="insight" language={language} />
          </div>
          <ol className="divide-y divide-insight/10">
            {block.items.map((r, i) => (
              <li key={i} className="flex gap-4 px-5 py-3.5 hover:bg-insight/5 transition-colors">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-insight/20 font-mono text-[11px] font-bold text-insight">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-foreground/90">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "theme_chart": {
      const COLORS = [
        "#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399",
        "#22d3ee", "#818cf8", "#c084fc", "#f472b6", "#94a3b8",
      ];
      const total = block.slices.reduce((a, s) => a + s.share, 0);
      return (
        <div className="animate-rise-delay-1 rounded-xl bg-surface-2 p-5 ring-fact">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</div>
            <Badge tone="fact" language={language} />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={block.slices}
                dataKey="share"
                nameKey="name"
                cx="50%"
                cy="46%"
                innerRadius={62}
                outerRadius={100}
                paddingAngle={2}
                strokeWidth={0}
              >
                {block.slices.map((s, i) => (
                  <Cell
                    key={s.name}
                    fill={COLORS[i % COLORS.length]}
                    opacity={s.focused ? 1 : 0.5}
                    stroke={s.focused ? "white" : "transparent"}
                    strokeWidth={s.focused ? 2.5 : 0}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${((value / total) * 100).toFixed(1)}%`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "oklch(0.245 0.022 240)",
                  border: "1px solid oklch(0.32 0.018 240 / 60%)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "oklch(0.96 0.005 240)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: string, entry: any) => (
                  <span style={{
                    color: entry.payload?.focused ? "oklch(0.96 0.005 240)" : "oklch(0.68 0.018 240)",
                    fontWeight: entry.payload?.focused ? 700 : 400,
                  }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {block.slices.slice(0, 6).map((s, i) => (
              <div key={s.name} className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] ${s.focused ? "bg-surface-3 ring-1 ring-white/20" : "bg-surface-1/60"}`}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], opacity: s.focused ? 1 : 0.6 }} />
                <span className={`truncate ${s.focused ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.shortName}</span>
                <span className="ml-auto font-mono font-semibold text-fact shrink-0">{((s.share / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "state_theme_table":
      return (
        <div className="animate-rise-delay-1 overflow-hidden rounded-xl bg-surface-2 ring-fact">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{block.label}</div>
            <Badge tone="fact" language={language} />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="py-2.5 pl-5 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Theme</th>
                <th className="py-2.5 pr-4 text-right text-[10px] font-bold uppercase tracking-widest text-fact">{block.biharLabel}</th>
                <th className="py-2.5 pr-5 text-right text-[10px] font-bold uppercase tracking-widest" style={{ color: "oklch(0.75 0.14 75)" }}>{block.karnLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {block.rows.map((r) => (
                <tr key={r.name} className={`group transition-colors hover:bg-surface-3/60 ${r.focused ? "bg-surface-3/80" : ""}`}>
                  <td className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{r.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground/90 leading-snug">
                          {r.name}
                          {r.focused && <span className="text-fact text-xs">◆</span>}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-snug">{r.concept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right font-mono text-sm font-semibold text-fact">{r.bihar}</td>
                  <td className="py-3 pr-5 text-right font-mono text-sm font-semibold" style={{ color: "oklch(0.75 0.14 75)" }}>{r.karnataka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "ai_analysis": {
      function renderParagraph(text: string) {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((p, i) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
            : <span key={i}>{p}</span>
        );
      }
      return (
        <div className="animate-rise-delay-1 overflow-hidden rounded-xl bg-surface-1 ring-insight">
          <div className="flex items-center gap-2.5 border-b border-insight/25 bg-insight/8 px-5 py-3">
            <Bot className="h-4 w-4 text-insight" />
            <span className="text-xs font-bold uppercase tracking-widest text-insight">Claude AI Analysis</span>
            <span className="ml-1 text-[10px] text-muted-foreground">· {block.streamLabel}</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              <span className="text-[10px] text-success font-medium">streams live</span>
            </span>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-insight">
              <Sparkles className="h-3.5 w-3.5" /> {block.title}
            </div>
            {block.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/80">{renderParagraph(p)}</p>
            ))}
            {block.table && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border/50">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-3 border-b border-border/50">
                      {block.table.headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-bold uppercase tracking-wider text-muted-foreground/80">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {block.table.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-surface-2/60 transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`px-3 py-2 ${ci >= 2 ? "font-mono font-semibold text-fact text-right" : "text-foreground/85"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "theme_matrix": {
      const CELL_COLORS: Record<string, string> = {
        shared:     "bg-purple-500/70",
        bihar:      "bg-emerald-500/70",
        karnataka:  "bg-blue-500/70",
        anomaly:    "border border-white/40 bg-transparent",
        none:       "bg-surface-3/30",
      };
      const LEGEND = [
        { key: "shared",    color: "bg-purple-500",   label: "Shared" },
        { key: "bihar",     color: "bg-emerald-500",  label: "Bihar" },
        { key: "karnataka", color: "bg-blue-500",     label: "Karnataka" },
        { key: "anomaly",   color: "border border-white/50 bg-transparent", label: "Anomaly" },
      ];
      return (
        <div className="animate-rise-delay-2 space-y-3">
          {/* PM Insight card */}
          <div className="relative overflow-hidden rounded-xl bg-surface-1 p-5 ring-insight">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-insight to-insight/20" />
            <div className="mb-2 pl-2 text-[10px] font-bold uppercase tracking-widest text-insight">{block.insightLabel}</div>
            <p className="pl-2 text-sm font-medium leading-relaxed text-foreground/90">{block.pmInsight}</p>
          </div>
          {/* Matrix table */}
          <div className="overflow-hidden rounded-xl bg-surface-2 ring-fact">
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3.5 w-3.5" /> Monthly Theme Matrix · 6-Month Drift
              </div>
              <div className="flex items-center gap-3">
                {LEGEND.map((l) => (
                  <div key={l.key} className="flex items-center gap-1.5">
                    <span className={`inline-block h-2.5 w-2.5 rounded-sm ${l.color}`} />
                    <span className="text-[10px] text-muted-foreground">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="py-2.5 pl-5 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 w-40">Theme</th>
                    {block.months.map((m) => (
                      <th key={m} className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{m}</th>
                    ))}
                    <th className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">VEL</th>
                    <th className="pr-5 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">LAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {block.rows.map((r) => (
                    <tr key={r.name} className="hover:bg-surface-3/40 transition-colors">
                      <td className="py-3 pl-5">
                        <div className="flex items-center gap-1.5 font-medium text-foreground/85 leading-snug">
                          <span>{r.emoji}</span>
                          <span className="max-w-[120px] truncate">{r.name.split(" ").slice(0, 3).join(" ")}{r.name.split(" ").length > 3 ? "…" : ""}</span>
                        </div>
                      </td>
                      {r.cells.map((c, ci) => (
                        <td key={ci} className="px-2 py-3">
                          <div className={`mx-auto h-5 w-12 rounded ${CELL_COLORS[c]}`} />
                        </td>
                      ))}
                      <td className="px-2 py-3 text-center font-mono font-semibold text-[11px] text-muted-foreground">{r.vel}</td>
                      <td className="pr-5 py-3 text-center">
                        {r.lag ? (
                          <span className="inline-flex items-center rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-bold text-danger">{r.lag}</span>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    case "pillar_grid":
      return (
        <div className="animate-rise-delay-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Shared Pillars */}
          <div className="overflow-hidden rounded-xl bg-surface-2 ring-fact">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              <Shield className="h-3.5 w-3.5 text-fact" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-fact">Shared Pillars</span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-fact/20 font-mono text-[10px] font-bold text-fact">{block.sharedCount}</span>
            </div>
            <ul className="divide-y divide-border/30">
              {block.shared.map((s) => (
                <li key={s.name} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-surface-3/50 transition-colors">
                  <span className="text-sm leading-none mt-0.5">{s.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-semibold text-foreground/90 leading-snug">{s.name.split(" ").slice(0, 2).join(" ")}</div>
                    <div className="text-[10px] text-muted-foreground leading-snug">{s.status}</div>
                  </div>
                  <span className="font-mono text-xs font-bold text-fact shrink-0">{s.pct}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bihar Hurdles */}
          <div className="overflow-hidden rounded-xl bg-surface-2" style={{ boxShadow: "inset 0 0 0 1px oklch(0.72 0.16 155 / 30%)" }}>
            <div className="flex items-center gap-2 border-b border-success/30 bg-success/5 px-4 py-3">
              <span className="text-sm">🏃</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-success">Bihar Hurdles</span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-success/20 font-mono text-[10px] font-bold text-success">{block.biharCount}</span>
            </div>
            <ul className="divide-y divide-success/10">
              {block.biharHurdles.map((h) => (
                <li key={h.name} className="px-4 py-3 hover:bg-success/5 transition-colors">
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="text-sm leading-none">{h.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground/90 leading-snug truncate">{h.name.split(" ").slice(0, 3).join(" ")}…</span>
                        {h.chronic && <span className="inline-flex items-center rounded-full bg-danger/20 px-1.5 py-0.5 text-[9px] font-bold text-danger uppercase">chronic</span>}
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-success">{h.delta}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-snug">{h.voice}</div>
                  <div className="mt-1 text-[10px] text-foreground/60 leading-snug line-clamp-2">{h.mechanism}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Karnataka Hurdles */}
          <div className="overflow-hidden rounded-xl bg-surface-2" style={{ boxShadow: "inset 0 0 0 1px oklch(0.68 0.18 220 / 30%)" }}>
            <div className="flex items-center gap-2 border-b border-blue-400/30 bg-blue-500/5 px-4 py-3">
              <span className="text-sm">🏃</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Karn. Hurdles</span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 font-mono text-[10px] font-bold text-blue-400">{block.karnCount}</span>
            </div>
            <ul className="divide-y divide-blue-400/10">
              {block.karnHurdles.map((h) => (
                <li key={h.name} className="px-4 py-3 hover:bg-blue-500/5 transition-colors">
                  <div className="flex items-start gap-2 mb-1.5">
                    <span className="text-sm leading-none">{h.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground/90 leading-snug truncate">{h.name.split(" ").slice(0, 3).join(" ")}…</span>
                        {h.chronic && <span className="inline-flex items-center rounded-full bg-danger/20 px-1.5 py-0.5 text-[9px] font-bold text-danger uppercase">chronic</span>}
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-blue-400">{h.delta}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-snug">{h.voice}</div>
                  <div className="mt-1 text-[10px] text-foreground/60 leading-snug line-clamp-2">{h.mechanism}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "followups":
      return (
        <div className="animate-rise-delay-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ask a follow-up</div>
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

export function AnswerCard({ answer, onFollowup, language }: {
  answer: Answer;
  onFollowup?: (q: string) => void;
  language: Language;
}) {
  const t = UI[language];
  const kpiBlocks = answer.blocks.filter((b) => b.type === "kpi");
  const visualBlocks = answer.blocks.filter((b) =>
    b.type === "trend" || b.type === "breakdown" || b.type === "drivers" || b.type === "theme_chart" ||
    b.type === "state_theme_table" || b.type === "ai_analysis" || b.type === "theme_matrix" || b.type === "pillar_grid"
  );
  const inferenceBlocks = answer.blocks.filter((b) =>
    b.type === "interpretation" || b.type === "remedials"
  );
  const followupBlocks = answer.blocks.filter((b) => b.type === "followups");

  return (
    <div className="space-y-4">
      {/* Source provenance bar */}
      <div className="flex items-center justify-between rounded-lg bg-surface-1/60 px-3 py-1.5 text-[11px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Database className="h-3 w-3 text-fact/70" />
          <span className="font-mono text-fact/90">{answer.source.table}</span>
          <span className="opacity-40">·</span>
          <span>{answer.source.timeRange}</span>
          <span className="opacity-40">·</span>
          <span className="font-mono">{answer.source.rows.toLocaleString()} rows</span>
        </div>
        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-surface-2 hover:text-foreground transition-colors">
          <Share2 className="h-3 w-3" /> {t.share}
        </button>
      </div>

      {/* TOP — Direct Answer */}
      {kpiBlocks.length > 0 && (
        <>
          <SandwichLabel icon={Target} label="Direct Answer" hint="the number" />
          <div className={`grid gap-3 ${kpiBlocks.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
            {kpiBlocks.map((b, i) => (
              <BlockRenderer key={`k-${i}`} block={b} language={language} />
            ))}
          </div>
        </>
      )}

      {/* MIDDLE — Visual */}
      {visualBlocks.length > 0 && (
        <>
          <SandwichLabel icon={BarChart3} label="Visual" hint="trend · breakdown · themes · state comparison" />
          <div className="space-y-3">
            {visualBlocks.map((b, i) => (
              <BlockRenderer key={`v-${i}`} block={b} language={language} />
            ))}
          </div>
        </>
      )}

      {/* BOTTOM — Strategic Inference */}
      {inferenceBlocks.length > 0 && (
        <>
          <SandwichLabel icon={Brain} label="Strategic Inference" hint="so what — and what to do" />
          <div className="space-y-3">
            {inferenceBlocks.map((b, i) => (
              <BlockRenderer key={`s-${i}`} block={b} language={language} />
            ))}
          </div>
        </>
      )}

      {/* Follow-ups */}
      {followupBlocks.map((b, i) => (
        <BlockRenderer key={`f-${i}`} block={b} onFollowup={onFollowup} language={language} />
      ))}
    </div>
  );
}
