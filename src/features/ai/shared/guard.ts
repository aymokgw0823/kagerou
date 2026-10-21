/**
 * AI エンドポイント共通のガード：同意・レート制限（IP／セッション）・コスト上限・デモモード判定。
 */
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { aiConfig, BUDGET_EXCEEDED_MESSAGE, isDemoMode } from "./config";
import { getTodayUsage } from "./budget";
import { getOrCreateSessionId } from "./session";

export type AiGuardResult =
  | { ok: true; ip: string; sessionId: string; sessionIsNew: boolean; demo: boolean }
  | { ok: false; status: number; message: string };

export async function guardAi(
  scope: string,
  req: Request,
  opts: { requireConsent?: boolean; consent?: boolean } = {},
): Promise<AiGuardResult> {
  if (opts.requireConsent && !opts.consent)
    return { ok: false, status: 400, message: "AI利用ポリシーへの同意が必要です。" };
  const ip = clientIp(req.headers);
  const session = await getOrCreateSessionId();
  const limit = aiConfig.rateLimitPerHour;
  const windowMs = 60 * 60 * 1000;
  const [byIp, bySession] = await Promise.all([
    rateLimit(`ai:${scope}:ip`, ip, { limit, windowMs }),
    rateLimit(`ai:${scope}:sid`, session.id, { limit, windowMs }),
  ]);
  if (!byIp.ok || !bySession.ok)
    return {
      ok: false,
      status: 429,
      message: `ご利用回数の上限（1時間あたり${limit}回）に達しました。しばらく時間をおいてからお試しください。`,
    };
  const demo = isDemoMode();
  if (!demo) {
    const usage = await getTodayUsage();
    if (usage.exceeded) return { ok: false, status: 503, message: BUDGET_EXCEEDED_MESSAGE };
  }
  return { ok: true, ip, sessionId: session.id, sessionIsNew: session.isNew, demo };
}
