import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/content/blog";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { BlogExplorer } from "@/components/blog/blog-explorer";

export const metadata: Metadata = {
  title: "ブログ",
  description:
    "外壁・屋根・水回りのリフォーム、店舗工事、飲食店の運営・開業準備まで。建設と飲食の現場から、役に立つ情報をお届けします。",
};

export default async function BlogIndexPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  return (
    <>
      <PageHeader
        title="ブログ"
        titleEn="Blog"
        lead="外壁・屋根・水回りのリフォーム、店舗工事、飲食店の運営・開業準備まで。建設と飲食の現場から、役に立つ情報をお届けします。"
        crumbs={[{ label: "ブログ" }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <Suspense fallback={<p className="text-ink-3 py-20 text-center">読み込み中…</p>}>
            <BlogExplorer posts={posts} tags={tags} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
