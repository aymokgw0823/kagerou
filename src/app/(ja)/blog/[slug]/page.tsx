import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { getAdjacentPosts, getAllPosts, getPost, getRelatedPosts } from "@/lib/content/blog";
import { getAuthor } from "@/lib/content/authors";
import { businessLabel, levelLabel } from "@/lib/content/taxonomy";
import { Mdx } from "@/lib/content/mdx";
import { formatDateJa } from "@/lib/format";
import { absoluteUrl } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Photo } from "@/components/ui/photo";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { Section } from "@/components/ui/section";
import { Toc } from "@/components/blog/toc";
import { ShareButtons } from "@/components/blog/share-buttons";
import { AuthorCard } from "@/components/blog/author-card";
import { PostCard } from "@/components/blog/post-card";
import { PostCta } from "@/components/blog/post-cta";
import { CtaBlock } from "@/components/ui/cta-block";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const [author, supervisor, related, adjacent] = await Promise.all([
    getAuthor(post.author),
    post.supervisor ? getAuthor(post.supervisor) : undefined,
    getRelatedPosts(post, 3),
    getAdjacentPosts(post.slug),
  ]);
  const url = absoluteUrl(`/blog/${post.slug}`, site.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: url,
    author: author
      ? { "@type": "Person", name: author.name, url: absoluteUrl(`/blog/author/${author.id}`, site.url) }
      : undefined,
    publisher: { "@type": "Organization", name: company.nameJa, url: site.url },
    keywords: post.tags.join(","),
    articleSection: post.category,
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "ブログ", href: "/blog" },
          { label: post.category, href: `/blog/category/${encodeURIComponent(post.category)}` },
          { label: post.title },
        ]}
      />
      <article>
        <header className="container-max pt-4 pb-10 md:pb-14">
          <div className="max-w-4xl">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold">
              <span className="text-link">{businessLabel(post.business)}</span>
              <span className="text-ink-3">｜</span>
              <Link
                href={`/blog/category/${encodeURIComponent(post.category)}`}
                className="text-ink-2 hover:text-link hover:underline"
              >
                {post.category}
              </Link>
              <span className="text-ink-3">｜</span>
              <span className="text-ink-3">{levelLabel(post.level)}</span>
              <DummyBadge show={post.isDummy} />
            </p>
            <h1 className="mt-4 text-3xl leading-[1.4] md:text-[2.5rem]">{post.title}</h1>
            <p className="text-ink-2 mt-5 text-[0.9375rem] leading-[1.9]">{post.description}</p>
            <dl className="text-ink-3 mt-6 flex flex-wrap gap-x-6 gap-y-1 text-xs">
              <div className="flex gap-2">
                <dt>公開</dt>
                <dd>
                  <time dateTime={post.publishedAt}>{formatDateJa(post.publishedAt)}</time>
                </dd>
              </div>
              {post.updatedAt !== post.publishedAt && (
                <div className="flex gap-2">
                  <dt>更新</dt>
                  <dd>
                    <time dateTime={post.updatedAt}>{formatDateJa(post.updatedAt)}</time>
                  </dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt>読了時間</dt>
                <dd>約{post.readingTime}分</dd>
              </div>
              {author && (
                <div className="flex gap-2">
                  <dt>執筆</dt>
                  <dd>{author.name}</dd>
                </div>
              )}
              {supervisor && (
                <div className="flex gap-2">
                  <dt>監修</dt>
                  <dd>{supervisor.name}</dd>
                </div>
              )}
            </dl>
          </div>
          <Photo
            id={post.photoId}
            fill
            priority
            className="rounded-brand mt-8 aspect-[21/9] w-full"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </header>

        <div className="container-max grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            {/* 要点 */}
            <section
              aria-labelledby="keypoints"
              className="rounded-brand border-accent bg-paper-2 border-l-4 p-6"
            >
              <h2 id="keypoints" className="text-ink-3 text-sm font-bold tracking-wider uppercase">
                この記事の要点
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-[1.8]">
                {post.keyPoints.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </section>

            {/* スマホ向け目次 */}
            <details className="rounded-brand border-line mt-6 border p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-bold">目次</summary>
              <div className="mt-3">
                <Toc headings={post.headings} />
              </div>
            </details>

            <div className="prose-corp mt-10">
              <Mdx source={post.body} />
            </div>

            <div className="border-line mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
              <ul className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <li key={t}>
                    <Link
                      href={`/blog/tag/${encodeURIComponent(t)}`}
                      className="rounded-pill border-line text-ink-2 hover:border-ink hover:text-ink border px-3 py-1 text-xs font-bold"
                    >
                      #{t}
                    </Link>
                  </li>
                ))}
              </ul>
              <ShareButtons url={url} title={post.title} />
            </div>

            <div className="mt-10">
              <PostCta business={post.business} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {author && <AuthorCard author={author} role="執筆" />}
              {supervisor && <AuthorCard author={supervisor} role="監修" />}
            </div>

            {/* 前後の記事 */}
            <nav
              aria-label="前後の記事"
              className="border-line mt-10 grid grid-cols-1 gap-4 border-t pt-6 md:grid-cols-2"
            >
              {adjacent.prev ? (
                <Link
                  href={`/blog/${adjacent.prev.slug}`}
                  className="group rounded-brand border-line hover:border-ink border p-4"
                >
                  <span className="text-ink-3 text-xs">← 前の記事</span>
                  <span className="group-hover:text-link mt-1 block text-sm font-bold">
                    {adjacent.prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {adjacent.next && (
                <Link
                  href={`/blog/${adjacent.next.slug}`}
                  className="group rounded-brand border-line hover:border-ink border p-4 text-right"
                >
                  <span className="text-ink-3 text-xs">次の記事 →</span>
                  <span className="group-hover:text-link mt-1 block text-sm font-bold">
                    {adjacent.next.title}
                  </span>
                </Link>
              )}
            </nav>
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 space-y-8">
              <Toc headings={post.headings} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <Section surface="paper-2" spacing="sm" className="mt-16">
          <div className="container-max">
            <h2 className="mb-6 text-2xl">関連する記事</h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
      <CtaBlock photoId={post.business === "dining" ? "dining-interior" : "build-site-wide"} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
