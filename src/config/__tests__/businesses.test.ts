import { describe, expect, it } from "vitest";
import { businesses, businessesByPillar, businessBrandName, getBusiness } from "@/config/businesses";
import { photoMap } from "@/config/photo-manifest";

describe("businesses", () => {
  it("5事業が定義され、id と href が一致する", () => {
    expect(businesses).toHaveLength(5);
    for (const b of businesses) expect(b.href).toBe(`/business/${b.id}`);
  });

  it("キービジュアルは photo-manifest に存在する", () => {
    for (const b of businesses) expect(photoMap[b.keyVisualId]).toBeDefined();
  });

  it("4つの軸に少なくとも1事業が属する", () => {
    const p = businessesByPillar();
    expect(p.create.length).toBeGreaterThan(0);
    expect(p.convey.length).toBeGreaterThan(0);
    expect(p.grow.length).toBeGreaterThan(0);
    expect(p.practice.length).toBeGreaterThan(0);
  });

  it("事業ブランド名はコーポレートブランド＋サフィックス", () => {
    expect(businessBrandName(getBusiness("digital"))).toMatch(/Digital$/);
  });
});
