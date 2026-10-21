"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/leads", label: "リード" },
  { href: "/admin/consultations", label: "相談ログ" },
  { href: "/admin/bookings", label: "予約" },
  { href: "/admin/entries", label: "エントリー" },
] as const;

/** 左サイドバーのナビゲーション（現在地をハイライト） */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="管理メニュー">
      <ul className="flex gap-1 overflow-x-auto md:flex-col">
        {items.map((it) => {
          const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-sm px-3 py-2 text-sm font-bold whitespace-nowrap",
                  active ? "bg-white text-black" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
