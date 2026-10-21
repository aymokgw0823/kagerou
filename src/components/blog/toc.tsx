"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content/fs";
import { cn } from "@/lib/utils";

/** 追従する目次。IntersectionObserver で現在地をハイライト */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((x): x is HTMLElement => !!x);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);
  if (headings.length === 0) return null;
  return (
    <nav aria-label="目次" className="text-sm">
      <p className="text-ink-3 mb-3 text-xs font-bold tracking-wider uppercase">目次</p>
      <ol className="border-line space-y-1 border-l">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l-2 py-1 pr-2 leading-snug transition-colors",
                h.depth === 3 ? "pl-6 text-xs" : "pl-3",
                active === h.id
                  ? "border-accent text-ink font-bold"
                  : "text-ink-2 hover:text-ink border-transparent",
              )}
              aria-current={active === h.id ? "location" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
