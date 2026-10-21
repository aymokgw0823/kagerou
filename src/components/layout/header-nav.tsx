"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/button";

type Props = {
  items: NavItem[];
  ctas: { contact: { label: string; href: string }; booking: { label: string; href: string } };
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** デスクトップ：ドロップダウン付きの1項目 */
function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLLIElement>(null);
  const active = isActive(pathname, item.href);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const linkClass = cn(
    "relative inline-flex h-header items-center text-[0.9rem] tracking-[0.04em] text-ink-2 transition-colors duration-300 ease-brand hover:text-ink",
    "after:absolute after:inset-x-0 after:bottom-5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 after:ease-brand hover:after:scale-x-100",
    active && "text-ink after:scale-x-100",
  );

  if (!item.children) {
    return (
      <li>
        <Link href={item.href} className={linkClass} aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="flex items-center">
        <Link href={item.href} className={linkClass} aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${item.label}のメニューを${open ? "閉じる" : "開く"}`}
          // マウス操作では hover で既に開いているため閉じない。キーボード操作（detail === 0）ではトグルする
          onClick={(e) => (e.detail === 0 ? setOpen((v) => !v) : setOpen(true))}
          className="text-ink-3 hover:text-ink ml-1 inline-flex h-8 w-6 items-center justify-center"
        >
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M3 6l5 5 5-5" />
          </svg>
        </button>
      </div>
      <div
        id={panelId}
        hidden={!open}
        className="border-line bg-paper absolute top-full left-1/2 w-[36rem] -translate-x-1/2 border p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)]"
      >
        <ul className="grid grid-cols-2 gap-px">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                onClick={() => setOpen(false)}
                className="group ease-brand hover:bg-paper-2 block px-5 py-4 transition-colors duration-300"
              >
                <span className="text-ink flex items-center justify-between text-[0.95rem]">
                  {c.label}
                  <Arrow className="text-ink-3 h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                {c.description && <span className="text-ink-3 mt-1 block text-xs">{c.description}</span>}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-ink-2 link-underline hover:text-ink block px-5 py-4 text-sm"
            >
              事業一覧を見る
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
}

export function HeaderNav({ items, ctas }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerId = useId();

  // ルート遷移で閉じる（描画中に前回の pathname と比較して state を調整する）
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // ドロワー表示中はスクロールを固定し、Escape で閉じる
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label="グローバルナビゲーション" className="hidden lg:block">
        <ul className="flex items-center gap-7">
          {items.map((item) => (
            <DesktopItem key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </nav>
      <div className="hidden items-center gap-3 lg:flex">
        <Link
          href={ctas.contact.href}
          className="text-ink-2 link-underline hover:text-ink text-[0.9rem] tracking-[0.04em]"
        >
          {ctas.contact.label}
        </Link>
        <Link
          href={ctas.booking.href}
          className="btn-base border-ink bg-ink text-paper hover:border-accent hover:bg-accent hover:text-accent-ink min-h-10 px-5 text-[0.85rem]"
        >
          {ctas.booking.label}
          <Arrow className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        className="text-ink inline-flex h-11 w-11 items-center justify-center lg:hidden"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="relative block h-4 w-6">
          <span
            className={cn(
              "ease-brand absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500",
              open && "translate-y-[7.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute inset-x-0 top-1/2 h-px bg-current transition-opacity duration-300",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "ease-brand absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500",
              open && "-translate-y-[7.5px] -rotate-45",
            )}
          />
        </span>
      </button>

      {/* Mobile drawer */}
      <div
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        hidden={!open}
        className="top-header bg-paper fixed inset-x-0 bottom-0 z-40 overflow-y-auto lg:hidden"
      >
        <nav aria-label="モバイルナビゲーション" className="container-max py-6">
          <ul className="divide-line border-line divide-y border-y">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between py-5 text-lg",
                    isActive(pathname, item.href) ? "text-ink" : "text-ink-2",
                  )}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {item.labelEn && (
                    <span className="font-display text-ink-3 text-base italic">{item.labelEn}</span>
                  )}
                </Link>
                {item.children && (
                  <ul className="mb-4 grid grid-cols-1 gap-px pl-4 sm:grid-cols-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="text-ink-2 hover:text-ink block py-2.5 text-[0.95rem]">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link href={ctas.booking.href} className="btn-base border-ink bg-ink text-paper justify-between">
              {ctas.booking.label}
              <Arrow />
            </Link>
            <Link href={ctas.contact.href} className="btn-base justify-between">
              {ctas.contact.label}
              <Arrow />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
