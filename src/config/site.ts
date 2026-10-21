/**
 * サイト全体の設定（URL、ナビゲーション、タグライン）。
 * 会社情報そのものは company.ts に置く。
 */
import { businesses } from "./businesses";

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "つくる。営む。",
  taglineLines: ["つくる。", "営む。"] as const,
  taglineSub: "場をつくる手と、場を営む目を、一社に。",
  mission: "地域の「場」を、つくるところから営むところまで、一社で担う。",
  description:
    "建設事業と飲食事業を展開する会社。店舗・住宅・オフィスをつくり、自ら飲食店を営む。場をつくる手と、場を営む目を一社に持つことが、私たちの提案の根拠です。",
  locale: "ja_JP",
  /* English */
  taglineEn: "Build. Run.",
  taglineLinesEn: ["Build.", "Run."] as const,
  taglineSubEn: "Hands that build the place, eyes that run it — in one company.",
  missionEn: "We take on the whole life of a place in our community, from building it to running it.",
  descriptionEn:
    "A company with two businesses: construction and dining. We build shops, homes and offices, and we run our own restaurants — so we know how a place is used from both sides.",
} as const;

export type NavItem = {
  label: string;
  labelEn?: string;
  href: string;
  children?: { label: string; description?: string; href: string }[];
};

/** グローバルナビ */
export const mainNav: NavItem[] = [
  { label: "会社について", labelEn: "About", href: "/about" },
  {
    label: "事業",
    labelEn: "Business",
    href: "/business",
    children: businesses.map((b) => ({ label: b.nameJa, description: b.tagline, href: b.href })),
  },
  { label: "実績", labelEn: "Works", href: "/works" },
  { label: "リフォーム相談（AI）", labelEn: "AI Reform", href: "/ai/reform" },
  { label: "ブログ", labelEn: "Blog", href: "/blog" },
  { label: "ニュース", labelEn: "News", href: "/news" },
  { label: "採用", labelEn: "Recruit", href: "/recruit" },
];

/** ヘッダー右側の CTA */
export const headerCtas = {
  contact: { label: "お問い合わせ", href: "/contact" },
  booking: { label: "ご相談予約", href: "/booking" },
} as const;

/** フッターのサイトマップ */
export const footerNav: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "会社について",
    items: [
      { label: "会社について", href: "/about" },
      { label: "代表メッセージ", href: "/about/message" },
      { label: "ニュース", href: "/news" },
      { label: "採用情報", href: "/recruit" },
    ],
  },
  {
    heading: "事業",
    items: [
      { label: "事業一覧", href: "/business" },
      ...businesses.map((b) => ({ label: b.nameJa, href: b.href })),
    ],
  },
  {
    heading: "ご相談",
    items: [
      { label: "写真でリフォーム相談（AI）", href: "/ai/reform" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "ご相談予約", href: "/booking" },
    ],
  },
  {
    heading: "情報",
    items: [
      { label: "実績・事例", href: "/works" },
      { label: "ブログ", href: "/blog" },
      { label: "サイトマップ", href: "/sitemap" },
    ],
  },
];

/** ポリシー類（フッター下段） */
export const policyNav = [
  { label: "プライバシーポリシー", href: "/policy/privacy" },
  { label: "反社会的勢力排除に関する基本方針", href: "/policy/antisocial" },
  { label: "情報セキュリティ基本方針", href: "/policy/security" },
  { label: "AI利用ポリシー", href: "/policy/ai" },
  { label: "Cookieポリシー", href: "/policy/cookie" },
] as const;
