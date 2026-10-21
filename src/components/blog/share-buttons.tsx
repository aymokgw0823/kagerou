"use client";

import { useState } from "react";

type Props = { url: string; title: string };

/** SNSシェア（X / Facebook / LINE）とURLコピー */
export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const items = [
    { label: "X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: "LINE", href: `https://social-plugins.line.me/lineit/share?url=${enc(url)}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="この記事をシェア">
      <span className="text-ink-3 mr-1 text-xs font-bold">シェア</span>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-pill border-line text-ink-2 hover:border-ink hover:text-ink border px-3 py-1 text-xs font-bold"
        >
          {i.label}
        </a>
      ))}
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="rounded-pill border-line text-ink-2 hover:border-ink hover:text-ink border px-3 py-1 text-xs font-bold"
      >
        {copied ? "コピーしました" : "URLをコピー"}
      </button>
    </div>
  );
}
