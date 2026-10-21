import type { Metadata } from "next";
import { Suspense } from "react";
import { getWorks } from "@/lib/content/works";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/ui/cta-block";
import { WorksExplorer } from "@/components/works/works-explorer";

export const metadata: Metadata = {
  title: "実績・事例",
  description:
    "店舗・住宅・オフィスの施工事例と、自社飲食店の立ち上げ・運営の記録。事業・業種・課題・地域で絞り込めます。",
};

export default async function WorksPage() {
  const works = await getWorks();
  return (
    <>
      <PageHeader
        title="実績・事例"
        titleEn="Works"
        lead="店舗・住宅・オフィスの施工事例と、自社飲食店の立ち上げ・運営の記録。課題 → 施策 → 成果の流れでご紹介します。"
        crumbs={[{ label: "実績・事例" }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <Suspense fallback={<p className="text-ink-3 py-20 text-center">読み込み中…</p>}>
            <WorksExplorer works={works} />
          </Suspense>
        </div>
      </Section>
      <CtaBlock photoId="build-site-wide" />
    </>
  );
}
