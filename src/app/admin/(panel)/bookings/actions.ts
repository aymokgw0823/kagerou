"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-auth";

const NEXT_STATUSES = new Set(["confirmed", "cancelled"]);

/** 予約の状態を変更する（requested → confirmed / cancelled）。proxy とは別にここでも認証を確認する */
export async function updateBookingStatus(formData: FormData): Promise<void> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !NEXT_STATUSES.has(status)) throw new Error("Invalid request");
  await db.booking.updateMany({ where: { id, status: "requested" }, data: { status } });
  revalidatePath("/admin/bookings");
}
