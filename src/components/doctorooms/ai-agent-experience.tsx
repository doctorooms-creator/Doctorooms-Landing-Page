"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReveal, useScrollTriggerHygiene } from "@/lib/anim/hooks";
import {
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "@/lib/anim/gsap-register";
import { track } from "@/lib/analytics";
import { AI_ROLES } from "@/data/doctorooms";
import { Chip, LiveDot } from "./ui/chip";
import { ProductFrame } from "./ui/product-frame";
import { AI_ROLE_ICONS, Icon } from "./ui/icons";
import {
  Check,
  Lock,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type RoleKey = (typeof AI_ROLES)[number]["role"];

const TRUST = [
  { icon: ShieldCheck, label: "Role-based access" },
  { icon: Lock, label: "Tenant isolation" },
  { icon: ScrollText, label: "Audited actions" },
];

export function AIAgentExperience() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [role, setRole] = useState<RoleKey>("Doctor");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();

  const current = AI_ROLES.find((r) => r.role === role) ?? AI_ROLES[1];
  const RoleIcon = AI_ROLE_ICONS[current.role];

  function changeRole(r: RoleKey) {
    if (r === role) return;
    track("ai_demo_interaction", { role: r });
    setRole(r);
    setExampleIdx(0);
    setConfirmed(false);
  }

  function selectExample(i: number) {
    if (i === exampleIdx) return;
    setExampleIdx(i);
    setConfirmed(false);
  }

  function onConfirm() {
    setConfirmed(true);
    track("ai_demo_interaction", { role, action: "confirm_action" });
  }

  function onCancel() {
    setConfirmed(false);
  }

  return (
    <section
      ref={root}
      id="ai"
      aria-labelledby="ai-heading"
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-brand/30"
          style={{ width: 480, height: 480, top: -80, left: "30%" }}
        />
        <div
          className="aurora-blob bg-growth/20"
          style={{ width: 360, height: 360, bottom: -100, right: -80 }}
        />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow text-brand" data-anim>
            Chapter 05 — AI Experience
          </div>
          <h2 id="ai-heading" className="display-2 mt-4 text-balance" data-anim>
            Don&apos;t Learn Another Software.{" "}
            <span className="bg-gradient-to-r from-brand to-growth bg-clip-text text-transparent">
              Talk to Your Hospital.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
            data-anim
          >
            Natural language → intent → role-aware data access → answer and/or
            action → confirmation where appropriate. Role-aware and constrained
            by authorization.
          </p>
        </div>

        {/* Role switcher */}
        <div className="mt-10 flex justify-center" data-anim>
          <div
            role="tablist"
            aria-label="AI role"
            className="inline-flex gap-1 rounded-full border border-border bg-muted/40 p-1"
          >
            {AI_ROLES.map((r) => {
              const active = r.role === role;
              const RIcon = AI_ROLE_ICONS[r.role];
              return (
                <button
                  key={r.role}
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeRole(r.role)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all sm:px-4",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon name={RIcon} className="h-3.5 w-3.5" />
                  <span>{r.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI console (dark ProductFrame) */}
        <div className="mt-8" data-anim>
          <ProductFrame
            variant="ink"
            title={`Doctorooms · AI console · ${role}`}
            toolbar={
              <span className="inline-flex items-center gap-1.5 text-[10px] text-ink-muted">
                <LiveDot tone="growth" /> live · role-scoped
              </span>
            }
          >
            <div className="grid lg:grid-cols-12">
              {/* Left: example prompts */}
              <div className="border-b border-white/10 p-4 sm:p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Try an example
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-ink-muted">
                    <Icon name={RoleIcon} className="h-3 w-3 text-brand" />
                    {current.role}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 grid gap-2"
                  >
                    {current.examples.map((ex, i) => {
                      const active = i === exampleIdx;
                      return (
                        <button
                          key={i}
                          onClick={() => selectExample(i)}
                          aria-pressed={active}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-left text-xs transition-colors",
                            active
                              ? "border-brand/40 bg-brand/15 text-ink-foreground"
                              : "border-white/10 text-ink-muted hover:bg-white/5 hover:text-ink-foreground"
                          )}
                        >
                          {ex}
                        </button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-[10px] leading-relaxed text-ink-muted">
                  Each prompt is parsed for intent, scoped to your role, and
                  audited before any answer or action is returned.
                </div>
              </div>

              {/* Right: exchange */}
              <div className="p-4 sm:p-5 lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${role}-${exampleIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-brand/25 bg-brand/15 px-3.5 py-2.5 text-sm text-ink-foreground">
                        {current.examples[exampleIdx]}
                      </div>
                    </div>

                    {/* AI response with typewriter */}
                    <AIResponseBody
                      response={current.response}
                      actionLabel={current.action.label}
                      reduced={reduced}
                      confirmed={confirmed}
                      onConfirm={onConfirm}
                      onCancel={onCancel}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </ProductFrame>
        </div>

        {/* Trust strip */}
        <div
          data-anim
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {TRUST.map((t) => (
            <Chip key={t.label} tone="neutral" className="text-[11px]">
              <t.icon className="h-3 w-3" />
              {t.label}
            </Chip>
          ))}
          <span className="text-[10px] text-muted-foreground">
            No certifications claimed on this page
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * AIResponseBody — mounts fresh on role/example change (parent keys it).
 * Typewriter uses direct DOM manipulation via ref to avoid setState-in-effect.
 */
function AIResponseBody({
  response,
  actionLabel,
  reduced,
  confirmed,
  onConfirm,
  onCancel,
}: {
  response: string;
  actionLabel: string;
  reduced: boolean;
  confirmed: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const responseRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = responseRef.current;
    if (!el) return;

    if (reduced) {
      el.textContent = response;
      el.classList.remove("caret");
      return;
    }

    let i = 0;
    el.textContent = "";
    el.classList.add("caret");
    const id = window.setInterval(() => {
      i += 1;
      el.textContent = response.slice(0, i);
      if (i >= response.length) {
        window.clearInterval(id);
        el.classList.remove("caret");
      }
    }, 22);
    return () => window.clearInterval(id);
  }, [response, reduced]);

  return (
    <div className="mt-4 flex gap-3">
      {/* Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-ink-muted">
          Doctorooms AI
          <span className="ml-1.5 normal-case tracking-normal text-ink-muted/60">
            · intent parsed · scope checked
          </span>
        </div>

        <p
          ref={responseRef}
          className="mt-1.5 text-sm leading-relaxed text-ink-foreground/90"
        >
          {response}
        </p>

        {/* Action chip + confirm/cancel */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-growth/40 bg-growth/15 px-2.5 py-1 text-[11px] font-medium text-growth-foreground">
            <Sparkles className="h-3 w-3 text-growth" />
            {actionLabel}
          </span>
          <span className="text-[10px] text-ink-muted">
            requires confirmation · not silent
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              onClick={onCancel}
              className="h-8 px-2.5 text-xs text-ink-muted hover:bg-white/5 hover:text-ink-foreground"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onConfirm}
              className="h-8 px-2.5 text-xs bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Check className="h-3.5 w-3.5" />
              Confirm
            </Button>
          </div>
        </div>

        {/* Inline confirmation toast */}
        <AnimatePresence>
          {confirmed && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-300"
            >
              <Check className="h-3 w-3" />
              Action confirmed · audited
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
