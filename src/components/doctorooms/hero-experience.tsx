"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { gsap, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/anim/gsap-register";
import { useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { BRAND, STATS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import {
  Activity,
  ArrowRight,
  BedDouble,
  CalendarClock,
  HeartPulse,
  Pill,
  PlayCircle,
  Receipt,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { PatientCard } from "./ui/cards";
import { Chip, LiveDot } from "./ui/chip";
import { AppRail, ColHeader, ProductFrame } from "./ui/product-frame";

const HERO_RAIL = [
  { icon: <CalendarClock className="h-4 w-4" />, label: "Queue" },
  { icon: <Stethoscope className="h-4 w-4" />, label: "OPD" },
  { icon: <BedDouble className="h-4 w-4" />, label: "IPD" },
  { icon: <Pill className="h-4 w-4" />, label: "Pharmacy" },
  { icon: <Receipt className="h-4 w-4" />, label: "Billing" },
  { icon: <Activity className="h-4 w-4" />, label: "Reports" },
];

export function HeroExperience() {
  const root = useRef<HTMLDivElement>(null);
  const uiStage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();

  // Hero entrance choreography: progressive UI assembly.
  useIsomorphicLayoutEffect(() => {
    if (!root.current) return;
    if (reduced) {
      gsap.set(root.current!.querySelectorAll("[data-hero-step]"), {
        opacity: 1,
        y: 0,
      });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-hero-step='eyebrow']", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo("[data-hero-step='h1'] > span", {
          yPercent: 110,
          opacity: 0,
        }, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
        }, "-=0.2")
        .fromTo("[data-hero-step='sub']", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo("[data-hero-step='cta'] > *", {
          y: 14,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
        }, "-=0.4")
        .fromTo("[data-hero-step='stat']", {
          y: 14,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
        }, "-=0.3")
        .fromTo("[data-hero-ui]", {
          opacity: 0,
          scale: 0.96,
          y: 30,
        }, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
        }, "-=0.8")
        .fromTo("[data-hero-ui='tile']", {
          opacity: 0,
          y: 20,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
        }, "-=0.6")
        .fromTo("[data-hero-ai]", {
          opacity: 0,
          y: 18,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
        }, "-=0.4");
    }, root.current);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="scroll-anchor relative isolate overflow-hidden bg-background pt-28 sm:pt-32"
    >
      {/* Background aurora + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-blob bg-brand/40" style={{ width: 520, height: 520, top: -120, left: -80 }} />
        <div className="aurora-blob bg-growth/30" style={{ width: 460, height: 460, top: 40, right: -120 }} />
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
        <div className="hero-stripes absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="container-px mx-auto grid max-w-7xl items-start gap-10 pb-20 lg:grid-cols-12 lg:gap-8 lg:pb-28">
        {/* Left: copy + CTA */}
        <div className="lg:col-span-6 lg:pt-8">
          <div data-hero-step="eyebrow" className="flex items-center gap-2">
            <Chip tone="brand">
              <LiveDot tone="brand" /> Healthcare Growth + Operating Platform
            </Chip>
          </div>

          <h1
            data-hero-step="h1"
            className="display-1 mt-5 text-balance"
          >
            <span className="block overflow-hidden">
              <span className="block">More Patients.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block">Smarter Operations.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block">
                <span className="headline-sweep bg-gradient-to-r from-brand via-brand to-growth bg-clip-text text-transparent">
                  One Intelligent Platform.
                </span>
              </span>
            </span>
          </h1>

          <p data-hero-step="sub" className="mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            {BRAND.supporting}
          </p>

          <div data-hero-step="cta" className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              onClick={() => { track("hero_demo_click", { source: "hero" }); open(); }}
              className="sheen group"
            >
              Book a Private Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => track("platform_explore_click", { source: "hero" })}
              className="group"
              asChild
            >
              <a href="#platform">
                <PlayCircle className="h-4 w-4" />
                See Doctorooms in Action
              </a>
            </Button>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.suffix} data-hero-step="stat" className="rounded-xl border border-border/60 bg-card/60 p-3 backdrop-blur">
                <dt className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tracking-tight">{s.value}</span>
                  <span className="text-xs text-muted-foreground">{s.suffix}</span>
                </dt>
                <dd className="mt-1 text-[11px] leading-tight text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: progressive UI assembly */}
        <div className="lg:col-span-6">
          <div ref={uiStage} data-hero-ui className="relative">
            {/* Floating patient booking card */}
            <motion.div
              data-hero-ui="tile"
              className="absolute -left-2 top-8 z-20 hidden md:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <div className="rotate-[-3deg]">
                <PatientCard name="Rahul Verma" reason="Follow-up · sinusitis" doctor="Dr. Anjali Mehta" slot="Today · 4:40 PM" mode="in-person" />
              </div>
            </motion.div>

            {/* Floating AI assistant bubble */}
            <motion.div
              data-hero-ai
              className="absolute -right-2 top-4 z-20 hidden md:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <div className="rotate-[2deg]">
                <AIBubble />
              </div>
            </motion.div>

            {/* Main product frame */}
            <ProductFrame title="Doctorooms · Hospital overview" className="z-10">
              <div className="flex">
                <AppRail items={HERO_RAIL} active={0} />
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Hospital overview</div>
                      <div className="text-[11px] text-muted-foreground">Live · 24 Oct, 4:38 PM</div>
                    </div>
                    <Chip tone="growth"><LiveDot tone="growth" /> All systems normal</Chip>
                  </div>

                  {/* KPI row */}
                  <div data-hero-ui="tile" className="mt-4 grid grid-cols-3 gap-2">
                    <Kpi label="OPD today" value="86" delta="+12" tone="brand" />
                    <Kpi label="IPD beds" value="42/60" delta="70%" tone="growth" />
                    <Kpi label="Queue" value="11" delta="waiting" tone="brand" />
                  </div>

                  {/* Queue + chart */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-5">
                    <div data-hero-ui="tile" className="sm:col-span-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                      <ColHeader hint="next 4">Live queue</ColHeader>
                      <ul className="grid gap-1.5">
                        {[
                          { n: "A-013", p: "Priya Nair", d: "ENT" },
                          { n: "A-014", p: "Rahul Verma", d: "ENT" },
                          { n: "A-015", p: "Imran S.", d: "Cardio" },
                          { n: "A-016", p: "Kavya R.", d: "Derm" },
                        ].map((r, i) => (
                          <li key={r.n} className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5 text-xs">
                            <span className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-emerald-500" : "bg-brand/50"}`} />
                              <span className="font-medium">{r.n}</span>
                              <span className="text-muted-foreground">{r.p}</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground">{r.d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div data-hero-ui="tile" className="sm:col-span-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                      <ColHeader hint="7 days">Consultations</ColHeader>
                      <Sparkbars />
                    </div>
                  </div>

                  {/* Bottom strip */}
                  <div data-hero-ui="tile" className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <Chip tone="brand"><Stethoscope className="h-3 w-3" /> OPD</Chip>
                    <Chip tone="brand"><BedDouble className="h-3 w-3" /> IPD</Chip>
                    <Chip tone="neutral"><Pill className="h-3 w-3" /> Pharmacy</Chip>
                    <Chip tone="neutral"><Receipt className="h-3 w-3" /> Billing</Chip>
                    <Chip tone="neutral"><HeartPulse className="h-3 w-3" /> Vitals</Chip>
                    <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3 w-3" /> Role-based access
                    </span>
                  </div>
                </div>
              </div>
            </ProductFrame>

            {/* Floating token under frame */}
            <motion.div
              data-hero-ui="tile"
              className="absolute -bottom-6 left-1/2 z-20 hidden -translate-x-1/2 md:block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
            >
              <div className="rotate-[-1.5deg]">
                <QueueMini />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee of modules */}
      <div className="relative border-y border-border/60 bg-muted/30 py-4">
        <div className="marquee-track gap-10 px-6">
          {[...HERO_RAIL, ...HERO_RAIL, ...HERO_RAIL].map((r, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              {r.icon}
              <span className="font-medium text-foreground/80">{r.label}</span>
              <span className="text-border">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "brand" | "growth";
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-xl font-semibold">{value}</span>
        <span className={`text-[10px] font-medium ${tone === "growth" ? "text-emerald-600 dark:text-emerald-400" : "text-brand"}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function Sparkbars() {
  const bars = [42, 56, 38, 64, 72, 58, 81, 48, 66, 74, 52, 68, 60, 78];
  return (
    <div className="flex h-24 items-end gap-1.5">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-md bg-gradient-to-t from-brand/40 to-brand"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function AIBubble() {
  return (
    <div className="glass-card w-[260px] rounded-2xl p-3.5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-semibold">Doctorooms AI</span>
        <Chip tone="brand" className="ml-auto text-[10px]">Admin</Chip>
      </div>
      <div className="mt-2.5 text-xs leading-relaxed text-foreground/90">
        Today&apos;s revenue across OPD + IPD + Pharmacy + Lab is{" "}
        <span className="font-semibold text-brand">₹2,84,500</span>.
        IPD accounts for 41%.
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="caret inline-block h-3 w-1.5 rounded-full bg-brand/60" />
        <span className="text-[10px] text-muted-foreground">Role-aware · audited</span>
      </div>
    </div>
  );
}

function QueueMini() {
  return (
    <div className="glass-card w-[220px] rounded-2xl p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Token</span>
        <LiveDot tone="growth" />
      </div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">A-014</div>
      <div className="mt-1 text-[11px] text-muted-foreground">Rahul Verma · ENT</div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand to-growth" />
      </div>
    </div>
  );
}
