import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "outline-light" | "text";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  /** 青い丸形ボタン（主要CTA） */
  primary: "btn-base bg-link text-link-ink hover:bg-link-hover",
  /** 黒い罫線の丸形ボタン */
  outline: "btn-base border-ink text-ink hover:bg-ink hover:text-paper",
  /** 暗い背景の上で使う白罫線の丸形ボタン */
  "outline-light": "btn-base border-white text-white hover:bg-white hover:text-black",
  /** 太字のテキストリンク */
  text: "link-arrow",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "min-h-12 px-8 text-[0.9375rem]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-[1em] w-[1em] shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type LinkButtonProps = BaseProps & Omit<ComponentProps<typeof Link>, "children" | "className">;

export function LinkButton({
  variant = "primary",
  size = "md",
  arrow,
  children,
  className,
  ...rest
}: LinkButtonProps) {
  const showArrow = arrow ?? variant === "text";
  return (
    <Link className={cn(variants[variant], variant !== "text" && sizes[size], className)} {...rest}>
      <span>{children}</span>
      {showArrow && <Arrow />}
    </Link>
  );
}

type ButtonProps = BaseProps & Omit<ComponentProps<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(variants[variant], variant !== "text" && sizes[size], className)}
      {...rest}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
