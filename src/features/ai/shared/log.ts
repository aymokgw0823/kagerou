/**
 * 相談ログ（Consultation テーブル）。個人情報はマスクして保存する。
 */
import { db } from "@/lib/db";
import { maskPii } from "./sanitize";

export async function startConsultation(input: {
  tool: "reform" | "concierge";
  inputSummary?: string;
  mode: "demo" | "live";
  sessionId: string;
  ip: string;
}): Promise<string> {
  const row = await db.consultation.create({
    data: {
      tool: input.tool,
      status: "started",
      inputSummary: input.inputSummary ? maskPii(input.inputSummary).slice(0, 2000) : null,
      mode: input.mode,
      sessionId: input.sessionId,
      ip: input.ip,
    },
  });
  return row.id;
}

export async function completeConsultation(
  id: string,
  data: { resultJson?: unknown; tokensIn?: number; tokensOut?: number },
): Promise<void> {
  await db.consultation.update({
    where: { id },
    data: {
      status: "completed",
      completedAt: new Date(),
      resultJson: data.resultJson ? JSON.stringify(data.resultJson) : undefined,
      tokensIn: data.tokensIn ?? 0,
      tokensOut: data.tokensOut ?? 0,
    },
  });
}

export async function failConsultation(id: string, reason: string): Promise<void> {
  await db.consultation
    .update({
      where: { id },
      data: {
        status: "failed",
        inputSummary: undefined,
        resultJson: JSON.stringify({ error: reason.slice(0, 500) }),
      },
    })
    .catch(() => {});
}

export async function attachEmail(id: string, emailMasked: string): Promise<void> {
  await db.consultation.update({ where: { id }, data: { emailMasked } }).catch(() => {});
}
