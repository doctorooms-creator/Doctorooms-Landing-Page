"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/anim/gsap-register";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROBLEM_SYSTEMS, BRAND } from "@/data/doctorooms";
import { Chip } from "./ui/chip";

const FRAGMENT_ITEMS = PROBLEM_SYSTEMS.map((label, i) => ({
  label,
  // pseudo-random but deterministic positions
  x: Math.sin(i * 1.7) * 0.42,
  y: Math.cos(i * 1.3) * 0.42,
  r: (i * 53) % 360,
  tone: ["brand", "growth", "warn", "neutral"][i % 4] as "brand" | "growth" | "warn" | "neutral",
}));

export function ProblemConvergence() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduced) {
      gsap.set(el.querySelectorAll("[data-frag]"), { opacity: 1, x: 0, y: 0, rotate: 0 });
      gsap.set(el.querySelector("[data-converged]"), { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      // Initial scattered state
      gsap.set("[data-frag]", {
        x: (i: number) => FRAGMENT_ITEMS[i].x * 180,
        y: (i: number) => FRAGMENT_ITEMS[i].y * 120,
        rotate: (i: number) => FRAGMENT_ITEMS[i].r - 180,
        opacity: 0.0,
      });
      gsap.set("[data-converged]", { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: "bottom 55%",
          scrub: 0.8,
        },
      });

      // Fade fragments in scattered
      tl.to("[data-frag]", { opacity: 0.85, duration: 0.4, stagger: 0.05 });
      // Converge them to center
      tl.to("[data-frag]", {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.9,
        stagger: 0.03,
        ease: "power2.inOut",
      });
      // Fade out fragments, reveal converged platform
      tl.to("[data-frag]", { opacity: 0, scale: 0.6, duration: 0.25, stagger: 0.02 }, "-=0.2");
      tl.to("[data-converged]", { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, "-=0.25");

      // Headline reveal
      gsap.fromTo(
        el.querySelector("[data-problem-h]"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="platform"
      className="scroll-anchor ink-section relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-ink opacity-40" />
      <div className="aurora-blob bg-brand/30" style={{ width: 480, height: 480, top: 80, left: "30%" }} />

      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand">Chapter 02 — The Problem</div>
          <h2 data-problem-h className="display-2 mt-4 text-balance">
            Your hospital shouldn&apos;t need{" "}
            <span className="text-brand">10 different systems</span>{" "}
            to run one patient journey.
          </h2>
          <p className="mt-5 text-pretty text-ink-muted sm:text-lg">
            Appointment, queue, EMR, billing, lab, pharmacy, inventory, IPD, communications, reports —
            disconnected tools leak time, money and trust. Doctorooms converges them into one operating layer.
          </p>
        </div>

        {/* Stage */}
        <div className="relative mx-auto mt-16 h-[360px] max-w-4xl sm:h-[420px]">
          {/* Scattered fragments */}
          <div className="absolute inset-0">
            {FRAGMENT_ITEMS.map((it, i) => (
              <div
                key={it.label}
                data-frag
                className="absolute left-1/2 top-1/2"
                style={{ marginLeft: -90, marginTop: -34 }}
              >
                <div
                  className="glass-card flex h-[68px] w-[180px] items-center justify-between rounded-xl px-3 text-sm font-medium text-ink-foreground"
                  style={{ backdropFilter: "blur(8px)" }}
                >
                  <span>{it.label}</span>
                  <Chip tone="ink" className="text-[10px]">
                    disconnected
                  </Chip>
                </div>
              </div>
            ))}
          </div>

          {/* Converged platform */}
          <div
            data-converged
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md shadow-2xl w-[min(560px,90%)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v6a6 6 0 0012 0V3M6 21h12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Doctorooms
                </span>
                <Chip tone="growth" className="text-[10px]">
                  one platform
                </Chip>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {PROBLEM_SYSTEMS.map((s) => (
                  <div
                    key={s}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center text-[10px] font-medium text-ink-foreground/90"
                  >
                    {s}
                  </div>
                ))}
                <div className="rounded-lg border border-brand/30 bg-brand/10 px-2 py-2.5 text-center text-[10px] font-semibold text-brand">
                  + AI
                </div>
              </div>
              <div className="mt-5 hairline" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }} />
              <p className="mt-4 text-center text-xs text-ink-muted">
                {BRAND.coreMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
