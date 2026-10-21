/**
 * 管理画面の認証プロバイダー。
 * 現在は環境変数（ADMIN_USER / ADMIN_PASSWORD）との照合だが、将来 SSO（OIDC 等）に差し替えられるよう
 * 「資格情報の検証」「セッション発行」「セッション読み取り」をインターフェースで分離している。
 */
import { createHash, timingSafeEqual } from "node:crypto";
import {
  ADMIN_SESSION_TTL_MS,
  getAdminSessionSecret,
  signAdminSession,
  verifyAdminSession,
  type AdminSession,
} from "./admin-session";

export interface AdminAuthProvider {
  /** ID・パスワードを検証し、成功すればユーザー名を返す */
  verifyCredentials(user: string, password: string): Promise<{ user: string } | null>;
  /** 検証済みユーザーのセッショントークンを発行する */
  createSession(user: string): Promise<{ token: string; session: AdminSession }>;
  /** トークンからセッションを復元する（不正・期限切れなら null） */
  readSession(token: string | undefined | null): Promise<AdminSession | null>;
}

/** 文字列を長さに依存せず定数時間で比較する（長さが違っても比較時間が変わらないよう SHA-256 を通す） */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb) && a.length === b.length;
}

export class EnvAdminAuthProvider implements AdminAuthProvider {
  async verifyCredentials(user: string, password: string) {
    const expectedUser = process.env.ADMIN_USER?.trim() || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
    // パスワード未設定の環境では誰もログインできない（空文字一致を防ぐ）
    if (!expectedPassword) return null;
    const userOk = safeEqual(user, expectedUser);
    const passOk = safeEqual(password, expectedPassword);
    return userOk && passOk ? { user: expectedUser } : null;
  }

  async createSession(user: string) {
    const secret = getAdminSessionSecret();
    if (!secret)
      throw new Error("ADMIN_PASSWORD / ADMIN_SESSION_SECRET が未設定のためセッションを発行できません");
    const now = Date.now();
    const session: AdminSession = { user, issuedAt: now, expiresAt: now + ADMIN_SESSION_TTL_MS };
    const token = await signAdminSession(session, secret);
    return { token, session };
  }

  async readSession(token: string | undefined | null) {
    return verifyAdminSession(token, getAdminSessionSecret());
  }
}

/** 既定のプロバイダー（SSO 化するときはここを差し替える） */
export const adminAuthProvider: AdminAuthProvider = new EnvAdminAuthProvider();
