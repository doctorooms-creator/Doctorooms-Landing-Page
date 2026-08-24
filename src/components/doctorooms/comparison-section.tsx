"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { COMPARISON_ROWS, COMPARISON_STATS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { Chip } from "./ui/chip";
import { ArrowRight, Check, Layers, Unplug, X } from "lucide-react";

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
 * Reduced-motion safe (CSS-revealed, framer only for entrance fade).
 */
export function ComparisonSection() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, { stagger: 0.08, duration: 0.8 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  return (
    <section
      ref={root}
      id="comparison"
      aria-labelledby="comparison-heading"
      className="ink-section relative isolate overflow-hidden py-24 sm:py-32"
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
            Doctorooms does in one place.
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

        {/* Comparison table (desktop) */}
        <div className="mt-12 hidden lg:block" data-anim>
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
            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <motion.div
                key={row.dimension}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.4, delay: reduced ? 0 : Math.min(i * 0.04, 0.3) }}
                className={cn(
                  "grid grid-cols-12 items-start gap-2 px-6 py-4 transition-colors hover:bg-white/[0.02]",
                  i !== COMPARISON_ROWS.length - 1 && "border-b border-white/5"
                )}
              >
                <div className="col-span-3 text-sm font-medium text-ink-foreground">
                  {row.dimension}
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
                  <span>{row.doctorooms}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comparison cards (mobile/tablet) */}
        <div className="mt-10 grid gap-3 lg:hidden" data-anim>
          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.dimension}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-ink-foreground">
                  {row.dimension}
                </h3>
                <Chip tone="ink" className="text-[10px]">
                  step
                </Chip>
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
          ))}
        </div>

        {/* CTA */}
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
          <Button variant="outline" asChild className="border-white/15 bg-white/5 text-ink-foreground hover:bg-white/10 hover:text-ink-foreground">
            <a href="#journey">Walk the patient journey</a>
          </Button>
          <span className="text-[11px] text-ink-muted">
            30-minute private walkthrough · tailored to your organization
          </span>
        </div>
      </div>
    </section>
  );
}
