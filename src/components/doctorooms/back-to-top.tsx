"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, BookOpen, Keyboard, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoDialog } from "./demo-dialog";
import { useGlossary } from "./glossary-context";
import { track } from "@/lib/analytics";
import { KEYBOARD_SHORTCUTS } from "@/data/doctorooms";
import { AdminOverlay } from "./admin-overlay";

/**
 * BackToTop — floating action cluster + global keyboard shortcuts + admin overlay.
 *
 * Visible affordances (bottom-right, appear after 1 viewport of scroll):
 *   • "?"  — open this keyboard-shortcuts help dialog
 *   • "B"  — open the Book-a-Demo dialog
 *   • ↑    — scroll back to the top
 *
 * Global keyboard shortcuts (ignored while typing / with modifiers):
 *   B           → open Book-a-Demo
 *   T           → scroll to top
 *   ?           → open this shortcuts help dialog
 *   G           → open the healthcare glossary
 *   Shift + A   → open the in-page team admin panel (demo-request triage)
 *   Esc is handled natively by Radix dialogs.
 *
 * Reduced-motion safe (CSS handles transitions). Mobile-friendly: the
 * cluster stays compact; the mobile sticky CTA bar (separate component)
 * lives bottom-center and doesn't overlap.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [hint, setHint] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { open } = useDemoDialog();
  const { openFor: openGlossaryFor } = useGlossary();

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openAdmin = useCallback(() => {
    track("admin_panel_open", { source: "keyboard_shortcut" });
    setAdminOpen(true);
  }, []);

  const openGlossary = useCallback(() => {
    track("glossary_open", { source: "keyboard_shortcut" });
    // openFor(null) → empty search seed (shows all 20 terms).
    openGlossaryFor(null);
  }, [openGlossaryFor]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs / editable regions / with plain modifiers.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable;
      if (editable) return;

      // Shift + A → admin panel (allowed even when not typing)
      if (e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openAdmin();
        return;
      }

      // Other shortcuts ignore modifier keys
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        track("hero_demo_click", { source: "keyboard_shortcut" });
        open();
      } else if (key === "t") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "?") {
        e.preventDefault();
        track("keyboard_shortcuts_open", { source: "keyboard_shortcut" });
        setHelpOpen(true);
      } else if (key === "g") {
        e.preventDefault();
        openGlossary();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openAdmin, openGlossary]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHelp = () => {
    track("keyboard_shortcuts_open", { source: "floating_button" });
    setHelpOpen(true);
  };

  const openAdminFromHelp = () => {
    track("admin_panel_open", { source: "shortcuts_dialog" });
    setHelpOpen(false);
    setAdminOpen(true);
  };

  const openGlossaryFromHelp = () => {
    track("glossary_open", { source: "shortcuts_dialog" });
    setHelpOpen(false);
    openGlossaryFor(null);
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 transition-all duration-300",
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        )}
      >
        {/* Hint chip — reveals on hover of the B button */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur transition-opacity duration-200",
            hint ? "opacity-100" : "opacity-0"
          )}
        >
          <Keyboard className="h-3 w-3" />
          Press <kbd>B</kbd> demo · <kbd>?</kbd> shortcuts · <kbd>T</kbd> top
        </div>

        <div className="flex items-center gap-2">
          {/* Shortcuts help "?" button */}
          <Button
            onClick={openHelp}
            size="icon"
            variant="outline"
            aria-label="Keyboard shortcuts"
            className="h-11 w-11 rounded-full bg-background/80 font-mono text-base font-semibold backdrop-blur"
          >
            <span aria-hidden className="leading-none">?</span>
          </Button>

          {/* Book-a-demo "B" button */}
          <Button
            onMouseEnter={() => setHint(true)}
            onMouseLeave={() => setHint(false)}
            onClick={() => {
              track("pricing_or_contact_intent", { source: "back-to-top" });
              open();
            }}
            size="icon"
            variant="default"
            aria-label="Book a private demo"
            className="h-11 w-11 rounded-full shadow-lg"
          >
            <span className="sr-only">Book a private demo</span>
            <span aria-hidden className="text-base font-semibold leading-none">B</span>
          </Button>

          {/* Back-to-top button */}
          <Button
            onClick={toTop}
            size="icon"
            variant="outline"
            aria-label="Back to top"
            className="h-11 w-11 rounded-full bg-background/80 backdrop-blur"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Keyboard shortcuts help dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Keyboard className="h-4 w-4" />
              </span>
              Keyboard shortcuts
            </DialogTitle>
            <DialogDescription>
              Move through Doctorooms faster. Shortcuts are ignored while
              you&apos;re typing in a field.
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-2 grid gap-1.5">
            {KEYBOARD_SHORTCUTS.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{s.label}</div>
                  <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {s.keys.map((k) => (
                    <kbd key={k} className="min-w-[1.75rem] text-center">{k}</kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Tip: the right-edge chapter dots (desktop) also jump between
              sections.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHelpOpen(false)}
              className="h-8 px-3 text-xs"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </Button>
          </div>

          {/* Cross-links to glossary + admin */}
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={openGlossaryFromHelp}
              className="group flex items-center gap-2 rounded-lg border border-growth/20 bg-growth/5 px-3 py-2.5 text-left transition-colors hover:bg-growth/10"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-growth" />
              <div className="min-w-0 flex-1 text-[11px] text-muted-foreground">
                <div className="font-medium text-foreground">Open glossary</div>
                <div>OPD, IPD, EMR, RBAC…</div>
              </div>
              <kbd className="self-center text-[10px]">G</kbd>
            </button>
            <button
              type="button"
              onClick={openAdminFromHelp}
              className="group flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-soft/30 px-3 py-2.5 text-left transition-colors hover:bg-brand-soft/50"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
              <div className="min-w-0 flex-1 text-[11px] text-muted-foreground">
                <div className="font-medium text-foreground">Team admin</div>
                <div>Triage inbound demo requests</div>
              </div>
              <kbd className="self-center text-[10px]">
                <span className="opacity-60">⇧</span>A
              </kbd>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* In-page team admin panel */}
      <AdminOverlay open={adminOpen} onOpenChange={setAdminOpen} />
      {/* Healthcare glossary overlay — rendered by GlossaryProvider */}
    </>
  );
}
