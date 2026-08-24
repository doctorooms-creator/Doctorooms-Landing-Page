"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/anim/gsap-register";

/**
 * ScrollProgress — a thin gradient bar pinned to the very top of the
 * viewport that fills with the document scroll progress. Sits above
 * the SiteHeader (z-index 60) so it reads as a global progress signal.
 *
 * Premium, restrained, brand-aligned. Respects reduced motion (no
 * smooth interpolation — jumps to value).
 */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const p = Math.min(1, Math.max(0, doc.scrollTop / max));
      setPct(p);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-brand via-brand to-growth shadow-[0_0_12px_rgba(0,0,0,0.18)]"
        style={{
          transform: `scaleX(${pct})`,
          transition: reduced ? "none" : "transform 90ms linear",
        }}
      />
    </div>
  );
}
