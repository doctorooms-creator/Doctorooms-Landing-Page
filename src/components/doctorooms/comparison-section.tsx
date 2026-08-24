"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { COMPARISON_ROWS, COMPARISON_STATS, COMPARISON_STAGES } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { ComparisonModal } from "./comparison-modal";
import { ArrowRight, Check, Layers, Maximize2, Unplug, X } from "lucide-react";

/**
 * ComparisonSection — Chapter 02½ "Fragmented vs. one platform".
 * Sits between the Problem chapter (Ch2) and Acquisition (Ch3) to give
 * buyers a concrete, row-by-row delta between a stitched-together stack
 * and Doctorooms. Reinforces the convergence story with a scannable
 * comparison instead of asking the visitor to imagine the difference.
 *
 * Layout: dark `ink-section` continuing the Problem chapter's cinematic
 * backdrop. Top stat row (3 deltas). Comparison body = 3-col grid on
 * lg (dimension | fragmented | doctorooms); stacked cards on mobile.
 * Each row is clickable to deep-link to the relevant chapter. Each row
 * ALSO has a "Compare in detail" affordance that opens a focused modal
 * with fragmented-pain / doctorooms-does / why-it-matters bullets.
 *
 * Deep-link: `#compare=<URL-encoded dimension>` opens the modal
 * pre-seeded to that dimension (mirrors the `#admin` pattern). Useful
 * for the sales team to share a focused comparison view in a meeting.
 * Reduced-motion safe (CSS-revealed, framer only for entrance fade).
 */
export function ComparisonSection() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, { stagger: 0.08, duration: 0.8 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDimension, setModalDimension] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<(typeof COMPARISON_STAGES)[number]>("All");

  // Apply the stage filter to the rows shown in both the desktop table
  // and the mobile cards. "All" = no filtering. Tracks the toggle.
  const visibleRows =
    stageFilter === "All"
      ? COMPARISON_ROWS
      : COMPARISON_ROWS.filter((r) => r.stage === stageFilter);

  function setStage(next: (typeof COMPARISON_STAGES)[number]) {
    if (next === stageFilter) return;
    track("comparison_filter_toggle", { stage: next });
    setStageFilter(next);
  }

  // Smooth-scroll to the chapter a comparison row maps to, with the same
  // 64px sticky-header offset the rest of the site uses.
  function jumpToChapter(href: string) {
    track("platform_explore_click", { source: "comparison_row", target: href });
    const el = document.querySelector(href);
    if (!el) return;
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }

  // Open the focused side-by-side modal for a specific dimension. Stops
  // propagation so the row's deep-link onClick doesn't also fire.
  function openModalFor(dimension: string, e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    track("comparison_modal_open", { dimension, source: "row_detail_button" });
    setModalDimension(dimension);
    setModalOpen(true);
  }

  // Deep-link via `#compare=<dimension>`. URL-encoded to handle spaces +
  // ampersands in dimension names like "Queue & front desk". Cleans
  // the hash after triggering so subsequent Esc + re-open doesn't loop.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#compare=")) return;
      const raw = hash.slice("#compare=".length);
      const decoded = (() => {
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })();
      const match = COMPARISON_ROWS.find((r) => r.dimension === decoded);
      if (!match) return;
      track("comparison_modal_open", {
        dimension: match.dimension,
        source: "url_hash",
      });
      setModalDimension(match.dimension);
      setModalOpen(true);
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch {
        // ignore
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  return (
    <section
      ref={root}
      id="comparison"
      aria-labelledby="comparison-heading"
      className="scroll-anchor ink-section relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-ink opacity-40" />
      <div
        className="aurora-blob bg-brand/25"
        style={{ width: 460, height: 460, top: -60, left: "55%" }}
      />
      <div
        className="aurora-blob bg-growth/15"
        style={{ width: 360, height: 360, bottom: -80, left: "8%" }}
      />

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 02½ — The Delta
          </div>
          <h2 id="comparison-heading" className="display-2 mt-4 text-balance" data-anim>
            Stitched-together tools,{" "}
            <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
              or one connected platform.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-ink-muted sm:text-lg"
            data-anim
          >
            The same patient journey, handled two ways. On the left, what a
            fragmented stack looks like across each step. On the right, what
            Doctorooms does in one place. Click any row to jump to the chapter,
            or open the focused side-by-side detail for the full breakdown.
          </p>
        </div>

        {/* Stat row */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3" data-anim>
          {COMPARISON_STATS.map((s) => (
            <div
              key={s.fragmented}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-400/80">
                <Unplug className="h-3.5 w-3.5" />
                Fragmented
              </div>
              <div className="mt-1.5 text-sm font-medium text-ink-muted/90">
                {s.fragmented}
              </div>
              <div className="my-2 hairline" />
              <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
                <Layers className="h-3.5 w-3.5" />
                Doctorooms
              </div>
              <div className="mt-1.5 text-sm font-semibold text-ink-foreground">
                {s.doctorooms}
              </div>
            </div>
          ))}
        </div>

        {/* Divider hairline — brand→growth fade between the stat row
            and the comparison table. */}
        <div className="mx-auto mt-12 hidden max-w-4xl lg:block" aria-hidden>
          <div className="divider-gradient" />
        </div>

        {/* Stage filter chips — lets a buyer focus on the slice of the
            journey they own (Discovery / Front desk / Clinical /
            Operations / AI). Default = All. */}
        <div
          data-anim
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Filter comparison rows by journey stage"
        >
          {COMPARISON_STAGES.map((stage) => {
            const count =
              stage === "All"
                ? COMPARISON_ROWS.length
                : COMPARISON_ROWS.filter((r) => r.stage === stage).length;
            const active = stage === stageFilter;
            return (
              <button
                key={stage}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStage(stage)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors focus-ring-tab",
                  active
                    ? "border-brand/50 bg-brand-soft/40 text-brand"
                    : "border-white/10 bg-white/[0.03] text-ink-muted hover:border-brand/30 hover:bg-white/[0.06] hover:text-ink-foreground"
                )}
              >
                {stage}
                <span
                  className={cn(
                    "tabular-nums text-[10px]",
                    active ? "text-brand/80" : "text-ink-muted/60"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Comparison table (desktop) */}
        <div className="mt-6 hidden lg:block" data-anim>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 border-b border-white/10 bg-white/[0.03] px-6 py-4">
              <div className="col-span-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                Step of the journey
              </div>
              <div className="col-span-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400/80">
                <Unplug className="h-3.5 w-3.5" />
                Fragmented approach
              </div>
              <div className="col-span-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                <Layers className="h-3.5 w-3.5" />
                Doctorooms
              </div>
            </div>
            {/* Rows — clickable, deep-link to the relevant chapter.
                The dimension cell also has a nested "Compare in detail"
                button (stops propagation) that opens the focused modal.
                Note: the row is a div[role=button] (not a <button>) so
                the nested Detail <button> doesn't trigger the React DOM
                "cannot contain a nested button" validation error. */}
            {visibleRows.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-ink-muted">
                No rows match this stage. Try "All" to see every step.
              </div>
            ) : (
              visibleRows.map((row, i) => (
                <motion.div
                  role="button"
                  tabIndex={0}
                  key={row.dimension}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, delay: reduced ? 0 : Math.min(i * 0.04, 0.3) }}
                  onClick={() => jumpToChapter(row.href)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      jumpToChapter(row.href);
                    }
                  }}
                  aria-label={`See ${row.dimension} in Doctorooms — jump to chapter`}
                  className={cn(
                    "group grid w-full cursor-pointer grid-cols-12 items-start gap-2 px-6 py-4 text-left transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand",
                    i !== visibleRows.length - 1 && "border-b border-white/5"
                  )}
                >
                  <div className="col-span-3 flex items-center gap-1.5 text-sm font-medium text-ink-foreground">
                    <span>{row.dimension}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <button
                      type="button"
                      onClick={(e) => openModalFor(row.dimension, e)}
                      className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-ink-muted transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand focus-visible:border-brand/40 focus-visible:bg-brand-soft/30 focus-visible:text-brand"
                      aria-label={`Compare ${row.dimension} in detail`}
                      tabIndex={0}
                    >
                      <Maximize2 className="h-2.5 w-2.5" />
                      Detail
                    </button>
                  </div>
                  <div className="col-span-4 flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                      <X className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span>{row.fragmented}</span>
                  </div>
                  <div className="col-span-5 flex items-start gap-2 text-[13px] leading-relaxed text-ink-foreground">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span className="text-left">{row.doctorooms}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Comparison cards (mobile/tablet) — tappable, deep-link to chapter.
            Header row also has a nested "Detail" button that opens the
            focused side-by-side modal (stops propagation). */}
        <div className="mt-6 grid gap-3 lg:hidden" data-anim>
          {visibleRows.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-ink-muted">
              No rows match this stage. Try "All" to see every step.
            </div>
          ) : (
            visibleRows.map((row) => (
              <div
                key={row.dimension}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-brand/30 hover:bg-white/[0.06] focus-within:border-brand/40 focus-within:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => jumpToChapter(row.href)}
                    aria-label={`See ${row.dimension} in Doctorooms — jump to chapter`}
                    className="flex min-w-0 flex-1 items-center gap-1 text-left"
                  >
                    <h3 className="truncate text-sm font-semibold text-ink-foreground">
                      {row.dimension}
                    </h3>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-ink-muted transition-colors group-hover:border-brand/30 group-hover:text-brand">
                      See it
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => openModalFor(row.dimension, e)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-ink-muted transition-colors hover:border-brand/40 hover:bg-brand-soft/30 hover:text-brand focus-visible:border-brand/40 focus-visible:bg-brand-soft/30 focus-visible:text-brand"
                    aria-label={`Compare ${row.dimension} in detail`}
                  >
                    <Maximize2 className="h-2.5 w-2.5" />
                    Detail
                  </button>
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand/80">
                  {row.stage}
                </div>
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] p-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[12px] leading-relaxed text-ink-muted">
                    {row.fragmented}
                  </span>
                </div>
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/[0.08] p-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[12px] font-medium leading-relaxed text-ink-foreground">
                    {row.doctorooms}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" data-anim>
          <Button
            onClick={() => {
              track("platform_explore_click", { source: "comparison" });
              open();
            }}
            size="lg"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            See Doctorooms for my hospital
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => openModalFor(COMPARISON_ROWS[0].dimension)}
            className="border-white/15 bg-white/5 text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
          >
            <Maximize2 className="h-4 w-4" />
            Compare all dimensions
          </Button>
          <Button variant="outline" asChild className="border-white/15 bg-white/5 text-ink-foreground hover:bg-white/10 hover:text-ink-foreground">
            <a href="#journey">Walk the patient journey</a>
          </Button>
          <span className="text-[11px] text-ink-muted">
            30-minute private walkthrough · tailored to your organization
          </span>
        </div>
      </div>

      <ComparisonModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialDimension={modalDimension}
      />
    </section>
  );
}
