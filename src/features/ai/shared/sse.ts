/**
 * Server-Sent Events（text/event-stream）でストリーミングするためのヘルパー。
 * イベント形式：`event: <name>\ndata: <json>\n\n`
 */
export type SseEvent = { event: string; data: unknown };

export function sseResponse(
  run: (emit: (e: SseEvent) => void) => Promise<void>,
  init: { headers?: Record<string, string> } = {},
): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: SseEvent) => {
        controller.enqueue(encoder.encode(`event: ${e.event}\ndata: ${JSON.stringify(e.data)}\n\n`));
      };
      try {
        await run(emit);
      } catch (err) {
        emit({
          event: "error",
          data: { message: err instanceof Error ? err.message : "予期しないエラーが発生しました。" },
        });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      ...init.headers,
    },
  });
}

/** クライアント側：fetch のレスポンスを SSE として読む */
export async function readSse(res: Response, onEvent: (e: SseEvent) => void): Promise<void> {
  if (!res.body) throw new Error("no body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      let event = "message";
      let data = "";
      for (const line of chunk.split("\n")) {
        if (line.startsWith("event: ")) event = line.slice(7);
        else if (line.startsWith("data: ")) data += line.slice(6);
      }
      if (data) {
        try {
          onEvent({ event, data: JSON.parse(data) });
        } catch {
          onEvent({ event, data });
        }
      }
    }
  }
}

/** それらしい遅延で文字列を分割して流す（デモモード用） */
export async function streamChunks(
  text: string,
  emit: (chunk: string) => void,
  opts: { chunk?: number; delayMs?: number } = {},
): Promise<void> {
  const size = opts.chunk ?? 12;
  const delay = opts.delayMs ?? 30;
  for (let i = 0; i < text.length; i += size) {
    emit(text.slice(i, i + size));
    await new Promise((r) => setTimeout(r, delay));
  }
}
