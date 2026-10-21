import type { Metadata } from "next";
import type { ReactNode } from "react";
// 管理画面はサイトのヘッダー／フッターを持たない独立したルートレイアウト
import "@fontsource-variable/noto-sans-jp";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "管理画面", template: "%s | 管理画面" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="bg-paper-2 text-ink min-h-full">{children}</body>
    </html>
  );
}
