import { ogImage, OG_SIZE } from "@/lib/og/image";
import { site } from "@/config/site";

export const alt = site.tagline;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: site.tagline, subtitle: site.taglineSub });
}
