"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import { REVEAL_DURATION, REVEAL_EASE, REVEAL_VIEWPORT, type RevealTag } from "./reveal";

const containerVariants = (delay: number, stagger: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: REVEAL_DURATION, ease: REVEAL_EASE } },
};

type StaggerProps = {
  children: ReactNode;
  /** 全体の開始遅延（秒） */
  delay?: number;
  /** 子要素ごとの遅延差（秒） */
  stagger?: number;
  as?: RevealTag;
  className?: string;
};

/**
 * 子要素（`<StaggerItem>`）を 0.08 秒ずつ遅らせてフェードインさせるコンテナ。
 * `prefers-reduced-motion` のときはアニメーションせず即表示。
 */
export function Stagger({ children, delay = 0, stagger = 0.08, as = "div", className }: StaggerProps) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      variants={containerVariants(delay, stagger)}
      initial="hidden"
      whileInView="show"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </Tag>
  );
}

type ItemProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
};

/** `<Stagger>` の直下に置く子要素 */
export function StaggerItem({ children, as = "div", className }: ItemProps) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
