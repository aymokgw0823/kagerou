import type { BusinessId } from "@/config/businesses";
import type { BusinessDetail } from "./types";
import { build } from "./build";
import { dining } from "./dining";

export const businessDetails: Record<BusinessId, BusinessDetail> = { build, dining };

export function getBusinessDetail(id: BusinessId): BusinessDetail {
  return businessDetails[id];
}

export type * from "./types";
