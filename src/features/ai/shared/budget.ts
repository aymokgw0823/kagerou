/**
 * 日次トークン使用量の記録とコスト上限の判定（DailyUsage テーブル）。
 */
import { db } from "@/lib/db";
import { aiConfig } from "./config";

function today(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }); // YYYY-MM-DD
}

export async function getTodayUsage(): Promise<{
  tokensIn: number;
  tokensOut: number;
  calls: number;
  budget: number;
  exceeded: boolean;
}> {
  const row = await db.dailyUsage.findUnique({ where: { date: today() } });
  const tokensIn = row?.tokensIn ?? 0;
  const tokensOut = row?.tokensOut ?? 0;
  const budget = aiConfig.dailyTokenBudget;
  return { tokensIn, tokensOut, calls: row?.calls ?? 0, budget, exceeded: tokensIn + tokensOut >= budget };
}

export async function recordUsage(tokensIn: number, tokensOut: number): Promise<void> {
  const date = today();
  await db.dailyUsage.upsert({
    where: { date },
    create: { date, tokensIn, tokensOut, calls: 1 },
    update: {
      tokensIn: { increment: tokensIn },
      tokensOut: { increment: tokensOut },
      calls: { increment: 1 },
    },
  });
}
