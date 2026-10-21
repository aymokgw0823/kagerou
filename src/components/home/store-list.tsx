import { getBusinessDetail } from "@/content/business";
import { Photo } from "@/components/ui/photo";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";

/** トップの店舗案内（飲食事業の店舗一覧から） */
export function StoreList() {
  const { extra } = getBusinessDetail("dining");
  if (extra.kind !== "dining") return null;
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {extra.stores.map((s) => (
        <li
          key={s.name}
          className="card flex flex-col overflow-hidden sm:flex-row"
          style={{ borderLeftColor: "var(--color-biz-dining)" }}
        >
          <Photo
            id={s.photoId}
            fill
            className="aspect-[4/3] w-full sm:w-2/5 sm:shrink-0"
            sizes="(min-width: 768px) 20vw, 100vw"
          />
          <div className="flex flex-1 flex-col p-6">
            <p className="text-ink-3 text-xs font-bold">{s.brand}</p>
            <h3 className="mt-1 text-xl font-bold">
              {s.name} <DummyBadge show={s.isDummy} />
            </h3>
            <dl className="mt-3 grid grid-cols-[4.5rem_1fr] gap-y-1 text-sm">
              <dt className="text-ink-2 font-bold">営業時間</dt>
              <dd>{s.hours}</dd>
              <dt className="text-ink-2 font-bold">定休日</dt>
              <dd>{s.closed}</dd>
              <dt className="text-ink-2 font-bold">所在地</dt>
              <dd>
                <Placeholder value={s.address} />
              </dd>
            </dl>
            <div className="mt-auto pt-4">
              {s.reservationUrl ? (
                <LinkButton href={s.reservationUrl} target="_blank" rel="noopener">
                  予約する
                </LinkButton>
              ) : (
                <LinkButton href="/business/dining" variant="text">
                  店舗の詳細
                </LinkButton>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
