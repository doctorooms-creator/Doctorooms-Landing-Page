"use client";

import dynamic from "next/dynamic";
import { DemoDialogProvider } from "@/components/doctorooms/demo-dialog";
import { GlossaryProvider } from "@/components/doctorooms/glossary-context";
import { SiteHeader } from "@/components/doctorooms/site-header";
import { SiteFooter } from "@/components/doctorooms/site-footer";
import { HeroExperience } from "@/components/doctorooms/hero-experience";
import { ProblemConvergence } from "@/components/doctorooms/problem-convergence";
import { ComparisonSection } from "@/components/doctorooms/comparison-section";
import { AcquisitionFlow } from "@/components/doctorooms/acquisition-flow";
import { DoctorGrowth } from "@/components/doctorooms/doctor-growth";
import { AIAgentExperience } from "@/components/doctorooms/ai-agent-experience";
import { VideoConsultation } from "@/components/doctorooms/video-consultation";
import { QueueExperience } from "@/components/doctorooms/queue-experience";
import { HospitalOS } from "@/components/doctorooms/hospital-os";
import { OrgFit } from "@/components/doctorooms/org-fit";
import { TrustSection } from "@/components/doctorooms/trust-section";
import { FAQSection } from "@/components/doctorooms/faq-section";
import { ROICalculator } from "@/components/doctorooms/roi-calculator";
import { RolloutTimeline } from "@/components/doctorooms/rollout-timeline";
import { FinalCTA } from "@/components/doctorooms/final-cta";
import { ScrollProgress } from "@/components/doctorooms/scroll-progress";
import { ChapterNavigator } from "@/components/doctorooms/chapter-navigator";
import { BackToTop } from "@/components/doctorooms/back-to-top";
import { MobileStickyCTA } from "@/components/doctorooms/mobile-sticky-cta";
import { LazyMount } from "@/components/doctorooms/lazy-mount";
import { SectionSkeleton } from "@/components/doctorooms/section-skeleton";

/**
 * Heavy GSAP-pinned chapters are dynamically imported (ssr:false) so
 * their JS chunks only download when the user approaches the section.
 * Paired with LazyMount (IntersectionObserver-gated mount), the heavy
 * ScrollTrigger setup is deferred until the section is near the
 * viewport — keeping initial render + LCP light.
 */
const PatientJourney = dynamic(
  () => import("@/components/doctorooms/patient-journey").then((m) => m.PatientJourney),
  {
    ssr: false,
    loading: () => <SectionSkeleton eyebrow="Chapter 08 — Patient Journey" tone="brand" cards={3} />,
  }
);
const IPDJourney = dynamic(
  () => import("@/components/doctorooms/ipd-journey").then((m) => m.IPDJourney),
  {
    ssr: false,
    loading: () => <SectionSkeleton eyebrow="Chapter 10 — IPD Story" tone="brand" cards={3} />,
  }
);
const RoleOrbit = dynamic(
  () => import("@/components/doctorooms/role-orbit").then((m) => m.RoleOrbit),
  {
    ssr: false,
    loading: () => <SectionSkeleton eyebrow="Chapter 11 — Role Ecosystem" tone="growth" cards={4} />,
  }
);

/**
 * Doctorooms — cinematic landing experience.
 * 14 chapters, scroll-driven storytelling, role-aware AI, real product UI.
 */
export default function Home() {
  return (
    <DemoDialogProvider>
      <GlossaryProvider>
      <div className="relative flex min-h-screen flex-col">
        {/* Global scroll progress + chapter navigator */}
        <ScrollProgress />
        <ChapterNavigator />

        {/* Skip to content for keyboard users */}
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg"
        >
          Skip to content
        </a>

        <SiteHeader />

        {/* Sticky-footer layout: main grows, footer sits at bottom */}
        <main id="main" className="flex-1">
          {/* Chapter 1 — The Promise */}
          <HeroExperience />
          {/* Chapter 2 — The Problem */}
          <ProblemConvergence />
          {/* Chapter 2½ — Fragmented vs. one platform (comparison) */}
          <ComparisonSection />
          {/* Chapter 3 — Patient Acquisition */}
          <AcquisitionFlow />
          {/* Chapter 4 — Doctor Growth & Productivity */}
          <DoctorGrowth />
          {/* Chapter 5 — AI Experience */}
          <AIAgentExperience />
          {/* Chapter 6 — Video Consultation */}
          <VideoConsultation />
          {/* Chapter 7 — Smart Queue */}
          <QueueExperience />
          {/* Chapter 8 — Patient Journey (pinned horizontal) — lazy */}
          <LazyMount
            placeholder={<SectionSkeleton eyebrow="Chapter 08 — Patient Journey" tone="brand" cards={3} />}
            placeholderMinHeight={900}
            ariaLabel="Patient journey chapter loading"
          >
            <PatientJourney />
          </LazyMount>
          {/* Chapter 9 — Hospital Operations */}
          <HospitalOS />
          {/* Chapter 9½ — Built for your organization (org-fit selector) */}
          <OrgFit />
          {/* Chapter 10 — IPD Story — lazy */}
          <LazyMount
            placeholder={<SectionSkeleton eyebrow="Chapter 10 — IPD Story" tone="brand" cards={3} />}
            placeholderMinHeight={900}
            ariaLabel="IPD story chapter loading"
          >
            <IPDJourney />
          </LazyMount>
          {/* Chapter 11 — Role Ecosystem — lazy */}
          <LazyMount
            placeholder={<SectionSkeleton eyebrow="Chapter 11 — Role Ecosystem" tone="growth" cards={4} />}
            placeholderMinHeight={900}
            ariaLabel="Role ecosystem chapter loading"
          >
            <RoleOrbit />
          </LazyMount>
          {/* Chapter 12 — Trust & Security */}
          <TrustSection />
          {/* Chapter 12½ — Questions (FAQ) */}
          <FAQSection />
          {/* Chapter 13 — ROI */}
          <ROICalculator />
          {/* Chapter 13½ — How rollout works */}
          <RolloutTimeline />
          {/* Chapter 14 — Final Conversion */}
          <FinalCTA />
        </main>

        <SiteFooter />

        {/* Floating actions: back-to-top + keyboard shortcuts + mobile sticky CTA */}
        <BackToTop />
        <MobileStickyCTA />
      </div>
      </GlossaryProvider>
    </DemoDialogProvider>
  );
}
