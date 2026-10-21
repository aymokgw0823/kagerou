import { describe, expect, it } from "vitest";
import { company, getPublishedFigures, isPlaceholder, PLACEHOLDER } from "@/config/company";

describe("company", () => {
  it("未確定値は【…】形式で検出できる", () => {
    expect(isPlaceholder(PLACEHOLDER)).toBe(true);
    expect(isPlaceholder("〒100-0001 東京都千代田区")).toBe(false);
    expect(isPlaceholder(null)).toBe(false);
  });

  it("数値は確定するまで表示されない（null は除外される）", () => {
    const rows = getPublishedFigures();
    for (const r of rows) expect(typeof r.value).toBe("number");
    // 初期状態はすべて null なので空
    expect(rows).toEqual([]);
  });

  it("事業数は 5", () => {
    expect(company.figures.businesses).toBe(5);
    expect(company.businessSummary).toHaveLength(5);
  });

  it("住所の1行表示が組み立てられる", () => {
    expect(company.address.full).toContain("〒");
  });
});
