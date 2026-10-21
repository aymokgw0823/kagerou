/**
 * 自己ホストフォントの CSS と woff2 を生成する。
 *   - @fontsource の静的ウェイト（Noto Sans JP 400/700、Open Sans 400/700）を public/fonts/ にコピー
 *   - CSS（public/fonts/fonts.css）は font-display: optional に書き換える。
 *   - この CSS は描画をブロックしないよう、ページの描画後にアイドル時に読み込む（src/components/layout/font-loader.tsx）。
 *     初回訪問は OS の和文ゴシック（Hiragino / Yu Gothic 等）で描画し、フォントがキャッシュされた2回目以降は Noto Sans JP が使われる。
 *     レイアウトシフトは起こらず、Lighthouse の FCP / LCP をフォント待ちで悪化させない。
 * 生成物（public/fonts/）は git 管理外。postinstall / predev / prebuild で実行される。
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const OUT_DIR = join(ROOT, "public", "fonts");
const CSS_OUT = join(OUT_DIR, "fonts.css");

const sources = [
  { pkg: "@fontsource/noto-sans-jp", css: ["400.css", "700.css"] },
  { pkg: "@fontsource/open-sans", css: ["400.css", "700.css"] },
];

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const out: string[] = ["/* 自動生成：scripts/build-fonts.ts。直接編集しない */"];
  let files = 0;
  for (const src of sources) {
    const pkgDir = join(ROOT, "node_modules", src.pkg);
    for (const cssName of src.css) {
      const cssPath = join(pkgDir, cssName);
      if (!existsSync(cssPath))
        throw new Error(`${src.pkg}/${cssName} が見つかりません。npm install を実行してください`);
      let css = readFileSync(cssPath, "utf8");
      // woff2 だけを使う（woff は落とす）
      css = css.replace(
        /src:\s*url\(([^)]+\.woff2)\)\s*format\(['"]woff2['"]\)\s*,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\);/g,
        (_m, p1: string) => {
          const file = basename(p1.replace(/['"]/g, ""));
          copyFileSync(join(pkgDir, "files", file), join(OUT_DIR, file));
          files++;
          return `src: url(/fonts/${file}) format("woff2");`;
        },
      );
      css = css.replace(/font-display:\s*swap;/g, "font-display: optional;");
      out.push(`/* ${src.pkg}/${cssName} */`, css);
    }
  }
  writeFileSync(CSS_OUT, out.join("\n"), "utf8");
  console.log(`fonts: ${files} files + fonts.css → public/fonts`);
}

main();
