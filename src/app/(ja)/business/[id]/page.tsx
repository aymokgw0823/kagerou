import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  businesses,
  businessBrandName,
  getBusiness,
  otherBusiness,
  pillars,
  type BusinessId,
} from "@/config/businesses";
import { company } from "@/config/company";
import { getAiToolsForBusiness } from "@/config/ai-tools";
import { getBusinessDetail } from "@/content/business";
import type { BusinessExtra } from "@/content/business/types";
import { getWorks } from "@/lib/content/works";
import { getLatestPosts } from "@/lib/content/blog";
import { Hero } from "@/components/ui/hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { Faq } from "@/components/ui/faq";
import { CtaBlock } from "@/components/ui/cta-block";
import { BeforeAfter } from "@/components/business/before-after";
import { StoreCard } from "@/components/business/store-card";
import { cn } from "@/lib/utils";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";

const ids = businesses.map((b) => b.id);
function isBusinessId(v: string): v is BusinessId {
  return (ids as string[]).includes(v);
}

export function generateStaticParams() {
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/business/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isBusinessId(id)) return {};
  const b = getBusiness(id);
  const d = getBusinessDetail(id);
  return { title: `${b.nameJa}｜${d.hero.headline}`, description: d.hero.lead };
}

/** 事業固有セクション */
function ExtraSection({ extra }: { extra: BusinessExtra }) {
  switch (extra.kind) {
    case "build":
      return (
        <>
          <SectionBar label="施工エリア・施工事例" color="biz" colorVar="--color-biz-build" />
          <Section surface="tint">
            <div className="container-max">
              <SectionHeading title="施工エリア" align="left" />
              <ul className="flex flex-wrap gap-2">
                {extra.serviceAreas.map((a, i) => (
                  <li
                    key={i}
                    className="rounded-pill border-line bg-paper border px-4 py-1.5 text-sm font-bold"
                  >
                    <Placeholder value={a} />
                  </li>
                ))}
              </ul>
              <SectionHeading
                title="施工事例ギャラリー"
                lead="スライダーを左右に動かすと、施工前後を比較できます。"
                align="left"
                className="mt-16"
              />
              <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {extra.gallery.map((g) => (
                  <li key={g.title}>
                    <BeforeAfter beforeId={g.beforeId} afterId={g.afterId} title={g.title} />
                    <p className="text-ink-2 mt-1 text-sm">
                      {g.description} <DummyBadge show={g.isDummy} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </>
      );
    case "dining":
      return (
        <>
          <SectionBar label="店舗・メニュー" color="biz" colorVar="--color-biz-dining" />
          <Section surface="tint">
            <div className="container-max">
              <SectionHeading title="店舗のご案内" align="left" />
              <ul className={cn("grid grid-cols-1 gap-8", extra.stores.length > 1 && "lg:grid-cols-2")}>
                {extra.stores.map((s) => (
                  <li key={s.name}>
                    <StoreCard store={s} variant="full" />
                  </li>
                ))}
              </ul>
              {extra.stores.some((s) => s.galleryIds?.length) && (
                <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                  {extra.stores
                    .flatMap((s) => s.galleryIds ?? [])
                    .map((pid) => (
                      <li key={pid}>
                        <Photo id={pid} fill className="rounded-brand aspect-[3/2] w-full" sizes="(min-width: 768px) 33vw, 50vw" />
                      </li>
                    ))}
                </ul>
              )}
              <SectionHeading title="お品書き（抜粋）" align="left" className="mt-16" />
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {extra.menu.map((m) => (
                  <li key={m.name} className="card overflow-hidden">
                    {m.photoId && (
                      <Photo
                        id={m.photoId}
                        fill
                        className="aspect-square w-full"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                      />
                    )}
                    <div className="p-5">
                      {m.category && <p className="text-ink-3 text-xs font-bold">{m.category}</p>}
                      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="font-bold">{m.name}</h3>
                        <span className="font-display text-sm font-bold whitespace-nowrap">{m.price}</span>
                      </div>
                      {m.description && <p className="text-ink-2 mt-1 text-sm">{m.description}</p>}
                      <DummyBadge show={m.isDummy} className="mt-2" />
                    </div>
                  </li>
                ))}
              </ul>
              {extra.menuNote && <p className="text-ink-3 mt-6 text-sm">{extra.menuNote}</p>}
            </div>
          </Section>
        </>
      );
  }
}

export default async function BusinessPage({ params }: PageProps<"/business/[id]">) {
  const { id } = await params;
  if (!isBusinessId(id)) notFound();
  const b = getBusiness(id);
  const d = getBusinessDetail(id);
  const tools = getAiToolsForBusiness(id);
  const [works, posts] = await Promise.all([
    getWorks({ business: id, limit: 3 }),
    getLatestPosts({ business: id, limit: 3 }),
  ]);
  const license = company.licenses.find((l) => l.business === id);

  return (
    <>
      <Hero
        tintVar={b.colorVar}
        eyebrow={
          <span className="inline-flex flex-wrap items-center gap-3">
            <span className="font-display">
              <Placeholder value={businessBrandName(b)} />
            </span>
            <span className="text-white/60">｜</span>
            <span>{pillars[b.pillar].ja}</span>
          </span>
        }
        title={d.hero.headline}
        tagline={b.tagline !== d.hero.headline ? b.tagline : undefined}
        lead={d.hero.lead}
        photoId={d.hero.photoId}
        actions={
          <>
            <LinkButton href="/contact">お問い合わせ</LinkButton>
            {tools[0] && (
              <LinkButton href={tools[0].href} variant="outline-light">
                {tools[0].name}を試す
              </LinkButton>
            )}
          </>
        }
      />
      {license && id === "build" && (
        <div className="bg-biz-build text-white">
          <div className="container-max flex flex-wrap items-center gap-x-6 gap-y-1 py-3 text-sm">
            <span className="font-bold">{license.label}</span>
            <span className="font-display">
              <Placeholder value={license.number} />
            </span>
          </div>
        </div>
      )}
      <Breadcrumbs items={[{ label: "事業一覧", href: "/business" }, { label: b.nameJa }]} />

      {/* 2. 課題提起 */}
      <Section>
        <div className="container-max">
          <SectionHeading title="こんなお悩みはありませんか" />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {d.problems.map((p) => (
              <li key={p} className="rounded-brand bg-paper-2 flex gap-3 p-5 text-[0.9375rem] font-bold">
                <span
                  aria-hidden
                  className="mt-1 inline-block h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${b.colorVar})` }}
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 3. 提供サービス */}
      <SectionBar label="提供サービス" color="biz" colorVar={b.colorVar} />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading title="提供サービス" />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {d.services.map((s) => (
              <li key={s.title}>
                <Card title={s.title} description={s.description} accentVar={b.colorVar} />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. 選ばれる理由 */}
      <Section>
        <div className="container-max">
          <SectionHeading
            title="選ばれる理由"
            lead={`${otherBusiness(id).nameJa}事業を自社で営んでいることが、${b.nameJa}事業の提案の根拠になっています。`}
          />
          <ol className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {d.reasons.map((r, i) => (
              <li key={r.title} className="border-t-4 pt-5" style={{ borderColor: `var(${b.colorVar})` }}>
                <p className="font-display text-ink-3 text-sm font-bold">0{i + 1}</p>
                <h3 className="mt-2 text-xl font-bold">{r.title}</h3>
                <p className="text-ink-2 mt-3 text-[0.9375rem] leading-[1.8]">{r.description}</p>
                {r.synergy && r.synergy.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {r.synergy.map((sid) => {
                      const sb = getBusiness(sid);
                      return (
                        <li key={sid}>
                          <Link
                            href={sb.href}
                            className="rounded-pill hover:bg-paper-2 inline-flex items-center border px-3 py-1 text-xs font-bold"
                            style={{ borderColor: `var(${sb.colorVar})`, color: `var(${sb.colorVar})` }}
                          >
                            {sb.nameJa}と連携
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5. 進め方 */}
      <SectionBar label="進め方" color="black" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading title="進め方" />
          <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {d.flow.map((f, i) => (
              <li key={f.title} className="card relative p-6">
                <span className="font-display text-3xl font-bold" style={{ color: `var(${b.colorVar})` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-bold">{f.title}</h3>
                <p className="text-ink-2 mt-2 text-sm leading-[1.8]">{f.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 6. 料金の目安 */}
      <Section>
        <div className="container-max">
          <SectionHeading
            title="料金の目安"
            lead="内容・規模により変動します。まずはお気軽にご相談ください。"
          />
          <table className="table-stack w-full border-collapse text-[0.9375rem]">
            <thead>
              <tr className="border-ink border-b-2 text-left text-sm">
                <th className="py-3 pr-4 font-bold">プラン</th>
                <th className="py-3 pr-4 font-bold">料金</th>
                <th className="py-3 font-bold">含まれる内容・条件</th>
              </tr>
            </thead>
            <tbody>
              {d.pricing.map((p) => (
                <tr key={p.plan} className="border-line border-b align-top">
                  <td className="py-4 pr-4 font-bold max-sm:text-base">{p.plan}</td>
                  <td className="font-display py-4 pr-4 font-bold whitespace-nowrap" data-label="料金">
                    <Placeholder value={p.price} />
                  </td>
                  <td className="text-ink-2 py-4 max-sm:text-sm" data-label="含まれる内容・条件">
                    {p.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {d.pricingNote && <p className="text-ink-3 mt-4 text-xs">{d.pricingNote}</p>}
        </div>
      </Section>

      {/* 事業固有 */}
      <ExtraSection extra={d.extra} />

      {/* 7. 関連する実績 */}
      {works.length > 0 && (
        <Section>
          <div className="container-max">
            <SectionHeading
              title="関連する実績"
              align="left"
              action={
                <LinkButton href={`/works?business=${id}`} variant="text">
                  {b.nameJa}の実績をすべて見る
                </LinkButton>
              }
            />
            <ul className="rail md:grid md:grid-cols-3 md:gap-6">
              {works.map((w) => (
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

      {/* 8. 関連AIツール */}
      {tools.length > 0 && (
        <section className="bg-black text-white">
          <div className="container-max grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-accent-light text-sm font-bold">無料のAIツール</p>
              <h2 className="mt-2 text-2xl md:text-3xl">{tools[0].name}</h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.9] text-white/85">
                {tools[0].description}
              </p>
              <p className="mt-2 text-xs text-white/60">
                所要時間 {tools[0].duration}
                。結果はAIによる参考情報であり、正式な提案・見積もりではありません。
              </p>
            </div>
            <div className="flex gap-3 lg:col-span-5 lg:justify-end [&>a]:w-full sm:[&>a]:w-auto">
              <LinkButton href={tools[0].href} size="lg">
                無料で試す
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      {tools.length === 0 && d.extra.kind === "dining" && d.extra.stores[0] && (
        <section className="bg-black text-white">
          <div className="container-max grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-accent-light text-sm font-bold">ご来店・ご予約</p>
              <h2 className="mt-2 text-2xl md:text-3xl">店にお越しいただくことが、一番の近道です。</h2>
              <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.9] text-white/85">
                {d.extra.stores[0].name}（{d.extra.stores[0].hours}・定休日 {d.extra.stores[0].closed}）。営業時間内はご予約なしでもお入りいただけます。個室や団体でのご利用は、お電話または Web でご予約ください。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
              {d.extra.stores[0].tel && (
                <LinkButton href={`tel:${d.extra.stores[0].tel.replace(/[^\d+]/g, "")}`} size="lg" variant="outline-light">
                  {d.extra.stores[0].tel}
                </LinkButton>
              )}
              {d.extra.stores[0].reservationUrl && (
                <LinkButton href={d.extra.stores[0].reservationUrl} size="lg" target="_blank" rel="noopener">
                  Web 予約
                </LinkButton>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 9. 関連ブログ */}
      {posts.length > 0 && (
        <Section surface="paper-2">
          <div className="container-max">
            <SectionHeading
              title="関連する記事"
              align="left"
              action={
                <LinkButton href={`/blog?business=${id}`} variant="text">
                  記事をもっと見る
                </LinkButton>
              }
            />
            <ul className="rail md:grid md:grid-cols-3 md:gap-6">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Card
                    title={p.title}
                    description={p.description}
                    href={`/blog/${p.slug}`}
                    linkLabel="記事を読む"
                    isDummy={p.isDummy}
                    accentVar={b.colorVar}
                    meta={<span className="text-ink-2 font-bold">{p.category}</span>}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* 10. FAQ */}
      <Section>
        <div className="container-narrow">
          <Faq items={d.faq} />
        </div>
      </Section>

      {/* 11. CTA */}
      <CtaBlock photoId={b.keyVisualId} />
      {d.extra.kind === "dining" ? (
        <LocalBusinessJsonLd kind="dining" stores={d.extra.stores} />
      ) : (
        <LocalBusinessJsonLd kind="build" serviceAreas={d.extra.serviceAreas} />
      )}
    </>
  );
}
