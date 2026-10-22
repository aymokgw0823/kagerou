/**
 * コーポレートのシンボルマーク（陽炎＝地平線から昇る陽と炎）。
 * 自社店舗「鉄板居酒屋 陽炎」のロゴ（赤い旭日と炎）と同じモチーフで、SVG のジオメトリをここで一元管理する。
 * - React（ヘッダー・フッター・OGP 画像）は <LogoMark>（components/layout/logo-mark.tsx）
 * - PDF（@react-pdf/renderer）は features/ai/reform/pdf.tsx
 * - アイコン画像（src/app/icon.png など）は scripts/build-brand-icons.ts が brandMarkSvg() から生成
 */

export const BRAND_RED = "#ed230d";

/** viewBox */
export const MARK_W = 120;
export const MARK_H = 64;

const CX = 60;
const CY = 53; // 地平線
const R = 17; // 半円の半径

type Seg = { x1: number; y1: number; x2: number; y2: number };

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CY - Math.sin(a) * r];
}
const f = (n: number) => Number(n.toFixed(2));
function seg(r1: number, r2: number, deg: number): Seg {
  const [x1, y1] = polar(r1, deg);
  const [x2, y2] = polar(r2, deg);
  return { x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2) };
}

/** 放射する光線（途中に切れ目のある 2 本組） */
export const rays: Seg[] = (() => {
  const out: Seg[] = [];
  const n = 15; // 地平線（0°・180°）を除く
  for (let i = 1; i <= n; i++) {
    const deg = (180 / (n + 1)) * i;
    const long = i % 2 === 1;
    out.push(seg(23, long ? 37 : 34, deg));
    out.push(seg(long ? 40 : 37, long ? 49 : 43, deg));
  }
  return out;
})();

/** 地平線（左右・切れ目つき） */
export const horizon: Seg[] = [
  { x1: 6, y1: CY, x2: 18, y2: CY },
  { x1: 22, y1: CY, x2: CX - R - 4, y2: CY },
  { x1: CX + R + 4, y1: CY, x2: 98, y2: CY },
  { x1: 102, y1: CY, x2: 114, y2: CY },
];

/** 半円（地平線から昇る陽） */
export const sunPath = `M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY} Z`;

/** 炎（外側＝白） */
export const flameOuter =
  "M60 37.5 C62.8 41 67.4 43 67.2 47.4 C67 50.2 63.9 51.6 60 51.6 C56.1 51.6 53 50.2 52.8 47.4 C52.6 44 55.4 42.4 56.3 39.6 C57.2 41.2 58.5 42 59.3 42.4 C59.8 40.8 59.5 39.2 60 37.5 Z";
/** 炎（内側＝赤の舌） */
export const flameInner =
  "M60 43.4 C61.5 45 63.1 46 63 47.9 C62.9 49.3 61.6 50.2 60 50.2 C58.4 50.2 57.1 49.3 57 47.9 C56.9 46.5 58 45.7 58.5 44.6 C58.9 45.4 59.5 45.8 60 46 C60.2 45.1 59.8 44.3 60 43.4 Z";

export const STROKE = 1.7;

/** 単体の SVG 文字列（アイコン生成用） */
export function brandMarkSvg({
  size = 512,
  background = "#0b0b0b",
  color = BRAND_RED,
  flame = "#ffffff",
  padding = 0.12,
}: { size?: number; background?: string | null; color?: string; flame?: string; padding?: number } = {}): string {
  const inner = size * (1 - padding * 2);
  const scale = inner / MARK_W;
  const tx = size * padding;
  const ty = (size - MARK_H * scale) / 2;
  const lines = [...rays, ...horizon]
    .map((s) => `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}"/>`)
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    (background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : "") +
    `<g transform="translate(${tx} ${ty}) scale(${scale})">` +
    `<g stroke="${color}" stroke-width="${STROKE}" stroke-linecap="round" fill="none">${lines}</g>` +
    `<path d="${sunPath}" fill="${color}"/>` +
    `<path d="${flameOuter}" fill="${flame}"/>` +
    `<path d="${flameInner}" fill="${color}"/>` +
    `</g></svg>`
  );
}
