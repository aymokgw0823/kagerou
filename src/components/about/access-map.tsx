import { company } from "@/config/company";
import { Placeholder } from "@/components/ui/placeholder";

/** アクセス：Google Maps 埋め込み（APIキー不要の output=embed）。mapQuery 未設定なら案内のみ */
export function AccessMap() {
  const q = company.address.mapQuery;
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {q ? (
          <iframe
            title="本社周辺の地図"
            src={`https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed&hl=ja`}
            className="rounded-brand aspect-[4/3] w-full border-0 lg:aspect-[16/10]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="rounded-brand border-line bg-paper-2 text-ink-3 flex aspect-[4/3] w-full items-center justify-center border border-dashed p-8 text-center text-sm lg:aspect-[16/10]">
            地図は所在地の確定後に表示されます
            <br />
            （src/config/company.ts の address.mapQuery に住所を設定）
          </div>
        )}
      </div>
      <div className="lg:col-span-2">
        <dl className="space-y-5 text-[0.9375rem]">
          <div>
            <dt className="text-ink-3 text-xs font-bold">所在地</dt>
            <dd className="mt-1">
              <Placeholder value={company.address.full} />
            </dd>
          </div>
          <div>
            <dt className="text-ink-3 text-xs font-bold">最寄り駅からの道順</dt>
            <dd className="mt-1 leading-[1.9]">
              <Placeholder value={company.address.directions} />
            </dd>
          </div>
          <div>
            <dt className="text-ink-3 text-xs font-bold">電話</dt>
            <dd className="mt-1">
              <Placeholder value={company.contact.tel} />
              <span className="text-ink-3 ml-2">（{company.contact.hours}）</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
