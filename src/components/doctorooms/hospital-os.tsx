"use client";

import { useRef } from "react";
import {
  gsap,
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "@/lib/anim/gsap-register";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { HOSPITAL_MODULES } from "@/data/doctorooms";
import { MODULE_ICONS, type ModuleIconKey } from "./ui/icons";
import { Chip, LiveDot } from "./ui/chip";
import { ProductFrame } from "./ui/product-frame";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useDemoDialog } from "./demo-dialog";
import { track } from "@/lib/analytics";

export function HospitalOS() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const { open } = useDemoDialog();
  useScrollTriggerHygiene();

  useReveal(headerRef, { y: 18, stagger: 0.08 });

  // "Assemble into one OS" — staggered scale + y reveal.
  useIsomorphicLayoutEffect(() => {
    const el = tilesRef.current;
    if (!el) return;
    const tiles = el.querySelectorAll<HTMLElement>("[data-tile]");
    if (tiles.length === 0) return;

    if (reduced) {
      gsap.set(tiles, { opacity: 1, y: 0, scale: 1, clearProps: "transform,opacity" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(tiles, { opacity: 0, y: 28, scale: 0.86 });
      gsap.to(tiles, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const handleDemo = () => {
    track("hero_demo_click", { source: "operations" });
    open();
  };

  return (
    <section
      ref={rootRef}
      id="operations"
      aria-labelledby="operations-h"
      className="relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 520, height: 520, top: -160, left: "40%" }}
        />
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 09 — Hospital Operations
          </div>
          <h2
            id="operations-h"
            className="display-2 mt-4 text-balance"
            data-anim
          >
            When Your Patients Grow, Your Operations Shouldn&apos;t Get
            Complicated.
          </h2>
          <p
            className="mt-5 text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            OPD, IPD, Laboratory, Pharmacy, Billing, Inventory, OT, Insurance,
            Reports, Queue, Documents — connected in one operating layer.
          </p>
        </div>

        {/* Module tiles grid */}
        <div
          ref={tilesRef}
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {HOSPITAL_MODULES.map((m) => {
            const Icon = MODULE_ICONS[m.key as ModuleIconKey];
            return (
              <button
                key={m.key}
                type="button"
                data-tile
                onClick={() =>
                  track("platform_explore_click", {
                    source: "operations",
                    module: m.key,
                  })
                }
                className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-brand/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {m.key}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">
                    {m.key}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {m.desc}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
                  <span>module</span>
                  <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Operations bar — modules wired together */}
        <div className="mt-12">
          <ProductFrame
            title="Doctorooms · Operations"
            toolbar={
              <Chip tone="growth" className="text-[10px]">
                <LiveDot tone="growth" /> Live
              </Chip>
            }
          >
            <div className="flex flex-wrap items-center gap-2 p-4">
              {HOSPITAL_MODULES.map((m) => {
                const Icon = MODULE_ICONS[m.key as ModuleIconKey];
                return (
                  <Chip key={m.key} tone="neutral" className="text-[10px]">
                    <Icon className="h-3 w-3" />
                    {m.key}
                  </Chip>
                );
              })}
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <LiveDot tone="growth" /> All systems normal
              </span>
            </div>
            <div className="hairline" />
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-[11px] text-muted-foreground">
              <span>11 modules · 1 operating layer</span>
              <span className="font-mono">OPD + IPD + Lab + Pharmacy + Billing · synced</span>
            </div>
          </ProductFrame>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Button size="lg" onClick={handleDemo} className="group">
            Book a Private Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <p className="text-xs text-muted-foreground">
            A walkthrough of all 11 modules — tailored to your hospital.
          </p>
        </div>
      </div>
    </section>
  );
}
