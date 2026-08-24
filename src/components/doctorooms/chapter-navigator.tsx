"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Chapter = { id: string; label: string; n: string };

const CHAPTERS: Chapter[] = [
  { id: "top", label: "The Promise", n: "01" },
  { id: "platform", label: "The Problem", n: "02" },
  { id: "comparison", label: "The Delta", n: "02½" },
  { id: "acquisition", label: "Acquisition", n: "03" },
  { id: "doctor", label: "Doctor Growth", n: "04" },
  { id: "ai", label: "AI Experience", n: "05" },
  { id: "video", label: "Video Consult", n: "06" },
  { id: "queue", label: "Smart Queue", n: "07" },
  { id: "journey", label: "Patient Journey", n: "08" },
  { id: "operations", label: "Operations", n: "09" },
  { id: "ipd", label: "IPD Story", n: "10" },
  { id: "roles", label: "Roles", n: "11" },
  { id: "security", label: "Trust", n: "12" },
  { id: "roi", label: "ROI", n: "13" },
  { id: "rollout", label: "Rollout", n: "13½" },
  { id: "demo", label: "Book a Demo", n: "14" },
];

/**
 * ChapterNavigator — a vertical chapter index pinned to the right
 * edge on desktop (lg+). Each dot reflects a chapter; the active
 * chapter is highlighted. Click to jump. Hidden on tablet/mobile to
 * avoid clutter.
 *
 * Premium experiential sites use this to make a long scroll
 * navigable without pulling users out of the story.
 */
export function ChapterNavigator() {
  const [active, setActive] = useState("top");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    // Observe each chapter section; pick the one most in view.
    const sections = CHAPTERS
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry closest to the top of the viewport center.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) {
          setActive((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64; // offset for sticky header
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Chapters"
      className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-2.5">
        {CHAPTERS.map((c) => {
          const isActive = c.id === active;
          const isHover = c.id === hovered;
          return (
            <li key={c.id} className="relative flex items-center justify-end">
              {/* Non-interactive label tooltip — sits left of the dot */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-6 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium transition-all duration-200",
                  isHover || isActive
                    ? "translate-x-0 bg-brand/10 text-brand opacity-100"
                    : "translate-x-2 opacity-0"
                )}
              >
                <span className="mr-1 text-[10px] text-brand/70">{c.n}</span>
                {c.label}
              </span>
              {/* Only the dot captures clicks — keeps the nav from covering content */}
              <button
                type="button"
                onClick={() => jump(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(c.id)}
                onBlur={() => setHovered(null)}
                aria-label={`Go to chapter ${c.n}: ${c.label}`}
                aria-current={isActive ? "true" : undefined}
                className="group pointer-events-auto flex h-5 w-5 items-center justify-center"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    isActive
                      ? "w-5 bg-gradient-to-r from-brand to-growth"
                      : isHover
                        ? "w-3.5 bg-brand/60"
                        : "w-1.5 bg-foreground/25 group-hover:bg-foreground/40"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
