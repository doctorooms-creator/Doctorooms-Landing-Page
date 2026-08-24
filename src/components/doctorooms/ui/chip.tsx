"use client";

import { cn } from "@/lib/utils";

/** Small chip used to label status, role, or stage. */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "growth" | "warn" | "ink";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-muted text-muted-foreground border-border/60",
    brand:
      "bg-brand-soft text-brand border-brand/20",
    growth:
      "bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25",
    warn:
      "bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25",
    ink: "bg-white/10 text-white border-white/15",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** A live dot — used on queue tokens, online indicators, vitals. */
export function LiveDot({ tone = "growth" }: { tone?: "growth" | "brand" | "warn" }) {
  const colors: Record<string, string> = {
    growth: "bg-emerald-500",
    brand: "bg-brand",
    warn: "bg-amber-500",
  };
  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className={cn(
          "absolute inline-flex h-full w-full rounded-full opacity-60",
          colors[tone]
        )}
        style={{ animation: "pulse-ring 2.2s ease-out infinite" }}
      />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", colors[tone])} />
    </span>
  );
}
