import { Bot, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import type { ClaudeStreamState } from "@/hooks/use-claude-stream";

function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

type Props = {
  state: ClaudeStreamState;
  onRetry?: () => void;
};

export function ClaudeBlock({ state, onRetry }: Props) {
  if (state.status === "idle") return null;

  return (
    <div className="animate-rise overflow-hidden rounded-xl bg-surface-1 ring-1 ring-insight/30">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-insight/20 bg-gradient-to-r from-insight/10 to-transparent px-5 py-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-insight/20">
          <Bot className="h-3.5 w-3.5 text-insight" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-insight">Claude AI Synthesis</span>
        <span className="ml-1 text-[10px] text-muted-foreground">· claude-opus-4-5</span>
        <span className="ml-auto flex items-center gap-1.5">
          {state.status === "streaming" && (
            <>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              <span className="text-[10px] font-medium text-success">streaming…</span>
            </>
          )}
          {state.status === "done" && (
            <>
              <Sparkles className="h-3 w-3 text-insight/60" />
              <span className="text-[10px] text-muted-foreground">complete</span>
            </>
          )}
          {state.status === "error" && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-danger hover:bg-danger/10 transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> retry
            </button>
          )}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        {state.status === "error" ? (
          <div className="flex items-start gap-2 text-sm text-danger/80">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error ?? "Something went wrong calling Claude."}</span>
          </div>
        ) : (
          <div className="space-y-3">
            {state.text
              ? state.text.split(/\n\n+/).filter(Boolean).map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/85">
                    {renderText(para)}
                  </p>
                ))
              : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-insight [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-insight [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-insight" />
                  </span>
                  Generating synthesis…
                </div>
              )
            }
            {state.status === "streaming" && state.text && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-insight/70 align-middle" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
