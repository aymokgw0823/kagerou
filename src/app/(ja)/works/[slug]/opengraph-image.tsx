import { ogImage, OG_SIZE } from "@/lib/og/image";
import { getWork, getWorks } from "@/lib/content/works";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getWorks()).map((w) => ({ slug: w.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = await getWork(slug);
  return ogImage({
    title: w?.title ?? "実績・事例",
    subtitle: w?.client,
    label: "WORKS",
    accent: w?.business === "dining" ? "#0d8390" : "#012169",
  });
}
