"use client";

import { DemoDialogProvider } from "@/components/doctorooms/demo-dialog";
import { SiteHeader } from "@/components/doctorooms/site-header";
import { SiteFooter } from "@/components/doctorooms/site-footer";
import { HeroExperience } from "@/components/doctorooms/hero-experience";
import { ProblemConvergence } from "@/components/doctorooms/problem-convergence";
import { AcquisitionFlow } from "@/components/doctorooms/acquisition-flow";
import { DoctorGrowth } from "@/components/doctorooms/doctor-growth";
import { AIAgentExperience } from "@/components/doctorooms/ai-agent-experience";
import { VideoConsultation } from "@/components/doctorooms/video-consultation";
import { QueueExperience } from "@/components/doctorooms/queue-experience";
import { PatientJourney } from "@/components/doctorooms/patient-journey";
import { HospitalOS } from "@/components/doctorooms/hospital-os";
import { OrgFit } from "@/components/doctorooms/org-fit";
import { IPDJourney } from "@/components/doctorooms/ipd-journey";
import { RoleOrbit } from "@/components/doctorooms/role-orbit";
import { TrustSection } from "@/components/doctorooms/trust-section";
import { FAQSection } from "@/components/doctorooms/faq-section";
import { ROICalculator } from "@/components/doctorooms/roi-calculator";
import { FinalCTA } from "@/components/doctorooms/final-cta";
import { ScrollProgress } from "@/components/doctorooms/scroll-progress";
import { ChapterNavigator } from "@/components/doctorooms/chapter-navigator";
import { BackToTop } from "@/components/doctorooms/back-to-top";
import { MobileStickyCTA } from "@/components/doctorooms/mobile-sticky-cta";

/**
 * Doctorooms — cinematic landing experience.
 * 14 chapters, scroll-driven storytelling, role-aware AI, real product UI.
 */
export default function Home() {
  return (
    <DemoDialogProvider>
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
          {/* Chapter 8 — Patient Journey (pinned horizontal) */}
          <PatientJourney />
          {/* Chapter 9 — Hospital Operations */}
          <HospitalOS />
          {/* Chapter 9½ — Built for your organization (org-fit selector) */}
          <OrgFit />
          {/* Chapter 10 — IPD Story */}
          <IPDJourney />
          {/* Chapter 11 — Role Ecosystem */}
          <RoleOrbit />
          {/* Chapter 12 — Trust & Security */}
          <TrustSection />
          {/* Chapter 12½ — Questions (FAQ) */}
          <FAQSection />
          {/* Chapter 13 — ROI */}
          <ROICalculator />
          {/* Chapter 14 — Final Conversion */}
          <FinalCTA />
        </main>

        <SiteFooter />

        {/* Floating actions: back-to-top + keyboard shortcuts + mobile sticky CTA */}
        <BackToTop />
        <MobileStickyCTA />
      </div>
    </DemoDialogProvider>
  );
}
