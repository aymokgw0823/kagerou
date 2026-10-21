import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "採用情報" };

export default function Page() {
  return (
    <ComingSoon
      title="採用情報"
      titleEn="Careers"
      phase="Phase 4"
      description="採用メッセージ、募集職種、社員インタビュー、エントリーフォームを公開予定です。"
    />
  );
}
