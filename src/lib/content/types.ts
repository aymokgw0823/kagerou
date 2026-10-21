/**
 * コンテンツ取得層の型。Phase 3 で MDX / CMS 実装に差し替えるが、インターフェースは維持する。
 */
import type { BusinessId } from "@/config/businesses";

export type ContentBusiness = BusinessId | "cross";

export type WorkSummary = {
  slug: string;
  title: string;
  /** 匿名表示（例：都内 飲食店 A社様） */
  client: string;
  anonymous: boolean;
  business: BusinessId;
  industry: string;
  challenge: string;
  region: string;
  publishedAt: string;
  /** photo-manifest の id */
  photoId: string;
  summary: string;
  isDummy: boolean;
};

export type BlogSummary = {
  slug: string;
  title: string;
  description: string;
  business: ContentBusiness;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  photoId: string;
  isDummy: boolean;
};

export type NewsCategory = "お知らせ" | "プレスリリース" | "メディア掲載" | "採用";

export type NewsSummary = {
  slug: string;
  title: string;
  category: NewsCategory;
  publishedAt: string;
  isDummy: boolean;
};

export type JobSummary = {
  slug: string;
  title: string;
  business: BusinessId;
  employmentType: string;
  location: string;
  isDummy: boolean;
};
