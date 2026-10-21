import { expect, test } from "@playwright/test";

/** 「N 件中 M 件を表示」の M を取り出す */
async function shownCount(page: import("@playwright/test").Page) {
  const text = await page.locator('p[aria-live="polite"]').filter({ hasText: "件を表示" }).first().innerText();
  const m = text.replace(/\s+/g, "").match(/(\d+)件中(\d+)件を表示/);
  if (!m) throw new Error(`件数表示が見つかりません: ${text}`);
  return { total: Number(m[1]), shown: Number(m[2]) };
}

test.describe("ブログのファセット検索", () => {
  test("事業「建設」で絞り込むと URL に business=build が付き、件数が減る", async ({ page }) => {
    await page.goto("/blog");
    const before = await shownCount(page);
    expect(before.shown).toBe(before.total);

    await page.locator("aside label", { hasText: "建設" }).first().click();
    await expect(page).toHaveURL(/[?&]business=build(&|$)/);
    await expect
      .poll(async () => (await shownCount(page)).shown, { message: "絞り込み後の件数" })
      .toBeLessThan(before.total);
    const after = await shownCount(page);
    expect(after.total).toBe(before.total);
    expect(after.shown).toBeGreaterThan(0);
  });

  test("検索「雨漏り」で q= が付き、1件以上ヒットする", async ({ page }) => {
    await page.goto("/blog");
    const before = await shownCount(page);
    await page.fill("#blog-q", "雨漏り");
    await page.locator("#blog-q").press("Enter");
    await expect(page).toHaveURL(/[?&]q=%E9%9B%A8%E6%BC%8F%E3%82%8A(&|$)/);
    // 検索インデックスの読み込み中は「（検索中…）」が表示されるので、完了を待つ
    await expect(page.getByText("（検索中…）")).toHaveCount(0);
    await expect.poll(async () => (await shownCount(page)).shown).toBeLessThan(before.total);
    const after = await shownCount(page);
    expect(after.shown).toBeGreaterThanOrEqual(1);
    await expect(page.locator("article, li").filter({ hasText: "雨漏り" }).first()).toBeVisible();
  });

  test("?page=2 で 2 ページ目が現在ページとして表示される", async ({ page }) => {
    await page.goto("/blog?page=2");
    const current = page.locator('nav[aria-label="ページネーション"] [aria-current="page"]');
    await expect(current).toHaveText("2");
    await expect(page.locator('nav[aria-label="ページネーション"] button', { hasText: "前へ" })).toBeEnabled();
  });

  test("条件をクリアで元に戻る", async ({ page }) => {
    await page.goto("/blog");
    const initial = await shownCount(page);

    await page.locator("aside label", { hasText: "建設" }).first().click();
    await expect(page).toHaveURL(/business=build/);
    await expect.poll(async () => (await shownCount(page)).shown).toBeLessThan(initial.total);

    await page.locator("aside").getByRole("button", { name: "条件をクリア" }).click();
    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect.poll(async () => (await shownCount(page)).shown).toBe(initial.total);
    await expect(page.locator("aside").getByRole("button", { name: "条件をクリア" })).toHaveCount(0);
  });

  test("カテゴリー別ページ /blog/category/外壁・屋根 が 200 で表示される", async ({ page }) => {
    const res = await page.goto(`/blog/category/${encodeURIComponent("外壁・屋根")}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("外壁・屋根");
    const { shown } = await shownCount(page);
    expect(shown).toBeGreaterThan(0);
  });
});
