/**
 * Proxy（旧 Middleware）：/admin 配下の入口チェック。
 * Cookie の署名を検証し、無効なら /admin/login?next=… へリダイレクトする。
 * ここは楽観的チェックであり、各ページ／Route Handler は getAdminSession() で必ず再確認する。
 * Edge でも動くよう Web Crypto のみを使う（src/lib/admin-session.ts）。
 */
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminSessionSecret, verifyAdminSession } from "@/lib/admin-session";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token, getAdminSessionSecret());

  if (pathname === "/admin/login") {
    // ログイン済みでログイン画面に来たらダッシュボードへ
    if (session) return NextResponse.redirect(new URL("/admin", request.url), 302);
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    // 302：POST 中に期限切れになった場合も GET でログイン画面へ（307 だと POST が再送される）
    const res = NextResponse.redirect(login, 302);
    // 期限切れ・不正な Cookie は消す
    if (token) res.cookies.set(ADMIN_SESSION_COOKIE, "", { path: "/admin", maxAge: 0 });
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
