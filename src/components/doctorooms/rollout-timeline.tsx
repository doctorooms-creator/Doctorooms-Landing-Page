"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { ROLLOUT_STEPS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { ArrowRight, CalendarCheck, ClipboardCheck, GraduationCap, Rocket } from "lucide-react";

const STEP_ICONS = [ClipboardCheck, Rocket, GraduationCap, CalendarCheck];

/**
 * RolloutTimeline — Chapter 13½ "How rollout works".
 * Sits between ROI (Ch13) and the Final CTA (Ch14) to answer the
 * natural next buyer question: "OK, I want this — what actually
 * happens after I book a demo?" Reduces post-decision anxiety by
 * making the path concrete (Scope → Configure → Train → Go live)
 * without inventing timelines or guarantees.
 *
 * Layout: light section, 4-step horizontal rail on desktop with a
 * connecting gradient line + milestone dots; vertical rail on
 * mobile. Each step: numbered, iconed, titled, described, with a
 * "deliverables" chip row. Reduced-motion safe.
 */
export function RolloutTimeline() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  return (
    <section
      ref={root}
      id="rollout"
      aria-labelledby="rollout-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 440, height: 440, top: -40, left: "12%" }}
        />
        <div
          className="aurora-blob bg-growth/12"
          style={{ width: 360, height: 360, bottom: -60, right: "8%" }}
        />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 13½ — Rollout
          </div>
          <h2 id="rollout-heading" className="display-2 mt-4 text-balance" data-anim>
            What happens after you{" "}
            <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
              say yes.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            A rollout is scoped to your organization, not pulled from a box.
            Here&apos;s the shape of the path — the exact timeline comes from
            a private walkthrough, not this page.
          </p>
        </div>

        {/* Desktop: horizontal rail */}
        <div className="relative mt-16 hidden lg:block" data-anim>
          {/* Connecting gradient line */}
          <div className="absolute left-0 right-0 top-[34px] mx-auto h-px max-w-6xl bg-gradient-to-r from-brand/10 via-brand/40 to-growth/40" />

          <div className="grid grid-cols-4 gap-6">
            {ROLLOUT_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? ClipboardCheck;
              const isGrowth = step.tone === "growth";
              return (
                <motion.div
                  key={step.n}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Milestone dot + icon */}
                  <div
                    className={cn(
                      "relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-2xl border shadow-sm",
                      isGrowth
                        ? "border-growth/30 bg-growth/10 text-growth"
                        : "border-brand/30 bg-brand-soft text-brand"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    {/* Step number badge */}
                    <span
                      className={cn(
                        "absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold font-mono text-white shadow",
                        isGrowth ? "bg-growth" : "bg-brand"
                      )}
                    >
                      {step.n}
                    </span>
                  </div>

                  {/* Key + title */}
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {step.key}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground text-balance">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                    {step.desc}
                  </p>

                  {/* Deliverables */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                    {step.deliverables.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        <span className={cn("h-1 w-1 rounded-full", isGrowth ? "bg-growth" : "bg-brand")} />
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile/tablet: vertical rail */}
        <div className="mt-12 lg:hidden" data-anim>
          <div className="relative">
            {/* Vertical rail line */}
            <div className="absolute left-[33px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/30 via-brand/40 to-growth/40" />
            <div className="grid gap-5">
              {ROLLOUT_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i] ?? ClipboardCheck;
                const isGrowth = step.tone === "growth";
                return (
                  <motion.div
                    key={step.n}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.08 }}
                    className="relative flex gap-4"
                  >
                    {/* Milestone node */}
                    <div
                      className={cn(
                        "relative z-10 flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border shadow-sm",
                        isGrowth
                          ? "border-growth/30 bg-growth/10 text-growth"
                          : "border-brand/30 bg-brand-soft text-brand"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span
                        className={cn(
                          "absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold font-mono text-white shadow",
                          isGrowth ? "bg-growth" : "bg-brand"
                        )}
                      >
                        {step.n}
                      </span>
                    </div>
                    {/* Body */}
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {step.key}
                      </div>
                      <h3 className="mt-1 text-base font-semibold leading-snug text-foreground text-balance">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                        {step.desc}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {step.deliverables.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            <span className={cn("h-1 w-1 rounded-full", isGrowth ? "bg-growth" : "bg-brand")} />
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footnote + CTA */}
        <div
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-card p-5 text-center"
          data-anim
        >
          <p className="text-sm text-muted-foreground text-pretty">
            <span className="font-medium text-foreground">No fixed timeline on this page.</span>{" "}
            A clinic can go live quickly with discovery, booking and queue; a multi-specialty
            hospital adding IPD, lab, pharmacy, billing and insurance takes longer. We scope
            the real path with you in the first call.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={() => {
                track("hero_demo_click", { source: "rollout" });
                open();
              }}
              size="lg"
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <CalendarCheck className="h-4 w-4" />
              Start with a private walkthrough
            </Button>
            <Button variant="outline" asChild>
              <a href="#roi">
                See the ROI math
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
