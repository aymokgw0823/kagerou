import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  consultationStatusLabel,
  dateRange,
  fmtDateTime,
  fmtInt,
  label,
  pageNumber,
  qs,
  type SearchParams,
  sp,
  toolLabel,
  truncate,
  ymd,
} from "@/lib/admin/helpers";
import {
  AdminPageTitle,
  Badge,
  FilterBar,
  FilterField,
  FilterInput,
  FilterSelect,
  Loading,
  Pagination,
  Table,
  Td,
  Th,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "相談ログ" };

const PAGE_SIZE = 50;
const TOOLS = ["reform", "concierge"] as const;
const STATUSES = ["started", "completed", "failed", "abandoned"] as const;

function statusTone(s: string): "ok" | "warn" | "danger" | "neutral" {
  if (s === "completed") return "ok";
  if (s === "failed") return "danger";
  if (s === "abandoned") return "warn";
  return "neutral";
}

async function ConsultationList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const toolRaw = sp(params, "tool");
  const statusRaw = sp(params, "status");
  const filter = {
    tool: toolRaw && (TOOLS as readonly string[]).includes(toolRaw) ? toolRaw : undefined,
    status: statusRaw && (STATUSES as readonly string[]).includes(statusRaw) ? statusRaw : undefined,
    from: ymd(sp(params, "from")),
    to: ymd(sp(params, "to")),
  };
  const page = pageNumber(sp(params, "page"));
  await requireAdmin(`/admin/consultations${qs({ ...filter, page })}`);

  const range = dateRange(filter.from, filter.to);
  const where: Prisma.ConsultationWhereInput = {
    ...(filter.tool ? { tool: filter.tool } : {}),
    ...(filter.status ? { status: filter.status } : {}),
    ...(range ? { createdAt: range } : {}),
  };
  const [total, rows] = await Promise.all([
    db.consultation.count({ where }),
    db.consultation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        createdAt: true,
        tool: true,
        status: true,
        mode: true,
        tokensIn: true,
        tokensOut: true,
        sessionId: true,
        inputSummary: true,
      },
    }),
  ]);
  const booked = new Set(
    rows.length
      ? (
          await db.booking.findMany({
            where: { consultationId: { in: rows.map((r) => r.id) } },
            select: { consultationId: true },
          })
        ).map((b) => b.consultationId)
      : [],
  );

  return (
    <>
      <AdminPageTitle title="相談ログ" />
      <FilterBar action="/admin/consultations" reset="/admin/consultations">
        <FilterField label="ツール">
          <FilterSelect name="tool" defaultValue={filter.tool ?? ""}>
            <option value="">すべて</option>
            {TOOLS.map((t) => (
              <option key={t} value={t}>
                {toolLabel[t]}
              </option>
            ))}
          </FilterSelect>
        </FilterField>
        <FilterField label="状態">
          <FilterSelect name="status" defaultValue={filter.status ?? ""}>
            <option value="">すべて</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {consultationStatusLabel[s]}
              </option>
            ))}
          </FilterSelect>
        </FilterField>
        <FilterField label="期間（から）">
          <FilterInput type="date" name="from" defaultValue={filter.from ?? ""} />
        </FilterField>
        <FilterField label="期間（まで）">
          <FilterInput type="date" name="to" defaultValue={filter.to ?? ""} />
        </FilterField>
      </FilterBar>
      <Table
        empty={rows.length === 0}
        head={
          <>
            <Th>日時</Th>
            <Th>ツール</Th>
            <Th>状態</Th>
            <Th>mode</Th>
            <Th className="text-right">tokens（入/出）</Th>
            <Th>session</Th>
            <Th>入力要約</Th>
            <Th>予約</Th>
          </>
        }
      >
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-paper-2">
            <Td className="whitespace-nowrap tabular-nums">
              <Link href={`/admin/consultations/${encodeURIComponent(r.id)}`} className="link-underline">
                {fmtDateTime(r.createdAt)}
              </Link>
            </Td>
            <Td className="whitespace-nowrap">{label(toolLabel, r.tool)}</Td>
            <Td>
              <Badge tone={statusTone(r.status)}>{label(consultationStatusLabel, r.status)}</Badge>
            </Td>
            <Td>
              <Badge tone={r.mode === "live" ? "info" : "neutral"}>{r.mode}</Badge>
            </Td>
            <Td className="text-right whitespace-nowrap tabular-nums">
              {fmtInt(r.tokensIn)} / {fmtInt(r.tokensOut)}
            </Td>
            <Td className="font-mono text-xs">{r.sessionId ? r.sessionId.slice(0, 8) : "—"}</Td>
            <Td className="text-ink-2 max-w-md">{truncate(r.inputSummary, 60) || "—"}</Td>
            <Td>
              {booked.has(r.id) ? <Badge tone="ok">予約あり</Badge> : <span className="text-ink-3">—</span>}
            </Td>
          </tr>
        ))}
      </Table>
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        href={(p) => `/admin/consultations${qs({ ...filter, page: p })}`}
      />
    </>
  );
}

export default function AdminConsultationsPage({ searchParams }: PageProps<"/admin/consultations">) {
  return (
    <Suspense fallback={<Loading />}>
      <ConsultationList searchParams={searchParams as Promise<SearchParams>} />
    </Suspense>
  );
}
