import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** 余白の大きさ */
  spacing?: "default" | "sm" | "none";
  /** 背景面 */
  surface?: "paper" | "paper-2" | "ink";
  as?: "section" | "div" | "article" | "aside";
};

/** ページを構成する水平セクション。縦余白は PC で 160px 基準 */
export function Section({
  id,
  children,
  className,
  spacing = "default",
  surface = "paper",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        spacing === "default" && "py-section",
        spacing === "sm" && "py-section-sm",
        surface === "paper-2" && "bg-paper-2",
        surface === "ink" && "bg-ink text-paper",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type HeadingProps = {
  /** 欧文の小さなラベル（例：Business） */
  eyebrow?: string;
  /** セクション番号（例：01） */
  number?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  /** 見出しレベル */
  level?: "h1" | "h2" | "h3";
  className?: string;
  /** 右側に置くアクション（「一覧を見る」など） */
  action?: ReactNode;
};

/** セクション見出し：欧文ラベル＋和文見出し＋リード */
export function SectionHeading({
  eyebrow,
  number,
  title,
  lead,
  align = "left",
  level: Tag = "h2",
  className,
  action,
}: HeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {(eyebrow || number) && (
          <p className="font-display text-ink-3 mb-5 flex items-baseline gap-3 text-base">
            {number && <span className="tabular-nums">{number}</span>}
            {number && eyebrow && <span aria-hidden className="bg-line h-px w-6 self-center" />}
            {eyebrow && <span className="italic">{eyebrow}</span>}
          </p>
        )}
        <Tag className={cn(Tag === "h1" ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl")}>{title}</Tag>
        {lead && <div className="text-ink-2 mt-6 max-w-2xl text-base leading-[1.9] md:text-lg">{lead}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
