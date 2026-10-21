import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "実績・事例" };

export default function Page() {
  return (
    <ComingSoon
      title="実績・事例"
      titleEn="Works"
      phase="Phase 3"
      description="事業・業種・課題・地域で絞り込める実績一覧を公開予定です。"
    />
  );
}
