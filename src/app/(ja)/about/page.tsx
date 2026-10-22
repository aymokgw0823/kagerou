import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/config/company";
import { aboutSections, ceoMessage, vision } from "@/content/about";
import { Hero } from "@/components/ui/hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { CtaBlock } from "@/components/ui/cta-block";
import { CompanyTable } from "@/components/about/company-table";
import { AccessMap } from "@/components/about/access-map";

export const metadata: Metadata = {
  title: "会社について",
  description: "トップメッセージ、ビジョン・ミッション・バリュー、会社概要、役員紹介、沿革、アクセス。",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="Who we are"
        title="会社について"
        lead="地域の事業者の「つくる・伝える・育てる」を、一社でまるごと担う。私たちの考え方と、会社の基本情報をご紹介します。"
        photoId="office-exterior"
      />
      <Breadcrumbs items={[{ label: "会社について" }]} />

      {/* ページ内ナビ */}
      <nav aria-label="ページ内ナビゲーション" className="border-line border-b">
        <ul className="container-max scrollbar-none scroll-fade-x flex gap-x-6 overflow-x-auto py-3 text-sm font-bold whitespace-nowrap md:[mask-image:none]">
          {aboutSections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-ink-2 hover:text-link inline-block py-1">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* トップメッセージ */}
      <Section id="message">
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Photo id="ceo-portrait" className="rounded-brand" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="label-caps font-display mb-4">Message</p>
            <h2 className="text-2xl leading-[1.5] md:text-3xl">{ceoMessage.headline}</h2>
            <p className="text-ink-2 mt-6 leading-[1.9]">{ceoMessage.paragraphs[0]}</p>
            <p className="mt-6 text-sm">
              {ceoMessage.signature.title}　
              <span className="text-lg font-bold">
                <Placeholder value={ceoMessage.signature.name} />
              </span>
              <DummyBadge show={ceoMessage.isDummy} className="ml-3" />
            </p>
            <div className="mt-8">
              <LinkButton href="/about/message" variant="text">
                メッセージ全文を読む
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      {/* ビジョン・ミッション・バリュー */}
      <SectionBar label="ビジョン・ミッション・バリュー" id="vision" />
      <Section surface="paper-2">
        <div className="container-max">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[vision.vision, vision.mission].map((v) => (
              <div key={v.label} className="card p-8">
                <p className="label-caps font-display">{v.labelEn}</p>
                <p className="text-ink-2 mt-1 text-sm font-bold">{v.label}</p>
                <p className="mt-4 text-xl leading-[1.6] font-bold md:text-2xl">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="label-caps font-display">{vision.values.labelEn}</p>
            <p className="text-ink-2 mt-1 text-sm font-bold">{vision.values.label}</p>
            <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vision.values.items.map((v, i) => (
                <li key={v.title} className="card p-6">
                  <p className="font-display text-ink-3 text-sm font-bold">0{i + 1}</p>
                  <h3 className="mt-2 text-lg font-bold">{v.title}</h3>
                  <p className="text-ink-2 mt-2 text-sm leading-[1.8]">{v.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 会社概要 */}
      <Section id="overview">
        <div className="container-max">
          <SectionHeading title="会社概要" align="left" />
          <CompanyTable />
        </div>
      </Section>

      {/* 役員紹介 */}
      <SectionBar label="役員紹介" id="officers" color="black" />
      <Section surface="paper-2">
        <div className="container-max">
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {company.officers.map((o, i) => (
              <li key={i} className="card overflow-hidden">
                {o.photoId && (
                  <Photo
                    id={o.photoId}
                    fill
                    className="aspect-square w-full"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                )}
                <div className="p-6">
                  <p className="text-ink-3 text-xs font-bold">{o.title}</p>
                  <p className="mt-1 text-xl font-bold">
                    <Placeholder value={o.name} /> <DummyBadge show={o.isDummy} />
                  </p>
                  {o.bio && <p className="text-ink-2 mt-3 text-sm leading-[1.8]">{o.bio}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 沿革 */}
      <Section id="history">
        <div className="container-max">
          <SectionHeading title="沿革" align="left" />
          <ol className="border-accent relative border-l-2 pl-8">
            {company.history.map((h, i) => (
              <li key={i} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden
                  className="border-accent bg-paper absolute top-1.5 -left-[2.4rem] h-3 w-3 rounded-full border-2"
                />
                <p className="font-display text-ink-3 text-sm font-bold">
                  <Placeholder value={h.date} /> <DummyBadge show={h.isDummy} />
                </p>
                <p className="mt-1 text-lg">{h.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* アクセス */}
      <SectionBar label="アクセス" id="access" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading title="アクセス" align="left" />
          <AccessMap />
          <p className="mt-6 text-sm">
            <Link href="/contact" className="link-underline">
              お問い合わせはこちら
            </Link>
          </p>
        </div>
      </Section>

      <CtaBlock photoId="office-interior" />
    </>
  );
}
