/**
 * POST /api/ai/concierge — 横断AIコンシェルジュ（JSON → SSE）
 * body: { message: string, history: { role, content }[] }
 * イベント：sources / delta / done（answer・sources・grounded）/ error
 */
import { z } from "zod";
import { guardAi } from "@/features/ai/shared/guard";
import { sseResponse } from "@/features/ai/shared/sse";
import { sessionCookieHeader } from "@/features/ai/shared/session";
import { recordUsage } from "@/features/ai/shared/budget";
import { completeConsultation, failConsultation, startConsultation } from "@/features/ai/shared/log";
import { aiConfig } from "@/features/ai/shared/config";
import { runConcierge } from "@/features/ai/concierge/chat";

export const maxDuration = 60;

const bodySchema = z.object({
  message: z.string().trim().min(1).max(aiConfig.limits.chatMessageMax),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(aiConfig.limits.chatHistoryMax)
    .default([]),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return Response.json(
      { message: `メッセージは1〜${aiConfig.limits.chatMessageMax}文字で入力してください。` },
      { status: 400 },
    );
  const guard = await guardAi("concierge", req);
  if (!guard.ok) return Response.json({ message: guard.message }, { status: guard.status });
  const id = await startConsultation({
    tool: "concierge",
    inputSummary: parsed.data.message,
    mode: guard.demo ? "demo" : "live",
    sessionId: guard.sessionId,
    ip: guard.ip,
  });
  return sseResponse(
    async (emit) => {
      try {
        const out = await runConcierge(
          { question: parsed.data.message, history: parsed.data.history, demo: guard.demo },
          {
            sources: (s) => emit({ event: "sources", data: s }),
            delta: (t) => emit({ event: "delta", data: { text: t } }),
          },
        );
        if (!guard.demo) await recordUsage(out.usage.tokensIn, out.usage.tokensOut);
        await completeConsultation(id, {
          resultJson: { answer: out.answer, sources: out.sources, grounded: out.grounded },
          tokensIn: out.usage.tokensIn,
          tokensOut: out.usage.tokensOut,
        });
        emit({ event: "done", data: { answer: out.answer, sources: out.sources, grounded: out.grounded } });
      } catch (err) {
        const message = err instanceof Error ? err.message : "エラーが発生しました。";
        await failConsultation(id, message);
        emit({ event: "error", data: { message } });
      }
    },
    { headers: guard.sessionIsNew ? { "Set-Cookie": sessionCookieHeader(guard.sessionId) } : {} },
  );
}
