"use client";

import { useActionState, useState } from "react";
import { submitContact } from "@/lib/forms/actions";
import { idleState, type ActionState } from "@/lib/forms/state";
import { Consent, Field, FormMessage, Honeypot, Input, Select, SubmitButton, Textarea } from "./fields";
import { cn } from "@/lib/utils";
import { TrackSuccess } from "./track-success";

type Biz = "build" | "dining" | "other";
const kinds: { id: Biz; label: string; description: string }[] = [
  { id: "build", label: "建設について", description: "リフォーム・店舗工事・新築・現地調査のご相談" },
  { id: "dining", label: "飲食について", description: "ご予約・貸切・取材・店舗に関するお問い合わせ" },
  { id: "other", label: "その他", description: "採用・取引・メディア・その他のご連絡" },
];

type Props = { stores: string[]; initialBusiness?: Biz; consultationId?: string; source?: string };

export function ContactForm({ stores, initialBusiness, consultationId, source }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitContact, idleState);
  const [biz, setBiz] = useState<Biz | "">(initialBusiness ?? "");
  const errors = state.status === "error" ? state.errors : undefined;

  if (state.status === "success") {
    return (
      <div className="card p-8">
        <TrackSuccess event={{ name: "contact_submit", params: { business: biz || "unknown" } }} />
        <FormMessage status="success" message={state.message} />
        <p className="text-ink-2 mt-4 text-sm">お急ぎの場合は、お電話でもご相談いただけます。</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-8" noValidate>
      <Honeypot />
      {consultationId && <input type="hidden" name="consultationId" value={consultationId} />}
      {source && <input type="hidden" name="source" value={source} />}

      {/* 1. 種類の選択 */}
      <fieldset>
        <legend className="mb-3 text-sm font-bold">
          どの事業についてのお問い合わせですか{" "}
          <span className="rounded-pill bg-danger ml-1.5 px-1.5 py-px text-[10px] font-bold text-white">
            必須
          </span>
        </legend>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {kinds.map((k) => (
            <li key={k.id}>
              <label
                className={cn(
                  "rounded-brand block h-full cursor-pointer border-2 p-4 transition-colors",
                  biz === k.id ? "border-link bg-tint" : "border-line hover:border-ink",
                )}
              >
                <input
                  type="radio"
                  name="business"
                  value={k.id}
                  checked={biz === k.id}
                  onChange={() => setBiz(k.id)}
                  className="sr-only"
                />
                <span className="block font-bold">{k.label}</span>
                <span className="text-ink-2 mt-1 block text-xs">{k.description}</span>
              </label>
            </li>
          ))}
        </ul>
        {errors?.business && (
          <p className="text-danger mt-2 text-xs font-bold" role="alert">
            {errors.business.join("、")}
          </p>
        )}
      </fieldset>

      {/* 2. 事業別の項目 */}
      {biz === "build" && (
        <div className="rounded-brand bg-paper-2 grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
          <Field label="工事の種類" name="workType" errors={errors}>
            <Select name="workType" defaultValue="">
              <option value="">選択してください</option>
              {[
                "外壁・屋根",
                "水回り",
                "内装・間取り変更",
                "店舗の新装・改装",
                "オフィス内装",
                "新築・増改築",
                "その他・わからない",
              ].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
          <Field label="物件の種類" name="propertyType" errors={errors}>
            <Select name="propertyType" defaultValue="">
              <option value="">選択してください</option>
              {["戸建て住宅", "マンション", "店舗", "オフィス・事務所", "ビル・収益物件", "その他"].map(
                (o) => (
                  <option key={o}>{o}</option>
                ),
              )}
            </Select>
          </Field>
          <Field label="物件の所在地（市区町村まで）" name="area" errors={errors}>
            <Input name="area" placeholder="例：東京都○○区" />
          </Field>
          <Field label="希望時期" name="timing" errors={errors}>
            <Select name="timing" defaultValue="">
              <option value="">選択してください</option>
              {["できるだけ早く", "1〜3か月以内", "半年以内", "1年以内", "未定・情報収集"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
        </div>
      )}
      {biz === "dining" && (
        <div className="rounded-brand bg-paper-2 grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
          <Field label="ご用件" name="purpose" errors={errors}>
            <Select name="purpose" defaultValue="">
              <option value="">選択してください</option>
              {["ご予約", "貸切・イベント", "取材・撮影", "開業・店舗づくりの相談", "その他"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
          <Field label="店舗" name="store" errors={errors}>
            <Select name="store" defaultValue="">
              <option value="">選択してください</option>
              {stores.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="希望日時" name="preferredDate" errors={errors}>
            <Input name="preferredDate" placeholder="例：11月15日（金）19:00ごろ" />
          </Field>
          <Field label="人数" name="partySize" errors={errors}>
            <Input name="partySize" inputMode="numeric" placeholder="例：6名" />
          </Field>
        </div>
      )}
      {biz === "other" && (
        <div className="rounded-brand bg-paper-2 p-5">
          <Field label="件名" name="subject" errors={errors}>
            <Input name="subject" placeholder="例：取材のご依頼" />
          </Field>
        </div>
      )}

      {/* 3. 共通項目 */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="お名前" name="name" required errors={errors}>
          <Input name="name" autoComplete="name" required invalid={!!errors?.name} />
        </Field>
        <Field label="ふりがな" name="kana" errors={errors}>
          <Input name="kana" autoComplete="off" />
        </Field>
        <Field label="メールアドレス" name="email" required errors={errors}>
          <Input name="email" type="email" autoComplete="email" required invalid={!!errors?.email} />
        </Field>
        <Field label="電話番号" name="tel" errors={errors} hint="お急ぎの場合はご記入ください">
          <Input name="tel" type="tel" autoComplete="tel" invalid={!!errors?.tel} />
        </Field>
        <Field label="会社名・店舗名" name="company" errors={errors} className="md:col-span-2">
          <Input name="company" autoComplete="organization" />
        </Field>
        <Field
          label="お問い合わせ内容"
          name="message"
          required
          errors={errors}
          className="md:col-span-2"
          hint="個人情報（第三者の氏名など）は記入しないでください"
        >
          <Textarea name="message" required invalid={!!errors?.message} />
        </Field>
      </div>
      <Consent errors={errors} />
      <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
      <SubmitButton pending={pending}>送信する</SubmitButton>
    </form>
  );
}
