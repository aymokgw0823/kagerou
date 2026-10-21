"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * `prefers-reduced-motion: reduce` かどうか。
 * motion の `useReducedMotion()` はクライアント初回描画で即 true を返すためハイドレーション不一致になる。
 * こちらはサーバースナップショット（false）でハイドレーションしてから切り替わる。
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
