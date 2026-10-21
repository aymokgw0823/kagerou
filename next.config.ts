import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // content/ 配下の Markdown はランタイムに fs で読むため、サーバーレス環境でも同梱されるようにする
  outputFileTracingIncludes: { "/**/*": ["./content/**/*"] },
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
