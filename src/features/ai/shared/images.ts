/**
 * 画像アップロードの検証と前処理。
 * - 形式：JPEG / PNG / WebP、枚数・サイズの上限
 * - sharp で再エンコードし、EXIF（位置情報等）を除去。長辺を制限して API へ送るサイズを抑える
 */
import sharp from "sharp";
import { aiConfig } from "./config";

export type PreparedImage = {
  base64: string;
  mediaType: "image/jpeg";
  width: number;
  height: number;
  bytes: number;
};

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function prepareImages(
  files: File[],
): Promise<{ ok: true; images: PreparedImage[] } | { ok: false; message: string }> {
  const { imageMaxCount, imageMaxBytes, imageMaxEdge } = aiConfig.limits;
  if (files.length === 0) return { ok: false, message: "写真を1枚以上アップロードしてください。" };
  if (files.length > imageMaxCount) return { ok: false, message: `写真は最大${imageMaxCount}枚までです。` };
  const images: PreparedImage[] = [];
  for (const f of files) {
    if (!ALLOWED.has(f.type))
      return { ok: false, message: "写真は JPEG / PNG / WebP 形式でアップロードしてください。" };
    if (f.size > imageMaxBytes)
      return {
        ok: false,
        message: `写真1枚あたり ${Math.round(imageMaxBytes / 1024 / 1024)}MB 以内にしてください。`,
      };
    try {
      const input = Buffer.from(await f.arrayBuffer());
      // withMetadata() を呼ばないため EXIF・ICC・GPS はすべて落ちる。rotate() で向きだけ反映する
      const out = await sharp(input)
        .rotate()
        .resize({ width: imageMaxEdge, height: imageMaxEdge, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      images.push({
        base64: out.data.toString("base64"),
        mediaType: "image/jpeg",
        width: out.info.width,
        height: out.info.height,
        bytes: out.info.size,
      });
    } catch {
      return { ok: false, message: "画像を読み込めませんでした。別の写真をお試しください。" };
    }
  }
  return { ok: true, images };
}
