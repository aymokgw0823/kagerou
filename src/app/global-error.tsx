"use client";

/** ルートレイアウト自体が失敗したときの最終フォールバック（html/body を自前で持つ） */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          fontFamily: "sans-serif",
          padding: "4rem 1rem",
          textAlign: "center",
          color: "#0b0b0b",
          background: "#fff",
        }}
      >
        <p style={{ fontSize: "3rem", fontWeight: 700, color: "#0076a8" }}>500</p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400 }}>エラーが発生しました</h1>
        <p style={{ color: "#53565a" }}>
          申し訳ありません。時間をおいて再度お試しください。{error.digest ? `（${error.digest}）` : ""}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            borderRadius: 999,
            background: "#0076a8",
            color: "#fff",
            fontWeight: 700,
            border: 0,
          }}
        >
          再読み込み
        </button>
      </body>
    </html>
  );
}
