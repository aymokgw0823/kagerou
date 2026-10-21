"use client";

import { useActionState } from "react";
import type { AdminLoginState } from "@/lib/admin-auth";

type Action = (prev: AdminLoginState, formData: FormData) => Promise<AdminLoginState>;

const inputClass =
  "border-line bg-paper focus:border-ink min-h-11 w-full rounded-sm border px-3 py-2 text-[0.9375rem] focus:outline-none";

export function LoginForm({ action, next }: { action: Action; next: string }) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-1">
        <label htmlFor="user" className="text-sm font-bold">
          ID
        </label>
        <input id="user" name="user" type="text" autoComplete="username" required className={inputClass} />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-bold">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {state.status === "error" && (
        <p role="alert" className="border-danger bg-notice-soft rounded-sm border-l-4 p-3 text-sm">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-12 w-full disabled:opacity-60"
      >
        {pending ? "確認中…" : "ログイン"}
      </button>
    </form>
  );
}
