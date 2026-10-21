/**
 * i18n ルーティング設計。
 * - 既定ロケール（ja）はプレフィックスなし（/about）
 * - 英語は /en プレフィックス（/en, /en/about）。今回の実装範囲はトップと会社概要のみ。
 * - 追加ロケールは locales に足し、src/app/en/ と同じ構造でディレクトリを作る。
 */
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

/** 英語版が存在するパス（hreflang の生成に使用） */
export const localizedPaths: Record<string, Partial<Record<Locale, string>>> = {
  "/": { ja: "/", en: "/en" },
  "/about": { ja: "/about", en: "/en/about" },
};

export function localePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
