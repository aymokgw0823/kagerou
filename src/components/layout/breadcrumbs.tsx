import Link from "next/link";
import { site } from "@/config/site";
import { absoluteUrl, cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

type Props = {
  /** ホームを除いた階層。最後の要素が現在地 */
  items: Crumb[];
  className?: string;
};

/** パンくずリスト（BreadcrumbList の JSON-LD も出力） */
export function Breadcrumbs({ items, className }: Props) {
  const all: Crumb[] = [{ label: "ホーム", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href, site.url) } : {}),
    })),
  };

  return (
    <nav aria-label="パンくずリスト" className={cn("container-max", className)}>
      <ol className="text-ink-3 flex flex-wrap items-center gap-x-3 gap-y-1 py-4 text-xs">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.href ?? c.label}-${i}`} className="flex items-center gap-x-3">
              {i > 0 && <span aria-hidden className="bg-line h-px w-3" />}
              {c.href && !last ? (
                <Link href={c.href} className="ease-brand hover:text-ink transition-colors duration-300">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-ink-2")}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
