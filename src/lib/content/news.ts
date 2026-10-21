/**
 * ニュースリポジトリ。Phase 3 で content/news/*.mdx に差し替える。
 */
import type { NewsSummary } from "./types";

const dummyNews: NewsSummary[] = [
  {
    slug: "site-launch",
    title: "コーポレートサイトを公開しました",
    category: "お知らせ",
    publishedAt: "2026-10-01",
    isDummy: true,
  },
  {
    slug: "ai-reform-release",
    title: "写真でリフォーム相談ができるAIサービスの提供を開始",
    category: "プレスリリース",
    publishedAt: "2026-09-24",
    isDummy: true,
  },
  {
    slug: "recruit-2027",
    title: "2027年度 新卒・中途採用の募集を開始しました",
    category: "採用",
    publishedAt: "2026-09-15",
    isDummy: true,
  },
  {
    slug: "media-interview",
    title: "地域経済誌に代表のインタビューが掲載されました",
    category: "メディア掲載",
    publishedAt: "2026-08-30",
    isDummy: true,
  },
  {
    slug: "summer-holiday",
    title: "夏季休業のお知らせ",
    category: "お知らせ",
    publishedAt: "2026-08-01",
    isDummy: true,
  },
  {
    slug: "build-license",
    title: "建設業許可を取得しました",
    category: "お知らせ",
    publishedAt: "2026-07-15",
    isDummy: true,
  },
  {
    slug: "store-open",
    title: "自社運営の飲食店 2号店をオープンしました",
    category: "プレスリリース",
    publishedAt: "2026-06-20",
    isDummy: true,
  },
  {
    slug: "seminar",
    title: "地域の方向け「店舗づくりと開業準備」相談会を開催します",
    category: "お知らせ",
    publishedAt: "2026-05-10",
    isDummy: true,
  },
  {
    slug: "office-move",
    title: "本社を移転しました",
    category: "お知らせ",
    publishedAt: "2026-04-01",
    isDummy: true,
  },
  {
    slug: "founding",
    title: "会社を設立しました",
    category: "プレスリリース",
    publishedAt: "2026-01-15",
    isDummy: true,
  },
];

export async function getLatestNews(limit?: number): Promise<NewsSummary[]> {
  const list = [...dummyNews].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return limit ? list.slice(0, limit) : list;
}
