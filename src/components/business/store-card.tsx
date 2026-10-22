import Image from "next/image";
import type { Store } from "@/content/business/types";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  store: Store;
  /** compact：トップの店舗案内（写真＋基本情報）／full：事業ページ（ロゴ・設備・各種リンクまで） */
  variant?: "compact" | "full";
  className?: string;
};

function telHref(tel: string) {
  return `tel:${tel.replace(/[^\d+]/g, "")}`;
}

/** 店舗カード（飲食事業の自社店舗） */
export function StoreCard({ store: s, variant = "compact", className }: Props) {
  const full = variant === "full";
  return (
    <article
      className={cn("card flex flex-col overflow-hidden", !full && "sm:flex-row", className)}
      style={{ borderLeftColor: "var(--color-biz-dining)" }}
    >
      <div className={cn("relative", full ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full sm:w-2/5 sm:shrink-0")}>
        <Photo
          id={s.photoId}
          fill
          className="absolute inset-0 h-full w-full"
          sizes={full ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 768px) 20vw, 100vw"}
        />
        {s.logoSrc && (
          <span className="absolute right-3 bottom-3 block h-16 w-16 overflow-hidden rounded-sm bg-black/85 p-1 shadow-card sm:h-20 sm:w-20">
            <Image src={s.logoSrc} alt={`${s.name} ロゴ`} width={80} height={80} className="h-full w-full" />
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col", full ? "p-6 md:p-8" : "p-6")}>
        <p className="text-ink-3 text-xs font-bold">
          {s.brand}
          {s.nameEn && <span className="font-display ml-2 tracking-wider">{s.nameEn}</span>}
        </p>
        <h3 className={cn("mt-1 font-bold", full ? "text-2xl" : "text-xl")}>
          {s.name} <DummyBadge show={s.isDummy} />
        </h3>
        {full && <p className="text-ink-2 mt-3 text-[0.9375rem] leading-[1.8]">{s.concept}</p>}
        <dl className={cn("grid gap-y-1.5 text-sm", full ? "mt-5 grid-cols-[6rem_1fr] gap-y-2" : "mt-3 grid-cols-[4.5rem_1fr]")}>
          <dt className="text-ink-2 font-bold">営業時間</dt>
          <dd>{s.hours}</dd>
          <dt className="text-ink-2 font-bold">定休日</dt>
          <dd>{s.closed}</dd>
          <dt className="text-ink-2 font-bold">所在地</dt>
          <dd>
            <Placeholder value={s.address} />
            {s.mapUrl && (
              <>
                {" "}
                <a href={s.mapUrl} target="_blank" rel="noopener" className="link-underline text-xs whitespace-nowrap">
                  Google マップで見る
                </a>
              </>
            )}
          </dd>
          {s.tel && (
            <>
              <dt className="text-ink-2 font-bold">電話</dt>
              <dd>
                <a href={telHref(s.tel)} className="link-underline font-display">
                  {s.tel}
                </a>
              </dd>
            </>
          )}
          {full &&
            s.facts?.map((f) => (
              <div key={f.label} className="contents">
                <dt className="text-ink-2 font-bold">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
        </dl>
        <div className={cn("flex flex-wrap items-center gap-3", full ? "mt-6" : "mt-auto pt-4")}>
          {s.reservationUrl ? (
            <LinkButton href={s.reservationUrl} target="_blank" rel="noopener">
              Web 予約{s.reservationLabel ? `（${s.reservationLabel}）` : ""}
            </LinkButton>
          ) : (
            <span className="rounded-pill border-line text-ink-3 inline-flex items-center border border-dashed px-4 py-2 text-xs">
              予約サービスのリンクは準備中です
            </span>
          )}
          {s.tel && (
            <LinkButton href={telHref(s.tel)} variant="outline">
              電話で予約
            </LinkButton>
          )}
          {full && s.website && (
            <LinkButton href={s.website} target="_blank" rel="noopener" variant="text">
              店舗公式サイト
            </LinkButton>
          )}
          {full &&
            s.social?.map((x) => (
              <LinkButton key={x.href} href={x.href} target="_blank" rel="noopener" variant="text">
                {x.label}
              </LinkButton>
            ))}
          {!full && (
            <LinkButton href="/business/dining" variant="text">
              店舗の詳細
            </LinkButton>
          )}
        </div>
      </div>
    </article>
  );
}
