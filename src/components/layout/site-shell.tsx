import type { ReactNode } from "react";
// フォントは自己ホスト（ビルド時に Google Fonts へアクセスしない）。unicode-range で分割された woff2 が必要分だけ読み込まれる
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/open-sans";
import type { Locale } from "@/config/i18n";
import { Header } from "./header";
import { Footer } from "./footer";
import "@/app/globals.css";

/** html/body を含むサイト全体の骨格。ロケールごとのルートレイアウトから使う */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only-focusable bg-link text-link-ink px-4 py-2 font-bold">
          {locale === "en" ? "Skip to content" : "本文へスキップ"}
        </a>
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
