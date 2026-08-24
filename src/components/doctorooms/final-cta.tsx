"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { useDemoDialog } from "./demo-dialog";
import { ArrowRight, CalendarCheck, Clock, MessageCircle, ShieldCheck } from "lucide-react";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.12, y: 28 });
  const { open } = useDemoDialog();

  return (
    <section
      ref={ref}
      id="demo"
      aria-labelledby="demo-title"
      className="scroll-anchor ink-section relative isolate flex min-h-[88vh] items-center justify-center overflow-hidden py-28 sm:py-36"
    >
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-ink opacity-40" />
        <div
          className="aurora-blob bg-brand/45"
          style={{
            width: 760,
            height: 760,
            top: -220,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.55,
          }}
        />
        <div
          className="aurora-blob bg-growth/30"
          style={{ width: 520, height: 520, bottom: -180, left: "18%" }}
        />
        <div
          className="aurora-blob bg-brand-deep/40"
          style={{ width: 460, height: 460, bottom: -160, right: "10%" }}
        />
        <div className="absolute inset-0 vignette" />
      </div>

      <div className="container-px mx-auto max-w-4xl text-center">
        <div className="eyebrow text-brand" data-anim>
          Chapter 14 — Final Conversion
        </div>

        <h1
          id="demo-title"
          className="display-1 mt-5 text-balance"
          data-anim
        >
          Your Patients Are{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-brand via-brand to-growth bg-clip-text text-transparent">
              Already Looking.
            </span>
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="absolute -bottom-1.5 left-0 right-0 h-1 origin-left rounded-full bg-gradient-to-r from-brand to-growth"
            />
          </span>
        </h1>

        <p
          className="mt-6 max-w-2xl text-pretty text-ink-muted sm:text-lg"
          data-anim
        >
          Give them a better way to find you, book you and stay connected —
          while giving your team the intelligence to run the practice better.
        </p>

        <div
          data-anim
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            onClick={() => {
              track("hero_demo_click", { source: "final_cta" });
              open();
            }}
            className="group h-12 px-7 text-base"
          >
            <CalendarCheck className="h-4 w-4" />
            Book a Private Demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              track("pricing_or_contact_intent", { source: "final_cta" })
            }
            className="h-12 border-white/20 bg-white/5 px-7 text-base text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
            asChild
          >
            <a href="mailto:hello@doctorooms.com">
              <MessageCircle className="h-4 w-4" />
              Talk to us
            </a>
          </Button>
        </div>

        <p
          data-anim
          className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-ink-muted"
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            30-minute private walkthrough
          </span>
          <span aria-hidden="true" className="text-ink-muted/50">
            ·
          </span>
          <span>tailored to your organization</span>
          <span aria-hidden="true" className="text-ink-muted/50">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            no commitment
          </span>
        </p>
      </div>
    </section>
  );
}
