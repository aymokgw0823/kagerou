/**
 * 会社について（/about）のテキスト。
 * 代表メッセージは **ダミー文**（isDummy: true）。実際の文章に差し替えること。
 */
import { PLACEHOLDER } from "@/config/company";

export const ceoMessage = {
  isDummy: true as const,
  headline: "場をつくる手と、場を営む目を、ひとつの会社に。",
  paragraphs: [
    "私たちは、建設と飲食という二つの事業を営む会社です。店舗や住宅、オフィスといった「場」をつくり、そして自分たちでも飲食店という「場」を営んでいます。一見すると離れた二つの仕事ですが、私たちにとっては、どちらも地域の「場」に関わる、ひと続きの仕事です。",
    "建設の仕事をしていると、図面の上では整っていても、実際に使ってみると不便な空間に出会うことがあります。厨房の動線、客席の間隔、収納の位置。そうした細部の良し悪しは、毎日その場に立っている人にしか分かりません。私たちが自ら店を営むのは、その「使う側の目」を持ち続けるためです。",
    "逆に、店を営んでいると、空間を少し変えるだけで、働きやすさも居心地も大きく変わることを実感します。自社に建設部門があるからこそ、営業しながら小さな改修を重ね、店を育て続けることができます。つくる手と営む目が、同じ会社の中で行き来している。それが私たちの提案の根拠です。",
    "設立間もない会社ですが、だからこそ一つひとつの現場、一人ひとりのお客様に真剣に向き合います。地域の皆さまと一緒に、長く使われ、長く愛される「場」をつくり、営んでいくこと。それが私たちの願いです。",
  ],
  signature: { title: "代表取締役", name: PLACEHOLDER },
};

export const vision = {
  vision: {
    label: "ビジョン",
    labelEn: "Vision",
    text: "地域で、場のことなら何でも安心して任せられる会社であり続ける。",
  },
  mission: {
    label: "ミッション",
    labelEn: "Mission",
    text: "地域の「場」を、つくるところから営むところまで、一社で担う。",
  },
  values: {
    label: "バリュー",
    labelEn: "Values",
    items: [
      {
        title: "使う側の目で、つくる",
        description: "図面より現場。毎日その場に立つ人の視点で、空間を設計し、施工する。",
      },
      {
        title: "営みながら、育てる",
        description: "完成は始まり。営業しながら小さな改修を重ね、場を育て続ける。",
      },
      { title: "数字と事実で向き合う", description: "見積もりも、店の損益も、根拠を示して判断する。" },
      { title: "長く、誠実に", description: "一度きりの工事や来店ではなく、地域と長く続く関係を築く。" },
    ],
  },
};

export const aboutSections = [
  { id: "message", label: "トップメッセージ", labelEn: "Message" },
  { id: "vision", label: "ビジョン・ミッション・バリュー", labelEn: "Vision" },
  { id: "overview", label: "会社概要", labelEn: "Overview" },
  { id: "officers", label: "役員紹介", labelEn: "Officers" },
  { id: "history", label: "沿革", labelEn: "History" },
  { id: "access", label: "アクセス", labelEn: "Access" },
] as const;
