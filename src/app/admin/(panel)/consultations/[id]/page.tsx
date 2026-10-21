import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  bookingStatusLabel,
  businessLabel,
  consultationStatusLabel,
  fmtDateTime,
  fmtInt,
  label,
  leadKindLabel,
  toolLabel,
} from "@/lib/admin/helpers";
import { AdminPageTitle, Badge, Loading, Table, Td, Th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "相談ログ詳細" };

function prettyJson(s: string | null): string {
  if (!s) return "";
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="border-line grid grid-cols-[8rem_1fr] gap-3 border-b py-2 text-sm">
      <dt className="text-ink-2 font-bold">{k}</dt>
      <dd className="min-w-0 break-words">{v}</dd>
    </div>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/consultations/${encodeURIComponent(id)}`);
  const c = await db.consultation.findUnique({ where: { id } });
  if (!c) notFound();
  const [bookings, leads] = await Promise.all([
    db.booking.findMany({ where: { consultationId: id }, orderBy: { createdAt: "desc" } }),
    db.lead.findMany({ where: { consultationId: id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <>
      <AdminPageTitle title="相談ログ詳細">
        <Link href="/admin/consultations" className="text-link text-sm underline underline-offset-2">
          ← 一覧へ戻る
        </Link>
      </AdminPageTitle>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <section className="card p-4">
          <h2 className="mb-2 text-sm font-bold">基本情報</h2>
          <dl>
            <Row k="ID" v={<span className="font-mono text-xs">{c.id}</span>} />
            <Row k="日時" v={fmtDateTime(c.createdAt)} />
            <Row k="完了日時" v={fmtDateTime(c.completedAt)} />
            <Row k="ツール" v={label(toolLabel, c.tool)} />
            <Row
              k="状態"
              v={
                <Badge tone={c.status === "completed" ? "ok" : "neutral"}>
                  {label(consultationStatusLabel, c.status)}
                </Badge>
              }
            />
            <Row k="mode" v={c.mode} />
            <Row k="tokens" v={`入 ${fmtInt(c.tokensIn)} ／ 出 ${fmtInt(c.tokensOut)}`} />
            <Row k="session" v={<span className="font-mono text-xs">{c.sessionId ?? "—"}</span>} />
            <Row k="メール（マスク）" v={c.emailMasked ?? "—"} />
            <Row k="IP" v={<span className="font-mono text-xs">{c.ip ?? "—"}</span>} />
          </dl>
          <h2 className="mt-6 mb-2 text-sm font-bold">入力要約</h2>
          <p className="text-ink-2 text-sm whitespace-pre-wrap">{c.inputSummary || "—"}</p>
        </section>

        <section className="card p-4">
          <h2 className="mb-2 text-sm font-bold">結果（resultJson）</h2>
          {c.resultJson ? (
            <pre className="bg-paper-2 border-line max-h-[36rem] overflow-auto rounded-sm border p-3 font-mono text-xs leading-relaxed">
              {prettyJson(c.resultJson)}
            </pre>
          ) : (
            <p className="text-ink-3 text-sm">結果はありません</p>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-bold">紐づく予約（{bookings.length}）</h2>
        <Table
          empty={bookings.length === 0}
          head={
            <>
              <Th>受付日時</Th>
              <Th>第1希望</Th>
              <Th>名前</Th>
              <Th>メール</Th>
              <Th>事業</Th>
              <Th>状態</Th>
            </>
          }
        >
          {bookings.map((b) => (
            <tr key={b.id}>
              <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(b.createdAt)}</Td>
              <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(b.slot)}</Td>
              <Td>{b.name}</Td>
              <Td className="break-all">{b.email}</Td>
              <Td>{label(businessLabel, b.business)}</Td>
              <Td>
                <Badge
                  tone={b.status === "confirmed" ? "ok" : b.status === "cancelled" ? "danger" : "neutral"}
                >
                  {label(bookingStatusLabel, b.status)}
                </Badge>
              </Td>
            </tr>
          ))}
        </Table>
      </section>

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-bold">紐づくリード（{leads.length}）</h2>
        <Table
          empty={leads.length === 0}
          head={
            <>
              <Th>日時</Th>
              <Th>種別</Th>
              <Th>事業</Th>
              <Th>名前</Th>
              <Th>メール</Th>
              <Th>件名</Th>
            </>
          }
        >
          {leads.map((l) => (
            <tr key={l.id}>
              <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(l.createdAt)}</Td>
              <Td>{label(leadKindLabel, l.kind)}</Td>
              <Td>{label(businessLabel, l.business)}</Td>
              <Td>{l.name}</Td>
              <Td className="break-all">{l.email}</Td>
              <Td>{l.subject ?? "—"}</Td>
            </tr>
          ))}
        </Table>
      </section>
    </>
  );
}

export default function AdminConsultationDetailPage({ params }: PageProps<"/admin/consultations/[id]">) {
  return (
    <Suspense fallback={<Loading />}>
      <Detail params={params} />
    </Suspense>
  );
}
