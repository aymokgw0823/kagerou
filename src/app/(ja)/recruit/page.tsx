import type { Metadata } from "next";
import Link from "next/link";
import { recruit } from "@/content/recruit";
import { getJobs } from "@/lib/content/jobs";
import { getBusiness } from "@/config/businesses";
import { Hero } from "@/components/ui/hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";

export const metadata: Metadata = { title: "採用情報", description: recruit.hero.lead };

export default async function RecruitPage() {
  const jobs = await getJobs();
  return (
    <>
      <Hero
        eyebrow="Careers"
        title={recruit.hero.headline}
        lead={recruit.hero.lead}
        photoId="recruit-hero"
        size="tall"
        actions={
          <>
            <LinkButton href="/recruit/jobs" size="lg">
              募集職種を見る
            </LinkButton>
            <LinkButton href="/recruit/entry" variant="outline-light" size="lg">
              エントリー
            </LinkButton>
          </>
        }
      />
      <Breadcrumbs items={[{ label: "採用情報" }]} />

      <Section>
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label-caps font-display">Message</p>
            <h2 className="mt-2 text-3xl">
              {recruit.message.title} <DummyBadge show={recruit.isDummy} />
            </h2>
          </div>
          <div className="prose-corp lg:col-span-7">
            {recruit.message.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <SectionBar label="働く環境" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading title="働く環境" />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {recruit.environment.map((e) => (
              <li key={e.title} className="card p-6">
                <h3 className="text-lg font-bold">{e.title}</h3>
                <p className="text-ink-2 mt-2 text-sm leading-[1.8]">
                  <Placeholder value={e.description} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <SectionBar label="社員インタビュー" color="black" />
      <Section>
        <div className="container-max space-y-12">
          {recruit.interviews.map((iv, i) => (
            <article
              key={iv.name}
              className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="lg:col-span-5">
                <Photo
                  id={iv.photoId}
                  fill
                  className="rounded-brand aspect-[3/2]"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="lg:col-span-7 lg:px-6">
                <p className="text-ink-3 text-xs font-bold">
                  {iv.role}｜{iv.name} <DummyBadge show={iv.isDummy} />
                </p>
                <h3 className="mt-2 text-2xl leading-[1.5]">{iv.headline}</h3>
                <p className="text-ink-2 mt-4 leading-[1.9]">{iv.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <SectionBar label="募集職種" color="link" />
      <Section surface="tint">
        <div className="container-max">
          <SectionHeading
            title="募集職種"
            align="left"
            action={
              <LinkButton href="/recruit/jobs" variant="text">
                募集要項の一覧
              </LinkButton>
            }
          />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => {
              const b = getBusiness(j.business);
              return (
                <li key={j.slug}>
                  <Link
                    href={`/recruit/jobs/${j.slug}`}
                    className="card hover:shadow-card block h-full p-5"
                    style={{ borderLeftColor: `var(${b.colorVar})` }}
                  >
                    <p className="text-xs font-bold" style={{ color: `var(${b.colorVar})` }}>
                      {b.nameJa}事業｜{j.employmentType}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      {j.title} <DummyBadge show={j.isDummy} />
                    </h3>
                    <p className="text-ink-3 mt-1 text-xs">{j.location}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="container-max grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">福利厚生</h2>
            <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recruit.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <span aria-hidden className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                  <Placeholder value={b} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl">選考フロー</h2>
            <ol className="mt-5 space-y-4">
              {recruit.flow.map((f, i) => (
                <li key={f.title} className="flex gap-4">
                  <span className="font-display text-link text-2xl font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold">{f.title}</p>
                    <p className="text-ink-2 text-sm">{f.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <section className="bg-black text-white">
        <div className="container-max flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl">まずは話を聞いてみませんか</h2>
            <p className="mt-2 text-white/80">職場見学やカジュアルな面談も歓迎します。</p>
          </div>
          <div className="flex gap-3">
            <LinkButton href="/recruit/entry" size="lg">
              エントリーする
            </LinkButton>
            <LinkButton href="/contact?business=other" variant="outline-light" size="lg">
              問い合わせる
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
