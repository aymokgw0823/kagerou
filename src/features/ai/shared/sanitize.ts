/**
 * 出力のサニタイズと、ログ用の個人情報マスキング。
 */

/** モデル出力のテキストから HTML タグ・制御文字を除去する（描画前に必ず通す） */
export function sanitizeText(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

/** メールアドレス・電話番号をマスクする（ログ保存用） */
export function maskPii(s: string): string {
  return s
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, (m) => `${m[0]}***@***`)
    .replace(/(\+?\d[\d\s-]{8,}\d)/g, (m) => `${m.slice(0, 2)}***-****`);
}

/** メールアドレスを a***@example.com 形式に */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local.slice(0, 1)}***@${domain}`;
}

/** 利用者の自由入力をプロンプトに埋め込む前の整形：制御文字除去・長さ制限・区切り記号のエスケープ */
export function prepareUserText(s: string, max: number): string {
  return s
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<\/?user_input>/gi, "")
    .trim()
    .slice(0, max);
}
