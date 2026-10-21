/**
 * Prisma クライアント（シングルトン）。
 * DATABASE_URL の形式でアダプターを自動選択する：
 *   file:…        → SQLite（開発）
 *   postgres://… → PostgreSQL（本番。schema.prisma の provider も "postgresql" に変更すること）
 */
import { PrismaClient } from "@/generated/prisma/client";

const url = process.env.DATABASE_URL ?? "file:./dev.db";

function createClient(): PrismaClient {
  if (/^postgres(ql)?:\/\//.test(url)) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } =
    require("@prisma/adapter-better-sqlite3") as typeof import("@prisma/adapter-better-sqlite3");
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db: PrismaClient = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
