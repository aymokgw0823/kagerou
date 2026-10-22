/**
 * 写真マニフェスト：サイト内で写真が入る箇所の一覧。
 *
 * - `npm run gen:placeholders` がこの定義からダミー画像（public/images/placeholders/<id>.jpg）と
 *   撮影指示書（docs/shot-list.md）を生成する。
 * - 実際の写真に差し替えるときは、該当カットの `src` に実写真のパス（public 配下、例 "/images/photos/ceo.jpg"）を
 *   入れるだけでよい。`src` が未設定のカットはダミー画像が使われ、check-dummy が「未差し替え」として検出する。
 * - 画像は必ず `<Photo id="..." />`（src/components/ui/photo.tsx）経由で表示する。
 */

export type AspectRatio = "3:2" | "2:3" | "4:5" | "16:9" | "21:9" | "1:1" | "4:3";

/** ダミー画像の色調（tokens.css の事業カラーに対応） */
export type Tone = "corporate" | "build" | "dining" | "neutral";

/** ダミー画像に描く簡易シルエット（被写体のヒント） */
export type Silhouette =
  | "portrait" // 人物バストアップ
  | "group" // 複数人
  | "building" // 建物外観
  | "interior" // 室内・空間
  | "desk" // 執務風景（机・画面）
  | "site" // 建設現場・足場
  | "food" // 料理・テーブル
  | "street" // 街・外観の引き
  | "abstract"; // 抽象（キービジュアル等）

export type PhotoShot = {
  /** 一意のID（ファイル名にも使う） */
  id: string;
  /** 用途名（日本語） */
  label: string;
  /** 使用ページ */
  pages: string[];
  ratio: AspectRatio;
  /** 推奨納品解像度（長辺） */
  width: number;
  height: number;
  tone: Tone;
  silhouette: Silhouette;
  /** 撮影指示 */
  subject: string;
  composition: string;
  light: string;
  mood: string;
  people: "なし" | "1名" | "2〜3名" | "複数名";
  location: string;
  /** alt テキスト（実写真でもそのまま使える文言にする） */
  alt: string;
  /** 実写真のパス。未設定ならダミー画像 */
  src?: string;
  /** photo:import で比率を合わせる際のトリミング位置（既定は被写体検出 "attention"） */
  cropPosition?: "attention" | "centre" | "top" | "bottom" | "left" | "right";
  /** 優先度（撮影日の組み立て用） */
  priority: "A" | "B" | "C";
};

const r = (ratio: AspectRatio, long = 2400): { ratio: AspectRatio; width: number; height: number } => {
  const [w, h] = ratio.split(":").map(Number);
  const landscape = w >= h;
  const width = landscape ? long : Math.round((long * w) / h);
  const height = landscape ? Math.round((long * h) / w) : long;
  return { ratio, width, height };
};

export const photoManifest: PhotoShot[] = [
  // ───────── 会社・人物 ─────────
  {
    id: "ceo-portrait",
    label: "代表ポートレート",
    pages: ["/about", "/about/message"],
    ...r("4:5", 2400),
    tone: "corporate",
    silhouette: "portrait",
    subject: "代表取締役。スーツまたはジャケット、ノーネクタイ可",
    composition: "胸から上。目線はレンズ、やや斜め45度。背景は無地の壁か窓際で抜けをつくる",
    light: "窓からの自然光を主光源に、逆側にレフ板で起こす。硬い影を避ける",
    mood: "誠実・静か・余裕。笑顔は控えめに口角を上げる程度",
    people: "1名",
    location: "本社会議室の窓際、または応接室",
    alt: "代表取締役のポートレート",
    priority: "A",
    src: "/images/photos/ceo-portrait.jpg",
  },
  {
    id: "ceo-at-work",
    label: "代表：仕事風景",
    pages: ["/about/message"],
    ...r("3:2"),
    tone: "corporate",
    silhouette: "desk",
    subject: "代表が打ち合わせ中、または図面・画面を見ている様子",
    composition: "斜め後方から、手元と視線の先を入れる。顔は半分見える程度でよい",
    light: "自然光。コントラストは低め",
    mood: "考えている最中の静けさ",
    people: "1名",
    location: "本社オフィス",
    alt: "打ち合わせ中の代表取締役",
    priority: "B",
    src: "/images/photos/ceo-at-work.jpg",
  },
  {
    id: "officer-01",
    label: "役員ポートレート 01",
    pages: ["/about"],
    ...r("1:1", 1600),
    tone: "neutral",
    silhouette: "portrait",
    subject: "取締役",
    composition: "胸から上、正面やや斜め。代表と同じ背景・同じライティングで統一する",
    light: "代表ポートレートと同一セットアップ",
    mood: "落ち着き・信頼",
    people: "1名",
    location: "代表ポートレートと同じ場所",
    alt: "取締役のポートレート",
    priority: "A",
    src: "/images/photos/officer-01.jpg",
  },
  {
    id: "officer-02",
    label: "役員ポートレート 02",
    pages: ["/about"],
    ...r("1:1", 1600),
    tone: "neutral",
    silhouette: "portrait",
    subject: "取締役",
    composition: "officer-01 と同一",
    light: "officer-01 と同一",
    mood: "officer-01 と同一",
    people: "1名",
    location: "officer-01 と同一",
    alt: "取締役のポートレート",
    priority: "A",
    src: "/images/photos/officer-02.jpg",
  },
  {
    id: "officer-03",
    label: "役員ポートレート 03",
    pages: ["/about"],
    ...r("1:1", 1600),
    tone: "neutral",
    silhouette: "portrait",
    subject: "取締役",
    composition: "officer-01 と同一",
    light: "officer-01 と同一",
    mood: "officer-01 と同一",
    people: "1名",
    location: "officer-01 と同一",
    alt: "取締役のポートレート",
    priority: "A",
    src: "/images/photos/officer-03.jpg",
  },
  // ───────── オフィス ─────────
  {
    id: "office-exterior",
    label: "オフィス外観",
    pages: ["/about", "/about#access"],
    ...r("3:2"),
    tone: "neutral",
    silhouette: "building",
    subject: "本社が入るビルの外観。エントランスと社名表示が分かるように",
    composition: "正面やや見上げ。垂直線を保つ（シフトレンズ推奨）。歩行者は入れない",
    light: "午前の順光か、曇天の柔らかい光。強い影のある正午は避ける",
    mood: "端正・静か",
    people: "なし",
    location: "本社ビル前",
    alt: "本社ビルの外観",
    priority: "A",
    src: "/images/photos/office-exterior.jpg",
  },
  {
    id: "office-interior",
    label: "オフィス内観",
    pages: ["/about", "/recruit"],
    ...r("16:9"),
    tone: "neutral",
    silhouette: "interior",
    subject: "執務エリアまたは会議室の全景。人はいなくてよい",
    composition: "広角で奥行きを見せる。机上は整え、ケーブルや私物を片付ける",
    light: "自然光メイン。室内灯は色温度を揃える",
    mood: "整然・余白",
    people: "なし",
    location: "本社オフィス",
    alt: "本社オフィスの内観",
    priority: "A",
    src: "/images/photos/office-interior.jpg",
  },
  {
    id: "office-working",
    label: "執務風景",
    pages: ["/", "/about", "/recruit"],
    ...r("3:2"),
    tone: "corporate",
    silhouette: "group",
    subject: "社員2〜3名が図面や資料を囲んで話している（建設と店舗のメンバーが混ざっているとよい）",
    composition: "ミディアムショット。手元と表情の両方が入る。背景をぼかす（F2.8〜4）",
    light: "自然光。被写体に対して斜め前から",
    mood: "集中・対話。カメラ目線は不要",
    people: "2〜3名",
    location: "本社オフィス",
    alt: "打ち合わせをする社員",
    priority: "A",
    src: "/images/photos/office-working.jpg",
  },
  // ───────── 2事業キービジュアル ─────────
  {
    id: "kv-build",
    label: "キービジュアル：建設",
    pages: ["/", "/business", "/business/build"],
    ...r("21:9", 2800),
    tone: "build",
    silhouette: "site",
    subject: "施工中の現場。職人の手元や、足場・構造材のディテール",
    composition: "ディテール寄り。ヘルメット・安全装備は必ず正しく着用",
    light: "現場の自然光。朝夕の斜光が望ましい",
    mood: "確かさ・手仕事",
    people: "1名",
    location: "施工中の現場（施主の許可を得る）",
    alt: "建設事業のキービジュアル",
    priority: "A",
    src: "/images/photos/kv-build.jpg",
  },
  {
    id: "kv-dining",
    label: "キービジュアル：飲食",
    pages: ["/", "/business", "/business/dining"],
    ...r("21:9", 2800),
    tone: "dining",
    silhouette: "food",
    subject: "鉄板で焼き上げる国産牛と野菜（鉄板居酒屋 陽炎）",
    composition: "低めのアイレベル。湯気や光の反射を活かす",
    light: "店内の暖色照明＋窓の自然光。混色しすぎない",
    mood: "温度・活気",
    people: "1名",
    location: "自社店舗",
    alt: "鉄板居酒屋 陽炎：鉄板で焼き上げる国産牛と季節野菜",
    priority: "A",
    src: "/images/photos/kv-dining.jpg",
  },
  // ───────── 建設 ─────────
  {
    id: "build-site-wide",
    label: "建設現場（引き）",
    pages: ["/business/build"],
    ...r("3:2"),
    tone: "build",
    silhouette: "site",
    subject: "現場全体。足場・養生・搬入の様子",
    composition: "引きで全景。整理整頓された現場であることが伝わるように",
    light: "日中の自然光",
    mood: "安全・秩序",
    people: "複数名",
    location: "施工中の現場",
    alt: "施工中の建設現場",
    priority: "B",
    src: "/images/photos/build-site-wide.jpg",
  },
  {
    id: "build-before",
    label: "施工事例：ビフォー",
    pages: ["/business/build", "/works"],
    ...r("4:3"),
    tone: "neutral",
    silhouette: "interior",
    subject: "改修前の室内または外壁",
    composition: "三脚固定。アフターと同一位置・同一画角・同一焦点距離で撮る（必須）",
    light: "アフターと同条件に揃える",
    mood: "記録として正確に",
    people: "なし",
    location: "施工物件",
    alt: "施工前の様子",
    priority: "A",
    src: "/images/photos/build-before.jpg",
  },
  {
    id: "build-after",
    label: "施工事例：アフター",
    pages: ["/business/build", "/works"],
    ...r("4:3"),
    tone: "build",
    silhouette: "interior",
    subject: "改修後の同じ場所",
    composition: "ビフォーと完全に同一の位置・画角",
    light: "ビフォーと同条件",
    mood: "仕上がりの清潔さ",
    people: "なし",
    location: "施工物件",
    alt: "施工後の様子",
    priority: "A",
    src: "/images/photos/build-after.jpg",
  },
  // ───────── 飲食 ─────────
  {
    id: "dining-interior",
    label: "飲食店舗の内観",
    pages: ["/business/dining"],
    ...r("3:2"),
    tone: "dining",
    silhouette: "interior",
    subject: "店内の暖簾と入口（鉄板居酒屋 陽炎）",
    composition: "入口側から奥へ。テーブルセッティング済み",
    light: "店内照明＋外光。暖色に寄せすぎない",
    mood: "居心地・清潔",
    people: "なし",
    location: "自社店舗",
    alt: "鉄板居酒屋 陽炎の店内（暖簾）",
    priority: "A",
    src: "/images/photos/dining-interior.jpg",
  },
  {
    id: "dining-food-01",
    label: "料理 01（看板メニュー）",
    pages: ["/business/dining"],
    ...r("1:1", 1800),
    tone: "dining",
    silhouette: "food",
    subject: "国産黒毛和牛シャトーブリアン",
    composition: "真上または45度。皿の縁を少し切る。テーブルの素材感を残す",
    light: "逆光〜サイド光で立体感。トップ光は避ける",
    mood: "シズル・温度",
    people: "なし",
    location: "自社店舗",
    alt: "国産黒毛和牛シャトーブリアン",
    priority: "A",
    src: "/images/photos/dining-food-01.jpg",
  },
  {
    id: "dining-food-02",
    label: "料理 02",
    pages: ["/business/dining"],
    ...r("1:1", 1800),
    tone: "dining",
    silhouette: "food",
    subject: "国産黒毛和牛サーロインステーキ",
    composition: "料理01と統一。皿の向き・余白を揃える",
    light: "料理01と同一",
    mood: "料理01と同一",
    people: "なし",
    location: "自社店舗",
    alt: "国産黒毛和牛サーロインステーキ",
    priority: "B",
    src: "/images/photos/dining-food-02.jpg",
  },
  {
    id: "dining-exterior",
    label: "飲食店舗の外観",
    pages: ["/business/dining"],
    ...r("3:2"),
    tone: "dining",
    silhouette: "street",
    subject: "店舗ファサード（鉄板居酒屋 陽炎・夜）",
    composition: "正面やや斜め。夕方のブルーアワーに店内の灯りが漏れる時間帯",
    light: "ブルーアワー（日没後15〜30分）",
    mood: "灯り・誘い",
    people: "なし",
    location: "自社店舗前",
    alt: "鉄板居酒屋 陽炎の外観（夜）",
    priority: "B",
    src: "/images/photos/dining-exterior.jpg",
  },
  {
    id: "dining-food-03",
    label: "料理 03",
    pages: ["/business/dining"],
    ...r("1:1", 1800),
    tone: "dining",
    silhouette: "food",
    subject: "国産黒毛和牛ランプステーキ",
    composition: "料理01と統一。皿の向き・余白を揃える",
    light: "料理01と同一",
    mood: "料理01と同一",
    people: "なし",
    location: "自社店舗",
    alt: "国産黒毛和牛ランプステーキ",
    priority: "C",
    src: "/images/photos/dining-food-03.jpg",
  },
  {
    id: "dining-private-room",
    label: "飲食店舗の個室",
    pages: ["/business/dining"],
    ...r("3:2", 1000),
    tone: "dining",
    silhouette: "interior",
    subject: "個室のテーブル席と鉄板",
    composition: "入口側から。テーブルセッティング済み",
    light: "店内照明",
    mood: "落ち着き",
    people: "なし",
    location: "自社店舗",
    alt: "鉄板居酒屋 陽炎の個室",
    priority: "C",
    src: "/images/photos/dining-private-room.jpg",
  },
  // ───────── 採用 ─────────
  {
    id: "recruit-hero",
    label: "採用メインビジュアル",
    pages: ["/recruit"],
    ...r("21:9", 2800),
    tone: "corporate",
    silhouette: "group",
    subject: "建設と店舗のメンバーが同じ空間にいる場面（現場・店舗の混成でもよい）",
    composition: "引きで、人物は小さめに。空間の広さと人の関係を見せる",
    light: "自然光",
    mood: "開かれた・これから",
    people: "複数名",
    location: "本社オフィス、または店舗",
    alt: "採用情報のメインビジュアル",
    priority: "A",
    src: "/images/photos/recruit-hero.jpg",
  },
  {
    id: "interview-01",
    label: "社員インタビュー 01",
    pages: ["/recruit"],
    ...r("3:2"),
    tone: "neutral",
    silhouette: "portrait",
    subject: "社員1名（施工管理）。現場または事務所で",
    composition: "ウエストアップ。少しカメラから視線を外した自然な表情も撮る",
    light: "自然光",
    mood: "自然体",
    people: "1名",
    location: "本人の職場",
    alt: "社員インタビュー",
    priority: "B",
    src: "/images/photos/interview-01.jpg",
  },
  {
    id: "interview-02",
    label: "社員インタビュー 02",
    pages: ["/recruit"],
    ...r("3:2"),
    tone: "neutral",
    silhouette: "portrait",
    subject: "社員1名（職人）。現場で",
    composition: "interview-01 と統一",
    light: "現場の自然光",
    mood: "自然体",
    people: "1名",
    location: "施工現場",
    alt: "社員インタビュー",
    priority: "B",
    src: "/images/photos/interview-02.jpg",
  },
  {
    id: "interview-03",
    label: "社員インタビュー 03",
    pages: ["/recruit"],
    ...r("3:2"),
    tone: "neutral",
    silhouette: "portrait",
    subject: "社員1名（店舗スタッフ）。店舗で",
    composition: "interview-01 と統一",
    light: "店内の光",
    mood: "自然体",
    people: "1名",
    location: "自社店舗",
    alt: "社員インタビュー",
    priority: "B",
    src: "/images/photos/interview-03.jpg",
  },
];

export const photoMap = Object.fromEntries(photoManifest.map((p) => [p.id, p])) as Record<string, PhotoShot>;

export const PLACEHOLDER_DIR = "/images/placeholders";

export type ResolvedPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  ratio: AspectRatio;
  isPlaceholder: boolean;
  shot: PhotoShot;
};

/** マニフェストIDから表示用の画像情報を解決する */
export function resolvePhoto(id: string): ResolvedPhoto {
  const shot = photoMap[id];
  if (!shot) throw new Error(`photo-manifest に id "${id}" がありません`);
  const isPlaceholder = !shot.src;
  return {
    src: shot.src ?? `${PLACEHOLDER_DIR}/${shot.id}.jpg`,
    alt: shot.alt,
    width: shot.width,
    height: shot.height,
    ratio: shot.ratio,
    isPlaceholder,
    shot,
  };
}
