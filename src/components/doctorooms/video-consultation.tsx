"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { useDemoDialog } from "./demo-dialog";
import { Chip, LiveDot } from "./ui/chip";
import { ProductFrame } from "./ui/product-frame";
import {
  ArrowRight,
  CalendarClock,
  HeartPulse,
  MessageSquare,
  Mic,
  PhoneOff,
  Pill,
  Search,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

const TIMELINE = [
  {
    step: "Discovery",
    desc: "Patient finds the doctor or hospital online — by specialty, location, or name.",
    icon: Search,
  },
  {
    step: "Video booking",
    desc: "Chooses a video slot and confirms. Calendar invite + reminders sent.",
    icon: Video,
  },
  {
    step: "Consultation",
    desc: "Doctor joins with history already loaded. Patient history referenced live.",
    icon: Stethoscope,
  },
  {
    step: "Prescription",
    desc: "AI-drafted Rx shared live inside the call, signed before disconnect.",
    icon: Pill,
  },
  {
    step: "Follow-up",
    desc: "Plan + reminders set before the call ends. Continuity scheduled.",
    icon: HeartPulse,
  },
] as const;

const CONTROLS = [
  { icon: Mic, label: "Mute", tone: "neutral" as const },
  { icon: Video, label: "Camera", tone: "neutral" as const },
  { icon: MessageSquare, label: "Chat", tone: "neutral" as const },
  { icon: PhoneOff, label: "End", tone: "warn" as const },
];

export function VideoConsultation() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  return (
    <section
      ref={root}
      id="video"
      aria-labelledby="video-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/25"
          style={{ width: 420, height: 420, top: -60, left: -100 }}
        />
        <div
          className="aurora-blob bg-growth/20"
          style={{ width: 380, height: 380, bottom: -80, right: -100 }}
        />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 06 — Video Consultation
          </div>
          <h2
            id="video-heading"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            Care Doesn&apos;t Have to Stop at the Hospital Door.
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Give patients another way to access your doctors — discovery →
            video booking → consultation → prescription → follow-up. The
            relationship stays connected.
          </p>
        </div>

        {/* Two-column stage */}
        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Left: timeline */}
          <div className="lg:col-span-5" data-anim>
            <Timeline />
          </div>

          {/* Right: video call mockup */}
          <div className="lg:col-span-7" data-anim>
            <ProductFrame
              title="Doctorooms · Video consult"
              toolbar={
                <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <LiveDot tone="brand" /> live · 24 Oct, 4:48 PM
                </span>
              }
            >
              <VideoCallMock />
            </ProductFrame>
          </div>
        </div>

        {/* CTA row */}
        <div
          data-anim
          className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <a href="#ai">
              Experience the AI
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button
            size="lg"
            onClick={() => open()}
            className="group"
          >
            Book a Private Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <ol className="relative" aria-label="Video consultation journey">
      <div
        aria-hidden
        className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/30 via-brand/15 to-transparent"
      />
      {TIMELINE.map((s, i) => {
        const Icon = s.icon;
        return (
          <li
            key={s.step}
            data-anim
            className="relative pb-6 pl-12 last:pb-0"
          >
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-brand/30 bg-background text-brand shadow-sm">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{s.step}</span>
                <span className="text-[10px] text-muted-foreground">
                  step {i + 1}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function VideoCallMock() {
  return (
    <div className="p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-5">
        {/* Main video tile */}
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-brand-deep via-brand to-ink">
            {/* subtle pattern overlay */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 40% 30%, rgba(255,255,255,0.18), transparent 60%)",
              }}
            />

            {/* Doctor avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md sm:h-24 sm:w-24">
                <UserRound className="h-10 w-10 text-white/90 sm:h-12 sm:w-12" />
              </div>
            </div>

            {/* Name pill */}
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[11px] text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Dr. Anjali Mehta · ENT
              <span className="text-[10px] text-white/60">speaking</span>
            </div>

            {/* Self-view PIP (patient) */}
            <div className="absolute bottom-3 right-3 flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-gradient-to-br from-growth/40 via-brand-deep to-ink sm:h-20 sm:w-28">
              <UserRound className="h-5 w-5 text-white/70 sm:h-6 sm:w-6" />
              <span className="absolute bottom-1 left-1 rounded bg-black/40 px-1 text-[9px] text-white/80 backdrop-blur">
                You
              </span>
            </div>

            {/* Timer / call state */}
            <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] text-white backdrop-blur">
              <LiveDot tone="brand" /> 00:04:18
            </div>
          </div>

          {/* Control bar */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {CONTROLS.map((c) => {
              const isEnd = c.label === "End";
              return (
                <button
                  key={c.label}
                  type="button"
                  aria-label={c.label}
                  onClick={() =>
                    track("video_consultation_section_interaction", {
                      control: c.label,
                    })
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isEnd
                      ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                      : "border-border/60 bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  <c.icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Side panel: live prescription share */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Live Rx share
              </div>
              <LiveDot tone="growth" />
            </div>

            <div className="mt-2 text-xs font-semibold text-foreground">
              Rahul Verma · follow-up
            </div>
            <div className="text-[10px] text-muted-foreground">
              visible to patient · signs in-call
            </div>

            <ul className="mt-2.5 space-y-1.5">
              <li className="flex items-center justify-between rounded-md bg-background px-2 py-1.5 text-xs">
                <span className="flex items-center gap-1.5">
                  <Pill className="h-3 w-3 text-brand" />
                  Amoxicillin <span className="font-semibold">500 mg</span>
                </span>
                <span className="text-[10px] text-muted-foreground">× 5d</span>
              </li>
              <li className="flex items-center justify-between rounded-md bg-background px-2 py-1.5 text-xs">
                <span className="flex items-center gap-1.5">
                  <Pill className="h-3 w-3 text-brand" />
                  Saline nasal spray
                </span>
                <span className="text-[10px] text-muted-foreground">PRN</span>
              </li>
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-border/60 pt-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Sparkles className="h-3 w-3 text-brand" /> AI-drafted
              </span>
              <Chip tone="brand" className="text-[10px]">
                pending sign
              </Chip>
            </div>
          </div>

          {/* Side info */}
          <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Next steps
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-foreground/85">
              <CalendarClock className="h-3.5 w-3.5 text-brand" />
              Follow-up in 3 days · reminder set
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-foreground/85">
              <HeartPulse className="h-3.5 w-3.5 text-brand" />
              Vitals re-check at follow-up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
