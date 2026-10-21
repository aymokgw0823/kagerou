import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { fmtDateTime, pageNumber, qs, type SearchParams, sp, truncate } from "@/lib/admin/helpers";
import { AdminPageTitle, Loading, Pagination, Table, Td, Th } from "@/components/admin/ui";

export const metadata: Metadata = { title: "エントリー" };

const PAGE_SIZE = 50;

async function EntryList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = pageNumber(sp(params, "page"));
  await requireAdmin(`/admin/entries${qs({ page })}`);

  const [total, rows] = await Promise.all([
    db.entry.count(),
    db.entry.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return (
    <>
      <AdminPageTitle title="エントリー" />
      <Table
        empty={rows.length === 0}
        head={
          <>
            <Th>日時</Th>
            <Th>職種</Th>
            <Th>名前</Th>
            <Th>メール / 電話</Th>
            <Th>住所</Th>
            <Th>メッセージ</Th>
            <Th>履歴書</Th>
          </>
        }
      >
        {rows.map((e) => (
          <tr key={e.id} className="hover:bg-paper-2">
            <Td className="whitespace-nowrap tabular-nums">{fmtDateTime(e.createdAt)}</Td>
            <Td>
              {e.jobTitle}
              <span className="text-ink-3 block font-mono text-xs">{e.jobSlug}</span>
            </Td>
            <Td className="whitespace-nowrap">
              {e.name}
              <span className="text-ink-3 block text-xs">{e.kana}</span>
            </Td>
            <Td>
              <a href={`mailto:${e.email}`} className="link-underline break-all">
                {e.email}
              </a>
              <span className="text-ink-3 block text-xs">{e.tel}</span>
            </Td>
            <Td className="text-ink-2 max-w-xs">{e.address || "—"}</Td>
            <Td className="text-ink-2 max-w-md">{truncate(e.message, 60) || "—"}</Td>
            <Td className="font-mono text-xs break-all">
              {e.resumeKey ? (
                <>
                  {e.resumeKey}
                  {e.resumeName && <span className="text-ink-3 block font-sans">{e.resumeName}</span>}
                </>
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
        href={(p) => `/admin/entries${qs({ page: p })}`}
      />
    </>
  );
}

export default function AdminEntriesPage({ searchParams }: PageProps<"/admin/entries">) {
  return (
    <Suspense fallback={<Loading />}>
      <EntryList searchParams={searchParams as Promise<SearchParams>} />
    </Suspense>
  );
}
