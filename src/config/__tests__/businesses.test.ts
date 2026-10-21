import { describe, expect, it } from "vitest";
import { businesses, businessesByPillar, businessBrandName, getBusiness } from "@/config/businesses";
import { photoMap } from "@/config/photo-manifest";

describe("businesses", () => {
  it("2事業が定義され、id と href が一致する", () => {
    expect(businesses).toHaveLength(2);
    for (const b of businesses) expect(b.href).toBe(`/business/${b.id}`);
  });

  it("キービジュアルは photo-manifest に存在する", () => {
    for (const b of businesses) expect(photoMap[b.keyVisualId]).toBeDefined();
  });

  it("「つくる」「営む」の2軸に1事業ずつ属する", () => {
    const p = businessesByPillar();
    expect(p.create.map((b) => b.id)).toEqual(["build"]);
    expect(p.operate.map((b) => b.id)).toEqual(["dining"]);
  });

  it("事業ブランド名はコーポレートブランド＋サフィックス", () => {
    expect(businessBrandName(getBusiness("build"))).toMatch(/Build$/);
  });
});
