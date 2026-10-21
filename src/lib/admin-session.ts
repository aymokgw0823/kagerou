/**
 * 管理画面セッションの署名付きトークン（HMAC-SHA256）。
 * proxy.ts（Edge でも動く）と Node 側の両方から使うため、Web Crypto のみを使い Node API には依存しない。
 *
 * トークン形式: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload))
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
/** セッション有効期間（12 時間） */
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export type AdminSession = {
  /** ログインしたユーザー名 */
  user: string;
  /** 発行時刻（epoch ms） */
  issuedAt: number;
  /** 失効時刻（epoch ms） */
  expiresAt: number;
};

let warnedDerivedSecret = false;

/**
 * 署名用シークレットを返す。
 * - ADMIN_SESSION_SECRET があればそれを使う
 * - 無ければ開発用として ADMIN_PASSWORD から導出する（固定文字列は使わない）。ログで警告する
 * - どちらも無ければ null（管理画面は利用不可）
 */
export function getAdminSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  if (!warnedDerivedSecret) {
    warnedDerivedSecret = true;
    console.warn(
      "[admin] ADMIN_SESSION_SECRET が未設定のため ADMIN_PASSWORD からセッション鍵を導出しています。本番では必ず ADMIN_SESSION_SECRET（32文字以上）を設定してください。",
    );
  }
  return `derived:${password}`;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) return null;
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (s.length % 4)) % 4);
  try {
    const bin = atob(b64);
    const out = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

async function hmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  // 導出モードの場合も、生のパスワードをそのまま鍵にせず SHA-256 を通す
  const material = await crypto.subtle.digest("SHA-256", enc.encode(`kagerou-admin-session:${secret}`));
  return crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, [usage]);
}

/** セッショントークンを発行する */
export async function signAdminSession(session: AdminSession, secret: string): Promise<string> {
  const payload = enc.encode(JSON.stringify(session));
  const key = await hmacKey(secret, "sign");
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, payload));
  return `${toBase64Url(payload)}.${toBase64Url(sig)}`;
}

/** トークンを検証し、正当かつ有効期限内ならセッションを返す */
export async function verifyAdminSession(
  token: string | undefined | null,
  secret: string | null,
  now?: number,
): Promise<AdminSession | null> {
  if (!token || !secret) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payload = fromBase64Url(token.slice(0, dot));
  const sig = fromBase64Url(token.slice(dot + 1));
  if (!payload || !sig || sig.length !== 32) return null;
  const key = await hmacKey(secret, "verify");
  // subtle.verify は定数時間比較
  const ok = await crypto.subtle.verify("HMAC", key, sig, payload);
  if (!ok) return null;
  try {
    const parsed = JSON.parse(dec.decode(payload)) as Partial<AdminSession>;
    if (
      typeof parsed.user !== "string" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.expiresAt !== "number"
    )
      return null;
    // Date.now() は検証対象がある場合にだけ評価する（プリレンダー時に不安定値として扱われないように）
    if (parsed.expiresAt <= (now ?? Date.now())) return null;
    return { user: parsed.user, issuedAt: parsed.issuedAt, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}
