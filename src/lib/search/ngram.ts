/**
 * 日本語対応の軽量全文検索（クライアント側）。
 * - 文字列を正規化（NFKC・小文字・空白除去）したうえで bigram に分解し、一致率でスコアリングする
 * - 完全一致（部分文字列）を強く優遇する
 * - 依存ライブラリなし。300 件規模なら十分高速
 */
export type SearchDoc = {
  slug: string;
  title: string;
  description: string;
  body: string;
  [key: string]: unknown;
};

export function normalize(s: string): string {
  return s.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}

export function bigrams(s: string): string[] {
  const n = normalize(s);
  if (n.length < 2) return n ? [n] : [];
  const out: string[] = [];
  for (let i = 0; i < n.length - 1; i++) out.push(n.slice(i, i + 2));
  return out;
}

/** クエリを空白で分割し、各語について AND 検索する */
export function splitQuery(q: string): string[] {
  return q
    .normalize("NFKC")
    .split(/[\s　]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** 1語に対するスコア（0 = 不一致） */
export function scoreTerm(doc: SearchDoc, term: string): number {
  const t = normalize(term);
  if (!t) return 0;
  const title = normalize(doc.title);
  const desc = normalize(doc.description);
  const body = normalize(doc.body);
  let score = 0;
  if (title.includes(t)) score += 30;
  if (desc.includes(t)) score += 12;
  if (body.includes(t)) score += 6;
  if (score > 0) return score;
  // 部分一致しない場合は bigram の一致率で判定（表記ゆれ・助詞の違いに対応）
  const grams = bigrams(t);
  if (grams.length === 0) return 0;
  const hitTitle = grams.filter((g) => title.includes(g)).length / grams.length;
  const hitBody = grams.filter((g) => body.includes(g) || desc.includes(g)).length / grams.length;
  if (hitTitle >= 0.7) score += Math.round(20 * hitTitle);
  if (hitBody >= 0.7) score += Math.round(5 * hitBody);
  return score;
}

/** 全語 AND でスコアを返す。1語でも不一致なら 0 */
export function scoreDoc(doc: SearchDoc, query: string): number {
  const terms = splitQuery(query);
  if (terms.length === 0) return 0;
  let total = 0;
  for (const term of terms) {
    const s = scoreTerm(doc, term);
    if (s === 0) return 0;
    total += s;
  }
  return total;
}

export function search<T extends SearchDoc>(docs: T[], query: string): { doc: T; score: number }[] {
  return docs
    .map((doc) => ({ doc, score: scoreDoc(doc, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
