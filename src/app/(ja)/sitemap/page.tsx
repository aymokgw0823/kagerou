import type { Metadata } from "next";
import Link from "next/link";
import { footerNav, policyNav } from "@/config/site";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "サイトマップ" };

export default function SitemapPage() {
  const groups = [...footerNav, { heading: "ポリシー", items: [...policyNav] }];
  return (
    <>
      <PageHeader title="サイトマップ" titleEn="Sitemap" crumbs={[{ label: "サイトマップ" }]} />
      <Section>
        <div className="container-max grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((g) => (
            <div key={g.heading}>
              <h2 className="border-accent border-l-4 pl-3 text-lg font-bold">{g.heading}</h2>
              <ul className="mt-4 space-y-2">
                {g.items.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      className="text-ink-2 hover:text-link text-[0.9375rem] hover:underline hover:underline-offset-4"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
