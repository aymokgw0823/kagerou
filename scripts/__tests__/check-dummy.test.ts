import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { format, scan, walkValues } from "../check-dummy";
import { photoManifest } from "../../src/config/photo-manifest";

let root: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "check-dummy-"));
  mkdirSync(join(root, "src/config"), { recursive: true });
  mkdirSync(join(root, "content/blog"), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("check-dummy", () => {
  it("【…】と isDummy: true を行番号つきで検出する", () => {
    writeFileSync(
      join(root, "src/config/sample.ts"),
      [
        'export const PLACEHOLDER = "【要差し替え】";', // 定義行は除外
        "// 【コメント】は除外",
        'const name = "【要差し替え】";',
        "const item = { isDummy: true };",
        "const real = { isDummy: false };",
      ].join("\n"),
    );
    writeFileSync(join(root, "content/blog/a.md"), "---\ntitle: a\nisDummy: true\n---\n本文");
    const r = scan(root);
    expect(r.placeholders).toHaveLength(1);
    expect(r.placeholders[0]).toMatchObject({ file: "src/config/sample.ts", line: 3 });
    expect(r.dummies.map((d) => `${d.file}:${d.line}`).sort()).toEqual([
      "content/blog/a.md:3",
      "src/config/sample.ts:4",
    ]);
    expect(format(r)).toContain("公開前に差し替えてください");
  });

  it("company.ts の値を走査し、PLACEHOLDER 定数経由の未確定値も検出する", () => {
    const r = scan(root);
    expect(r.companyPlaceholders.some((p) => p.startsWith("company.founded"))).toBe(true);
    expect(r.companyPlaceholders.some((p) => p.includes("company.licenses[0].number"))).toBe(true);
    expect(r.companyDummies.some((p) => p.startsWith("company.officers["))).toBe(true);
  });

  it("walkValues は入れ子・配列・isDummy を扱う", () => {
    const out = { placeholders: [] as string[], dummies: [] as string[] };
    walkValues({ a: "【要差し替え】", b: ["ok", "【x】"], c: { isDummy: true, d: null } }, "root", out);
    expect(out.placeholders).toEqual(['root.a = "【要差し替え】"', 'root.b[1] = "【x】"']);
    expect(out.dummies).toEqual(["root.c"]);
  });

  it("src 未設定の写真カットだけを一覧に含める", () => {
    const r = scan(root);
    const expected = photoManifest.filter((p) => !p.src).map((p) => p.id);
    expect(r.placeholderPhotos.map((p) => p.id)).toEqual(expected);
  });
});
