"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { OUTCOMES } from "@/data/doctorooms";
import {
  ArrowRight,
  ArrowLeftRight,
  CheckCheck,
  Copy,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

/**
 * OutcomeCompareDialog — a focused modal that puts two decision-maker
 * quotes side-by-side so a buyer can compare how the same platform reads
 * differently to different buyers (e.g. clinic owner vs hospital admin).
 *
 * Opened from the Outcomes section's "Compare two outcomes" button.
 * Tracks `outcome_compare_open` on open, `outcome_compare_pick` on
 * either pick, and `outcome_compare_share` on copy-link.
 *
 * Deep-link pattern: `#compare-outcomes=<key1>,<key2>` (URL-encoded).
 * Mirrors the `#compare=` and `#outcome=` patterns. Lets the sales team
 * pre-configure a comparison view in a shared URL.
 *
 * Reduced-motion safe (CSS only). Pure-client state. No backend.
 */

type CompareProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function OutcomeCompareDialog({ open, onOpenChange }: CompareProps) {
  const [leftKey, setLeftKey] = useState<string>(OUTCOMES[0].key);
  const [rightKey, setRightKey] = useState<string>(OUTCOMES[1].key);
  const [copied, setCopied] = useState(false);

  // Track open analytics.
  useEffect(() => {
    if (open) {
      track("outcome_compare_open", {
        left: leftKey,
        right: rightKey,
      });
    }
  }, [open, leftKey, rightKey]);

  // Deep-link via `#compare-outcomes=<key1>,<key2>`. Reads on mount + on
  // hashchange. Cleans the hash after triggering so reopens don't loop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const PREFIX = "#compare-outcomes=";
    const applyHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith(PREFIX)) return;
      const raw = hash.slice(PREFIX.length);
      const decoded = (() => {
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })();
      const parts = decoded.split(",");
      if (parts.length !== 2) return;
      const [a, b] = parts;
      const leftIdx = OUTCOMES.findIndex((o) => o.key === a);
      const rightIdx = OUTCOMES.findIndex((o) => o.key === b);
      if (leftIdx < 0 || rightIdx < 0) return;
      if (leftIdx === rightIdx) return;
      setLeftKey(OUTCOMES[leftIdx].key);
      setRightKey(OUTCOMES[rightIdx].key);
      track("outcome_compare_open", {
        left: OUTCOMES[leftIdx].key,
        right: OUTCOMES[rightIdx].key,
        source: "url_hash",
      });
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch {
        // ignore
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const left = useMemo(
    () => OUTCOMES.find((o) => o.key === leftKey) ?? OUTCOMES[0],
    [leftKey]
  );
  const right = useMemo(
    () => OUTCOMES.find((o) => o.key === rightKey) ?? OUTCOMES[1],
    [rightKey]
  );

  function pickLeft(v: string) {
    if (v === rightKey) return; // don't allow duplicates
    setLeftKey(v);
    track("outcome_compare_pick", { side: "left", key: v });
  }
  function pickRight(v: string) {
    if (v === leftKey) return;
    setRightKey(v);
    track("outcome_compare_pick", { side: "right", key: v });
  }
  function swap() {
    setLeftKey(rightKey);
    setRightKey(leftKey);
    track("outcome_compare_pick", {
      side: "swap",
      key: `${leftKey}->${rightKey}`,
    });
  }

  async function copyShareLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}#compare-outcomes=${encodeURIComponent(`${leftKey},${rightKey}`)}`
        : "";
    if (!url) return;
    track("outcome_compare_share", { left: leftKey, right: rightKey });
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (document.execCommand) {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — clipboard failure is non-fatal
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[92vh] overflow-hidden p-0 sm:max-w-5xl"
      >
        <div className="flex max-h-[92vh] flex-col">
          {/* Header */}
          <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-brand-soft/40 via-growth/[0.06] to-transparent px-5 py-4 sm:px-6">
            <DialogTitle className="flex flex-wrap items-center gap-2 text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <ArrowLeftRight className="h-4 w-4" />
              </span>
              Compare two outcomes
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-normal text-muted-foreground">
                <Users className="h-3 w-3" />
                side-by-side
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Two decision-makers, the same platform. Pick a buyer on each
              side to see how the same connected system reads differently to
              different roles. Tip: bookmark the URL after picking — the
              comparison is encoded in <code className="rounded bg-muted/60 px-1 py-0.5 text-[10px]">#compare-outcomes=…</code>.
            </DialogDescription>
          </DialogHeader>

          {/* Pickers row */}
          <div className="grid grid-cols-1 gap-3 border-b border-border/60 px-4 py-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:px-6">
            <Select value={leftKey} onValueChange={pickLeft}>
              <SelectTrigger className="h-9" aria-label="Left outcome picker">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTCOMES.map((o) => (
                  <SelectItem
                    key={o.key}
                    value={o.key}
                    disabled={o.key === rightKey}
                  >
                    {o.archetype} — {o.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap sides"
              title="Swap sides"
              className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <Select value={rightKey} onValueChange={pickRight}>
              <SelectTrigger className="h-9" aria-label="Right outcome picker">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTCOMES.map((o) => (
                  <SelectItem
                    key={o.key}
                    value={o.key}
                    disabled={o.key === leftKey}
                  >
                    {o.archetype} — {o.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Side-by-side comparison */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT card */}
              <CompareCard side="left" item={left} />
              {/* Divider with swap chip on md+ */}
              <div className="relative hidden md:block">
                <div className="divider-gradient-vertical absolute left-1/2 top-0 h-full w-px -translate-x-1/2" />
              </div>
              {/* RIGHT card */}
              <CompareCard side="right" item={right} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-4 py-3 text-[11px] text-muted-foreground sm:px-6">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-brand" />
              Comparing{" "}
              <span className="font-medium text-foreground/80">
                {left.archetype}
              </span>
              {" → "}
              <span className="font-medium text-foreground/80">
                {right.archetype}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyShareLink}
                className="h-8 gap-1.5"
              >
                {copied ? (
                  <CheckCheck className="h-3.5 w-3.5 text-growth" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Link copied" : "Copy comparison link"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={swap}
                className="h-8 gap-1.5"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" />
                Swap sides
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CompareCard({
  side,
  item,
}: {
  side: "left" | "right";
  item: (typeof OUTCOMES)[number];
}) {
  const accent = item.accent === "growth" ? "growth" : "brand";
  return (
    <div
      className={cn(
        "tape-edge relative p-6 sm:p-8",
        side === "right" && "md:border-l-0",
        accent === "growth"
          ? "bg-growth/[0.04]"
          : "bg-brand/[0.04]"
      )}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
        <span
          className={cn(
            "live-indicator-dot",
            accent === "growth" ? "" : ""
          )}
          aria-hidden
        />
        <span className={accent === "growth" ? "text-growth" : "text-brand"}>
          {side === "left" ? "LEFT" : "RIGHT"}
        </span>
        <span className="text-muted-foreground">· {item.archetype}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {item.role}
        </span>
      </div>
      <Quote
        className="absolute right-4 top-4 h-8 w-8 text-brand/15"
        aria-hidden
      />
      <blockquote
        key={item.key}
        className="reading-rhythm mt-4 text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg"
      >
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <div className="quote-arc mt-4" aria-hidden />
      <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <ArrowRight className="h-3 w-3" />
        {accent === "growth" ? "growth lens" : "operations lens"}
      </div>
    </div>
  );
}
