"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSyncExternalStore, useEffect, useRef } from "react";

// Register once on the client.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Respect reduced motion globally for GSAP-driven timelines.
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.globalTimeline.timeScale(0);
  });
  gsap.config({ nullTargetWarn: false });
}

export { gsap, ScrollTrigger };

/**
 * Subscribe to prefers-reduced-motion. Returns true when the user
 * wants reduced motion so callers can short-circuit heavy animation.
 */
function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}
function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * useIsomorphicLayoutEffect — runs useLayoutEffect on the client,
 * useEffect on the server. Used by GSAP setup so timelines are built
 * after the DOM is painted.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useEffect : (cb: () => void) => {};

/**
 * useGsapRef — returns a ref you can attach to a container, plus a
 * helper to scope a GSAP context so cleanup is automatic.
 */
export function useGsapRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  return ref;
}
