import Anthropic from "@anthropic-ai/sdk";
import { aiConfig } from "./config";

let client: Anthropic | null = null;

/** Anthropic クライアント（サーバー専用。API キーはクライアントに渡さない） */
export function getAnthropic(): Anthropic {
  if (!aiConfig.apiKey) throw new Error("ANTHROPIC_API_KEY が未設定です（デモモードではこの関数を呼ばない）");
  if (!client) client = new Anthropic({ apiKey: aiConfig.apiKey, timeout: 120_000 });
  return client;
}
