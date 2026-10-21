/**
 * 写真マニフェスト（src/config/photo-manifest.ts）から
 *   1. ダミー画像  public/images/placeholders/<id>.jpg
 *   2. 撮影指示書  docs/shot-list.md
 * を生成する。
 *
 *   npm run gen:placeholders
 *
 * ダミー画像は「撮影後の雰囲気が想像できる抽象画」：ブランド色の階調＋フィルム粒子＋被写体のシルエット＋構図ガイド。
 * 隅に PLACEHOLDER / 用途 / 比率 を小さく入れる。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { photoManifest, type PhotoShot, type Silhouette, type Tone } from "../src/config/photo-manifest";

const ROOT = join(import.meta.dirname, "..");
const OUT_DIR = join(ROOT, "public/images/placeholders");
const DOC_PATH = join(ROOT, "docs/shot-list.md");
/** 生成画像の長辺（表示用。納品解像度はマニフェストの width/height） */
const LONG_EDGE = 1600;

/** tokens.css のカラーと対応させた階調（dark → light） */
const palettes: Record<Tone, [string, string, string]> = {
  corporate: ["#2b2622", "#6b5a52", "#c9b8ad"],
  build: ["#4b3023", "#8f5a3a", "#cfae95"],
  dining: ["#4a3815", "#a07a2e", "#d9c48f"],
  neutral: ["#2a2926", "#6e6a62", "#c4bfb3"],
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function silhouette(kind: Silhouette, W: number, H: number): string {
  const m = Math.min(W, H);
  const cx = W / 2;
  const f = 'fill="#000" opacity="0.22" filter="url(#soft)"';
  const l = 'fill="none" stroke="#000" stroke-opacity="0.22" stroke-width="2" filter="url(#soft)"';
  switch (kind) {
    case "portrait":
      return `<circle cx="${cx}" cy="${H * 0.4}" r="${m * 0.12}" ${f}/>
        <path d="M${cx - m * 0.3} ${H} C ${cx - m * 0.3} ${H * 0.68}, ${cx - m * 0.12} ${H * 0.58}, ${cx} ${H * 0.58} C ${cx + m * 0.12} ${H * 0.58}, ${cx + m * 0.3} ${H * 0.68}, ${cx + m * 0.3} ${H} Z" ${f}/>`;
    case "group": {
      const people = [
        [W * 0.32, 0.9],
        [W * 0.52, 1.0],
        [W * 0.7, 0.85],
      ];
      return people
        .map(
          ([x, s]) => `<circle cx="${x}" cy="${H * 0.46}" r="${m * 0.085 * s}" ${f}/>
        <path d="M${x - m * 0.2 * s} ${H} C ${x - m * 0.2 * s} ${H * 0.72}, ${x - m * 0.08 * s} ${H * 0.62}, ${x} ${H * 0.62} C ${x + m * 0.08 * s} ${H * 0.62}, ${x + m * 0.2 * s} ${H * 0.72}, ${x + m * 0.2 * s} ${H} Z" ${f}/>`,
        )
        .join("");
    }
    case "building": {
      const x0 = W * 0.3;
      const w = W * 0.4;
      const y0 = H * 0.18;
      const cols = 4;
      const rows = 6;
      let win = "";
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const wx = x0 + w * 0.12 + (c * (w * 0.76)) / cols;
          const wy = y0 + H * 0.06 + (r * (H * 0.7)) / rows;
          win += `<rect x="${wx}" y="${wy}" width="${w * 0.1}" height="${H * 0.06}" fill="#fff" opacity="0.12"/>`;
        }
      return `<rect x="${x0}" y="${y0}" width="${w}" height="${H - y0}" ${f}/>${win}
        <rect x="${W * 0.08}" y="${H * 0.42}" width="${W * 0.18}" height="${H * 0.58}" ${f}/>
        <rect x="${W * 0.74}" y="${H * 0.35}" width="${W * 0.2}" height="${H * 0.65}" ${f}/>`;
    }
    case "interior": {
      const vx = W * 0.5;
      const vy = H * 0.48;
      return `<path d="M0 ${H} L${W * 0.22} ${H * 0.72} L${W * 0.78} ${H * 0.72} L${W} ${H} Z" ${f}/>
        <path d="M0 0 L${W * 0.22} ${H * 0.25} L${W * 0.22} ${H * 0.72} L0 ${H}" ${l}/>
        <path d="M${W} 0 L${W * 0.78} ${H * 0.25} L${W * 0.78} ${H * 0.72} L${W} ${H}" ${l}/>
        <rect x="${W * 0.22}" y="${H * 0.25}" width="${W * 0.56}" height="${H * 0.47}" ${l}/>
        <path d="M0 0 L${vx} ${vy} L${W} 0 M0 ${H} L${vx} ${vy} L${W} ${H}" stroke="#000" stroke-opacity="0.08" fill="none"/>`;
    }
    case "desk":
      return `<rect x="0" y="${H * 0.66}" width="${W}" height="${H * 0.34}" ${f}/>
        <rect x="${W * 0.3}" y="${H * 0.28}" width="${W * 0.34}" height="${H * 0.36}" rx="2" ${f}/>
        <ellipse cx="${W * 0.47}" cy="${H * 0.46}" rx="${W * 0.22}" ry="${H * 0.22}" fill="#fff" opacity="0.14" filter="url(#glow)"/>
        <circle cx="${W * 0.8}" cy="${H * 0.52}" r="${m * 0.08}" ${f}/>`;
    case "site": {
      let grid = "";
      for (let i = 0; i <= 6; i++) {
        const x = W * 0.15 + (i * W * 0.7) / 6;
        grid += `<line x1="${x}" y1="${H * 0.1}" x2="${x}" y2="${H}" ${l}/>`;
      }
      for (let j = 0; j <= 4; j++) {
        const y = H * 0.1 + (j * H * 0.9) / 4;
        grid += `<line x1="${W * 0.15}" y1="${y}" x2="${W * 0.85}" y2="${y}" ${l}/>`;
      }
      return `${grid}<path d="M${W * 0.15} ${H} L${W * 0.85} ${H * 0.1}" ${l}/>
        <path d="M${W * 0.15} ${H * 0.1} L${W * 0.85} ${H}" ${l}/>
        <circle cx="${W * 0.5}" cy="${H * 0.62}" r="${m * 0.09}" ${f}/>`;
    }
    case "food":
      return `<rect x="0" y="${H * 0.58}" width="${W}" height="${H * 0.42}" ${f}/>
        <ellipse cx="${cx}" cy="${H * 0.58}" rx="${m * 0.34}" ry="${m * 0.22}" fill="#fff" opacity="0.2" filter="url(#soft)"/>
        <ellipse cx="${cx}" cy="${H * 0.57}" rx="${m * 0.2}" ry="${m * 0.13}" ${f}/>`;
    case "street": {
      const blocks = [0.0, 0.14, 0.3, 0.5, 0.64, 0.82].map((x, i) => {
        const h = [0.25, 0.4, 0.32, 0.5, 0.36, 0.28][i];
        return `<rect x="${W * x}" y="${H * (0.6 - h)}" width="${W * 0.15}" height="${H * h}" ${f}/>`;
      });
      return `${blocks.join("")}<rect x="0" y="${H * 0.6}" width="${W}" height="${H * 0.4}" ${f}/>`;
    }
    case "abstract":
    default:
      return `<path d="M0 ${H * 0.2} L${cx} ${H * 0.5} M0 ${H * 0.8} L${cx} ${H * 0.5} M${W} ${H * 0.5} L${cx} ${H * 0.5}" ${l}/>
        <circle cx="${cx}" cy="${H * 0.5}" r="${m * 0.03}" ${f}/>`;
  }
}

function buildSvg(shot: PhotoShot, W: number, H: number): string {
  const [dark, mid, light] = palettes[shot.tone];
  const thirds = `
    <g stroke="#fff" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="6 10">
      <line x1="${W / 3}" y1="0" x2="${W / 3}" y2="${H}"/><line x1="${(W * 2) / 3}" y1="0" x2="${(W * 2) / 3}" y2="${H}"/>
      <line x1="0" y1="${H / 3}" x2="${W}" y2="${H / 3}"/><line x1="0" y1="${(H * 2) / 3}" x2="${W}" y2="${(H * 2) / 3}"/>
    </g>`;
  const label = `PLACEHOLDER / ${shot.id} / ${shot.ratio}`;
  const fontSize = Math.max(14, Math.round(W / 90));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed="${shot.id.length}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(W / 220)}"/></filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(W / 24)}"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${silhouette(shot.silhouette, W, H)}
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.6"/>
  ${thirds}
  <g font-family="Menlo, Consolas, 'DejaVu Sans Mono', monospace" font-size="${fontSize}" fill="#fff" fill-opacity="0.75">
    <text x="${fontSize * 1.2}" y="${H - fontSize * 1.2}">${esc(label)}</text>
    <text x="${W - fontSize * 1.2}" y="${H - fontSize * 1.2}" text-anchor="end">${shot.width}×${shot.height}</text>
  </g>
</svg>`;
}

async function generateImages() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const shot of photoManifest) {
    const scale = LONG_EDGE / Math.max(shot.width, shot.height);
    const W = Math.round(shot.width * scale);
    const H = Math.round(shot.height * scale);
    const svg = buildSvg(shot, W, H);
    const out = join(OUT_DIR, `${shot.id}.jpg`);
    await sharp(Buffer.from(svg), { density: 96 })
      .jpeg({ quality: 78, progressive: true, mozjpeg: true })
      .toFile(out);
    console.log(`  ✓ ${shot.id}.jpg  ${W}×${H}`);
  }
}

function shotListMarkdown(): string {
  const byPriority = (p: PhotoShot["priority"]) => photoManifest.filter((s) => s.priority === p);
  const lines: string[] = [];
  lines.push("# 撮影指示書（Shot List）");
  lines.push("");
  lines.push(
    "> このファイルは `src/config/photo-manifest.ts` から `npm run gen:placeholders` で自動生成されます。直接編集せず、マニフェストを更新してください。",
  );
  lines.push("");
  lines.push(`- 生成日：${new Date().toISOString().slice(0, 10)}`);
  lines.push(
    `- カット数：${photoManifest.length}（A: ${byPriority("A").length} / B: ${byPriority("B").length} / C: ${byPriority("C").length}）`,
  );
  lines.push("- 納品：JPEG（sRGB・最高画質）＋ RAW。解像度は各カットの「推奨解像度」以上。");
  lines.push(
    "- 共通の注意：ストック写真的な「作り笑顔・決めポーズ」は避ける。人物は自然な動作の中で。小物・ケーブル・私物は片付ける。",
  );
  lines.push(
    '- 差し替え手順：撮影後の写真を `public/images/photos/` に置き、マニフェストの該当カットに `src: "/images/photos/<file>.jpg"` を追加する。',
  );
  lines.push("");
  lines.push("## 一覧");
  lines.push("");
  lines.push("| 優先 | ID | 用途 | 比率 | 推奨解像度 | 人物 | 場所 | 使用ページ |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const s of [...byPriority("A"), ...byPriority("B"), ...byPriority("C")]) {
    lines.push(
      `| ${s.priority} | \`${s.id}\` | ${s.label} | ${s.ratio} | ${s.width}×${s.height} | ${s.people} | ${s.location} | ${s.pages.join(", ")} |`,
    );
  }
  lines.push("");
  lines.push("## 撮影場所ごとのまとめ（スケジュール組み立て用）");
  lines.push("");
  const byLocation = new Map<string, PhotoShot[]>();
  for (const s of photoManifest) {
    const key = s.location.split("、")[0].split("（")[0].trim();
    byLocation.set(key, [...(byLocation.get(key) ?? []), s]);
  }
  for (const [loc, shots] of byLocation) {
    lines.push(`- **${loc}**：${shots.map((s) => `${s.label}（\`${s.id}\`）`).join("、")}`);
  }
  lines.push("");
  lines.push("## カット詳細");
  lines.push("");
  for (const s of photoManifest) {
    lines.push(`### ${s.label}  \`${s.id}\``);
    lines.push("");
    lines.push(`![${s.label} のダミー画像](../public/images/placeholders/${s.id}.jpg)`);
    lines.push("");
    lines.push("| 項目 | 内容 |");
    lines.push("|---|---|");
    lines.push(`| 優先度 | ${s.priority} |`);
    lines.push(`| 使用ページ | ${s.pages.join(", ")} |`);
    lines.push(`| 比率・解像度 | ${s.ratio}・${s.width}×${s.height}px 以上 |`);
    lines.push(`| 被写体 | ${s.subject} |`);
    lines.push(`| 構図 | ${s.composition} |`);
    lines.push(`| 光 | ${s.light} |`);
    lines.push(`| 雰囲気 | ${s.mood} |`);
    lines.push(`| 人物 | ${s.people} |`);
    lines.push(`| 撮影場所の候補 | ${s.location} |`);
    lines.push(`| alt（Web表示用） | ${s.alt} |`);
    lines.push(`| 状態 | ${s.src ? `実写真（${s.src}）` : "ダミー画像（未撮影）"} |`);
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  console.log("Generating placeholder images…");
  await generateImages();
  mkdirSync(join(ROOT, "docs"), { recursive: true });
  writeFileSync(DOC_PATH, shotListMarkdown(), "utf8");
  console.log(`Wrote ${DOC_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
