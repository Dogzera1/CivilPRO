export type TrackEventName =
  | "cta_click"
  | "checkout_start"
  | "purchase"
  | "lead_submit";

export function track(event: TrackEventName, params?: Record<string, unknown>) {
  try {
    // GA4 via gtag
    // @ts-expect-error gtag global
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      // @ts-expect-error gtag global
      window.gtag("event", event, params || {});
    }

    // Meta Pixel via fbq
    // @ts-expect-error fbq global
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      // Mapear alguns eventos para o padrão do Pixel
      if (event === "checkout_start") {
        // @ts-expect-error fbq global
        window.fbq("track", "InitiateCheckout", params || {});
      } else if (event === "purchase") {
        // @ts-expect-error fbq global
        window.fbq("track", "Purchase", params || {});
      } else if (event === "lead_submit") {
        // @ts-expect-error fbq global
        window.fbq("track", "Lead", params || {});
      } else {
        // @ts-expect-error fbq global
        window.fbq("trackCustom", event, params || {});
      }
    }
  } catch {
    // nunca quebrar UI por tracking
  }
}

