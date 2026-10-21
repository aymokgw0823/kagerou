"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { resolvePhoto } from "@/config/photo-manifest";

type Props = { beforeId: string; afterId: string; title: string };

/** ビフォー／アフター比較スライダー（range input で操作。キーボード対応） */
export function BeforeAfter({ beforeId, afterId, title }: Props) {
  const [pos, setPos] = useState(50);
  const id = useId();
  const before = resolvePhoto(beforeId);
  const after = resolvePhoto(afterId);
  return (
    <figure>
      <div className="rounded-brand bg-paper-2 relative aspect-[4/3] w-full overflow-hidden select-none">
        <Image
          src={after.src}
          alt={`${title}（施工後）`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <Image
            src={before.src}
            alt={`${title}（施工前）`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            style={{ width: `${10000 / pos}%`, maxWidth: "none" }}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${pos}%` }}
        >
          <span className="shadow-card absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
          </span>
        </div>
        <span className="rounded-pill absolute top-3 left-3 bg-black/70 px-2.5 py-0.5 text-xs font-bold text-white">
          Before
        </span>
        <span className="rounded-pill bg-accent text-accent-ink absolute top-3 right-3 px-2.5 py-0.5 text-xs font-bold">
          After
        </span>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${title} のビフォー／アフター比較。左右に動かして比較`}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="text-ink-2 mt-3 text-sm">{title}</figcaption>
    </figure>
  );
}
