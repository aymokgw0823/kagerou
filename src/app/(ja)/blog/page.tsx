import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "ブログ" };

export default function Page() {
  return (
    <ComingSoon
      title="ブログ"
      titleEn="Blog"
      phase="Phase 3"
      description="300本規模の記事をファセット検索で探せるブログを公開予定です。"
    />
  );
}
