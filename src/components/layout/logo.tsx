import Link from "next/link";
import { company } from "@/config/company";
import { Placeholder } from "@/components/ui/placeholder";
import { cn } from "@/lib/utils";

/**
 * コーポレートロゴ。
 * ロゴ画像が用意できたら、ここを <Image> に差し替える（社名は company.ts から）。
 */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("text-ink inline-flex items-baseline gap-3 no-underline", className)}
      aria-label={`${company.nameJa} トップページ`}
    >
      <span aria-hidden className="bg-accent inline-block h-[0.9em] w-[0.9em] translate-y-px" />
      <span className="text-[1.05rem] font-medium tracking-[0.08em]">
        <Placeholder value={company.brandName} />
      </span>
    </Link>
  );
}
