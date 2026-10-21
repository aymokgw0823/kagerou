"use client";

import type { ComponentProps, ReactNode } from "react";
import { HONEYPOT_FIELD } from "@/lib/forms/state";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  errors?: Record<string, string[]>;
  children?: ReactNode;
  className?: string;
};

export function Field({ label, name, required, hint, errors, children, className }: FieldProps) {
  const errs = errors?.[name];
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-sm font-bold">
        {label}
        {required ? (
          <span className="rounded-pill bg-danger ml-1.5 px-1.5 py-px text-[10px] font-bold text-white">
            必須
          </span>
        ) : (
          <span className="text-ink-3 ml-1.5 text-[10px] font-bold">任意</span>
        )}
      </label>
      {children}
      {hint && <p className="text-ink-3 text-xs">{hint}</p>}
      {errs && (
        <p className="text-danger text-xs font-bold" role="alert">
          {errs.join("、")}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "min-h-11 w-full rounded-brand border border-line bg-paper px-3.5 py-2 text-[0.9375rem] focus:border-ink focus:outline-none aria-[invalid=true]:border-danger";

export function Input({ className, invalid, ...rest }: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      id={rest.name}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, className)}
      {...rest}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...rest
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      id={rest.name}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, "min-h-36 leading-[1.8]", className)}
      {...rest}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...rest
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      id={rest.name}
      aria-invalid={invalid || undefined}
      className={cn(inputClass, className)}
      {...rest}
    >
      {children}
    </select>
  );
}

/** 人間には見えない honeypot 欄 */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Website</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function Consent({ errors }: { errors?: Record<string, string[]> }) {
  const errs = errors?.consent;
  return (
    <div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="accent-link mt-1 h-4 w-4" />
        <span>
          <a href="/policy/privacy" target="_blank" rel="noopener" className="link-underline">
            プライバシーポリシー
          </a>
          に同意のうえ送信します。
        </span>
      </label>
      {errs && (
        <p className="text-danger mt-1 text-xs font-bold" role="alert">
          {errs.join("、")}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-base bg-link text-link-ink hover:bg-link-hover min-h-12 px-8 text-[0.9375rem] disabled:opacity-60"
    >
      {pending ? "送信中…" : children}
    </button>
  );
}

export function FormMessage({ status, message }: { status: "idle" | "success" | "error"; message?: string }) {
  if (status === "idle" || !message) return null;
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn(
        "rounded-brand border-l-4 p-4 text-sm",
        status === "success" ? "border-success bg-tint" : "border-danger bg-notice-soft",
      )}
    >
      {message}
    </div>
  );
}
