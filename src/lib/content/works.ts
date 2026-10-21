/**
 * 実績・事例リポジトリ（content/works/*.mdx）。
 */
import type { BusinessId } from "@/config/businesses";
import { loadCollection, type Doc } from "./fs";
import { workFrontmatter, type WorkFrontmatter } from "./schema";
import type { Work, WorkSummary } from "./types";

function toSummary(d: Doc<WorkFrontmatter>): WorkSummary {
  const f = d.frontmatter;
  return {
    slug: f.slug,
    title: f.title,
    client: f.client,
    anonymous: f.anonymous,
    business: f.business,
    industry: f.industry,
    challenge: f.challenge,
    region: f.region,
    publishedAt: f.publishedAt,
    photoId: f.photoId,
    summary: f.summary,
    parts: f.parts,
    isDummy: f.isDummy,
  };
}

function docs(): Doc<WorkFrontmatter>[] {
  return loadCollection("works", workFrontmatter).sort((a, b) =>
    a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1,
  );
}

export async function getWorks(opts: { business?: BusinessId; limit?: number } = {}): Promise<WorkSummary[]> {
  let list = docs().map(toSummary);
  if (opts.business) list = list.filter((w) => w.business === opts.business);
  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}

export async function getWork(slug: string): Promise<Work | undefined> {
  const d = docs().find((x) => x.frontmatter.slug === slug);
  return d ? { ...toSummary(d), frontmatter: d.frontmatter, body: d.body } : undefined;
}

/** 部位が近い建設事例（AIリフォーム相談の類似事例に使う） */
export async function getWorksByParts(parts: string[], limit = 3): Promise<WorkSummary[]> {
  const set = new Set(parts);
  return docs()
    .map(toSummary)
    .filter((w) => w.business === "build")
    .map((w) => ({ w, score: w.parts.filter((p) => set.has(p)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.w);
}
