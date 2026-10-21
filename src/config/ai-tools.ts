/** 4つのAIツール（/ai 配下）の定義。トップ・事業ページ・フッターで共通利用 */
import type { BusinessId } from "./businesses";

export type AiTool = {
  id: "diagnosis" | "estimate" | "sns-check" | "reform";
  name: string;
  short: string;
  description: string;
  href: `/ai/${string}`;
  business: BusinessId;
  /** 所要時間の目安 */
  duration: string;
};

export const aiTools: AiTool[] = [
  {
    id: "diagnosis",
    name: "AI経営診断",
    short: "経営診断",
    description: "業種・規模・現状をもとにAIが対話で深掘りし、課題と打ち手を整理したレポートをお渡しします。",
    href: "/ai/diagnosis",
    business: "consulting",
    duration: "約10分",
  },
  {
    id: "estimate",
    name: "Web制作 AI見積もり",
    short: "AI見積もり",
    description: "つくりたいサイトの要件を対話で整理し、推奨サイトマップと概算見積もりをその場で算出します。",
    href: "/ai/estimate",
    business: "digital",
    duration: "約5分",
  },
  {
    id: "sns-check",
    name: "SNSアカウント診断",
    short: "SNS診断",
    description:
      "プラットフォーム・目的・現状から、アカウントの改善ポイントと30日間の投稿カレンダー案を提案します。",
    href: "/ai/sns-check",
    business: "social",
    duration: "約5分",
  },
  {
    id: "reform",
    name: "写真でリフォーム相談",
    short: "リフォーム相談",
    description:
      "気になる箇所の写真をアップロードするだけで、考えられる施工内容と概算の費用レンジをお伝えします。",
    href: "/ai/reform",
    business: "build",
    duration: "約3分",
  },
];

export function getAiToolsForBusiness(id: BusinessId): AiTool[] {
  return aiTools.filter((t) => t.business === id);
}
