import { describe, expect, it } from "vitest";
import { clientIp, rateLimit } from "../rate-limit";

describe("rateLimit", () => {
  it("上限を超えると拒否し、残り回数を返す", async () => {
    const key = `test-${Date.now()}`;
    const r1 = await rateLimit(key, "1.1.1.1", { limit: 2, windowMs: 60_000 });
    const r2 = await rateLimit(key, "1.1.1.1", { limit: 2, windowMs: 60_000 });
    const r3 = await rateLimit(key, "1.1.1.1", { limit: 2, windowMs: 60_000 });
    expect(r1).toMatchObject({ ok: true, remaining: 1 });
    expect(r2).toMatchObject({ ok: true, remaining: 0 });
    expect(r3.ok).toBe(false);
    // 別の ID は影響しない
    expect((await rateLimit(key, "2.2.2.2", { limit: 2, windowMs: 60_000 })).ok).toBe(true);
  });
  it("x-forwarded-for の先頭を IP とみなす", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe("203.0.113.5");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
