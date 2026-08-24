"use client";

/**
 * Lightweight analytics shim. No third-party tracker is introduced
 * (per the project rule about not adding unnecessary trackers).
 * Events are dispatched on window as `doctorooms:analytics` and also
 * logged in dev so a future integration (GTM/Segment/Plausible) can
 * subscribe without touching call sites.
 */

export type AnalyticsEvent =
  | "hero_demo_click"
  | "platform_explore_click"
  | "ai_demo_interaction"
  | "video_consultation_section_interaction"
  | "roi_calculator_start"
  | "roi_calculator_complete"
  | "demo_form_start"
  | "demo_form_submit"
  | "pricing_or_contact_intent"
  | "faq_expand"
  | "keyboard_shortcuts_open"
  | "admin_panel_open"
  | "admin_status_change"
  | "demo_form_success";

type Payload = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, payload: Payload = {}) {
  if (typeof window === "undefined") return;
  const detail = {
    event,
    ts: Date.now(),
    ...payload,
  };
  window.dispatchEvent(new CustomEvent("doctorooms:analytics", { detail }));
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, payload);
  }
}

/**
 * Helper to attach a click analytics call to a CTA.
 */
export function withTracking<T extends (...args: never[]) => void>(
  fn: T,
  event: AnalyticsEvent,
  payload: Payload = {}
): T {
  return ((...args: never[]) => {
    track(event, payload);
    return fn(...args);
  }) as T;
}
