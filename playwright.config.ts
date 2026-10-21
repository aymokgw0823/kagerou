import { defineConfig, devices } from "@playwright/test";

/**
 * 主要導線の E2E（Playwright）
 *
 * 既定ではビルド済みの `.next` を `next start -p 3100` で起動して検証する:
 *   npm run build && npm run test:e2e
 *
 * 稼働中のサーバーに対して実行する場合は E2E_BASE_URL を指定する（webServer は起動しない）:
 *   E2E_BASE_URL=http://localhost:3000 npm run test:e2e
 */
const externalBaseURL = process.env.E2E_BASE_URL;
const baseURL = externalBaseURL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  retries: 1,
  reporter: "list",
  timeout: 120_000,
  expect: { timeout: 30_000 },
  use: {
    baseURL,
    locale: "ja-JP",
    viewport: { width: 1280, height: 800 },
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } }],
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run start -- -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
