import Link from "next/link";
import type { Author } from "@/lib/content/types";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";

/** 執筆者・監修者の表示（E-E-A-T） */
export function AuthorCard({ author, role }: { author: Author; role: "執筆" | "監修" }) {
  return (
    <Link href={`/blog/author/${author.id}`} className="card hover:shadow-card flex gap-4 p-4">
      {author.photoId ? (
        <Photo id={author.photoId} fill className="h-16 w-16 shrink-0 rounded-full" sizes="64px" />
      ) : (
        <span
          aria-hidden
          className="bg-paper-2 font-display text-ink-3 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold"
        >
          {role === "執筆" ? "W" : "S"}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-ink-3 text-xs font-bold">
          {role} <DummyBadge show={author.isDummy} />
        </p>
        <p className="font-bold">{author.name}</p>
        <p className="text-ink-2 text-xs">{author.role}</p>
        {author.qualifications.length > 0 && (
          <p className="text-ink-3 mt-1 text-xs">
            {author.qualifications.map((q, i) => (
              <Placeholder key={i} value={q} className="mr-2" />
            ))}
          </p>
        )}
      </div>
    </Link>
  );
}
