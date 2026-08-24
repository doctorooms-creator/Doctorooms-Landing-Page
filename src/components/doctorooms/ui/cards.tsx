"use client";

import { cn } from "@/lib/utils";
import { Chip, LiveDot } from "./chip";
import { CalendarClock, MapPin, Stethoscope, UserRound, Video } from "lucide-react";

/** Patient discovery / booking card. */
export function PatientCard({
  name = "Rahul Verma",
  reason = "Follow-up — sinusitis",
  doctor = "Dr. Anjali Mehta",
  clinic = "Mehta ENT Clinic, Bengaluru",
  slot = "Today · 4:40 PM",
  mode = "in-person",
  tone = "light",
  className,
}: {
  name?: string;
  reason?: string;
  doctor?: string;
  clinic?: string;
  slot?: string;
  mode?: "in-person" | "video";
  tone?: "light" | "ink";
  className?: string;
}) {
  const dark = tone === "ink";
  return (
    <div
      className={cn(
        "w-full rounded-2xl border p-4",
        dark
          ? "border-white/10 bg-white/[0.04] text-ink-foreground"
          : "border-border/70 bg-card text-card-foreground shadow-sm"
      )}
      style={{ width: 280 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              dark ? "bg-white/10" : "bg-brand-soft text-brand"
            )}
          >
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">{name}</div>
            <div className={cn("text-xs", dark ? "text-ink-muted" : "text-muted-foreground")}>
              {reason}
            </div>
          </div>
        </div>
        <Chip tone={mode === "video" ? "brand" : "neutral"}>
          {mode === "video" ? (
            <>
              <Video className="h-3 w-3" /> Video
            </>
          ) : (
            "In-person"
          )}
        </Chip>
      </div>
      <div className="mt-3 space-y-1.5 text-xs">
        <Row icon={<Stethoscope className="h-3.5 w-3.5" />} text={doctor} dark={dark} />
        <Row icon={<MapPin className="h-3.5 w-3.5" />} text={clinic} dark={dark} />
        <Row icon={<CalendarClock className="h-3.5 w-3.5" />} text={slot} dark={dark} />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-dashed pt-3"
        style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
        <span className={cn("text-[11px]", dark ? "text-ink-muted" : "text-muted-foreground")}>
          Booking confirmed
        </span>
        <LiveDot tone="growth" />
      </div>
    </div>
  );
}

function Row({ icon, text, dark }: { icon: React.ReactNode; text: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn(dark ? "text-ink-muted" : "text-muted-foreground")}>{icon}</span>
      <span className={dark ? "text-ink-foreground/90" : "text-foreground/90"}>{text}</span>
    </div>
  );
}

/** Queue token — the thing that travels into a doctor workflow. */
export function QueueToken({
  number = "A-014",
  name = "Rahul Verma",
  dept = "ENT",
  position = 3,
  tone = "light",
  className,
}: {
  number?: string;
  name?: string;
  dept?: string;
  position?: number;
  tone?: "light" | "ink";
  className?: string;
}) {
  const dark = tone === "ink";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4",
        dark
          ? "border-white/10 bg-white/[0.04]"
          : "border-brand/20 bg-gradient-to-br from-brand-soft to-card",
        className
      )}
      style={{ width: 220 }}
    >
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px] font-medium uppercase tracking-wider", dark ? "text-ink-muted" : "text-muted-foreground")}>
          Token
        </span>
        <LiveDot tone="growth" />
      </div>
      <div className="mt-1 text-4xl font-semibold tracking-tight">{number}</div>
      <div className={cn("mt-1 text-xs", dark ? "text-ink-muted" : "text-muted-foreground")}>
        {name} · {dept}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px]">
        <span className={dark ? "text-ink-muted" : "text-muted-foreground"}>Position in queue</span>
        <span className="font-semibold">#{position}</span>
      </div>
    </div>
  );
}
