import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsByYear, getNewsYears } from "@/lib/content/news";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { NewsList } from "@/components/home/news-list";

export async function generateStaticParams() {
  return (await getNewsYears()).map((y) => ({ year: y.year }));
}

export async function generateMetadata({ params }: PageProps<"/news/archive/[year]">): Promise<Metadata> {
  const { year } = await params;
  return { title: `${year}年のニュース` };
}

export default async function NewsYearPage({ params }: PageProps<"/news/archive/[year]">) {
  const { year } = await params;
  const [items, years] = await Promise.all([getNewsByYear(year), getNewsYears()]);
  if (items.length === 0) notFound();
  return (
    <>
      <PageHeader
        title={`${year}年のニュース`}
        titleEn="News Archive"
        crumbs={[{ label: "ニュース", href: "/news" }, { label: `${year}年` }]}
      />
      <Section spacing="sm">
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <NewsList items={items} />
          </div>
          <aside className="lg:col-span-3">
            <p className="mb-3 text-sm font-bold">年別アーカイブ</p>
            <ul className="space-y-1.5">
              {years.map((y) => (
                <li key={y.year}>
                  <Link
                    href={`/news/archive/${y.year}`}
                    aria-current={y.year === year ? "page" : undefined}
                    className={
                      y.year === year
                        ? "text-sm font-bold"
                        : "text-ink-2 hover:text-link text-sm hover:underline"
                    }
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
