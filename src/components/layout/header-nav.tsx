"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/config/site";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { Arrow } from "@/components/ui/button";

type Props = {
  items: NavItem[];
  ctas: { contact: { label: string; href: string }; booking: { label: string; href: string } };
  locale?: Locale;
};

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Chevron({ open }: { open?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}

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
    "relative inline-flex h-header items-center text-[0.875rem] font-bold text-white/90 transition-colors duration-300 hover:text-white",
    "after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-brand hover:after:scale-x-100",
    active && "text-white after:scale-x-100",
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
          onClick={(e) => (e.detail === 0 ? setOpen((v) => !v) : setOpen(true))}
          className="ml-1 inline-flex h-8 w-6 items-center justify-center text-white/70 hover:text-white"
        >
          <Chevron open={open} />
        </button>
      </div>
      <div
        id={panelId}
        hidden={!open}
        className="border-accent bg-paper text-ink shadow-card absolute top-full left-1/2 w-[40rem] -translate-x-1/2 border-t-4 p-2"
      >
        <ul className="grid grid-cols-2 gap-px">
          {item.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                onClick={() => setOpen(false)}
                className="group rounded-brand hover:bg-paper-2 block px-5 py-4 transition-colors duration-300"
              >
                <span className="flex items-center justify-between text-[0.9375rem] font-bold">
                  {c.label}
                  <Arrow className="text-link h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
                {c.description && <span className="text-ink-3 mt-1 block text-xs">{c.description}</span>}
              </Link>
            </li>
          ))}
          <li className="flex items-center">
            <Link href={item.href} onClick={() => setOpen(false)} className="link-arrow text-link px-5 py-4">
              {item.label}一覧を見る
              <Arrow />
            </Link>
          </li>
        </ul>
      </div>
    </li>
  );
}

export function HeaderNav({ items, ctas, locale = "ja" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerId = useId();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

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

  const langSwitch =
    locale === "en" ? (
      <Link href="/" className="text-xs font-bold text-white/70 hover:text-white" lang="ja">
        日本語
      </Link>
    ) : (
      <Link href="/en" className="font-display text-xs font-bold text-white/70 hover:text-white" lang="en">
        EN
      </Link>
    );

  return (
    <>
      <nav aria-label="グローバルナビゲーション" className="hidden lg:block">
        <ul className="flex items-center gap-7">
          {items.map((item) => (
            <DesktopItem key={item.href} item={item} pathname={pathname} />
          ))}
        </ul>
      </nav>
      <div className="hidden items-center gap-5 lg:flex">
        {langSwitch}
        <Link
          href={ctas.contact.href}
          className="text-[0.875rem] font-bold text-white/90 hover:text-white hover:underline hover:underline-offset-4"
        >
          {ctas.contact.label}
        </Link>
        <Link
          href={ctas.booking.href}
          className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-9 px-4 text-[0.8125rem]"
        >
          {ctas.booking.label}
        </Link>
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        {langSwitch}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center text-white"
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={cn(
                "ease-brand absolute inset-x-0 top-0 h-0.5 bg-current transition-transform duration-500",
                open && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-current transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "ease-brand absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform duration-500",
                open && "-translate-y-[7px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <div
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        hidden={!open}
        className="top-header bg-paper text-ink fixed inset-x-0 bottom-0 z-40 overflow-y-auto lg:hidden"
      >
        <nav aria-label="モバイルナビゲーション" className="container-max py-4">
          <ul className="divide-line border-line divide-y border-b">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-4 text-base font-bold"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  {item.labelEn && (
                    <span className="font-display text-ink-3 text-xs font-bold tracking-wider uppercase">
                      {item.labelEn}
                    </span>
                  )}
                </Link>
                {item.children && (
                  <ul className="mb-3 grid grid-cols-1 gap-px pl-4 sm:grid-cols-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="text-ink-2 hover:text-link block py-2 text-[0.9375rem]"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={ctas.booking.href} className="btn-base bg-link text-link-ink">
              {ctas.booking.label}
            </Link>
            <Link href={ctas.contact.href} className="btn-base border-ink text-ink">
              {ctas.contact.label}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
