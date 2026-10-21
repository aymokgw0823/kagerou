import { isPlaceholder } from "@/config/company";
import { cn } from "@/lib/utils";

const PATTERN = /(【[^】]*】)/g;

type Props = {
  /** 表示する文字列。【…】を含む部分だけ目立たせる */
  value: string | null | undefined;
  /** 値が null/undefined のときの代替表示 */
  fallback?: string;
  className?: string;
};

/**
 * 未確定値（【要差し替え】など）を目立たせて表示する。
 * company.ts の値は必ずこのコンポーネント、または <PlaceholderText> 経由で描画する。
 */
export function Placeholder({ value, fallback = "—", className }: Props) {
  if (value == null || value === "") return <span className={className}>{fallback}</span>;
  if (!isPlaceholder(value)) return <span className={className}>{value}</span>;
  const parts = value.split(PATTERN);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        PATTERN.test(part) ? (
          <mark
            key={i}
            title="未確定の項目です。src/config/company.ts を書き換えてください"
            className="rounded-brand border-notice bg-notice-soft text-notice border border-dashed px-1.5 py-0.5 font-sans text-[0.9em] font-medium"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

export function placeholderClass(value: string | null | undefined, extra?: string) {
  return cn(isPlaceholder(value) && "text-notice", extra);
}
