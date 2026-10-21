/**
 * ブログリポジトリ。Phase 3 で content/blog/*.mdx（300本）に差し替える。
 */
import type { ContentBusiness, BlogSummary } from "./types";

const dummyPosts: BlogSummary[] = [
  {
    slug: "website-renewal-checklist",
    title: "Webサイトのリニューアル前に確認したい10のチェックリスト",
    description: "目的の整理からコンテンツの棚卸し、公開後の運用体制まで。失敗しないリニューアルの進め方。",
    business: "digital",
    category: "Web制作の進め方",
    tags: ["リニューアル", "要件定義"],
    publishedAt: "2026-10-12",
    readingTime: 6,
    photoId: "kv-digital",
    isDummy: true,
  },
  {
    slug: "instagram-posting-frequency",
    title: "飲食店のInstagram、投稿頻度はどのくらいが適切か",
    description: "週に何回投稿すべきか、ストーリーズとフィードの使い分けを、運用の現場から整理します。",
    business: "social",
    category: "Instagram運用",
    tags: ["Instagram", "飲食"],
    publishedAt: "2026-10-05",
    readingTime: 5,
    photoId: "kv-social",
    isDummy: true,
  },
  {
    slug: "monthly-pl-basics",
    title: "小規模事業者のための月次損益の見方",
    description: "売上・原価・人件費・家賃。まず押さえるべき数字と、毎月の確認の仕方を解説します。",
    business: "consulting",
    category: "数字の見方",
    tags: ["損益", "経営管理"],
    publishedAt: "2026-09-28",
    readingTime: 7,
    photoId: "kv-consulting",
    isDummy: true,
  },
  {
    slug: "exterior-wall-signs",
    title: "外壁の劣化サイン：塗り替え時期の見極め方",
    description: "チョーキング・ひび割れ・色あせ。写真で確認できる劣化の兆候と、放置した場合のリスク。",
    business: "build",
    category: "リフォームの基礎",
    tags: ["外壁", "塗装"],
    publishedAt: "2026-09-20",
    readingTime: 5,
    photoId: "build-site-wide",
    isDummy: true,
  },
  {
    slug: "menu-engineering",
    title: "メニュー構成を見直して利益率を上げる考え方",
    description: "自社店舗で実践しているメニューエンジニアリングの手順を紹介します。",
    business: "dining",
    category: "店舗運営",
    tags: ["メニュー", "原価"],
    publishedAt: "2026-09-10",
    readingTime: 6,
    photoId: "dining-food-01",
    isDummy: true,
  },
  {
    slug: "web-sns-integration",
    title: "WebサイトとSNSを分断させないための設計",
    description: "SNSからの流入をWebで受け止め、問い合わせにつなげるための導線設計と役割分担。",
    business: "cross",
    category: "事業横断",
    tags: ["導線設計", "SNS"],
    publishedAt: "2026-09-01",
    readingTime: 6,
    photoId: "office-working",
    isDummy: true,
  },
];

export async function getLatestPosts(
  opts: { business?: ContentBusiness; limit?: number } = {},
): Promise<BlogSummary[]> {
  let list = [...dummyPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  if (opts.business) list = list.filter((p) => p.business === opts.business || p.business === "cross");
  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}
