"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import { useReducedMotion } from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { OUTCOMES, OUTCOME_KPIS } from "@/data/doctorooms";
import { useDemoDialog } from "./demo-dialog";
import { OutcomeCompareDialog } from "./outcome-compare-dialog";
import { GlossaryTerm } from "./glossary-context";
import { ArrowRight, ArrowLeftRight, ChevronLeft, ChevronRight, Copy, CheckCheck, Quote, Share2, Sparkles } from "lucide-react";

/**
 * OutcomesSection — Chapter 12¼ "Outcomes" (sits between Trust and FAQ).
 *
 * Five narrative outcome cards, one per organization archetype Doctorooms
 * serves (hospital admin, clinic owner, growth lead, IPD lead, lab
 * director). Each card is a single quoted paragraph written in the voice
 * of the decision-maker — qualitative, not invented stats.
 *
 * Layout:
 *  • Top eyebrow + display-2 + intro paragraph
 *  • 3-column compact theme row ("Less re-keying / follow-up leakage /
 *    cross-team friction") — directional statements, no metrics.
 *  • Featured quote carousel (one large quote at a time, prev/next
 *    chevrons + arrow-key keyboard nav). Each quote shows: archetype,
 *    role, the paragraph, and a 5-dot pagination indicator.
 *  • Below the carousel: a compact grid of the other 4 outcome cards
 *    (excluding the currently featured one) — gives visitors a
 *    scannable summary without clicking through.
 *  • CTA: "Book a private demo" + "Walk the patient journey" (deep-link
 *    to the patient-journey chapter) + "Compare two outcomes" (opens
 *    the side-by-side comparison modal).
 *
 * Reduced-motion safe (CSS-revealed, framer-motion not used here).
 * Analytics: tracks `testimonial_quote_cycle` on prev/next + arrow-key nav,
 * `outcome_deep_link` on `#outcome=<key>` hash navigation, `outcome_modal_share`
 * on copy-deep-link, `outcome_journey_jump` on the journey CTA click,
 * and `outcome_compare_open` when the side-by-side comparison modal opens.
 *
 * Deep-link: `#outcome=<key>` (e.g. `#outcome=clinic-owner`) opens the
 * outcomes section pre-seeded to that featured quote. Mirrors the
 * comparison-section's `#compare=` pattern. Useful for the sales team
 * to share a specific testimonial in a meeting.
 *
 * Inline glossary: clinical terms (OPD / IPD / e-Rx / Queue) inside each
 * quote are wrapped in <GlossaryTerm> chips so non-clinical readers can
 * tap to look up the term without leaving the testimonial's voice.
 */

/**
 * renderQuote — wraps clinical acronyms/terms in a quote string with
 * inline <GlossaryTerm> chips. The wrapper scans the raw string for
 * known terms (case-sensitive to avoid false positives like "open"
 * matching "OPD") and splits the string into text + chip fragments.
 *
 * The terms list mirrors the glossary-overlay's GLOSSARY entries. Only
 * terms that appear in at least one outcome quote are included so we
 * don't pay the cost of unused patterns.
 */
const OUTCOME_QUOTE_TERMS = [
  "OPD",
  "IPD",
  "EMR",
  "e-Rx",
  "Queue",
  "Vitals",
  "Pharmacy",
  "Lab",
  "Billing",
] as const;

function escapeRegex(s: string): string {
  // Standard escape for regex metacharacters — safe for arbitrary input.
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderQuote(quote: string) {
  // Sort by length DESC so multi-word terms (e.g. "front desk") match
  // before single tokens ("front" or "desk" alone would not match).
  const terms = [...OUTCOME_QUOTE_TERMS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map(escapeRegex).join("|")})`, "g");
  const parts = quote.split(pattern);
  return parts.map((part, i) => {
    // Even indices are plain text; odd indices are matches (because the
    // capturing group's split semantics).
    if (i % 2 === 1) {
      return (
        <GlossaryTerm key={`${part}-${i}`} term={part}>
          {part}
        </GlossaryTerm>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function OutcomesSection() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useReveal(root, { stagger: 0.08, duration: 0.8 });
  useScrollTriggerHygiene();
  const { open } = useDemoDialog();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  // Outcome-compare modal — opens the side-by-side decision-maker
  // comparison view. Managed locally because only this section triggers
  // it. Mirrors the demo-dialog pattern but without a context provider
  // since no other section needs to open it.
  const [compareOpen, setCompareOpen] = useState(false);

  const go = useCallback((delta: number) => {
    const n = OUTCOMES.length;
    setActive((cur) => {
      const next = (cur + delta + n) % n;
      track("testimonial_quote_cycle", {
        from: OUTCOMES[cur].key,
        to: OUTCOMES[next].key,
      });
      return next;
    });
  }, []);

  const setActiveTracked = useCallback((idx: number) => {
    setActive((cur) => {
      if (cur === idx) return cur;
      track("testimonial_quote_cycle", {
        from: OUTCOMES[cur].key,
        to: OUTCOMES[idx].key,
      });
      return idx;
    });
  }, []);

  // Deep-link via `#outcome=<key>`. URL-encoded to handle dashes safely.
  // Cleans the hash after triggering so subsequent Esc + re-open doesn't loop.
  // Mirrors the comparison-section's `#compare=` pattern.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#outcome=")) return;
      const raw = hash.slice("#outcome=".length);
      const decoded = (() => {
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      })();
      const idx = OUTCOMES.findIndex((o) => o.key === decoded);
      if (idx < 0) return;
      track("outcome_deep_link", { key: OUTCOMES[idx].key });
      setActive(idx);
      // Smooth-scroll to the outcomes chapter so the user lands on the
      // featured quote (rather than wherever they happened to be).
      const el = document.querySelector("#outcomes");
      if (el) {
        const top =
          (el as HTMLElement).getBoundingClientRect().top +
          window.scrollY -
          64;
        window.scrollTo({ top, behavior: "smooth" });
      }
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch {
        // ignore
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  async function copyDeepLink() {
    const featuredOutcome = OUTCOMES[active];
    if (!featuredOutcome) return;
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}#outcome=${encodeURIComponent(featuredOutcome.key)}`
        : "";
    track("outcome_modal_share", { key: featuredOutcome.key });
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else if (document.execCommand) {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — clipboard failure is non-fatal
    }
  }

  function jumpToJourney() {
    track("outcome_journey_jump", { from: OUTCOMES[active].key });
    const el = document.querySelector("#journey");
    if (!el) return;
    const top = (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }

  // Keyboard ←/→ navigation for the carousel (ignored when typing in inputs).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const editable =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable;
      if (editable) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      // Only intercept when the carousel is in view (so we don't hijack the
      // global keyboard shortcuts elsewhere on the page).
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const featured = OUTCOMES[active];
  const others = OUTCOMES.filter((_, i) => i !== active);

  return (
    <section
      ref={root}
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="scroll-anchor relative isolate overflow-hidden bg-gradient-to-b from-background via-brand-soft/15 to-background py-24 sm:py-32"
    >
      {/* Ambient backdrop — soft brand/growth wash, lighter than the dark
          cinematic chapters so this section feels like a breather. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/15"
          style={{ width: 480, height: 480, top: -100, right: -80 }}
        />
        <div
          className="aurora-blob bg-growth/12"
          style={{ width: 360, height: 360, bottom: -120, left: -60 }}
        />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-2 h-px w-24 ribbon-stripe" aria-hidden />
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 12¼ — Outcomes
          </div>
          <h2 id="outcomes-heading" className="display-2 mt-4 text-balance" data-anim>
            What changes for the people{" "}
            <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
              running the hospital.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Five decision-makers — the administrator, the clinic owner, the
            head of growth, the IPD lead, and the lab director — describe
            what shifts when discovery, queue, OPD/IPD, lab, pharmacy, and
            billing stop being separate tools.
          </p>
        </div>

        {/* Theme row — 3 directional statements */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3" data-anim>
          {OUTCOME_KPIS.map((k) => (
            <div
              key={k.title}
              className={cn(
                "rounded-2xl border p-4 text-center backdrop-blur-sm",
                k.accent === "growth"
                  ? "border-growth/30 bg-growth/[0.06]"
                  : "border-brand/30 bg-brand/[0.06]"
              )}
            >
              <div
                className={cn(
                  "text-sm font-semibold",
                  k.accent === "growth" ? "text-growth" : "text-brand"
                )}
              >
                {k.title}
              </div>
              <div className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                {k.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Featured quote carousel */}
        <div
          data-anim
          className="card-aurora mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur"
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto]">
            {/* Quote body */}
            <div className="relative p-6 sm:p-10">
              <Quote
                className="absolute right-4 top-4 h-10 w-10 text-brand/15"
                aria-hidden
              />
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                <span className="live-indicator-dot" aria-hidden />
                <Sparkles className="h-3.5 w-3.5" />
                {featured.archetype}
              </div>
              <blockquote
                key={featured.key}
                className={cn(
                  "mt-4 text-pretty text-lg leading-relaxed text-foreground sm:text-xl",
                  reduced
                    ? "opacity-100"
                    : "animate-[outcomes-quote-fade_0.5s_ease-out]"
                )}
              >
                &ldquo;{renderQuote(featured.quote)}&rdquo;
              </blockquote>
              {/* Quote-arc — a thin brand→growth underline beneath the
                  featured quote. Adds a premium editorial flourish. */}
              <div className="quote-arc mt-3" aria-hidden />
              <div className="mt-5 text-sm font-medium text-foreground">
                {featured.role}
              </div>

              {/* Action row: pagination dots + share deep-link button */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Outcome selector">
                  {OUTCOMES.map((o, i) => (
                    <button
                      key={o.key}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      onClick={() => setActiveTracked(i)}
                      aria-label={`Show outcome from ${o.archetype}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === active
                          ? "w-7 bg-brand"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      )}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={copyDeepLink}
                  className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 text-[11px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/20 hover:text-brand focus-visible:border-brand/40 focus-visible:bg-brand-soft/20 focus-visible:text-brand"
                  aria-label={`Copy deep-link to this ${featured.archetype} outcome`}
                  title="Copy a shareable link to this specific outcome"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-growth" />
                      <span className="text-growth">Link copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Side rail: prev/next + counter */}
            <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/20 px-6 py-4 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:px-3 sm:py-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous outcome"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand focus-visible:border-brand/40 focus-visible:bg-brand-soft/40 focus-visible:text-brand"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Outcome
                </div>
                <div className="text-sm font-semibold tabular-nums text-foreground">
                  <span className="tabular-nums">{active + 1}</span>
                  <span className="mx-1 text-muted-foreground/60">/</span>
                  <span className="tabular-nums">{OUTCOMES.length}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next outcome"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/40 hover:text-brand focus-visible:border-brand/40 focus-visible:bg-brand-soft/40 focus-visible:text-brand"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Vertical hairline rail — separates the featured carousel
            from the "other outcomes" grid below. Brand→growth fade. */}
        <div className="mx-auto my-6 hidden h-12 w-px max-w-4xl sm:block" aria-hidden>
          <div className="divider-gradient-vertical h-full w-px" />
        </div>

        {/* Compact grid of the OTHER outcome cards (not the featured one) */}
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((o, i) => {
            const idx = OUTCOMES.findIndex((x) => x.key === o.key);
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setActiveTracked(idx)}
                onMouseMove={(e) => {
                  const t = e.currentTarget;
                  const r = t.getBoundingClientRect();
                  t.style.setProperty("--x", `${e.clientX - r.left}px`);
                  t.style.setProperty("--y", `${e.clientY - r.top}px`);
                }}
                aria-label={`Show outcome from ${o.archetype}`}
                className={cn(
                  "spotlight-glow group rounded-2xl border p-4 text-left transition-colors hover:border-brand/40 focus-visible:border-brand/40 focus-ring-tab",
                  i % 2 === 0
                    ? "border-border/70 bg-card/60 hover:bg-brand-soft/20"
                    : "border-border/70 bg-card/60 hover:bg-growth/5",
                  reduced ? "" : "lift-on-hover"
                )}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {o.archetype}
                </div>
                <div className="mt-1 text-xs font-medium text-foreground">
                  {o.role}
                </div>
                <div className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">
                  &ldquo;{o.quote}&rdquo;
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  Read in full
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA row */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row" data-anim>
          <button
            type="button"
            onClick={() => {
              track("hero_demo_click", { source: "outcomes_section" });
              open();
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-lg transition-all hover:bg-brand/90 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Book a private demo
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={jumpToJourney}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/20"
          >
            Walk the patient journey
          </button>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-brand/40 bg-brand-soft/40 px-6 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand-soft/60 hover:shadow-sm"
            aria-label="Open the side-by-side outcome comparison modal"
            title="Put two decision-maker quotes next to each other"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Compare two outcomes
          </button>
          <button
            type="button"
            onClick={copyDeepLink}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-background px-6 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand-soft/20"
            aria-label="Copy deep-link to the currently featured outcome"
          >
            {copied ? <CheckCheck className="h-4 w-4 text-growth" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Link copied" : "Share this outcome"}
          </button>
          <span className="text-[11px] text-muted-foreground">
            30-minute private walkthrough · tailored to your organization
          </span>
        </div>
      </div>

      {/* Outcome-compare modal — opens the side-by-side decision-maker
          comparison view. Lives at the section root so the dialog mounts
          once and can be opened/closed without losing internal state. */}
      <OutcomeCompareDialog open={compareOpen} onOpenChange={setCompareOpen} />
    </section>
  );
}
