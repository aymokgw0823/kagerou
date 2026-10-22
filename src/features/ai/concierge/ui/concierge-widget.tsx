"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { readSse } from "@/features/ai/shared/sse";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Source = { n: number; title: string; url: string; type: string };
type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  pending?: boolean;
  grounded?: boolean;
};

const QUICK = [
  "外壁の塗り替え時期の目安は？",
  "店舗の営業時間を教えて",
  "現地調査は無料ですか？",
  "貸切はできますか？",
];

/** 本文中の【n】を資料リンクに、/path を内部リンクに変換して描画 */
function renderAnswer(text: string, sources: Source[]) {
  const parts = text.split(/(【\d+】|\/[a-z][a-z0-9\-/]*)/g);
  return parts.map((p, i) => {
    const m = /^【(\d+)】$/.exec(p);
    if (m) {
      const s = sources.find((x) => x.n === Number(m[1]));
      return s ? (
        <Link
          key={i}
          href={s.url}
          className="rounded-pill bg-tint text-link mx-0.5 inline-flex items-center px-1.5 text-[10px] font-bold hover:underline"
          title={s.title}
        >
          {m[1]}
        </Link>
      ) : (
        <span key={i}>{p}</span>
      );
    }
    if (/^\/[a-z]/.test(p) && p.length > 1) {
      return (
        <Link key={i} href={p} className="link-underline">
          {p}
        </Link>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // スマホでは全画面シートになるので、背面のスクロールを止める
    const mobile = window.matchMedia("(max-width: 39.9375rem)").matches;
    const prevOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      if (mobile) document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setError(null);
    setInput("");
    const history = msgs.filter((m) => !m.pending).map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "", pending: true }]);
    setBusy(true);
    track({ name: "concierge_message" });
    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: history.slice(-10) }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j.message ?? "エラーが発生しました。");
      }
      let sources: Source[] = [];
      await readSse(res, (e) => {
        if (e.event === "sources") sources = e.data as Source[];
        else if (e.event === "delta") {
          const t = (e.data as { text: string }).text;
          setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, content: x.content + t } : x)));
        } else if (e.event === "done") {
          const d = e.data as { answer: string; sources: Source[]; grounded: boolean };
          setMsgs((m) =>
            m.map((x, i) =>
              i === m.length - 1
                ? { role: "assistant", content: d.answer, sources: d.sources, grounded: d.grounded }
                : x,
            ),
          );
        } else if (e.event === "error") throw new Error((e.data as { message: string }).message);
      });
      void sources;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
      setMsgs((m) => m.filter((x) => !x.pending));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "rounded-pill shadow-card fixed right-4 bottom-[calc(1rem+var(--safe-b))] z-30 flex h-13 items-center gap-2 bg-black px-5 text-sm font-bold text-white transition-transform hover:scale-[1.03] md:right-6 md:bottom-6 md:h-14",
          open && "max-sm:hidden",
        )}
      >
        <span aria-hidden className="bg-accent h-2.5 w-2.5 rounded-full" />
        {open ? "閉じる" : "質問する"}
      </button>
      <div
        id={panelId}
        role="dialog"
        aria-label="AIコンシェルジュ"
        hidden={!open}
        className={cn(
          "bg-paper fixed z-[60] flex flex-col overflow-hidden",
          // スマホ：全画面シート
          "inset-0 h-[100dvh]",
          // sm 以上：右下のパネル
          "sm:border-line sm:shadow-card sm:inset-auto sm:right-4 sm:bottom-20 sm:h-auto sm:max-h-[min(36rem,calc(100dvh-7rem))] sm:w-96 sm:rounded-2xl sm:border md:right-6 md:bottom-24",
        )}
      >
        <div className="border-line flex items-start justify-between gap-3 border-b bg-black px-4 py-3 text-white max-sm:pt-[calc(0.75rem+var(--safe-t))]">
          <div>
            <p className="text-sm font-bold">AIコンシェルジュ</p>
            <p className="text-[11px] text-white/70">
              サイト内の情報をもとにお答えします。個人情報は入力しないでください。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="チャットを閉じる"
            className="-mr-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto p-4 text-sm"
          aria-live="polite"
          aria-busy={busy}
        >
          {msgs.length === 0 && (
            <div>
              <p className="text-ink-2">
                工事のこと、店舗のこと、採用のこと。サイトに載っている範囲でお答えします。根拠のページへのリンク付きでご案内します。
              </p>
              <ul className="mt-3 space-y-1.5">
                {QUICK.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => send(q)}
                      className="rounded-brand border-line hover:border-ink w-full border px-3 py-2.5 text-left text-[0.8125rem]"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 leading-[1.7] whitespace-pre-wrap",
                  m.role === "user" ? "bg-link text-link-ink" : "bg-paper-2",
                )}
              >
                {m.role === "assistant" ? (
                  <>
                    {m.content ? (
                      renderAnswer(m.content, m.sources ?? [])
                    ) : (
                      <span className="text-ink-3 animate-pulse">考えています…</span>
                    )}
                    {m.sources && m.sources.length > 0 && (
                      <ul className="border-line mt-2 space-y-1 border-t pt-2 text-xs">
                        {m.sources.map((s) => (
                          <li key={s.n}>
                            <Link href={s.url} className="text-link hover:underline">
                              【{s.n}】{s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          {error && (
            <p role="alert" className="text-danger text-xs font-bold">
              {error}
            </p>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-line flex gap-2 border-t p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder="質問を入力（500字まで）"
            aria-label="質問"
            className="rounded-pill border-line focus:border-ink min-h-11 min-w-0 flex-1 border px-4 text-sm focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn-base bg-link text-link-ink min-h-11 px-4 text-xs disabled:opacity-50"
          >
            送信
          </button>
        </form>
        <p className="border-line text-ink-3 border-t px-3 py-1.5 pb-[calc(0.375rem+var(--safe-b))] text-[10px]">
          AIによる回答は参考情報です。正確な内容は各ページまたはお問い合わせでご確認ください。
        </p>
      </div>
    </>
  );
}
