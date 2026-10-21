import { ogImage, OG_SIZE } from "@/lib/og/image";
import { businesses } from "@/config/businesses";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return businesses.map((b) => ({ id: b.id }));
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = businesses.find((x) => x.id === id);
  return ogImage({
    title: b ? `${b.nameJa}事業` : "事業",
    subtitle: b?.tagline,
    label: "BUSINESS",
    accent: b?.id === "dining" ? "#0d8390" : "#012169",
  });
}
