/**
 * 2事業（事業ブランド）の一元管理。
 * コーポレートブランド（company.brandName）の下に「建設」「飲食」の2つのサービスブランドを置く。
 */
import { company } from "./company";

export type BusinessId = "build" | "dining";

/** 「つくる・営む」の軸 */
export type Pillar = "create" | "operate";

export const pillars: Record<Pillar, { ja: string; en: string; description: string }> = {
  create: { ja: "つくる", en: "Build", description: "店舗・住宅・オフィスという「場」をつくる" },
  operate: {
    ja: "営む",
    en: "Run",
    description: "自ら店舗を営み、場がどう使われ、どう育つかを日々知っている",
  },
};

export type Business = {
  id: BusinessId;
  /** 事業ブランドの英語サフィックス（例：Build） */
  brandSuffix: string;
  nameJa: string;
  shortJa: string;
  nameEn: string;
  descriptionEn: string;
  tagline: string;
  description: string;
  pillar: Pillar;
  href: `/business/${BusinessId}`;
  colorVar: `--color-biz-${BusinessId}`;
  /** 関連AIツール（ai-tools.ts と対応） */
  aiTools: { label: string; href: string }[];
  keyVisualId: string;
  order: number;
};

export const businesses: Business[] = [
  {
    id: "build",
    brandSuffix: "Build",
    nameJa: "建設",
    shortJa: "建設",
    nameEn: "Construction",
    descriptionEn:
      "Renovation and new construction for shops, homes and offices — from design through site management. We run our own restaurants, so we design from the user's side.",
    tagline: "事業の「場」を、かたちにする。",
    description:
      "店舗・住宅・オフィスのリフォームから新築まで。設計から施工管理まで一貫して担います。自ら飲食店を営んでいるから、使う側の視点で設計できます。",
    pillar: "create",
    href: "/business/build",
    colorVar: "--color-biz-build",
    aiTools: [{ label: "写真でリフォーム相談", href: "/ai/reform" }],
    keyVisualId: "kv-build",
    order: 1,
  },
  {
    id: "dining",
    brandSuffix: "Dining",
    nameJa: "飲食",
    shortJa: "飲食",
    nameEn: "Dining",
    descriptionEn:
      "We run our own restaurants. Having a construction team in-house means we shape the space ourselves, from the first drawing to the last tile.",
    tagline: "自ら現場に立ち、場を営む。",
    description:
      "自社で飲食店を運営しています。厨房の動線も、客席の居心地も、日々の営業で確かめている。自社に建設部門があるから、空間づくりから自分たちで手がけられます。",
    pillar: "operate",
    href: "/business/dining",
    colorVar: "--color-biz-dining",
    aiTools: [],
    keyVisualId: "kv-dining",
    order: 2,
  },
];

export const businessMap = Object.fromEntries(businesses.map((b) => [b.id, b])) as Record<
  BusinessId,
  Business
>;

export function getBusiness(id: BusinessId): Business {
  return businessMap[id];
}

/** もう一方の事業 */
export function otherBusiness(id: BusinessId): Business {
  return businesses.find((b) => b.id !== id)!;
}

/** 事業ブランド名（例：「KAGERO Build」） */
export function businessBrandName(b: Business): string {
  return `${company.brandNameEn} ${b.brandSuffix}`;
}

export function businessesByPillar(): Record<Pillar, Business[]> {
  const result: Record<Pillar, Business[]> = { create: [], operate: [] };
  for (const b of businesses) result[b.pillar].push(b);
  return result;
}
