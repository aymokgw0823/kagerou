/** リード一覧・CSV 出力で共有する検索条件 */
import type { Prisma } from "@/generated/prisma/client";
import { dateRange, type SearchParams, sp, ymd } from "./helpers";

export const LEAD_KINDS = ["contact", "reform-pdf"] as const;
export const BUSINESSES = ["build", "dining", "other"] as const;

export type LeadFilter = { kind?: string; business?: string; from?: string; to?: string };

export function parseLeadFilter(params: SearchParams): LeadFilter {
  const kind = sp(params, "kind");
  const business = sp(params, "business");
  return {
    kind: kind && (LEAD_KINDS as readonly string[]).includes(kind) ? kind : undefined,
    business: business && (BUSINESSES as readonly string[]).includes(business) ? business : undefined,
    from: ymd(sp(params, "from")),
    to: ymd(sp(params, "to")),
  };
}

export function leadWhere(f: LeadFilter): Prisma.LeadWhereInput {
  return {
    ...(f.kind ? { kind: f.kind } : {}),
    ...(f.business ? { business: f.business } : {}),
    ...(dateRange(f.from, f.to) ? { createdAt: dateRange(f.from, f.to) } : {}),
  };
}
