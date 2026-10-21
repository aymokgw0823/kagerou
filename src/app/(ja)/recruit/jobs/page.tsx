import type { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/content/jobs";
import { getBusiness } from "@/config/businesses";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "募集職種一覧",
  description: "建設事業・飲食事業の募集職種と募集要項。",
};

export default async function JobsPage() {
  const jobs = await getJobs();
  return (
    <>
      <PageHeader
        title="募集職種"
        titleEn="Jobs"
        crumbs={[{ label: "採用情報", href: "/recruit" }, { label: "募集職種" }]}
      />
      <Section spacing="sm">
        <div className="container-max">
          <ul className="divide-line border-line divide-y border-y">
            {jobs.map((j) => {
              const b = getBusiness(j.business);
              return (
                <li key={j.slug}>
                  <Link
                    href={`/recruit/jobs/${j.slug}`}
                    className="group grid grid-cols-1 gap-3 py-6 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-7">
                      <p className="text-xs font-bold" style={{ color: `var(${b.colorVar})` }}>
                        {b.nameJa}事業
                      </p>
                      <h2 className="group-hover:text-link mt-1 text-xl font-bold">
                        {j.title} <DummyBadge show={j.isDummy} />
                      </h2>
                      <p className="text-ink-2 mt-1 line-clamp-2 text-sm">{j.description}</p>
                    </div>
                    <dl className="text-ink-2 grid grid-cols-[5rem_1fr] gap-y-1 text-xs md:col-span-4">
                      <dt className="font-bold">雇用形態</dt>
                      <dd>{j.employmentType}</dd>
                      <dt className="font-bold">勤務地</dt>
                      <dd>{j.location}</dd>
                      <dt className="font-bold">給与</dt>
                      <dd>
                        <Placeholder value={j.salary} />
                      </dd>
                    </dl>
                    <span className="link-arrow text-link md:col-span-1 md:justify-self-end">詳細 →</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-10">
            <LinkButton href="/recruit/entry" size="lg">
              エントリーする
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
