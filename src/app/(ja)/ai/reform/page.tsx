import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "写真でリフォーム相談" };

export default function Page() {
  return (
    <ComingSoon
      title="写真でリフォーム相談"
      titleEn="Photo Reform"
      phase="Phase 5"
      description="写真から考えられる施工内容と概算費用レンジをお伝えします。"
    />
  );
}
