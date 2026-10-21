import type { Metadata } from "next";
import { Hero } from "@/components/ui/hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { CompanyTable } from "@/components/about/company-table";
import { AccessMap } from "@/components/about/access-map";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "About us", description: site.descriptionEn };

export default function AboutPageEn() {
  return (
    <>
      <Hero
        eyebrow="Who we are"
        title={<span className="font-display font-semibold">About us</span>}
        lead={site.missionEn}
        photoId="office-exterior"
      />
      <Section>
        <div className="container-max">
          <SectionHeading
            title={<span className="font-display font-semibold">Company overview</span>}
            align="left"
          />
          <CompanyTable locale="en" />
        </div>
      </Section>
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading title={<span className="font-display font-semibold">Location</span>} align="left" />
          <AccessMap />
        </div>
      </Section>
    </>
  );
}
