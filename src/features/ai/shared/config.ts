/**
 * AI 機能の共通設定（環境変数の読み取り）。
 * - ANTHROPIC_API_KEY が未設定なら「デモモード」（モック応答）で動作する
 */
export const aiConfig = {
  get apiKey() {
    return process.env.ANTHROPIC_API_KEY || "";
  },
  /** 対話・解析に使うモデル（要件定義の既定：claude-sonnet-5-5） */
  get model() {
    return process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
  },
  /** レポート生成など重い処理用 */
  get modelHeavy() {
    return process.env.ANTHROPIC_MODEL_HEAVY || "claude-opus-5-5";
  },
  get dailyTokenBudget() {
    return Number(process.env.AI_DAILY_TOKEN_BUDGET || 2_000_000);
  },
  get rateLimitPerHour() {
    return Number(process.env.AI_RATE_LIMIT_PER_HOUR || 10);
  },
  get semanticSearchEnabled() {
    return process.env.AI_SEMANTIC_SEARCH_ENABLED === "true";
  },
  /** 入力制限 */
  limits: {
    descriptionMax: 1000,
    chatMessageMax: 500,
    chatHistoryMax: 10,
    imageMaxCount: 5,
    imageMaxBytes: 10 * 1024 * 1024,
    imageMaxEdge: 1600,
  },
};

export const isDemoMode = () => !aiConfig.apiKey;

export const DISCLAIMER =
  "本結果はAIによる参考情報であり、正式な提案・見積もりではありません。正確な金額は現地調査で確定します。";
export const BUDGET_EXCEEDED_MESSAGE = "本日の受付は終了しました。お問い合わせフォームをご利用ください。";
