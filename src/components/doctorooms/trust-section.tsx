"use client";

import { useRef } from "react";
import { useReveal } from "@/lib/anim/hooks";
import { TRUST_POINTS, TRUST_DISCLAIMER } from "@/data/doctorooms";
import {
  FileCheck,
  KeyRound,
  Lock,
  ScrollText,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const ICONS: LucideIcon[] = [
  KeyRound,
  Server,
  Lock,
  ScrollText,
  FileCheck,
  ShieldCheck,
];

export function TrustSection() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.1, y: 24 });

  return (
    <section
      ref={ref}
      id="security"
      aria-labelledby="security-title"
      className="scroll-anchor relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Calm ambient backdrop — a breather after dark cinematic sections */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand-soft"
          style={{ width: 460, height: 460, top: -140, right: -120, opacity: 0.5 }}
        />
        <div
          className="aurora-blob bg-growth/15"
          style={{ width: 360, height: 360, bottom: -120, left: -80, opacity: 0.55 }}
        />
        <div className="absolute inset-0 bg-grid opacity-25" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 12 — Trust &amp; Security
          </div>
          <h2
            id="security-title"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            Healthcare Data Deserves a{" "}
            <span className="text-brand">Higher Standard.</span>
          </h2>
          <p
            className="mt-5 text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Role-based access, tenant/data isolation, authentication,
            auditability, controlled workflows, and security controls that are
            actually implemented.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((p, i) => {
            const Icon = ICONS[i % ICONS.length] ?? ShieldCheck;
            return (
              <div
                key={p.title}
                data-anim
                className="lift-on-hover group relative rounded-2xl border border-border/70 bg-card p-6 hover:border-brand/40 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visible disclaimer — no unverified certification claims */}
        <div
          data-anim
          className="mx-auto mt-12 max-w-3xl rounded-xl border border-border/70 bg-muted/40 p-4 sm:p-5"
        >
          <div className="flex gap-3">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">
                Disclaimer:&nbsp;
              </span>
              {TRUST_DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
