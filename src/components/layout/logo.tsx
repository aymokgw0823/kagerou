import Link from "next/link";
import { company } from "@/config/company";
import { Placeholder } from "@/components/ui/placeholder";
import { cn } from "@/lib/utils";

type Props = { className?: string; href?: string; /** 暗い背景用 */ inverted?: boolean };

/**
 * コーポレートロゴ：ブランド名＋緑のドット。
 * ロゴ画像が用意できたら、ここを <Image> に差し替える（社名は company.ts から）。
 */
export function Logo({ className, href = "/", inverted }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline text-[1.25rem] font-bold tracking-tight no-underline",
        inverted ? "text-white" : "text-ink",
        className,
      )}
      aria-label={`${company.nameJa} トップページ`}
    >
      <Placeholder value={company.brandName} />
      <span aria-hidden className="bg-accent ml-0.5 inline-block h-[0.32em] w-[0.32em] rounded-full" />
    </Link>
  );
}
