import { company } from "@/config/company";
import { site } from "@/config/site";

/** Organization と WebSite の構造化データ（全ページ共通・ルートレイアウトに置く） */
export function SiteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.nameJa,
    alternateName: company.nameEn,
    url: site.url,
    logo: new URL("/opengraph-image", site.url).toString(),
    description: site.description,
    address: {
      "@type": "PostalAddress",
      postalCode: company.address.postalCode,
      addressRegion: company.address.region,
      streetAddress: company.address.street,
      addressCountry: "JP",
    },
    telephone: company.contact.tel,
    email: company.contact.email,
    sameAs: Object.values(company.social).filter(Boolean),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.nameJa,
    url: site.url,
    inLanguage: "ja",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: new URL("/blog?q={search_term_string}", site.url).toString(),
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}

type Store = { name: string; concept: string; address: string; hours: string; closed: string; tel?: string };

/** 飲食店舗（Restaurant）／建設（GeneralContractor）の LocalBusiness */
export function LocalBusinessJsonLd({
  kind,
  stores,
  serviceAreas,
}: {
  kind: "build" | "dining";
  stores?: Store[];
  serviceAreas?: string[];
}) {
  const base = {
    "@context": "https://schema.org",
    url: site.url,
    telephone: company.contact.tel,
    parentOrganization: { "@type": "Organization", name: company.nameJa },
  };
  const items =
    kind === "dining"
      ? (stores ?? []).map((s) => ({
          ...base,
          "@type": "Restaurant",
          name: s.name,
          description: s.concept,
          address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "JP" },
          openingHours: s.hours,
          servesCuisine: "Japanese",
          ...(s.tel ? { telephone: s.tel } : {}),
        }))
      : [
          {
            ...base,
            "@type": "GeneralContractor",
            name: `${company.nameJa} 建設事業`,
            address: {
              "@type": "PostalAddress",
              postalCode: company.address.postalCode,
              addressRegion: company.address.region,
              streetAddress: company.address.street,
              addressCountry: "JP",
            },
            areaServed: (serviceAreas ?? []).map((a) => ({ "@type": "AdministrativeArea", name: a })),
          },
        ];
  return (
    <>
      {items.map((it, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(it) }} />
      ))}
    </>
  );
}
