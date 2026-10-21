import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "ご相談予約" };

export default function Page() {
  return (
    <ComingSoon
      title="ご相談予約"
      titleEn="Booking"
      phase="Phase 4"
      description="カレンダーから候補日時を選べる現地調査・ご相談の予約を公開予定です。"
    />
  );
}
