/**
 * レート制限（スライディングウィンドウ）。
 * 既定はプロセス内メモリのストア。サーバーレス（複数インスタンス）で厳密に制限したい場合は
 * `RateLimitStore` を実装して KV / DB に差し替える。
 */
export type RateLimitStore = {
  /** key のタイムスタンプ一覧を取得・更新する */
  hit(key: string, now: number, windowMs: number): Promise<number>;
};

class MemoryStore implements RateLimitStore {
  private map = new Map<string, number[]>();
  async hit(key: string, now: number, windowMs: number): Promise<number> {
    const arr = (this.map.get(key) ?? []).filter((t) => now - t < windowMs);
    arr.push(now);
    this.map.set(key, arr);
    // 肥大化防止
    if (this.map.size > 10_000) {
      for (const [k, v] of this.map) if (v.every((t) => now - t >= windowMs)) this.map.delete(k);
    }
    return arr.length;
  }
}

const globalStore = globalThis as unknown as { __rateLimitStore?: RateLimitStore };
export const rateLimitStore: RateLimitStore =
  globalStore.__rateLimitStore ?? (globalStore.__rateLimitStore = new MemoryStore());

export type RateLimitResult = { ok: boolean; remaining: number; limit: number };

/**
 * @param scope 用途（contact / booking / ai-reform など）
 * @param id    IP やセッションID
 */
export async function rateLimit(
  scope: string,
  id: string,
  opts: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const count = await rateLimitStore.hit(`${scope}:${id}`, Date.now(), opts.windowMs);
  return { ok: count <= opts.limit, remaining: Math.max(0, opts.limit - count), limit: opts.limit };
}

/** リクエストヘッダーからクライアント IP を推定する */
export function clientIp(headers: Headers): string {
  const xf = headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
