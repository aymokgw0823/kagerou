/**
 * アップロードファイルの保存先インターフェース。
 * 既定はローカルディスク（./uploads、git 管理外）。Vercel などでは Blob ストレージの実装に差し替える。
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export type Storage = {
  put(dir: string, filename: string, data: Buffer): Promise<{ key: string }>;
};

// Vercel などサーバーレス環境ではプロジェクト直下に書き込めないため /tmp（一時領域。デプロイごとに消える）に退避する。
// 履歴書を確実に保管するには UPLOAD_DIR に永続ディスクを指定するか、Blob ストレージの実装に差し替える。
const UPLOAD_ROOT =
  process.env.UPLOAD_DIR ?? (process.env.VERCEL ? join("/tmp", "uploads") : join(process.cwd(), "uploads"));

function safeName(name: string): string {
  return name.replace(/[^\w.\-ぁ-んァ-ン一-龠]/g, "_").slice(0, 100);
}

export const localStorage: Storage = {
  async put(dir, filename, data) {
    const key = `${dir}/${randomUUID()}-${safeName(filename)}`;
    const abs = join(UPLOAD_ROOT, key);
    await mkdir(join(UPLOAD_ROOT, dir), { recursive: true });
    await writeFile(abs, data);
    return { key };
  },
};

export const storage: Storage = localStorage;

/** 履歴書として受け付けるファイル */
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
