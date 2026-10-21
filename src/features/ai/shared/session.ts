import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export const AI_SESSION_COOKIE = "ai_sid";

/** AI 機能のセッションID（レート制限・ログ用）。無ければ発行する */
export async function getOrCreateSessionId(): Promise<{ id: string; isNew: boolean }> {
  const jar = await cookies();
  const existing = jar.get(AI_SESSION_COOKIE)?.value;
  if (existing && /^[0-9a-f-]{36}$/.test(existing)) return { id: existing, isNew: false };
  return { id: randomUUID(), isNew: true };
}

export function sessionCookieHeader(id: string): string {
  return `${AI_SESSION_COOKIE}=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
