import { getPublishedFigures } from "@/config/company";

/**
 * 数値セクション。company.ts に実際に入力された数値だけを表示し、
 * 1件もなければセクションごと表示しない（ダミーで埋めない）。
 */
export function Figures() {
  const rows = getPublishedFigures();
  if (rows.length === 0) return null;
  return (
    <section className="bg-tint py-section-sm">
      <div className="container-max">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {rows.map((r) => (
            <div key={r.label} className="border-accent border-l-4 pl-4">
              <dt className="text-ink-2 text-sm font-bold">{r.label}</dt>
              <dd className="font-display mt-1 text-4xl font-bold">
                {r.value.toLocaleString("ja-JP")}
                <span className="text-ink-2 ml-1 text-base font-normal">{r.unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
