"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  gsap,
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "@/lib/anim/gsap-register";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { ROLES } from "@/data/doctorooms";
import { ROLE_ICONS } from "./ui/icons";
import { Chip, LiveDot } from "./ui/chip";
import { Stethoscope, UserRound } from "lucide-react";

export function RoleOrbit() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  useScrollTriggerHygiene();

  useReveal(headerRef, { y: 18, stagger: 0.08 });

  // Stagger satellites fade/scale-in on scroll-into-view (desktop).
  useIsomorphicLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || reduced) return;
    const sats = el.querySelectorAll<HTMLElement>("[data-sat]");
    if (sats.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(sats, { opacity: 0, scale: 0.6 });
      gsap.to(sats, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.6)",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, isDesktop]);

  useReveal(stageRef, { y: 12, stagger: 0.05 });

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Geometry: 9 roles placed evenly around a circle, starting from top.
  const { positions, radius } = useMemo(() => {
    const N = ROLES.length;
    const r = 220;
    const angleStep = 360 / N;
    const list = ROLES.map((_, i) => {
      const angle = (-90 + angleStep * i) * (Math.PI / 180);
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      };
    });
    return { positions: list, radius: r };
  }, []);

  return (
    <section
      ref={rootRef}
      id="roles"
      aria-labelledby="roles-h"
      className="relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 520, height: 520, top: -160, left: "30%" }}
        />
        <div
          className="aurora-blob bg-growth/10"
          style={{ width: 420, height: 420, bottom: -160, right: -120 }}
        />
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 11 — Role Ecosystem
          </div>
          <h2 id="roles-h" className="display-2 mt-4 text-balance" data-anim>
            One Platform. Every Role.
          </h2>
          <p
            className="mt-5 text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Admin, Doctor, Hospital Admin, Patient, Receptionist, Assistant,
            Pharmacist, Nurse, Lab — each with the access and tools their role
            needs.
          </p>
        </div>

        {isDesktop ? (
          /* ── Desktop: orbit composition ── */
          <div
            ref={stageRef}
            className="relative mx-auto mt-16 h-[560px] w-[560px] max-w-full"
            aria-label="Role ecosystem orbit"
          >
            {/* Decorative concentric rings (slow rotation on the dashed outer ring) */}
            <div
              aria-hidden
              className={`absolute inset-0 rounded-full border border-dashed border-brand/30 ${
                reduced ? "" : "animate-[spin_48s_linear_infinite]"
              }`}
            />
            <div
              aria-hidden
              className="absolute inset-8 rounded-full border border-brand/15"
            />
            <div
              aria-hidden
              className="absolute inset-20 rounded-full border border-brand/10"
            />
            {/* Soft center glow */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
            />

            {/* Center logo mark */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center gap-2.5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-xl shadow-brand/20">
                  <Stethoscope className="h-8 w-8" />
                </div>
                <div className="text-sm font-semibold tracking-tight">
                  Doctorooms
                </div>
                <Chip tone="brand" className="text-[10px]">
                  <LiveDot tone="brand" /> 9 roles · 1 platform
                </Chip>
              </div>
            </div>

            {/* Satellite role chips */}
            {ROLES.map((role, i) => {
              const Icon = ROLE_ICONS[role.key] ?? UserRound;
              const pos = positions[i];
              return (
                <div
                  key={role.key}
                  data-sat
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                  }}
                >
                  <div
                    className="group flex w-[140px] flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-3 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                    title={`${role.key} — ${role.desc}`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:scale-105">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold tracking-tight">
                        {role.key}
                      </div>
                      <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                        {role.desc}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Mobile / reduced: responsive grid of role cards ── */
          <div
            ref={stageRef}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {ROLES.map((role) => {
              const Icon = ROLE_ICONS[role.key] ?? UserRound;
              return (
                <div
                  key={role.key}
                  data-anim
                  className="group flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      {role.key}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {role.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footnote */}
        <div className="mx-auto mt-12 max-w-2xl text-center text-xs text-muted-foreground">
          Each role sees only the data and actions its scope authorizes —
          enforced across OPD, IPD, lab, pharmacy, billing, inventory and
          reports.
        </div>
      </div>
    </section>
  );
}
