import type { Metadata } from "next";
import { ceoMessage } from "@/content/about";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Hero } from "@/components/ui/hero";
import { Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { CtaBlock } from "@/components/ui/cta-block";

export const metadata: Metadata = {
  title: "代表メッセージ",
  description: ceoMessage.headline,
};

export default function MessagePage() {
  return (
    <>
      <Hero eyebrow="Message" title="代表メッセージ" photoId="ceo-at-work" />
      <Breadcrumbs items={[{ label: "会社について", href: "/about" }, { label: "代表メッセージ" }]} />
      <Section>
        <div className="container-max grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Photo
              id="ceo-portrait"
              className="rounded-brand lg:sticky lg:top-24"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </div>
          <article className="lg:col-span-8">
            <h2 className="text-2xl leading-[1.5] md:text-[2rem]">{ceoMessage.headline}</h2>
            <DummyBadge show={ceoMessage.isDummy} label="DUMMY TEXT" className="mt-3" />
            <div className="prose-corp mt-10">
              {ceoMessage.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-12 text-right">
              <span className="text-ink-2 text-sm">{ceoMessage.signature.title}</span>
              <br />
              <span className="text-2xl font-bold">
                <Placeholder value={ceoMessage.signature.name} />
              </span>
            </p>
          </article>
        </div>
      </Section>
      <CtaBlock photoId="office-interior" />
    </>
  );
}
