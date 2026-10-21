"use client";

import { useActionState } from "react";
import { submitEntry } from "@/lib/forms/actions";
import { idleState, type ActionState } from "@/lib/forms/state";
import { Consent, Field, FormMessage, Honeypot, Input, Select, SubmitButton, Textarea } from "./fields";

type Props = { jobs: { slug: string; title: string }[]; initialJob?: string };

export function EntryForm({ jobs, initialJob }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitEntry, idleState);
  const errors = state.status === "error" ? state.errors : undefined;
  if (state.status === "success") {
    return (
      <div className="card p-8">
        <FormMessage status="success" message={state.message} />
      </div>
    );
  }
  return (
    <form action={action} className="relative space-y-8" encType="multipart/form-data" noValidate>
      <Honeypot />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="応募職種" name="jobSlug" required errors={errors} className="md:col-span-2">
          <Select name="jobSlug" defaultValue={initialJob ?? ""} invalid={!!errors?.jobSlug}>
            <option value="">選択してください</option>
            {jobs.map((j) => (
              <option key={j.slug} value={j.slug}>
                {j.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="お名前" name="name" required errors={errors}>
          <Input name="name" autoComplete="name" required invalid={!!errors?.name} />
        </Field>
        <Field label="ふりがな" name="kana" required errors={errors}>
          <Input name="kana" required invalid={!!errors?.kana} />
        </Field>
        <Field label="メールアドレス" name="email" required errors={errors}>
          <Input name="email" type="email" autoComplete="email" required invalid={!!errors?.email} />
        </Field>
        <Field label="電話番号" name="tel" required errors={errors}>
          <Input name="tel" type="tel" autoComplete="tel" required invalid={!!errors?.tel} />
        </Field>
        <Field label="住所（市区町村まで）" name="address" errors={errors} className="md:col-span-2">
          <Input name="address" autoComplete="address-level2" />
        </Field>
        <Field
          label="履歴書"
          name="resume"
          errors={errors}
          className="md:col-span-2"
          hint="PDF または Word（doc / docx）、5MB 以内。後日のご提出でも構いません"
        >
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="file:rounded-pill file:border-ink file:bg-paper block w-full text-sm file:mr-4 file:border file:px-4 file:py-1.5 file:text-xs file:font-bold"
          />
        </Field>
        <Field label="志望動機・メッセージ" name="message" errors={errors} className="md:col-span-2">
          <Textarea name="message" />
        </Field>
      </div>
      <Consent errors={errors} />
      <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
      <SubmitButton pending={pending}>エントリーする</SubmitButton>
    </form>
  );
}
