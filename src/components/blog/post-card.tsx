import Link from "next/link";
import type { BlogSummary } from "@/lib/content/types";
import { businessLabel } from "@/lib/content/taxonomy";
import { formatDate } from "@/lib/format";
import { Photo } from "@/components/ui/photo";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { Arrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bizColor: Record<string, string> = {
  build: "var(--color-biz-build)",
  dining: "var(--color-biz-dining)",
  cross: "var(--color-accent-deep)",
};

type Props = { post: BlogSummary; view?: "grid" | "list"; priority?: boolean };

/** 記事カード。grid（縦）と list（横並び）の2表示 */
export function PostCard({ post, view = "grid", priority }: Props) {
  const list = view === "list";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "card group flex h-full overflow-hidden transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_-16px_rgba(0,0,0,0.3)]",
        list ? "flex-row" : "flex-col",
      )}
      style={{ borderLeftColor: bizColor[post.business] }}
    >
      <Photo
        id={post.photoId}
        fill
        priority={priority}
        className={cn(list ? "w-32 shrink-0 sm:w-56" : "aspect-[3/2] w-full")}
        sizes={list ? "224px" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
        imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
      />
      <div className={cn("flex flex-1 flex-col", list ? "p-4 sm:p-5" : "p-5")}>
        <p className="text-ink-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span className="font-bold" style={{ color: bizColor[post.business] }}>
            {businessLabel(post.business)}
          </span>
          <span>｜</span>
          <span className="text-ink-2 font-bold">{post.category}</span>
          <DummyBadge show={post.isDummy} />
        </p>
        <h3
          className={cn("group-hover:text-link mt-2 leading-snug font-bold", list ? "text-base" : "text-lg")}
        >
          {post.title}
        </h3>
        {!list && <p className="text-ink-2 mt-2 line-clamp-3 text-sm leading-[1.8]">{post.description}</p>}
        <p className="text-ink-3 mt-auto flex items-center justify-between pt-4 text-xs">
          <span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="mx-2">·</span>
            {post.readingTime}分
          </span>
          <Arrow className="text-link h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        </p>
      </div>
    </Link>
  );
}
