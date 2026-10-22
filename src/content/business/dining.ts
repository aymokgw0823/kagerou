/**
 * 事業ページ：飲食（/business/dining）
 * 軸：営む（自ら店舗を営み、場がどう使われ、どう育つかを日々知っている）
 *
 * 店舗情報は自社店舗「鉄板居酒屋 陽炎」の公式サイト（https://teppan-kagero.com/）に合わせている（2026-10-22 時点）。
 * 営業時間・メニュー・価格を変更したときは、公式サイトと合わせてここも更新する。
 */
import type { BusinessDetail, Store } from "./types";

/** 自社店舗：鉄板居酒屋 陽炎（松戸市新松戸） */
export const teppanKagero = {
  name: "鉄板居酒屋 陽炎",
  nameEn: "Teppan Izakaya KAGERO",
  brand: "陽炎",
  concept:
    "お客様ご自身で焼き上げていただくスタイルの鉄板居酒屋です。焼き加減や香ばしさを楽しみながら、出来立ての美味しさをご堪能ください。自分好みに仕上げるひとときも、鉄板焼きの醍醐味です。",
  address: "千葉県松戸市新松戸6丁目32番地 サンライトハイツⅡ 1階",
  addressParts: { region: "千葉県松戸市", street: "新松戸6丁目32番地 サンライトハイツⅡ 1階" },
  hours: "火〜日 18:00〜24:00",
  openingHoursSpecification: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "18:00",
      closes: "24:00",
    },
  ],
  closed: "月曜日",
  tel: "047-375-8682",
  reservationUrl: "https://yoyaku.tabelog.com/yoyaku/net_booking_form/index?rcd=12066352",
  reservationLabel: "食べログ",
  website: "https://teppan-kagero.com/",
  social: [{ label: "LINE 公式アカウント", href: "https://lin.ee/wUQ44UJ" }],
  mapUrl: "https://maps.app.goo.gl/kzoPuhNsq14yHRtT9",
  facts: [
    { label: "席数・個室", value: "総席数 38席（個室あり）" },
    { label: "駐車場", value: "2台。満車の場合は近隣パーキングをご利用ください" },
    { label: "禁煙・喫煙", value: "喫煙可" },
    { label: "お支払い", value: "現金、クレジットカード、電子マネー、QRコード" },
    { label: "ビール", value: "アサヒスーパードライ SUPER COLD 認定店" },
  ],
  openedOn: "2026-02-09",
  logoSrc: "/images/brand/teppan-kagero-logo.png",
  photoId: "dining-exterior",
  galleryIds: ["dining-interior", "dining-private-room"],
  isDummy: false,
} satisfies Store;

export const dining = {
  id: "dining",
  hero: {
    headline: "自ら現場に立ち、場を営む。",
    lead: "松戸市新松戸で、鉄板居酒屋「陽炎」を運営しています。お客様ご自身で焼き上げていただくスタイルの鉄板焼きと、黒毛和牛・鉄板料理・お好み焼き。厨房の動線も、客席の居心地も、日々の営業で確かめています。自社に建設部門があるから、空間づくりから自分たちで手がけられます。",
    photoId: "kv-dining",
  },
  problems: [
    "仕事帰りに、キンキンに冷えた生ビールと出来立ての鉄板料理を楽しみたい",
    "少人数の会食や接待に使える、個室のある店を新松戸で探している",
    "歓送迎会や仲間との集まりで、焼きながら盛り上がれる店がほしい",
    "お好み焼き・もんじゃから和牛ステーキまで、家族で楽しめる店を探している",
    "飲食店の開業を考えていて、実際に営んでいる人の話を聞きたい",
  ],
  services: [
    {
      title: "鉄板居酒屋「陽炎」の運営",
      description:
        "各テーブルの鉄板で、お客様ご自身で焼き上げていただくスタイル。国産黒毛和牛のステーキや焼き肉、鉄板料理、お好み焼き・もんじゃ焼き、一品料理を、火〜日の 18:00〜24:00 に提供しています。",
    },
    {
      title: "個室・団体でのご利用",
      description:
        "総席数 38席、個室あり。歓送迎会や少人数の会食、地域の集まりなど、人数・内容に応じてご相談ください。駐車場は 2台分あります。",
    },
    {
      title: "こだわりのビールとお酒",
      description:
        "アサヒスーパードライ SUPER COLD 認定店として、温度・ガス圧・グラス洗浄まで徹底管理した生ビールを提供。ウイスキー、焼酎、日本酒、ボトルも揃えています。",
    },
    {
      title: "店舗づくりの実践",
      description:
        "店舗の設計・施工は自社の建設部門が担っています。営業しながら小さな改修を重ね、使いやすさを確かめ続けていることが、建設事業の店舗設計にも活きています。",
    },
    {
      title: "開業のご相談",
      description:
        "飲食店の開業や改装をお考えの方に、実際に営んでいる立場からお話しします。物件・厨房・席数・動線の相談は、建設事業と一緒にお受けします。",
    },
  ],
  reasons: [
    {
      title: "つくる側と営む側、両方を知っている",
      description:
        "「陽炎」の設計・施工は自社の建設部門が手がけました。図面の段階で「ここは実際に使うと不便」と気づけるのは、自分たちが毎日店に立っているからです。",
      synergy: ["build"],
    },
    {
      title: "営業しながら、店を育て続けている",
      description:
        "開業して終わりではなく、客席の配置や厨房の収納、照明などを営業しながら少しずつ見直しています。その積み重ねが、建設事業で提案する「開業後を見据えた店づくり」の根拠になっています。",
      synergy: ["build"],
    },
    {
      title: "自分で焼く楽しさと、素材のよさ",
      description:
        "国産黒毛和牛のシャトーブリアンやサーロインから、鉄板料理、お好み焼きまで。焼き加減をご自身で決められるからこそ、素材そのものの味にこだわっています。",
    },
  ],
  flow: [
    {
      title: "ご予約",
      description:
        "お電話（047-375-8682）またはオンライン（食べログ）でご予約いただけます。営業時間内はご予約なしでもお入りいただけます。",
    },
    {
      title: "ご相談（個室・団体）",
      description: "日時、人数、ご予算、お料理の内容をお伺いし、コースやお飲み物をご提案します。",
    },
    {
      title: "ご来店・お食事",
      description:
        "各テーブルの鉄板で、お好みの焼き加減に仕上げてお召し上がりください。アレルギーや苦手な食材は事前にお知らせください。",
    },
    {
      title: "次回のご案内",
      description: "季節のメニューやお知らせは、店舗公式サイトと LINE 公式アカウントでご案内しています。",
    },
  ],
  pricing: [
    {
      plan: "鉄板料理・一品料理",
      price: "300円〜",
      note: "えのきバター 380円、ソース焼きそば 650円、海老焼き 1,800円 など。",
    },
    {
      plan: "国産黒毛和牛",
      price: "2,000円〜",
      note: "ハラミ 2,200円、ランプステーキ 150g 3,500円、シャトーブリアン 100g 4,500円 など。",
    },
    {
      plan: "お好み焼き・もんじゃ焼き",
      price: "800円〜",
      note: "陽炎焼き 1,000円、陽炎もんじゃ 1,500円 など。",
    },
    {
      plan: "お飲み物",
      price: "400円〜",
      note: "生ビール（アサヒスーパードライ）500円、ハイボール 550円、ソフトドリンク 400円。",
    },
  ],
  pricingNote:
    "価格はすべて税込（2026年10月時点）。仕入れの状況により変更する場合があります。最新のメニューは店舗公式サイトをご覧ください。",
  faq: [
    {
      q: "予約は必要ですか。",
      a: "営業時間内はご予約なしでもお入りいただけますが、金曜・土曜の夜や人数の多いご利用は、事前のご予約をおすすめします。お電話（047-375-8682）または食べログのオンライン予約をご利用ください。",
    },
    {
      q: "個室はありますか。",
      a: "はい。総席数 38席のうち個室をご用意しています。人数や時間帯により条件がありますので、詳しくは店舗までお問い合わせください。",
    },
    {
      q: "駐車場はありますか。",
      a: "店舗前に 2台分あります。満車の場合は近隣のコインパーキングをご利用ください。",
    },
    {
      q: "支払い方法を教えてください。",
      a: "現金のほか、クレジットカード、電子マネー、QRコード決済をご利用いただけます。",
    },
    {
      q: "喫煙はできますか。",
      a: "店内は喫煙可です。",
    },
    {
      q: "飲食店の開業について相談できますか。",
      a: "はい。実際に店舗を営んでいる立場から、物件・厨房・席数・動線などについてお話しします。設計・施工のご相談は建設事業と一緒にお受けします。",
    },
  ],
  extra: {
    kind: "dining",
    stores: [teppanKagero],
    menu: [
      {
        name: "国産黒毛和牛シャトーブリアン",
        price: "100g 4,500円",
        category: "陽炎おすすめ",
        description: "希少部位を、ご自身の鉄板でお好みの焼き加減に。",
        photoId: "dining-food-01",
        isDummy: false,
      },
      {
        name: "国産黒毛和牛サーロインステーキ",
        price: "200g 5,500円",
        category: "陽炎おすすめ",
        description: "サシの入った国産黒毛和牛のサーロイン。",
        photoId: "dining-food-02",
        isDummy: false,
      },
      {
        name: "国産黒毛和牛ランプステーキ",
        price: "150g 3,500円",
        category: "陽炎おすすめ",
        description: "赤身のうまみを楽しむランプ。",
        photoId: "dining-food-03",
        isDummy: false,
      },
      {
        name: "国産和牛100% ハンバーグ",
        price: "150g 1,800円",
        category: "陽炎おすすめ",
        isDummy: false,
      },
      {
        name: "豚玉 お好み焼き",
        price: "1,500円",
        category: "お好み焼き",
        isDummy: false,
      },
      {
        name: "陽炎もんじゃ",
        price: "1,500円",
        category: "もんじゃ焼き",
        isDummy: false,
      },
      {
        name: "ホタテバター",
        price: "1,000円",
        category: "鉄板料理",
        isDummy: false,
      },
      {
        name: "海鮮塩焼きそば",
        price: "850円",
        category: "鉄板料理",
        isDummy: false,
      },
      {
        name: "低温調理の和牛レバ刺し",
        price: "1,300円",
        category: "一品料理",
        isDummy: false,
      },
      {
        name: "生ビール アサヒスーパードライ",
        price: "500円",
        category: "飲み物",
        description: "SUPER COLD 認定店の、キンキンに冷えた一杯。",
        isDummy: false,
      },
    ],
    menuNote: "メニューは一部抜粋です。最新のお品書きは店舗公式サイトをご覧ください。",
  },
} satisfies BusinessDetail;
