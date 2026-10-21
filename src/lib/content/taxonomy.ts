/**
 * コンテンツ（ブログ・実績）の分類の唯一の正。
 * 記事の frontmatter、ファセットフィルター、ダミー記事生成スクリプトがすべてここを参照する。
 */
import type { BusinessId } from "@/config/businesses";

export type ContentBusiness = BusinessId | "cross";

export const contentBusinesses: { id: ContentBusiness; label: string }[] = [
  { id: "build", label: "建設" },
  { id: "dining", label: "飲食" },
  { id: "cross", label: "店舗づくり（建設×飲食）" },
];

/** カテゴリー（事業ごとに3〜5個） */
export const categories: Record<ContentBusiness, string[]> = {
  build: ["外壁・屋根", "水回り", "内装・リノベーション", "店舗・オフィス工事", "費用・補助金"],
  dining: ["店舗運営", "メニュー・原価", "衛生・設備", "採用・育成", "開業準備"],
  cross: ["店舗づくり", "居抜き・物件", "開業の進め方"],
};

export const allCategories = Object.values(categories).flat();

/** 対象業種 */
export const industries = [
  "住宅（個人）",
  "飲食",
  "小売",
  "美容",
  "医療・福祉",
  "士業・オフィス",
  "不動産オーナー",
] as const;
export type Industry = (typeof industries)[number];

/** 課題 */
export const challenges = [
  "劣化・修繕",
  "費用を抑えたい",
  "開業・出店",
  "集客・売上",
  "業務効率化",
  "採用・定着",
  "資金・補助金",
] as const;
export type Challenge = (typeof challenges)[number];

export const levels = [
  { id: "beginner", label: "はじめて" },
  { id: "intermediate", label: "基礎を知っている" },
  { id: "advanced", label: "実務者向け" },
] as const;
export type Level = (typeof levels)[number]["id"];

/** 想定予算レンジ（任意） */
export const budgets = ["〜30万円", "30〜100万円", "100〜300万円", "300〜1,000万円", "1,000万円〜"] as const;

/** 地域（任意） */
export const regions = ["東京都", "神奈川県", "埼玉県", "千葉県"] as const;

/** 関連AIツール */
export const relatedToolIds = ["reform"] as const;
export type RelatedToolId = (typeof relatedToolIds)[number];

export function businessLabel(id: ContentBusiness): string {
  return contentBusinesses.find((b) => b.id === id)?.label ?? id;
}

export function levelLabel(id: Level): string {
  return levels.find((l) => l.id === id)?.label ?? id;
}
