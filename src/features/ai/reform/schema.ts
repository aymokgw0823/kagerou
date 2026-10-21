/**
 * 写真でリフォーム相談：構造化出力のスキーマ（zod）。
 * AI の出力はこのスキーマで検証し、金額は含めない（単価表で計算）。
 */
import { z } from "zod";
import { pricingIds } from "@/config/reform-pricing";

export const reformParts = ["外壁", "屋根", "水回り", "内装", "その他"] as const;
export type ReformPartInput = (typeof reformParts)[number];

export const findingSchema = z.object({
  photoIndex: z.number().int().min(1).max(5).describe("何枚目の写真か（1始まり）"),
  area: z.string().describe("写っている部位・材料（例：外壁サイディング、屋根のスレート）"),
  observation: z.string().describe("写真から読み取れる状態・劣化の兆候。推定であることを明示"),
  severity: z.enum(["low", "medium", "high", "unknown"]).describe("劣化の程度の推定"),
});

export const candidateSchema = z.object({
  itemId: z.enum(pricingIds).describe("単価表の項目ID"),
  rationale: z.string().describe("この施工を候補とする理由。どの写真のどの所見に基づくか"),
  quantity: z.number().nullable().describe("単価表の unit に合わせた数量の推定。不明なら null"),
  priority: z.enum(["high", "medium", "low"]).describe("優先度"),
});

export const reformAnalysisSchema = z.object({
  summary: z.string().describe("全体の所見の要約（3〜4文）"),
  findings: z.array(findingSchema).min(1).max(10),
  candidates: z.array(candidateSchema).min(0).max(5),
  safety: z.object({
    flagged: z.boolean().describe("安全に関わる懸念があるか"),
    reasons: z.array(z.string()).describe("懸念の内容"),
  }),
  nextSteps: z.array(z.string()).min(1).max(4).describe("現地調査で確認すること"),
  notRelevant: z.boolean().describe("写真が建物の部位ではないなど、相談の対象外の場合 true"),
});
export type ReformAnalysis = z.infer<typeof reformAnalysisSchema>;

/** 画面・PDF・ログで使う最終結果（解析＋金額計算＋類似事例） */
export type ReformResult = {
  id: string;
  mode: "demo" | "live";
  part: ReformPartInput;
  description: string;
  photoCount: number;
  analysis: ReformAnalysis;
  estimate: {
    lines: {
      itemId: string;
      label: string;
      unit: string;
      quantity: number;
      quantityEstimated: boolean;
      min: number;
      max: number;
    }[];
    totalMin: number;
    totalMax: number;
  };
  similarWorks: { slug: string; title: string; summary: string; client: string; photoId: string }[];
  createdAt: string;
  disclaimer: string;
};

/** フォーム入力の検証 */
export const reformInputSchema = z.object({
  part: z.enum(reformParts),
  description: z.string().max(1000).default(""),
  consent: z.literal("on"),
});

/** 部位の選択 → 単価表の part／事例マッチング用の parts */
export const partToWorkParts: Record<ReformPartInput, string[]> = {
  外壁: ["外壁", "外構"],
  屋根: ["屋根"],
  水回り: ["水回り", "設備"],
  内装: ["内装"],
  その他: ["その他", "設備", "外構"],
};
