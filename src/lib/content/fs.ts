/**
 * content/ 配下の Markdown/MDX を読み込む低レベル層。
 * - frontmatter は gray-matter で解析し、zod スキーマで検証する
 * - 結果はプロセス内でメモ化する（ビルド時・開発時ともに同じファイルを何度も読まない）
 * - 将来ヘッドレスCMSに移行する場合は、この層だけを差し替える
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { ZodType } from "zod";

export const CONTENT_DIR = join(process.cwd(), "content");

export type Heading = { depth: 2 | 3; text: string; id: string };

export type Doc<F> = {
  frontmatter: F;
  /** MDX 本文（frontmatter を除く） */
  body: string;
  /** 本文のプレーンテキスト（検索・要約用） */
  plain: string;
  /** 本文の文字数（空白除く） */
  chars: number;
  /** 読了時間（分）。日本語は 500 文字/分で計算 */
  readingTime: number;
  headings: Heading[];
  file: string;
};

const cache = new Map<string, Doc<unknown>[]>();

/** Markdown 記法を落としてプレーンテキストにする（検索インデックス用） */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, " ")
    .replace(/\|/g, " ")
    .replace(/[*_`>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** 見出し（## / ###）を抽出する。id は rehype-slug と同じ github-slugger で生成 */
export function extractHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  for (const line of md.split("\n")) {
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    out.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return out;
}

export function readingTimeOf(plain: string): number {
  const chars = plain.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/** ディレクトリ内の .md/.mdx をすべて読み込み、スキーマで検証して返す */
export function loadCollection<F>(dir: string, schema: ZodType<F>): Doc<F>[] {
  const key = dir;
  const cached = cache.get(key);
  if (cached && process.env.NODE_ENV === "production") return cached as Doc<F>[];
  const abs = join(CONTENT_DIR, dir);
  if (!existsSync(abs)) return [];
  const files = readdirSync(abs)
    .filter((f) => /\.mdx?$/.test(f))
    .sort();
  const docs: Doc<F>[] = files.map((file) => {
    const raw = readFileSync(join(abs, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `content/${dir}/${file} の frontmatter が不正です:\n${parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")}`,
      );
    }
    const plain = stripMarkdown(content);
    return {
      frontmatter: parsed.data,
      body: content,
      plain,
      chars: plain.replace(/\s/g, "").length,
      readingTime: readingTimeOf(plain),
      headings: extractHeadings(content),
      file,
    };
  });
  cache.set(key, docs as Doc<unknown>[]);
  return docs;
}
