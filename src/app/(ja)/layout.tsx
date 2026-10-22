import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${company.nameJa} | ${site.tagline}`,
    template: `%s | ${company.nameJa}`,
  },
  description: site.description,
  openGraph: { type: "website", locale: site.locale, siteName: company.nameJa },
  alternates: { canonical: "/", languages: { ja: "/", en: "/en" } },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="ja">{children}</SiteShell>;
}
