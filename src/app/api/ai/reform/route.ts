/**
 * POST /api/ai/reform  — 写真でリフォーム相談（multipart/form-data → SSE）
 * イベント：status / delta / result / error
 */
import { guardAi } from "@/features/ai/shared/guard";
import { prepareImages } from "@/features/ai/shared/images";
import { sseResponse } from "@/features/ai/shared/sse";
import { sessionCookieHeader } from "@/features/ai/shared/session";
import { recordUsage } from "@/features/ai/shared/budget";
import { completeConsultation, failConsultation, startConsultation } from "@/features/ai/shared/log";
import { analyzeReform } from "@/features/ai/reform/analyze";
import { reformInputSchema } from "@/features/ai/reform/schema";

export const maxDuration = 120;

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ message: "リクエストの形式が不正です。" }, { status: 400 });
  }
  const input = reformInputSchema.safeParse({
    part: form.get("part"),
    description: form.get("description") ?? "",
    consent: form.get("consent"),
  });
  if (!input.success)
    return Response.json(
      { message: "入力内容をご確認ください（部位の選択とAI利用ポリシーへの同意が必要です）。" },
      { status: 400 },
    );

  const guard = await guardAi("reform", req, { requireConsent: true, consent: true });
  if (!guard.ok) return Response.json({ message: guard.message }, { status: guard.status });

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const prepared = await prepareImages(files);
  if (!prepared.ok) return Response.json({ message: prepared.message }, { status: 400 });

  const id = await startConsultation({
    tool: "reform",
    inputSummary: `部位：${input.data.part}／写真${prepared.images.length}枚／${input.data.description}`,
    mode: guard.demo ? "demo" : "live",
    sessionId: guard.sessionId,
    ip: guard.ip,
  });

  return sseResponse(
    async (emit) => {
      emit({ event: "started", data: { id, mode: guard.demo ? "demo" : "live" } });
      try {
        const { result, usage } = await analyzeReform(
          {
            id,
            images: prepared.images,
            part: input.data.part,
            description: input.data.description,
            demo: guard.demo,
          },
          {
            status: (message) => emit({ event: "status", data: { message } }),
            delta: (text) => emit({ event: "delta", data: { text } }),
          },
        );
        if (!guard.demo) await recordUsage(usage.tokensIn, usage.tokensOut);
        await completeConsultation(id, {
          resultJson: result,
          tokensIn: usage.tokensIn,
          tokensOut: usage.tokensOut,
        });
        emit({ event: "result", data: result });
      } catch (err) {
        const message = err instanceof Error ? err.message : "解析中にエラーが発生しました。";
        await failConsultation(id, message);
        emit({ event: "error", data: { message } });
      }
    },
    { headers: guard.sessionIsNew ? { "Set-Cookie": sessionCookieHeader(guard.sessionId) } : {} },
  );
}
