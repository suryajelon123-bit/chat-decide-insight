import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function handleClaudeStream(request: Request): Promise<Response> {
  const { question, context, language, answerSummary } = await request.json() as {
    question: string;
    context: string;
    language: string;
    answerSummary: string;
  };

  const langInstruction =
    language === "hi" ? "Respond in Hindi (हिन्दी). Keep technical terms like A/B, MDE, DiD in English."
    : language === "ta" ? "Respond in Tamil (தமிழ்). Keep technical terms like A/B, MDE, DiD in English."
    : language === "kn" ? "Respond in Kannada (ಕನ್ನಡ). Keep technical terms like A/B, MDE, DiD in English."
    : "Respond in English.";

  const systemPrompt = `You are Lumen, an AI analyst for the MITRA program — a conversational AI deployed across Bihar (Chaupal) and Karnataka (Chavadi) schools to improve parent-teacher meeting engagement and track Micro-Improvement (MI) stories. You specialize in data-driven insights for education program managers.

Active context: ${context}

Data summary already shown to the user:
${answerSummary}

Your task: Write 2-3 tight, actionable paragraphs as a strategic synthesis. Focus on the "so what" — what decision the program manager should make, what experiment to run, what risk to watch. Do NOT repeat numbers already shown. Use **bold** for key terms and decisions. Be direct and specific. No preamble.

${langInstruction}`;

  const stream = await getAnthropic().messages.create({
    model: "claude-opus-4-5",
    max_tokens: 600,
    stream: true,
    system: systemPrompt,
    messages: [{ role: "user", content: question }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("Claude stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Intercept Claude streaming endpoint before TanStack router
    if (url.pathname === "/api/claude" && request.method === "POST") {
      try {
        return await handleClaudeStream(request);
      } catch (error) {
        console.error("Claude handler error:", error);
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
