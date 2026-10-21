import { describe, expect, it } from "vitest";
import { photoManifest, resolvePhoto } from "@/config/photo-manifest";

describe("photo-manifest", () => {
  it("id が一意", () => {
    const ids = photoManifest.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("比率と width/height が整合する", () => {
    for (const p of photoManifest) {
      const [w, h] = p.ratio.split(":").map(Number);
      expect(Math.abs(p.width / p.height - w / h)).toBeLessThan(0.01);
    }
  });

  it("要件で求められる最低限のカットが含まれる", () => {
    const ids = new Set(photoManifest.map((p) => p.id));
    for (const required of [
      "ceo-portrait",
      "officer-01",
      "office-exterior",
      "office-interior",
      "office-working",
      "kv-digital",
      "kv-social",
      "kv-consulting",
      "kv-build",
      "kv-dining",
      "build-site-wide",
      "build-before",
      "build-after",
      "dining-interior",
      "dining-food-01",
      "interview-01",
      "recruit-hero",
    ])
      expect(ids.has(required), required).toBe(true);
  });

  it("src 未設定ならダミー画像パスに解決される", () => {
    const p = resolvePhoto("ceo-portrait");
    expect(p.isPlaceholder).toBe(true);
    expect(p.src).toBe("/images/placeholders/ceo-portrait.jpg");
    expect(() => resolvePhoto("nope")).toThrow();
  });
});
