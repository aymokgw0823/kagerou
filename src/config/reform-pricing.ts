/**
 * リフォーム相談（AI）の単価表。
 * AI は写真から「項目ID」と「数量」を推定するだけで、金額はここから計算する（AIに金額を自由生成させない）。
 * 金額は一般的な相場感に基づく仮の値。**公開前に自社の実勢価格に差し替えること**（isDummy）。
 */
export type ReformPart = "外壁" | "屋根" | "水回り" | "内装" | "外構" | "設備" | "その他";

export type PricingItem = {
  id: string;
  label: string;
  part: ReformPart;
  /** 数量の単位 */
  unit: "㎡" | "m" | "箇所" | "式";
  /** 単価レンジ（円） */
  unitPriceMin: number;
  unitPriceMax: number;
  /** 数量が推定できないときの標準数量 */
  defaultQuantity: number;
  /** 数量の上限（異常値の抑制） */
  maxQuantity: number;
  description: string;
};

export const reformPricing: PricingItem[] = [
  // 外壁
  {
    id: "exterior-paint",
    label: "外壁塗装（下地処理・シーリング含む）",
    part: "外壁",
    unit: "㎡",
    unitPriceMin: 3000,
    unitPriceMax: 5500,
    defaultQuantity: 150,
    maxQuantity: 600,
    description: "高圧洗浄、下地補修、3回塗り。塗料のグレードで変動",
  },
  {
    id: "exterior-crack-repair",
    label: "外壁ひび割れ補修（部分）",
    part: "外壁",
    unit: "m",
    unitPriceMin: 2000,
    unitPriceMax: 6000,
    defaultQuantity: 10,
    maxQuantity: 200,
    description: "Uカット・シーリング充填など",
  },
  {
    id: "sealing-replace",
    label: "シーリング打ち替え",
    part: "外壁",
    unit: "m",
    unitPriceMin: 900,
    unitPriceMax: 1500,
    defaultQuantity: 150,
    maxQuantity: 600,
    description: "サイディング目地・サッシ回り",
  },
  {
    id: "siding-partial",
    label: "サイディング張り替え（部分）",
    part: "外壁",
    unit: "㎡",
    unitPriceMin: 12000,
    unitPriceMax: 25000,
    defaultQuantity: 10,
    maxQuantity: 300,
    description: "破損・反りのある部分の張り替え",
  },
  {
    id: "scaffold",
    label: "足場仮設",
    part: "外壁",
    unit: "㎡",
    unitPriceMin: 700,
    unitPriceMax: 1200,
    defaultQuantity: 200,
    maxQuantity: 800,
    description: "外壁・屋根工事に伴う仮設足場（架面積）",
  },
  // 屋根
  {
    id: "roof-paint",
    label: "屋根塗装",
    part: "屋根",
    unit: "㎡",
    unitPriceMin: 2500,
    unitPriceMax: 5000,
    defaultQuantity: 80,
    maxQuantity: 400,
    description: "スレート・金属屋根の塗り替え",
  },
  {
    id: "roof-cover",
    label: "屋根カバー工法",
    part: "屋根",
    unit: "㎡",
    unitPriceMin: 8000,
    unitPriceMax: 14000,
    defaultQuantity: 80,
    maxQuantity: 400,
    description: "既存屋根の上に金属屋根材を重ね葺き",
  },
  {
    id: "roof-replace",
    label: "屋根葺き替え",
    part: "屋根",
    unit: "㎡",
    unitPriceMin: 12000,
    unitPriceMax: 25000,
    defaultQuantity: 80,
    maxQuantity: 400,
    description: "既存撤去・下地補修・新設",
  },
  {
    id: "roof-partial-repair",
    label: "屋根部分補修（棟板金・瓦差し替え等）",
    part: "屋根",
    unit: "箇所",
    unitPriceMin: 30000,
    unitPriceMax: 150000,
    defaultQuantity: 1,
    maxQuantity: 10,
    description: "棟板金の交換、漆喰補修、瓦の差し替え",
  },
  {
    id: "gutter-replace",
    label: "雨樋交換",
    part: "屋根",
    unit: "m",
    unitPriceMin: 3000,
    unitPriceMax: 7000,
    defaultQuantity: 30,
    maxQuantity: 200,
    description: "軒樋・竪樋の交換",
  },
  {
    id: "waterproof",
    label: "防水工事（屋上・バルコニー）",
    part: "屋根",
    unit: "㎡",
    unitPriceMin: 5000,
    unitPriceMax: 9000,
    defaultQuantity: 30,
    maxQuantity: 500,
    description: "ウレタン・シート防水",
  },
  // 水回り
  {
    id: "kitchen-replace",
    label: "システムキッチン交換",
    part: "水回り",
    unit: "式",
    unitPriceMin: 600000,
    unitPriceMax: 1500000,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "既存撤去・新設・給排水接続。本体グレードで変動",
  },
  {
    id: "bath-replace",
    label: "ユニットバス交換",
    part: "水回り",
    unit: "式",
    unitPriceMin: 700000,
    unitPriceMax: 1500000,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "既存撤去・新設・給排水・電気接続",
  },
  {
    id: "toilet-replace",
    label: "トイレ交換（内装含む）",
    part: "水回り",
    unit: "式",
    unitPriceMin: 150000,
    unitPriceMax: 400000,
    defaultQuantity: 1,
    maxQuantity: 2,
    description: "便器交換、床・壁の内装",
  },
  {
    id: "washstand-replace",
    label: "洗面化粧台交換",
    part: "水回り",
    unit: "式",
    unitPriceMin: 120000,
    unitPriceMax: 350000,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "本体交換と給排水接続",
  },
  {
    id: "plumbing-repair",
    label: "給排水管の補修・交換（部分）",
    part: "水回り",
    unit: "箇所",
    unitPriceMin: 30000,
    unitPriceMax: 150000,
    defaultQuantity: 1,
    maxQuantity: 10,
    description: "漏水箇所の補修、配管の部分交換",
  },
  // 内装
  {
    id: "wall-cloth",
    label: "壁紙（クロス）張り替え",
    part: "内装",
    unit: "㎡",
    unitPriceMin: 1000,
    unitPriceMax: 1800,
    defaultQuantity: 40,
    maxQuantity: 500,
    description: "量産品〜中級品",
  },
  {
    id: "floor-replace",
    label: "床の張り替え（フローリング等）",
    part: "内装",
    unit: "㎡",
    unitPriceMin: 8000,
    unitPriceMax: 18000,
    defaultQuantity: 15,
    maxQuantity: 300,
    description: "既存撤去・下地調整・新設",
  },
  {
    id: "ceiling-repair",
    label: "天井の補修・張り替え",
    part: "内装",
    unit: "㎡",
    unitPriceMin: 3000,
    unitPriceMax: 8000,
    defaultQuantity: 10,
    maxQuantity: 200,
    description: "雨染み・たわみの補修",
  },
  {
    id: "partition",
    label: "間仕切り・建具の変更",
    part: "内装",
    unit: "箇所",
    unitPriceMin: 80000,
    unitPriceMax: 300000,
    defaultQuantity: 1,
    maxQuantity: 10,
    description: "壁の新設・撤去、建具交換",
  },
  {
    id: "store-interior",
    label: "店舗内装工事（一式）",
    part: "内装",
    unit: "㎡",
    unitPriceMin: 150000,
    unitPriceMax: 400000,
    defaultQuantity: 30,
    maxQuantity: 300,
    description: "床・壁・天井・照明・什器を含む店舗の内装（坪単価換算の目安）",
  },
  // 外構・設備
  {
    id: "exterior-works",
    label: "外構工事（門扉・フェンス・舗装）",
    part: "外構",
    unit: "式",
    unitPriceMin: 200000,
    unitPriceMax: 1500000,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "内容により大きく変動",
  },
  {
    id: "electrical",
    label: "電気設備の改修",
    part: "設備",
    unit: "箇所",
    unitPriceMin: 20000,
    unitPriceMax: 150000,
    defaultQuantity: 1,
    maxQuantity: 20,
    description: "配線・分電盤・照明の更新",
  },
  {
    id: "hvac",
    label: "空調・換気設備の更新",
    part: "設備",
    unit: "箇所",
    unitPriceMin: 100000,
    unitPriceMax: 600000,
    defaultQuantity: 1,
    maxQuantity: 10,
    description: "エアコン・換気扇の交換",
  },
  // その他
  {
    id: "inspection",
    label: "現地調査・診断",
    part: "その他",
    unit: "式",
    unitPriceMin: 0,
    unitPriceMax: 0,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "現地調査は無料",
  },
  {
    id: "other",
    label: "その他の工事（現地調査で確定）",
    part: "その他",
    unit: "式",
    unitPriceMin: 50000,
    unitPriceMax: 500000,
    defaultQuantity: 1,
    maxQuantity: 1,
    description: "分類できない工事",
  },
];

export const reformPricingIsDummy = true;

export const pricingMap = Object.fromEntries(reformPricing.map((p) => [p.id, p])) as Record<
  string,
  PricingItem
>;
export const pricingIds = reformPricing.map((p) => p.id) as [string, ...string[]];

export type EstimateLine = {
  itemId: string;
  label: string;
  unit: string;
  quantity: number;
  quantityEstimated: boolean;
  min: number;
  max: number;
};
export type Estimate = { lines: EstimateLine[]; totalMin: number; totalMax: number };

/** AI が抽出した項目と数量から金額レンジを計算する（金額は AI に生成させない） */
export function estimate(candidates: { itemId: string; quantity: number | null }[]): Estimate {
  const lines: EstimateLine[] = [];
  for (const c of candidates) {
    const item = pricingMap[c.itemId];
    if (!item) continue;
    const estimated = c.quantity == null || !Number.isFinite(c.quantity) || c.quantity <= 0;
    const qty = Math.min(estimated ? item.defaultQuantity : (c.quantity as number), item.maxQuantity);
    lines.push({
      itemId: item.id,
      label: item.label,
      unit: item.unit,
      quantity: qty,
      quantityEstimated: estimated,
      min: Math.round(item.unitPriceMin * qty),
      max: Math.round(item.unitPriceMax * qty),
    });
  }
  return {
    lines,
    totalMin: lines.reduce((s, l) => s + l.min, 0),
    totalMax: lines.reduce((s, l) => s + l.max, 0),
  };
}

/** 円を「約○万円」形式に */
export function formatYen(n: number): string {
  if (n === 0) return "無料";
  if (n >= 10000) return `${(n / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万円`;
  return `${n.toLocaleString("ja-JP")}円`;
}
