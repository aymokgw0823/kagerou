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
import { ReformFeature } from "@/components/home/reform-feature";
import { StoreList } from "@/components/home/store-list";
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
      {/* 1. ヒーロー（3D演出は Phase 6 で追加） */}
      <Hero
        size="tall"
        photoId="kv-build"
        title={
          <span className="block text-[3rem] leading-[1.15] md:text-[4.5rem]">
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
            <LinkButton href="/ai/reform" size="lg">
              写真でリフォーム相談（無料）
            </LinkButton>
            <LinkButton href="/business/dining" variant="outline-light" size="lg">
              店舗を見る
            </LinkButton>
          </>
        }
      />

      {/* 2. コンセプト／2事業の関係図 */}
      <SectionBar label="私たちの考え方" />
      <Section surface="paper-2">
        <div className="container-max">
          <SectionHeading
            title="つくる手と、営む目を、一社に。"
            lead="店舗・住宅・オフィスという「場」をつくる建設事業と、自ら飲食店を営む飲食事業。つくる側と使う側の両方を知っているから、図面の段階で使いにくさに気づき、完成後も場を育て続けられます。"
          />
          <BusinessMap />
        </div>
      </Section>

      {/* 3. AI導線（最重要CTA） */}
      <SectionBar label="無料で試せる" color="link" />
      <Section surface="tint">
        <div className="container-max">
          <SectionHeading
            title="まずは、写真で相談してみる"
            lead="現地調査の前に、気になる箇所の写真からおおよその施工内容と費用レンジを把握できます。"
          />
          <ReformFeature />
        </div>
      </Section>

      {/* 4. 店舗案内 */}
      <SectionBar label="店舗案内" color="biz" colorVar="--color-biz-dining" />
      <Section>
        <div className="container-max">
          <SectionHeading
            title="自社で営む店"
            lead="私たちの仕事を知っていただく一番の近道は、店にお越しいただくことです。"
            align="left"
            action={
              <LinkButton href="/business/dining" variant="text">
                飲食事業について
              </LinkButton>
            }
          />
          <StoreList />
        </div>
      </Section>

      {/* 5. 実績ハイライト */}
      <SectionBar label="実績・事例" />
      <Section surface="paper-2">
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
      <Section>
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
      <Section surface="paper-2">
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
              場をつくる人も、場を営む人も。
              <br />
              ひとつの会社で働く。
            </h2>
            <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.9] text-white/85">
              施工管理、職人、設計・積算、店舗のホール・調理スタッフ。仕事は違っても、地域の「場」に関わるという目的は同じです。
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
