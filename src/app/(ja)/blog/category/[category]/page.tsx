import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllCategoriesInUse, getAllTags, getPostsByCategory } from "@/lib/content/blog";
import { allCategories } from "@/lib/content/taxonomy";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { BlogExplorer } from "@/components/blog/blog-explorer";

export async function generateStaticParams() {
  return (await getAllCategoriesInUse()).map((c) => ({ category: c.category }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const name = decodeURIComponent(category);
  return { title: `${name}の記事一覧`, description: `${name}に関する記事の一覧です。` };
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  if (!allCategories.includes(name)) notFound();
  const [posts, tags] = await Promise.all([getPostsByCategory(name), getAllTags()]);
  return (
    <>
      <PageHeader
        title={name}
        titleEn="Category"
        lead={`「${name}」に関する記事の一覧です。`}
        crumbs={[{ label: "ブログ", href: "/blog" }, { label: name }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <Suspense fallback={<p className="text-ink-3 py-20 text-center">読み込み中…</p>}>
            <BlogExplorer posts={posts} tags={tags} locked={{ category: name }} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
