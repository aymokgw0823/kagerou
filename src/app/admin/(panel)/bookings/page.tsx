import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import {
  bookingStatusLabel,
  businessLabel,
  dateRange,
  fmtDateTime,
  label,
  pageNumber,
  qs,
  type SearchParams,
  sp,
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
import { updateBookingStatus } from "./actions";

export const metadata: Metadata = { title: "予約" };

const PAGE_SIZE = 50;
const STATUSES = ["requested", "confirmed", "cancelled"] as const;

async function BookingList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const statusRaw = sp(params, "status");
  const filter = {
    status: statusRaw && (STATUSES as readonly string[]).includes(statusRaw) ? statusRaw : undefined,
    from: ymd(sp(params, "from")),
    to: ymd(sp(params, "to")),
  };
  const page = pageNumber(sp(params, "page"));
  await requireAdmin(`/admin/bookings${qs({ ...filter, page })}`);

  const range = dateRange(filter.from, filter.to);
  const where: Prisma.BookingWhereInput = {
    ...(filter.status ? { status: filter.status } : {}),
    // 期間は「第1希望日時」で絞り込む
    ...(range ? { slot: range } : {}),
  };
  const [total, rows] = await Promise.all([
    db.booking.count({ where }),
    db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <>
      <AdminPageTitle title="予約" />
      <FilterBar action="/admin/bookings" reset="/admin/bookings">
        <FilterField label="状態">
          <FilterSelect name="status" defaultValue={filter.status ?? ""}>
            <option value="">すべて</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {bookingStatusLabel[s]}
              </option>
            ))}
          </FilterSelect>
        </FilterField>
        <FilterField label="第1希望（から）">
          <FilterInput type="date" name="from" defaultValue={filter.from ?? ""} />
        </FilterField>
        <FilterField label="第1希望（まで）">
          <FilterInput type="date" name="to" defaultValue={filter.to ?? ""} />
        </FilterField>
      </FilterBar>
      <Table
        empty={rows.length === 0}
        head={
          <>
            <Th>第1希望</Th>
            <Th>第2希望</Th>
            <Th>名前</Th>
            <Th>メール</Th>
            <Th>事業</Th>
            <Th>状態</Th>
            <Th>相談ID</Th>
            <Th>操作</Th>
          </>
        }
      >
        {rows.map((b) => (
          <tr key={b.id} className="hover:bg-paper-2">
            <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(b.slot)}</Td>
            <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(b.altSlot)}</Td>
            <Td className="whitespace-nowrap">
              {b.name}
              {b.topic && <span className="text-ink-3 block text-xs">{b.topic}</span>}
            </Td>
            <Td>
              <a href={`mailto:${b.email}`} className="link-underline break-all">
                {b.email}
              </a>
              {b.tel && <span className="text-ink-3 block text-xs">{b.tel}</span>}
            </Td>
            <Td className="whitespace-nowrap">{label(businessLabel, b.business)}</Td>
            <Td>
              <Badge tone={b.status === "confirmed" ? "ok" : b.status === "cancelled" ? "danger" : "neutral"}>
                {label(bookingStatusLabel, b.status)}
              </Badge>
            </Td>
            <Td className="font-mono text-xs">
              {b.consultationId ? (
                <Link
                  href={`/admin/consultations/${encodeURIComponent(b.consultationId)}`}
                  className="link-underline"
                >
                  {b.consultationId.slice(0, 8)}
                </Link>
              ) : (
                "—"
              )}
            </Td>
            <Td>
              {b.status === "requested" ? (
                <div className="flex gap-1">
                  <form action={updateBookingStatus}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="confirmed" />
                    <button
                      type="submit"
                      className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-7 px-3 text-xs"
                    >
                      確定
                    </button>
                  </form>
                  <form action={updateBookingStatus}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button
                      type="submit"
                      className="btn-base border-line text-ink hover:bg-paper-3 min-h-7 border px-3 text-xs"
                    >
                      キャンセル
                    </button>
                  </form>
                </div>
              ) : (
                <span className="text-ink-3 text-xs">—</span>
              )}
            </Td>
          </tr>
        ))}
      </Table>
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        href={(p) => `/admin/bookings${qs({ ...filter, page: p })}`}
      />
    </>
  );
}

export default function AdminBookingsPage({ searchParams }: PageProps<"/admin/bookings">) {
  return (
    <Suspense fallback={<Loading />}>
      <BookingList searchParams={searchParams as Promise<SearchParams>} />
    </Suspense>
  );
}
