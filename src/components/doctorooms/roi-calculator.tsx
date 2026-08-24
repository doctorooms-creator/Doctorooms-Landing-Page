"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { useReveal } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { ROI_DRIVERS, ROI_DISCLAIMER } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { ArrowRight, Info, TrendingUp, Users, Video } from "lucide-react";

type InputKey = "patients" | "revenue" | "efficiency" | "ai";

type Inputs = Record<InputKey, number>;

const DEFAULTS: Inputs = {
  patients: 1200,
  revenue: 900,
  efficiency: 18,
  ai: 12,
};

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ROICalculator() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { stagger: 0.08, y: 18 });
  const reduced = useReducedMotion();
  const { open } = useDemoDialog();

  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const startedRef = useRef(false);

  const { annualPatientRevenue, efficiencyValue, aiValue, estimatedAnnualValue } =
    useMemo(() => {
      const apr = inputs.patients * inputs.revenue * 12;
      const ev = apr * (inputs.efficiency / 100);
      const av = apr * (inputs.ai / 100);
      return {
        annualPatientRevenue: apr,
        efficiencyValue: ev,
        aiValue: av,
        estimatedAnnualValue: ev + av,
      };
    }, [inputs]);

  // Count-up animation for the headline number.
  // We drive the displayed value via a framer-motion MotionValue + a derived
  // string transform — this avoids calling React setState inside the effect
  // (which would trigger cascading renders) while still animating smoothly.
  const motionValue = useMotionValue(0);
  const formattedValue = useTransform(
    motionValue,
    (v) => inr.format(Math.round(v))
  );
  useEffect(() => {
    if (reduced) {
      motionValue.set(estimatedAnnualValue);
      return;
    }
    const controls = animate(motionValue, estimatedAnnualValue, {
      duration: 0.7,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [estimatedAnnualValue, reduced, motionValue]);

  function onSliderChange(key: InputKey, value: number[]) {
    if (!startedRef.current) {
      startedRef.current = true;
      track("roi_calculator_start", { input: key });
    }
    setInputs((prev) => ({ ...prev, [key]: value[0] }));
  }

  function onSeeInDemo() {
    track("roi_calculator_complete", {
      value: Math.round(estimatedAnnualValue),
    });
    open();
  }

  return (
    <section
      ref={ref}
      id="roi"
      aria-labelledby="roi-title"
      className="scroll-anchor relative isolate overflow-hidden bg-background py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand-soft"
          style={{ width: 460, height: 460, top: -80, left: -120, opacity: 0.5 }}
        />
        <div
          className="aurora-blob bg-growth/20"
          style={{ width: 380, height: 380, bottom: -120, right: -100 }}
        />
        <div className="absolute inset-0 bg-grid opacity-25" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 13 — ROI
          </div>
          <h2 id="roi-title" className="display-2 mt-4 text-balance" data-anim>
            Your Healthcare Software Should Create{" "}
            <span className="text-brand">Business Value.</span>
          </h2>
          <p
            className="mt-5 text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Adjust the inputs to estimate the illustrative annual value of
            connecting patient acquisition, operations and AI.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* LEFT — Inputs */}
          <div
            data-anim
            className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4 text-brand" aria-hidden="true" />
              Your practice — illustrative inputs
            </div>
            <div className="mt-6 space-y-7">
              <SliderInput
                id="patients"
                label="Patients per month"
                value={inputs.patients}
                min={200}
                max={5000}
                step={50}
                display={inputs.patients.toLocaleString("en-IN")}
                onChange={(v) => onSliderChange("patients", v)}
              />
              <SliderInput
                id="revenue"
                label="Average revenue per patient"
                value={inputs.revenue}
                min={400}
                max={4000}
                step={50}
                display={inr.format(inputs.revenue)}
                onChange={(v) => onSliderChange("revenue", v)}
              />
              <SliderInput
                id="efficiency"
                label="Operational efficiency gain"
                value={inputs.efficiency}
                min={5}
                max={40}
                step={1}
                display={`${inputs.efficiency}%`}
                onChange={(v) => onSliderChange("efficiency", v)}
              />
              <SliderInput
                id="ai"
                label="AI productivity gain"
                value={inputs.ai}
                min={3}
                max={30}
                step={1}
                display={`${inputs.ai}%`}
                onChange={(v) => onSliderChange("ai", v)}
              />
            </div>
          </div>

          {/* RIGHT — Output panel */}
          <div
            data-anim
            className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-soft to-card p-6 shadow-sm sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />
            <div className="flex items-center gap-2 text-sm font-medium text-brand">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Illustrative estimated annual value
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground">
                Efficiency + AI productivity value
              </div>
              <motion.div
                className="mt-1 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
                aria-live="polite"
              >
                {formattedValue}
              </motion.div>
              <div className="mt-2 text-xs text-muted-foreground">
                based on {inr.format(annualPatientRevenue)} annual patient
                revenue
              </div>
            </div>

            {/* Breakdown */}
            <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border/60 bg-card p-3">
                <dt className="text-muted-foreground">From efficiency</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {inr.format(Math.round(efficiencyValue))}
                </dd>
              </div>
              <div className="rounded-lg border border-border/60 bg-card p-3">
                <dt className="text-muted-foreground">From AI productivity</dt>
                <dd className="mt-1 text-sm font-semibold text-foreground">
                  {inr.format(Math.round(aiValue))}
                </dd>
              </div>
            </dl>

            {/* Patient opportunity — qualitative */}
            <div className="mt-5 flex items-start gap-2 rounded-lg border border-brand/20 bg-brand/5 p-3 text-xs">
              <Video
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"
                aria-hidden="true"
              />
              <p className="leading-relaxed text-foreground/80">
                <span className="font-medium">Patient opportunity:&nbsp;</span>
                More consults from discovery and video consultation — your reach
                extends beyond your physical location.
              </p>
            </div>

            {/* Value drivers */}
            <div className="mt-6">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Value drivers
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {ROI_DRIVERS.map((d) => (
                  <span
                    key={d.key}
                    title={d.desc}
                    className="inline-flex items-center rounded-full border border-border/70 bg-card px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Button
                size="lg"
                onClick={onSeeInDemo}
                className="group w-full sm:w-auto"
              >
                See this value in my demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="mt-5 flex items-start gap-2 text-[11px] text-muted-foreground">
              <Info
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <p className="leading-relaxed">{ROI_DISCLAIMER}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderInput({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number[]) => void;
}) {
  return (
    <div className="grid gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-medium text-foreground/90">
          {label}
        </Label>
        <output
          className="rounded-md bg-muted px-2.5 py-1 text-sm font-semibold tabular-nums text-foreground"
          aria-live="polite"
        >
          {display}
        </output>
      </div>
      <Slider
        id={id}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
        aria-label={label}
        className="[&_[data-slot=slider-thumb]]:size-5"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min.toLocaleString("en-IN")}</span>
        <span>{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
