/**
 * 差し替えが必要な箇所を一覧で出すチェックスクリプト。
 *
 *   npm run check:dummy            … 一覧を表示（終了コード 0）
 *   npm run check:dummy -- --strict … 1件でもあれば終了コード 1（CI 用）
 *   CHECK_DUMMY_STRICT=1           … 同上
 *
 * 検出対象
 *   1. 【要差し替え】など【…】形式の未確定値（src/, content/）
 *   2. `isDummy: true` のデータ（src/, content/ の frontmatter）
 *   3. 実写真が未設定の写真カット（photo-manifest の src 未設定）
 *
 * `prebuild` からも呼ばれ、本番ビルド時に警告を出す（build 自体は止めない）。
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { photoManifest } from "../src/config/photo-manifest";
import { company } from "../src/config/company";

export type Finding = { file: string; line: number; text: string };
export type Report = {
  /** company.ts の値のうち【…】を含むもの（キーのパスで示す） */
  companyPlaceholders: string[];
  /** company.ts の値のうち isDummy: true のもの */
  companyDummies: string[];
  placeholders: Finding[];
  dummies: Finding[];
  placeholderPhotos: { id: string; label: string }[];
};

const SCAN_DIRS = ["src", "content"];
const EXT = new Set([".ts", ".tsx", ".md", ".mdx", ".json", ".yml", ".yaml"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", "__tests__", "generated"]);
/** company.ts は文字列検索ではなく値を直接走査する（PLACEHOLDER 定数経由の値を漏らさないため） */
const RUNTIME_SCANNED = new Set(["src/config/company.ts"]);
const PLACEHOLDER_RE = /【[^】]*】/;
// 型定義（isDummy: true;）は除外し、データの isDummy: true だけ拾う
const DUMMY_RE = /\bisDummy\s*[:=]\s*true\b(?!\s*;)/;

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (IGNORE_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.has(p.slice(p.lastIndexOf(".")))) out.push(p);
  }
  return out;
}

/** 定義そのものや説明文（コメント）は除外する */
function isDefinitionOrComment(line: string): boolean {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    /\bPLACEHOLDER\s*=\s*"/.test(t) ||
    /\bPLACEHOLDER_RE\b|\bPATTERN\b|\bDUMMY_RE\b/.test(t) ||
    /isPlaceholder\(|title="未確定/.test(t) ||
    /【\[\^】\]\*】/.test(t) // 正規表現リテラル
  );
}

/** オブジェクトを再帰的に走査し、【…】を含む文字列と isDummy: true をパス付きで集める */
export function walkValues(
  value: unknown,
  path: string,
  out: { placeholders: string[]; dummies: string[] },
  seen = new Set<unknown>(),
): void {
  if (typeof value === "string") {
    if (PLACEHOLDER_RE.test(value)) out.placeholders.push(`${path} = ${JSON.stringify(value)}`);
    return;
  }
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((v, i) => walkValues(v, `${path}[${i}]`, out, seen));
    return;
  }
  const obj = value as Record<string, unknown>;
  if (obj.isDummy === true) out.dummies.push(path);
  for (const key of Object.keys(obj)) {
    // getter（address.full など）は評価せず元の値だけ見る
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc && typeof desc.get === "function") continue;
    walkValues(obj[key], `${path}.${key}`, out, seen);
  }
}

export function scan(root: string): Report {
  const report: Report = {
    companyPlaceholders: [],
    companyDummies: [],
    placeholders: [],
    dummies: [],
    placeholderPhotos: [],
  };
  const companyOut = { placeholders: [] as string[], dummies: [] as string[] };
  walkValues(company, "company", companyOut);
  report.companyPlaceholders = companyOut.placeholders;
  report.companyDummies = companyOut.dummies;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(join(root, dir))) {
      const rel = relative(root, file);
      if (RUNTIME_SCANNED.has(rel)) continue;
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((text, i) => {
        if (isDefinitionOrComment(text)) return;
        if (PLACEHOLDER_RE.test(text))
          report.placeholders.push({ file: rel, line: i + 1, text: text.trim() });
        if (DUMMY_RE.test(text)) report.dummies.push({ file: rel, line: i + 1, text: text.trim() });
      });
    }
  }
  for (const shot of photoManifest) {
    if (!shot.src) report.placeholderPhotos.push({ id: shot.id, label: shot.label });
  }
  return report;
}

export function format(report: Report): string {
  const out: string[] = [];
  const total = countTotal(report);
  out.push("");
  out.push("━━━ check-dummy：公開前に差し替えが必要な箇所 ━━━");
  out.push("");
  out.push(`■ src/config/company.ts の未確定値：${report.companyPlaceholders.length} 件`);
  for (const p of report.companyPlaceholders) out.push(`  ${p}`);
  out.push("");
  out.push(`■ src/config/company.ts のダミーデータ：${report.companyDummies.length} 件`);
  for (const p of report.companyDummies) out.push(`  ${p}`);
  out.push("");
  out.push(`■ その他ファイルの【要差し替え】など未確定値：${report.placeholders.length} 件`);
  for (const f of report.placeholders) out.push(`  ${f.file}:${f.line}  ${trunc(f.text)}`);
  out.push("");
  out.push(`■ その他ファイルの isDummy: true：${report.dummies.length} 件`);
  for (const f of report.dummies) out.push(`  ${f.file}:${f.line}  ${trunc(f.text)}`);
  out.push("");
  out.push(`■ ダミー画像のまま（実写真未設定）：${report.placeholderPhotos.length} 件`);
  for (const p of report.placeholderPhotos) out.push(`  ${p.id}  ${p.label}`);
  out.push("");
  out.push(
    total === 0 ? "✔ 差し替えが必要な箇所はありません。" : `⚠ 合計 ${total} 件。公開前に差し替えてください。`,
  );
  out.push("");
  return out.join("\n");
}

export function countTotal(r: Report): number {
  return (
    r.companyPlaceholders.length +
    r.companyDummies.length +
    r.placeholders.length +
    r.dummies.length +
    r.placeholderPhotos.length
  );
}

function trunc(s: string, n = 90): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function main() {
  const root = join(import.meta.dirname, "..");
  const strict = process.argv.includes("--strict") || process.env.CHECK_DUMMY_STRICT === "1";
  const report = scan(root);
  const total = countTotal(report);
  console.log(format(report));
  if (strict && total > 0) {
    console.error("check-dummy: --strict のため終了コード 1 で終了します。");
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
