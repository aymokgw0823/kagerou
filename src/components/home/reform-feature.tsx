import { reformTool } from "@/config/ai-tools";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

/** トップの最重要CTA：写真でリフォーム相談（AI） */
export function ReformFeature() {
  return (
    <div
      className="card grid grid-cols-1 overflow-hidden lg:grid-cols-12"
      style={{ borderLeftColor: "var(--color-biz-build)" }}
    >
      <div className="relative min-h-[14rem] lg:col-span-5 lg:min-h-full">
        <Photo
          id="build-before"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="p-8 lg:col-span-7 lg:p-10">
        <p className="text-biz-build text-xs font-bold">建設事業｜無料・{reformTool.duration}</p>
        <h3 className="mt-2 text-2xl font-bold md:text-3xl">{reformTool.name}</h3>
        <p className="text-ink-2 mt-4 text-[0.9375rem] leading-[1.9]">{reformTool.description}</p>
        <ol className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {reformTool.steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-sm">
              <span className="font-display text-biz-build font-bold">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LinkButton href={reformTool.href} size="lg">
            写真で相談してみる
          </LinkButton>
          <LinkButton href="/business/build" variant="text">
            建設事業について
          </LinkButton>
        </div>
        <p className="text-ink-3 mt-5 text-xs">
          ※
          結果はAIによる参考情報であり、正式な提案・見積もりではありません。正確な金額は現地調査で確定します。個人情報は入力しないでください。
        </p>
      </div>
    </div>
  );
}
