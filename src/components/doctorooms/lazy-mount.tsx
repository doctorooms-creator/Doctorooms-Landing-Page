"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * LazyMount — IntersectionObserver-gated mount for heavy GSAP chapters.
 *
 * The wrapper renders a placeholder (with reserved height via
 * `placeholderMinHeight`) until the element is within `rootMargin` of
 * the viewport, then mounts the actual children. This:
 *
 *  • Defers ScrollTrigger setup / measurement until needed
 *  • Defers chunk evaluation (paired with `next/dynamic`, the chunk
 *    download itself is gated too)
 *  • Keeps initial render path light
 *
 * SSR safety: on the server `IntersectionObserver` doesn't exist, so
 * we render the placeholder. The mount is deferred via a microtask
 * (`queueMicrotask`) when IO is missing, to avoid a synchronous
 * setState-in-effect (which would trigger the cascading-render lint
 * rule). Functionality is preserved — the placeholder shows for one
 * tick at most, then the children mount.
 *
 * Reduced-motion: not relevant — this is a deferral wrapper, not a
 * visual animation. The mounted child may itself respect
 * reduced-motion.
 */
export function LazyMount({
  children,
  placeholder,
  placeholderMinHeight = 600,
  rootMargin = "600px 0px",
  ariaLabel,
}: {
  children: ReactNode;
  placeholder: ReactNode;
  placeholderMinHeight?: number;
  rootMargin?: string;
  ariaLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mounted) return;
    if (typeof IntersectionObserver === "undefined") {
      // Defer the fallback mount so it's not a synchronous setState-in-effect.
      const cancel = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(cancel);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setMounted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) return <>{children}</>;

  return (
    <div
      ref={ref}
      style={{ minHeight: placeholderMinHeight }}
      aria-busy="true"
      aria-label={ariaLabel}
    >
      {placeholder}
    </div>
  );
}
