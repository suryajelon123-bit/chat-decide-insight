import { Bookmark, History, Languages, MessageSquarePlus, Sparkles, User } from "lucide-react";
import { LANGUAGES, RECENT_THREADS, ROLES, type Language } from "@/lib/mock-data";

type Props = {
  role: string;
  onRoleChange: (r: string) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  onNewThread: () => void;
};

export function LeftRail({ role, onRoleChange, language, onLanguageChange, onNewThread }: Props) {
  return (
    <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-border bg-surface-1/60 lg:flex">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fact to-insight">
          <Sparkles className="h-4 w-4 text-background" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Lumen</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Decision workspace</div>
        </div>
      </div>

      <button
        onClick={onNewThread}
        className="mx-4 mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        <MessageSquarePlus className="h-4 w-4" /> New conversation
      </button>

      <div className="mt-6 px-5">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <User className="h-3 w-3" /> Role
        </div>
        <div className="space-y-1">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                role === r ? "bg-surface-3 text-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 px-5">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Bookmark className="h-3 w-3" /> Saved prompts
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="rounded-md px-2.5 py-1.5 hover:bg-surface-2 hover:text-foreground">Weekly North region check</div>
          <div className="rounded-md px-2.5 py-1.5 hover:bg-surface-2 hover:text-foreground">At-risk blocks digest</div>
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-5">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <History className="h-3 w-3" /> Recent threads
        </div>
        <div className="space-y-1">
          {RECENT_THREADS.map((t) => (
            <div key={t.id} className="cursor-pointer rounded-md px-2.5 py-2 text-sm transition hover:bg-surface-2">
              <div className="line-clamp-1 text-foreground/90">{t.title}</div>
              <div className="text-[11px] text-muted-foreground">{t.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Languages className="h-3 w-3" /> Language
        </div>
        <div className="flex gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.code)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                language === l.code ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
