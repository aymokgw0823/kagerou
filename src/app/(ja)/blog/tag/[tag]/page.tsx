import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/content/blog";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { BlogExplorer } from "@/components/blog/blog-explorer";

export async function generateStaticParams() {
  return (await getAllTags()).map((t) => ({ tag: t.tag }));
}

export async function generateMetadata({ params }: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  return { title: `#${name} の記事一覧`, description: `タグ「${name}」が付いた記事の一覧です。` };
}

export default async function TagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  const [posts, tags] = await Promise.all([getPostsByTag(name), getAllTags()]);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHeader
        title={`#${name}`}
        titleEn="Tag"
        lead={`タグ「${name}」が付いた記事の一覧です。`}
        crumbs={[{ label: "ブログ", href: "/blog" }, { label: `#${name}` }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <Suspense fallback={<p className="text-ink-3 py-20 text-center">読み込み中…</p>}>
            <BlogExplorer posts={posts} tags={tags} locked={{ tag: name }} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
