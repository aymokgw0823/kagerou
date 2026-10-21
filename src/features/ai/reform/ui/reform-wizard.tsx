"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { readSse } from "@/features/ai/shared/sse";
import { formatYen } from "@/config/reform-pricing";
import { reformParts, type ReformPartInput, type ReformResult } from "../schema";
import { Photo } from "@/components/ui/photo";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Step = "consent" | "upload" | "detail" | "analyzing" | "result";
type Picked = { file: File; url: string };

const MAX_PHOTOS = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const partHints: Record<ReformPartInput, string> = {
  外壁: "ひび割れ・色あせ・チョーキング（白い粉）・コーキングの劣化など",
  屋根: "色あせ・コケ・板金の浮き・雨樋の破損など",
  水回り: "キッチン・浴室・トイレ・洗面の劣化、カビ、漏水の跡など",
  内装: "壁紙の剥がれ・床の傷み・天井の染みなど",
  その他: "外構・設備・分類が分からないもの",
};

export function ReformWizard() {
  const [step, setStep] = useState<Step>("consent");
  const [consent, setConsent] = useState(false);
  const [photos, setPhotos] = useState<Picked[]>([]);
  const [part, setPart] = useState<ReformPartInput | "">("");
  const [description, setDescription] = useState("");
  const [statusLog, setStatusLog] = useState<string[]>([]);
  const [streamText, setStreamText] = useState("");
  const [result, setResult] = useState<ReformResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [streamText, statusLog]);

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter(
      (f) => /^image\/(jpeg|png|webp)$/.test(f.type) && f.size <= MAX_BYTES,
    );
    if (incoming.length !== Array.from(list).length)
      setError("JPEG / PNG / WebP 形式で、1枚 10MB 以内の写真を選んでください。");
    else setError(null);
    setPhotos((prev) =>
      [...prev, ...incoming.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(0, MAX_PHOTOS),
    );
  }

  async function submit() {
    if (!part) return;
    setStep("analyzing");
    track({ name: "ai_reform_start", params: { part } });
    setStatusLog([]);
    setStreamText("");
    setError(null);
    const fd = new FormData();
    photos.forEach((p) => fd.append("photos", p.file));
    fd.set("part", part);
    fd.set("description", description);
    fd.set("consent", "on");
    try {
      const res = await fetch("/api/ai/reform", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j.message ?? `エラーが発生しました（${res.status}）`);
      }
      await readSse(res, (e) => {
        if (e.event === "status") setStatusLog((l) => [...l, (e.data as { message: string }).message]);
        else if (e.event === "delta") setStreamText((t) => t + (e.data as { text: string }).text);
        else if (e.event === "result") {
          const r = e.data as ReformResult;
          setResult(r);
          track({ name: "ai_reform_complete", params: { mode: r.mode, id: r.id } });
          setStep("result");
        } else if (e.event === "error") throw new Error((e.data as { message: string }).message);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました。");
      setStep("detail");
    }
  }

  const steps: { id: Step; label: string }[] = [
    { id: "consent", label: "同意" },
    { id: "upload", label: "写真" },
    { id: "detail", label: "部位と状況" },
    { id: "analyzing", label: "解析" },
    { id: "result", label: "結果" },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        写真でリフォーム相談
      </h2>
      {/* 進捗 */}
      <ol className="mb-8 flex items-center gap-2 text-xs font-bold" aria-label="手順">
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2">
            <span
              className={cn(
                "font-display flex h-6 w-6 items-center justify-center rounded-full",
                i <= stepIndex ? "bg-link text-link-ink" : "bg-paper-2 text-ink-3",
              )}
              aria-current={i === stepIndex ? "step" : undefined}
            >
              {i + 1}
            </span>
            <span className={cn(i <= stepIndex ? "text-ink" : "text-ink-3")}>{s.label}</span>
            {i < steps.length - 1 && <span aria-hidden className="bg-line mx-1 h-px w-4" />}
          </li>
        ))}
      </ol>

      {error && (
        <p role="alert" className="rounded-brand border-danger bg-notice-soft mb-6 border-l-4 p-4 text-sm">
          {error}
        </p>
      )}

      {/* 1. 同意 */}
      {step === "consent" && (
        <div className="card p-6 md:p-8">
          <h3 className="text-xl font-bold">ご利用の前に</h3>
          <ul className="text-ink-2 mt-4 list-disc space-y-2 pl-5 text-sm leading-[1.8]">
            <li>
              結果はAIによる参考情報であり、正式な提案・見積もりではありません。正確な金額は現地調査で確定します。
            </li>
            <li>
              写真と入力内容はAIの解析に使用します。AIの学習には使用しません。写真の位置情報（EXIF）は受け付け時に削除します。
            </li>
            <li>
              写真に人物や個人情報（表札・郵便物など）が写り込まないようにしてください。説明欄に氏名・住所・電話番号を入力しないでください。
            </li>
            <li>相談内容は品質向上のため一定期間保存します。詳細は AI利用ポリシーをご覧ください。</li>
          </ul>
          <label className="mt-6 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="accent-link mt-1 h-4 w-4"
            />
            <span>
              <Link href="/policy/ai" target="_blank" className="link-underline">
                AI利用ポリシー
              </Link>
              に同意します。
            </span>
          </label>
          <div className="mt-6">
            <button
              type="button"
              disabled={!consent}
              onClick={() => setStep("upload")}
              className="btn-base bg-link text-link-ink min-h-12 px-8 disabled:opacity-50"
            >
              写真をアップロードする
            </button>
          </div>
        </div>
      )}

      {/* 2. 写真 */}
      {step === "upload" && (
        <div className="card p-6 md:p-8">
          <h3 className="text-xl font-bold">気になる箇所の写真（最大{MAX_PHOTOS}枚）</h3>
          <p className="text-ink-2 mt-2 text-sm">
            全体が分かる引きの写真と、気になる部分の寄りの写真があると精度が上がります。
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "rounded-brand mt-5 border-2 border-dashed p-8 text-center transition-colors",
              dragOver ? "border-link bg-tint" : "border-line",
            )}
          >
            <p className="text-ink-2 text-sm">ここに写真をドラッグ＆ドロップ</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="btn-base border-ink text-ink"
              >
                ファイルを選ぶ
              </button>
              <button
                type="button"
                onClick={() => cameraInput.current?.click()}
                className="btn-base border-ink text-ink md:hidden"
              >
                カメラで撮影
              </button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>
          {photos.length > 0 && (
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((p, i) => (
                <li key={p.url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={`選択した写真 ${i + 1}`}
                    className="rounded-brand aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`写真 ${i + 1} を削除`}
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    className="shadow-card absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={photos.length === 0}
              onClick={() => setStep("detail")}
              className="btn-base bg-link text-link-ink min-h-12 px-8 disabled:opacity-50"
            >
              次へ（{photos.length}枚）
            </button>
            <button type="button" onClick={() => setStep("consent")} className="text-ink-3 text-sm underline">
              戻る
            </button>
          </div>
        </div>
      )}

      {/* 3. 部位と状況 */}
      {step === "detail" && (
        <div className="card p-6 md:p-8">
          <h3 className="text-xl font-bold">気になる部位と状況</h3>
          <fieldset className="mt-5">
            <legend className="mb-2 text-sm font-bold">部位</legend>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {reformParts.map((p) => (
                <li key={p}>
                  <label
                    className={cn(
                      "rounded-brand block cursor-pointer border-2 p-3 text-center text-sm font-bold",
                      part === p ? "border-link bg-tint" : "border-line hover:border-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name="part"
                      value={p}
                      checked={part === p}
                      onChange={() => setPart(p)}
                      className="sr-only"
                    />
                    {p}
                  </label>
                </li>
              ))}
            </ul>
            {part && <p className="text-ink-3 mt-2 text-xs">例：{partHints[part]}</p>}
          </fieldset>
          <div className="mt-5">
            <label htmlFor="reform-desc" className="text-sm font-bold">
              状況の説明 <span className="text-ink-3 ml-1 text-[10px] font-bold">任意・1000字まで</span>
            </label>
            <textarea
              id="reform-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              placeholder="例：築20年の戸建てです。2年ほど前から外壁を触ると白い粉がつくようになり、北側に黒ずみがあります。"
              className="rounded-brand border-line focus:border-ink mt-1.5 min-h-28 w-full border px-3.5 py-2 text-sm focus:outline-none"
            />
            <p className="text-ink-3 mt-1 text-xs">
              個人情報（氏名・住所・電話番号）は入力しないでください。
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!part}
              onClick={submit}
              className="btn-base bg-link text-link-ink min-h-12 px-8 disabled:opacity-50"
            >
              AIに相談する
            </button>
            <button type="button" onClick={() => setStep("upload")} className="text-ink-3 text-sm underline">
              写真を選び直す
            </button>
          </div>
        </div>
      )}

      {/* 4. 解析中 */}
      {step === "analyzing" && (
        <div className="card p-6 md:p-8" aria-live="polite" aria-busy="true">
          <h3 className="text-xl font-bold">解析しています</h3>
          <ul className="mt-4 space-y-1 text-sm">
            {statusLog.map((s, i) => (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2",
                  i === statusLog.length - 1 ? "text-ink" : "text-ink-3",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === statusLog.length - 1 ? "bg-link animate-pulse" : "bg-accent",
                  )}
                />
                {s}
              </li>
            ))}
          </ul>
          <div
            ref={logRef}
            className="rounded-brand bg-paper-2 text-ink-3 mt-4 max-h-40 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap"
            aria-hidden
          >
            {streamText || "…"}
          </div>
        </div>
      )}

      {/* 5. 結果 */}
      {step === "result" && result && (
        <ReformResultView
          result={result}
          onRestart={() => {
            setResult(null);
            setPhotos([]);
            setPart("");
            setDescription("");
            setStep("upload");
          }}
        />
      )}
    </section>
  );
}

const severityLabel: Record<string, string> = {
  low: "軽度",
  medium: "中程度",
  high: "要注意",
  unknown: "不明",
};
const priorityLabel: Record<string, string> = { high: "優先", medium: "検討", low: "任意" };

export function ReformResultView({ result, onRestart }: { result: ReformResult; onRestart?: () => void }) {
  const [email, setEmail] = useState("");
  const [pdfState, setPdfState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const a = result.analysis;

  async function downloadPdf() {
    setPdfState("busy");
    try {
      const res = await fetch(`/api/ai/reform/${result.id}/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const aEl = document.createElement("a");
      aEl.href = url;
      aEl.download = `reform-report-${result.id}.pdf`;
      aEl.click();
      URL.revokeObjectURL(url);
      track({ name: "ai_reform_pdf", params: { id: result.id, with_email: !!email.trim() } });
      setPdfState("done");
    } catch {
      setPdfState("error");
    }
  }

  return (
    <div className="space-y-8">
      {result.mode === "demo" && (
        <p className="rounded-pill border-notice bg-notice-soft text-notice border px-4 py-1.5 text-xs font-bold">
          デモモード：API キーが未設定のため、サンプルの解析結果を表示しています。
        </p>
      )}
      {a.safety.flagged && (
        <div role="alert" className="rounded-brand border-danger bg-notice-soft border-l-4 p-5">
          <p className="font-bold">安全に関わる可能性があります</p>
          <ul className="mt-2 list-disc pl-5 text-sm leading-[1.8]">
            {a.safety.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-bold">早めに専門家の点検を受けることをおすすめします。</p>
        </div>
      )}
      <div className="card p-6 md:p-8">
        <p className="text-ink-3 text-xs font-bold">
          相談ID：<span className="font-display">{result.id}</span>｜部位：{result.part}｜写真{" "}
          {result.photoCount} 枚
        </p>
        <h3 className="mt-2 text-2xl font-bold">写真から読み取れる状態</h3>
        <p className="text-ink-2 mt-3 leading-[1.9]">{a.summary}</p>
        {a.notRelevant ? (
          <p className="rounded-brand bg-paper-2 mt-4 p-4 text-sm">
            写真から建物の部位を確認できませんでした。外壁・屋根・水回りなどが写った写真でお試しください。
          </p>
        ) : (
          <ul className="divide-line border-line mt-5 divide-y border-y">
            {a.findings.map((f, i) => (
              <li key={i} className="grid grid-cols-1 gap-1 py-3 text-sm md:grid-cols-12 md:gap-4">
                <span className="font-bold md:col-span-3">
                  写真{f.photoIndex}：{f.area}
                </span>
                <span className="text-ink-2 md:col-span-7">{f.observation}</span>
                <span className="text-ink-3 text-xs font-bold md:col-span-2 md:text-right">
                  {severityLabel[f.severity]}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-ink-3 mt-3 text-xs">※ 写真からの推定です。</p>
      </div>

      {!a.notRelevant && a.candidates.length > 0 && (
        <div className="card p-6 md:p-8">
          <h3 className="text-2xl font-bold">考えられる施工内容と概算の費用レンジ</h3>
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="border-ink border-b-2 text-left text-xs">
                <th className="py-2 pr-3">施工内容</th>
                <th className="py-2 pr-3">数量（推定）</th>
                <th className="py-2 text-right">概算</th>
              </tr>
            </thead>
            <tbody>
              {result.estimate.lines.map((l) => {
                const c = a.candidates.find((x) => x.itemId === l.itemId);
                return (
                  <tr key={l.itemId} className="border-line border-b align-top">
                    <td className="py-3 pr-3">
                      <span className="font-bold">{l.label}</span>
                      {c && (
                        <span className="rounded-pill border-line text-ink-3 ml-2 border px-2 py-px text-[10px] font-bold">
                          {priorityLabel[c.priority]}
                        </span>
                      )}
                      {c && <p className="text-ink-2 mt-1 text-xs">{c.rationale}</p>}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {l.quantity} {l.unit}
                      {l.quantityEstimated && <span className="text-ink-3 ml-1 text-[10px]">（標準値）</span>}
                    </td>
                    <td className="font-display py-3 text-right font-bold whitespace-nowrap">
                      {l.min === 0 && l.max === 0 ? "無料" : `${formatYen(l.min)}〜${formatYen(l.max)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="py-3 font-bold">
                  合計の目安
                </td>
                <td className="font-display py-3 text-right text-lg font-bold">
                  {formatYen(result.estimate.totalMin)}〜{formatYen(result.estimate.totalMax)}
                </td>
              </tr>
            </tfoot>
          </table>
          <p className="text-ink-3 mt-2 text-xs">{result.disclaimer}</p>
        </div>
      )}

      <div className="card p-6 md:p-8">
        <h3 className="text-xl font-bold">現地調査で確認すること</h3>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-[1.8]">
          {a.nextSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton
            href={`/booking?business=build&consultation=${encodeURIComponent(result.id)}`}
            size="lg"
          >
            現地調査を予約する（無料）
          </LinkButton>
          <LinkButton
            href={`/contact?business=build&consultation=${encodeURIComponent(result.id)}`}
            variant="outline"
            size="lg"
          >
            この結果について問い合わせる
          </LinkButton>
        </div>
        <p className="text-ink-3 mt-3 text-xs">
          相談IDが予約・お問い合わせに引き継がれ、担当者が事前に内容を確認します。
        </p>
      </div>

      {result.similarWorks.length > 0 && (
        <div>
          <h3 className="mb-4 text-xl font-bold">類似の施工事例</h3>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {result.similarWorks.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/works/${w.slug}`}
                  className="card hover:shadow-card block h-full overflow-hidden"
                >
                  <Photo
                    id={w.photoId}
                    fill
                    className="aspect-[3/2] w-full"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="p-4">
                    <p className="text-ink-3 text-xs">{w.client}</p>
                    <p className="mt-1 font-bold">{w.title}</p>
                    <p className="text-ink-2 mt-1 line-clamp-2 text-xs">{w.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card p-6 md:p-8">
        <h3 className="text-xl font-bold">結果をPDFで保存</h3>
        <p className="text-ink-2 mt-2 text-sm">
          メールアドレスは任意です。ご入力いただくと、担当者からのご連絡に利用します。
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス（任意）"
            aria-label="メールアドレス（任意）"
            className="rounded-pill border-line focus:border-ink min-h-11 flex-1 border px-4 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={downloadPdf}
            disabled={pdfState === "busy"}
            className="btn-base border-ink text-ink hover:bg-ink hover:text-paper min-h-11 disabled:opacity-50"
          >
            {pdfState === "busy" ? "作成中…" : "PDFをダウンロード"}
          </button>
        </div>
        {pdfState === "error" && (
          <p role="alert" className="text-danger mt-2 text-xs font-bold">
            PDF の作成に失敗しました。時間をおいて再度お試しください。
          </p>
        )}
        {pdfState === "done" && <p className="text-success mt-2 text-xs">ダウンロードを開始しました。</p>}
      </div>

      {onRestart && (
        <p>
          <button type="button" onClick={onRestart} className="text-ink-3 text-sm underline">
            別の写真で相談する
          </button>
        </p>
      )}
    </div>
  );
}
