import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // content/ 配下の Markdown はランタイムに fs で読むため、サーバーレス環境でも同梱されるようにする
  outputFileTracingIncludes: { "/**/*": ["./content/**/*", "./prompts/**/*", "./public/search-index.json", "./src/assets/fonts/**/*"] },
  // PDF 生成（@react-pdf/renderer）はバンドルせず Node 側でそのまま実行する
  serverExternalPackages: ["@react-pdf/renderer"],
  async headers() {
    // CSP：静的生成と両立させるため nonce は使わず、インラインスクリプト（JSON-LD・GTM 起動）を許可する。
    // 外部スクリプトの読み込み先は GTM / GA に限定。iframe は Google Maps と予約サービス埋め込みのみ。
    const csp = [
      "default-src 'self'",
      // 開発時のみ 'unsafe-eval'（Turbopack の HMR / ソースマップ用）
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
      "frame-src https://www.google.com https://maps.google.com https://timerex.net https://calendly.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
