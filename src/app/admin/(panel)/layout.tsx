import type { ReactNode } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { getAdminSession, signOut } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/nav";

/** 上部バー右側：ログイン中ユーザーとログアウト（cookies() を読むので Suspense 内） */
async function UserMenu() {
  const session = await getAdminSession();
  return (
    <div className="flex items-center gap-3">
      {session && <span className="text-xs text-white/70">{session.user}</span>}
      <form action={signOut}>
        <button
          type="submit"
          className="btn-base min-h-8 border-white/40 px-3 text-xs text-white hover:bg-white hover:text-black"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="bg-black text-white md:sticky md:top-0 md:h-dvh md:w-56 md:shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:block md:py-5">
          <Link href="/admin" className="font-display text-sm font-bold tracking-wide">
            <span className="bg-accent mr-2 inline-block h-3 w-3 align-middle" aria-hidden />
            ADMIN
          </Link>
          <div className="md:hidden">
            <Suspense fallback={null}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
        <div className="px-2 pb-2 md:px-3">
          <AdminNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden items-center justify-end bg-black px-6 py-2 text-white md:flex">
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
