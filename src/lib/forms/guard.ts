/**
 * フォーム共通のスパム対策：honeypot・レート制限・CAPTCHA（任意）。
 * サーバーアクションの冒頭で呼ぶ。
 */
import { headers } from "next/headers";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyCaptcha } from "@/lib/captcha";

import { HONEYPOT_FIELD } from "./state";
export { HONEYPOT_FIELD, idleState, type ActionState } from "./state";

export type GuardResult =
  | { ok: true; ip: string; userAgent: string }
  | { ok: false; reason: "honeypot" | "rate-limit" | "captcha"; message: string };

export async function guardForm(
  scope: string,
  formData: FormData,
  opts: { limit?: number; windowMs?: number } = {},
): Promise<GuardResult> {
  const h = await headers();
  const ip = clientIp(h);
  const userAgent = h.get("user-agent") ?? "";
  const honey = formData.get(HONEYPOT_FIELD);
  if (typeof honey === "string" && honey.trim() !== "") {
    // ボットには成功したように見せる（本文は保存しない）
    return { ok: false, reason: "honeypot", message: "送信を受け付けました。" };
  }
  const rl = await rateLimit(scope, ip, {
    limit: opts.limit ?? 5,
    windowMs: opts.windowMs ?? 60 * 60 * 1000,
  });
  if (!rl.ok)
    return {
      ok: false,
      reason: "rate-limit",
      message: "短時間に多くの送信がありました。しばらく時間をおいてから再度お試しください。",
    };
  const captchaOk = await verifyCaptcha(formData.get("cf-turnstile-response") as string | null, ip);
  if (!captchaOk)
    return {
      ok: false,
      reason: "captcha",
      message: "認証に失敗しました。ページを再読み込みして再度お試しください。",
    };
  return { ok: true, ip, userAgent };
}
