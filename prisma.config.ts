import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 の設定。接続先は環境変数 DATABASE_URL（.env / .env.local / Vercel の環境変数）。
 * - DATABASE_URL が file:…       → SQLite（開発）。prisma/schema.prisma と prisma/migrations
 * - DATABASE_URL が postgres://… → PostgreSQL（本番）。prisma/postgres/schema.prisma と prisma/postgres/migrations
 *   （postgres 用スキーマは `npm run db:postgres-schema` で開発用スキーマから生成する）
 */
const url = process.env.DATABASE_URL ?? "file:./dev.db";
const postgres = /^postgres(ql)?:\/\//.test(url);

export default defineConfig({
  schema: postgres ? "prisma/postgres/schema.prisma" : "prisma/schema.prisma",
  migrations: { path: postgres ? "prisma/postgres/migrations" : "prisma/migrations" },
  datasource: { url },
});
