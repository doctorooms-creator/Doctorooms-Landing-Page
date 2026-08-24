"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BedDouble,
  CalendarClock,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutGrid,
  Pill,
  Receipt,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Video,
  Wallet,
  type LucideProps,
} from "lucide-react";

export type ModuleIconKey =
  | "OPD" | "IPD" | "Queue" | "Laboratory" | "Pharmacy" | "Billing"
  | "Inventory" | "OT" | "Insurance" | "Reports" | "Documents";

export const MODULE_ICONS: Record<ModuleIconKey, LucideIcon> = {
  OPD: Stethoscope,
  IPD: BedDouble,
  Queue: CalendarClock,
  Laboratory: FlaskConical,
  Pharmacy: Pill,
  Billing: Receipt,
  Inventory: LayoutGrid,
  OT: HeartPulse,
  Insurance: ShieldCheck,
  Reports: Activity,
  Documents: FileText,
};

export const ROLE_ICONS: Record<string, LucideIcon> = {
  Admin: ShieldCheck,
  Doctor: Stethoscope,
  "Hospital Admin": LayoutGrid,
  Patient: UserRound,
  Receptionist: CalendarClock,
  Assistant: Users,
  Pharmacist: Pill,
  Nurse: HeartPulse,
  Lab: FlaskConical,
};

export const AI_ROLE_ICONS: Record<string, LucideIcon> = {
  ...ROLE_ICONS,
  "IPD / Nurse": HeartPulse,
};

export const GENERIC_ICONS = {
  Activity,
  BedDouble,
  CalendarClock,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutGrid,
  Pill,
  Receipt,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Video,
  Wallet,
};

export function Icon({
  name,
  className,
  ...props
}: { name: LucideIcon } & LucideProps) {
  const Cmp = name;
  return <Cmp className={cn("h-4 w-4", className)} {...props} />;
}
