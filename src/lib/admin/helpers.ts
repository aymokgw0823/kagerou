/** 管理画面共通のユーティリティ（日付・検索パラメータ・表示整形） */

export type SearchParams = Record<string, string | string[] | undefined>;

/** searchParams から文字列を 1 つ取り出す（空文字は undefined） */
export function sp(params: SearchParams, key: string): string | undefined {
  const v = params[key];
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() !== "" ? s.trim() : undefined;
}

/** YYYY-MM-DD 形式のみ許可 */
export function ymd(value: string | undefined): string | undefined {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
}

/** JST の日付文字列（YYYY-MM-DD）をその日の 0:00（JST）の Date にする */
export function jstStart(date: string): Date {
  return new Date(`${date}T00:00:00+09:00`);
}

/** JST の日付文字列の翌日 0:00（JST）＝ to の排他的上限 */
export function jstNextDay(date: string): Date {
  const d = jstStart(date);
  return new Date(d.getTime() + 24 * 60 * 60 * 1000);
}

/** 今日の JST 日付（YYYY-MM-DD） */
export function todayJst(now = new Date()): string {
  return now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** 今日（JST）の 0:00 から n 日さかのぼった時刻 */
export function jstDaysAgo(days: number, now = new Date()): Date {
  return new Date(jstStart(todayJst(now)).getTime() - days * 24 * 60 * 60 * 1000);
}

/** from / to（YYYY-MM-DD, JST）から Prisma の createdAt 条件を作る */
export function dateRange(from?: string, to?: string): { gte?: Date; lt?: Date } | undefined {
  const f = ymd(from);
  const t = ymd(to);
  if (!f && !t) return undefined;
  return { ...(f ? { gte: jstStart(f) } : {}), ...(t ? { lt: jstNextDay(t) } : {}) };
}

/** ページ番号（1 以上の整数） */
export function pageNumber(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

const dt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** 2026/10/21 18:43 形式（JST） */
export function fmtDateTime(d: Date | null | undefined): string {
  return d ? dt.format(d) : "—";
}

export function truncate(s: string | null | undefined, n: number): string {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

export function fmtInt(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function pct(numerator: number, denominator: number): string {
  if (!denominator) return "—";
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

/** クエリ文字列を組み立てる（undefined は除外） */
export function qs(params: Record<string, string | number | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") u.set(k, String(v));
  const s = u.toString();
  return s ? `?${s}` : "";
}

export const businessLabel: Record<string, string> = { build: "建設", dining: "飲食", other: "その他" };
export const leadKindLabel: Record<string, string> = {
  contact: "お問い合わせ",
  "reform-pdf": "リフォームPDF",
  other: "その他",
};
export const bookingStatusLabel: Record<string, string> = {
  requested: "受付",
  confirmed: "確定",
  cancelled: "キャンセル",
};
export const consultationStatusLabel: Record<string, string> = {
  started: "開始",
  completed: "完了",
  failed: "失敗",
  abandoned: "離脱",
};
export const toolLabel: Record<string, string> = { reform: "リフォーム相談", concierge: "コンシェルジュ" };

export function label(map: Record<string, string>, key: string | null | undefined): string {
  if (!key) return "—";
  return map[key] ?? key;
}
