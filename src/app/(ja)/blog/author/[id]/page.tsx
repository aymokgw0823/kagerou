import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthor, getAuthors } from "@/lib/content/authors";
import { getPostsByAuthor } from "@/lib/content/blog";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { PostCard } from "@/components/blog/post-card";

export async function generateStaticParams() {
  return (await getAuthors()).map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/blog/author/[id]">): Promise<Metadata> {
  const { id } = await params;
  const a = await getAuthor(id);
  return a
    ? { title: `${a.name}（${a.kind === "author" ? "執筆" : "監修"}）`, description: a.bio.slice(0, 100) }
    : {};
}

export default async function AuthorPage({ params }: PageProps<"/blog/author/[id]">) {
  const { id } = await params;
  const author = await getAuthor(id);
  if (!author) notFound();
  const posts = await getPostsByAuthor(id);
  const roleLabel = author.kind === "author" ? "執筆者" : "監修者";
  return (
    <>
      <PageHeader
        title={author.name}
        titleEn={roleLabel === "執筆者" ? "Author" : "Supervisor"}
        crumbs={[{ label: "ブログ", href: "/blog" }, { label: author.name }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <div className="card flex flex-col gap-6 p-6 md:flex-row md:p-8">
            {author.photoId && (
              <Photo id={author.photoId} fill className="h-28 w-28 shrink-0 rounded-full" sizes="112px" />
            )}
            <div>
              <p className="text-ink-3 text-xs font-bold">
                {roleLabel} <DummyBadge show={author.isDummy} />
              </p>
              <p className="text-ink-2 text-sm">{author.role}</p>
              {author.qualifications.length > 0 && (
                <p className="mt-2 text-sm">
                  {author.qualifications.map((q, i) => (
                    <Placeholder key={i} value={q} className="mr-3" />
                  ))}
                </p>
              )}
              <p className="text-ink-2 mt-4 text-[0.9375rem] leading-[1.9]">{author.bio}</p>
            </div>
          </div>
          <h2 className="mt-14 mb-6 text-2xl">
            {roleLabel === "執筆者" ? "執筆した記事" : "監修した記事"}{" "}
            <span className="font-display text-ink-3 text-base">{posts.length}</span>
          </h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 24).map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
