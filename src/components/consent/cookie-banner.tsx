"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { analyticsEnabled, readConsent, writeConsent } from "@/lib/analytics";

function subscribe(cb: () => void) {
  window.addEventListener("cookie-consent-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("cookie-consent-change", cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * Cookie 同意バナー。必須 Cookie 以外（GA4 / GTM）は「すべて許可」の後にだけ読み込む。
 * 同意状態は localStorage に保存し、フッターの「Cookie設定」から変更できる。
 */
export function CookieBanner() {
  // SSR では "unknown"（バナーを出さない）、クライアントでは localStorage の値を購読する
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unknown" as const);

  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {consent === null && (
        <div
          role="region"
          aria-label="Cookieの利用について"
          className="border-line bg-paper shadow-card fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border p-4 md:inset-x-6 md:bottom-6 md:p-5"
        >
          <p className="text-xs leading-[1.7] md:text-sm">
            アクセス解析のための Cookie は、ご同意いただいた場合にのみ使用します。
            <Link href="/policy/cookie" className="link-underline ml-1">
              Cookieポリシー
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => writeConsent("all")}
              className="btn-base bg-link text-link-ink min-h-9 px-4 text-xs"
            >
              すべて許可
            </button>
            <button
              type="button"
              onClick={() => writeConsent("necessary")}
              className="btn-base border-ink text-ink min-h-9 px-4 text-xs"
            >
              必須のみ
            </button>
          </div>
        </div>
      )}
      {consent === "all" && analyticsEnabled() && (
        <>
          {gtm && (
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
            </Script>
          )}
          {ga && !gtm && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
              <Script id="ga4" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
              </Script>
            </>
          )}
        </>
      )}
    </>
  );
}

/** フッター用：同意状態の変更 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.removeItem("cookie-consent");
        } catch {}
        window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: null }));
      }}
      className="text-ink-2 hover:text-link text-xs font-bold hover:underline hover:underline-offset-4"
    >
      Cookie設定
    </button>
  );
}
