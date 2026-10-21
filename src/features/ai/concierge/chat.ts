/**
 * 横断AIコンシェルジュ：サイト内コンテンツ（検索インデックス）だけを根拠に回答する RAG。
 * - 回答本文はテキストでストリーミングし、【番号】で資料を引用させる
 * - 引用が1つもない回答は「根拠なし」とみなし、問い合わせ誘導の定型文に差し替える（推測で答えない）
 */
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropic } from "../shared/client";
import { aiConfig } from "../shared/config";
import { loadPrompt } from "../shared/prompts";
import { getRetriever, type RetrievedDoc } from "../shared/retriever";
import { prepareUserText, sanitizeText } from "../shared/sanitize";
import { streamChunks } from "../shared/sse";
import { mockConciergeAnswer } from "./mock";

export type ChatTurn = { role: "user" | "assistant"; content: string };
export type Source = { n: number; title: string; url: string; type: string };
export type ConciergeEvents = { sources: (s: Source[]) => void; delta: (t: string) => void };
export type ConciergeOutput = {
  answer: string;
  sources: Source[];
  grounded: boolean;
  usage: { tokensIn: number; tokensOut: number };
};

const NO_SOURCE_ANSWER =
  "サイト内に根拠となる情報が見つかりませんでした。推測でお答えすることは避けていますので、お手数ですがお問い合わせフォーム（/contact）またはお電話でご確認ください。";

const OFF_TOPIC_HINT = /(プログラム|コード|python|javascript|株価|天気|占い|恋愛|政治|選挙)/i;

function buildSystem(docs: RetrievedDoc[]): string {
  const base = loadPrompt("concierge");
  const refs = docs.length
    ? docs
        .map(
          (d, i) =>
            `【${i + 1}】${d.title}（${d.type === "work" ? "施工事例" : d.type === "page" ? "サイト情報" : "ブログ"}、URL: ${d.url}）\n${d.snippet}`,
        )
        .join("\n\n")
    : "（該当する資料はありません）";
  return `${base}\n\n## 参考資料\n${refs}`;
}

export async function runConcierge(
  input: { question: string; history: ChatTurn[]; demo: boolean },
  ev: ConciergeEvents,
): Promise<ConciergeOutput> {
  const question = prepareUserText(input.question, aiConfig.limits.chatMessageMax);
  const retriever = getRetriever();
  const docs = await retriever.retrieve(question, 5);
  const sources: Source[] = docs.map((d, i) => ({ n: i + 1, title: d.title, url: d.url, type: d.type }));
  ev.sources(sources);

  let answer = "";
  let usage = { tokensIn: 0, tokensOut: 0 };

  if (input.demo) {
    answer = OFF_TOPIC_HINT.test(question)
      ? "このチャットでは、当社の事業・店舗・工事・採用に関するご質問にお答えしています。サイトに関する質問をお願いします。"
      : mockConciergeAnswer(question, docs);
    await streamChunks(answer, (c) => ev.delta(c), { chunk: 6, delayMs: 20 });
  } else {
    const client = getAnthropic();
    const history: Anthropic.MessageParam[] = input.history
      .slice(-aiConfig.limits.chatHistoryMax)
      .map((t) => ({ role: t.role, content: prepareUserText(t.content, 1000) }));
    const stream = client.messages.stream({
      model: aiConfig.model,
      max_tokens: 1500,
      system: [{ type: "text", text: buildSystem(docs) }],
      messages: [...history, { role: "user", content: `<user_input>\n${question}\n</user_input>` }],
      output_config: { effort: "low" },
    });
    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        answer += event.delta.text;
        ev.delta(event.delta.text);
      }
    }
    const message = await stream.finalMessage();
    usage = { tokensIn: message.usage.input_tokens, tokensOut: message.usage.output_tokens };
    if (message.stop_reason === "refusal") {
      answer = "このご質問にはお答えできません。お問い合わせフォーム（/contact）をご利用ください。";
      ev.delta(answer);
    }
  }

  answer = sanitizeText(answer);
  const cited = [...answer.matchAll(/【(\d+)】/g)]
    .map((m) => Number(m[1]))
    .filter((n) => n >= 1 && n <= sources.length);
  const grounded = cited.length > 0;
  const usedSources = grounded ? sources.filter((s) => cited.includes(s.n)) : [];
  // 根拠のない断定を避ける：資料があるのに引用が無い場合は定型文へ
  if (!grounded && docs.length > 0 && !/見つかりません|お答えできません|サイトに関する質問/.test(answer)) {
    answer = NO_SOURCE_ANSWER;
  }
  return { answer, sources: usedSources, grounded, usage };
}
