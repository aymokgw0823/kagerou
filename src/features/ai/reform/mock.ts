/**
 * デモモード（API キー未設定）用のモック解析結果。
 * 部位ごとに「それらしい」所見を返す。決定論的（同じ入力なら同じ結果）。
 */
import type { ReformAnalysis, ReformPartInput } from "./schema";

const mocks: Record<ReformPartInput, (n: number) => ReformAnalysis> = {
  外壁: (n) => ({
    summary:
      "外壁の表面に塗膜の劣化と見られる変色・チョーキング（白い粉状の劣化）の兆候が確認できます。目地のシーリングにも硬化や隙間が見られる可能性があります。写真からの推定では、塗装の塗り替え時期に差しかかっている状態と考えられます。足場の設置を伴う工事になる見込みです。",
    findings: Array.from({ length: n }, (_, i) => ({
      photoIndex: i + 1,
      area: i % 2 === 0 ? "外壁サイディング" : "サイディングの目地・サッシ回り",
      observation:
        i % 2 === 0
          ? "表面の色あせと、塗膜の粉化（チョーキング）と見られる白っぽい変色があります。部分的に細いひび割れの可能性もあります。"
          : "シーリング材の硬化・痩せと見られる隙間があります。雨水の浸入経路になる可能性があります。",
      severity: i % 2 === 0 ? "medium" : "medium",
    })),
    candidates: [
      {
        itemId: "exterior-paint",
        rationale: "写真1の塗膜の粉化・色あせから、外壁全体の塗り替えが候補になります。",
        quantity: null,
        priority: "high",
      },
      {
        itemId: "sealing-replace",
        rationale: "写真2の目地シーリングの硬化・隙間から、打ち替えを同時に行うのが一般的です。",
        quantity: null,
        priority: "high",
      },
      {
        itemId: "scaffold",
        rationale: "外壁全面の塗装には足場の仮設が必要です。",
        quantity: null,
        priority: "medium",
      },
    ],
    safety: { flagged: false, reasons: [] },
    nextSteps: [
      "外壁全体のひび割れの本数と幅を確認します",
      "シーリングの劣化範囲（全周か部分か）を確認します",
      "塗膜の密着性（既存塗料の種類）を確認します",
    ],
    notRelevant: false,
  }),
  屋根: (n) => ({
    summary:
      "屋根材の表面に色あせとコケ・汚れの付着が見られ、棟板金の浮きや釘の緩みの可能性があります。写真からの推定では、塗装またはカバー工法を検討する時期と考えられます。雨漏りの兆候がある場合は早めの点検をおすすめします。",
    findings: Array.from({ length: n }, (_, i) => ({
      photoIndex: i + 1,
      area: i === 0 ? "スレート屋根の表面" : "棟板金・雨樋",
      observation:
        i === 0
          ? "表面の色あせとコケの付着が見られます。塗膜の防水性が低下している可能性があります。"
          : "棟板金の継ぎ目に隙間、または釘の浮きと見られる箇所があります。強風時の飛散リスクがあります。",
      severity: i === 0 ? "medium" : "high",
    })),
    candidates: [
      {
        itemId: "roof-partial-repair",
        rationale: "写真2の棟板金の浮きから、板金の交換・固定が優先候補です。",
        quantity: 1,
        priority: "high",
      },
      {
        itemId: "roof-paint",
        rationale:
          "写真1の色あせ・コケから、屋根全体の塗装が候補になります。劣化が進んでいる場合はカバー工法も検討します。",
        quantity: null,
        priority: "medium",
      },
      {
        itemId: "scaffold",
        rationale: "屋根工事には安全のため足場が必要です。",
        quantity: null,
        priority: "medium",
      },
    ],
    safety: {
      flagged: true,
      reasons: [
        "棟板金の浮きは強風時に飛散するおそれがあります。早めに専門家の点検を受けることをおすすめします。",
      ],
    },
    nextSteps: [
      "屋根に上がって棟板金の固定状態と下地の腐食を確認します",
      "屋根材の割れ・ズレの有無を全面で確認します",
      "小屋裏から雨染みの有無を確認します",
    ],
    notRelevant: false,
  }),
  水回り: (n) => ({
    summary:
      "キッチン・浴室まわりの設備に経年劣化と見られる汚れ・カビ・コーキングの劣化が確認できます。写真からの推定では、設備本体の交換または部分補修のどちらも考えられます。漏水の兆候がある場合は、配管の確認を優先します。",
    findings: Array.from({ length: n }, (_, i) => ({
      photoIndex: i + 1,
      area: i === 0 ? "浴室の壁・コーキング" : "キッチンの天板・シンク回り",
      observation:
        i === 0
          ? "コーキングの黒ずみ（カビ）と剥がれが見られます。壁パネルの継ぎ目から水が回る可能性があります。"
          : "天板の変色とシンク回りのコーキングの劣化が見られます。扉の表面にも傷みがあります。",
      severity: "medium",
    })),
    candidates: [
      {
        itemId: "bath-replace",
        rationale:
          "写真1の浴室の劣化状況から、ユニットバスの交換が候補です。部分補修で対応できる場合もあります。",
        quantity: 1,
        priority: "medium",
      },
      {
        itemId: "kitchen-replace",
        rationale: "写真2のキッチンの劣化から、本体交換が候補です。",
        quantity: 1,
        priority: "medium",
      },
      {
        itemId: "plumbing-repair",
        rationale: "漏水の有無を確認し、必要に応じて配管の補修を行います。",
        quantity: 1,
        priority: "low",
      },
    ],
    safety: { flagged: false, reasons: [] },
    nextSteps: [
      "床下・壁内の漏水の有無を確認します",
      "給排水管の材質と年数を確認します",
      "設備のサイズ・搬入経路を確認します",
    ],
    notRelevant: false,
  }),
  内装: (n) => ({
    summary:
      "壁紙の剥がれ・変色と、床材の傷み・きしみが見られます。天井に雨染みのような跡がある場合は、上階または屋根からの漏水を先に確認する必要があります。写真からの推定では、内装の張り替えで対応できる範囲と考えられます。",
    findings: Array.from({ length: n }, (_, i) => ({
      photoIndex: i + 1,
      area: i === 0 ? "壁紙（クロス）" : "床材・天井",
      observation:
        i === 0
          ? "継ぎ目の剥がれと、日焼けによる変色が見られます。"
          : "床材の表面の傷と、天井の一部に薄い染みのような跡があります。漏水の痕跡の可能性があります。",
      severity: i === 0 ? "low" : "medium",
    })),
    candidates: [
      {
        itemId: "wall-cloth",
        rationale: "写真1の壁紙の剥がれ・変色から、張り替えが候補です。",
        quantity: null,
        priority: "high",
      },
      {
        itemId: "floor-replace",
        rationale: "写真2の床材の傷みから、張り替えが候補です。",
        quantity: null,
        priority: "medium",
      },
      {
        itemId: "ceiling-repair",
        rationale: "天井の染みの原因を確認したうえで、補修・張り替えを行います。",
        quantity: null,
        priority: "medium",
      },
    ],
    safety: {
      flagged: true,
      reasons: ["天井の染みは漏水の兆候の可能性があります。原因の特定を優先してください。"],
    },
    nextSteps: [
      "天井の染みの原因（漏水・結露）を確認します",
      "床下地のたわみ・腐食の有無を確認します",
      "張り替え範囲（部屋単位か部分か）を決めます",
    ],
    notRelevant: false,
  }),
  その他: (n) => ({
    summary:
      "写真からは、建物の外構または設備まわりに経年の傷みが見られます。具体的な施工内容は部位の確認が必要です。現地調査で状態を確認したうえで、必要な工事をご提案します。",
    findings: Array.from({ length: n }, (_, i) => ({
      photoIndex: i + 1,
      area: "外構・設備まわり",
      observation: "表面の劣化・汚れが見られますが、写真からは工事の要否を判断しきれません。",
      severity: "unknown",
    })),
    candidates: [
      {
        itemId: "other",
        rationale: "部位と状態を現地で確認したうえで、工事内容を確定します。",
        quantity: 1,
        priority: "medium",
      },
    ],
    safety: { flagged: false, reasons: [] },
    nextSteps: ["気になっている箇所の正確な位置と範囲を確認します", "関連する設備の年数・仕様を確認します"],
    notRelevant: false,
  }),
};

export function mockAnalysis(part: ReformPartInput, photoCount: number): ReformAnalysis {
  return mocks[part](Math.max(1, Math.min(photoCount, 5)));
}
