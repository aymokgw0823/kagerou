/** YYYY-MM-DD → YYYY.MM.DD */
export function formatDate(iso: string): string {
  return iso.replaceAll("-", ".");
}
/** YYYY-MM-DD → YYYY年M月D日 */
export function formatDateJa(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}
