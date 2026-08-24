"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useReveal,
  useScrubTransform,
  useScrollTriggerHygiene,
} from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { Chip, LiveDot } from "./ui/chip";
import { ProductFrame } from "./ui/product-frame";
import {
  CalendarClock,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  Sparkles,
  Stethoscope,
  UserRound,
  ArrowRight,
} from "lucide-react";

const STEPS = [
  {
    key: "queue",
    label: "Queue",
    icon: CalendarClock,
    blurb: "Patient called from live queue, context loaded",
  },
  {
    key: "history",
    label: "History",
    icon: FileText,
    blurb: "Past visits, conditions, allergies surfaced",
  },
  {
    key: "consultation",
    label: "Consultation",
    icon: Stethoscope,
    blurb: "Notes captured inline, vitals referenced",
  },
  {
    key: "rx",
    label: "AI Rx",
    icon: Sparkles,
    blurb: "Draft prescription suggested from history",
  },
  {
    key: "followup",
    label: "Follow-up",
    icon: HeartPulse,
    blurb: "Plan, reminders, continuity scheduled",
  },
] as const;

export function DoctorGrowth() {
  const root = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [tab, setTab] = useState<"history" | "vitals" | "notes">("history");

  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();

  useScrubTransform(
    stepsRef,
    (self) => {
      const idx = Math.max(
        0,
        Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
      );
      setActiveStep((prev) => (prev === idx ? prev : idx));
    },
    []
  );

  return (
    <section
      ref={root}
      id="doctor"
      aria-labelledby="doctor-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/25"
          style={{ width: 420, height: 420, top: 60, left: -100 }}
        />
        <div
          className="aurora-blob bg-growth/15"
          style={{ width: 360, height: 360, bottom: -60, right: -80 }}
        />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 04 — Doctor Growth &amp; Productivity
          </div>
          <h2
            id="doctor-heading"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            Let Doctors Focus on Patients. Not Paperwork.
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Queue → patient history → consultation → AI-assisted prescription →
            follow-up. Minimal navigation. AI reduces cognitive and
            administrative friction.
          </p>
        </div>

        {/* Two-column stage */}
        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Left: copy + scroll-scrubbed step pills */}
          <div className="lg:col-span-5" data-anim>
            <div className="flex items-center gap-2">
              <Chip tone="brand">
                <Stethoscope className="h-3 w-3" /> Doctor workflow
              </Chip>
              <span className="text-[11px] text-muted-foreground">
                five steps · one console
              </span>
            </div>

            <div ref={stepsRef} className="relative mt-6">
              {/* Vertical rail (mobile + desktop) */}
              <div
                aria-hidden
                className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/30 via-brand/15 to-transparent"
              />
              <ol className="relative grid gap-3">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === activeStep;
                  return (
                    <li key={s.key}>
                      <div
                        className={`relative flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                          active
                            ? "border-brand/40 bg-brand-soft/50"
                            : "border-border/60 bg-card/50"
                        }`}
                      >
                        <span
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            active
                              ? "border-brand bg-brand text-brand-foreground"
                              : "border-border/60 bg-background text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {s.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              step {i + 1}
                            </span>
                            {active && (
                              <LiveDot tone="brand" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {s.blurb}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Scroll to walk the flow — the active step tracks progress so
              you can see how little navigation a single consult actually
              needs.
            </p>
          </div>

          {/* Right: doctor console product frame */}
          <div className="lg:col-span-7" data-anim>
            <ProductFrame
              title="Doctorooms · Doctor console"
              toolbar={
                <span className="text-[10px] text-muted-foreground">
                  Dr. Anjali Mehta · OPD
                </span>
              }
            >
              <div className="p-4 sm:p-5">
                {/* Patient header */}
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <UserRound className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold">
                          Rahul Verma
                        </span>
                        <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          M / 34
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Last visit 6 days ago · acute sinusitis · follow-up
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Chip tone="brand" className="text-[10px]">
                      <CalendarClock className="h-3 w-3" /> A-014
                    </Chip>
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      in consult
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-4" role="tablist" aria-label="Patient record sections">
                  <div className="flex gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
                    {([
                      { id: "history", label: "History" },
                      { id: "vitals", label: "Vitals" },
                      { id: "notes", label: "Notes" },
                    ] as const).map((t) => (
                      <button
                        key={t.id}
                        role="tab"
                        aria-selected={tab === t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          tab === t.id
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm">
                    {tab === "history" && (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-medium text-brand">
                          <FileText className="h-3.5 w-3.5" /> Recent history
                        </div>
                        <ul className="space-y-1.5 text-xs text-foreground/85">
                          <li>
                            <span className="text-muted-foreground">6d ago ·</span>{" "}
                            Acute sinusitis — amoxicillin 500mg started
                          </li>
                          <li>
                            <span className="text-muted-foreground">3m ago ·</span>{" "}
                            Allergic rhinitis — fluticasone nasal
                          </li>
                          <li>
                            <span className="text-muted-foreground">1y ago ·</span>{" "}
                            Routine ENT check, no abnormality
                          </li>
                        </ul>
                        <div className="pt-1 text-[10px] text-muted-foreground">
                          Allergies: none recorded
                        </div>
                      </div>
                    )}
                    {tab === "vitals" && (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          { l: "BP", v: "122/78" },
                          { l: "HR", v: "84" },
                          { l: "SpO₂", v: "98%" },
                          { l: "Temp", v: "98.4°F" },
                        ].map((k) => (
                          <div
                            key={k.l}
                            className="rounded-lg border border-border/60 bg-background p-2.5"
                          >
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                              {k.l}
                            </div>
                            <div className="mt-0.5 text-sm font-semibold">
                              {k.v}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {tab === "notes" && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-brand">
                          <ClipboardList className="h-3.5 w-3.5" /> Consultation notes
                        </div>
                        <p className="text-xs leading-relaxed text-foreground/85">
                          Symptom improvement partial on day 5. Mild facial
                          pressure persists. Continue course, add saline
                          spray. Review in 3 days.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Draft prescription panel */}
                <div className="mt-4 rounded-xl border border-brand/25 bg-brand-soft/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand">
                      <Sparkles className="h-3.5 w-3.5" /> AI-drafted prescription
                    </div>
                    <Chip tone="brand" className="text-[10px]">
                      draft · review
                    </Chip>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    <li className="flex items-center justify-between rounded-md bg-background/80 px-2.5 py-1.5 text-xs">
                      <span className="flex items-center gap-2">
                        <Pill className="h-3.5 w-3.5 text-brand" />
                        Amoxicillin <span className="font-semibold">500 mg</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        × 5 days · TID
                      </span>
                    </li>
                    <li className="flex items-center justify-between rounded-md bg-background/80 px-2.5 py-1.5 text-xs">
                      <span className="flex items-center gap-2">
                        <Pill className="h-3.5 w-3.5 text-brand" />
                        Saline nasal spray
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        PRN · 2 puffs
                      </span>
                    </li>
                  </ul>

                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-brand/30 pt-3">
                    <span className="text-[10px] text-muted-foreground">
                      Continued from last visit · auditable
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        track("ai_demo_interaction", {
                          role: "doctor",
                          action: "review_prescription",
                        })
                      }
                      className="group"
                    >
                      Review draft
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </ProductFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
