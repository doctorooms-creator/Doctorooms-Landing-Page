"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * ProductFrame — the "Doctorooms app window" chrome used to wrap
 * realistic product UI mockups. Looks like a real browser/app shell
 * without copying any specific brand identity.
 */
export function ProductFrame({
  title = "Doctorooms",
  variant = "light",
  className,
  children,
  toolbar,
}: {
  title?: string;
  variant?: "light" | "ink";
  className?: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}) {
  const dark = variant === "ink";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-2xl",
        dark
          ? "border-white/10 bg-ink text-ink-foreground"
          : "border-border/70 bg-card text-card-foreground",
        className
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-4 py-2.5",
          dark ? "border-white/10 bg-white/[0.03]" : "border-border/60 bg-muted/40"
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <div
          className={cn(
            "ml-2 truncate text-[11px] font-medium",
            dark ? "text-ink-muted" : "text-muted-foreground"
          )}
        >
          {title}
        </div>
        <div className="ml-auto flex items-center gap-2">{toolbar}</div>
      </div>
      {/* Body */}
      <div className="relative">{children}</div>
    </div>
  );
}

/** Sidebar nav rail used inside product frames. */
export function AppRail({
  active = 0,
  items,
  variant = "light",
}: {
  active?: number;
  items: { icon: React.ReactNode; label: string }[];
  variant?: "light" | "ink";
}) {
  const dark = variant === "ink";
  return (
    <div
      className={cn(
        "hidden w-14 shrink-0 flex-col items-center gap-1 border-r py-3 sm:flex",
        dark ? "border-white/10 bg-white/[0.02]" : "border-border/60 bg-muted/30"
      )}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition",
            i === active
              ? dark
                ? "bg-brand text-brand-foreground"
                : "bg-brand text-brand-foreground"
              : dark
                ? "text-ink-muted hover:bg-white/5"
                : "text-muted-foreground hover:bg-muted"
          )}
          title={it.label}
        >
          {it.icon}
        </div>
      ))}
    </div>
  );
}

/** A subtle column header. */
export function ColHeader({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      <span>{children}</span>
      {hint && <span className="font-normal normal-case tracking-normal text-muted-foreground/70">{hint}</span>}
    </div>
  );
}

/** Fade-in helper used by list rows when they mount. */
export function RowFade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
