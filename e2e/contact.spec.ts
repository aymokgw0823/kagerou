import { expect, test } from "@playwright/test";

test.describe("お問い合わせ", () => {
  test("必須項目が未入力のまま送信するとエラーが表示される", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "送信する" }).click();
    const alerts = page.locator('[role="alert"]');
    await expect(alerts.first()).toBeVisible();
    expect(await alerts.count()).toBeGreaterThanOrEqual(1);
    await expect(page.locator('[role="status"]')).toHaveCount(0);
  });

  test("正しく入力して送信すると受付番号が表示される", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("label", { hasText: "建設について" }).click();
    await expect(page.locator('input[name="business"][value="build"]')).toBeChecked();
    await page.fill("#name", "E2E 問合せ太郎");
    await page.fill("#email", "e2e-contact@example.com");
    await page.fill("#message", "外壁のひび割れについて現地調査をお願いしたいです。（E2E テスト）");
    await page.check('input[name="consent"]');
    await page.getByRole("button", { name: "送信する" }).click();

    const status = page.locator('[role="status"]');
    await expect(status).toBeVisible();
    await expect(status).toContainText("お問い合わせを受け付けました");
    await expect(status).toContainText(/受付番号：\S+/);
  });

  test("?business=dining で「飲食について」が初期選択される", async ({ page }) => {
    await page.goto("/contact?business=dining");
    await expect(page.locator('input[name="business"][value="dining"]')).toBeChecked();
    await expect(page.locator('input[name="business"][value="build"]')).not.toBeChecked();
    // 飲食向けの項目が表示される
    await expect(page.locator('select[name="purpose"]')).toBeVisible();
  });
});
