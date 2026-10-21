import { cacheLife } from "next/cache";

/**
 * コピーライトの年。Cache Components では `new Date()` を描画中に直接使えないため、
 * 1日単位でキャッシュする小さなコンポーネントに切り出す。
 */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
