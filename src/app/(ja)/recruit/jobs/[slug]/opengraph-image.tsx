import { ogImage, OG_SIZE } from "@/lib/og/image";
import { getJob, getJobs } from "@/lib/content/jobs";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = await getJob(slug);
  return ogImage({
    title: j ? `募集：${j.title}` : "募集職種",
    subtitle: j ? `${j.employmentType}｜${j.location}` : undefined,
    label: "CAREERS",
  });
}
