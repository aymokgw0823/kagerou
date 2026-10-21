import type { Metadata } from "next";
import { Suspense } from "react";
import { safeNextPath, signIn } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "ログイン" };

async function Form({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const sp = await searchParams;
  const next = safeNextPath(Array.isArray(sp.next) ? sp.next[0] : sp.next);
  return <LoginForm action={signIn} next={next} />;
}

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="card w-full max-w-sm p-6 md:p-8">
        <p className="label-caps font-display mb-2">Admin</p>
        <h1 className="mb-6 text-xl font-bold">管理画面ログイン</h1>
        <Suspense fallback={null}>
          <Form searchParams={searchParams as Promise<{ next?: string | string[] }>} />
        </Suspense>
      </div>
    </div>
  );
}
