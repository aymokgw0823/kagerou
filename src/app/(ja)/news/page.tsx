import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getLatestNews, getNewsYears } from "@/lib/content/news";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { NewsFilter } from "@/components/news/news-filter";

export const metadata: Metadata = {
  title: "ニュース",
  description: "お知らせ、プレスリリース、メディア掲載、採用に関するニュース。",
};

export default async function NewsPage() {
  const [items, years] = await Promise.all([getLatestNews(), getNewsYears()]);
  return (
    <>
      <PageHeader title="ニュース" titleEn="News" crumbs={[{ label: "ニュース" }]} />
      <Section spacing="sm">
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <Suspense fallback={null}>
              <NewsFilter items={items} />
            </Suspense>
          </div>
          <aside className="lg:col-span-3">
            <p className="mb-3 text-sm font-bold">年別アーカイブ</p>
            <ul className="space-y-1.5">
              {years.map((y) => (
                <li key={y.year}>
                  <Link
                    href={`/news/archive/${y.year}`}
                    className="text-ink-2 hover:text-link text-sm hover:underline"
                  >
                    {y.year}年 <span className="font-display text-ink-3">({y.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
