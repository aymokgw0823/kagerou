import Link from "next/link";
import { businesses, pillars } from "@/config/businesses";
import { Photo } from "@/components/ui/photo";
import { Arrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 2事業の関係図：「つくる（建設）」と「営む（飲食）」が互いに根拠になっている構造。
 * ホバー／タップで各事業ページへ。CSS のみで動作する。
 */
export function BusinessMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-0">
        {businesses.map((b, i) => (
          <li key={b.id} className={cn("relative", i === 0 ? "lg:pr-10" : "lg:pl-10")}>
            <Link
              href={b.href}
              className="card group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_-16px_rgba(0,0,0,0.3)]"
              style={{ borderLeftColor: `var(${b.colorVar})` }}
            >
              <Photo
                id={b.keyVisualId}
                fill
                className="aspect-[21/9] w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
                imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col p-7">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-ink-3 text-sm font-bold">0{i + 1}</span>
                  <span className="text-3xl font-bold">{pillars[b.pillar].ja}</span>
                  <span className="font-display text-ink-3 text-sm font-semibold">
                    {pillars[b.pillar].en}
                  </span>
                </p>
                <p className="text-ink-2 mt-2 text-sm">{pillars[b.pillar].description}</p>
                <h3 className="mt-5 text-xl font-bold">
                  {b.nameJa}事業 <span className="text-ink-3 ml-2 text-sm font-normal">{b.tagline}</span>
                </h3>
                <p className="text-ink-2 mt-2 text-[0.9375rem] leading-[1.8]">{b.description}</p>
                <span className="link-arrow text-link mt-auto pt-5">
                  {b.nameJa}事業を見る
                  <Arrow />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {/* 中央の結節点：相互の根拠 */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      >
        <span className="font-display text-accent-light shadow-card flex h-16 w-16 items-center justify-center rounded-full bg-black text-xs font-bold">
          ⇄
        </span>
      </div>
      <dl className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-brand bg-black p-6 text-white">
          <dt className="text-accent-light text-xs font-bold">建設 → 飲食</dt>
          <dd className="mt-2 text-[0.9375rem] leading-[1.8]">
            店舗の設計・施工は自社の建設部門が手がける。営業しながら小さな改修を重ね、店を育て続けられる。
          </dd>
        </div>
        <div className="rounded-brand bg-black p-6 text-white">
          <dt className="text-accent-light text-xs font-bold">飲食 → 建設</dt>
          <dd className="mt-2 text-[0.9375rem] leading-[1.8]">
            毎日店に立っているから、図面の段階で「使いにくさ」に気づける。使う側の視点で、店舗・住宅・オフィスを設計する。
          </dd>
        </div>
      </dl>
    </div>
  );
}
