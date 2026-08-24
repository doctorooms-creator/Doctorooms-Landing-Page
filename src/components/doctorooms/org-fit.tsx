"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { ORG_FIT, HOSPITAL_MODULES } from "@/data/doctorooms";
import { MODULE_ICONS, Icon } from "./ui/icons";
import { Chip, LiveDot } from "./ui/chip";
import { useDemoDialog } from "./demo-dialog";
import { ArrowRight, Building2, Check } from "lucide-react";
import { BedDouble, FlaskConical, Stethoscope } from "lucide-react";

type OrgKey = (typeof ORG_FIT)[number]["key"];

// Local icon map keyed by the `icon` field in ORG_FIT data.
const ORG_ICONS: Record<string, typeof Stethoscope> = {
  Stethoscope,
  BedDouble,
  Building2,
  FlaskConical,
};

/**
 * OrgFit — "Built for your organization" interactive section (Ch9.5).
 * Lets a visitor pick their organization type (clinic / hospital /
 * chain / lab) and instantly see which Doctorooms modules are most
 * relevant, plus a tailored value line. Personalizes the pitch
 * between the HospitalOS overview (Ch9) and the IPD deep-dive (Ch10).
 *
 * Premium micro-interaction: org tabs + module grid where relevant
 * modules light up (brand) and the rest fade back. Respects
 * reduced motion (no spring, instant swaps).
 */
export function OrgFit() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<OrgKey>("hospital");
  useReveal(root, { stagger: 0.08, duration: 0.8 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  const current = ORG_FIT.find((o) => o.key === active) ?? ORG_FIT[1];
  const OrgIcon = ORG_ICONS[current.icon] ?? Stethoscope;

  function changeOrg(k: OrgKey) {
    if (k === active) return;
    track("platform_explore_click", { source: "org-fit", org: k });
    setActive(k);
  }

  return (
    <section
      ref={root}
      id="org-fit"
      aria-labelledby="org-fit-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-blob bg-brand/20" style={{ width: 420, height: 420, top: 60, left: "20%" }} />
        <div className="aurora-blob bg-growth/15" style={{ width: 360, height: 360, bottom: 40, right: "15%" }} />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 09½ — Built for your organization
          </div>
          <h2 id="org-fit-heading" className="display-2 mt-4 text-balance" data-anim>
            One platform.{" "}
            <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
              Shaped to your scale.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg" data-anim>
            Whether you run a single clinic, a multi-specialty hospital, a chain,
            or a diagnostic lab — Doctorooms adapts the modules that matter to you.
            Pick your organization type to see the recommended set.
          </p>
        </div>

        {/* Org-type selector */}
        <div className="mt-10 flex justify-center" data-anim>
          <div
            role="tablist"
            aria-label="Organization type"
            className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border bg-muted/40 p-1"
          >
            {ORG_FIT.map((o) => {
              const isActive = o.key === active;
              const OIcon = ORG_ICONS[o.icon] ?? Stethoscope;
              return (
                <button
                  key={o.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => changeOrg(o.key)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-all sm:text-sm sm:px-4",
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon name={OIcon} className="h-3.5 w-3.5" />
                  <span>{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active panel */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8" data-anim>
          {/* Left: tailored copy */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-sm">
                    <Icon name={OrgIcon} className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{current.label}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {current.metric.label}: <span className="font-medium text-foreground">{current.metric.value}</span>
                    </div>
                  </div>
                </div>
                <h3 className="display-3 mt-5 text-balance">{current.headline}</h3>
                <p className="mt-3 text-pretty text-muted-foreground">{current.desc}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button onClick={() => { track("hero_demo_click", { source: "org-fit" }); open(); }}>
                    See it for my organization
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#operations">Compare all modules</a>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: module grid — relevant modules highlight */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Recommended modules
                </div>
                <Chip tone="brand">
                  <LiveDot tone="brand" /> {current.modules.length} of {HOSPITAL_MODULES.length}
                </Chip>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {HOSPITAL_MODULES.map((m) => {
                  const relevant = current.modules.includes(m.key as (typeof current.modules)[number]);
                  const MIcon = MODULE_ICONS[m.key as keyof typeof MODULE_ICONS];
                  return (
                    <div
                      key={m.key}
                      className={cn(
                        "relative overflow-hidden rounded-xl border p-3 transition-all duration-300",
                        relevant
                          ? "border-brand/40 bg-gradient-to-br from-brand-soft to-card shadow-sm"
                          : "border-border/60 bg-muted/30 opacity-55"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg",
                            relevant ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon name={MIcon} className="h-3.5 w-3.5" />
                        </span>
                        <span className={cn("text-xs font-semibold", relevant ? "text-foreground" : "text-muted-foreground")}>
                          {m.key}
                        </span>
                        {relevant && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-growth text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                      <p className={cn("mt-1.5 text-[10px] leading-snug", relevant ? "text-muted-foreground" : "text-muted-foreground/70")}>
                        {m.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="text-brand">Note:</span>
                every organization gets the full module set — this view highlights where
                you&apos;ll spend most of your time. All modules stay connected on one platform.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
