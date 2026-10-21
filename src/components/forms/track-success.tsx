"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/** フォーム送信成功時に1回だけ計測イベントを送る（成功画面に置く） */
export function TrackSuccess({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    track(event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
