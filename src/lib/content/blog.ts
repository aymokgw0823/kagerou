/**
 * ブログリポジトリ。Phase 3 で content/blog/*.mdx（300本）に差し替える。
 */
import type { ContentBusiness, BlogSummary } from "./types";

const dummyPosts: BlogSummary[] = [
  {
    slug: "exterior-wall-signs",
    title: "外壁の劣化サイン：塗り替え時期の見極め方",
    description: "チョーキング・ひび割れ・色あせ。写真で確認できる劣化の兆候と、放置した場合のリスク。",
    business: "build",
    category: "リフォームの基礎",
    tags: ["外壁", "塗装"],
    publishedAt: "2026-10-12",
    readingTime: 5,
    photoId: "build-site-wide",
    isDummy: true,
  },
  {
    slug: "restaurant-kitchen-layout",
    title: "飲食店の厨房レイアウト、営んでみて分かった5つのこと",
    description: "図面では気づけない動線と収納の話を、自社店舗の運営経験から整理します。",
    business: "cross",
    category: "店舗づくり",
    tags: ["厨房", "動線"],
    publishedAt: "2026-10-05",
    readingTime: 6,
    photoId: "dining-interior",
    isDummy: true,
  },
  {
    slug: "water-area-reform-cost",
    title: "水回りリフォームの費用相場と、見積もりの見方",
    description: "キッチン・浴室・トイレ・洗面。工事ごとの費用の内訳と、相見積もりで確認したい点。",
    business: "build",
    category: "費用と見積もり",
    tags: ["水回り", "費用"],
    publishedAt: "2026-09-28",
    readingTime: 7,
    photoId: "build-after",
    isDummy: true,
  },
  {
    slug: "menu-engineering",
    title: "メニュー構成を見直して利益率を上げる考え方",
    description: "自社店舗で実践しているメニューの組み立て方と、原価の見方を紹介します。",
    business: "dining",
    category: "店舗運営",
    tags: ["メニュー", "原価"],
    publishedAt: "2026-09-20",
    readingTime: 6,
    photoId: "dining-food-01",
    isDummy: true,
  },
  {
    slug: "inuki-checkpoints",
    title: "居抜き物件で店を開くときに確認したい設備のチェックリスト",
    description: "厨房設備・給排気・電気容量・防水。契約前に見ておきたいポイントを建設と飲食の両方の視点で。",
    business: "cross",
    category: "開業準備",
    tags: ["居抜き", "開業"],
    publishedAt: "2026-09-10",
    readingTime: 6,
    photoId: "build-before",
    isDummy: true,
  },
  {
    slug: "roof-leak-first-steps",
    title: "雨漏りに気づいたら、最初にやること",
    description: "応急処置と、やってはいけないこと。原因の見つけ方と、専門家に相談するタイミング。",
    business: "build",
    category: "メンテナンス",
    tags: ["屋根", "雨漏り"],
    publishedAt: "2026-09-01",
    readingTime: 5,
    photoId: "kv-build",
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
