"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoDialog } from "./demo-dialog";
import { track } from "@/lib/analytics";
import { KEYBOARD_SHORTCUTS } from "@/data/doctorooms";

/**
 * BackToTop — floating action cluster + global keyboard shortcuts.
 *
 * Visible affordances (bottom-right, appear after 1 viewport of scroll):
 *   • "?"  — open this keyboard-shortcuts help dialog
 *   • "B"  — open the Book-a-Demo dialog
 *   • ↑    — scroll back to the top
 *
 * Global keyboard shortcuts (ignored while typing / with modifiers):
 *   B  → open Book-a-Demo
 *   T  → scroll to top
 *   ?  → open this shortcuts help dialog
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
  const { open } = useDemoDialog();

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs / editable regions / with modifiers.
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const editable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable;
      if (editable || e.metaKey || e.ctrlKey || e.altKey) return;

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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openHelp = () => {
    track("keyboard_shortcuts_open", { source: "floating_button" });
    setHelpOpen(true);
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
        <DialogContent className="sm:max-w-md">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
