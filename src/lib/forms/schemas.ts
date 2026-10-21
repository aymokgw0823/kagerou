import { z } from "zod";

const name = z.string().trim().min(1, "お名前を入力してください").max(60);
const kana = z.string().trim().max(60).optional().or(z.literal(""));
const email = z.string().trim().email("メールアドレスの形式が正しくありません").max(120);
const tel = z
  .string()
  .trim()
  .max(20)
  .regex(/^[0-9+\-() ]*$/, "電話番号は数字とハイフンで入力してください")
  .optional()
  .or(z.literal(""));
const consent = z.literal("on", { message: "プライバシーポリシーへの同意が必要です" });

export const contactSchema = z.object({
  business: z.enum(["build", "dining", "other"], { message: "ご相談内容の種類を選択してください" }),
  name,
  kana,
  email,
  tel,
  company: z.string().trim().max(80).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "お問い合わせ内容は10文字以上で入力してください")
    .max(2000, "2000文字以内で入力してください"),
  consent,
  // 事業別の追加項目（任意）
  workType: z.string().trim().max(60).optional().or(z.literal("")),
  propertyType: z.string().trim().max(60).optional().or(z.literal("")),
  area: z.string().trim().max(60).optional().or(z.literal("")),
  timing: z.string().trim().max(60).optional().or(z.literal("")),
  purpose: z.string().trim().max(60).optional().or(z.literal("")),
  store: z.string().trim().max(60).optional().or(z.literal("")),
  partySize: z.string().trim().max(20).optional().or(z.literal("")),
  preferredDate: z.string().trim().max(60).optional().or(z.literal("")),
  subject: z.string().trim().max(100).optional().or(z.literal("")),
  consultationId: z.string().trim().max(64).optional().or(z.literal("")),
  source: z.string().trim().max(200).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  business: z.enum(["build", "dining", "other"], { message: "ご相談の種類を選択してください" }),
  topic: z.string().trim().max(100).optional().or(z.literal("")),
  slot: z.string().datetime({ message: "第1希望の日時を選択してください" }),
  altSlot: z.string().datetime().optional().or(z.literal("")),
  name,
  kana,
  email,
  tel,
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  consent,
  consultationId: z.string().trim().max(64).optional().or(z.literal("")),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const entrySchema = z.object({
  jobSlug: z.string().min(1, "応募職種を選択してください"),
  name,
  kana: z.string().trim().min(1, "ふりがなを入力してください").max(60),
  email,
  tel: z
    .string()
    .trim()
    .min(8, "電話番号を入力してください")
    .max(20)
    .regex(/^[0-9+\-() ]*$/, "電話番号は数字とハイフンで入力してください"),
  address: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent,
});
export type EntryInput = z.infer<typeof entrySchema>;

/** zod のエラーをフィールド別に整形する */
export function fieldErrors(err: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const i of err.issues) {
    const k = String(i.path[0] ?? "_");
    (out[k] ??= []).push(i.message);
  }
  return out;
}
