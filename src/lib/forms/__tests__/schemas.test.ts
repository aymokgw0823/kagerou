import { describe, expect, it } from "vitest";
import { bookingSchema, contactSchema, entrySchema, fieldErrors } from "../schemas";

describe("form schemas", () => {
  it("お問い合わせ：必須項目と同意を検証する", () => {
    const bad = contactSchema.safeParse({
      business: "build",
      name: "",
      email: "x",
      message: "短い",
      consent: "",
    });
    expect(bad.success).toBe(false);
    if (!bad.success) {
      const e = fieldErrors(bad.error);
      expect(Object.keys(e)).toEqual(expect.arrayContaining(["name", "email", "message", "consent"]));
    }
    const ok = contactSchema.safeParse({
      business: "dining",
      name: "山田",
      email: "a@example.com",
      message: "貸切の相談をしたいです。",
      consent: "on",
      partySize: "6名",
    });
    expect(ok.success).toBe(true);
  });
  it("予約：ISO 日時を要求する", () => {
    expect(
      bookingSchema.safeParse({
        business: "build",
        slot: "2026-11-05",
        name: "a",
        email: "a@example.com",
        consent: "on",
      }).success,
    ).toBe(false);
    expect(
      bookingSchema.safeParse({
        business: "build",
        slot: "2026-11-05T01:00:00.000Z",
        altSlot: "",
        name: "a",
        email: "a@example.com",
        consent: "on",
      }).success,
    ).toBe(true);
  });
  it("エントリー：電話番号の形式を検証する", () => {
    const base = { jobSlug: "craftsman", name: "a", kana: "あ", email: "a@example.com", consent: "on" };
    expect(entrySchema.safeParse({ ...base, tel: "abc" }).success).toBe(false);
    expect(entrySchema.safeParse({ ...base, tel: "03-1234-5678" }).success).toBe(true);
  });
});
