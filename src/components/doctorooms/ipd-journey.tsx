"use client";

import { useEffect, useRef, useState } from "react";
import {
  gsap,
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "@/lib/anim/gsap-register";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { IPD_STEPS } from "@/data/doctorooms";
import { ROLE_ICONS, GENERIC_ICONS } from "./ui/icons";
import { Chip, LiveDot } from "./ui/chip";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * Role tag per IPD step. "Billing" is not part of the Chapter 11 ROLES set
 * but is the natural owning role for the Billing step; we use the Receipt
 * icon (from GENERIC_ICONS) as a sensible fallback since ROLE_ICONS has no
 * Billing entry. "Medication" is co-owned by Pharmacist + Nurse.
 */
const IPD_ROLE_TAGS: { role: string; icon: LucideIcon }[] = [
  { role: "Receptionist", icon: ROLE_ICONS.Receptionist },
  { role: "Nurse", icon: ROLE_ICONS.Nurse },
  { role: "Nurse", icon: ROLE_ICONS.Nurse },
  { role: "Doctor", icon: ROLE_ICONS.Doctor },
  { role: "Lab", icon: ROLE_ICONS.Lab },
  { role: "Lab", icon: ROLE_ICONS.Lab },
  { role: "Pharmacist · Nurse", icon: ROLE_ICONS.Pharmacist },
  { role: "Billing", icon: GENERIC_ICONS.Receipt },
  { role: "Doctor", icon: ROLE_ICONS.Doctor },
];

export function IPDJourney() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  useScrollTriggerHygiene();

  useReveal(headerRef, { y: 18, stagger: 0.08 });
  useReveal(chainRef, { y: 16, stagger: 0.06 });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Draw the connectors (scaleX 0 -> 1) in sequence as the chain enters view.
  useIsomorphicLayoutEffect(() => {
    const el = chainRef.current;
    if (!el || reduced) return;
    const connectors = el.querySelectorAll<HTMLElement>("[data-connector]");
    if (connectors.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(connectors, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(connectors, {
        scaleX: 1,
        duration: 0.5,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 85%",
          scrub: 0.6,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section
      ref={rootRef}
      id="ipd"
      aria-labelledby="ipd-h"
      className="relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div
          className="aurora-blob bg-growth/15"
          style={{ width: 460, height: 460, top: -140, right: -120 }}
        />
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 420, height: 420, bottom: -160, left: -100 }}
        />
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 10 — IPD Story
          </div>
          <h2 id="ipd-h" className="display-2 mt-4 text-balance" data-anim>
            One Patient. Every Department Connected.
          </h2>
          <p
            className="mt-5 text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Admission → Bed → Vitals → Doctor Orders → Investigation → Results
            → Medication → Billing → Discharge. A continuous chain of data and
            operational handoffs across roles.
          </p>
        </div>

        {isDesktop ? (
          /* ── Desktop: continuous horizontal data-flow chain ── */
          <div
            ref={chainRef}
            className="relative mt-14 overflow-x-auto scroll-soft pb-4"
          >
            <div className="flex min-w-max items-stretch gap-0 px-2">
              {IPD_STEPS.map((step, i) => {
                const num = String(i + 1).padStart(2, "0");
                const tag = IPD_ROLE_TAGS[i];
                const RoleIcon = tag.icon;
                const isLast = i === IPD_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex items-stretch">
                    {/* Node */}
                    <article
                      data-anim
                      className="group relative flex w-[150px] shrink-0 flex-col rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[10px] font-medium text-muted-foreground"
                          aria-label={`Step ${num}`}
                        >
                          {num}
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-brand/60" />
                      </div>
                      <h3 className="mt-2 text-xs font-semibold leading-tight tracking-tight">
                        {step.key}
                      </h3>
                      <p className="mt-1 flex-1 text-[11px] leading-snug text-muted-foreground">
                        {step.desc}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-soft text-brand">
                          <RoleIcon className="h-3 w-3" />
                        </span>
                        <span className="truncate text-[10px] font-medium text-foreground/80">
                          {tag.role}
                        </span>
                      </div>
                    </article>

                    {/* Connector */}
                    {!isLast && (
                      <div
                        className="flex items-center"
                        aria-hidden
                      >
                        <div className="relative h-px w-10 bg-border/60">
                          <div
                            data-connector
                            className="absolute inset-0 origin-left bg-gradient-to-r from-brand to-growth"
                            style={{ transform: "scaleX(0)" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Decorative traveling "data packet" dot */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute top-[42px] h-2 w-2 -translate-y-1/2 rounded-full bg-growth shadow-[0_0_10px_0_oklch(0.6_0.13_158/0.7)]"
                initial={{ left: "2%", opacity: 0 }}
                animate={{
                  left: ["2%", "2%", "98%", "98%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  times: [0, 0.1, 0.9, 1],
                }}
              />
            )}

            {/* Hint */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <LiveDot tone="growth" /> Data flows continuously across roles
              </span>
              <span className="font-mono">9 steps · 1 patient</span>
            </div>
          </div>
        ) : (
          /* ── Mobile / reduced: vertical chain ── */
          <div ref={chainRef} className="container-px mx-auto mt-12 max-w-3xl">
            <ol className="relative">
              <span
                aria-hidden
                className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/50 via-brand/25 to-transparent"
              />
              {/* Decorative traveling dot along the rail */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-[15px] h-2 w-2 rounded-full bg-growth shadow-[0_0_8px_0_oklch(0.6_0.13_158/0.7)]"
                  initial={{ top: "2%", opacity: 0 }}
                  animate={{
                    top: ["2%", "2%", "98%", "98%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    times: [0, 0.1, 0.9, 1],
                  }}
                />
              )}
              {IPD_STEPS.map((step, i) => {
                const num = String(i + 1).padStart(2, "0");
                const tag = IPD_ROLE_TAGS[i];
                const RoleIcon = tag.icon;
                return (
                  <li
                    key={step.key}
                    data-anim
                    className="relative flex gap-4 pb-5 last:pb-0"
                  >
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-background">
                      <span className="font-mono text-[10px] font-semibold text-brand">
                        {num}
                      </span>
                    </div>
                    <div className="flex-1 rounded-xl border border-border/60 bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold">{step.key}</h3>
                        <Chip tone="brand" className="text-[10px]">
                          <RoleIcon className="h-3 w-3" />
                          {tag.role}
                        </Chip>
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
      </div>
    </section>
  );
}
