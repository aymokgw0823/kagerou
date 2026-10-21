import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "SNSアカウント診断" };

export default function Page() {
  return (
    <ComingSoon
      title="SNSアカウント診断"
      titleEn="SNS Check"
      phase="Phase 5"
      description="アカウントの改善ポイントと30日間の投稿カレンダー案を提案します。"
    />
  );
}
