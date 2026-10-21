import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "AIツール" };

export default function Page() {
  return (
    <ComingSoon
      title="AIツール"
      titleEn="AI Tools"
      phase="Phase 5"
      description="AI経営診断、Web制作AI見積もり、SNSアカウント診断、写真でリフォーム相談の4ツールを公開予定です。"
    />
  );
}
