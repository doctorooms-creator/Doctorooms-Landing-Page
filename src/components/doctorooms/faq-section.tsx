"use client";

import { useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { track } from "@/lib/analytics";
import { FAQ_ITEMS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { ArrowRight, HelpCircle } from "lucide-react";

/**
 * FAQSection — Chapter 12½ "Questions you might be asking".
 * Sits between Trust (Ch12) and ROI (Ch13) to surface buyer objections
 * *before* the ROI calculator and final CTA. Every answer is truthful —
 * no invented timelines, no certification claims, consistent with the
 * Trust section's disclaimer.
 *
 * Layout: sticky left intro + CTA, right accordion. Tracks which item
 * a visitor opens so a future CRM/SEGMENT integration can capture intent.
 */
export function FAQSection() {
  const root = useRef<HTMLDivElement>(null);
  const [openItem, setOpenItem] = useState<string>("");
  const { open } = useDemoDialog();
  useReveal(root, { stagger: 0.1, duration: 0.8 });
  useScrollTriggerHygiene();

  function onValueChange(value: string) {
    if (value && value !== openItem) {
      track("faq_expand", { item: value });
    }
    setOpenItem(value);
  }

  return (
    <section
      ref={root}
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 420, height: 420, top: -40, left: "10%" }}
        />
        <div
          className="aurora-blob bg-growth/12"
          style={{ width: 360, height: 360, bottom: -60, right: "5%" }}
        />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: sticky intro + CTA */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow text-brand" data-anim>
                Chapter 12½ — Questions
              </div>
              <h2
                id="faq-heading"
                className="display-2 mt-4 text-balance"
                data-anim
              >
                Questions you might be{" "}
                <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
                  already asking.
                </span>
              </h2>
              <p
                className="mt-5 max-w-md text-pretty text-muted-foreground sm:text-lg"
                data-anim
              >
                Straight answers about data isolation, rollout scope, the AI,
                and what happens to your existing systems. If something here
                isn&apos;t covered, ask us in a private walkthrough.
              </p>

              <div
                className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-card p-4"
                data-anim
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <HelpCircle className="h-4 w-4" />
                </span>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  These answers reflect how Doctorooms is built today. We
                  don&apos;t claim certifications, invented timelines, or
                  guarantees on this page.
                </p>
              </div>

              <div
                className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
                data-anim
              >
                <Button
                  onClick={() => {
                    track("hero_demo_click", { source: "faq" });
                    open();
                  }}
                >
                  Ask my question in a demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <a href="#security">See security controls</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-7" data-anim>
            <div className="rounded-2xl border border-border bg-card/60 p-2 sm:p-4">
              <Accordion
                type="single"
                collapsible
                value={openItem}
                onValueChange={onValueChange}
                className="w-full"
              >
                {FAQ_ITEMS.map((item, idx) => (
                  <AccordionItem
                    key={item.key}
                    value={item.key}
                    className="rounded-xl px-3 transition-colors data-[state=open]:bg-brand-soft/40 sm:px-4"
                  >
                    <AccordionTrigger className="items-center text-left text-sm font-semibold text-foreground sm:text-base">
                      <span className="flex items-baseline gap-3">
                        <span className="text-[11px] font-mono font-medium text-brand">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-pretty">{item.q}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:pl-8">
                      <span className="block pl-0 sm:pl-0">{item.a}</span>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <p className="mt-4 px-1 text-[11px] text-muted-foreground/80">
              Still wondering about something specific to your hospital, clinic,
              chain or lab? We answer it in a 30-minute walkthrough.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
