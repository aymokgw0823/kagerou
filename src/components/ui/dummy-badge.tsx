import { showDummyBadges } from "@/lib/dummy";
import { cn } from "@/lib/utils";

type Props = {
  /** 表示条件。false のときは何も描画しない */
  show?: boolean;
  label?: string;
  className?: string;
};

/**
 * ダミーデータに付ける小さなバッジ。開発環境でのみ表示される（lib/dummy.ts）。
 * 使い方: <DummyBadge show={item.isDummy} />
 */
export function DummyBadge({ show = true, label = "DUMMY", className }: Props) {
  if (!show || !showDummyBadges) return null;
  return (
    <span
      aria-label="ダミーデータ"
      className={cn(
        "rounded-brand border-notice bg-notice-soft text-notice inline-flex items-center border px-1.5 py-px font-mono text-[10px] leading-4 tracking-wider uppercase select-none",
        className,
      )}
    >
      {label}
    </span>
  );
}
