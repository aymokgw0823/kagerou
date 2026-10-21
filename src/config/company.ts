/**
 * 会社情報の唯一の正（Single Source of Truth）。
 *
 * - 社名・住所・資本金・役員・取引銀行などは **このファイルだけ** を書き換えれば全ページに反映される。
 * - 未確定の項目は `PLACEHOLDER`（= 【要差し替え】）のまま入れておく。
 *   画面では `<Placeholder>` コンポーネントが目立つ表示にし、`npm run check:dummy` が残存を検出する。
 * - 数値（年商・従業員数など）は **事実が確定するまで `null` のまま** にする。
 *   `null` の項目はトップの数値セクションに表示されない（ダミーの数値で埋めない）。
 */

export const PLACEHOLDER = "【要差し替え】" as const;

/** 文字列が未確定プレースホルダー（【…】）を含むか */
export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && /【[^】]*】/.test(value);
}

export type Officer = {
  /** 氏名 */
  name: string;
  /** 役職 */
  title: string;
  /** 経歴（About の役員紹介で使用） */
  bio?: string;
  /** 写真（photo-manifest の id） */
  photoId?: string;
  /** ダミーデータかどうか */
  isDummy?: boolean;
};

export type License = {
  /** 許認可の名称（例：建設業許可） */
  label: string;
  /** 番号・区分（例：東京都知事 許可（般-XX）第XXXXXX号） */
  number: string;
  /** 関連する事業 */
  business?: "digital" | "social" | "consulting" | "build" | "dining";
};

export type HistoryEvent = {
  /** YYYY-MM 形式 */
  date: string;
  /** 出来事 */
  event: string;
  isDummy?: boolean;
};

/**
 * 数値セクションに表示できる実績値。
 * **事実が確定するまで必ず `null`**。`null` は画面に出ない。
 */
export type CompanyFigures = {
  /** 年商（百万円） */
  annualRevenueMillionYen: number | null;
  /** 従業員数（名） */
  employees: number | null;
  /** 取引社数（社） */
  clients: number | null;
  /** 累計プロジェクト数（件） */
  projects: number | null;
  /** 店舗数（店） */
  stores: number | null;
  /** グループ事業数（これは事実なので固定） */
  businesses: number;
};

export const company = {
  /** 社名（和文） */
  nameJa: PLACEHOLDER,
  /** 社名（英文） */
  nameEn: PLACEHOLDER,
  /** コーポレートブランド名（事業ブランドの接頭辞にも使う。例：「◯◯ Digital」） */
  brandName: PLACEHOLDER,
  /** 設立（例：2025年4月） */
  founded: PLACEHOLDER,
  /** 資本金 */
  capital: "1,000万円",
  /** 代表取締役 */
  representative: PLACEHOLDER,
  /** 役員一覧 */
  officers: [
    {
      name: PLACEHOLDER,
      title: "代表取締役",
      bio: "Web制作会社でディレクターとして勤務した後、飲食店の立ち上げと運営に携わる。現場で得た「つくる・伝える・育てる」の経験をもとに当社を設立。",
      photoId: "ceo-portrait",
      isDummy: true,
    },
    {
      name: PLACEHOLDER,
      title: "取締役（建設事業管掌）",
      bio: "総合建設会社で施工管理を担当。店舗・住宅のリフォームから新築まで幅広い現場を経験し、当社の建設事業を統括。",
      photoId: "officer-01",
      isDummy: true,
    },
    {
      name: PLACEHOLDER,
      title: "取締役（デジタル・マーケティング管掌）",
      bio: "広告代理店でSNSマーケティングに従事した後、独立してWeb開発とSNS運用の支援を行う。当社ではWeb開発・SNS運用代行・経営コンサルティングを統括。",
      photoId: "officer-02",
      isDummy: true,
    },
  ] satisfies Officer[],
  /** 本社所在地 */
  address: {
    postalCode: PLACEHOLDER,
    /** 都道府県＋市区町村（例：東京都千代田区） */
    region: PLACEHOLDER,
    /** 町名・番地・ビル名（例：丸の内1-1-1 〇〇ビル 5F） */
    street: PLACEHOLDER,
    /** 1行表示用 */
    get full(): string {
      return `〒${this.postalCode} ${this.region}${this.street}`;
    },
    /** 最寄り駅からの道順（アクセス） */
    directions: PLACEHOLDER,
    /** Google Maps 埋め込み用の検索クエリ（住所や店名）。未設定なら静的地図を表示 */
    mapQuery: null as string | null,
    /** 緯度経度（任意。LocalBusiness の構造化データに使用） */
    geo: null as { lat: number; lng: number } | null,
  },
  /** 連絡先 */
  contact: {
    tel: PLACEHOLDER,
    fax: null as string | null,
    email: PLACEHOLDER,
    /** 受付時間 */
    hours: "平日 10:00〜18:00",
  },
  /** 取引銀行 */
  banks: [PLACEHOLDER] as string[],
  /** 許認可 */
  licenses: [
    { label: "建設業許可", number: PLACEHOLDER, business: "build" },
    { label: "飲食店営業許可", number: PLACEHOLDER, business: "dining" },
  ] satisfies License[],
  /** 加入団体（任意） */
  memberships: [] as string[],
  /** 適格請求書発行事業者登録番号（T + 13桁） */
  invoiceRegistrationNumber: PLACEHOLDER,
  /** 事業内容（会社概要の表に出す文言。詳細は businesses.ts） */
  businessSummary: [
    "Webサイト・Webシステムの企画・開発",
    "SNSアカウントの運用代行・コンテンツ制作",
    "経営コンサルティング",
    "建築工事・リフォーム工事の設計・施工",
    "飲食店の経営",
  ],
  /** 沿革（確定した事実のみ残す。ダミーは isDummy: true） */
  history: [
    { date: PLACEHOLDER, event: "会社設立", isDummy: true },
    { date: PLACEHOLDER, event: "Web開発・SNS運用・経営コンサルティング事業を開始", isDummy: true },
    { date: PLACEHOLDER, event: "建設事業を開始（建設業許可取得）", isDummy: true },
    { date: PLACEHOLDER, event: "飲食事業を開始（1号店出店）", isDummy: true },
  ] satisfies HistoryEvent[],
  /** 数値実績。事実が確定するまで null のまま */
  figures: {
    annualRevenueMillionYen: null,
    employees: null,
    clients: null,
    projects: null,
    stores: null,
    businesses: 5,
  } satisfies CompanyFigures,
  /** 公式SNS（未設定は null） */
  social: {
    x: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
    facebook: null as string | null,
    linkedin: null as string | null,
  },
} as const;

export type Company = typeof company;

/** 数値セクションに表示する行。null の項目は除外され、1件もなければ空配列 */
export function getPublishedFigures(): { label: string; value: number; unit: string }[] {
  const f = company.figures;
  const rows: { label: string; value: number | null; unit: string }[] = [
    { label: "年商", value: f.annualRevenueMillionYen, unit: "百万円" },
    { label: "従業員数", value: f.employees, unit: "名" },
    { label: "取引社数", value: f.clients, unit: "社" },
    { label: "累計プロジェクト", value: f.projects, unit: "件" },
    { label: "店舗数", value: f.stores, unit: "店" },
  ];
  return rows.filter((r): r is { label: string; value: number; unit: string } => r.value !== null);
}
