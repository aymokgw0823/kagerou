/**
 * POST /api/ai/reform/[id]/pdf — 相談結果の PDF を生成して返す。
 * body: { email?: string }（任意。入力があればリードとして保存し、相談ログにマスク済みメールを記録）
 */
import { z } from "zod";
import { db } from "@/lib/db";
import { clientIp } from "@/lib/rate-limit";
import { maskEmail } from "@/features/ai/shared/sanitize";
import { attachEmail } from "@/features/ai/shared/log";
import { renderReformPdf } from "@/features/ai/reform/pdf";
import type { ReformResult } from "@/features/ai/reform/schema";

export const maxDuration = 60;

const bodySchema = z.object({
  email: z.string().trim().email().max(120).optional(),
  name: z.string().trim().max(60).optional(),
});

export async function POST(req: Request, ctx: RouteContext<"/api/ai/reform/[id]/pdf">) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return Response.json({ message: "不正なIDです。" }, { status: 400 });
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success)
    return Response.json({ message: "メールアドレスの形式をご確認ください。" }, { status: 400 });
  const row = await db.consultation.findUnique({ where: { id } });
  if (!row || row.tool !== "reform" || row.status !== "completed" || !row.resultJson)
    return Response.json({ message: "相談結果が見つかりません。" }, { status: 404 });
  const result = JSON.parse(row.resultJson) as ReformResult;

  if (parsed.data.email) {
    const email = parsed.data.email;
    await Promise.all([
      db.lead.create({
        data: {
          kind: "reform-pdf",
          business: "build",
          name: parsed.data.name || "（PDFダウンロード）",
          email,
          message: `写真でリフォーム相談の結果PDFをダウンロード（相談ID: ${id}）`,
          consultationId: id,
          source: "/ai/reform",
          ip: clientIp(req.headers),
        },
      }),
      attachEmail(id, maskEmail(email)),
    ]);
  }
  const pdf = await renderReformPdf(result, parsed.data.name);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reform-report-${id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
