/**
 * public/images/photos/ に置かれた画像（<id>.jpg|png|webp）を取り込み、
 *   - 比率をマニフェストに合わせて中央トリミング、長辺を推奨解像度に揃え、JPEG（品質 85）に再エンコード
 *   - EXIF を除去
 *   - src/config/photo-manifest.ts の該当カットに `src: "/images/photos/<id>.jpg"` を書き込む
 *   npm run photo:import            … 新しい画像を取り込む
 *   npm run photo:import -- --force … 既に src が設定済みのカットも再処理する
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { photoManifest } from "../src/config/photo-manifest";

const ROOT = join(import.meta.dirname, "..");
const PHOTO_DIR = join(ROOT, "public", "images", "photos");
const MANIFEST = join(ROOT, "src", "config", "photo-manifest.ts");

async function main() {
  const force = process.argv.includes("--force");
  mkdirSync(PHOTO_DIR, { recursive: true });
  const files = readdirSync(PHOTO_DIR);
  let manifest = readFileSync(MANIFEST, "utf8");
  const done: string[] = [];
  const skipped: string[] = [];
  for (const shot of photoManifest) {
    // 新しい原本（png / webp / jpeg）を既存の <id>.jpg より優先する
    const matches = files.filter((f) => new RegExp(`^${shot.id}\\.(jpe?g|png|webp)$`, "i").test(f));
    const file = matches.find((f) => f !== `${shot.id}.jpg`) ?? matches[0];
    if (!file) {
      if (!shot.src) skipped.push(shot.id);
      continue;
    }
    if (shot.src && !force && file === `${shot.id}.jpg`) continue;
    const input = join(PHOTO_DIR, file);
    const tmp = join(PHOTO_DIR, `${shot.id}.tmp.jpg`);
    const [rw, rh] = shot.ratio.split(":").map(Number);
    const landscape = rw >= rh;
    const width = landscape ? shot.width : Math.round((shot.height * rw) / rh);
    const height = landscape ? Math.round((shot.width * rh) / rw) : shot.height;
    await sharp(readFileSync(input))
      .rotate()
      .resize({
        width,
        height,
        fit: "cover",
        position: shot.cropPosition ?? "attention",
        withoutEnlargement: false,
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(tmp);
    renameSync(tmp, join(PHOTO_DIR, `${shot.id}.jpg`));
    if (file !== `${shot.id}.jpg` && existsSync(input)) {
      // 元ファイル（png / webp）は残さない
      const { unlinkSync } = await import("node:fs");
      unlinkSync(input);
    }
    const src = `/images/photos/${shot.id}.jpg`;
    const block = new RegExp(
      `(\\n  \\{\\n    id: "${shot.id}",[\\s\\S]*?)(\\n    priority: "[ABC]",)(\\n(?:    src: "[^"]*",\\n)?  \\},)`,
    );
    if (!block.test(manifest))
      throw new Error(`photo-manifest.ts で id "${shot.id}" のブロックを特定できません`);
    manifest = manifest.replace(
      block,
      (_m, head: string, prio: string, tail: string) =>
        `${head}${prio}\n    src: "${src}",${tail.replace(/\n    src: "[^"]*",/, "")}`,
    );
    done.push(shot.id);
  }
  writeFileSync(MANIFEST, manifest, "utf8");
  console.log(done.length ? `取り込み：${done.join(", ")}` : "取り込む新しい画像はありませんでした。");
  if (skipped.length) console.log(`未提供（ダミーのまま）：${skipped.join(", ")}`);
  console.log(
    "反映後は npm run gen:placeholders（撮影指示書の状態欄更新）と npm run check:dummy を実行してください。",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
