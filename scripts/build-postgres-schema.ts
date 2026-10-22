/**
 * 本番（PostgreSQL）用の Prisma スキーマを開発用（SQLite）のスキーマから生成する。
 *   npm run db:postgres-schema
 * prisma/schema.prisma を編集したら必ず実行し、prisma/postgres/ 配下（スキーマとマイグレーション）もコミットする。
 * マイグレーション SQL の生成（DB 接続不要）：
 *   npx prisma migrate diff --from-migrations prisma/postgres/migrations --to-schema prisma/postgres/schema.prisma --script
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const src = readFileSync(join(ROOT, "prisma/schema.prisma"), "utf8");
const out = src
  .replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"')
  .replace(/output\s*=\s*"\.\.\/src\/generated\/prisma"/, 'output   = "../../src/generated/prisma"')
  .replace(/^\/\/ Prisma スキーマ\n/, "// Prisma スキーマ（PostgreSQL・本番用）。このファイルは scripts/build-postgres-schema.ts が prisma/schema.prisma から生成する。直接編集しない。\n");
mkdirSync(join(ROOT, "prisma/postgres"), { recursive: true });
writeFileSync(join(ROOT, "prisma/postgres/schema.prisma"), out);
console.log("prisma/postgres/schema.prisma を更新しました");
