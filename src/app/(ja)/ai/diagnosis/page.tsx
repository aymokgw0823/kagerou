import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "AI経営診断" };

export default function Page() {
  return (
    <ComingSoon
      title="AI経営診断"
      titleEn="AI Diagnosis"
      phase="Phase 5"
      description="業種・規模・現状をもとにAIが対話で深掘りし、課題と打ち手を整理します。"
    />
  );
}
