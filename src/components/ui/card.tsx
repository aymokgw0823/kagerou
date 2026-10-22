import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "./button";
import { Photo } from "./photo";
import { DummyBadge } from "./dummy-badge";

type CardProps = {
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  linkLabel?: string;
  /** 上部の写真（photo-manifest の id） */
  photoId?: string;
  /** 小さなメタ情報（カテゴリー・日付など） */
  meta?: ReactNode;
  /** 左罫線の色（CSS 変数名）。未指定ならアクセント */
  accentVar?: string;
  isDummy?: boolean;
  className?: string;
  children?: ReactNode;
};

/** 白カード（左罫線つき）。href があればカード全体がリンク */
export function Card({
  title,
  description,
  href,
  linkLabel = "詳しくはこちら",
  photoId,
  meta,
  accentVar,
  isDummy,
  className,
  children,
}: CardProps) {
  const body = (
    <>
      {photoId && (
        <Photo
          id={photoId}
          fill
          className="aspect-[3/2] w-full"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {(meta || isDummy) && (
          <div className="text-ink-3 mb-3 flex items-center gap-2 text-xs">
            {meta}
            <DummyBadge show={isDummy} />
          </div>
        )}
        <h3 className="text-lg leading-snug font-bold sm:text-xl">{title}</h3>
        {description && <div className="text-ink-2 mt-3 text-[0.9375rem] leading-[1.8]">{description}</div>}
        {children}
        {href && (
          <span className="link-arrow text-link mt-auto pt-5 sm:pt-6">
            {linkLabel}
            <Arrow />
          </span>
        )}
      </div>
    </>
  );
  const cls = cn(
    "card flex h-full flex-col overflow-hidden",
    href &&
      "group transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_-16px_rgba(0,0,0,0.3)]",
    className,
  );
  const style = accentVar ? { borderLeftColor: `var(${accentVar})` } : undefined;
  return href ? (
    <Link href={href} className={cls} style={style}>
      {body}
    </Link>
  ) : (
    <div className={cls} style={style}>
      {body}
    </div>
  );
}
