"use client";

/**
 * トップのヒーロー背景。
 * SSR ではフォールバック（静的 SVG）を出し、クライアントで条件を満たす場合だけ 3D（hero-3d）を遅延読み込みする。
 * 3D を描画しない条件：
 * - WebGL が使えない
 * - prefers-reduced-motion: reduce
 * - navigator.connection.saveData
 * - navigator.hardwareConcurrency <= 2
 * - navigator.deviceMemory <= 2（存在する場合）
 */

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { HeroFallback } from "./hero-fallback";
import { cn } from "@/lib/utils";

const Hero3D = dynamic(() => import("./hero-3d"), { ssr: false, loading: () => null });

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

function detect3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(REDUCED_MQ).matches) return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  return true;
}

let cached: boolean | null = null;
const getSnapshot = () => (cached ??= detect3D());
const getServerSnapshot = () => false;
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MQ);
  const handler = () => {
    cached = null;
    onChange();
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

// 3D チャンク（three.js）の読み込みは、ページの load 後のアイドル時まで遅らせる（LCP / TBT を守る）
let idle = false;
let idleScheduled = false;
const idleListeners = new Set<() => void>();
function scheduleIdle() {
  if (idleScheduled) return;
  idleScheduled = true;
  const fire = () => {
    idle = true;
    idleListeners.forEach((l) => l());
  };
  const run = () => {
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(fire, { timeout: 3000 });
    else window.setTimeout(fire, 1500);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}
function subscribeIdle(cb: () => void) {
  idleListeners.add(cb);
  if (!idle) scheduleIdle();
  return () => {
    idleListeners.delete(cb);
  };
}
const getIdle = () => idle;
const getIdleServer = () => false;

export function HeroScene() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const idleReady = useSyncExternalStore(subscribeIdle, getIdle, getIdleServer);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const show3D = enabled && ready;

  return (
    <div aria-hidden className="absolute inset-0 -z-10 bg-black">
      <HeroFallback
        className={cn(
          "ease-brand absolute inset-0 h-full w-full transition-opacity duration-1000",
          show3D && "opacity-0",
        )}
      />
      {enabled && idleReady && (
        <div
          className={cn(
            "ease-brand absolute inset-0 transition-opacity duration-1000",
            show3D ? "opacity-100" : "opacity-0",
          )}
        >
          <Hero3D onReady={onReady} />
        </div>
      )}
    </div>
  );
}
