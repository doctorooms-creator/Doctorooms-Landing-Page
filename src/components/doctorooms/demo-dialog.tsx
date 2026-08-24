"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { track } from "@/lib/analytics";
import { CalendarCheck, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";

type DemoContextValue = { open: () => void; close: () => void };
const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemoDialog() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoDialog must be used inside <DemoDialogProvider>");
  return ctx;
}

export function DemoDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(
    () => ({
      open: () => {
        track("demo_form_start");
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    []
  );
  return (
    <DemoContext.Provider value={value}>
      {children}
      <DemoFormDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </DemoContext.Provider>
  );
}

const ORG_TYPES = [
  "Independent clinic",
  "Multi-specialty clinic",
  "Single-specialty hospital",
  "Multi-specialty hospital",
  "Diagnostic lab",
  "Pharmacy chain",
  "Health-tech partner",
] as const;

function DemoFormDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      org: String(fd.get("org") || ""),
      orgType: String(fd.get("orgType") || ""),
      size: String(fd.get("size") || ""),
      note: String(fd.get("note") || ""),
      source: "landing",
    };
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      track("demo_form_submit", { orgType: payload.orgType, size: payload.size });
      track("demo_form_success", { orgType: payload.orgType });
      // Brief on-brand success state (1.2s) before close + toast.
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        toast({
          title: "Demo request received",
          description: "Our team will reach out within one business day.",
        });
        onOpenChange(false);
        (e.target as HTMLFormElement).reset();
      }, 1200);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or email hello@doctorooms.com.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => {
      if (!v && success) return; // ignore outer close during success flash
      onOpenChange(v);
    }}>
      <DialogContent
        className="relative max-h-[92vh] overflow-y-auto scroll-soft sm:max-w-[560px]"
        aria-describedby="demo-dialog-desc"
      >
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2 text-brand">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Private Demo
            </span>
          </div>
          <DialogTitle className="text-2xl tracking-tight">
            See Doctorooms run for your hospital
          </DialogTitle>
          <DialogDescription id="demo-dialog-desc">
            A 30-minute walkthrough of patient acquisition, queue, OPD/IPD operations
            and AI workflows — tailored to your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name" required>
              <Input id="name" name="name" required placeholder="Dr. Anjali Mehta" autoComplete="name" />
            </Field>
            <Field label="Work email" htmlFor="email" required>
              <Input id="email" name="email" type="email" required placeholder="anjali@hospital.in" autoComplete="email" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" name="phone" type="tel" placeholder="+91 98XXX XXXXX" autoComplete="tel" />
            </Field>
            <Field label="Organization" htmlFor="org" required>
              <Input id="org" name="org" required placeholder="Mehta Hospital" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization type" htmlFor="orgType">
              <Select name="orgType" defaultValue="Multi-specialty hospital">
                <SelectTrigger id="orgType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Beds / scale" htmlFor="size">
              <Select name="size" defaultValue="50–200 beds">
                <SelectTrigger id="size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="< 50 beds">Under 50 beds / clinic</SelectItem>
                  <SelectItem value="50–200 beds">50–200 beds</SelectItem>
                  <SelectItem value="200–500 beds">200–500 beds</SelectItem>
                  <SelectItem value="500+ beds">500+ beds</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="What would you like to see first?" htmlFor="note">
            <Textarea
              id="note"
              name="note"
              rows={3}
              placeholder="e.g. patient acquisition + AI-assisted prescription + IPD"
            />
          </Field>

          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-brand" />
            Your information is used only to schedule your demo. We do not sell your data.
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting || success}>
              Maybe later
            </Button>
            <Button type="submit" disabled={submitting || success}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <CalendarCheck className="h-4 w-4" /> Request demo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Success overlay — on-brand pulse + checkmark, 1.2s */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/95 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.9 }}
                className="relative flex h-16 w-16 items-center justify-center"
              >
                {/* Pulse rings */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-brand/30"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-1 rounded-full bg-brand/20"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 0.9, delay: 0.15, repeat: Infinity, ease: "easeOut" }}
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-growth text-white shadow-lg shadow-brand/30">
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.15 }}
                  >
                    <CheckCircle2 className="h-8 w-8" strokeWidth={2.5} />
                  </motion.span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.25 }}
                className="text-center"
              >
                <div className="text-base font-semibold text-foreground">
                  Request received
                </div>
                <div className="text-xs text-muted-foreground">
                  We&apos;ll reach out within one business day.
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
