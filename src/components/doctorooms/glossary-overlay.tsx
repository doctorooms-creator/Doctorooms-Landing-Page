"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { GLOSSARY_TERMS } from "@/data/doctorooms";
import { BookOpen, Search, Sparkles } from "lucide-react";

/**
 * GlossaryOverlay — searchable healthcare terminology reference.
 *
 * Audience: non-clinical decision makers (admins, investors,
 * journalists, founders) who shouldn't have to guess what an
 * acronym means while reading the page.
 *
 * Open via `G` (registered in BackToTop) or from the keyboard
 * shortcuts help dialog.
 *
 * State is held inside `GlossaryBody`, which only mounts when the
 * dialog is open. That gives a fresh state on each open without
 * needing an effect-based reset (avoids the cascading-render lint
 * rule). The dialog shell (Dialog/DialogContent) stays mounted so
 * Radix can animate the close transition.
 */
export function GlossaryOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[88vh] overflow-hidden p-0 sm:max-w-3xl"
        aria-describedby="glossary-desc"
      >
        {/* Radix keeps DialogContent mounted briefly for close transition.
            Only render the body when open so state is fresh on each open. */}
        {open ? (
          <GlossaryBody />
        ) : (
          <div className="sr-only" id="glossary-desc">
            Healthcare terminology reference.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GlossaryBody() {
  const [query, setQuery] = useState("");
  const [activeRelated, setActiveRelated] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((t) => {
      if (
        activeRelated &&
        !t.term.toLowerCase().includes(activeRelated.toLowerCase()) &&
        !t.long.toLowerCase().includes(activeRelated.toLowerCase())
      ) {
        return false;
      }
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.long.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.related.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [query, activeRelated]);

  function clickRelated(term: string) {
    track("glossary_lookup", { action: "related_click", term });
    setActiveRelated((cur) => (cur === term ? null : term));
    setQuery("");
  }

  return (
    <div className="flex max-h-[88vh] flex-col">
      {/* Header */}
      <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-growth/10 to-transparent px-5 py-4 sm:px-6">
        <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-growth/15 text-growth">
            <BookOpen className="h-4 w-4" />
          </span>
          Healthcare glossary
          <Badge className="ml-1 border-border/60 bg-muted/40 text-[10px] font-normal text-muted-foreground">
            <span className="tabular-nums">{GLOSSARY_TERMS.length}</span> terms
          </Badge>
        </DialogTitle>
        <DialogDescription id="glossary-desc" className="text-xs">
          Plain-English definitions for the operational and clinical
          terms used on this page. Aimed at admins, investors, founders,
          and journalists — not clinicians. Click a related term chip
          to filter.
        </DialogDescription>
      </DialogHeader>

      {/* Search */}
      <div className="border-b border-border/60 px-4 py-3 sm:px-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveRelated(null);
            }}
            placeholder="Search terms, acronyms, or definitions…"
            className="h-9 pl-8"
            aria-label="Search glossary"
            autoFocus
          />
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 text-muted-foreground">
              <Search className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                No matching terms
              </div>
              <div className="text-xs text-muted-foreground">
                Try a different search or clear the related filter.
              </div>
            </div>
            {activeRelated && (
              <button
                onClick={() => setActiveRelated(null)}
                className="text-xs text-brand hover:underline"
              >
                Clear related filter
              </button>
            )}
          </div>
        ) : (
          <ul className="grid gap-2.5">
            {filtered.map((t) => {
              const isBrand = t.tone === "brand";
              const accent = isBrand
                ? "border-brand/30 bg-brand-soft/30"
                : "border-growth/30 bg-growth/5";
              const dot = isBrand ? "bg-brand" : "bg-growth";
              const textTone = isBrand ? "text-brand" : "text-growth";
              return (
                <li
                  key={t.term}
                  className={cn(
                    "rounded-xl border p-3.5 transition-colors hover:bg-muted/20",
                    accent
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        dot
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {t.term}
                        </span>
                        <span className={cn("text-[11px]", textTone)}>
                          {t.long}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {t.definition}
                      </p>
                      {t.related.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {t.related.map((r) => {
                            const active = activeRelated === r;
                            return (
                              <button
                                key={r}
                                type="button"
                                onClick={() => clickRelated(r)}
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                                  active
                                    ? "border-brand bg-brand text-brand-foreground"
                                    : "border-border/60 bg-muted/30 text-muted-foreground hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand"
                                )}
                                aria-pressed={active}
                              >
                                {r}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-brand" />
          Showing{" "}
          <span className="tabular-nums">{filtered.length}</span> of{" "}
          <span className="tabular-nums">{GLOSSARY_TERMS.length}</span> terms
        </span>
        <span className="hidden sm:inline">
          Press <kbd>Esc</kbd> to close.
        </span>
      </div>
    </div>
  );
}
