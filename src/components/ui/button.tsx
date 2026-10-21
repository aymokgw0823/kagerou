import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "outline" | "solid" | "text";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  outline:
    "btn-base border-line-strong text-ink hover:bg-ink hover:text-paper dark:hover:bg-ink dark:hover:text-paper",
  solid: "btn-base border-ink bg-ink text-paper hover:bg-accent hover:border-accent hover:text-accent-ink",
  text: "inline-flex items-center gap-2 text-ink link-underline",
};

const sizes: Record<Size, string> = {
  md: "",
  lg: "min-h-14 px-8 text-base",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  /** 末尾の矢印を出す */
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
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

type LinkButtonProps = BaseProps & Omit<ComponentProps<typeof Link>, "children" | "className">;

export function LinkButton({
  variant = "outline",
  size = "md",
  arrow = true,
  children,
  className,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={cn(variants[variant], variant !== "text" && sizes[size], className)} {...rest}>
      <span>{children}</span>
      {arrow && (
        <Arrow className="ease-brand transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

type ButtonProps = BaseProps & Omit<ComponentProps<"button">, "children" | "className">;

export function Button({
  variant = "outline",
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
