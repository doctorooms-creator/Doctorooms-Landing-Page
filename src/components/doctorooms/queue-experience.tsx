"use client";

import { useRef } from "react";
import {
  useReveal,
  useScrubTransform,
  useScrollTriggerHygiene,
} from "@/lib/anim/hooks";
import { Chip, LiveDot } from "./ui/chip";
import { ProductFrame } from "./ui/product-frame";
import {
  ArrowLeft,
  BellRing,
  Check,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

const QUEUE_ROWS = [
  {
    token: "A-014",
    name: "Rahul Verma",
    dept: "ENT",
    position: 1,
    wait: "~4 min",
    next: true,
  },
  { token: "A-015", name: "Imran S.", dept: "Cardio", position: 2, wait: "~9 min" },
  { token: "A-016", name: "Kavya R.", dept: "Derm", position: 3, wait: "~14 min" },
  { token: "A-017", name: "Aarav P.", dept: "ENT", position: 4, wait: "~18 min" },
] as const;

const STATS = [
  {
    icon: Users,
    label: "Live position visible to patient",
    desc: "Real-time queue position on their own device, no asking the front desk.",
  },
  {
    icon: ShieldCheck,
    label: "Staff see flow across rooms",
    desc: "Operational view across departments — OPD, IPD, lab, pharmacy.",
  },
  {
    icon: BellRing,
    label: "Automated next-patient call",
    desc: "Notification + room number, no shouting across a waiting hall.",
  },
] as const;

export function QueueExperience() {
  const root = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();

  // Signature scrub: move the A-014 token from the live queue INTO the
  // now-calling card as the user scrolls through the section.
  // Disabled on narrow viewports (mobile/tablet) and under reduced-motion
  // (the hook itself short-circuits reduced motion).
  useScrubTransform(
    stageRef,
    (self) => {
      if (
        typeof window !== "undefined" &&
        !window.matchMedia("(min-width: 1024px)").matches
      ) {
        return;
      }
      const token = tokenRef.current;
      if (!token) return;
      const stage = self.trigger as HTMLElement;
      const target = stage.offsetWidth * 0.3; // distance to slide left
      const p = Math.max(0, Math.min(1, self.progress));
      const x = -target * p;
      token.style.transform = `translateX(${x}px)`;
      token.style.opacity = `${0.55 + 0.45 * p}`;
    },
    []
  );

  return (
    <section
      ref={root}
      id="queue"
      aria-labelledby="queue-heading"
      className="ink-section relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-ink opacity-40" />
      <div
        className="aurora-blob bg-brand/30"
        style={{ width: 480, height: 480, top: 80, left: "30%" }}
      />
      <div
        className="aurora-blob bg-growth/15"
        style={{ width: 360, height: 360, bottom: -80, right: -80 }}
      />

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 07 — Smart Queue
          </div>
          <h2
            id="queue-heading"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            Turn Waiting Time Into a Managed Experience.
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-ink-muted sm:text-lg"
            data-anim
          >
            Check-in → token → live queue → next-patient call → notification.
            Patients see their position; staff see the flow.
          </p>
        </div>

        {/* Centerpiece: Smart Queue board */}
        <div className="mt-16 lg:mt-20" data-anim>
          <ProductFrame
            title="Doctorooms · Smart queue"
            toolbar={
              <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <LiveDot tone="growth" /> live · OPD
              </span>
            }
          >
            <div
              ref={stageRef}
              className="relative grid gap-4 p-4 sm:p-5 lg:grid-cols-12"
            >
              {/* Now-calling card */}
              <div className="lg:col-span-5">
                <NowCallingCard />
              </div>

              {/* Live queue list */}
              <div className="lg:col-span-4">
                <QueueList rows={QUEUE_ROWS} />
              </div>

              {/* Phone notification mockup */}
              <div className="lg:col-span-3">
                <PhoneMock />
              </div>

              {/* Moving token (lg+ only) — signature scrub */}
              <div
                ref={tokenRef}
                aria-hidden
                className="pointer-events-none absolute top-12 z-30 hidden lg:block"
                style={{ left: "52%", transform: "translateX(0)", opacity: 0.55 }}
              >
                <div className="flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand px-2.5 py-1 text-xs font-semibold text-brand-foreground shadow-xl">
                  <span>A-014</span>
                  <ArrowLeft className="h-3 w-3" />
                </div>
              </div>
            </div>
          </ProductFrame>
        </div>

        {/* Bottom: qualitative-only stat tiles */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3" data-anim>
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-center gap-2 text-brand">
                <s.icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                  smart queue
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-ink-foreground">
                {s.label}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NowCallingCard() {
  return (
    <div className="pulse-ring relative h-full overflow-hidden rounded-xl border border-brand/30 bg-gradient-to-br from-brand-soft via-card to-card p-5">
      <div className="flex items-center justify-between">
        <Chip tone="brand" className="text-[10px]">
          <LiveDot tone="brand" /> Now calling
        </Chip>
        <span className="text-[10px] text-muted-foreground">
          Room 2 · ENT OPD
        </span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <div className="text-5xl font-semibold tracking-tight text-brand sm:text-6xl">
          A-013
        </div>
        <div className="mb-1.5">
          <div className="text-sm font-semibold">Priya Nair</div>
          <div className="text-[11px] text-muted-foreground">
            ENT · OPD consult
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Tile label="Room" value="2" />
        <Tile label="Doctor" value="Dr. Mehta" />
        <Tile label="Waited" value="~7 min" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-border/60 pt-3">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-3 w-3 text-brand" /> Ground floor · Room 2
        </span>
        <Chip tone="growth" className="text-[10px]">
          <Check className="h-3 w-3" /> called
        </Chip>
      </div>
    </div>
  );
}

function QueueList({ rows }: { rows: readonly typeof QUEUE_ROWS }) {
  return (
    <div className="h-full rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Live queue
        </span>
        <span className="text-[10px] text-muted-foreground">
          {rows.length} waiting
        </span>
      </div>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.token}
            className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs ${
              "next" in r && r.next
                ? "border-brand/30 bg-brand-soft/40"
                : "border-border/60 bg-background"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold text-brand">
                {r.token}
              </span>
              <span className="text-foreground/85">{r.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {r.dept}
              </span>
            </span>
            <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>#{r.position}</span>
              <span>{r.wait}</span>
              {"next" in r && r.next && <LiveDot tone="brand" />}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between px-1 pt-2 text-[10px] text-muted-foreground">
        <span>auto-refresh · 5s</span>
        <span>sorted by position</span>
      </div>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative w-full max-w-[220px] rounded-[2rem] border-[6px] border-foreground/10 bg-foreground p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-foreground/30" />
        {/* Screen */}
        <div className="rounded-[1.4rem] bg-background p-3 pt-5">
          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
            <span>4:48 PM</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Doctorooms
            </span>
          </div>

          {/* Push notification */}
          <div className="mt-3 rounded-xl border border-brand/30 bg-brand-soft/40 p-2.5">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <BellRing className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                  Queue update
                </div>
                <div className="mt-0.5 text-[11px] font-semibold leading-snug text-foreground">
                  You&apos;re next — please proceed to Room 2
                </div>
                <div className="mt-1 text-[9px] text-muted-foreground">
                  Token A-014 · ~4 min
                </div>
              </div>
            </div>
          </div>

          {/* Position bar */}
          <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 p-2">
            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
              <span>Your position</span>
              <span className="font-semibold text-foreground">#1 of 4</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand to-growth" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-[10px] text-muted-foreground">
        Patient sees position in real time
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-background/60 px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold text-foreground">{value}</div>
    </div>
  );
}
