import type { ReactNode } from "react";
import type { Locale } from "@/config/i18n";
import { Header } from "./header";
import { Footer } from "./footer";
import { ConciergeWidget } from "@/features/ai/concierge/ui/concierge-widget";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { SiteJsonLd } from "@/components/seo/json-ld";
import "@/app/globals.css";
import { FontLoader } from "@/components/layout/font-loader";

/** html/body を含むサイト全体の骨格。ロケールごとのルートレイアウトから使う */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <FontLoader />
        <a href="#main" className="sr-only-focusable bg-link text-link-ink px-4 py-2 font-bold">
          {locale === "en" ? "Skip to content" : "本文へスキップ"}
        </a>
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
        {locale === "ja" && <ConciergeWidget />}
        <CookieBanner />
        <SiteJsonLd />
      </body>
    </html>
  );
}
