import type { Metadata } from "next";
import { Suspense } from "react";
import { getJobs } from "@/lib/content/jobs";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { EntryForm } from "@/components/forms/entry-form";

export const metadata: Metadata = { title: "エントリー", description: "採用エントリーフォーム。" };

async function EntryWithParams({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const [{ job }, jobs] = await Promise.all([searchParams, getJobs()]);
  return <EntryForm jobs={jobs.map((j) => ({ slug: j.slug, title: j.title }))} initialJob={job} />;
}

export default function EntryPage({ searchParams }: PageProps<"/recruit/entry">) {
  return (
    <>
      <PageHeader
        title="エントリー"
        titleEn="Entry"
        lead="必要事項をご入力ください。送信後、確認メールをお送りします。3営業日以内を目安に採用担当からご連絡します。"
        crumbs={[{ label: "採用情報", href: "/recruit" }, { label: "エントリー" }]}
      />
      <Section spacing="sm">
        <div className="container-narrow">
          <Suspense fallback={<p className="text-ink-3">読み込み中…</p>}>
            <EntryWithParams searchParams={searchParams as Promise<{ job?: string }>} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
