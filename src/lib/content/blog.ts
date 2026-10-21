/**
 * ブログリポジトリ（content/blog/*.mdx）。
 */
import { loadCollection, type Doc } from "./fs";
import { blogFrontmatter, type BlogFrontmatter } from "./schema";
import type { BlogPost, BlogSummary, ContentBusiness } from "./types";

function toSummary(d: Doc<BlogFrontmatter>): BlogSummary {
  const f = d.frontmatter;
  return {
    slug: f.slug,
    title: f.title,
    description: f.description,
    business: f.business,
    category: f.category,
    tags: f.tags,
    industry: f.industry,
    challenge: f.challenge,
    level: f.level as BlogSummary["level"],
    publishedAt: f.publishedAt,
    updatedAt: f.updatedAt,
    readingTime: d.readingTime,
    photoId: f.heroImage,
    author: f.author,
    supervisor: f.supervisor,
    isDummy: f.isDummy,
  };
}

function toPost(d: Doc<BlogFrontmatter>): BlogPost {
  return {
    ...toSummary(d),
    frontmatter: d.frontmatter,
    body: d.body,
    plain: d.plain,
    headings: d.headings,
    keyPoints: d.frontmatter.keyPoints,
    relatedTools: d.frontmatter.relatedTools,
  };
}

function docs(): Doc<BlogFrontmatter>[] {
  return loadCollection("blog", blogFrontmatter).sort((a, b) =>
    a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1,
  );
}

/** 新着順の全記事サマリー */
export async function getAllPosts(): Promise<BlogSummary[]> {
  return docs().map(toSummary);
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const d = docs().find((x) => x.frontmatter.slug === slug);
  return d ? toPost(d) : undefined;
}

export async function getLatestPosts(
  opts: { business?: ContentBusiness; limit?: number } = {},
): Promise<BlogSummary[]> {
  let list = docs().map(toSummary);
  if (opts.business) list = list.filter((p) => p.business === opts.business || p.business === "cross");
  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}

export async function getPostsByCategory(category: string): Promise<BlogSummary[]> {
  return docs()
    .map(toSummary)
    .filter((p) => p.category === category);
}

export async function getPostsByTag(tag: string): Promise<BlogSummary[]> {
  return docs()
    .map(toSummary)
    .filter((p) => p.tags.includes(tag));
}

export async function getPostsByAuthor(id: string): Promise<BlogSummary[]> {
  return docs()
    .map(toSummary)
    .filter((p) => p.author === id || p.supervisor === id);
}

/** 使われている全タグ（件数つき・多い順） */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const m = new Map<string, number>();
  for (const d of docs()) for (const t of d.frontmatter.tags) m.set(t, (m.get(t) ?? 0) + 1);
  return [...m]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ja"));
}

/** 使われている全カテゴリー（件数つき） */
export async function getAllCategoriesInUse(): Promise<{ category: string; count: number }[]> {
  const m = new Map<string, number>();
  for (const d of docs()) m.set(d.frontmatter.category, (m.get(d.frontmatter.category) ?? 0) + 1);
  return [...m].map(([category, count]) => ({ category, count }));
}

/** 関連記事：タグの重なり・事業・カテゴリーでスコアリング */
export async function getRelatedPosts(post: BlogSummary, limit = 4): Promise<BlogSummary[]> {
  const tagSet = new Set(post.tags);
  return docs()
    .map(toSummary)
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      for (const t of p.tags) if (tagSet.has(t)) score += 2;
      if (p.business === post.business) score += 3;
      if (p.category === post.category) score += 2;
      if (p.challenge === post.challenge) score += 1;
      if (p.industry === post.industry) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.publishedAt < b.p.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.p);
}

/** 前後の記事（新着順で隣接） */
export async function getAdjacentPosts(slug: string): Promise<{ prev?: BlogSummary; next?: BlogSummary }> {
  const list = docs().map(toSummary);
  const i = list.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  // list は新着順：next = より新しい、prev = より古い
  return { next: list[i - 1], prev: list[i + 1] };
}
