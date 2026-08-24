"use client";

import { useEffect, useRef, useState } from "react";
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
  Mic,
  MicOff,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Square,
} from "lucide-react";

type RoleKey = (typeof AI_ROLES)[number]["role"];

const TRUST = [
  { icon: ShieldCheck, label: "Role-based access" },
  { icon: Lock, label: "Tenant isolation" },
  { icon: ScrollText, label: "Audited actions" },
];

type HistoryItem = { role: RoleKey; exampleIdx: number; text: string };
type MicState = "idle" | "recording" | "transcribing";

export function AIAgentExperience() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [role, setRole] = useState<RoleKey>("Doctor");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [micState, setMicState] = useState<MicState>("idle");
  const [transcript, setTranscript] = useState("");

  useReveal(root, { stagger: 0.1, duration: 0.85 });
  useScrollTriggerHygiene();

  const current = AI_ROLES.find((r) => r.role === role) ?? AI_ROLES[1];
  const RoleIcon = AI_ROLE_ICONS[current.role];

  function pushHistory(r: RoleKey, idx: number, text: string) {
    setHistory((prev) => {
      // Dedupe consecutive identical.
      const last = prev[0];
      if (last && last.role === r && last.exampleIdx === idx) return prev;
      return [{ role: r, exampleIdx: idx, text }, ...prev].slice(0, 3);
    });
  }

  function changeRole(r: RoleKey) {
    if (r === role) return;
    track("ai_demo_interaction", { role: r });
    setRole(r);
    setExampleIdx(0);
    setConfirmed(false);
    setMicState("idle");
    setTranscript("");
  }

  function selectExample(i: number, viaVoice = false) {
    if (i === exampleIdx && !viaVoice) return;
    setExampleIdx(i);
    setConfirmed(false);
    pushHistory(role, i, current.examples[i]);
    if (viaVoice) {
      track("ai_demo_interaction", { role, via: "voice" });
    }
  }

  function onConfirm() {
    setConfirmed(true);
    track("ai_demo_interaction", { role, action: "confirm_action" });
  }

  function onCancel() {
    setConfirmed(false);
  }

  function replayHistory(h: HistoryItem) {
    if (h.role !== role) changeRole(h.role);
    selectExample(h.exampleIdx);
  }

  // ── Voice input mock ───────────────────────────────────────────
  // Click mic → recording (waveform) → transcribing → fills the
  // transcript with the role's next example and "sends" it.
  function toggleMic() {
    if (micState === "idle") {
      setMicState("recording");
      track("ai_demo_interaction", { role, action: "voice_start" });
    } else if (micState === "recording") {
      finishRecording();
    }
    // transcribing is a transient state — ignore taps during it.
  }

  function finishRecording() {
    setMicState("transcribing");
    // Pick the next example for the current role (cycle), excluding the
    // currently-selected one when possible so the exchange visibly changes.
    const total = current.examples.length;
    let next = (exampleIdx + 1) % total;
    const transcriptText = current.examples[next];

    const fillDelay = reduced ? 350 : 850;
    const t = window.setTimeout(() => {
      setTranscript(transcriptText);
      setMicState("idle");
      // Brief beat so the user sees the filled transcript, then send.
      const t2 = window.setTimeout(() => {
        selectExample(next, true);
        setTranscript("");
      }, reduced ? 250 : 550);
      micTimeouts.current.push(t2);
    }, fillDelay);
    micTimeouts.current.push(t);
  }

  // Auto-stop recording after 4s if user doesn't stop manually.
  useEffect(() => {
    if (micState !== "recording") return;
    const t = window.setTimeout(() => finishRecording(), 4000);
    return () => window.clearTimeout(t);
  }, [micState]);

  // Track timers for cleanup on unmount / role switch.
  const micTimeouts = useRef<number[]>([]);
  useEffect(() => () => {
    micTimeouts.current.forEach((t) => window.clearTimeout(t));
    micTimeouts.current = [];
  }, []);

  return (
    <section
      ref={root}
      id="ai"
      aria-labelledby="ai-heading"
      className="scroll-anchor relative isolate overflow-hidden py-24 sm:py-32"
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
            by authorization. Type a prompt or just talk.
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
              {/* Left: example prompts + command history */}
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

                {/* Command history */}
                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Recent
                  </div>
                  <div className="mt-2 grid gap-1.5">
                    <AnimatePresence initial={false}>
                      {history.length === 0 && (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] text-ink-muted/60"
                        >
                          Your sent prompts appear here.
                        </motion.div>
                      )}
                      {history.map((h, i) => (
                        <motion.button
                          key={`${h.role}-${h.exampleIdx}-${i}`}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => replayHistory(h)}
                          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-left text-[11px] text-ink-muted transition-colors hover:border-brand/30 hover:bg-brand/10 hover:text-ink-foreground"
                          aria-label={`Replay: ${h.text}`}
                        >
                          <span className="shrink-0 rounded bg-white/10 px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-muted group-hover:bg-brand/20">
                            {h.role === "IPD / Nurse" ? "IPD" : h.role.slice(0, 4)}
                          </span>
                          <span className="truncate">{h.text}</span>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right: exchange + voice input bar */}
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

                {/* Voice input bar */}
                <VoiceInputBar
                  micState={micState}
                  transcript={transcript}
                  reduced={reduced}
                  onToggleMic={toggleMic}
                  placeholder={`Ask anything in ${current.role}'s scope, or tap the mic…`}
                />
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

/**
 * VoiceInputBar — faux input field + mic button. Click mic →
 * recording (animated waveform + "Listening…") → transcribing →
 * fills transcript, parent sends it. Reduced motion skips the
 * waveform animation.
 */
function VoiceInputBar({
  micState,
  transcript,
  reduced,
  onToggleMic,
  placeholder,
}: {
  micState: MicState;
  transcript: string;
  reduced: boolean;
  onToggleMic: () => void;
  placeholder: string;
}) {
  const recording = micState === "recording";
  const transcribing = micState === "transcribing";

  const status = recording
    ? "Listening… tap to stop"
    : transcribing
      ? "Transcribing…"
      : null;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex items-center gap-2.5">
        {/* Faux input / transcript display */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-white/10 bg-ink/40 px-3 py-2.5 text-sm">
          {recording ? (
            <>
              <Waveform active={!reduced} />
              <span className="text-[11px] text-growth-foreground/90">{status}</span>
            </>
          ) : transcribing ? (
            <>
              <span className="inline-flex h-4 w-4 items-center justify-center">
                <motion.span
                  className="block h-3 w-3 rounded-full border-2 border-brand/30 border-t-brand"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              </span>
              <span className="text-[11px] text-ink-muted">{status}</span>
            </>
          ) : transcript ? (
            <span className="truncate text-ink-foreground">
              <span className="text-brand">you said: </span>
              {transcript}
            </span>
          ) : (
            <span className="truncate text-ink-muted/70">{placeholder}</span>
          )}
        </div>

        {/* Mic / stop button */}
        <button
          type="button"
          onClick={onToggleMic}
          aria-label={
            recording ? "Stop recording" : transcribing ? "Transcribing" : "Start voice input"
          }
          disabled={transcribing}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all",
            recording
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
              : transcribing
                ? "bg-white/5 text-ink-muted"
                : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-lg shadow-brand/30"
          )}
        >
          {recording ? (
            <Square className="h-4 w-4 fill-current" />
          ) : transcribing ? (
            <MicOff className="h-4 w-4 opacity-50" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      </div>
      <div className="mt-1.5 px-1 text-[10px] text-ink-muted/60">
        Voice input is illustrative. Doctorooms AI is role-scoped — it only
        acts on what your role is authorized to access.
      </div>
    </div>
  );
}

/** Waveform — 5 animated bars; reduced-motion renders static bars. */
function Waveform({ active }: { active: boolean }) {
  const bars = [0.5, 0.9, 0.6, 1, 0.4];
  return (
    <span className="flex h-5 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="block w-[3px] rounded-full bg-growth"
          animate={
            active
              ? { height: [`${h * 40}%`, `${h * 100}%`, `${h * 40}%`] }
              : { height: `${h * 60}%` }
          }
          transition={
            active
              ? {
                  duration: 0.8 + i * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "mirror",
                }
              : { duration: 0 }
          }
          style={{ height: `${h * 60}%` }}
        />
      ))}
    </span>
  );
}
