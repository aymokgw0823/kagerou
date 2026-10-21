import type { ReactNode } from "react";
import { Noto_Sans_JP, Open_Sans } from "next/font/google";
import type { Locale } from "@/config/i18n";
import { Header } from "./header";
import { Footer } from "./footer";
import "@/app/globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

/** html/body を含むサイト全体の骨格。ロケールごとのルートレイアウトから使う */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${notoSansJp.variable} ${openSans.variable} h-full`}>
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
