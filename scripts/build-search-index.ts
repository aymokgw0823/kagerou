/**
 * ブログの検索インデックス（public/search-index.json）をビルド時に生成する。
 *   npm run build:search-index
 * クライアントはキーワード検索を始めたときだけこの JSON を取得する（AIコンシェルジュの RAG でも同じインデックスを使う）。
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadCollection } from "../src/lib/content/fs";
import { blogFrontmatter } from "../src/lib/content/schema";
import { workFrontmatter } from "../src/lib/content/schema";
import { businesses } from "../src/config/businesses";
import { businessDetails } from "../src/content/business";
import { company } from "../src/config/company";

const ROOT = join(import.meta.dirname, "..");
const BODY_LIMIT = 2500;

export type IndexEntry = {
  type: "blog" | "work" | "page";
  slug: string;
  url: string;
  title: string;
  description: string;
  body: string;
  business: string;
  category?: string;
  tags?: string[];
  publishedAt: string;
};

export function buildIndex(): IndexEntry[] {
  const posts = loadCollection("blog", blogFrontmatter).map<IndexEntry>((d) => ({
    type: "blog",
    slug: d.frontmatter.slug,
    url: `/blog/${d.frontmatter.slug}`,
    title: d.frontmatter.title,
    description: d.frontmatter.description,
    body: d.plain.slice(0, BODY_LIMIT),
    business: d.frontmatter.business,
    category: d.frontmatter.category,
    tags: d.frontmatter.tags,
    publishedAt: d.frontmatter.publishedAt,
  }));
  const works = loadCollection("works", workFrontmatter).map<IndexEntry>((d) => ({
    type: "work",
    slug: d.frontmatter.slug,
    url: `/works/${d.frontmatter.slug}`,
    title: d.frontmatter.title,
    description: d.frontmatter.summary,
    body: d.plain.slice(0, BODY_LIMIT),
    business: d.frontmatter.business,
    publishedAt: d.frontmatter.publishedAt,
  }));
  // 事業・店舗・会社の基本情報（AIコンシェルジュが営業時間や対応エリアに答えられるように）
  const pages: IndexEntry[] = businesses.map((b) => {
    const d = businessDetails[b.id];
    const lines: string[] = [
      b.description,
      `提供サービス：${d.services.map((s) => `${s.title}（${s.description}）`).join("／")}`,
      `選ばれる理由：${d.reasons.map((r) => r.title).join("／")}`,
      `料金の目安：${d.pricing.map((p) => `${p.plan} ${p.price}${p.note ? `（${p.note}）` : ""}`).join("／")}`,
      `よくある質問：${d.faq.map((f) => `Q.${f.q} A.${f.a}`).join(" ")}`,
    ];
    if (d.extra.kind === "build") lines.push(`施工エリア：${d.extra.serviceAreas.join("・")}`);
    if (d.extra.kind === "dining")
      lines.push(
        `店舗：${d.extra.stores.map((st) => `${st.name}（${st.concept} 営業時間 ${st.hours} 定休日 ${st.closed} 所在地 ${st.address}）`).join("／")}`,
        `メニュー：${d.extra.menu.map((m) => `${m.name} ${m.price}`).join("、")}`,
      );
    return {
      type: "page",
      slug: `business-${b.id}`,
      url: b.href,
      title: `${b.nameJa}事業`,
      description: b.tagline,
      body: lines.join("\n").slice(0, BODY_LIMIT * 2),
      business: b.id,
      publishedAt: "2026-01-01",
    };
  });
  pages.push({
    type: "page",
    slug: "company",
    url: "/about",
    title: "会社について",
    description: "会社概要・アクセス",
    body: `社名 ${company.nameJa}（${company.nameEn}）。所在地 ${company.address.full}。電話 ${company.contact.tel}（受付 ${company.contact.hours}）。許認可 ${company.licenses.map((l) => `${l.label} ${l.number}`).join("、")}。事業内容 ${company.businessSummary.join("、")}。`,
    business: "cross",
    publishedAt: "2026-01-01",
  });
  pages.push({
    type: "page",
    slug: "ai-reform",
    url: "/ai/reform",
    title: "写真でリフォーム相談（AI・無料）",
    description: "写真から施工内容と概算費用レンジを提示",
    body: "気になる箇所の写真を最大5枚アップロードし、部位と状況を選ぶと、AIが写真から読み取れる状態・考えられる施工内容・概算の費用レンジ・類似の施工事例を提示します。無料、約3分。結果はそのまま現地調査の予約（/booking）に引き継げます。現地調査は無料です。",
    business: "build",
    publishedAt: "2026-01-01",
  });
  return [...posts, ...works, ...pages];
}

function main() {
  const index = buildIndex();
  const outDir = join(ROOT, "public");
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, "search-index.json");
  const json = JSON.stringify(index);
  writeFileSync(out, json, "utf8");
  console.log(
    `search-index: ${index.length} entries, ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB → ${out}`,
  );
}

main();
