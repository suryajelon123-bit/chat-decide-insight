import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const LANG_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  ta: "Tamil (தமிழ்)",
  kn: "Kannada (ಕನ್ನಡ)",
};

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

        const system = `You are MITRA's data interpretation assistant for Shikshalokam's Chaupal/Chavadi/MI programs in India. The user is a ${role}. Respond strictly in ${lang}.
Be concrete, numeric, decision-oriented. NO UX/UI advice. Recommendations must be data actions: A/B tests with sample size + MDE + primary metric, DiD cohort comparisons, SLA thresholds, escalation rules, segmentation cuts, root-cause investigations. Tie every action to a measurable KPI.`;

        const prompt = `Question: ${body.question ?? ""}

Grounded data context (numbers from MITRA logs):
${body.context ?? "(none)"}

Baseline interpretation (rewrite/improve it; do not contradict numbers):
${body.baseline?.interpretation ?? "(none)"}

Baseline actions:
${(body.baseline?.remedials ?? []).map((r, i) => `${i + 1}. ${r}`).join("\n") || "(none)"}

Produce a sharper interpretation (2-4 sentences) tailored to the ${role}, and 3-5 data-driven next actions.`;

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");
          const { experimental_output } = await generateText({
            model,
            system,
            prompt,
            experimental_output: Output.object({
              schema: z.object({
                interpretation: z.string().min(20),
                remedials: z.array(z.string().min(8)).min(2).max(6),
              }),
            }),
          });

          return Response.json(experimental_output);
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
