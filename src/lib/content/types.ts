/**
 * コンテンツ取得層の公開型。ページ・コンポーネントはこの型だけに依存する。
 */
import type { BusinessId } from "@/config/businesses";
import type { ContentBusiness, Level } from "./taxonomy";
import type { Heading } from "./fs";
import type { BlogFrontmatter, WorkFrontmatter, NewsFrontmatter, AuthorFrontmatter } from "./schema";

export type { ContentBusiness, Level };

/** 一覧・カード用の軽量サマリー（クライアントに渡す） */
export type BlogSummary = {
  slug: string;
  title: string;
  description: string;
  business: ContentBusiness;
  category: string;
  tags: string[];
  industry: string;
  challenge: string;
  level: Level;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  photoId: string;
  author: string;
  supervisor?: string;
  /** 閲覧数（インターフェースのみ。未計測なら undefined） */
  views?: number;
  isDummy: boolean;
};

export type BlogPost = BlogSummary & {
  frontmatter: BlogFrontmatter;
  body: string;
  plain: string;
  headings: Heading[];
  keyPoints: string[];
  relatedTools: string[];
};

export type Author = AuthorFrontmatter & { bio: string };

export type WorkSummary = {
  slug: string;
  title: string;
  client: string;
  anonymous: boolean;
  business: BusinessId;
  industry: string;
  challenge: string;
  region: string;
  publishedAt: string;
  photoId: string;
  summary: string;
  parts: string[];
  isDummy: boolean;
};

export type Work = WorkSummary & { frontmatter: WorkFrontmatter; body: string };

export type NewsCategory = NewsFrontmatter["category"];

export type NewsSummary = {
  slug: string;
  title: string;
  category: NewsCategory;
  publishedAt: string;
  pdf?: string;
  isDummy: boolean;
};

export type News = NewsSummary & { body: string };

export type JobSummary = {
  slug: string;
  title: string;
  business: BusinessId;
  employmentType: string;
  location: string;
  isDummy: boolean;
};
