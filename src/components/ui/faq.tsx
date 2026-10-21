import type { Faq as FaqItem } from "@/content/business/types";

type Props = { items: FaqItem[]; title?: string };

/** FAQ（details/summary）＋ FAQPage の JSON-LD */
export function Faq({ items, title = "よくあるご質問" }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div>
      <h2 className="mb-8 text-3xl md:text-[2.5rem]">{title}</h2>
      <div className="divide-line border-line divide-y border-y">
        {items.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-base font-bold marker:hidden [&::-webkit-details-marker]:hidden">
              <span>
                <span className="font-display text-link mr-3">Q.</span>
                {f.q}
              </span>
              <span
                aria-hidden
                className="text-ink-3 mt-1 shrink-0 transition-transform duration-300 group-open:rotate-45"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </span>
            </summary>
            <div className="text-ink-2 pb-6 pl-8 text-[0.9375rem] leading-[1.9]">{f.a}</div>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
