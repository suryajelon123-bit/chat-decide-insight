import { useEffect, useRef } from "react";
import { Sparkles, User } from "lucide-react";
import { UI, type Language, type Turn } from "@/lib/mock-data";
import { AnswerCard } from "./AnswerCard";

type Props = {
  turns: Turn[];
  busy: boolean;
  onFollowup: (q: string) => void;
  language: Language;
  starters: string[];
};

export function ChatThread({ turns, busy, onFollowup, language, starters }: Props) {
  const t = UI[language];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, busy]);

  if (turns.length === 0) {
    return (
      <div className="h-full overflow-y-auto bg-grid">
        <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fact to-insight">
            <Sparkles className="h-6 w-6 text-background" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gradient">{t.welcomeTitle}</h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{t.welcomeSubtitle}</p>

          <div className="mt-8 w-full">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.starterHeader}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => onFollowup(s)}
                  className="group rounded-xl border border-border bg-surface-1 p-3 text-left text-sm text-foreground/90 transition hover:border-primary/60 hover:bg-surface-2"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{s}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        {turns.map((tn) =>
          tn.role === "user" ? (
            <div key={tn.id} className="flex justify-end gap-3">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-surface-3 px-4 py-2.5 text-sm text-foreground">
                {tn.text}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted-foreground">
                <User className="h-3.5 w-3.5" />
              </div>
            </div>
          ) : (
            <div key={tn.id} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fact to-insight">
                <Sparkles className="h-3.5 w-3.5 text-background" />
              </div>
              <div className="min-w-0 flex-1">
                <AnswerCard answer={tn.answer} onFollowup={onFollowup} language={language} />
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
              {t.thinking}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}
