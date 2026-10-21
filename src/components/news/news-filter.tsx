"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { NewsSummary } from "@/lib/content/types";
import { newsCategories } from "@/lib/content/schema";
import { NewsList } from "@/components/home/news-list";
import { cn } from "@/lib/utils";

/** カテゴリーで絞り込むニュース一覧（URL同期） */
export function NewsFilter({ items }: { items: NewsSummary[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const cat = sp.get("category") ?? "";
  const filtered = cat ? items.filter((n) => n.category === cat) : items;
  function set(v: string) {
    const next = new URLSearchParams(sp.toString());
    if (v) next.set("category", v);
    else next.delete("category");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }
  return (
    <div>
      <ul className="mb-6 flex flex-wrap gap-1.5" role="group" aria-label="カテゴリー">
        {["", ...newsCategories].map((c) => (
          <li key={c}>
            <button
              type="button"
              aria-pressed={cat === c}
              onClick={() => set(c)}
              className={cn(
                "rounded-pill border px-4 py-1.5 text-xs font-bold",
                cat === c
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-2 hover:border-ink",
              )}
            >
              {c || "すべて"}{" "}
              <span className="font-display opacity-70">
                {c ? items.filter((n) => n.category === c).length : items.length}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {filtered.length ? (
        <NewsList items={filtered} />
      ) : (
        <p className="text-ink-3 py-10 text-center">該当するニュースはありません。</p>
      )}
    </div>
  );
}
