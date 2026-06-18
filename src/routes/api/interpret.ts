import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { MITRA_SYSTEM_PROMPT } from "@/lib/mitra-system-prompt";
import mitraDatasets from "@/lib/mitra-datasets.json";

const LANG_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
};

function selectDatasets(question: string): Record<string, unknown> {
  const q = question.toLowerCase();
  const all = mitraDatasets as Record<string, unknown>;
  const picks: string[] = [];
  if (/bihar|chaupal|patna/.test(q)) picks.push("wlc_bihar_chaupal", "wlc_mi_bihar");
  if (/karnataka|chavadi|mysuru|mysore|bengaluru/.test(q))
    picks.push("wlc_ka_chavadi", "wlc_mi_karnataka", "slc_ka_mi", "ylc_ka");
  if (/nagaland/.test(q)) picks.push("nagaland_mi_story");
  if (/slc|school leader/.test(q)) picks.push("slc_ka_mi");
  if (/ylc|youth/.test(q)) picks.push("ylc_ka");
  if (/wlc|women/.test(q))
    picks.push("wlc_ka_chavadi", "wlc_bihar_chaupal", "wlc_mi_karnataka", "wlc_mi_bihar");
  const chosen = (picks.length ? Array.from(new Set(picks)) : Object.keys(all)).slice(0, 4);
  const out: Record<string, unknown> = {};
  for (const k of chosen) out[k] = all[k];
  return out;
}

export const Route = createFileRoute("/api/interpret")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as {
          question?: string;
          role?: string;
          language?: string;
          context?: string;
          baseline?: { interpretation?: string; remedials?: string[] };
        };

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const lang = LANG_NAME[body.language ?? "en"] ?? "English";
        const role = body.role ?? "Program Manager";
        const question = body.question ?? "";
        const datasetSlice = selectDatasets(question);

        const system = `${MITRA_SYSTEM_PROMPT}

ACTIVE ROLE: ${role}
RESPONSE LANGUAGE: ${lang}

For Program Manager / Org Admin / Tenant Admin the Recommended Actions MUST be A/B tests (state sample size, MDE, primary KPI), DiD cohort comparisons, SLA / escalation rules, segmentation cuts, or root-cause investigations. NEVER UX/UI tweaks.

Return ONLY two fields (interpretation, remedials) for an answer card:
- interpretation: 3-5 sentences in ${lang}, headline-style first line, then biggest finding + hidden insight + why-it-matters.
- remedials: 3-5 data-driven actions (<=25 words each), ranked by impact, each naming a metric/threshold/experiment.`;

        const prompt = `User question: ${question}

Aggregated MITRA telemetry (ground truth; do not invent numbers):
${JSON.stringify(datasetSlice)}

Dashboard context block:
${body.context ?? "(none)"}

Baseline interpretation to improve (do not contradict numbers):
${body.baseline?.interpretation ?? "(none)"}

Baseline actions to sharpen:
${(body.baseline?.remedials ?? []).map((r, i) => `${i + 1}. ${r}`).join("\n") || "(none)"}`;

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");
          const schema = z.object({
            interpretation: z.string().min(20),
            remedials: z.array(z.string().min(8)).min(2).max(6),
          });
          const { text } = await generateText({
            model,
            system: `${system}\n\nReturn ONLY a single JSON object matching: {"interpretation": string, "remedials": string[]}. No markdown, no prose.`,
            prompt,
          });
          const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
          const start = cleaned.indexOf("{");
          const end = cleaned.lastIndexOf("}");
          const jsonStr = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
          const parsed = schema.parse(JSON.parse(jsonStr));
          return Response.json(parsed);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const status = /429/.test(msg) ? 429 : /402/.test(msg) ? 402 : 500;
          return new Response(JSON.stringify({ error: msg }), {
            status,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
