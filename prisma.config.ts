import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 の設定。接続先は環境変数 DATABASE_URL（.env / .env.local）。
 * - 開発：SQLite（file:./dev.db）
 * - 本番：PostgreSQL（postgres://…）。schema.prisma の provider を "postgresql" に変えるだけ（README 参照）
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL ?? "file:./dev.db" },
});
