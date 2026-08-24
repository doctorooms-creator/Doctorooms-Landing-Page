"use client";

import { useEffect, useRef, useState } from "react";
import {
  useReducedMotion,
} from "@/lib/anim/gsap-register";
import {
  usePinnedSequence,
  useReveal,
  useScrollTriggerHygiene,
} from "@/lib/anim/hooks";
import { PATIENT_JOURNEY_STEPS } from "@/data/doctorooms";
import { GENERIC_ICONS } from "./ui/icons";
import { Chip, LiveDot } from "./ui/chip";

/**
 * Step icon mapping (1-10). Each entry maps a PATIENT_JOURNEY_STEPS step
 * to a Lucide icon from the GENERIC_ICONS set.
 */
const STEP_ICONS = [
  GENERIC_ICONS.UserRound, // Discover
  GENERIC_ICONS.CalendarClock, // Book
  GENERIC_ICONS.FileText, // Check-in
  GENERIC_ICONS.Users, // Queue
  GENERIC_ICONS.Stethoscope, // Consult
  GENERIC_ICONS.Pill, // Prescription
  GENERIC_ICONS.FlaskConical, // Lab
  GENERIC_ICONS.Receipt, // Pharmacy
  GENERIC_ICONS.Wallet, // Payment
  GENERIC_ICONS.HeartPulse, // Follow-up
] as const;

export function PatientJourney() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  useScrollTriggerHygiene();

  // Pin only when viewport is lg+ AND motion is not reduced.
  const showPinned = isDesktop && !reduced;

  // Subscribe to lg breakpoint changes.
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Reveal header copy on enter view.
  useReveal(headerRef, { y: 16, stagger: 0.08 });

  // Reveal vertical rail cards on mobile / reduced motion.
  useReveal(verticalRef, { y: 16, stagger: 0.06 });

  // Pinned horizontal choreography (desktop only).
  // On mobile / reduced motion, pinStageRef is null (the layout is not
  // rendered), so the hook short-circuits.
  usePinnedSequence(
    pinStageRef,
    ({ tl, container }) => {
      const track = trackRef.current;
      if (!track) return;
      // Translate the track leftward by (trackWidth - viewport) as the
      // user scrolls through the pinned range. invalidateOnRefresh
      // means this is recomputed on resize.
      tl.fromTo(
        track,
        { x: 0 },
        {
          x: () => -(track.scrollWidth - container.offsetWidth),
          ease: "none",
        },
        0
      );
      // Drive the top progress hairline 0 -> 100%.
      if (progressRef.current) {
        tl.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, ease: "none" },
          0
        );
      }
    },
    { start: "top top", end: "+=180%" },
    [isDesktop]
  );

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-h"
      className="scroll-anchor relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div
          className="aurora-blob bg-brand/20"
          style={{ width: 480, height: 480, top: -120, right: -120 }}
        />
        <div
          className="aurora-blob bg-growth/15"
          style={{ width: 420, height: 420, bottom: -160, left: -100 }}
        />
        <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />
      </div>

      {/* Header copy */}
      <div ref={headerRef} className="container-px mx-auto max-w-7xl">
        <div className="eyebrow text-brand" data-anim>
          Chapter 08 — Patient Journey
        </div>
        <h2 id="journey-h" className="display-2 mt-4 text-balance" data-anim>
          From First Search to Follow-Up.
        </h2>
        <p
          className="mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
          data-anim
        >
          One connected journey across the entire healthcare experience.
        </p>
      </div>

      {showPinned ? (
        /* ── Desktop: pinned horizontal track ── */
        <div ref={pinStageRef} className="relative mt-12 lg:mt-16">
          {/* Top progress hairline */}
          <div
            className="absolute inset-x-0 top-0 z-30 h-px bg-border/50"
            role="progressbar"
            aria-label="Journey progress"
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              ref={progressRef}
              className="h-full origin-left bg-gradient-to-r from-brand to-growth"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Edge fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-background to-transparent"
          />

          {/* Horizontal track */}
          <div
            ref={trackRef}
            className="flex gap-6 px-[8vw] py-4 will-change-transform"
          >
            {PATIENT_JOURNEY_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              const num = String(i + 1).padStart(2, "0");
              return (
                <article
                  key={step.key}
                  className="group relative flex w-[280px] shrink-0 flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-medium text-muted-foreground"
                      aria-label={`Step ${num}`}
                    >
                      {num}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:scale-105">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {step.key}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                    <Chip tone="brand" className="text-[10px]">
                      Step {num}
                    </Chip>
                    <span className="h-1.5 w-1.5 rounded-full bg-growth" />
                  </div>
                </article>
              );
            })}
          </div>

          {/* Side hint */}
          <div className="container-px mx-auto mt-3 flex max-w-7xl items-center justify-between text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <LiveDot tone="brand" /> Scroll to traverse the journey
            </span>
            <span className="font-mono">10 steps · 1 patient</span>
          </div>
        </div>
      ) : (
        /* ── Mobile / reduced motion: vertical rail ── */
        <div
          ref={verticalRef}
          className="container-px mx-auto mt-12 max-w-3xl lg:mt-16"
        >
          <ol className="relative">
            <span
              aria-hidden
              className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/50 via-brand/25 to-transparent"
            />
            {PATIENT_JOURNEY_STEPS.map((step, i) => {
              const Icon = STEP_ICONS[i];
              const num = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={step.key}
                  data-anim
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-background">
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <div className="flex-1 rounded-xl border border-border/60 bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold">{step.key}</h3>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {num}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
