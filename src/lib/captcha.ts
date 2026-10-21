/**
 * CAPTCHA の差し込み口。既定では無効（常に通過）。
 * Cloudflare Turnstile を使う場合は TURNSTILE_SECRET_KEY と NEXT_PUBLIC_TURNSTILE_SITE_KEY を設定し、
 * フォームに <Turnstile /> ウィジェットを置いて token を "cf-turnstile-response" として送る。
 */
export const captchaEnabled = !!process.env.TURNSTILE_SECRET_KEY;

export async function verifyCaptcha(token: string | null | undefined, ip?: string): Promise<boolean> {
  if (!captchaEnabled) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });
  const json = (await res.json()) as { success?: boolean };
  return !!json.success;
}
