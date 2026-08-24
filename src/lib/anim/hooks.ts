"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useReducedMotion, useIsomorphicLayoutEffect } from "./gsap-register";

type RevealOptions = {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
  ease?: string | gsap.EaseFunction;
};

/**
 * Reveals all [data-anim] children of the container when it enters the viewport.
 * Reduced-motion: sets everything visible immediately.
 */
export function useReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts: RevealOptions = {}
) {
  const reduced = useReducedMotion();
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-anim]");
    if (targets.length === 0) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform,opacity" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: opts.y ?? 24 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.9,
        ease: opts.ease ?? "power3.out",
        stagger: opts.stagger ?? 0.08,
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? "top 78%",
          once: opts.once ?? true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, opts.y, opts.opacity, opts.duration, opts.stagger, opts.start, opts.once, opts.ease, ref]);
}

/**
 * Scrubs a single element's transform/opacity across its scroll range.
 * Used for signature morph interactions.
 */
export function useScrubTransform<T extends HTMLElement>(
  ref: RefObject<T | null>,
  apply: (self: ScrollTrigger) => void,
  deps: unknown[] = []
) {
  const reduced = useReducedMotion();
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        onUpdate: (self) => apply(self),
      });
      return () => st.kill();
    }, el);
    return () => ctx.revert();
  }, [reduced, ref, ...deps]);
}

/**
 * Pins a container inside a trigger for a scroll-driven sequence.
 * Returns nothing — cleanup is handled by the gsap.context revert.
 */
export function usePinnedSequence<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (ctx: { tl: gsap.core.Timeline; container: HTMLElement }) => void,
  options: { start?: string; end?: string; pinSpacing?: "margin" | "push" | "auto" } = {},
  deps: unknown[] = []
) {
  const reduced = useReducedMotion();
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: options.start ?? "top top",
          end: options.end ?? "+=200%",
          pin: true,
          scrub: true,
          pinSpacing: options.pinSpacing ?? "margin",
          invalidateOnRefresh: true,
        },
      });
      setup({ tl, container: el });
    }, el);
    return () => ctx.revert();
  }, [reduced, ref, ...deps]);
}

/**
 * Recompute all ScrollTrigger positions. Call after dynamic content
 * loads or after layout shifts (e.g. font load, image load).
 */
export function refreshScrollTrigger() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

/**
 * Re-run on mount + on resize to keep ScrollTrigger sane.
 */
export function useScrollTriggerHygiene() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    // refresh once after fonts/layout settle
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, []);
}
