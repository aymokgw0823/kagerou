/**
 * ニュースリポジトリ（content/news/*.mdx）。
 */
import { loadCollection, type Doc } from "./fs";
import { newsFrontmatter, type NewsFrontmatter } from "./schema";
import type { News, NewsSummary } from "./types";

function toSummary(d: Doc<NewsFrontmatter>): NewsSummary {
  const f = d.frontmatter;
  return {
    slug: f.slug,
    title: f.title,
    category: f.category,
    publishedAt: f.publishedAt,
    pdf: f.pdf,
    isDummy: f.isDummy,
  };
}

function docs(): Doc<NewsFrontmatter>[] {
  return loadCollection("news", newsFrontmatter).sort((a, b) =>
    a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1,
  );
}

export async function getLatestNews(limit?: number): Promise<NewsSummary[]> {
  const list = docs().map(toSummary);
  return limit ? list.slice(0, limit) : list;
}

export async function getNewsItem(slug: string): Promise<News | undefined> {
  const d = docs().find((x) => x.frontmatter.slug === slug);
  return d ? { ...toSummary(d), body: d.body } : undefined;
}

/** 年別アーカイブ（新しい年から） */
export async function getNewsYears(): Promise<{ year: string; count: number }[]> {
  const m = new Map<string, number>();
  for (const d of docs()) {
    const y = d.frontmatter.publishedAt.slice(0, 4);
    m.set(y, (m.get(y) ?? 0) + 1);
  }
  return [...m].map(([year, count]) => ({ year, count })).sort((a, b) => (a.year < b.year ? 1 : -1));
}

export async function getNewsByYear(year: string): Promise<NewsSummary[]> {
  return docs()
    .map(toSummary)
    .filter((n) => n.publishedAt.startsWith(year));
}
