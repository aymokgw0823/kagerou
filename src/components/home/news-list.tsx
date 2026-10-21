import Link from "next/link";
import type { NewsSummary } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { DummyBadge } from "@/components/ui/dummy-badge";

/** 日付・カテゴリー・タイトルの控えめなリスト */
export function NewsList({ items }: { items: NewsSummary[] }) {
  return (
    <ul className="divide-line border-line divide-y border-y">
      {items.map((n) => (
        <li key={n.slug}>
          <Link
            href={`/news/${n.slug}`}
            className="group flex flex-col gap-1 py-4 md:flex-row md:items-center md:gap-8"
          >
            <time dateTime={n.publishedAt} className="font-display text-ink-3 text-sm md:w-28">
              {formatDate(n.publishedAt)}
            </time>
            <span className="rounded-pill border-line text-ink-2 inline-flex w-fit items-center border px-2.5 py-0.5 text-xs font-bold md:w-32 md:justify-center">
              {n.category}
            </span>
            <span className="group-hover:text-link flex items-center gap-2 text-[0.9375rem] group-hover:underline group-hover:underline-offset-4">
              {n.title}
              <DummyBadge show={n.isDummy} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
