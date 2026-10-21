import type { Metadata } from "next";
import type { ReactNode } from "react";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${company.nameEn} | Create. Convey. Grow.`,
    template: `%s | ${company.nameEn}`,
  },
  description: site.descriptionEn,
  openGraph: { type: "website", locale: "en_US", siteName: company.nameEn },
};

export default function RootLayoutEn({ children }: { children: ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
