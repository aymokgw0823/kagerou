"use client";

import { useMemo } from "react";
import { replaceUrlParams, useUrlParams } from "@/lib/use-url-params";
import Link from "next/link";
import type { WorkSummary } from "@/lib/content/types";
import { businesses } from "@/config/businesses";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Key = "business" | "industry" | "challenge" | "region";
const keys: Key[] = ["business", "industry", "challenge", "region"];
const labels: Record<Key, string> = { business: "事業", industry: "業種", challenge: "課題", region: "地域" };

/** 実績一覧のフィルター（単一選択・URL同期） */
export function WorksExplorer({ works }: { works: WorkSummary[] }) {
  const sp = useUrlParams();
  const sel = Object.fromEntries(keys.map((k) => [k, sp.get(k) ?? ""])) as Record<Key, string>;

  const filtered = useMemo(
    () => works.filter((w) => keys.every((k) => !sel[k] || w[k] === sel[k])),
    [works, sel],
  );

  function set(key: Key, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value && sel[key] !== value) next.set(key, value);
    else next.delete(key);
    replaceUrlParams(next);
  }

  const options = (key: Key) => {
    const m = new Map<string, number>();
    for (const w of works)
      if (keys.every((k) => k === key || !sel[k] || w[k] === sel[k])) m.set(w[key], (m.get(w[key]) ?? 0) + 1);
    const vals = key === "business" ? businesses.map((b) => b.id) : [...new Set(works.map((w) => w[key]))];
    return vals.map((v) => ({
      value: v,
      label: key === "business" ? (businesses.find((b) => b.id === v)?.nameJa ?? v) : v,
      count: m.get(v) ?? 0,
    }));
  };

  const active = keys.filter((k) => sel[k]).length;

  return (
    <div>
      <div className="rounded-brand bg-paper-2 space-y-4 p-5">
        {keys.map((key) => (
          <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <p className="text-ink-3 w-20 shrink-0 pt-1 text-xs font-bold">{labels[key]}</p>
            <ul className="flex flex-wrap gap-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => set(key, "")}
                  className={cn(
                    "rounded-pill border px-3 py-1 text-xs font-bold",
                    !sel[key]
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-paper text-ink-2 hover:border-ink",
                  )}
                >
                  すべて
                </button>
              </li>
              {options(key).map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    disabled={o.count === 0 && sel[key] !== o.value}
                    aria-pressed={sel[key] === o.value}
                    onClick={() => set(key, o.value)}
                    className={cn(
                      "rounded-pill border px-3 py-1 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40",
                      sel[key] === o.value
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink-2 hover:border-ink",
                    )}
                  >
                    {o.label} <span className="font-display opacity-70">{o.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-ink-2 mt-5 text-sm" aria-live="polite">
        <span className="font-display text-ink text-lg font-bold">{works.length}</span> 件中{" "}
        <span className="font-display text-ink text-lg font-bold">{filtered.length}</span> 件を表示
        {active > 0 && (
          <Link
            href="/works"
            replace
            scroll={false}
            className="text-link ml-3 text-xs font-bold hover:underline"
          >
            条件をクリア
          </Link>
        )}
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <li key={w.slug}>
            <Card
              title={w.title}
              description={w.summary}
              href={`/works/${w.slug}`}
              photoId={w.photoId}
              isDummy={w.isDummy}
              accentVar={`--color-biz-${w.business}`}
              meta={
                <>
                  <span className="text-ink-2 font-bold">{w.client}</span>
                  <span>｜</span>
                  <span>{w.industry}</span>
                  <span>｜</span>
                  <span>{w.region}</span>
                </>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
