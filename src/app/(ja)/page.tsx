import Link from "next/link";
import { businesses, pillars } from "@/config/businesses";
import { site } from "@/config/site";
import { getWorks } from "@/lib/content/works";
import { getLatestPosts } from "@/lib/content/blog";
import { getLatestNews } from "@/lib/content/news";
import { formatDate } from "@/lib/format";
import { Hero } from "@/components/ui/hero";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Photo } from "@/components/ui/photo";
import { CtaBlock } from "@/components/ui/cta-block";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { BusinessMap } from "@/components/home/business-map";
import { AiToolsGrid } from "@/components/home/ai-tools-grid";
import { NewsList } from "@/components/home/news-list";
import { Figures } from "@/components/home/figures";

export default async function HomePage() {
  const [works, posts, news] = await Promise.all([
    getWorks({ limit: 3 }),
    getLatestPosts({ limit: 6 }),
    getLatestNews(5),
  ]);

  return (
    <>
      {/* 1. ヒーロー（3D演出は Phase 6 で追加。現在は写真＋タイポグラフィ） */}
      <Hero
        size="tall"
        photoId="office-working"
        title={
          <span className="block text-[2.5rem] leading-[1.2] md:text-[3.5rem]">
            {site.taglineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        }
        tagline={site.taglineSub}
        lead={site.mission}
        actions={
          <>
            <LinkButton href="/ai" size="lg">
              まずは無料で診断する
            </LinkButton>
            <LinkButton href="/business" variant="outline-light" size="lg">
              事業を見る
            </LinkButton>
          </>
        }
      />

      {/* 2. ミッション／5事業の関係図 */}
      <SectionBar label="私たちの考え方" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading
            title="つくる。伝える。育てる。そして、自ら実践する。"
            lead="Webと建物という事業の器をつくり、SNSで届け、経営を伸ばす。その戦略を、自社の飲食店で日々検証しています。4つの働きがひとつの会社の中でつながっているから、提案は机上の空論で終わりません。"
          />
          <BusinessMap />
        </div>
      </Section>

      {/* 3. 事業紹介 */}
      <SectionBar label="事業" color="black" />
      <Section>
        <div className="container-max">
          <SectionHeading
            title="5つの事業"
            lead="それぞれが独立したサービスとして機能しながら、ひとつのグループとして連携します。"
          />
          <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link href={b.href} className="group block">
                  <Photo
                    id={b.keyVisualId}
                    fill
                    className="rounded-brand aspect-[3/2]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                  />
                  <p className="mt-5 text-xs font-bold" style={{ color: `var(${b.colorVar})` }}>
                    {pillars[b.pillar].ja}
                    <span className="font-display text-ink-3 ml-2 font-semibold">{pillars[b.pillar].en}</span>
                  </p>
                  <h3 className="group-hover:text-link mt-1.5 text-xl font-bold">{b.nameJa}</h3>
                  <p className="text-ink-2 mt-2 text-[0.9375rem] leading-[1.8]">{b.description}</p>
                  <span className="link-arrow text-link mt-3">詳しくはこちら →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. AIツール導線（最重要CTA） */}
      <SectionBar label="無料で試せる診断ツール" color="link" />
      <Section surface="tint">
        <div className="container-max">
          <SectionHeading
            title="まずは無料で診断する"
            lead="商談の前に、いまの課題を把握してみませんか。AIが対話しながら整理し、その場で結果をお渡しします。結果はそのまま商談予約に引き継げます。"
            action={
              <LinkButton href="/ai" variant="text">
                AIツール一覧
              </LinkButton>
            }
          />
          <AiToolsGrid />
          <p className="text-ink-3 mt-6 text-xs">
            ※
            診断結果はAIによる参考情報であり、正式な提案・見積もりではありません。個人情報は入力しないでください。
          </p>
        </div>
      </Section>

      {/* 5. 実績ハイライト */}
      <SectionBar label="実績・事例" />
      <Section>
        <div className="container-max">
          <SectionHeading
            title="実績・事例"
            align="left"
            action={
              <LinkButton href="/works" variant="text">
                すべての実績を見る
              </LinkButton>
            }
          />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {works.map((w) => (
              <li key={w.slug}>
                <Card
                  title={w.title}
                  description={w.summary}
                  href={`/works/${w.slug}`}
                  photoId={w.photoId}
                  isDummy={w.isDummy}
                  meta={
                    <>
                      <span className="text-ink-2 font-bold">{w.client}</span>
                      <span>｜</span>
                      <span>{w.industry}</span>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 6. 数値（実データがある場合のみ） */}
      <Figures />

      {/* 7. ブログ最新記事 */}
      <SectionBar label="ブログ" color="black" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading
            title="最新の記事"
            align="left"
            action={
              <LinkButton href="/blog" variant="text">
                ブログ一覧
              </LinkButton>
            }
          />
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Card
                  title={p.title}
                  description={p.description}
                  href={`/blog/${p.slug}`}
                  linkLabel="記事を読む"
                  isDummy={p.isDummy}
                  meta={
                    <>
                      <span className="text-ink-2 font-bold">{p.category}</span>
                      <span>｜</span>
                      <span>読了 {p.readingTime}分</span>
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 8. ニュース */}
      <Section>
        <div className="container-max">
          <SectionHeading
            title="ニュース"
            align="left"
            action={
              <LinkButton href="/news" variant="text">
                ニュース一覧
              </LinkButton>
            }
          />
          <NewsList items={news} />
          <p className="text-ink-3 mt-3 text-right text-xs">
            最終更新{" "}
            <time dateTime={news[0]?.publishedAt}>{news[0] ? formatDate(news[0].publishedAt) : "—"}</time>
          </p>
        </div>
      </Section>

      {/* 9. 採用バナー */}
      <section className="bg-black text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="px-gutter order-2 flex flex-col justify-center py-14 lg:order-1 lg:px-16 lg:py-20">
            <p className="text-accent text-sm font-bold">採用情報</p>
            <h2 className="mt-3 text-2xl md:text-3xl">
              つくる人も、伝える人も、育てる人も。
              <br />
              ひとつの会社で働く。
            </h2>
            <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.9] text-white/85">
              Webエンジニア、SNSディレクター、コンサルタント、施工管理、店舗スタッフ。職種は違っても、地域の事業者を支えるという目的は同じです。
            </p>
            <div className="mt-8 flex items-center gap-3">
              <LinkButton href="/recruit">採用情報を見る</LinkButton>
              <DummyBadge label="DUMMY COPY" />
            </div>
          </div>
          <div className="relative order-1 min-h-[16rem] lg:order-2 lg:min-h-[24rem]">
            <Photo
              id="recruit-hero"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section>

      {/* 10. お問い合わせCTA */}
      <CtaBlock photoId="office-interior" />
    </>
  );
}
