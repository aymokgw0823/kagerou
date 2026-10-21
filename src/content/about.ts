/**
 * 会社について（/about）のテキスト。
 * 代表メッセージは **ダミー文**（isDummy: true）。実際の文章に差し替えること。
 */
import { PLACEHOLDER } from "@/config/company";

export const ceoMessage = {
  isDummy: true as const,
  /** 見出し（1行） */
  headline: "机上の空論で終わらせない。自らの事業で確かめた答えを、お客様に。",
  /** 本文（段落の配列） */
  paragraphs: [
    "私たちは、地域で事業を営む方々の「つくる」「伝える」「育てる」を、一社でまるごと担う会社です。Webサイトや店舗といった事業の器をつくり、SNSで想いを届け、経営の数字と向き合って事業そのものを伸ばす。この3つは本来、切り離せないものだと考えています。",
    "多くの事業者の方が、Web制作はA社、SNSはB社、経営相談は税理士や顧問に、建物のことは工務店に——と、課題ごとに別々の相手と向き合っています。それぞれが優れた仕事をしていても、全体の戦略としてつながっていなければ、投資は分散し、成果は出にくくなります。私たちは、その分断をなくしたいと考えました。",
    "もう一つ、私たちが大切にしているのは「自ら実践する」ことです。当社は飲食店を自ら運営しています。集客の施策も、SNSの投稿も、原価や人件費の管理も、すべて自分たちの店で試し、うまくいったことも、いかなかったことも、そのままお客様への提案に活かしています。だから私たちの提案は、机上の空論では終わりません。",
    "設立間もない会社ですが、だからこそ一つひとつのご縁に真剣に向き合います。地域の事業者の皆さまと一緒に、長く続く事業をつくっていくこと。それが私たちの願いです。",
  ],
  signature: {
    title: "代表取締役",
    name: PLACEHOLDER,
  },
};

export const vision = {
  vision: {
    label: "ビジョン",
    labelEn: "Vision",
    text: "地域の事業者が、事業のことを安心して任せられる会社であり続ける。",
  },
  mission: {
    label: "ミッション",
    labelEn: "Mission",
    text: "地域の事業者の「つくる・伝える・育てる」を、一社でまるごと担う。",
  },
  values: {
    label: "バリュー",
    labelEn: "Values",
    items: [
      {
        title: "自ら実践する",
        description: "提案する前に、自分たちの事業で試す。現場で確かめた答えだけを届ける。",
      },
      {
        title: "全体で考える",
        description: "Web・SNS・経営・建物を切り離さず、事業全体の設計として考える。",
      },
      { title: "数字で向き合う", description: "感覚ではなく、数字と事実にもとづいて判断し、成果を測る。" },
      { title: "長く続ける", description: "一度きりの納品ではなく、事業が続く限り伴走する関係を築く。" },
    ],
  },
};

/** 沿革の見出しなど */
export const aboutSections = [
  { id: "message", label: "トップメッセージ", labelEn: "Message" },
  { id: "vision", label: "ビジョン・ミッション・バリュー", labelEn: "Vision" },
  { id: "overview", label: "会社概要", labelEn: "Overview" },
  { id: "officers", label: "役員紹介", labelEn: "Officers" },
  { id: "history", label: "沿革", labelEn: "History" },
  { id: "access", label: "アクセス", labelEn: "Access" },
] as const;
