/**
 * 事業ページ（/business/<id>）の内容定義。
 * 2事業共通テンプレート（要件 4.3）の各セクションに対応する。
 * 事業ごとのファイル（build.ts / dining.ts）がこの型を満たす。
 */
import type { BusinessId } from "@/config/businesses";

export type Faq = { q: string; a: string };

export type PricingRow = {
  /** プラン・メニュー名 */
  plan: string;
  /** 「〇〇万円〜」形式。未確定は PLACEHOLDER（【要差し替え】） */
  price: string;
  /** 含まれるもの・条件 */
  note?: string;
};

export type BuildExtra = {
  kind: "build";
  /** 施工エリア */
  serviceAreas: string[];
  /** ビフォー/アフターのギャラリー（photo-manifest の id） */
  gallery: { title: string; description: string; beforeId: string; afterId: string; isDummy: true }[];
};

export type DiningExtra = {
  kind: "dining";
  stores: {
    /** 店名（会社名とは別ブランド） */
    name: string;
    /** 店舗ブランド名（複数店で共通） */
    brand: string;
    concept: string;
    address: string;
    hours: string;
    closed: string;
    tel?: string;
    /** 外部予約サービスへのリンク（未設定なら枠だけ表示） */
    reservationUrl?: string;
    photoId: string;
    isDummy: true;
  }[];
  menu: { name: string; price: string; description: string; photoId?: string; isDummy: true }[];
};

export type BusinessExtra = BuildExtra | DiningExtra;

export type BusinessDetail = {
  id: BusinessId;
  hero: {
    /** 見出し（1行・20字以内目安） */
    headline: string;
    /** リード（2〜3文） */
    lead: string;
    /** ヒーロー写真（photo-manifest の id） */
    photoId: string;
  };
  /** こんなお悩みはありませんか（5〜6件・各40字以内） */
  problems: string[];
  /** 提供サービス（4〜6件） */
  services: { title: string; description: string }[];
  /** 選ばれる理由（3〜4件）。もう一方の事業との連携による強みを必ず1件以上含め synergy に事業IDを入れる */
  reasons: { title: string; description: string; synergy?: BusinessId[] }[];
  /** 進め方（4〜6ステップ） */
  flow: { title: string; description: string }[];
  /** 料金の目安 */
  pricing: PricingRow[];
  pricingNote?: string;
  /** FAQ（5〜6件） */
  faq: Faq[];
  extra: BusinessExtra;
};
