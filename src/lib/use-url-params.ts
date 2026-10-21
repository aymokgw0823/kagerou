"use client";

import { useSyncExternalStore } from "react";

/**
 * URL クエリを読み書きする軽量フック。
 * `useSearchParams()` は静的ページで Suspense による CSR バウンダリを要求し、SSR 時に本文が空になるため、
 * 代わりに window.location を購読する。SSR のスナップショットは空（フィルターなしの状態を描画）。
 * 書き込みは history.replaceState（Next のルーターと同期される）。
 */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}
const getSnapshot = () => window.location.search;
const getServerSnapshot = () => "";

export function useUrlParams(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return new URLSearchParams(search);
}

/** クエリを置き換える（履歴は増やさない） */
export function replaceUrlParams(next: URLSearchParams, opts: { scrollTop?: boolean } = {}) {
  const qs = next.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((cb) => cb());
  if (opts.scrollTop) window.scrollTo({ top: 0 });
}
