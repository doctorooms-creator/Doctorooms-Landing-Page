"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { GlossaryOverlay } from "./glossary-overlay";
import { track } from "@/lib/analytics";

/**
 * GlossaryContext — shared glossary-overlay state so any chapter can
 * open the glossary pre-filtered to a specific term via the inline
 * <GlossaryTerm> component.
 *
 * Previously the glossary was only reachable via the `G` keyboard
 * shortcut (power-user-only). Inline <GlossaryTerm> chips next to the
 * first use of OPD / IPD / EMR etc. make the glossary discoverable
 * for general visitors.
 *
 * Architecture:
 *  • The provider holds `open` + `seedTerm` state.
 *  • When `openFor(term)` is called, we set `seedTerm` THEN `open=true`.
 *    GlossaryOverlay receives both as props. Its internal GlossaryBody
 *    uses the `seedTerm` as the initial value of its search input via
 *    the useState initializer — which only runs once per mount.
 *    Because GlossaryBody conditionally mounts when `open` transitions
 *    false→true, the seed is captured fresh on each open.
 *
 * Note on the `G` keyboard shortcut: it calls `openFor(null)` so the
 * glossary opens with an empty search (showing all 20 terms). The
 * existing `BackToTop` `G` handler continues to call `setGlossaryOpen(true)`
 * directly via its local state — but to preserve seed-from-inline
 * behavior, BackToTop now calls `openFor(null)` via this context too.
 */

type GlossaryState = {
  open: boolean;
  openFor: (term: string | null) => void;
  close: () => void;
  seedTerm: string | null;
};

const Ctx = createContext<GlossaryState | null>(null);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seedTerm, setSeedTerm] = useState<string | null>(null);

  const openFor = useCallback((term: string | null) => {
    setSeedTerm(term);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openFor, close, seedTerm }),
    [open, openFor, close, seedTerm]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <GlossaryOverlay
        open={open}
        onOpenChange={setOpen}
        seedTerm={seedTerm}
      />
    </Ctx.Provider>
  );
}

export function useGlossary() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useGlossary must be used inside a <GlossaryProvider>");
  }
  return ctx;
}

/**
 * GlossaryTerm — inline button that opens the glossary pre-filtered to
 * the given term. Renders as a dotted-underlined chip so it reads as
 * "look up this term" without breaking paragraph flow.
 *
 * Usage: <GlossaryTerm term="OPD">OPD</GlossaryTerm> inside paragraph
 * copy. Tracks `glossary_inline_open { term }`.
 *
 * Reduced-motion safe (CSS only).
 */
export function GlossaryTerm({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  const { openFor } = useGlossary();
  return (
    <button
      type="button"
      onClick={() => {
        track("glossary_inline_open", { term });
        openFor(term);
      }}
      className="glossary-term inline-flex items-baseline rounded px-0.5 align-baseline font-medium text-brand underline decoration-dotted decoration-brand/40 underline-offset-2 transition-colors hover:bg-brand-soft/40 hover:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label={`Open glossary entry for ${term}`}
    >
      {children}
    </button>
  );
}
