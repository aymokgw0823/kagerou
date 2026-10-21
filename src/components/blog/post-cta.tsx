import { reformTool } from "@/config/ai-tools";
import type { ContentBusiness } from "@/lib/content/types";
import { LinkButton } from "@/components/ui/button";

/** 記事の文脈に合わせた CTA（建設→リフォーム相談、飲食→店舗、横断→両方） */
export function PostCta({ business }: { business: ContentBusiness }) {
  const reform = (
    <div className="rounded-brand bg-black p-6 text-white md:p-8">
      <p className="text-accent text-xs font-bold">無料・{reformTool.duration}</p>
      <p className="mt-2 text-xl font-bold">{reformTool.name}</p>
      <p className="mt-2 text-sm leading-[1.8] text-white/85">
        気になる箇所の写真から、考えられる施工内容と概算の費用レンジをお伝えします。
      </p>
      <div className="mt-5">
        <LinkButton href={reformTool.href}>写真で相談してみる</LinkButton>
      </div>
    </div>
  );
  const dining = (
    <div className="rounded-brand bg-tint p-6 md:p-8">
      <p className="text-biz-dining text-xs font-bold">自社で営む店</p>
      <p className="mt-2 text-xl font-bold">記事の内容は、自社の店舗で日々試しています。</p>
      <p className="text-ink-2 mt-2 text-sm leading-[1.8]">
        店舗の営業時間・メニュー・貸切のご相談は飲食事業のページをご覧ください。
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <LinkButton href="/business/dining" variant="outline">
          店舗を見る
        </LinkButton>
        <LinkButton href="/contact" variant="text">
          開業の相談をする
        </LinkButton>
      </div>
    </div>
  );
  if (business === "build") return reform;
  if (business === "dining") return dining;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {reform}
      {dining}
    </div>
  );
}
