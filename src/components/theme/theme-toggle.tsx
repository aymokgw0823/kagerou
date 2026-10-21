"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "ライト" },
  { value: "system", label: "自動" },
  { value: "dark", label: "ダーク" },
];

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("theme");
    return t === "dark" || t === "light" ? t : "system";
  } catch {
    return "system";
  }
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
const getServerSnapshot = (): Theme => "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    try {
      localStorage.removeItem("theme");
    } catch {}
  } else {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }
  listeners.forEach((cb) => cb());
}

/** テーマ切り替え（ライト／自動／ダーク）。フッターに置く */
export function ThemeToggle({ className }: { className?: string }) {
  // SSR では "system"、クライアントでは localStorage の値を購読する（effect 内 setState を避ける）
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  return (
    <fieldset className={cn("border-line inline-flex items-center gap-px border", className)}>
      <legend className="sr-only">表示テーマ</legend>
      {options.map((o) => (
        <label
          key={o.value}
          className={cn(
            "ease-brand cursor-pointer px-3 py-1.5 text-xs tracking-wider transition-colors duration-300",
            theme === o.value ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
          )}
        >
          <input
            type="radio"
            name="theme"
            value={o.value}
            checked={theme === o.value}
            onChange={() => applyTheme(o.value)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}
