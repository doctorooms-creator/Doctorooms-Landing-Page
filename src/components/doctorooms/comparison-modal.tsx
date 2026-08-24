"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { COMPARISON_DETAILS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Unplug,
  X,
} from "lucide-react";

/**
 * ComparisonModal — focused side-by-side detail view for one
 * COMPARISON_ROWS dimension.
 *
 * Triggered from ComparisonSection: each row gets a "Compare in detail"
 * affordance (a small button nested inside the row, stops propagation
 * so the row's deep-link onClick doesn't fire).
 *
 * Layout (Dialog, sm:max-w-3xl):
 *  • Header: dimension title + "X of 8 dimensions" badge + prev/next
 *    chevrons (keyboard ←/→ also supported).
 *  • Two-column grid (stacked on mobile):
 *      Left: "Fragmented" header (amber) + 4 pain-point bullets (X icon)
 *      Right: "Doctorooms" header (brand) + 4 approach bullets (Check icon)
 *  • "Why it matters" callout at the bottom — a one-liner tying the
 *    dimension to the buyer's bottom line. Lightbulb icon.
 *  • Footer CTA row: "See it in Doctorooms" (deep-link to chapter) +
 *    "Book a private demo" (opens the demo dialog).
 *
 * State reset: ComparisonBody only mounts when open is true, so initial
 * selectedDimension state is fresh per open (via `key` prop on DialogContent
 * from parent). The Navigation prev/next buttons cycle through
 * COMPARISON_DETAILS in order.
 *
 * Reduced-motion safe (CSS only — framer-motion not used here).
 * A11y: Dialog has explicit aria-describedby; nav buttons have aria-labels;
 * ←/→ keyboard shortcuts work to cycle dimensions (but ignored while
 * focus is in an input).
 */
type Detail = (typeof COMPARISON_DETAILS)[number];

export function ComparisonModal({
  open,
  onOpenChange,
  initialDimension,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialDimension: string | null;
}) {
  // Find the initial index from the requested dimension.
  const startIndex = initialDimension
    ? Math.max(
        0,
        COMPARISON_DETAILS.findIndex((d) => d.dimension === initialDimension)
      )
    : 0;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[88vh] overflow-hidden p-0 sm:max-w-3xl"
        aria-describedby="comparison-modal-desc"
      >
        {open ? (
          <ComparisonBody
            startIndex={startIndex}
            onOpenChange={onOpenChange}
          />
        ) : (
          <div className="sr-only" id="comparison-modal-desc">
            Side-by-side comparison of fragmented tools vs. Doctorooms.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ComparisonBody({
  startIndex,
  onOpenChange,
}: {
  startIndex: number;
  onOpenChange: (v: boolean) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const detail: Detail = COMPARISON_DETAILS[index];
  const { open: openDemo } = useDemoDialog();

  // Reset to startIndex when the body mounts fresh (state initializer).
  // No effect needed for resetting on close because the parent only
  // renders ComparisonBody when open=true.

  function go(delta: number) {
    const n = COMPARISON_DETAILS.length;
    const next = (index + delta + n) % n;
    track("comparison_modal_navigate", {
      from: COMPARISON_DETAILS[index].dimension,
      to: COMPARISON_DETAILS[next].dimension,
    });
    setIndex(next);
  }

  // Keyboard navigation: ←/→ to cycle dimensions (ignored when typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable;
      if (editable) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function jumpToChapter(href: string) {
    track("platform_explore_click", {
      source: "comparison_modal",
      target: href,
    });
    onOpenChange(false);
    // Defer the scroll so the dialog can close + focus can return.
    setTimeout(() => {
      const el = document.querySelector(href);
      if (!el) return;
      const top =
        (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
  }

  return (
    <div className="flex max-h-[88vh] flex-col">
      {/* Header */}
      <DialogHeader className="border-b border-border/60 bg-gradient-to-br from-brand-soft/30 to-transparent px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-brand">
              Compare in detail
            </div>
            <DialogTitle className="mt-1 text-lg font-semibold leading-tight sm:text-xl">
              {detail.dimension}
            </DialogTitle>
            <DialogDescription id="comparison-modal-desc" className="mt-1 text-xs">
              How this step of the journey looks fragmented vs. on Doctorooms.
            </DialogDescription>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => go(-1)}
              aria-label="Previous dimension"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Badge className="border-border/60 bg-muted/40 text-[10px] font-normal tabular-nums text-muted-foreground">
              <span className="tabular-nums">{index + 1}</span>
              <span className="opacity-60">/</span>
              <span className="tabular-nums">{COMPARISON_DETAILS.length}</span>
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => go(1)}
              aria-label="Next dimension"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogHeader>

      {/* Body — two columns on sm+, stacked on mobile */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2 sm:p-5">
        {/* Fragmented column */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400">
            <Unplug className="h-3.5 w-3.5" />
            Fragmented
          </div>
          <ul className="mt-3 grid gap-2.5">
            {detail.fragmentedPain.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                  <X className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Doctorooms column */}
        <div className="rounded-xl border border-brand/30 bg-brand/[0.08] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
            <Check className="h-3.5 w-3.5" />
            Doctorooms
          </div>
          <ul className="mt-3 grid gap-2.5">
            {detail.doctoroomsDoes.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] font-medium leading-relaxed text-foreground"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Why it matters — full width */}
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:col-span-2">
          <div className="flex items-start gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-growth/15 text-growth">
              <Lightbulb className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Why it matters
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground">
                {detail.why}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-4 py-3 text-[11px] sm:px-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => jumpToChapter(detail.href)}
          className="h-8 border-brand/40 text-brand hover:bg-brand-soft/40 hover:text-brand"
        >
          See it in Doctorooms
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden text-muted-foreground sm:inline">
            <kbd>←</kbd> <kbd>→</kbd> to navigate
          </span>
          <Button
            size="sm"
            onClick={() => {
              track("hero_demo_click", { source: "comparison_modal" });
              onOpenChange(false);
              setTimeout(() => openDemo(), 80);
            }}
            className="h-8"
          >
            Book a private demo
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
