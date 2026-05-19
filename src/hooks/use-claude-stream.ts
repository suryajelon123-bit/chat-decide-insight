import { useCallback, useRef, useState } from "react";
import type { Answer, Language } from "@/lib/mock-data";

function buildAnswerSummary(answer: Answer): string {
  const lines: string[] = [];
  for (const b of answer.blocks) {
    if (b.type === "kpi") lines.push(`${b.label}: ${b.value}`);
    else if (b.type === "interpretation") lines.push(b.text.slice(0, 300));
    else if (b.type === "breakdown") lines.push(`${b.label}: ${b.rows.map((r) => `${r.name}=${r.value}`).join(", ")}`);
    else if (b.type === "state_theme_table") lines.push(`${b.label}: ${b.rows.map((r) => `${r.name} Bihar=${r.bihar} Karn=${r.karnataka}`).join("; ")}`);
  }
  return lines.join("\n");
}

export type ClaudeStreamState = {
  text: string;
  status: "idle" | "streaming" | "done" | "error";
  error?: string;
};

export function useClaudeStream() {
  const [state, setState] = useState<ClaudeStreamState>({ text: "", status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const stream = useCallback(async (
    question: string,
    answer: Answer,
    language: Language,
    contextLine: string,
  ) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ text: "", status: "streaming" });

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question,
          context: contextLine,
          language,
          answerSummary: buildAnswerSummary(answer),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        setState({ text: "", status: "error", error: err || "Claude API error" });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setState({ text: accumulated, status: "streaming" });
      }

      setState({ text: accumulated, status: "done" });
    } catch (e: unknown) {
      if ((e as { name?: string }).name === "AbortError") return;
      setState({ text: "", status: "error", error: String(e) });
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ text: "", status: "idle" });
  }, []);

  return { state, stream, reset };
}
