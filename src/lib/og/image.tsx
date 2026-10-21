/**
 * OGP 画像の共通テンプレート（next/og の ImageResponse）。
 * 黒地に緑のドット付きロゴ、タイトル、サブタイトル。日本語は Noto Sans JP を埋め込む。
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { company } from "@/config/company";

export const OG_SIZE = { width: 1200, height: 630 };

let fontCache: Promise<ArrayBuffer> | null = null;
function font(): Promise<ArrayBuffer> {
  if (!fontCache) {
    fontCache = readFile(join(process.cwd(), "src/assets/fonts/NotoSansJP-Regular.otf")).then(
      (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer,
    );
  }
  return fontCache;
}

type Props = {
  title: string;
  subtitle?: string;
  /** 右上の小さなラベル（例：BLOG） */
  label?: string;
  /** 左のアクセント色 */
  accent?: string;
};

export async function ogImage({ title, subtitle, label, accent = "#86bc25" }: Props): Promise<ImageResponse> {
  const data = await font();
  const t = title.length > 60 ? `${title.slice(0, 59)}…` : title;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0b0b0b",
        color: "#ffffff",
        padding: "64px 72px",
        fontFamily: "NotoSansJP",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {company.brandName}
          <span style={{ width: 14, height: 14, borderRadius: 999, background: "#86bc25", marginLeft: 4 }} />
        </div>
        {label && <div style={{ fontSize: 22, color: "#b4b6b8", letterSpacing: "0.12em" }}>{label}</div>}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderLeft: `10px solid ${accent}`,
          paddingLeft: 32,
        }}
      >
        <div
          style={{
            fontSize: t.length > 30 ? 52 : 64,
            lineHeight: 1.3,
            fontWeight: 700,
            textWrap: "balance" as never,
          }}
        >
          {t}
        </div>
        {subtitle && (
          <div style={{ fontSize: 26, color: "#b4b6b8", marginTop: 18, lineHeight: 1.5 }}>
            {subtitle.length > 70 ? `${subtitle.slice(0, 69)}…` : subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8c8f92" }}>
        <div>{company.nameJa}</div>
        <div>つくる。営む。</div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: [{ name: "NotoSansJP", data, style: "normal", weight: 400 }] },
  );
}
