/**
 * ブログの検索インデックス（public/search-index.json）をビルド時に生成する。
 *   npm run build:search-index
 * クライアントはキーワード検索を始めたときだけこの JSON を取得する（AIコンシェルジュの RAG でも同じインデックスを使う）。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadCollection } from "../src/lib/content/fs";
import { blogFrontmatter } from "../src/lib/content/schema";
import { workFrontmatter } from "../src/lib/content/schema";

const ROOT = join(import.meta.dirname, "..");
const BODY_LIMIT = 2500;

export type IndexEntry = {
  type: "blog" | "work";
  slug: string;
  url: string;
  title: string;
  description: string;
  body: string;
  business: string;
  category?: string;
  tags?: string[];
  publishedAt: string;
};

export function buildIndex(): IndexEntry[] {
  const posts = loadCollection("blog", blogFrontmatter).map<IndexEntry>((d) => ({
    type: "blog",
    slug: d.frontmatter.slug,
    url: `/blog/${d.frontmatter.slug}`,
    title: d.frontmatter.title,
    description: d.frontmatter.description,
    body: d.plain.slice(0, BODY_LIMIT),
    business: d.frontmatter.business,
    category: d.frontmatter.category,
    tags: d.frontmatter.tags,
    publishedAt: d.frontmatter.publishedAt,
  }));
  const works = loadCollection("works", workFrontmatter).map<IndexEntry>((d) => ({
    type: "work",
    slug: d.frontmatter.slug,
    url: `/works/${d.frontmatter.slug}`,
    title: d.frontmatter.title,
    description: d.frontmatter.summary,
    body: d.plain.slice(0, BODY_LIMIT),
    business: d.frontmatter.business,
    publishedAt: d.frontmatter.publishedAt,
  }));
  return [...posts, ...works];
}

function main() {
  const index = buildIndex();
  const outDir = join(ROOT, "public");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "search-index.json");
  const json = JSON.stringify(index);
  writeFileSync(out, json, "utf8");
  console.log(
    `search-index: ${index.length} entries, ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB → ${out}`,
  );
}

main();
