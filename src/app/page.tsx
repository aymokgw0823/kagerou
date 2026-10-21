import { businesses, pillars } from "@/config/businesses";
import { site } from "@/config/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import Link from "next/link";

/**
 * トップページ（Phase 1 の暫定版）。
 * Phase 2 で要件 4.1 に沿った本実装に置き換える。
 */
export default function HomePage() {
  return (
    <>
      <Section className="pt-24 md:pt-40">
        <div className="container-max">
          <p className="label-caps mb-10">Corporate Site</p>
          <h1 className="text-[clamp(2.5rem,8vw,7rem)] leading-[1.15] tracking-[0.02em]">
            {site.taglineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-ink-2 mt-10 max-w-xl text-lg leading-[1.9] md:text-xl">{site.taglineSub}</p>
          <div className="mt-14 flex flex-wrap gap-4">
            <LinkButton href="/ai" variant="solid" size="lg">
              まずは無料で診断する
            </LinkButton>
            <LinkButton href="/business" size="lg">
              事業を見る
            </LinkButton>
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-max">
          <SectionHeading number="01" eyebrow="Business" title="5つの事業" lead={site.mission} />
          <ul className="grid grid-cols-12 gap-x-8 gap-y-16">
            {businesses.map((b) => (
              <li key={b.id} className="col-span-12 md:col-span-6 lg:col-span-4">
                <Link href={b.href} className="group block">
                  <Photo
                    id={b.keyVisualId}
                    className="aspect-[4/3]"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    imgClassName="transition-transform duration-[1.2s] ease-brand group-hover:scale-[1.03]"
                  />
                  <p className="font-display text-ink-3 mt-6 text-sm italic">
                    {pillars[b.pillar].en} <span className="not-italic">／ {pillars[b.pillar].ja}</span>
                  </p>
                  <h3 className="mt-2 text-2xl">{b.nameJa}</h3>
                  <p className="text-ink-2 mt-3 text-sm leading-[1.9]">{b.tagline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
