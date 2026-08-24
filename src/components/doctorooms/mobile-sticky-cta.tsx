"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDemoDialog } from "./demo-dialog";
import { track } from "@/lib/analytics";
import { CalendarCheck } from "lucide-react";

/**
 * MobileStickyCTA — a slim fixed bottom bar on mobile/tablet only
 * (hidden lg+ so it never clashes with the chapter navigator or the
 * floating BackToTop cluster). Appears after the user scrolls past the
 * hero, so the first viewport stays cinematic and uncluttered.
 *
 * Shows the active chapter name on the left (orientation signal while
 * scrolling a long page) and a compact "Book a Demo" CTA on the right.
 * Respects the iOS safe area via env(safe-area-inset-bottom) padding.
 */
const CHAPTER_LABELS: { id: string; label: string }[] = [
  { id: "top", label: "The Promise" },
  { id: "platform", label: "The Problem" },
  { id: "comparison", label: "The Delta" },
  { id: "acquisition", label: "Acquisition" },
  { id: "doctor", label: "Doctor Growth" },
  { id: "ai", label: "AI Experience" },
  { id: "video", label: "Video Consult" },
  { id: "queue", label: "Smart Queue" },
  { id: "journey", label: "Patient Journey" },
  { id: "operations", label: "Operations" },
  { id: "org-fit", label: "Fit" },
  { id: "ipd", label: "IPD Story" },
  { id: "roles", label: "Roles" },
  { id: "security", label: "Trust" },
  { id: "faq", label: "Questions" },
  { id: "roi", label: "ROI" },
  { id: "demo", label: "Book a Demo" },
];

export function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  const [activeChapter, setActiveChapter] = useState("top");
  const { open } = useDemoDialog();

  useEffect(() => {
    const onScroll = () => {
      // Show after the user passes the first viewport.
      setShow(window.scrollY > window.innerHeight * 0.85);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = CHAPTER_LABELS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
        if (visible[0]) {
          setActiveChapter((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const current =
    CHAPTER_LABELS.find((c) => c.id === activeChapter) ?? CHAPTER_LABELS[0];

  return (
    <div
      role="region"
      aria-label="Quick actions"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "border-t border-border/60 bg-background/90 backdrop-blur-md",
        "transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Now reading
          </div>
          <div className="truncate text-xs font-semibold text-foreground">
            {current.label}
          </div>
        </div>
        <Button
          onClick={() => {
            track("hero_demo_click", { source: "mobile_sticky_cta" });
            open();
          }}
          size="sm"
          className="h-9 shrink-0 px-3.5 text-xs shadow-sm"
        >
          <CalendarCheck className="h-3.5 w-3.5" />
          Book a Demo
        </Button>
      </div>
    </div>
  );
}
