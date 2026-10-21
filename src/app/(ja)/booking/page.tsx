import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "商談予約" };

export default function Page() {
  return (
    <ComingSoon
      title="商談予約"
      titleEn="Booking"
      phase="Phase 4"
      description="カレンダーから候補日時を選べる商談予約を公開予定です。"
    />
  );
}
