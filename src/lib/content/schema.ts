/**
 * frontmatter の zod スキーマ。content/ 配下の各ファイルはここで検証される。
 */
import { z } from "zod";
import { allCategories, challenges, industries, levels, regions, budgets, relatedToolIds } from "./taxonomy";

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 形式");

export const blogFrontmatter = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(20).max(200),
  publishedAt: dateStr,
  updatedAt: dateStr,
  business: z.enum(["build", "dining", "cross"]),
  category: z.string().refine((c) => allCategories.includes(c), "taxonomy.ts にないカテゴリー"),
  tags: z.array(z.string()).min(1).max(8),
  industry: z.enum(industries),
  challenge: z.enum(challenges),
  level: z.enum(levels.map((l) => l.id) as [string, ...string[]]),
  budget: z.enum(budgets).optional(),
  region: z.enum(regions).optional(),
  author: z.string(),
  supervisor: z.string().optional(),
  heroImage: z.string(),
  relatedTools: z.array(z.enum(relatedToolIds)).default([]),
  /** 記事冒頭の「この記事の要点」（3〜5件） */
  keyPoints: z.array(z.string()).min(2).max(6),
  isDummy: z.boolean().default(false),
});
export type BlogFrontmatter = z.infer<typeof blogFrontmatter>;

export const authorFrontmatter = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  /** 執筆者か監修者か */
  kind: z.enum(["author", "supervisor"]),
  /** 保有資格（事実が確定するまで【要差し替え】可） */
  qualifications: z.array(z.string()).default([]),
  photoId: z.string().optional(),
  isDummy: z.boolean().default(false),
});
export type AuthorFrontmatter = z.infer<typeof authorFrontmatter>;

export const workFrontmatter = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** 表示用の顧客名（匿名の場合「都内 飲食店 A様」など） */
  client: z.string(),
  anonymous: z.boolean().default(true),
  business: z.enum(["build", "dining"]),
  industry: z.enum(industries),
  challenge: z.enum(challenges),
  region: z.enum(regions),
  publishedAt: dateStr,
  /** 工期・期間（例：約6週間） */
  duration: z.string().optional(),
  /** 概算費用レンジ（任意。未確定は【要差し替え】） */
  budget: z.string().optional(),
  /** 建設：部位（リフォーム相談の類似事例マッチングに使う） */
  parts: z.array(z.enum(["外壁", "屋根", "水回り", "内装", "外構", "設備", "その他"])).default([]),
  photoId: z.string(),
  beforeId: z.string().optional(),
  afterId: z.string().optional(),
  summary: z.string().min(20).max(160),
  isDummy: z.boolean().default(false),
});
export type WorkFrontmatter = z.infer<typeof workFrontmatter>;

export const newsCategories = ["お知らせ", "プレスリリース", "メディア掲載", "採用"] as const;
export const newsFrontmatter = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(newsCategories),
  publishedAt: dateStr,
  /** プレスリリースのPDF添付（public 配下のパス） */
  pdf: z.string().optional(),
  isDummy: z.boolean().default(false),
});
export type NewsFrontmatter = z.infer<typeof newsFrontmatter>;
