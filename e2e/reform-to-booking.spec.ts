import { expect, test } from "@playwright/test";
import path from "node:path";

const fixtures = path.join(__dirname, "fixtures");

test.describe("トップ → 写真でリフォーム相談 → PDF → 現地調査の予約", () => {
  test("ウィザードを最後まで進め、PDF を取得し、相談IDを引き継いで予約できる", async ({ page }) => {
    // 1. トップのヒーローから AI 相談へ
    await page.goto("/");
    await page.getByRole("link", { name: "写真でリフォーム相談（無料）" }).first().click();
    await expect(page).toHaveURL(/\/ai\/reform$/);

    // 2. 同意 → 写真アップロード
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "写真をアップロードする" }).click();
    await page
      .locator('input[type="file"][multiple]')
      .setInputFiles([path.join(fixtures, "build-before.jpg"), path.join(fixtures, "build-after.jpg")]);
    await expect(page.getByRole("button", { name: /次へ（2枚）/ })).toBeEnabled();
    await page.getByRole("button", { name: /次へ/ }).click();

    // 3. 部位と状況 → AI に相談
    await page.locator("label", { hasText: "屋根" }).click();
    await page.fill("#reform-desc", "屋根の板金が浮いているように見えます");
    await page.getByRole("button", { name: "AIに相談する" }).click();

    // 4. 結果表示（API キー未設定時はデモモードで必ず成功する）
    await expect(page.getByRole("heading", { name: "写真から読み取れる状態" })).toBeVisible({ timeout: 90_000 });
    const bookingLink = page.locator('a[href^="/booking?business=build&consultation="]');
    await expect(bookingLink).toBeVisible();
    const href = await bookingLink.getAttribute("href");
    const consultationId = decodeURIComponent(href!.split("consultation=")[1]);
    expect(consultationId).not.toHaveLength(0);

    // 5. PDF が application/pdf で返る（ボタン経由のダウンロードと API 直叩きの両方を確認）
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "PDFをダウンロード" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`reform-report-${consultationId}.pdf`);
    await expect(page.getByText("ダウンロードを開始しました。")).toBeVisible();

    const pdfRes = await page.request.post(`/api/ai/reform/${encodeURIComponent(consultationId)}/pdf`, {
      data: {},
    });
    expect(pdfRes.ok()).toBeTruthy();
    expect(pdfRes.headers()["content-type"]).toContain("application/pdf");
    const pdfBody = await pdfRes.body();
    expect(pdfBody.subarray(0, 5).toString("latin1")).toBe("%PDF-");

    // 6. 「現地調査を予約する（無料）」で予約ページへ（相談IDを引き継ぐ）
    await page.getByRole("link", { name: "現地調査を予約する（無料）" }).click();
    await expect(page).toHaveURL(new RegExp(`/booking\\?business=build&consultation=${encodeURIComponent(consultationId)}`));
    await expect(page.locator('input[name="consultationId"]')).toHaveValue(consultationId);
    await expect(page.locator('select[name="business"]')).toHaveValue("build");

    // 7. 枠を選んで送信
    await page.locator('button[aria-pressed="false"]').first().click();
    await page.locator('button[aria-pressed="false"]').nth(2).click();
    await page.fill("#name", "E2E 予約太郎");
    await page.fill("#email", "e2e-booking@example.com");
    await page.check('input[name="consent"]');
    await page.getByRole("button", { name: "この内容で予約を申し込む" }).click();

    const status = page.locator('[role="status"]');
    await expect(status).toBeVisible();
    await expect(status).toContainText("受け付けました");
    await expect(status).toContainText("受付番号");
  });
});
