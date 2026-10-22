import { notFound } from "next/navigation";

/**
 * どのルートにも一致しない URL をサイトのレイアウト付き 404（not-found.tsx）で返すためのキャッチオール。
 * ルートグループごとに root layout を分けているため、app/not-found.tsx を置けない構成の回避策。
 */
export default function CatchAllNotFound() {
  notFound();
}
