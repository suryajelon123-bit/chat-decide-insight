import { useEffect, useRef } from "react";
import { Sparkles, User } from "lucide-react";
import type { Turn } from "@/lib/mock-data";
import { AnswerCard } from "./AnswerCard";

type Props = { turns: Turn[]; busy: boolean; onFollowup: (q: string) => void };

export function ChatThread({ turns, busy, onFollowup }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, busy]);

  if (turns.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-grid">
        <div className="max-w-lg px-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fact to-insight">
            <Sparkles className="h-6 w-6 text-background" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gradient">Ask anything about your operations</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Get grounded metric answers, trend interpretations, likely causes, and recommended next steps — in your language.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        {turns.map((t) =>
          t.role === "user" ? (
            <div key={t.id} className="flex justify-end gap-3">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-surface-3 px-4 py-2.5 text-sm text-foreground">
                {t.text}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
              </div>
            </div>
          ) : (
            <div key={t.id} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fact to-insight">
                <Sparkles className="h-3.5 w-3.5 text-background" />
              </div>
              <div className="min-w-0 flex-1">
                <AnswerCard answer={t.answer} onFollowup={onFollowup} />
              </div>
            </div>
          )
        )}

        {busy && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fact to-insight">
              <Sparkles className="h-3.5 w-3.5 text-background" />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </span>
              Querying database, grounding response…
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
