/**
 * 写真マニフェストから、画像生成AI（ChatGPT / Midjourney / Imagen など）用のプロンプト集を生成する。
 *   npm run photo:prompts  → docs/image-prompts.md
 * 生成した画像は public/images/photos/<id>.jpg に置き、`npm run photo:import` でマニフェストに反映する。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { photoManifest, type PhotoShot } from "../src/config/photo-manifest";

const ROOT = join(import.meta.dirname, "..");

const toneEn: Record<string, string> = {
  corporate: "calm, trustworthy corporate mood, muted warm neutrals with a hint of blue",
  build: "construction site mood, warm earthy tones, timber and concrete textures",
  dining: "warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow",
  neutral: "clean, neutral, quietly premium",
};

const silhouetteEn: Record<string, string> = {
  portrait: "portrait of a single Japanese professional",
  group: "a few Japanese staff members working together",
  building: "building exterior",
  interior: "interior space",
  desk: "work scene with hands and tools or documents",
  site: "construction work in progress",
  food: "plated Japanese dish",
  street: "storefront on a Japanese street",
  abstract: "abstract architectural composition",
};

function aspectNote(ratio: string): string {
  return `aspect ratio ${ratio}`;
}

function promptEn(s: PhotoShot): string {
  return [
    `Photorealistic editorial photograph for a Japanese construction and restaurant company website.`,
    `Subject: ${silhouetteEn[s.silhouette]} — ${s.subject}.`,
    `Composition: ${s.composition}.`,
    `Lighting: ${s.light}.`,
    `Mood: ${s.mood}; ${toneEn[s.tone]}.`,
    s.people === "なし" ? "No people in frame." : `People: ${s.people}, natural, candid, not posing at the camera.`,
    `Location: ${s.location}. Setting is in Japan; signage, architecture and details should look Japanese.`,
    `Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles.`,
    aspectNote(s.ratio) + `, high resolution (${s.width}x${s.height}).`,
  ].join(" ");
}

function promptJa(s: PhotoShot): string {
  return [
    `日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。`,
    `被写体：${s.subject}。`,
    `構図：${s.composition}。`,
    `光：${s.light}。`,
    `雰囲気：${s.mood}。`,
    s.people === "なし" ? "人物は入れない。" : `人物：${s.people}。カメラ目線の作り笑顔ではなく、自然な動作の中で。`,
    `場所：${s.location}（日本国内の設定。看板や建物の細部も日本らしく）。`,
    `文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。`,
    `アスペクト比 ${s.ratio}、推奨解像度 ${s.width}×${s.height}。`,
  ].join("");
}

function main() {
  const lines: string[] = [];
  lines.push("# 画像生成プロンプト集（写真の差し替え用）");
  lines.push("");
  lines.push("> `npm run photo:prompts` で `src/config/photo-manifest.ts` から自動生成。");
  lines.push("> 画像生成AI（ChatGPT の画像生成、Midjourney、Imagen など）にプロンプトを貼り付けて生成し、");
  lines.push("> 出力ファイルを **`public/images/photos/<ID>.jpg`**（png / webp も可）の名前で保存してから `npm run photo:import` を実行すると、");
  lines.push("> マニフェストの `src` が自動で設定され、サイト全体に反映されます。");
  lines.push("");
  lines.push("## 共通の注意");
  lines.push("");
  lines.push("- 人物が写る場合は、実在の人物に似せないこと。社員・役員のポートレートは最終的に実際の写真に差し替える前提のダミーです。");
  lines.push("- 文字・ロゴ・透かしを入れない。");
  lines.push("- 同じ場所で撮る想定のカット（役員3名、料理2品など）は、同じプロンプトの土台を使い、照明・背景を揃える。");
  lines.push("- 比率が合わない場合は、長辺を基準に中央でトリミングされます（`photo:import` が自動処理）。");
  lines.push("");
  lines.push("## 一覧");
  lines.push("");
  lines.push("| ID | 用途 | 比率 | 推奨解像度 | 保存ファイル名 |");
  lines.push("|---|---|---|---|---|");
  for (const s of photoManifest) lines.push(`| \`${s.id}\` | ${s.label} | ${s.ratio} | ${s.width}×${s.height} | \`public/images/photos/${s.id}.jpg\` |`);
  lines.push("");
  for (const s of photoManifest) {
    lines.push(`## ${s.label}  \`${s.id}\``);
    lines.push("");
    lines.push(`- 用途：${s.pages.join(", ")}　／　比率：${s.ratio}　／　推奨解像度：${s.width}×${s.height}　／　保存先：\`public/images/photos/${s.id}.jpg\``);
    lines.push("");
    lines.push("**English prompt**");
    lines.push("");
    lines.push("```text");
    lines.push(promptEn(s));
    lines.push("```");
    lines.push("");
    lines.push("**日本語プロンプト**");
    lines.push("");
    lines.push("```text");
    lines.push(promptJa(s));
    lines.push("```");
    lines.push("");
  }
  mkdirSync(join(ROOT, "docs"), { recursive: true });
  writeFileSync(join(ROOT, "docs/image-prompts.md"), lines.join("\n"), "utf8");
  console.log(`docs/image-prompts.md を生成しました（${photoManifest.length} カット）`);
}

main();
