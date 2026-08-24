"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoDialog } from "./demo-dialog";
import { track } from "@/lib/analytics";

/**
 * BackToTop — a floating action button that appears after the user
 * scrolls past one viewport. Also exposes a keyboard hint: pressing
 * `B` opens the Book-a-Demo dialog (the hint chip reveals on hover).
 *
 * Kept restrained: a single circular button bottom-right, above the
 * footer, with a subtle backdrop blur. Respects reduced motion via
 * CSS (no spring, simple fade).
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const [hint, setHint] = useState(false);
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
      if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        track("hero_demo_click", { source: "keyboard_shortcut" });
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur transition-opacity duration-200",
          hint ? "opacity-100" : "opacity-0"
        )}
      >
        <Keyboard className="h-3 w-3" />
        Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground">B</kbd> to book a demo
      </div>
      <div className="flex items-center gap-2">
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
  );
}
