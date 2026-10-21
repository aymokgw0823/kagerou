import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "お問い合わせ" };

export default function Page() {
  return (
    <ComingSoon
      title="お問い合わせ"
      titleEn="Contact"
      phase="Phase 4"
      description="事業別のお問い合わせフォームを公開予定です。"
    />
  );
}
