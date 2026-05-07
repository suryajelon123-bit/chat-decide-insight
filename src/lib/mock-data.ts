export type Language = "en" | "hi" | "es";

export type AnswerBlock =
  | { type: "kpi"; label: string; value: string; delta?: string; deltaDir?: "up" | "down" | "flat" }
  | { type: "trend"; label: string; points: number[]; period: string }
  | { type: "interpretation"; text: string }
  | { type: "drivers"; items: { label: string; impact: string; tone: "neg" | "pos" | "neutral" }[] }
  | { type: "remedials"; items: string[] }
  | { type: "breakdown"; label: string; rows: { name: string; value: string; delta?: string; tone?: "pos" | "neg" }[] }
  | { type: "followups"; items: string[] };

export type Source = {
  table: string;
  filters: string[];
  timeRange: string;
  rows: number;
};

export type Answer = {
  id: string;
  question: string;
  language: Language;
  source: Source;
  blocks: AnswerBlock[];
  createdAt: string;
};

export type Turn =
  | { id: string; role: "user"; text: string; language: Language; createdAt: string }
  | { id: string; role: "assistant"; answer: Answer };

export const SUGGESTED_PROMPTS: Record<string, string[]> = {
  "Program Manager": [
    "Why did completion rate drop in the North region last week?",
    "Top 5 districts by active users this month",
    "What action should I take for blocks at risk of missing targets?",
  ],
  "Analytics Admin": [
    "Show anomalies in survey submissions over the last 14 days",
    "Compare onboarding funnel between Q3 and Q4",
    "Which programs have the steepest drop-off this month?",
  ],
  "District Lead": [
    "How is my district performing vs. state average?",
    "Which schools have the lowest engagement?",
    "Recommend interventions for low-performing blocks",
  ],
};

export const RECENT_THREADS = [
  { id: "t1", title: "Drop in completion — North region", time: "2h ago" },
  { id: "t2", title: "Weekly active users trend", time: "Yesterday" },
  { id: "t3", title: "Survey submissions anomaly", time: "2d ago" },
  { id: "t4", title: "Top performing districts Q4", time: "5d ago" },
];

const sampleAnswers: Record<string, Omit<Answer, "id" | "question" | "language" | "createdAt">> = {
  default: {
    source: {
      table: "fact_program_engagement",
      filters: ["region = North", "program = Literacy", "date ∈ last 7d"],
      timeRange: "Nov 1 – Nov 7, 2026",
      rows: 18420,
    },
    blocks: [
      { type: "kpi", label: "Completion rate", value: "62.4%", delta: "−7.8 pp vs prior 7d", deltaDir: "down" },
      {
        type: "trend",
        label: "Daily completion rate",
        period: "Last 14 days",
        points: [71, 70, 72, 69, 70, 68, 70, 67, 65, 64, 63, 62, 61, 62],
      },
      {
        type: "interpretation",
        text: "Completion rate in the North region declined steadily over the last 9 days, falling 7.8 percentage points below the prior week. The drop is concentrated in 3 districts that together account for 64% of the regional decline.",
      },
      {
        type: "drivers",
        items: [
          { label: "Bareilly district — content sync failures", impact: "−3.1 pp", tone: "neg" },
          { label: "Lower active session length (avg 4.2 → 2.8 min)", impact: "−2.4 pp", tone: "neg" },
          { label: "Field staff coverage gap (week 45)", impact: "−1.8 pp", tone: "neg" },
          { label: "New module rollout in 2 districts", impact: "+0.5 pp", tone: "pos" },
        ],
      },
      {
        type: "breakdown",
        label: "Districts driving the decline",
        rows: [
          { name: "Bareilly", value: "54.1%", delta: "−12.3 pp", tone: "neg" },
          { name: "Moradabad", value: "58.7%", delta: "−9.1 pp", tone: "neg" },
          { name: "Rampur", value: "60.2%", delta: "−6.4 pp", tone: "neg" },
          { name: "Pilibhit", value: "68.9%", delta: "−1.2 pp", tone: "neg" },
        ],
      },
      {
        type: "remedials",
        items: [
          "Trigger content re-sync for Bareilly district devices and verify within 24h.",
          "Schedule a field coordinator check-in for the 3 most-impacted blocks this week.",
          "Send a nudge to learners with sessions < 3 min over the last 5 days.",
          "Review the new module rollout pacing — consider staggering to remaining districts.",
        ],
      },
      {
        type: "followups",
        items: [
          "Show the same breakdown by block within Bareilly",
          "Compare with South region for the same period",
          "What was the last successful sync timestamp per district?",
        ],
      },
    ],
  },
  topPerformers: {
    source: {
      table: "fact_user_activity",
      filters: ["program = Literacy", "month = Nov 2026"],
      timeRange: "Nov 1 – Nov 30, 2026",
      rows: 5240,
    },
    blocks: [
      { type: "kpi", label: "Total active users", value: "184,210", delta: "+12.4% MoM", deltaDir: "up" },
      {
        type: "breakdown",
        label: "Top 5 districts by active users",
        rows: [
          { name: "Lucknow", value: "24,810", delta: "+18.2%", tone: "pos" },
          { name: "Kanpur", value: "21,440", delta: "+14.7%", tone: "pos" },
          { name: "Varanasi", value: "19,210", delta: "+11.3%", tone: "pos" },
          { name: "Agra", value: "17,820", delta: "+9.8%", tone: "pos" },
          { name: "Meerut", value: "16,540", delta: "+8.1%", tone: "pos" },
        ],
      },
      {
        type: "interpretation",
        text: "Active users grew 12.4% month-over-month, driven primarily by sustained adoption in the top 5 districts. Lucknow leads both in absolute volume and growth rate.",
      },
      {
        type: "followups",
        items: [
          "Why is Lucknow growing faster than peers?",
          "Show the bottom 5 districts for the same period",
          "Drill into Lucknow by block",
        ],
      },
    ],
  },
  remedial: {
    source: {
      table: "fact_block_performance",
      filters: ["risk_score >= 0.7", "state = Uttar Pradesh"],
      timeRange: "Last 30 days",
      rows: 312,
    },
    blocks: [
      { type: "kpi", label: "Blocks at risk", value: "47", delta: "+9 vs last month", deltaDir: "up" },
      {
        type: "interpretation",
        text: "47 blocks are flagged as at-risk of missing this quarter's targets. Common patterns: low session frequency, high drop-off after module 2, and reduced field touchpoints.",
      },
      {
        type: "remedials",
        items: [
          "Prioritize 12 high-impact blocks for this week's coordinator visits.",
          "Push a simplified module-2 review to learners stuck > 7 days.",
          "Enable WhatsApp nudges for inactive learners in flagged blocks.",
          "Re-allocate 4 field staff from over-performing districts for the next 3 weeks.",
        ],
      },
      {
        type: "followups",
        items: [
          "Show the 12 high-impact blocks",
          "What worked in similar at-risk blocks last quarter?",
          "Estimate target recovery if remedials are applied",
        ],
      },
    ],
  },
};

export function generateAnswer(question: string, language: Language): Answer {
  const q = question.toLowerCase();
  let template = sampleAnswers.default;
  if (q.includes("top") || q.includes("active users") || q.includes("performing")) template = sampleAnswers.topPerformers;
  else if (q.includes("action") || q.includes("risk") || q.includes("recommend") || q.includes("intervention")) template = sampleAnswers.remedial;

  return {
    id: crypto.randomUUID(),
    question,
    language,
    createdAt: new Date().toISOString(),
    ...template,
  };
}

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "es", label: "Spanish", native: "Español" },
];

export const ROLES = ["Program Manager", "Analytics Admin", "District Lead"] as const;
