/**
 * サイト内コンテンツの検索（RAG の取得部）。
 * - 既定：ブログと同じ検索インデックス（public/search-index.json）を bigram 検索
 * - AI_SEMANTIC_SEARCH_ENABLED=true のとき：意味検索（埋め込み）。インターフェースのみ用意し、未実装時は bigram にフォールバック
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { search as ngramSearch, type SearchDoc } from "@/lib/search/ngram";
import { aiConfig } from "./config";

export type RetrievedDoc = { type: string; title: string; url: string; snippet: string; score: number };

export type Retriever = {
  name: string;
  retrieve(query: string, limit?: number): Promise<RetrievedDoc[]>;
};

type IndexEntry = SearchDoc & { type: string; url: string; business?: string };

let indexCache: IndexEntry[] | null = null;
function loadIndex(): IndexEntry[] {
  if (indexCache && process.env.NODE_ENV === "production") return indexCache;
  try {
    indexCache = JSON.parse(
      readFileSync(join(process.cwd(), "public", "search-index.json"), "utf8"),
    ) as IndexEntry[];
  } catch {
    indexCache = [];
  }
  return indexCache;
}

function snippetFor(doc: IndexEntry, query: string, len = 400): string {
  const body = doc.body ?? "";
  const terms = query.split(/\s+/).filter(Boolean);
  let pos = -1;
  for (const t of terms) {
    pos = body.indexOf(t);
    if (pos >= 0) break;
  }
  const start = Math.max(0, pos - 80);
  return (doc.description ? `${doc.description} ` : "") + body.slice(start, start + len);
}

export const ngramRetriever: Retriever = {
  name: "ngram",
  async retrieve(query, limit = 5) {
    const docs = loadIndex();
    // 事業・店舗・会社の基本情報（type: page）は営業時間・エリア・料金などの質問で優先されるよう重み付けする
    return ngramSearch(docs, query)
      .map(({ doc, score }) => ({ doc, score: doc.type === "page" ? score * 1.8 : score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ doc, score }) => ({
        type: doc.type,
        title: doc.title,
        url: doc.url,
        snippet: snippetFor(doc, query),
        score,
      }));
  },
};

/**
 * 意味検索（Voyage AI 等の埋め込みを想定）。
 * 実装するときは、ビルド時に各ドキュメントの埋め込みを生成して保存し、ここでクエリの埋め込みとコサイン類似度を取る。
 */
export const semanticRetriever: Retriever = {
  name: "semantic",
  async retrieve(query, limit) {
    if (!process.env.VOYAGE_API_KEY) return ngramRetriever.retrieve(query, limit);
    // TODO: 埋め込みインデックスが用意されたら実装。現状は bigram にフォールバック
    return ngramRetriever.retrieve(query, limit);
  },
};

export function getRetriever(): Retriever {
  return aiConfig.semanticSearchEnabled ? semanticRetriever : ngramRetriever;
}
