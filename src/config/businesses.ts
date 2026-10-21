/**
 * 5事業（事業ブランド）の一元管理。
 * コーポレートブランド（company.brandName）の下に 5 つのサービスブランドを置くグループ構造。
 */
import { company } from "./company";

export type BusinessId = "digital" | "social" | "consulting" | "build" | "dining";

/** 「つくる・伝える・育てる・実践する」の軸 */
export type Pillar = "create" | "convey" | "grow" | "practice";

export const pillars: Record<Pillar, { ja: string; en: string; description: string }> = {
  create: { ja: "つくる", en: "Create", description: "デジタルとリアル、事業の器をつくる" },
  convey: { ja: "伝える", en: "Convey", description: "届ける・広げる・ファンをつくる" },
  grow: { ja: "育てる", en: "Grow", description: "事業そのものを伸ばす" },
  practice: {
    ja: "実践する",
    en: "Practice",
    description: "自らも現場を持ち、自らの事業で戦略を検証する",
  },
};

export type Business = {
  id: BusinessId;
  /** 事業ブランドの英語サフィックス（例：Digital） */
  brandSuffix: string;
  /** 事業名（和文・正式） */
  nameJa: string;
  /** 短い和文名（ナビ用） */
  shortJa: string;
  /** 英語名 */
  nameEn: string;
  descriptionEn: string;
  /** 一言コピー */
  tagline: string;
  /** 2〜3文の説明 */
  description: string;
  /** 所属する軸 */
  pillar: Pillar;
  /** ルート */
  href: `/business/${BusinessId}`;
  /** 事業アクセントカラーの CSS 変数名（tokens.css） */
  colorVar: `--color-biz-${BusinessId}`;
  /** 関連AIツール */
  aiTools: { label: string; href: string }[];
  /** キービジュアル（photo-manifest の id） */
  keyVisualId: string;
  /** 表示順 */
  order: number;
};

export const businesses: Business[] = [
  {
    id: "digital",
    nameEn: "Web Development",
    descriptionEn:
      "Corporate sites, web systems and AI features — designed from your business goals and supported after launch.",
    brandSuffix: "Digital",
    nameJa: "Web開発受託",
    shortJa: "Web開発",
    tagline: "デジタルの器を、つくる。",
    description:
      "コーポレートサイトからWebシステム、AI機能の実装まで。事業の目的から逆算して設計し、公開後の運用まで伴走します。",
    pillar: "create",
    href: "/business/digital",
    colorVar: "--color-biz-digital",
    aiTools: [{ label: "Web制作 AI見積もり", href: "/ai/estimate" }],
    keyVisualId: "kv-digital",
    order: 1,
  },
  {
    id: "social",
    nameEn: "Social Media Management",
    descriptionEn: "Planning, shooting, posting and analysis for Instagram, TikTok, YouTube and X.",
    brandSuffix: "Social",
    nameJa: "SNS運用代行",
    shortJa: "SNS運用",
    tagline: "届ける。広げる。伝える。",
    description:
      "Instagram・TikTok・YouTube・X の企画から撮影・投稿・分析まで。数字の先にある「指名される理由」を設計します。",
    pillar: "convey",
    href: "/business/social",
    colorVar: "--color-biz-social",
    aiTools: [{ label: "SNSアカウント診断", href: "/ai/sns-check" }],
    keyVisualId: "kv-social",
    order: 2,
  },
  {
    id: "consulting",
    nameEn: "Management Consulting",
    descriptionEn:
      "From getting the numbers straight to strategy and execution, we stand beside owners as advisors or on projects.",
    brandSuffix: "Consulting",
    nameJa: "経営コンサルティング",
    shortJa: "経営コンサル",
    tagline: "事業そのものを、育てる。",
    description:
      "数字の整理から戦略立案、実行支援まで。顧問型とプロジェクト型で、経営者の隣に立って意思決定を支えます。",
    pillar: "grow",
    href: "/business/consulting",
    colorVar: "--color-biz-consulting",
    aiTools: [{ label: "AI経営診断", href: "/ai/diagnosis" }],
    keyVisualId: "kv-consulting",
    order: 3,
  },
  {
    id: "build",
    nameEn: "Construction",
    descriptionEn:
      "Renovation and new construction for shops, offices and homes — from design through site management.",
    brandSuffix: "Build",
    nameJa: "建設",
    shortJa: "建設",
    tagline: "リアルの器を、つくる。",
    description:
      "店舗・オフィス・住宅のリフォームから新築まで。設計から施工管理まで一貫して担い、事業の「場」をかたちにします。",
    pillar: "create",
    href: "/business/build",
    colorVar: "--color-biz-build",
    aiTools: [{ label: "写真でリフォーム相談", href: "/ai/reform" }],
    keyVisualId: "kv-build",
    order: 4,
  },
  {
    id: "dining",
    nameEn: "Dining",
    descriptionEn: "We run our own restaurants, testing every strategy we propose in our own business.",
    brandSuffix: "Dining",
    nameJa: "飲食",
    shortJa: "飲食",
    tagline: "自ら現場に立ち、実践する。",
    description:
      "自社で店舗を運営し、集客・SNS・経営改善の戦略を日々検証しています。机上の空論で終わらない提案の源泉です。",
    pillar: "practice",
    href: "/business/dining",
    colorVar: "--color-biz-dining",
    aiTools: [],
    keyVisualId: "kv-dining",
    order: 5,
  },
];

export const businessMap = Object.fromEntries(businesses.map((b) => [b.id, b])) as Record<
  BusinessId,
  Business
>;

export function getBusiness(id: BusinessId): Business {
  return businessMap[id];
}

/** 事業ブランド名（例：「◯◯ Digital」）。コーポレートブランド名が未確定なら【要差し替え】を含む */
export function businessBrandName(b: Business): string {
  return `${company.brandName} ${b.brandSuffix}`;
}

/** 軸ごとの事業一覧（関係図で使用） */
export function businessesByPillar(): Record<Pillar, Business[]> {
  const result: Record<Pillar, Business[]> = { create: [], convey: [], grow: [], practice: [] };
  for (const b of businesses) result[b.pillar].push(b);
  return result;
}
