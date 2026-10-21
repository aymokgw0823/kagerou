import type { Metadata } from "next";
import Link from "next/link";
import { businesses, businessBrandName, pillars } from "@/config/businesses";
import { Hero } from "@/components/ui/hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { CtaBlock } from "@/components/ui/cta-block";
import { BusinessMap } from "@/components/home/business-map";

export const metadata: Metadata = {
  title: "事業一覧",
  description:
    "Web開発受託・SNS運用代行・経営コンサルティング・建設・飲食の5事業。つくる・伝える・育てる＋自ら実践する、の関係図。",
};

export default function BusinessIndexPage() {
  return (
    <>
      <Hero
        eyebrow="What we do"
        title="5つの事業"
        lead="それぞれが独立したサービスブランドとして機能しながら、ひとつのグループとして連携する。それが私たちの事業の形です。"
        photoId="kv-consulting"
      />
      <Breadcrumbs items={[{ label: "事業一覧" }]} />

      <SectionBar label="事業の関係図" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading
            title="つくる・伝える・育てる、そして実践する"
            lead="3つの働きを、自社の飲食事業で日々検証する。その構造が、私たちの提案の説得力の源泉です。"
          />
          <BusinessMap />
        </div>
      </Section>

      <SectionBar label="事業紹介" color="black" />
      <Section>
        <div className="container-max space-y-16">
          {businesses.map((b, i) => (
            <article
              key={b.id}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <Link href={b.href} className="group block lg:col-span-6">
                <Photo
                  id={b.keyVisualId}
                  fill
                  className="rounded-brand aspect-[16/10]"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                />
              </Link>
              <div className="lg:col-span-6 lg:px-6">
                <p className="text-xs font-bold" style={{ color: `var(${b.colorVar})` }}>
                  {pillars[b.pillar].ja}{" "}
                  <span className="font-display text-ink-3 ml-1">{pillars[b.pillar].en}</span>
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl">
                  {b.nameJa}
                  <span className="font-display text-ink-3 mt-1 block text-base">
                    <Placeholder value={businessBrandName(b)} />
                  </span>
                </h2>
                <p className="mt-3 text-lg font-bold">{b.tagline}</p>
                <p className="text-ink-2 mt-3 leading-[1.9]">{b.description}</p>
                <Link href={b.href} className="link-arrow text-link mt-5">
                  {b.nameJa}の詳細 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <CtaBlock photoId="office-working" />
    </>
  );
}
