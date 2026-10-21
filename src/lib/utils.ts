/** クラス名の結合（falsy を除外） */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** 絶対URLを組み立てる */
export function absoluteUrl(path: string, base: string): string {
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}
