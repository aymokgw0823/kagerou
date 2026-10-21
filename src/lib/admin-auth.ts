/**
 * 管理画面の認証 API（サーバー専用）。
 * - signIn / signOut：サーバーアクション（関数単位の "use server"）
 * - getAdminSession：Cookie を読んでセッションを返す（cookies() に依存するため呼び出し側は <Suspense> 内で使う）
 * - requireAdmin：未ログインならログイン画面へリダイレクト
 *
 * proxy.ts は入口での楽観的チェック。ページ・Route Handler・サーバーアクションは必ずこちらで再確認する。
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { adminAuthProvider } from "./admin-auth-provider";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS, type AdminSession } from "./admin-session";

export type { AdminSession };

export type AdminLoginState = { status: "idle" } | { status: "error"; message: string };

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
};

/** ログイン後の遷移先として安全なパスだけを許可する（オープンリダイレクト防止） */
export function safeNextPath(next: unknown): string {
  if (typeof next !== "string") return "/admin";
  if (!next.startsWith("/admin") || next.startsWith("//") || next.includes("\\")) return "/admin";
  if (next.startsWith("/admin/login")) return "/admin";
  return next;
}

/** ログイン（useActionState 用） */
export async function signIn(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  "use server";
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));
  if (!process.env.ADMIN_PASSWORD) {
    return { status: "error", message: "管理画面は無効です（ADMIN_PASSWORD が設定されていません）。" };
  }
  if (!user || !password) {
    return { status: "error", message: "ID とパスワードを入力してください。" };
  }
  const verified = await adminAuthProvider.verifyCredentials(user, password);
  if (!verified) {
    return { status: "error", message: "ID またはパスワードが正しくありません。" };
  }
  const { token } = await adminAuthProvider.createSession(verified.user);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, { ...cookieBase, maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000) });
  redirect(next);
}

/** ログアウト */
export async function signOut(): Promise<void> {
  "use server";
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, "", { ...cookieBase, maxAge: 0 });
  redirect("/admin/login");
}

/** 現在のセッション（未ログイン・期限切れなら null） */
export async function getAdminSession(): Promise<AdminSession | null> {
  // セッションは常にリクエスト時に評価する（静的シェル／プリレンダーには含めない）
  await connection();
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return adminAuthProvider.readSession(token);
}

/** ログイン必須のページ・アクションで使う。未ログインならログイン画面へ */
export async function requireAdmin(nextPath = "/admin"): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect(`/admin/login?next=${encodeURIComponent(safeNextPath(nextPath))}`);
  return session;
}
