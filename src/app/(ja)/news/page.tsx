import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "ニュース" };

export default function Page() {
  return (
    <ComingSoon
      title="ニュース"
      titleEn="News"
      phase="Phase 3"
      description="お知らせ・プレスリリース・メディア掲載・採用情報を公開予定です。"
    />
  );
}
