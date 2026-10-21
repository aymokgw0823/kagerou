import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { getBusiness } from "@/config/businesses";
import { getJob, getJobs } from "@/lib/content/jobs";
import { Mdx } from "@/lib/content/mdx";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import { LinkButton } from "@/components/ui/button";

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/recruit/jobs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const j = await getJob(slug);
  return j ? { title: `${j.title}｜募集要項`, description: j.description } : {};
}

export default async function JobPage({ params }: PageProps<"/recruit/jobs/[slug]">) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();
  const b = getBusiness(job.business);
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "職種", value: job.title },
    { label: "事業", value: `${b.nameJa}事業` },
    { label: "雇用形態", value: job.employmentType },
    { label: "勤務地", value: job.location },
    { label: "給与", value: <Placeholder value={job.salary} /> },
    { label: "勤務時間", value: job.hours },
    { label: "休日・休暇", value: job.holidays },
    {
      label: "応募資格",
      value: (
        <ul className="list-disc pl-5">
          {job.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ),
    },
    ...(job.welcome.length
      ? [
          {
            label: "歓迎",
            value: (
              <ul className="list-disc pl-5">
                {job.welcome.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt,
    validThrough: job.validThrough,
    employmentType: job.employmentTypeCode,
    hiringOrganization: { "@type": "Organization", name: company.nameJa, sameAs: site.url },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "JP" },
    },
    url: absoluteUrl(`/recruit/jobs/${job.slug}`, site.url),
  };
  return (
    <>
      <PageHeader
        title={
          <>
            {job.title} <DummyBadge show={job.isDummy} />
          </>
        }
        titleEn="Job"
        lead={`${b.nameJa}事業｜${job.employmentType}｜${job.location}`}
        crumbs={[
          { label: "採用情報", href: "/recruit" },
          { label: "募集職種", href: "/recruit/jobs" },
          { label: job.title },
        ]}
      />
      <Section spacing="sm">
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="prose-corp lg:col-span-7">
            <Mdx source={job.body} />
          </div>
          <div className="lg:col-span-5">
            <h2 className="mb-3 text-xl font-bold">募集要項</h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-line border-b align-top">
                    <th scope="row" className="bg-paper-2 w-28 px-3 py-3 text-left font-bold">
                      {r.label}
                    </th>
                    <td className="px-3 py-3">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={`/recruit/entry?job=${job.slug}`} size="lg">
                この職種にエントリー
              </LinkButton>
              <LinkButton href="/recruit/jobs" variant="text">
                他の職種を見る
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
