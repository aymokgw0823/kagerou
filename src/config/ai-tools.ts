/** AIツールの定義。現在は「写真でリフォーム相談」の1本（横断コンシェルジュは全ページ共通のチャットとして別途実装） */
import type { BusinessId } from "./businesses";

export type AiTool = {
  id: "reform";
  name: string;
  short: string;
  description: string;
  href: `/ai/${string}`;
  business: BusinessId;
  duration: string;
  steps: string[];
};

export const aiTools: AiTool[] = [
  {
    id: "reform",
    name: "写真でリフォーム相談",
    short: "リフォーム相談",
    description:
      "気になる箇所の写真をアップロードするだけで、考えられる施工内容と概算の費用レンジをその場でお伝えします。結果はそのまま現地調査の予約に引き継げます。",
    href: "/ai/reform",
    business: "build",
    duration: "約3分",
    steps: [
      "写真をアップロード（最大5枚）",
      "部位と状況を選ぶ",
      "AIが状態と施工候補・概算を提示",
      "現地調査を予約",
    ],
  },
];

export const reformTool = aiTools[0];

export function getAiToolsForBusiness(id: BusinessId): AiTool[] {
  return aiTools.filter((t) => t.business === id);
}
