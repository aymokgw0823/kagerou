/**
 * リフォーム相談の結果 PDF（A4・日本語フォント埋め込み）。
 * サーバー（Route Handler）で renderToBuffer する。
 */
import { Document, Font, G, Line, Page, Path, StyleSheet, Svg, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { BRAND_RED, MARK_H, MARK_W, STROKE, flameInner, flameOuter, horizon, rays, sunPath } from "@/lib/brand/mark";
import { join } from "node:path";
import { company } from "@/config/company";
import { site } from "@/config/site";
import { formatYen } from "@/config/reform-pricing";
import type { ReformResult } from "./schema";

const FONT_PATH = join(process.cwd(), "src/assets/fonts/NotoSansJP-Regular.otf");
let registered = false;
function ensureFont() {
  if (registered) return;
  Font.register({ family: "NotoSansJP", src: FONT_PATH });
  // 日本語は単語分割しない（1文字ずつ折り返す）
  Font.registerHyphenationCallback((word) => (/[　-鿿＀-￯]/.test(word) ? Array.from(word) : [word]));
  registered = true;
}

const accent = "#0076a8";
const ink = "#0b0b0b";
const gray = "#53565a";
const line = "#d0d0ce";

const s = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    fontSize: 10,
    color: ink,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    lineHeight: 1.6,
  },
  cover: { fontFamily: "NotoSansJP", color: ink, padding: 0 },
  coverBand: { backgroundColor: ink, height: 220, paddingHorizontal: 48, paddingTop: 72, color: "#ffffff" },
  coverTitle: { fontSize: 26, marginTop: 8 },
  coverSub: { fontSize: 12, color: "#dddddd", marginTop: 6 },
  coverBody: { paddingHorizontal: 48, paddingTop: 36 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { fontSize: 14, color: "#ffffff", letterSpacing: 1 },
  h1: { fontSize: 16, marginBottom: 8, paddingLeft: 8, borderLeftWidth: 4, borderLeftColor: accent },
  h2: { fontSize: 12, marginTop: 14, marginBottom: 6 },
  p: { marginBottom: 6, color: ink },
  small: { fontSize: 8, color: gray },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: line, paddingVertical: 5 },
  th: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: ink,
    paddingVertical: 5,
    fontSize: 9,
  },
  c1: { width: "46%", paddingRight: 6 },
  c2: { width: "22%" },
  c3: { width: "32%", textAlign: "right" },
  total: { flexDirection: "row", paddingVertical: 8, fontSize: 12 },
  box: { borderWidth: 1, borderColor: line, padding: 10, marginBottom: 8 },
  warn: {
    borderLeftWidth: 4,
    borderLeftColor: "#b3261e",
    backgroundColor: "#fff3d6",
    padding: 10,
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: gray,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: { fontSize: 9, color: gray, marginBottom: 10 },
});

/** 日本語テキストを任意の位置で折り返せるよう、全角文字の後ろに極細スペース（U+200A）を入れる */
function jp(text: string | undefined | null): string {
  return (text ?? "").replace(/([\u3000-\u9fff\uff00-\uffef])(?=[\u3000-\u9fff\uff00-\uffef])/g, "$1\u200a");
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Footer({ page }: { page: number }) {
  return (
    <View style={s.footer} fixed>
      <Text>{company.nameJa}　写真でリフォーム相談　結果レポート</Text>
      <Text>{page}</Text>
    </View>
  );
}

export function ReformReport({ result, customerName }: { result: ReformResult; customerName?: string }) {
  const a = result.analysis;
  const who = customerName ? `${customerName} 様` : "お客様";
  return (
    <Document title={`リフォーム相談レポート ${result.id}`} author={company.nameJa} language="ja">
      {/* 表紙 */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverBand}>
          <View style={s.logoRow}>
            <Svg width={44} height={(44 * MARK_H) / MARK_W} viewBox={`0 0 ${MARK_W} ${MARK_H}`}>
              <G stroke={BRAND_RED} strokeWidth={STROKE} strokeLinecap="round">
                {[...rays, ...horizon].map((l, i) => (
                  <Line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                ))}
              </G>
              <Path d={sunPath} fill={BRAND_RED} />
              <Path d={flameOuter} fill={ink} />
              <Path d={flameInner} fill={BRAND_RED} />
            </Svg>
            <Text style={s.logo}>{company.brandName}</Text>
          </View>
          <Text style={s.coverTitle}>{who} リフォーム相談レポート</Text>
          <Text style={s.coverSub}>写真でリフォーム相談（AI）　{fmtDate(result.createdAt)}</Text>
        </View>
        <View style={s.coverBody}>
          <Text style={s.meta}>
            相談ID：{result.id}　／　部位：{result.part}　／　写真：{result.photoCount}枚
            {result.mode === "demo" ? "　／　デモモード" : ""}
          </Text>
          <Text style={s.h1}>サマリー</Text>
          <Text style={s.p}>{jp(a.summary)}</Text>
          {result.estimate.lines.length > 0 && (
            <View style={[s.box, { marginTop: 10 }]}>
              <Text style={{ fontSize: 9, color: gray }}>概算の費用レンジ（合計の目安）</Text>
              <Text style={{ fontSize: 18, marginTop: 2 }}>
                {formatYen(result.estimate.totalMin)} 〜 {formatYen(result.estimate.totalMax)}
              </Text>
            </View>
          )}
          <Text style={[s.small, { marginTop: 10 }]}>{jp(result.disclaimer)}</Text>
        </View>
        <Footer page={1} />
      </Page>

      {/* 所見・施工候補 */}
      <Page size="A4" style={s.page}>
        {a.safety.flagged && (
          <View style={s.warn}>
            <Text style={{ fontSize: 11 }}>安全に関わる可能性があります</Text>
            {a.safety.reasons.map((r, i) => (
              <Text key={i} style={s.p}>
                ・{jp(r)}
              </Text>
            ))}
            <Text style={s.small}>早めに専門家の点検を受けることをおすすめします。</Text>
          </View>
        )}
        <Text style={s.h1}>写真から読み取れる状態</Text>
        {a.findings.map((f, i) => (
          <View key={i} style={s.box}>
            <Text style={{ fontSize: 10 }}>
              写真{f.photoIndex}：{f.area}
            </Text>
            <Text style={s.p}>{jp(f.observation)}</Text>
          </View>
        ))}
        <Text style={s.small}>※ 写真からの推定です。現地調査で状態を確認します。</Text>

        {result.estimate.lines.length > 0 && (
          <>
            <Text style={[s.h1, { marginTop: 18 }]}>考えられる施工内容と概算</Text>
            <View style={s.th}>
              <Text style={s.c1}>施工内容</Text>
              <Text style={s.c2}>数量（推定）</Text>
              <Text style={s.c3}>概算</Text>
            </View>
            {result.estimate.lines.map((l) => (
              <View key={l.itemId} style={s.row} wrap={false}>
                <View style={s.c1}>
                  <Text>{l.label}</Text>
                  <Text style={s.small}>
                    {jp(a.candidates.find((c) => c.itemId === l.itemId)?.rationale)}
                  </Text>
                </View>
                <Text style={s.c2}>
                  {l.quantity} {l.unit}
                  {l.quantityEstimated ? "（標準値）" : ""}
                </Text>
                <Text style={s.c3}>
                  {l.min === 0 && l.max === 0 ? "無料" : `${formatYen(l.min)}〜${formatYen(l.max)}`}
                </Text>
              </View>
            ))}
            <View style={s.total}>
              <Text style={[s.c1, { width: "68%" }]}>合計の目安</Text>
              <Text style={s.c3}>
                {formatYen(result.estimate.totalMin)}〜{formatYen(result.estimate.totalMax)}
              </Text>
            </View>
            <Text style={s.small}>{jp(result.disclaimer)}</Text>
          </>
        )}

        <Text style={[s.h1, { marginTop: 18 }]}>現地調査で確認すること</Text>
        {a.nextSteps.map((n, i) => (
          <Text key={i} style={s.p}>
            {i + 1}. {jp(n)}
          </Text>
        ))}
        <Footer page={2} />
      </Page>

      {/* 会社紹介・問い合わせ */}
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>私たちについて</Text>
        <Text style={s.p}>{jp(site.description)}</Text>
        <Text style={s.h2}>建設事業</Text>
        <Text style={s.p}>
          {jp(
            "店舗・住宅・オフィスのリフォームから新築まで、設計から施工管理まで一貫して担います。自ら飲食店を営んでいるから、使う側の視点で設計できます。",
          )}
        </Text>
        {result.similarWorks.length > 0 && (
          <>
            <Text style={s.h2}>類似の施工事例</Text>
            {result.similarWorks.map((w) => (
              <View key={w.slug} style={s.box}>
                <Text>{w.title}</Text>
                <Text style={s.small}>{w.client}</Text>
                <Text style={s.p}>{jp(w.summary)}</Text>
              </View>
            ))}
          </>
        )}
        <Text style={[s.h1, { marginTop: 18 }]}>お問い合わせ・現地調査のご予約</Text>
        <Text style={s.p}>
          {jp(
            `現地調査は無料です。このレポートの相談ID（${result.id}）をお伝えいただくと、担当者が内容を確認したうえでご対応します。`,
          )}
        </Text>
        <View style={s.box}>
          <Text>{company.nameJa}</Text>
          <Text>{company.address.full}</Text>
          <Text>
            TEL {company.contact.tel}（{company.contact.hours}）
          </Text>
          <Text>{company.contact.email}</Text>
          <Text>Web {site.url}/booking</Text>
          {company.licenses
            .filter((l) => l.business === "build")
            .map((l) => (
              <Text key={l.label} style={s.small}>
                {l.label}：{l.number}
              </Text>
            ))}
        </View>
        <Text style={s.small}>{jp(result.disclaimer)}</Text>
        <Footer page={3} />
      </Page>
    </Document>
  );
}

export async function renderReformPdf(result: ReformResult, customerName?: string): Promise<Buffer> {
  ensureFont();
  return renderToBuffer(<ReformReport result={result} customerName={customerName} />);
}
