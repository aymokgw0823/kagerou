import { describe, expect, it } from "vitest";
import { extractHeadings, readingTimeOf, stripMarkdown } from "../fs";

describe("content/fs", () => {
  it("見出しを抽出し、github-slugger 互換の id を付ける", () => {
    const md = "# タイトル\n\n## 外壁の劣化サイン\n本文\n### チョーキング\n## 費用の目安";
    expect(extractHeadings(md)).toEqual([
      { depth: 2, text: "外壁の劣化サイン", id: "外壁の劣化サイン" },
      { depth: 3, text: "チョーキング", id: "チョーキング" },
      { depth: 2, text: "費用の目安", id: "費用の目安" },
    ]);
  });
  it("Markdown 記法を落とす", () => {
    const plain = stripMarkdown(
      "## 見出し\n\n- **太字** と [リンク](/x)\n\n| a | b |\n|---|---|\n| 1 | 2 |\n",
    );
    expect(plain).toBe("見出し 太字 と リンク a b 1 2");
  });
  it("読了時間は 500 文字/分、最低 1 分", () => {
    expect(readingTimeOf("あ".repeat(100))).toBe(1);
    expect(readingTimeOf("あ".repeat(1600))).toBe(3);
  });
});
