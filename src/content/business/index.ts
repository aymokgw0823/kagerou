/**
 * 事業ページの内容データのエントリーポイント。
 * 事業IDから BusinessDetail を取得する。
 */
import type { BusinessId } from "@/config/businesses";
import type { BusinessDetail } from "./types";
import { digital } from "./digital";
import { social } from "./social";
import { consulting } from "./consulting";
import { build } from "./build";
import { dining } from "./dining";

export type * from "./types";

export const businessDetails: Record<BusinessId, BusinessDetail> = {
  digital,
  social,
  consulting,
  build,
  dining,
};

export function getBusinessDetail(id: BusinessId): BusinessDetail {
  return businessDetails[id];
}
