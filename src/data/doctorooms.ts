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

export const COMPARISON_ROWS = [
  {
    dimension: "Patient discovery & booking",
    fragmented: "A separate website or listings tool, or none at all",
    doctorooms: "Doctor, clinic & hospital profiles + online + video booking, built in",
    href: "#acquisition",
  },
  {
    dimension: "Queue & front desk",
    fragmented: "Standalone token display, manual sign-in, walk-in chaos",
    doctorooms: "Smart queue, live position, next-patient call, notifications",
    href: "#queue",
  },
  {
    dimension: "Consultation & EMR",
    fragmented: "A separate EMR, re-keyed from the booking system",
    doctorooms: "History, vitals, notes & AI-assisted prescription on one patient record",
    href: "#doctor",
  },
  {
    dimension: "Pharmacy & inventory",
    fragmented: "Pharmacy POS + a different inventory sheet + spreadsheets",
    doctorooms: "Dispensing, stock, batches, expiry & reorder on one platform",
    href: "#operations",
  },
  {
    dimension: "Lab & diagnostics",
    fragmented: "Lab software that doesn't talk to the EMR or billing",
    doctorooms: "Orders → samples → results flow back into the chart automatically",
    href: "#operations",
  },
  {
    dimension: "Billing & insurance",
    fragmented: "Billing tool + insurance desk + manual reconciliation",
    doctorooms: "Estimates, claims, receipts & reconciliation connected to every visit",
    href: "#operations",
  },
  {
    dimension: "Reports & visibility",
    fragmented: "Exports stitched together in spreadsheets, always delayed",
    doctorooms: "Operational, clinical & financial views live across departments",
    href: "#operations",
  },
  {
    dimension: "AI assistance",
    fragmented: "Not possible across disconnected tools",
    doctorooms: "Role-aware AI: intent → scoped data → draft action → confirmation",
    href: "#ai",
  },
] as const;

export const COMPARISON_STATS = [
  { fragmented: "5–10 disconnected tools", doctorooms: "1 connected platform" },
  { fragmented: "Data re-entered at every step", doctorooms: "One patient record, end-to-end" },
  { fragmented: "Visibility = exports + spreadsheets", doctorooms: "Live, role-based reporting" },
] as const;

export const FAQ_ITEMS = [
  {
    key: "isolation",
    q: "Is our hospital\u2019s data isolated from other organizations?",
    a: "Doctorooms is multi-tenant by design. Hospital, doctor, staff and patient data stays scoped per tenant. A user only ever sees what their role in their organization is authorized to access \u2014 not another hospital\u2019s records.",
  },
  {
    key: "start-small",
    q: "Can we start with one module and expand later?",
    a: "Yes. Organizations often begin with discovery, booking and queue \u2014 or just OPD and pharmacy \u2014 and add IPD, lab, billing, OT or insurance as they grow. Every module stays connected on the same platform, so expansion does not mean re-integrating a new tool.",
  },
  {
    key: "rollout",
    q: "How long does a typical rollout take?",
    a: "It depends on your scope: a single clinic can go live quickly with discovery, booking and queue, while a multi-specialty hospital adding IPD, lab, pharmacy, billing and insurance takes longer to configure and train. We scope a rollout plan with your team during onboarding.",
  },
  {
    key: "ai-silent",
    q: "Does the AI take actions without a human?",
    a: "No. Sensitive actions are proposed, not silently executed. The AI parses intent, checks role authorization, and returns an answer or a draft action that requires human confirmation where appropriate. Every action is auditable.",
  },
  {
    key: "existing-systems",
    q: "We already use a billing / lab / pharmacy tool. Do we have to rip it out?",
    a: "Not necessarily on day one. Many teams start with the modules that create the most friction \u2014 discovery, booking, queue \u2014 and migrate billing, lab or pharmacy onto Doctorooms over time so data stops being re-entered across systems. We can discuss what to connect first.",
  },
  {
    key: "support",
    q: "What support and training is included?",
    a: "Onboarding covers configuration, role setup and staff training for the modules you go live with. Ongoing support is handled by the Doctorooms team. Specific SLAs, training hours and response times are scoped per engagement \u2014 we share details in a private walkthrough.",
  },
  {
    key: "certifications",
    q: "Is Doctorooms HIPAA / ISO 27001 / SOC 2 certified?",
    a: "We do not claim HIPAA, ISO 27001, SOC 2 or any certification on this page unless separately verified and approved for marketing. The security page lists implemented controls \u2014 role-based access, tenant isolation, authentication, auditability, controlled workflows and operational safeguards.",
  },
] as const;

export const KEYBOARD_SHORTCUTS = [
  { keys: ["B"], label: "Open the Book-a-Demo dialog", desc: "Skip to the conversion form from anywhere." },
  { keys: ["?"], label: "Open this keyboard shortcuts panel", desc: "You are here." },
  { keys: ["Esc"], label: "Close any open dialog", desc: "Dismiss overlays and restore focus." },
  { keys: ["T"], label: "Scroll back to the top", desc: "Jump to the hero of the page." },
] as const;

export const ROLLOUT_STEPS = [
  {
    n: "01",
    key: "Scope",
    title: "We scope what you go live with",
    desc: "A walkthrough maps your organization — clinic, hospital, chain or lab — and the modules that create the most friction today. We agree on what goes live first and what connects later.",
    deliverables: ["Org & module scope", "Rollout plan", "Timeline estimate"],
    tone: "brand" as const,
  },
  {
    n: "02",
    key: "Configure",
    title: "We configure your tenant",
    desc: "Roles, departments, doctor & clinic profiles, bed map, pharmacy stock, lab tests, billing rules and insurance payers are set up against your real workflows. Nothing is live until you sign off.",
    deliverables: ["Role & access setup", "Department & bed map", "Workflow configuration"],
    tone: "growth" as const,
  },
  {
    n: "03",
    key: "Train",
    title: "We train your staff by role",
    desc: "Admins, doctors, receptionists, nurses, pharmacists and lab staff each get role-specific training on the modules they'll use — not a generic tour. Super-users are identified for each department.",
    deliverables: ["Role-based training", "Super-user identification", "Reference materials"],
    tone: "brand" as const,
  },
  {
    n: "04",
    key: "Go live",
    title: "You go live — and we stay",
    desc: "We're on standby through your first days of real patient flow. Issues get fast responses. After go-live, we iterate on what your team actually needs instead of locking you into a fixed process.",
    deliverables: ["Go-live support", "Iteration cycles", "Ongoing partnership"],
    tone: "growth" as const,
  },
] as const;

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

export const ORG_FIT = [
  {
    key: "clinic",
    label: "Independent clinic",
    icon: "Stethoscope",
    headline: "Run your clinic like a modern practice.",
    desc: "Be discoverable, book patients online and in-person, manage your queue, and let AI draft prescriptions while you focus on care.",
    modules: ["OPD", "Queue", "Pharmacy", "Billing", "Documents"],
    metric: { label: "Typical scale", value: "1–4 doctors" },
  },
  {
    key: "hospital",
    label: "Multi-specialty hospital",
    icon: "BedDouble",
    headline: "Connect OPD to IPD without the chaos.",
    desc: "From admission to discharge, every department — lab, pharmacy, billing, OT, insurance — talks to the same patient record.",
    modules: ["OPD", "IPD", "Queue", "Laboratory", "Pharmacy", "Billing", "Insurance", "OT"],
    metric: { label: "Typical scale", value: "50–500 beds" },
  },
  {
    key: "chain",
    label: "Hospital chain",
    icon: "Building2",
    headline: "One platform across every location.",
    desc: "Multi-tenant isolation, cross-location reporting, shared inventory and insurance workflows — without giving up per-hospital control.",
    modules: ["OPD", "IPD", "Laboratory", "Pharmacy", "Billing", "Inventory", "Insurance", "Reports", "Documents"],
    metric: { label: "Typical scale", value: "2+ locations" },
  },
  {
    key: "lab",
    label: "Diagnostic lab",
    icon: "FlaskConical",
    headline: "From order to report, end to end.",
    desc: "Receive orders from clinics and hospitals, track samples, publish results back to the referring doctor — all auditable.",
    modules: ["Laboratory", "Billing", "Inventory", "Reports", "Documents"],
    metric: { label: "Typical scale", value: "Standalone or network" },
  },
] as const;
