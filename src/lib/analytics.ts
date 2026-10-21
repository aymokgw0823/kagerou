/**
 * 計測の一元化。GA4 / GTM の ID は環境変数（NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID）。
 * - Cookie 同意（analytics）が得られるまでタグは読み込まず、イベントも送らない
 * - 主要イベントはここで名前を固定する
 */
export type AnalyticsEvent =
  | { name: "ai_reform_start"; params?: { part?: string } }
  | { name: "ai_reform_complete"; params: { mode: "demo" | "live"; id: string } }
  | { name: "ai_reform_pdf"; params: { id: string; with_email: boolean } }
  | { name: "concierge_message" }
  | { name: "booking_submit"; params: { business: string; with_consultation: boolean } }
  | { name: "contact_submit"; params: { business: string } }
  | { name: "entry_submit"; params: { job: string } };

export const CONSENT_KEY = "cookie-consent"; // "all" | "necessary"
export type ConsentValue = "all" | "necessary";

export function readConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {}
  window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: v }));
}

export const analyticsEnabled = () => !!(process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GTM_ID);

type DataLayerWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/** イベント送信。同意前・ID 未設定時は何もしない（開発時はコンソールに出す） */
export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  if (readConsent() !== "all") return;
  const w = window as DataLayerWindow;
  const params = "params" in event ? event.params : {};
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event.name, params);
  if (!analyticsEnabled()) return;
  if (typeof w.gtag === "function") w.gtag("event", event.name, params);
  else {
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: event.name, ...params });
  }
}
