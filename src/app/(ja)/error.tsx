"use client";

import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="py-section min-h-[60vh]">
      <div className="container-narrow text-center">
        <p className="font-display text-accent text-7xl font-bold">500</p>
        <h1 className="mt-4 text-2xl md:text-3xl">エラーが発生しました</h1>
        <p className="text-ink-2 mt-4">
          申し訳ありません。時間をおいて再度お試しください。
          {error.digest && <span className="text-ink-3 block text-xs">エラーID: {error.digest}</span>}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>再読み込み</Button>
          <LinkButton href="/" variant="outline">
            トップへ戻る
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
