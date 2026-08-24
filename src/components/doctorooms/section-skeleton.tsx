"use client";

/**
 * SectionSkeleton — reserved-height placeholder shown while a heavy
 * chapter's JS chunk downloads + mounts (paired with LazyMount).
 *
 * Mimics the visual rhythm of a real chapter so the document height
 * stays stable (no layout shift / CLS contribution) and the user sees
 * intentional structure rather than a blank gap.
 *
 * Reduced-motion safe (Tailwind `animate-pulse` is allowed under
 * reduced-motion guidelines for loading affordances; the skeleton
 * has no other motion).
 */
export function SectionSkeleton({
  eyebrow = "Loading chapter",
  titleWidth = "w-80",
  bodyWidth = "w-96",
  cards = 3,
  tone = "brand",
}: {
  eyebrow?: string;
  titleWidth?: string;
  bodyWidth?: string;
  cards?: number;
  tone?: "brand" | "growth" | "ink";
}) {
  const dotTone =
    tone === "growth"
      ? "bg-growth"
      : tone === "ink"
        ? "bg-foreground/60"
        : "bg-brand";
  return (
    <div
      className="relative isolate overflow-hidden bg-background py-24 sm:py-32"
      aria-busy="true"
      aria-label={`${eyebrow} — loading`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div
          className={`aurora-blob ${tone === "growth" ? "bg-growth/15" : tone === "ink" ? "bg-foreground/5" : "bg-brand/15"}`}
          style={{ width: 420, height: 420, top: -120, right: -120 }}
        />
      </div>
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotTone}`} />
          <div className="h-3 w-32 animate-pulse rounded bg-muted/60" />
        </div>
        <div className={`mt-4 h-9 ${titleWidth} max-w-full animate-pulse rounded bg-muted/60`} />
        <div className={`mt-3 h-4 ${bodyWidth} max-w-full animate-pulse rounded bg-muted/40`} />
        <div className={`mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-muted/30`} />
      </div>
      <div className="container-px mx-auto mt-12 max-w-7xl">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cards}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-border/40 bg-muted/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
