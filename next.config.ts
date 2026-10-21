import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // content/ 配下の Markdown はランタイムに fs で読むため、サーバーレス環境でも同梱されるようにする
  outputFileTracingIncludes: { "/**/*": ["./content/**/*", "./prompts/**/*", "./public/search-index.json", "./src/assets/fonts/**/*"] },
  // PDF 生成（@react-pdf/renderer）はバンドルせず Node 側でそのまま実行する
  serverExternalPackages: ["@react-pdf/renderer"],
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
