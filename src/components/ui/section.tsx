import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  spacing?: "default" | "sm" | "none";
  /** 背景面：白／薄灰／薄緑／黒 */
  surface?: "paper" | "paper-2" | "tint" | "black";
  as?: "section" | "div" | "article" | "aside";
};

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
        surface === "tint" && "bg-tint",
        surface === "black" && "bg-black text-white",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type BarProps = {
  /** 帯のラベル（例：Our thinking／事業） */
  label: string;
  /** 帯の色 */
  color?: "accent" | "link" | "black" | "biz";
  /** color="biz" のときの CSS 変数名 */
  colorVar?: string;
  id?: string;
};

/** 全幅の色帯セクションラベル */
export function SectionBar({ label, color = "accent", colorVar, id }: BarProps) {
  return (
    <div
      id={id}
      className={cn(
        "w-full",
        color === "accent" && "bg-accent text-accent-ink",
        color === "link" && "bg-link text-link-ink",
        color === "black" && "bg-black text-white",
      )}
      style={color === "biz" && colorVar ? { backgroundColor: `var(${colorVar})`, color: "#fff" } : undefined}
    >
      <div className="container-max py-2.5 text-sm font-bold tracking-wide">{label}</div>
    </div>
  );
}

type HeadingProps = {
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  level?: "h1" | "h2" | "h3";
  className?: string;
  action?: ReactNode;
};

/** セクション見出し（40px・細め）＋リード */
export function SectionHeading({
  title,
  lead,
  align = "center",
  level: Tag = "h2",
  className,
  action,
}: HeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Tag className={cn("text-3xl md:text-[2.5rem]")}>{title}</Tag>
        {lead && <div className="text-ink-2 mt-5 text-base leading-[1.9] md:text-[1.0625rem]">{lead}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
