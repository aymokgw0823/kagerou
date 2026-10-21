/**
 * リード CSV 出力（UTF-8 BOM 付き）。認証必須：proxy に加えてここでも getAdminSession() で再チェックする。
 */
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";
import { leadWhere, parseLeadFilter } from "@/lib/admin/leads";
import { todayJst } from "@/lib/admin/helpers";

const MAX_ROWS = 10_000;

function csvCell(v: string | null | undefined | Date): string {
  if (v === null || v === undefined) return "";
  const s = v instanceof Date ? v.toISOString() : String(v);
  // Excel の数式インジェクション対策：先頭が = + - @ なら ' を付ける
  const guarded = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${guarded.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((v, k) => (params[k] = v));
  const filter = parseLeadFilter(params);
  const rows = await db.lead.findMany({
    where: leadWhere(filter),
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
  });

  const header = [
    "id",
    "createdAt(UTC)",
    "kind",
    "business",
    "name",
    "kana",
    "email",
    "tel",
    "company",
    "subject",
    "message",
    "extra",
    "consultationId",
    "source",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.createdAt,
        r.kind,
        r.business,
        r.name,
        r.kana,
        r.email,
        r.tel,
        r.company,
        r.subject,
        r.message,
        r.extra,
        r.consultationId,
        r.source,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const body = `﻿${lines.join("\r\n")}\r\n`;
  const filename = `leads-${todayJst().replaceAll("-", "")}.csv`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
