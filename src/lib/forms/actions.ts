"use server";

import { db } from "@/lib/db";
import { adminRecipient, sendMail } from "@/lib/mail";
import { storage, RESUME_MAX_BYTES, RESUME_TYPES } from "@/lib/storage";
import { getJob } from "@/lib/content/jobs";
import { guardForm, type ActionState } from "./guard";
import { bookingSchema, contactSchema, entrySchema, fieldErrors } from "./schemas";
import { bookingMails, contactMails, entryMails } from "./mail-templates";

function obj(formData: FormData): Record<string, string> {
  const o: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string") o[k] = v;
  return o;
}

const fmtSlot = (iso: string) =>
  new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await guardForm("contact", formData);
  if (!guard.ok)
    return guard.reason === "honeypot"
      ? { status: "success", message: guard.message }
      : { status: "error", message: guard.message };
  const parsed = contactSchema.safeParse(obj(formData));
  if (!parsed.success)
    return { status: "error", message: "入力内容をご確認ください。", errors: fieldErrors(parsed.error) };
  const input = parsed.data;
  const extra = Object.fromEntries(
    Object.entries({
      workType: input.workType,
      propertyType: input.propertyType,
      area: input.area,
      timing: input.timing,
      purpose: input.purpose,
      store: input.store,
      partySize: input.partySize,
      preferredDate: input.preferredDate,
    }).filter(([, v]) => v),
  );
  const lead = await db.lead.create({
    data: {
      kind: "contact",
      business: input.business,
      name: input.name,
      kana: input.kana || null,
      email: input.email,
      tel: input.tel || null,
      company: input.company || null,
      subject: input.subject || null,
      message: input.message,
      extra: Object.keys(extra).length ? JSON.stringify(extra) : null,
      consultationId: input.consultationId || null,
      source: input.source || null,
      ip: guard.ip,
      userAgent: guard.userAgent.slice(0, 300),
    },
  });
  const mails = contactMails(input, lead.id);
  await Promise.all([
    sendMail({ to: adminRecipient("contact"), replyTo: input.email, ...mails.admin }),
    sendMail({ to: input.email, ...mails.reply }),
  ]);
  return {
    status: "success",
    message: `お問い合わせを受け付けました（受付番号：${lead.id}）。確認メールをお送りしましたのでご確認ください。`,
  };
}

export async function submitBooking(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await guardForm("booking", formData);
  if (!guard.ok)
    return guard.reason === "honeypot"
      ? { status: "success", message: guard.message }
      : { status: "error", message: guard.message };
  const parsed = bookingSchema.safeParse(obj(formData));
  if (!parsed.success)
    return { status: "error", message: "入力内容をご確認ください。", errors: fieldErrors(parsed.error) };
  const input = parsed.data;
  const slot = new Date(input.slot);
  if (slot.getTime() < Date.now())
    return {
      status: "error",
      message: "過去の日時は選択できません。",
      errors: { slot: ["過去の日時は選択できません"] },
    };
  const booking = await db.booking.create({
    data: {
      name: input.name,
      kana: input.kana || null,
      email: input.email,
      tel: input.tel || null,
      business: input.business,
      topic: input.topic || null,
      slot,
      altSlot: input.altSlot ? new Date(input.altSlot) : null,
      note: input.note || null,
      consultationId: input.consultationId || null,
      ip: guard.ip,
    },
  });
  const mails = bookingMails(
    input,
    booking.id,
    fmtSlot(input.slot),
    input.altSlot ? fmtSlot(input.altSlot) : undefined,
  );
  await Promise.all([
    sendMail({ to: adminRecipient("booking"), replyTo: input.email, ...mails.admin }),
    sendMail({ to: input.email, ...mails.reply }),
  ]);
  return {
    status: "success",
    message: `ご予約を受け付けました（受付番号：${booking.id}）。担当者が日程を確認し、確定のご連絡をいたします。`,
  };
}

export async function submitEntry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const guard = await guardForm("entry", formData, { limit: 3 });
  if (!guard.ok)
    return guard.reason === "honeypot"
      ? { status: "success", message: guard.message }
      : { status: "error", message: guard.message };
  const parsed = entrySchema.safeParse(obj(formData));
  if (!parsed.success)
    return { status: "error", message: "入力内容をご確認ください。", errors: fieldErrors(parsed.error) };
  const input = parsed.data;
  const job = await getJob(input.jobSlug);
  if (!job)
    return {
      status: "error",
      message: "応募職種が見つかりません。",
      errors: { jobSlug: ["応募職種を選択してください"] },
    };

  // 履歴書（任意）：形式・サイズを検証して保存
  let resumeKey: string | null = null;
  let resumeName: string | null = null;
  const file = formData.get("resume");
  if (file instanceof File && file.size > 0) {
    if (!RESUME_TYPES[file.type])
      return {
        status: "error",
        message: "履歴書は PDF または Word（doc / docx）で添付してください。",
        errors: { resume: ["PDF または Word 形式のみ"] },
      };
    if (file.size > RESUME_MAX_BYTES)
      return {
        status: "error",
        message: "履歴書のサイズは 5MB 以内にしてください。",
        errors: { resume: ["5MB 以内"] },
      };
    const buf = Buffer.from(await file.arrayBuffer());
    const put = await storage.put("entries", file.name, buf);
    resumeKey = put.key;
    resumeName = file.name;
  }
  const entry = await db.entry.create({
    data: {
      jobSlug: job.slug,
      jobTitle: job.title,
      name: input.name,
      kana: input.kana,
      email: input.email,
      tel: input.tel,
      address: input.address || null,
      message: input.message || null,
      resumeKey,
      resumeName,
      consent: true,
      ip: guard.ip,
    },
  });
  const mails = entryMails(input, job.title, entry.id, resumeName ?? undefined);
  await Promise.all([
    sendMail({ to: adminRecipient("recruit"), replyTo: input.email, ...mails.admin }),
    sendMail({ to: input.email, ...mails.reply }),
  ]);
  return {
    status: "success",
    message: `エントリーを受け付けました（受付番号：${entry.id}）。確認メールをお送りしました。`,
  };
}
