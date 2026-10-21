import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLatestNews, getNewsItem } from "@/lib/content/news";
import { Mdx } from "@/lib/content/mdx";
import { formatDateJa } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section } from "@/components/ui/section";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";

export async function generateStaticParams() {
  return (await getLatestNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsItem(slug);
  return n ? { title: `${n.title}｜ニュース` } : {};
}

export default async function NewsItemPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();
  return (
    <>
      <Breadcrumbs items={[{ label: "ニュース", href: "/news" }, { label: item.title }]} />
      <Section spacing="sm">
        <article className="container-text">
          <p className="text-ink-3 flex items-center gap-3 text-xs">
            <time dateTime={item.publishedAt} className="font-display">
              {formatDateJa(item.publishedAt)}
            </time>
            <span className="rounded-pill border-line text-ink-2 border px-2.5 py-0.5 font-bold">
              {item.category}
            </span>
            <DummyBadge show={item.isDummy} />
          </p>
          <h1 className="mt-4 text-2xl leading-[1.4] md:text-[2rem]">{item.title}</h1>
          <div className="prose-corp mt-8">
            <Mdx source={item.body} />
          </div>
          {item.pdf && (
            <p className="mt-8">
              <a
                href={item.pdf}
                className="btn-base border-ink text-ink hover:bg-ink hover:text-paper"
                download
              >
                プレスリリース（PDF）をダウンロード
              </a>
            </p>
          )}
          <div className="border-line mt-12 flex flex-wrap items-center gap-4 border-t pt-6">
            <LinkButton href="/news" variant="text">
              ニュース一覧へ戻る
            </LinkButton>
            <Link href="/contact" className="text-ink-2 hover:text-link text-sm hover:underline">
              本件に関するお問い合わせ
            </Link>
          </div>
        </article>
      </Section>
    </>
  );
}
