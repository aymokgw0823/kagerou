import type { ReactNode } from "react";
import { Photo } from "./photo";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  /** 見出しの上の小さなラベル */
  eyebrow?: ReactNode;
  lead?: ReactNode;
  /** 強調したい1文（見出し直下・太字） */
  tagline?: ReactNode;
  photoId?: string;
  /** 背景に敷く要素（3D 演出など）。写真の上に重なる。`absolute inset-0 -z-10` で配置すること */
  background?: ReactNode;
  actions?: ReactNode;
  /** 高さ */
  size?: "default" | "tall";
  /** 写真の上に重ねる色（事業ページ用の CSS 変数名） */
  tintVar?: string;
  className?: string;
};

/** 全幅のダーク写真ヒーロー。白い見出しを左に置く */
export function Hero({
  title,
  eyebrow,
  lead,
  tagline,
  photoId,
  background,
  actions,
  size = "default",
  tintVar,
  className,
}: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-black text-white", className)}>
      {photoId && (
        <Photo
          id={photoId}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-90"
        />
      )}
      {background}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
      />
      {tintVar && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-35 mix-blend-multiply"
          style={{ backgroundColor: `var(${tintVar})` }}
        />
      )}
      <div
        className={cn(
          "container-max flex flex-col justify-center",
          size === "tall"
            ? "min-h-[36rem] py-24 md:min-h-[42rem]"
            : "min-h-[22rem] py-16 md:min-h-[28rem] md:py-20",
        )}
      >
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-4 text-sm font-bold tracking-wide text-white/80">{eyebrow}</p>}
          <h1 className="text-[2rem] leading-[1.3] md:text-[2.75rem]">{title}</h1>
          {tagline && <p className="mt-5 text-lg font-bold md:text-xl">{tagline}</p>}
          {lead && (
            <div className="mt-4 max-w-xl text-[0.9375rem] leading-[1.9] text-white/85 md:text-base">
              {lead}
            </div>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
