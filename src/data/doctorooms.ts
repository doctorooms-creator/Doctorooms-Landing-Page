/**
 * Doctorooms — verified marketing content configuration.
 * No fake testimonials, no fake customer logos, no invented patient-growth stats.
 * Every capability listed here maps to a real product module.
 */

export const BRAND = {
  name: "Doctorooms",
  tagline: "More Patients. Smarter Operations. One Intelligent Platform.",
  supporting:
    "Doctorooms connects patient discovery, booking, physical and video consultation, queue, care workflows, hospital operations, follow-up, and AI-powered workflows in one connected healthcare platform.",
  coreMessage: "More Patients. Smarter Operations. One Intelligent Platform.",
} as const;

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Patient Journey", href: "#journey" },
  { label: "AI", href: "#ai" },
  { label: "Operations", href: "#operations" },
  { label: "ROI", href: "#roi" },
  { label: "Security", href: "#security" },
] as const;

export const GROWTH_PILLARS = [
  {
    id: "1",
    key: "ATTRACT",
    title: "Help patients discover the doctor, clinic and hospital.",
    blurb:
      "Be findable where patients already search — by specialty, location, doctor, or condition.",
  },
  {
    id: "2",
    key: "CONVERT",
    title: "Make booking and consultation easy — including video.",
    blurb:
      "Frictionless online and in-person booking that turns discovery into a confirmed consultation.",
  },
  {
    id: "3",
    key: "OPERATE",
    title: "Connect OPD, IPD, queue, lab, pharmacy, billing, inventory, OT, insurance and reporting.",
    blurb:
      "One connected operating layer so a growing patient flow doesn't create operational chaos.",
  },
  {
    id: "4",
    key: "GROW",
    title: "Use AI, automation and data to improve the healthcare business.",
    blurb:
      "Role-aware assistance and automation that lift productivity without locking value behind another tool to learn.",
  },
] as const;

export const HOSPITAL_MODULES = [
  { key: "OPD", desc: "Outpatient workflows, consultation, prescriptions" },
  { key: "IPD", desc: "Admission, beds, vitals, orders, discharge" },
  { key: "Queue", desc: "Token, live queue, next-patient, notifications" },
  { key: "Laboratory", desc: "Orders, samples, results, reporting" },
  { key: "Pharmacy", desc: "Dispensing, stock, substitutes, billing" },
  { key: "Billing", desc: "Estimates, claims, receipts, reconciliation" },
  { key: "Inventory", desc: "Consumables, batches, expiry, reorder" },
  { key: "OT", desc: "Scheduling, checklists, surgical workflow" },
  { key: "Insurance", desc: "Pre-auth, claims, payer workflows" },
  { key: "Reports", desc: "Operational, clinical and financial views" },
  { key: "Documents", desc: "Records, consent, attachments, audit trail" },
] as const;

export const ROLES = [
  { key: "Admin", desc: "Runs the hospital: revenue, staff, control" },
  { key: "Doctor", desc: "Consults, prescribes, follows up" },
  { key: "Hospital Admin", desc: "Manages ops across departments" },
  { key: "Patient", desc: "Discovers, books, consults, follows up" },
  { key: "Receptionist", desc: "Check-in, tokens, front-desk flow" },
  { key: "Assistant", desc: "Supports doctors and clinical staff" },
  { key: "Pharmacist", desc: "Dispenses, manages stock and substitutes" },
  { key: "Nurse", desc: "Vitals, IPD care, handoffs" },
  { key: "Lab", desc: "Orders, samples, results" },
] as const;

export const AI_ROLES = [
  {
    role: "Admin",
    icon: "ShieldCheck",
    color: "brand",
    examples: [
      "What was today's revenue?",
      "Add Dr. Khan to the hospital.",
      "Show me pending insurance claims.",
    ],
    response:
      "Today's revenue across OPD + IPD + Pharmacy + Lab is ₹2,84,500. IPD billing accounts for 41%. Would you like a department-wise breakdown or a comparison with last week?",
    action: {
      label: "Generate today's revenue summary",
      kind: "report",
    },
  },
  {
    role: "Doctor",
    icon: "Stethoscope",
    color: "growth",
    examples: [
      "Show me my queue.",
      "Show Rahul's latest visit.",
      "Prepare a prescription for Rahul.",
    ],
    response:
      "Rahul Verma, last visit 6 days ago — diagnosed with acute sinusitis. I've drafted a prescription continuing amoxicillin 500 mg × 5 days and added a saline nasal spray. Review and confirm to send to pharmacy.",
    action: {
      label: "Review draft prescription",
      kind: "prescription",
    },
  },
  {
    role: "IPD / Nurse",
    icon: "HeartPulse",
    color: "brand",
    examples: [
      "Show latest vitals for the admitted patient.",
      "Prepare discharge workflow.",
    ],
    response:
      "Bed 204 — Priya Nair. Latest vitals 10 min ago: BP 122/78, HR 84, SpO₂ 98%, Temp 98.4°F. Discharge checklist is 5/8 complete — pending final consultant review, billing reconciliation, and discharge summary.",
    action: {
      label: "Open discharge checklist",
      kind: "discharge",
    },
  },
] as const;

export const PATIENT_JOURNEY_STEPS = [
  { key: "Discover", desc: "Patient finds the doctor or hospital" },
  { key: "Book", desc: "Chooses a slot — in-person or video" },
  { key: "Check-in", desc: "Token issued, queue assigned" },
  { key: "Queue", desc: "Live position, notifications" },
  { key: "Consult", desc: "Doctor sees history and consults" },
  { key: "Prescription", desc: "AI-assisted Rx sent to pharmacy" },
  { key: "Lab", desc: "Investigations ordered and resulted" },
  { key: "Pharmacy", desc: "Dispense against the prescription" },
  { key: "Payment", desc: "Billing, insurance, receipts" },
  { key: "Follow-up", desc: "Continuity of care" },
] as const;

export const IPD_STEPS = [
  { key: "Admission", desc: "Patient admitted, bed assigned" },
  { key: "Bed", desc: "Ward/bed, attending team" },
  { key: "Vitals", desc: "Nurse captures vitals on schedule" },
  { key: "Doctor Orders", desc: "Treatment plan, instructions" },
  { key: "Investigation", desc: "Lab and imaging ordered" },
  { key: "Results", desc: "Results return to the chart" },
  { key: "Medication", desc: "Pharmacy dispenses, nurse administers" },
  { key: "Billing", desc: "Bed charges, consumables, insurance" },
  { key: "Discharge", desc: "Summary, advice, follow-up scheduled" },
] as const;

export const TRUST_POINTS = [
  {
    title: "Role-based access",
    desc: "Each user sees only what their role is authorized to access.",
  },
  {
    title: "Tenant & data isolation",
    desc: "Hospital, doctor, staff and patient data stays scoped per tenant.",
  },
  {
    title: "Authentication",
    desc: "Controlled sign-in and session management across roles.",
  },
  {
    title: "Auditability",
    desc: "Workflows and AI-assisted actions are traceable where appropriate.",
  },
  {
    title: "Controlled workflows",
    desc: "Sensitive actions require confirmation, not silent execution.",
  },
  {
    title: "Security controls",
    desc: "Implemented access controls and operational safeguards.",
  },
] as const;

export const TRUST_DISCLAIMER =
  "Listed capabilities reflect implemented controls. Doctorooms does not claim HIPAA, ISO 27001, SOC 2, or any certification on this page unless separately verified and approved for marketing.";

export const ROI_DRIVERS = [
  {
    key: "patient-flow",
    label: "More patient opportunities",
    desc: "Discovery + booking + video consultation expand reach.",
  },
  {
    key: "productivity",
    label: "Improved staff productivity",
    desc: "Less duplicated entry, fewer manual handoffs.",
  },
  {
    key: "manual-work",
    label: "Reduced manual work",
    desc: "AI-assisted drafting, queuing, billing reconciliation.",
  },
  {
    key: "control",
    label: "Better operational control",
    desc: "Live visibility across OPD, IPD, lab, pharmacy, billing.",
  },
  {
    key: "leakage",
    label: "Reduced leakage",
    desc: "Connected billing, inventory and insurance workflows.",
  },
  {
    key: "follow-up",
    label: "Improved follow-up & reporting",
    desc: "Continuity of care plus operational and financial reporting.",
  },
] as const;

export const ROI_DISCLAIMER =
  "This is an illustrative model. Inputs and outputs are assumptions for planning conversation, not a guarantee. Actual results depend on your organization, scale, and rollout.";

export const STATS = [
  {
    value: "1",
    suffix: "platform",
    label: "from discovery to follow-up",
    illustrative: false,
  },
  {
    value: "11",
    suffix: "modules",
    label: "OPD, IPD, lab, pharmacy, billing & more",
    illustrative: false,
  },
  {
    value: "9",
    suffix: "roles",
    label: "on one connected system",
    illustrative: false,
  },
  {
    value: "3",
    suffix: "AI contexts",
    label: "Admin, Doctor, IPD — role-aware",
    illustrative: false,
  },
] as const;

export const PROBLEM_SYSTEMS = [
  "Appointments",
  "Queue",
  "EMR",
  "Billing",
  "Lab",
  "Pharmacy",
  "Inventory",
  "IPD",
  "Comms",
  "Reports",
] as const;
