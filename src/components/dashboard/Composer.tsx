import { Mic, SendHorizonal, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = {
  onSubmit: (q: string) => void;
  suggestions: string[];
  busy: boolean;
};

export function Composer({ onSubmit, suggestions, busy }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v || busy) return;
    onSubmit(v);
    setValue("");
  };

  return (
    <div className="border-t border-border bg-surface-1/80 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSubmit(s)}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface-2 p-2 focus-within:border-primary/60">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask about a metric, a trend, or what to do next…"
            className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-3 hover:text-foreground"
            title="Voice (coming soon)"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            onClick={submit}
            disabled={busy || !value.trim()}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizonal className="h-4 w-4" />
            Ask
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-muted-foreground">
          Lumen separates <span className="font-semibold text-fact">facts</span> from <span className="font-semibold text-insight">insights</span>. Always verify recommendations before action.
        </div>
      </div>
    </div>
  );
}
