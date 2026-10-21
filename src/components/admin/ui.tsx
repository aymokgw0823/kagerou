import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** ページ見出し（右側にアクション） */
export function AdminPageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** 数値カード */
export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "accent" | "warn";
}) {
  return (
    <div
      className={cn(
        "card px-4 py-3",
        tone === "accent" && "border-l-link",
        tone === "warn" && "border-l-notice",
      )}
    >
      <p className="text-ink-3 text-xs font-bold">{label}</p>
      <p className="font-display mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-ink-2 mt-0.5 text-xs">{sub}</p>}
    </div>
  );
}

/** フィルターフォーム（GET） */
export function FilterBar({
  action,
  children,
  reset,
}: {
  action: string;
  children: ReactNode;
  reset?: string;
}) {
  return (
    <form method="get" action={action} className="border-line bg-paper-2 mb-4 rounded-sm border p-3">
      <div className="flex flex-wrap items-end gap-3">
        {children}
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-9 px-4 text-xs"
          >
            絞り込む
          </button>
          {reset && (
            <Link href={reset} className="text-link text-xs underline underline-offset-2">
              解除
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}

const fieldClass =
  "border-line bg-paper min-h-9 rounded-sm border px-2 py-1 text-sm focus:border-ink focus:outline-none";

export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold">
      <span className="text-ink-2">{label}</span>
      {children}
    </label>
  );
}

export function FilterSelect({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(fieldClass, "min-w-32", className)} {...rest}>
      {children}
    </select>
  );
}

export function FilterInput({ className, ...rest }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, className)} {...rest} />;
}

/** 表 */
export function Table({ head, children, empty }: { head: ReactNode; children: ReactNode; empty?: boolean }) {
  return (
    <div className="border-line overflow-x-auto rounded-sm border">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead className="bg-paper-2 text-ink-2 text-left text-xs">
          <tr>{head}</tr>
        </thead>
        <tbody>
          {children}
          {empty && (
            <tr>
              <td colSpan={99} className="text-ink-3 px-3 py-8 text-center">
                該当するデータはありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("border-line border-b px-3 py-2 font-bold whitespace-nowrap", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("border-line border-b px-3 py-2 align-top", className)}>{children}</td>;
}

/** 状態バッジ */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "warn" | "danger" | "info";
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-1.5 py-0.5 text-xs font-bold whitespace-nowrap",
        tone === "neutral" && "bg-paper-3 text-ink-2",
        tone === "ok" && "bg-accent-soft text-accent-deep",
        tone === "warn" && "bg-notice-soft text-notice",
        tone === "danger" && "bg-notice-soft text-danger",
        tone === "info" && "bg-tint text-link",
      )}
    >
      {children}
    </span>
  );
}

/** ページング */
export function Pagination({
  page,
  pageSize,
  total,
  href,
}: {
  page: number;
  pageSize: number;
  total: number;
  /** ページ番号を受け取って URL を返す */
  href: (page: number) => string;
}) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = "btn-base border-line text-ink hover:bg-paper-2 min-h-9 border px-4 text-xs";
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-ink-2">
        {total.toLocaleString("ja-JP")} 件中 {from}–{to} 件
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={btn}>
            前へ
          </Link>
        ) : (
          <span className={cn(btn, "opacity-40")}>前へ</span>
        )}
        <span className="text-ink-2 text-xs">
          {page} / {last}
        </span>
        {page < last ? (
          <Link href={href(page + 1)} className={btn}>
            次へ
          </Link>
        ) : (
          <span className={cn(btn, "opacity-40")}>次へ</span>
        )}
      </div>
    </div>
  );
}

export function Loading() {
  return <p className="text-ink-3 py-8 text-sm">読み込み中…</p>;
}
