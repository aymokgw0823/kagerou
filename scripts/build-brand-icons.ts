/**
 * シンボルマーク（src/lib/brand/mark.ts）から各種アイコン画像を生成する。
 *   npm run build:icons
 * 生成物：
 *   src/app/icon.png        512×512（favicon。Next.js が <link rel="icon"> を自動出力）
 *   src/app/apple-icon.png  180×180
 *   public/images/brand/mark.svg  マーク単体（黒地なし）
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { brandMarkSvg } from "../src/lib/brand/mark";

const ROOT = join(import.meta.dirname, "..");

async function main() {
  const icon = Buffer.from(brandMarkSvg({ size: 512, background: "#0b0b0b", padding: 0.1 }));
  await sharp(icon).png().toFile(join(ROOT, "src/app/icon.png"));
  const apple = Buffer.from(brandMarkSvg({ size: 180, background: "#0b0b0b", padding: 0.1 }));
  await sharp(apple).png().toFile(join(ROOT, "src/app/apple-icon.png"));
  const dir = join(ROOT, "public/images/brand");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "mark.svg"), brandMarkSvg({ size: 240, background: null, padding: 0 }));
  console.log("icons: src/app/icon.png, src/app/apple-icon.png, public/images/brand/mark.svg");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
