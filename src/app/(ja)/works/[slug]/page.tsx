import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBusiness } from "@/config/businesses";
import { getWork, getWorks } from "@/lib/content/works";
import { Mdx } from "@/lib/content/mdx";
import { formatDateJa } from "@/lib/format";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";
import { Card } from "@/components/ui/card";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";
import { CtaBlock } from "@/components/ui/cta-block";
import { BeforeAfter } from "@/components/business/before-after";

export async function generateStaticParams() {
  return (await getWorks()).map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = await getWork(slug);
  return w ? { title: `${w.title}｜実績・事例`, description: w.summary } : {};
}

export default async function WorkPage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) notFound();
  const b = getBusiness(work.business);
  const related = (await getWorks({ business: work.business }))
    .filter((w) => w.slug !== work.slug)
    .slice(0, 3);
  const f = work.frontmatter;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "お客様", value: work.client },
    { label: "事業", value: b.nameJa },
    { label: "業種", value: work.industry },
    { label: "課題", value: work.challenge },
    { label: "地域", value: work.region },
    ...(f.duration ? [{ label: "期間", value: f.duration }] : []),
    ...(f.budget ? [{ label: "費用の目安", value: <Placeholder value={f.budget} /> }] : []),
    ...(work.parts.length ? [{ label: "部位", value: work.parts.join("・") }] : []),
    { label: "公開日", value: formatDateJa(work.publishedAt) },
  ];
  return (
    <>
      <Breadcrumbs items={[{ label: "実績・事例", href: "/works" }, { label: work.title }]} />
      <article className="container-max pt-4">
        <p className="text-xs font-bold" style={{ color: `var(${b.colorVar})` }}>
          {b.nameJa}事業 <DummyBadge show={work.isDummy} />
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl leading-[1.4] md:text-[2.5rem]">{work.title}</h1>
        <p className="text-ink-2 mt-4 max-w-3xl text-[0.9375rem] leading-[1.9]">{work.summary}</p>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {f.beforeId && f.afterId ? (
              <BeforeAfter beforeId={f.beforeId} afterId={f.afterId} title={work.title} />
            ) : (
              <Photo
                id={work.photoId}
                fill
                priority
                className="rounded-brand aspect-[16/10] w-full"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            )}
          </div>
          <dl className="card self-start p-6 lg:col-span-4">
            {rows.map((r) => (
              <div
                key={r.label}
                className="border-line grid grid-cols-[5.5rem_1fr] gap-2 border-b py-2.5 text-sm last:border-0"
              >
                <dt className="text-ink-2 font-bold">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="prose-corp mt-12 max-w-3xl">
          <Mdx source={work.body} />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton href="/contact">同じような相談をする</LinkButton>
          <LinkButton href={b.href} variant="outline">
            {b.nameJa}事業について
          </LinkButton>
        </div>
      </article>
      {related.length > 0 && (
        <Section surface="paper-2" spacing="sm" className="mt-16">
          <div className="container-max">
            <h2 className="mb-6 text-2xl">{b.nameJa}事業のほかの事例</h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {related.map((w) => (
                <li key={w.slug}>
                  <Card
                    title={w.title}
                    description={w.summary}
                    href={`/works/${w.slug}`}
                    photoId={w.photoId}
                    isDummy={w.isDummy}
                    accentVar={b.colorVar}
                    meta={<span className="text-ink-2 font-bold">{w.client}</span>}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
      <CtaBlock photoId={b.keyVisualId} />
    </>
  );
}
