import Link from "next/link";
import { company } from "@/config/company";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type Props = { className?: string; href?: string; /** 暗い背景用 */ inverted?: boolean };

/**
 * コーポレートロゴ：シンボルマーク（旭日と炎）＋和文ロゴタイプ＋欧文社名。
 * 自社店舗「鉄板居酒屋 陽炎」のロゴと同じモチーフ（src/lib/brand/mark.ts）。
 */
export function Logo({ className, href = "/", inverted }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 no-underline",
        inverted ? "text-white" : "text-ink",
        className,
      )}
      aria-label={`${company.nameJa} トップページ`}
    >
      <LogoMark className="h-8 w-auto shrink-0" flame={inverted ? "#0b0b0b" : "#ffffff"} />
      <span className="flex flex-col justify-center leading-none">
        <span className="text-[1.2rem] font-bold tracking-[0.08em]">{company.brandName}</span>
        <span
          className={cn(
            "font-display mt-1 text-[0.5625rem] font-bold tracking-[0.28em]",
            inverted ? "text-white/70" : "text-ink-3",
          )}
        >
          {company.nameEn.toUpperCase()}
        </span>
      </span>
    </Link>
  );
}
