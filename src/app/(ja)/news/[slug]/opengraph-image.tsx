import { ogImage, OG_SIZE } from "@/lib/og/image";
import { getLatestNews, getNewsItem } from "@/lib/content/news";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getLatestNews()).map((n) => ({ slug: n.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await getNewsItem(slug);
  return ogImage({ title: n?.title ?? "ニュース", subtitle: n?.category, label: "NEWS" });
}
