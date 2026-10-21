/**
 * ポリシー文書の構造。/policy/<slug> で表示する。
 * 文面は雛形。公開前に専門家の確認を受けること（各ファイル冒頭の管理者向けコメント参照）。
 */
export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; rows: [string, string][] };

export type PolicySection = {
  heading: string;
  blocks: PolicyBlock[];
};

export type PolicyDoc = {
  slug: "privacy" | "antisocial" | "security" | "ai" | "cookie";
  title: string;
  titleEn: string;
  /** 「制定日：YYYY年M月D日」などの表記。未確定は PLACEHOLDER */
  established: string;
  /** 概要（1〜2文。一覧やOGPの description に使う） */
  description: string;
  /** 冒頭文（署名の前に出す場合） */
  intro?: string;
  sections: PolicySection[];
  /** 末尾の署名ブロック（会社名・代表者は company.ts から入るので入れない） */
  closing?: string;
};
