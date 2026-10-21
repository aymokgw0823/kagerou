import type { RetrievedDoc } from "../shared/retriever";

/** デモモード：取得した資料をもとにそれらしい回答文を組み立てる */
export function mockConciergeAnswer(question: string, docs: RetrievedDoc[]): string {
  if (docs.length === 0) {
    return "サイト内に該当する情報が見つかりませんでした。お手数ですが、お問い合わせフォーム（/contact）またはお電話でご確認ください。\n\n関連する行き先：お問い合わせ（/contact）";
  }
  const first = docs[0];
  const second = docs[1];
  const lines = [
    `「${question.slice(0, 30)}」について、サイト内の情報をもとにお答えします（デモモード）。`,
    `${first.snippet.slice(0, 120)}…といった内容が参考になります【1】。`,
    second ? `あわせて「${second.title}」もご覧ください【2】。` : "",
    "",
    "関連する行き先：写真でリフォーム相談（/ai/reform）、お問い合わせ（/contact）",
  ];
  return lines.filter((l) => l !== "").join("\n");
}
