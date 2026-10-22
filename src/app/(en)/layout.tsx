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
    default: `${company.nameEn} | Create. Convey. Grow.`,
    template: `%s | ${company.nameEn}`,
  },
  description: site.descriptionEn,
  openGraph: { type: "website", locale: "en_US", siteName: company.nameEn },
  alternates: { canonical: "/en", languages: { ja: "/", en: "/en" } },
};

export default function RootLayoutEn({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
