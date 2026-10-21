"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/** スクロールイン時に使う共通イージング（tokens.css の --ease-brand と同じ） */
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_DURATION = 0.8;
export const REVEAL_VIEWPORT = { once: true, margin: "-10% 0px" } as const;

export type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span"
  | "figure";

type Props = {
  children: ReactNode;
  /** 開始までの遅延（秒） */
  delay?: number;
  /** 描画するタグ */
  as?: RevealTag;
  className?: string;
};

/**
 * 子要素をビューポートに入ったときに 24px 下からフェードインさせる。
 * `prefers-reduced-motion` のときはアニメーションせず即表示。
 */
export function Reveal({ children, delay = 0, as = "div", className }: Props) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE, delay }}
    >
      {children}
    </Tag>
  );
}
