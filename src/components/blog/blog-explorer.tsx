"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { replaceUrlParams, useUrlParams } from "@/lib/use-url-params";
import type { BlogSummary } from "@/lib/content/types";
import {
  categories,
  challenges,
  contentBusinesses,
  industries,
  levels,
  levelLabel,
  businessLabel,
} from "@/lib/content/taxonomy";
import { search as ngramSearch, type SearchDoc } from "@/lib/search/ngram";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

type FacetKey = "business" | "category" | "industry" | "challenge" | "level" | "tag";
type Filters = Record<FacetKey, string[]>;
type Sort = "new" | "popular" | "reading";
type View = "grid" | "list";

const facetKeys: FacetKey[] = ["business", "category", "industry", "challenge", "level", "tag"];
const facetLabels: Record<FacetKey, string> = {
  business: "事業",
  category: "カテゴリー",
  industry: "業種",
  challenge: "課題",
  level: "難易度",
  tag: "タグ",
};

type Props = {
  posts: BlogSummary[];
  /** 固定するファセット（カテゴリー別・タグ別ページ） */
  locked?: Partial<Record<FacetKey, string>>;
  /** 使用中のタグ（多い順） */
  tags: { tag: string; count: number }[];
};

function valuesOf(post: BlogSummary, key: FacetKey): string[] {
  switch (key) {
    case "business":
      return [post.business];
    case "category":
      return [post.category];
    case "industry":
      return [post.industry];
    case "challenge":
      return [post.challenge];
    case "level":
      return [post.level];
    case "tag":
      return post.tags;
  }
}

function matches(post: BlogSummary, filters: Filters, except?: FacetKey): boolean {
  for (const key of facetKeys) {
    if (key === except) continue;
    const sel = filters[key];
    if (sel.length === 0) continue;
    const vals = valuesOf(post, key);
    if (!sel.some((s) => vals.includes(s))) return false;
  }
  return true;
}

function parseFilters(sp: URLSearchParams, locked?: Props["locked"]): Filters {
  const f = {} as Filters;
  for (const key of facetKeys) {
    const lockedValue = locked?.[key];
    f[key] = lockedValue
      ? [lockedValue]
      : sp
          .getAll(key)
          .flatMap((v) => v.split(","))
          .filter(Boolean);
  }
  return f;
}

let indexPromise: Promise<SearchDoc[]> | null = null;
function loadIndex(): Promise<SearchDoc[]> {
  if (!indexPromise) {
    indexPromise = fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: (SearchDoc & { type: string })[]) => rows.filter((r) => r.type === "blog"))
      .catch(() => []);
  }
  return indexPromise;
}

const sortOptions: { value: Sort; label: string }[] = [
  { value: "new", label: "新着順" },
  { value: "popular", label: "人気順" },
  { value: "reading", label: "読了時間順" },
];

export function BlogExplorer({ posts, locked, tags }: Props) {
  const sp = useUrlParams();

  const filters = useMemo(() => parseFilters(sp, locked), [sp, locked]);
  const q = sp.get("q") ?? "";
  const sort = (sp.get("sort") as Sort) || "new";
  const view = (sp.get("view") as View) || "grid";
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);

  const [input, setInput] = useState(q);
  // 検索結果は「どのクエリに対する結果か」を一緒に持ち、クエリが変わったら未取得扱いにする（effect 内の同期 setState を避ける）
  const [hitsState, setHitsState] = useState<{ q: string; map: Map<string, number> } | null>(null);
  const searchHits = q && hitsState?.q === q ? hitsState.map : null;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setInput(q);
  }

  // キーワード検索：インデックスを必要時に取得して bigram 検索
  useEffect(() => {
    if (!q) return;
    let active = true;
    loadIndex().then((docs) => {
      if (!active) return;
      setHitsState({ q, map: new Map(ngramSearch(docs, q).map((r) => [r.doc.slug, r.score])) });
    });
    return () => {
      active = false;
    };
  }, [q]);

  // ボトムシート表示中はスクロール固定
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheetOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  function update(mutate: (p: URLSearchParams) => void, opts: { resetPage?: boolean } = { resetPage: true }) {
    const next = new URLSearchParams(sp.toString());
    mutate(next);
    if (opts.resetPage) next.delete("page");
    for (const key of facetKeys) if (locked?.[key]) next.delete(key);
    replaceUrlParams(next);
  }

  function toggle(key: FacetKey, value: string) {
    update((p) => {
      const cur = p
        .getAll(key)
        .flatMap((v) => v.split(","))
        .filter(Boolean);
      const nextVals = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      p.delete(key);
      if (nextVals.length) p.set(key, nextVals.join(","));
    });
  }

  function clearAll() {
    update((p) => {
      for (const key of facetKeys) p.delete(key);
      p.delete("q");
    });
    setInput("");
  }

  // 検索でヒットしたものに絞る
  const searched = useMemo(() => {
    if (!q) return posts;
    if (!searchHits) return [];
    return posts.filter((p) => searchHits.has(p.slug));
  }, [posts, q, searchHits]);

  // フィルター適用
  const filtered = useMemo(() => searched.filter((p) => matches(p, filters)), [searched, filters]);

  // 並び替え
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (q && searchHits && sort === "new") {
      list.sort((a, b) => (searchHits.get(b.slug) ?? 0) - (searchHits.get(a.slug) ?? 0));
      return list;
    }
    switch (sort) {
      case "popular":
        list.sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || (a.publishedAt < b.publishedAt ? 1 : -1));
        break;
      case "reading":
        list.sort((a, b) => a.readingTime - b.readingTime || (a.publishedAt < b.publishedAt ? 1 : -1));
        break;
      default:
        list.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    }
    return list;
  }, [filtered, sort, q, searchHits]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // 各ファセットの選択肢と件数（他のファセットの条件を適用した上で数える）
  const options = useMemo(() => {
    const result = {} as Record<FacetKey, { value: string; label: string; count: number }[]>;
    const base = searched;
    const countFor = (key: FacetKey) => {
      const m = new Map<string, number>();
      for (const p of base) {
        if (!matches(p, filters, key)) continue;
        for (const v of valuesOf(p, key)) m.set(v, (m.get(v) ?? 0) + 1);
      }
      return m;
    };
    const biz = countFor("business");
    result.business = contentBusinesses.map((b) => ({
      value: b.id,
      label: b.label,
      count: biz.get(b.id) ?? 0,
    }));
    const cat = countFor("category");
    const bizSel = filters.business.length ? filters.business : contentBusinesses.map((b) => b.id);
    result.category = bizSel
      .flatMap((b) => categories[b as keyof typeof categories] ?? [])
      .map((c) => ({ value: c, label: c, count: cat.get(c) ?? 0 }));
    const ind = countFor("industry");
    result.industry = industries.map((i) => ({ value: i, label: i, count: ind.get(i) ?? 0 }));
    const ch = countFor("challenge");
    result.challenge = challenges.map((c) => ({ value: c, label: c, count: ch.get(c) ?? 0 }));
    const lv = countFor("level");
    result.level = levels.map((l) => ({ value: l.id, label: l.label, count: lv.get(l.id) ?? 0 }));
    const tg = countFor("tag");
    result.tag = tags.slice(0, 30).map((t) => ({ value: t.tag, label: t.tag, count: tg.get(t.tag) ?? 0 }));
    return result;
  }, [searched, filters, tags]);

  const activeCount = facetKeys.reduce((n, k) => n + (locked?.[k] ? 0 : filters[k].length), 0) + (q ? 1 : 0);
  const resultsRef = useRef<HTMLDivElement>(null);

  function goPage(n: number) {
    update((p) => p.set("page", String(n)), { resetPage: false });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const facetPanel = (
    <div className="space-y-7">
      {facetKeys
        .filter((key) => !locked?.[key])
        .map((key) => (
          <fieldset key={key}>
            <legend className="mb-2 text-sm font-bold">{facetLabels[key]}</legend>
            <ul className={cn("flex flex-wrap gap-1.5", key === "tag" && "max-h-48 overflow-y-auto")}>
              {options[key].map((o) => {
                const checked = filters[key].includes(o.value);
                const disabled = o.count === 0 && !checked;
                return (
                  <li key={o.value}>
                    <label
                      className={cn(
                        "rounded-pill inline-flex cursor-pointer items-center gap-1.5 border px-3 py-1 text-xs font-bold transition-colors",
                        checked
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-paper text-ink-2 hover:border-ink hover:text-ink",
                        disabled && "hover:border-line hover:text-ink-2 cursor-not-allowed opacity-40",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggle(key, o.value)}
                      />
                      {o.label}
                      <span
                        className={cn("font-display tabular-nums", checked ? "text-paper/70" : "text-ink-3")}
                      >
                        {o.count}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* 左：フィルター（PC） */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-base font-bold">絞り込み</p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-link text-xs font-bold hover:underline"
              >
                条件をクリア
              </button>
            )}
          </div>
          {facetPanel}
        </div>
      </aside>

      {/* 右：検索・並び替え・一覧 */}
      <div ref={resultsRef} className="scroll-mt-24 lg:col-span-9">
        <form
          role="search"
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            update((p) => (input.trim() ? p.set("q", input.trim()) : p.delete("q")));
          }}
        >
          <label className="sr-only" htmlFor="blog-q">
            キーワード検索
          </label>
          <input
            id="blog-q"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="キーワードで探す（例：外壁 ひび割れ）"
            className="rounded-pill border-line bg-paper focus:border-ink min-h-11 flex-1 border px-5 text-sm"
          />
          <button type="submit" className="btn-base bg-ink text-paper hover:bg-link shrink-0 px-5">
            検索
          </button>
        </form>

        <div className="border-line mt-4 flex flex-col gap-3 border-b pb-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn-base border-ink text-ink min-h-10 px-4 text-xs"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.75}>
                <path d="M2 4h12M4 8h8M6 12h4" />
              </svg>
              絞り込み
              {activeCount > 0 && (
                <span className="rounded-pill bg-accent font-display text-accent-ink ml-1 px-1.5 text-xs">
                  {activeCount}
                </span>
              )}
            </button>
            <label className="text-ink-3 text-xs sm:hidden">
              <span className="sr-only">並び替え</span>
              <select
                value={sort}
                onChange={(e) => update((p) => p.set("sort", e.target.value))}
                className="rounded-pill border-line bg-paper text-ink border px-3 py-2 text-xs font-bold"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="text-ink-2 text-sm" aria-live="polite">
            <span className="font-display text-ink text-lg font-bold">{posts.length}</span> 件中{" "}
            <span className="font-display text-ink text-lg font-bold">{sorted.length}</span> 件を表示
            {q && (
              <span className="ml-2">
                「{q}」の検索結果
                {!searchHits && <span className="text-ink-3 ml-1">（検索中…）</span>}
              </span>
            )}
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-link ml-3 text-xs font-bold hover:underline"
              >
                条件をクリア
              </button>
            )}
          </p>
          {/* 並び替え・表示切り替え（sm 以上。スマホは上の行に並び替えだけ出し、カードは常にコンパクト表示） */}
          <div className="hidden items-center gap-3 sm:flex">
            <label className="text-ink-3 text-xs">
              並び替え
              <select
                value={sort}
                onChange={(e) => update((p) => p.set("sort", e.target.value))}
                className="rounded-pill border-line bg-paper text-ink ml-2 border px-3 py-1.5 text-xs font-bold"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div
              className="rounded-pill border-line inline-flex overflow-hidden border"
              role="group"
              aria-label="表示切り替え"
            >
              {(["grid", "list"] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => update((p) => p.set("view", v), { resetPage: false })}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold",
                    view === v ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {v === "grid" ? "グリッド" : "リスト"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="text-ink-2 py-20 text-center">
            <p>条件に合う記事が見つかりませんでした。</p>
            <button
              type="button"
              onClick={clearAll}
              className="text-link mt-4 text-sm font-bold hover:underline"
            >
              条件をクリアする
            </button>
          </div>
        ) : (
          <>
            <h2 className="sr-only">記事一覧</h2>
            <ul
              className={cn(
                "mt-6 grid gap-5",
                view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}
            >
              {pageItems.map((p, i) => (
                <li key={p.slug}>
                  <PostCard post={p} view={view} priority={i < 3} />
                </li>
              ))}
            </ul>
          </>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="ページネーション"
            className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
          >
            <button
              type="button"
              disabled={current <= 1}
              onClick={() => goPage(current - 1)}
              className="btn-base border-line min-h-9 px-3 text-xs disabled:opacity-40"
            >
              前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - current) <= 2)
              .reduce<(number | "…")[]>((acc, n) => {
                const last = acc[acc.length - 1];
                if (typeof last === "number" && n - last > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className="text-ink-3 px-1">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    aria-current={n === current ? "page" : undefined}
                    onClick={() => goPage(n)}
                    className={cn(
                      "rounded-pill font-display h-9 min-w-9 px-2 text-sm font-bold",
                      n === current ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2",
                    )}
                  >
                    {n}
                  </button>
                ),
              )}
            <button
              type="button"
              disabled={current >= totalPages}
              onClick={() => goPage(current + 1)}
              className="btn-base border-line min-h-9 px-3 text-xs disabled:opacity-40"
            >
              次へ
            </button>
          </nav>
        )}
      </div>

      {/* スマホ：ボトムシート */}
      <div hidden={!sheetOpen} className="fixed inset-0 z-50 lg:hidden">
        <button
          type="button"
          aria-label="閉じる"
          onClick={() => setSheetOpen(false)}
          className="absolute inset-0 bg-black/50"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="絞り込み"
          className="bg-paper shadow-card absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-2xl p-5 pb-[calc(6rem+var(--safe-b))]"
        >
          <div className="rounded-pill bg-line mx-auto mb-4 h-1 w-10" aria-hidden />
          <div className="mb-5 flex items-center justify-between">
            <p className="text-base font-bold">絞り込み</p>
            <button type="button" onClick={clearAll} className="text-link text-xs font-bold">
              条件をクリア
            </button>
          </div>
          {facetPanel}
          <div className="border-line bg-paper fixed inset-x-0 bottom-0 border-t p-4 pb-[calc(1rem+var(--safe-b))]">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="btn-base bg-link text-link-ink min-h-12 w-full"
            >
              {sorted.length} 件を表示
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function businessChipLabel(id: string) {
  return businessLabel(id as "build");
}
export { levelLabel };
