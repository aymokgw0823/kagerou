import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  businessLabel,
  fmtDateTime,
  label,
  leadKindLabel,
  pageNumber,
  qs,
  type SearchParams,
  sp,
  truncate,
} from "@/lib/admin/helpers";
import { BUSINESSES, LEAD_KINDS, leadWhere, parseLeadFilter } from "@/lib/admin/leads";
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

export const metadata: Metadata = { title: "リード" };

const PAGE_SIZE = 50;

async function LeadList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const filter = parseLeadFilter(params);
  const page = pageNumber(sp(params, "page"));
  await requireAdmin(`/admin/leads${qs({ ...filter, page })}`);

  const where = leadWhere(filter);
  const [total, rows] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        createdAt: true,
        kind: true,
        business: true,
        name: true,
        email: true,
        subject: true,
        message: true,
        consultationId: true,
      },
    }),
  ]);
  const exportHref = `/admin/leads/export${qs(filter)}`;

  return (
    <>
      <AdminPageTitle title="リード">
        <a
          href={exportHref}
          className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-9 px-4 text-xs"
          download
        >
          CSV 出力{total ? `（${total.toLocaleString("ja-JP")} 件）` : ""}
        </a>
      </AdminPageTitle>
      <FilterBar action="/admin/leads" reset="/admin/leads">
        <FilterField label="種別">
          <FilterSelect name="kind" defaultValue={filter.kind ?? ""}>
            <option value="">すべて</option>
            {LEAD_KINDS.map((k) => (
              <option key={k} value={k}>
                {leadKindLabel[k]}
              </option>
            ))}
          </FilterSelect>
        </FilterField>
        <FilterField label="事業">
          <FilterSelect name="business" defaultValue={filter.business ?? ""}>
            <option value="">すべて</option>
            {BUSINESSES.map((b) => (
              <option key={b} value={b}>
                {businessLabel[b]}
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
            <Th>種別</Th>
            <Th>事業</Th>
            <Th>名前</Th>
            <Th>メール</Th>
            <Th>件名 / 本文</Th>
            <Th>相談ID</Th>
          </>
        }
      >
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-paper-2">
            <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(r.createdAt)}</Td>
            <Td>
              <Badge tone={r.kind === "contact" ? "info" : "neutral"}>{label(leadKindLabel, r.kind)}</Badge>
            </Td>
            <Td className="whitespace-nowrap">{label(businessLabel, r.business)}</Td>
            <Td className="whitespace-nowrap">{r.name}</Td>
            <Td>
              <a href={`mailto:${r.email}`} className="link-underline break-all">
                {r.email}
              </a>
            </Td>
            <Td className="max-w-md">
              {r.subject && <span className="font-bold">{truncate(r.subject, 50)}</span>}
              {r.subject && r.message && <span className="text-ink-3"> ／ </span>}
              <span className="text-ink-2">{truncate(r.message, 50)}</span>
            </Td>
            <Td className="font-mono text-xs">
              {r.consultationId ? (
                <Link
                  href={`/admin/consultations/${encodeURIComponent(r.consultationId)}`}
                  className="link-underline"
                >
                  {r.consultationId.slice(0, 8)}
                </Link>
              ) : (
                "—"
              )}
            </Td>
          </tr>
        ))}
      </Table>
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        href={(p) => `/admin/leads${qs({ ...filter, page: p })}`}
      />
    </>
  );
}

export default function AdminLeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  return (
    <Suspense fallback={<Loading />}>
      <LeadList searchParams={searchParams as Promise<SearchParams>} />
    </Suspense>
  );
}
