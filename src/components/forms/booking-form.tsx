"use client";

import { useActionState, useMemo, useState } from "react";
import { submitBooking } from "@/lib/forms/actions";
import { idleState, type ActionState } from "@/lib/forms/state";
import { Consent, Field, FormMessage, Honeypot, Input, Select, SubmitButton, Textarea } from "./fields";
import { cn } from "@/lib/utils";
import { TrackSuccess } from "./track-success";

type Biz = "build" | "dining" | "other";
const kinds: { id: Biz; label: string }[] = [
  { id: "build", label: "建設（現地調査・リフォーム相談）" },
  { id: "dining", label: "飲食（貸切・開業相談）" },
  { id: "other", label: "その他" },
];
/** 予約枠：平日 10:00〜17:00 の毎時（JST）。翌営業日から 3 週間先まで */
const HOURS = [10, 11, 13, 14, 15, 16, 17];
const WEEKS = 3;

type Day = { key: string; label: string; weekday: string; slots: { iso: string; label: string }[] };

function jstDate(y: number, m: number, d: number, h: number): Date {
  // JST（UTC+9）の指定時刻を表す Date
  return new Date(Date.UTC(y, m, d, h - 9, 0, 0));
}

function buildDays(now: Date): Day[] {
  const days: Day[] = [];
  const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = jstNow.getUTCFullYear();
  const m = jstNow.getUTCMonth();
  const d = jstNow.getUTCDate();
  const wd = ["日", "月", "火", "水", "木", "金", "土"];
  for (let i = 1; i <= WEEKS * 7; i++) {
    const date = new Date(Date.UTC(y, m, d + i));
    const dow = date.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const slots = HOURS.map((h) => {
      const dt = jstDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), h);
      return { iso: dt.toISOString(), label: `${h}:00` };
    });
    days.push({
      key: date.toISOString().slice(0, 10),
      label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
      weekday: wd[dow],
      slots,
    });
  }
  return days;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = { initialBusiness?: Biz; consultationId?: string };

export function BookingForm({ initialBusiness, consultationId }: Props) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitBooking, idleState);
  const [biz, setBiz] = useState<Biz>(initialBusiness ?? "build");
  const [slot, setSlot] = useState("");
  const [alt, setAlt] = useState("");
  const [picking, setPicking] = useState<"slot" | "alt">("slot");
  const [week, setWeek] = useState(0);
  const days = useMemo(() => buildDays(new Date()), []);
  const errors = state.status === "error" ? state.errors : undefined;
  const visible = days.slice(week * 5, week * 5 + 5);

  if (state.status === "success") {
    return (
      <div className="card p-8">
        <TrackSuccess
          event={{ name: "booking_submit", params: { business: biz, with_consultation: !!consultationId } }}
        />
        <FormMessage status="success" message={state.message} />
        <dl className="mt-4 grid grid-cols-[5rem_1fr] gap-y-1 text-sm">
          <dt className="text-ink-2 font-bold">第1希望</dt>
          <dd>{fmt(slot)}</dd>
          {alt && (
            <>
              <dt className="text-ink-2 font-bold">第2希望</dt>
              <dd>{fmt(alt)}</dd>
            </>
          )}
        </dl>
      </div>
    );
  }

  function pick(iso: string) {
    if (picking === "slot") {
      setSlot(iso);
      if (alt === iso) setAlt("");
      setPicking("alt");
    } else {
      if (iso === slot) return;
      setAlt(iso);
    }
  }

  return (
    <form action={action} className="relative space-y-8" noValidate>
      <Honeypot />
      <input type="hidden" name="slot" value={slot} />
      <input type="hidden" name="altSlot" value={alt} />
      {consultationId && <input type="hidden" name="consultationId" value={consultationId} />}

      <Field label="ご相談の種類" name="business" required errors={errors}>
        <Select name="business" value={biz} onChange={(e) => setBiz(e.target.value as Biz)}>
          {kinds.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </Select>
      </Field>

      {/* カレンダー */}
      <fieldset>
        <legend className="mb-1 text-sm font-bold">
          ご希望の日時{" "}
          <span className="rounded-pill bg-danger ml-1.5 px-1.5 py-px text-[10px] font-bold text-white">
            必須
          </span>
        </legend>
        <p className="text-ink-3 mb-3 text-xs">
          {picking === "slot" ? "第1希望の枠を選んでください" : "第2希望の枠を選んでください（任意）"}。平日
          10:00〜17:00、翌営業日から3週間先まで。
        </p>
        <div className="rounded-brand border-line border">
          <div className="border-line flex items-center justify-between border-b px-3 py-2">
            <button
              type="button"
              disabled={week === 0}
              onClick={() => setWeek((w) => w - 1)}
              className="text-link text-sm font-bold disabled:opacity-30"
            >
              ← 前の週
            </button>
            <span className="text-ink-3 text-xs">
              {visible[0]?.label} 〜 {visible[visible.length - 1]?.label}
            </span>
            <button
              type="button"
              disabled={week * 5 + 5 >= days.length}
              onClick={() => setWeek((w) => w + 1)}
              className="text-link text-sm font-bold disabled:opacity-30"
            >
              次の週 →
            </button>
          </div>
          <div className="scrollbar-none overflow-x-auto">
            <div className="divide-line grid min-w-[19rem] grid-cols-5 divide-x">
            {visible.map((day) => (
              <div key={day.key} className="p-1.5">
                <p className="mb-1 text-center text-xs font-bold">
                  {day.label}
                  <span className="text-ink-3 ml-1">({day.weekday})</span>
                </p>
                <ul className="space-y-1">
                  {day.slots.map((s) => {
                    const sel = s.iso === slot ? "slot" : s.iso === alt ? "alt" : null;
                    return (
                      <li key={s.iso}>
                        <button
                          type="button"
                          onClick={() => pick(s.iso)}
                          aria-pressed={!!sel}
                          className={cn(
                            "rounded-brand w-full py-1.5 text-xs font-bold transition-colors",
                            sel === "slot"
                              ? "bg-link text-link-ink"
                              : sel === "alt"
                                ? "bg-ink text-paper"
                                : "bg-paper-2 text-ink-2 hover:bg-tint hover:text-ink",
                          )}
                        >
                          {s.label}
                          {sel === "slot" && <span className="ml-1 text-[10px]">第1</span>}
                          {sel === "alt" && <span className="ml-1 text-[10px]">第2</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => setPicking("slot")}
            className={cn(
              "rounded-pill border px-3 py-1 text-xs font-bold",
              picking === "slot" ? "border-link text-link" : "border-line text-ink-2",
            )}
          >
            第1希望：{slot ? fmt(slot) : "未選択"}
          </button>
          <button
            type="button"
            onClick={() => setPicking("alt")}
            className={cn(
              "rounded-pill border px-3 py-1 text-xs font-bold",
              picking === "alt" ? "border-link text-link" : "border-line text-ink-2",
            )}
          >
            第2希望：{alt ? fmt(alt) : "未選択"}
          </button>
          {(slot || alt) && (
            <button
              type="button"
              onClick={() => {
                setSlot("");
                setAlt("");
                setPicking("slot");
              }}
              className="text-ink-3 text-xs underline"
            >
              選び直す
            </button>
          )}
        </div>
        {errors?.slot && (
          <p className="text-danger mt-2 text-xs font-bold" role="alert">
            {errors.slot.join("、")}
          </p>
        )}
      </fieldset>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="ご相談内容（概要）" name="topic" errors={errors} className="md:col-span-2">
          <Input name="topic" placeholder="例：店舗の外壁塗装について現地調査をお願いしたい" />
        </Field>
        <Field label="お名前" name="name" required errors={errors}>
          <Input name="name" autoComplete="name" required invalid={!!errors?.name} />
        </Field>
        <Field label="ふりがな" name="kana" errors={errors}>
          <Input name="kana" />
        </Field>
        <Field label="メールアドレス" name="email" required errors={errors}>
          <Input name="email" type="email" autoComplete="email" required invalid={!!errors?.email} />
        </Field>
        <Field label="電話番号" name="tel" errors={errors}>
          <Input name="tel" type="tel" autoComplete="tel" />
        </Field>
        <Field
          label="備考"
          name="note"
          errors={errors}
          className="md:col-span-2"
          hint="現地調査の場合は物件の所在地（市区町村まで）をご記入ください"
        >
          <Textarea name="note" className="min-h-24" />
        </Field>
      </div>
      <Consent errors={errors} />
      <FormMessage status={state.status} message={state.status === "error" ? state.message : undefined} />
      <SubmitButton pending={pending}>この内容で予約を申し込む</SubmitButton>
      <p className="text-ink-3 text-xs">
        ※ お申し込み時点では日時は確定しません。担当者が確認のうえ、確定のご連絡をいたします。
      </p>
    </form>
  );
}
