# Doctorooms-Landing-Page

> Cinematic, scroll-choreographed marketing landing page for **Doctorooms** — a healthcare growth + operating platform. Built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, GSAP (ScrollTrigger) and Framer Motion.

## ✨ Highlights

- **19 scroll-driven chapters**: Hero → Problem → The Delta → Acquisition → Doctor Growth → AI Experience → Video Consult → Smart Queue → Patient Journey → Operations → IPD Story → Roles → Trust → Outcomes → FAQ → ROI → Rollout → Final CTA.
- **Cinematic animations**: GSAP ScrollTrigger scrub + pinned sequences, Framer Motion panel transitions, IntersectionObserver-based reveals (all respect `prefers-reduced-motion`).
- **Interactive demos**: Book a Private Demo dialog (Prisma-persisted), AI role switcher, ROI calculator with live sliders, comparison deep-link (`#compare=...`), admin overlay, glossary, keyboard shortcuts (`B`/`T`/`?`/`G`/`Shift+A`).
- **Brand identity**: Deep-teal + emerald palette (no indigo/blue). Custom aurora cards, dot-pulse loaders, gradient dividers.
- **Production-ready**: SEO metadata, JSON-LD structured data, OG image, sticky mobile CTA, scroll progress + chapter navigator, back-to-top.
- **Accessibility**: Semantic HTML, ARIA labels, focus-visible rings, `sr-only` content, keyboard navigation throughout.

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Animation | GSAP + ScrollTrigger, Framer Motion |
| Database | Prisma ORM (SQLite) |
| Icons | Lucide |
| State | Zustand (client), TanStack Query (server) |

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Push the database schema
bun run db:push

# Start the dev server on http://localhost:3000
bun run dev
```

> The dev server is memory-hungry (Turbopack compile of the 97-file landing page). On a constrained host, cap the V8 heap:
> ```bash
> NODE_OPTIONS='--max-old-space-size=1280 --max-semi-space-size=64' ./node_modules/.bin/next dev -p 3000
> ```

## 📁 Project Structure

```
.
├── prisma/                  # Prisma schema (DemoRequest model)
├── public/                  # og.png, logo.svg, robots.txt
├── src/
│   ├── app/
│   │   ├── api/demo/        # POST handler for demo requests
│   │   ├── globals.css      # Tailwind v4 tokens + utility classes
│   │   ├── layout.tsx       # Fonts, metadata, JSON-LD, Toaster
│   │   └── page.tsx         # The 19-chapter landing page
│   ├── components/
│   │   ├── doctorooms/      # All landing-page chapter components
│   │   └── ui/               # shadcn/ui component set
│   ├── data/doctorooms.ts   # FAQ, keyboard shortcuts, org-fit, ROI drivers
│   ├── lib/
│   │   ├── anim/            # GSAP register + reveal/scrub/pinned-sequence hooks
│   │   ├── analytics.ts     # 11 event-tracking functions
│   │   └── db.ts            # Prisma client singleton
│   └── styles/
├── next.config.ts           # standalone output + allowedDevOrigins
├── tailwind.config.ts       # Brand tokens (deep-teal + emerald)
└── package.json
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|---|---|
| `B` | Open Book a Private Demo dialog |
| `T` | Scroll to top |
| `?` | Open keyboard shortcuts overlay |
| `G` | Open chapter navigator |
| `Shift+A` | Open admin overlay |

## 📊 Demo Request Flow

1. User fills the **Book a Private Demo** form (name, email, phone, org, type, size, note).
2. `POST /api/demo` validates and persists to SQLite via Prisma.
3. Success animation plays; admin overlay (`Shift+A`) lists all submissions with sort + copy-email.

## 🧭 Chapters

01. The Promise — hero with aurora background + 3-step growth loop
02. The Problem — fragmented tools pain points
02½. The Delta — Doctorooms vs. stitched-together tools (deep-linkable)
03. Acquisition — patient discovery → booking
04. Doctor Growth — patient volume + revenue lift
05. AI Experience — role-aware AI agent demo
06. Video Consult — telemedicine flow
07. Smart Queue — token + live queue + next-patient call
08. Patient Journey — end-to-end visit lifecycle
09. Operations — Hospital OS modules (OPD/IPD/Lab/Pharmacy/Billing/...)
10. IPD Story — admission → discharge pinned sequence
11. Roles — 9 role orbit
12. Trust — security + auditability
13. Outcomes — featured customer quotes carousel
14. FAQ — 7 accordion items
15. ROI — interactive calculator
16. Rollout — phased deployment timeline
17. Final CTA — demo request

## 📝 License

Private — © Doctorooms.
