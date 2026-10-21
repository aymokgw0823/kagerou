/**
 * ダミーデータの可視化ポリシー。
 * - 開発環境（NODE_ENV !== "production"）では常に DUMMY / PLACEHOLDER バッジを表示する。
 * - プレビュー環境などで本番ビルドでも表示したい場合は NEXT_PUBLIC_SHOW_DUMMY_BADGES=true。
 * - 【要差し替え】のハイライト（<Placeholder>）は環境に関係なく常に表示する（データ不備は隠さない）。
 */
export const showDummyBadges =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_DUMMY_BADGES === "true";
