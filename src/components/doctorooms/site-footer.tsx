"use client";

import { Button } from "@/components/ui/button";
import { BRAND, NAV_LINKS } from "@/data/doctorooms";
import { track } from "@/lib/analytics";
import { HeartPulse, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { useDemoDialog } from "./demo-dialog";
import { Logo } from "./site-header";

export function SiteFooter() {
  const { open } = useDemoDialog();
  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="container-px mx-auto max-w-7xl py-12">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground text-pretty">
              {BRAND.supporting}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Button size="sm" onClick={() => { track("hero_demo_click", { source: "footer" }); open(); }}>
                Book a Private Demo
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { track("pricing_or_contact_intent", { source: "footer" }); open(); }}
              >
                Contact
              </Button>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Platform
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-foreground/80 transition hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Company
            </h3>
            <ul className="mt-4 grid gap-2.5">
              <li><a href="#top" className="text-sm text-foreground/80 hover:text-foreground">About</a></li>
              <li><a href="#security" className="text-sm text-foreground/80 hover:text-foreground">Security</a></li>
              <li><a href="#roi" className="text-sm text-foreground/80 hover:text-foreground">ROI</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Connect
            </h3>
            <div className="mt-4 flex items-center gap-2">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "Twitter / X" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Mail, label: "Email" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-brand/40 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 hairline" />

        <div className="mt-6 flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5 text-growth" />
            Built for clinics, hospitals, doctors and patients.
          </p>
        </div>
      </div>
    </footer>
  );
}
