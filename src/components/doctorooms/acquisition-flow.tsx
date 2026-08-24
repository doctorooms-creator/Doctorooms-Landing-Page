"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { useDemoDialog } from "./demo-dialog";
import { Chip, LiveDot } from "./ui/chip";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  MapPin,
  QrCode,
  Search,
  Star,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

type StepDef = {
  num: number;
  label: string;
  hint: string;
  render: () => React.ReactNode;
};

const STEPS: StepDef[] = [
  {
    num: 1,
    label: "Search & discovery",
    hint: "where patients already look",
    render: () => <SearchResultsCard />,
  },
  {
    num: 2,
    label: "Doctor & hospital profile",
    hint: "trust before they book",
    render: () => <ProfileCard />,
  },
  {
    num: 3,
    label: "Booking",
    hint: "in-person or video",
    render: () => <BookingSlotCard />,
  },
  {
    num: 4,
    label: "Confirmation",
    hint: "instant, no waiting",
    render: () => <ConfirmationCard />,
  },
  {
    num: 5,
    label: "Check-in",
    hint: "token issued, queue assigned",
    render: () => <CheckInCard />,
  },
];

export function AcquisitionFlow() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, { stagger: 0.12, duration: 0.85 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  return (
    <section
      ref={root}
      id="acquisition"
      aria-labelledby="acquisition-heading"
      className="scroll-anchor relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/25"
          style={{ width: 420, height: 420, top: -60, right: -80 }}
        />
        <div
          className="aurora-blob bg-growth/20"
          style={{ width: 380, height: 380, bottom: -80, left: -60 }}
        />
        <div className="absolute inset-0 bg-grid opacity-50" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 03 — Patient Acquisition
          </div>
          <h2
            id="acquisition-heading"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            Bring More Patients Through Your Door.
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Be discoverable where patients already search. Make booking easy —
            in-person or video. Connect discovery to care and follow-up.
          </p>
          <div className="mt-6 flex justify-center" data-anim>
            <Chip tone="neutral">
              <span className="text-[10px]">illustrative model</span>
              <span className="text-muted-foreground/70">·</span>
              <span className="text-[10px] text-muted-foreground">
                more discoverable · fewer abandoned bookings
              </span>
            </Chip>
          </div>
        </div>

        {/* Flow */}
        <ol
          data-anim
          className="relative mt-16 flex flex-col gap-7 md:mt-20 md:flex-row md:gap-3 md:overflow-x-auto md:pb-3 md:scroll-soft lg:gap-2 lg:overflow-visible"
          aria-label="Patient acquisition flow"
        >
          {/* Mobile left rail */}
          <div
            aria-hidden
            className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/40 via-brand/15 to-transparent md:hidden"
          />
          {/* Desktop hairline */}
          <div
            aria-hidden
            className="absolute left-[6%] right-[6%] top-7 hidden h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent md:block"
          />

          {STEPS.map((step) => (
            <li
              key={step.num}
              data-anim
              className="relative flex-1 md:min-w-[210px] lg:min-w-0"
            >
              {/* Step badge */}
              <div className="relative z-10 mb-4 flex items-center gap-3 md:mb-5 md:block">
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-brand/30 bg-background text-sm font-semibold text-brand shadow-sm md:h-9 md:w-9 md:text-xs">
                  {String(step.num).padStart(2, "0")}
                </span>
                <div className="md:mt-2.5 md:pl-0">
                  <div className="text-sm font-semibold leading-tight">
                    {step.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {step.hint}
                  </div>
                </div>
              </div>

              {/* Card */}
              <div className="pl-[68px] md:pl-0">{step.render()}</div>
            </li>
          ))}
        </ol>

        {/* CTA row */}
        <div
          data-anim
          className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <a href="#journey">
              See how acquisition connects to operations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
          <Button
            size="lg"
            onClick={() => {
              track("platform_explore_click", { source: "acquisition" });
              open();
            }}
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

/* ------------------------- Mock cards ------------------------- */

function CardWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card p-3.5 text-card-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SearchResultsCard() {
  return (
    <CardWrap>
      <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-2 text-xs text-muted-foreground">
        <Search className="h-3.5 w-3.5 text-brand" />
        <span>ent doctor near me</span>
      </div>
      <div className="mt-3 grid gap-1.5">
        {[
          { n: "Dr. Anjali Mehta", c: "ENT · 0.8 km", active: true },
          { n: "Mehta ENT Clinic", c: "Hospital · 0.8 km", active: false },
          { n: "Dr. R. Khan", c: "ENT · 1.6 km", active: false },
        ].map((r) => (
          <div
            key={r.n}
            className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs ${
              r.active
                ? "border-brand/30 bg-brand-soft/40"
                : "border-border/50 bg-background"
            }`}
          >
            <div className="flex items-center gap-2">
              <Stethoscope className="h-3 w-3 text-brand" />
              <span className="font-medium text-foreground">{r.n}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{r.c}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>3 results · 0.4s</span>
        <LiveDot tone="brand" />
      </div>
    </CardWrap>
  );
}

function ProfileCard() {
  return (
    <CardWrap>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
          <UserRound className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">Dr. Anjali Mehta</div>
          <div className="text-[11px] text-muted-foreground">
            ENT · 12 yrs · MBBS, MS
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Star className="h-3 w-3 text-growth" />
            <span>trust signals &amp; reviews</span>
          </div>
        </div>
      </div>
      <div className="mt-3 grid gap-1.5 text-[11px]">
        <Row icon={<MapPin className="h-3 w-3" />}>Mehta ENT Clinic, Bengaluru</Row>
        <Row icon={<CalendarClock className="h-3 w-3" />}>Open · today till 8:00 PM</Row>
        <Row icon={<Video className="h-3 w-3" />}>Video consult available</Row>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-border/60 pt-2 text-[10px] text-muted-foreground">
        <span>OPD · IPD · Pharmacy on-site</span>
        <Chip tone="brand" className="text-[10px]">verified</Chip>
      </div>
    </CardWrap>
  );
}

function BookingSlotCard() {
  const days = ["Today", "Tomorrow", "Fri"];
  const slots = ["4:20", "4:40", "5:00", "5:20"];
  return (
    <CardWrap>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Pick a slot
        </div>
        <Chip tone="brand" className="text-[10px]">
          <Video className="h-3 w-3" /> Video
        </Chip>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px]">
        {days.map((d, i) => (
          <div
            key={d}
            className={`rounded-md border px-1 py-1 ${
              i === 0
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border/60 bg-background text-muted-foreground"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-1 text-center text-[10px]">
        {slots.map((s, i) => (
          <div
            key={s}
            className={`rounded-md border px-1 py-1.5 font-medium ${
              i === 1
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border/60 bg-background text-foreground/80"
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>For Rahul Verma · follow-up</span>
        <span className="text-foreground">₹ fee on confirm</span>
      </div>
    </CardWrap>
  );
}

function ConfirmationCard() {
  return (
    <CardWrap>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Booking confirmed
        </div>
        <LiveDot tone="growth" />
      </div>
      <div className="mt-2 text-sm font-semibold">Today · 4:40 PM</div>
      <div className="text-[11px] text-muted-foreground">
        Dr. Anjali Mehta · ENT
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2">
        <CalendarCheck className="h-3.5 w-3.5 text-growth" />
        <span className="text-[11px] text-foreground/80">
          Confirmation sent · SMS + email
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Reschedule any time</span>
        <Chip tone="brand" className="text-[10px]">in-person</Chip>
      </div>
    </CardWrap>
  );
}

function CheckInCard() {
  return (
    <CardWrap>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Token issued
        </div>
        <QrCode className="h-4 w-4 text-brand" />
      </div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-brand">
        A-014
      </div>
      <div className="text-[11px] text-muted-foreground">
        Rahul Verma · ENT · OPD
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
          <div className="text-muted-foreground">Position</div>
          <div className="text-sm font-semibold text-foreground">#3</div>
        </div>
        <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
          <div className="text-muted-foreground">Est. wait</div>
          <div className="text-sm font-semibold text-foreground">~12 min</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Queue assigned</span>
        <LiveDot tone="growth" />
      </div>
    </CardWrap>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span>{icon}</span>
      <span className="text-foreground/85">{children}</span>
    </div>
  );
}
