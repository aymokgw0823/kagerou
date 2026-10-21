import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { fmtInt, jstDaysAgo, pct, todayJst } from "@/lib/admin/helpers";
import { AdminPageTitle, Loading, StatCard, Table, Td, Th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "ダッシュボード" };

type PeriodStats = {
  label: string;
  started: number;
  completed: number;
  bookings: number;
  bookingsFromConsultation: number;
  leads: number;
  entries: number;
};

async function periodStats(label: string, since: Date): Promise<PeriodStats> {
  const createdAt = { gte: since };
  const [started, completed, bookings, bookingsFromConsultation, leads, entries] = await Promise.all([
    db.consultation.count({ where: { tool: "reform", createdAt } }),
    db.consultation.count({ where: { tool: "reform", status: "completed", createdAt } }),
    db.booking.count({ where: { createdAt } }),
    db.booking.count({ where: { createdAt, consultationId: { not: null } } }),
    db.lead.count({ where: { createdAt } }),
    db.entry.count({ where: { createdAt } }),
  ]);
  return { label, started, completed, bookings, bookingsFromConsultation, leads, entries };
}

async function Dashboard() {
  await requireAdmin("/admin");
  const now = new Date();
  const [today, week, month, usage] = await Promise.all([
    periodStats("本日", jstDaysAgo(0, now)),
    periodStats("直近7日", jstDaysAgo(6, now)),
    periodStats("直近30日", jstDaysAgo(29, now)),
    db.dailyUsage.findUnique({ where: { date: todayJst(now) } }),
  ]);
  const periods = [today, week, month];
  const budget = Number(process.env.AI_DAILY_TOKEN_BUDGET || 2_000_000);
  const used = (usage?.tokensIn ?? 0) + (usage?.tokensOut ?? 0);
  const usedRatio = budget > 0 ? used / budget : 0;

  return (
    <>
      <section className="mb-8">
        <h2 className="text-ink-2 mb-3 text-sm font-bold">本日（{todayJst(now)} JST）</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <StatCard label="AI相談 開始" value={fmtInt(today.started)} />
          <StatCard
            label="AI相談 完了"
            value={fmtInt(today.completed)}
            sub={`完了率 ${pct(today.completed, today.started)}`}
          />
          <StatCard
            label="相談→予約"
            value={fmtInt(today.bookingsFromConsultation)}
            sub={`転換率 ${pct(today.bookingsFromConsultation, today.completed)}`}
            tone="accent"
          />
          <StatCard label="お問い合わせ" value={fmtInt(today.leads)} />
          <StatCard label="予約" value={fmtInt(today.bookings)} />
          <StatCard label="エントリー" value={fmtInt(today.entries)} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-ink-2 mb-3 text-sm font-bold">本日のトークン使用量</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="使用量 / 上限"
            value={`${fmtInt(used)} / ${fmtInt(budget)}`}
            sub={`${(usedRatio * 100).toFixed(1)}%${usedRatio >= 1 ? "（上限到達）" : ""}`}
            tone={usedRatio >= 0.8 ? "warn" : "default"}
          />
          <StatCard label="入力トークン" value={fmtInt(usage?.tokensIn ?? 0)} />
          <StatCard label="出力トークン" value={fmtInt(usage?.tokensOut ?? 0)} />
          <StatCard label="API 呼び出し" value={fmtInt(usage?.calls ?? 0)} />
        </div>
        <div className="bg-paper-3 mt-3 h-2 w-full overflow-hidden rounded-sm" aria-hidden>
          <div
            className={usedRatio >= 0.8 ? "bg-notice h-full" : "bg-accent h-full"}
            style={{ width: `${Math.min(100, usedRatio * 100)}%` }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-ink-2 mb-3 text-sm font-bold">期間別サマリー</h2>
        <Table
          head={
            <>
              <Th>期間</Th>
              <Th className="text-right">AI相談 開始</Th>
              <Th className="text-right">完了</Th>
              <Th className="text-right">完了率</Th>
              <Th className="text-right">相談→予約</Th>
              <Th className="text-right">転換率</Th>
              <Th className="text-right">お問い合わせ</Th>
              <Th className="text-right">予約</Th>
              <Th className="text-right">エントリー</Th>
            </>
          }
        >
          {periods.map((p) => (
            <tr key={p.label} className="tabular-nums">
              <Td className="font-bold">{p.label}</Td>
              <Td className="text-right">{fmtInt(p.started)}</Td>
              <Td className="text-right">{fmtInt(p.completed)}</Td>
              <Td className="text-right">{pct(p.completed, p.started)}</Td>
              <Td className="text-right">{fmtInt(p.bookingsFromConsultation)}</Td>
              <Td className="text-right">{pct(p.bookingsFromConsultation, p.completed)}</Td>
              <Td className="text-right">
                <Link href="/admin/leads" className="link-underline">
                  {fmtInt(p.leads)}
                </Link>
              </Td>
              <Td className="text-right">
                <Link href="/admin/bookings" className="link-underline">
                  {fmtInt(p.bookings)}
                </Link>
              </Td>
              <Td className="text-right">
                <Link href="/admin/entries" className="link-underline">
                  {fmtInt(p.entries)}
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
        <p className="text-ink-3 mt-2 text-xs">
          AI相談は tool=reform の Consultation を集計。転換率＝相談結果から予約に至った件数 ÷ 完了件数。期間は
          JST の日付で区切っています。
        </p>
      </section>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageTitle title="ダッシュボード" />
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </>
  );
}
