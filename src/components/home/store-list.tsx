import { getBusinessDetail } from "@/content/business";
import { StoreCard } from "@/components/business/store-card";

/** トップの店舗案内（飲食事業の店舗一覧から） */
export function StoreList() {
  const { extra } = getBusinessDetail("dining");
  if (extra.kind !== "dining") return null;
  const single = extra.stores.length === 1;
  return (
    <ul className={single ? "grid grid-cols-1" : "grid grid-cols-1 gap-6 md:grid-cols-2"}>
      {extra.stores.map((s) => (
        <li key={s.name}>
          <StoreCard store={s} variant={single ? "full" : "compact"} />
        </li>
      ))}
    </ul>
  );
}
