"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Menu, Plus, Stethoscope } from "lucide-react";
import { NAV_LINKS, BRAND } from "@/data/doctorooms";
import { track } from "@/lib/analytics";
import { useDemoDialog } from "./demo-dialog";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm">
        <Stethoscope className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-growth ring-2 ring-background" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        Doctor<span className="text-brand">ooms</span>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useDemoDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDemoClick = () => {
    track("hero_demo_click", { source: "header" });
    open();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <a href="#top" aria-label={`${BRAND.name} home`} className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDemoClick}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Book a Private Demo
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col gap-2 pt-6">
                <Logo />
                <div className="mt-6 grid gap-1">
                  {NAV_LINKS.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <a
                        href={l.href}
                        className="rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition hover:bg-muted"
                      >
                        {l.label}
                      </a>
                    </SheetClose>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <SheetClose asChild>
                    <Button
                      onClick={handleDemoClick}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4" /> Book a Private Demo
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
