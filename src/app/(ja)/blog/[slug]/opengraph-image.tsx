import { ogImage, OG_SIZE } from "@/lib/og/image";
import { getAllPosts, getPost } from "@/lib/content/blog";

export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogImage({
    title: post?.title ?? "ブログ",
    subtitle: post?.category,
    label: "BLOG",
    accent: post?.business === "dining" ? "#0d8390" : post?.business === "build" ? "#012169" : "#86bc25",
  });
}
