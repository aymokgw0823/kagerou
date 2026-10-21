import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Web制作 AI見積もり" };

export default function Page() {
  return (
    <ComingSoon
      title="Web制作 AI見積もり"
      titleEn="AI Estimate"
      phase="Phase 5"
      description="要件を対話で整理し、推奨サイトマップと概算見積もりを算出します。"
    />
  );
}
