/**
 * サイト全体の設定（URL、ナビゲーション、タグライン）。
 * 会社情報そのものは company.ts に置く。
 */
import { businesses } from "./businesses";

export const site = {
  /** 本番URL（環境変数で上書き可） */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** タグライン（コーポレートメッセージ） */
  tagline: "つくる。伝える。育てる。事業のぜんぶを、一社で。",
  taglineLines: ["つくる。", "伝える。", "育てる。"] as const,
  taglineSub: "事業のぜんぶを、一社で。",
  mission: "地域の事業者の「つくる・伝える・育てる」を、一社でまるごと担う。",
  /** OGP などで使う説明文 */
  description:
    "Web開発・SNS運用代行・経営コンサルティング・建設・飲食の5事業を展開するグループ企業。つくる・伝える・育てるを一社で担い、自らの事業で実践しながら地域の事業者を支えます。",
  locale: "ja_JP",
  /* English */
  taglineEn: "Create. Convey. Grow. Everything your business needs, from one company.",
  taglineLinesEn: ["Create.", "Convey.", "Grow."] as const,
  taglineSubEn: "Everything your business needs, from one company.",
  missionEn:
    "We take on the whole of what local businesses need to create, convey and grow — as one company.",
  descriptionEn:
    "A group company with five businesses: web development, social media management, management consulting, construction and dining. We create, convey and grow — and prove our strategies in our own businesses.",
} as const;

export type NavItem = {
  label: string;
  labelEn?: string;
  href: string;
  /** ドロップダウンの子項目 */
  children?: { label: string; description?: string; href: string }[];
};

/** グローバルナビ */
export const mainNav: NavItem[] = [
  { label: "会社について", labelEn: "About", href: "/about" },
  {
    label: "事業",
    labelEn: "Business",
    href: "/business",
    children: businesses.map((b) => ({
      label: b.nameJa,
      description: b.tagline,
      href: b.href,
    })),
  },
  { label: "実績", labelEn: "Works", href: "/works" },
  { label: "AIツール", labelEn: "AI Tools", href: "/ai" },
  { label: "ブログ", labelEn: "Blog", href: "/blog" },
  { label: "ニュース", labelEn: "News", href: "/news" },
  { label: "採用", labelEn: "Recruit", href: "/recruit" },
];

/** ヘッダー右側の CTA */
export const headerCtas = {
  contact: { label: "お問い合わせ", href: "/contact" },
  booking: { label: "商談予約", href: "/booking" },
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
    heading: "AIツール",
    items: [
      { label: "AIツール一覧", href: "/ai" },
      { label: "AI経営診断", href: "/ai/diagnosis" },
      { label: "Web制作 AI見積もり", href: "/ai/estimate" },
      { label: "SNSアカウント診断", href: "/ai/sns-check" },
      { label: "写真でリフォーム相談", href: "/ai/reform" },
    ],
  },
  {
    heading: "情報",
    items: [
      { label: "実績・事例", href: "/works" },
      { label: "ブログ", href: "/blog" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "商談予約", href: "/booking" },
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
