# 画像生成プロンプト集（写真の差し替え用）

> `npm run photo:prompts` で `src/config/photo-manifest.ts` から自動生成。
> 画像生成AI（ChatGPT の画像生成、Midjourney、Imagen など）にプロンプトを貼り付けて生成し、
> 出力ファイルを **`public/images/photos/<ID>.jpg`**（png / webp も可）の名前で保存してから `npm run photo:import` を実行すると、
> マニフェストの `src` が自動で設定され、サイト全体に反映されます。

## 共通の注意

- 人物が写る場合は、実在の人物に似せないこと。社員・役員のポートレートは最終的に実際の写真に差し替える前提のダミーです。
- 文字・ロゴ・透かしを入れない。
- 同じ場所で撮る想定のカット（役員3名、料理2品など）は、同じプロンプトの土台を使い、照明・背景を揃える。
- 比率が合わない場合は、長辺を基準に中央でトリミングされます（`photo:import` が自動処理）。

## 一覧

| ID | 用途 | 比率 | 推奨解像度 | 保存ファイル名 |
|---|---|---|---|---|
| `ceo-portrait` | 代表ポートレート | 4:5 | 1920×2400 | `public/images/photos/ceo-portrait.jpg` |
| `ceo-at-work` | 代表：仕事風景 | 3:2 | 2400×1600 | `public/images/photos/ceo-at-work.jpg` |
| `officer-01` | 役員ポートレート 01 | 1:1 | 1600×1600 | `public/images/photos/officer-01.jpg` |
| `officer-02` | 役員ポートレート 02 | 1:1 | 1600×1600 | `public/images/photos/officer-02.jpg` |
| `officer-03` | 役員ポートレート 03 | 1:1 | 1600×1600 | `public/images/photos/officer-03.jpg` |
| `office-exterior` | オフィス外観 | 3:2 | 2400×1600 | `public/images/photos/office-exterior.jpg` |
| `office-interior` | オフィス内観 | 16:9 | 2400×1350 | `public/images/photos/office-interior.jpg` |
| `office-working` | 執務風景 | 3:2 | 2400×1600 | `public/images/photos/office-working.jpg` |
| `kv-build` | キービジュアル：建設 | 21:9 | 2800×1200 | `public/images/photos/kv-build.jpg` |
| `kv-dining` | キービジュアル：飲食 | 21:9 | 2800×1200 | `public/images/photos/kv-dining.jpg` |
| `build-site-wide` | 建設現場（引き） | 3:2 | 2400×1600 | `public/images/photos/build-site-wide.jpg` |
| `build-before` | 施工事例：ビフォー | 4:3 | 2400×1800 | `public/images/photos/build-before.jpg` |
| `build-after` | 施工事例：アフター | 4:3 | 2400×1800 | `public/images/photos/build-after.jpg` |
| `dining-interior` | 飲食店舗の内観 | 3:2 | 2400×1600 | `public/images/photos/dining-interior.jpg` |
| `dining-food-01` | 料理 01（看板メニュー） | 1:1 | 1800×1800 | `public/images/photos/dining-food-01.jpg` |
| `dining-food-02` | 料理 02 | 1:1 | 1800×1800 | `public/images/photos/dining-food-02.jpg` |
| `dining-exterior` | 飲食店舗の外観 | 3:2 | 2400×1600 | `public/images/photos/dining-exterior.jpg` |
| `recruit-hero` | 採用メインビジュアル | 21:9 | 2800×1200 | `public/images/photos/recruit-hero.jpg` |
| `interview-01` | 社員インタビュー 01 | 3:2 | 2400×1600 | `public/images/photos/interview-01.jpg` |
| `interview-02` | 社員インタビュー 02 | 3:2 | 2400×1600 | `public/images/photos/interview-02.jpg` |
| `interview-03` | 社員インタビュー 03 | 3:2 | 2400×1600 | `public/images/photos/interview-03.jpg` |

## 代表ポートレート  `ceo-portrait`

- 用途：/about, /about/message　／　比率：4:5　／　推奨解像度：1920×2400　／　保存先：`public/images/photos/ceo-portrait.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 代表取締役。スーツまたはジャケット、ノーネクタイ可. Composition: 胸から上。目線はレンズ、やや斜め45度。背景は無地の壁か窓際で抜けをつくる. Lighting: 窓からの自然光を主光源に、逆側にレフ板で起こす。硬い影を避ける. Mood: 誠実・静か・余裕。笑顔は控えめに口角を上げる程度; calm, trustworthy corporate mood, muted warm neutrals with a hint of green. People: 1名, natural, candid, not posing at the camera. Location: 本社会議室の窓際、または応接室. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 4:5, high resolution (1920x2400).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：代表取締役。スーツまたはジャケット、ノーネクタイ可。構図：胸から上。目線はレンズ、やや斜め45度。背景は無地の壁か窓際で抜けをつくる。光：窓からの自然光を主光源に、逆側にレフ板で起こす。硬い影を避ける。雰囲気：誠実・静か・余裕。笑顔は控えめに口角を上げる程度。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：本社会議室の窓際、または応接室（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 4:5、推奨解像度 1920×2400。
```

## 代表：仕事風景  `ceo-at-work`

- 用途：/about/message　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/ceo-at-work.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: work scene with hands and tools or documents — 代表が打ち合わせ中、または図面・画面を見ている様子. Composition: 斜め後方から、手元と視線の先を入れる。顔は半分見える程度でよい. Lighting: 自然光。コントラストは低め. Mood: 考えている最中の静けさ; calm, trustworthy corporate mood, muted warm neutrals with a hint of green. People: 1名, natural, candid, not posing at the camera. Location: 本社オフィス. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：代表が打ち合わせ中、または図面・画面を見ている様子。構図：斜め後方から、手元と視線の先を入れる。顔は半分見える程度でよい。光：自然光。コントラストは低め。雰囲気：考えている最中の静けさ。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：本社オフィス（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 役員ポートレート 01  `officer-01`

- 用途：/about　／　比率：1:1　／　推奨解像度：1600×1600　／　保存先：`public/images/photos/officer-01.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 取締役. Composition: 胸から上、正面やや斜め。代表と同じ背景・同じライティングで統一する. Lighting: 代表ポートレートと同一セットアップ. Mood: 落ち着き・信頼; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: 代表ポートレートと同じ場所. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 1:1, high resolution (1600x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：取締役。構図：胸から上、正面やや斜め。代表と同じ背景・同じライティングで統一する。光：代表ポートレートと同一セットアップ。雰囲気：落ち着き・信頼。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：代表ポートレートと同じ場所（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 1:1、推奨解像度 1600×1600。
```

## 役員ポートレート 02  `officer-02`

- 用途：/about　／　比率：1:1　／　推奨解像度：1600×1600　／　保存先：`public/images/photos/officer-02.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 取締役. Composition: officer-01 と同一. Lighting: officer-01 と同一. Mood: officer-01 と同一; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: officer-01 と同一. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 1:1, high resolution (1600x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：取締役。構図：officer-01 と同一。光：officer-01 と同一。雰囲気：officer-01 と同一。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：officer-01 と同一（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 1:1、推奨解像度 1600×1600。
```

## 役員ポートレート 03  `officer-03`

- 用途：/about　／　比率：1:1　／　推奨解像度：1600×1600　／　保存先：`public/images/photos/officer-03.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 取締役. Composition: officer-01 と同一. Lighting: officer-01 と同一. Mood: officer-01 と同一; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: officer-01 と同一. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 1:1, high resolution (1600x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：取締役。構図：officer-01 と同一。光：officer-01 と同一。雰囲気：officer-01 と同一。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：officer-01 と同一（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 1:1、推奨解像度 1600×1600。
```

## オフィス外観  `office-exterior`

- 用途：/about, /about#access　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/office-exterior.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: building exterior — 本社が入るビルの外観。エントランスと社名表示が分かるように. Composition: 正面やや見上げ。垂直線を保つ（シフトレンズ推奨）。歩行者は入れない. Lighting: 午前の順光か、曇天の柔らかい光。強い影のある正午は避ける. Mood: 端正・静か; clean, neutral, quietly premium. No people in frame. Location: 本社ビル前. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：本社が入るビルの外観。エントランスと社名表示が分かるように。構図：正面やや見上げ。垂直線を保つ（シフトレンズ推奨）。歩行者は入れない。光：午前の順光か、曇天の柔らかい光。強い影のある正午は避ける。雰囲気：端正・静か。人物は入れない。場所：本社ビル前（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## オフィス内観  `office-interior`

- 用途：/about, /recruit　／　比率：16:9　／　推奨解像度：2400×1350　／　保存先：`public/images/photos/office-interior.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: interior space — 執務エリアまたは会議室の全景。人はいなくてよい. Composition: 広角で奥行きを見せる。机上は整え、ケーブルや私物を片付ける. Lighting: 自然光メイン。室内灯は色温度を揃える. Mood: 整然・余白; clean, neutral, quietly premium. No people in frame. Location: 本社オフィス. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 16:9, high resolution (2400x1350).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：執務エリアまたは会議室の全景。人はいなくてよい。構図：広角で奥行きを見せる。机上は整え、ケーブルや私物を片付ける。光：自然光メイン。室内灯は色温度を揃える。雰囲気：整然・余白。人物は入れない。場所：本社オフィス（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 16:9、推奨解像度 2400×1350。
```

## 執務風景  `office-working`

- 用途：/, /about, /recruit　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/office-working.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: a few Japanese staff members working together — 社員2〜3名が図面や資料を囲んで話している（建設と店舗のメンバーが混ざっているとよい）. Composition: ミディアムショット。手元と表情の両方が入る。背景をぼかす（F2.8〜4）. Lighting: 自然光。被写体に対して斜め前から. Mood: 集中・対話。カメラ目線は不要; calm, trustworthy corporate mood, muted warm neutrals with a hint of green. People: 2〜3名, natural, candid, not posing at the camera. Location: 本社オフィス. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：社員2〜3名が図面や資料を囲んで話している（建設と店舗のメンバーが混ざっているとよい）。構図：ミディアムショット。手元と表情の両方が入る。背景をぼかす（F2.8〜4）。光：自然光。被写体に対して斜め前から。雰囲気：集中・対話。カメラ目線は不要。人物：2〜3名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：本社オフィス（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## キービジュアル：建設  `kv-build`

- 用途：/, /business, /business/build　／　比率：21:9　／　推奨解像度：2800×1200　／　保存先：`public/images/photos/kv-build.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: construction work in progress — 施工中の現場。職人の手元や、足場・構造材のディテール. Composition: ディテール寄り。ヘルメット・安全装備は必ず正しく着用. Lighting: 現場の自然光。朝夕の斜光が望ましい. Mood: 確かさ・手仕事; construction site mood, warm earthy tones, timber and concrete textures. People: 1名, natural, candid, not posing at the camera. Location: 施工中の現場（施主の許可を得る）. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 21:9, high resolution (2800x1200).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：施工中の現場。職人の手元や、足場・構造材のディテール。構図：ディテール寄り。ヘルメット・安全装備は必ず正しく着用。光：現場の自然光。朝夕の斜光が望ましい。雰囲気：確かさ・手仕事。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：施工中の現場（施主の許可を得る）（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 21:9、推奨解像度 2800×1200。
```

## キービジュアル：飲食  `kv-dining`

- 用途：/, /business, /business/dining　／　比率：21:9　／　推奨解像度：2800×1200　／　保存先：`public/images/photos/kv-dining.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: plated Japanese dish — カウンター越しの調理、または皿に盛られた看板料理. Composition: 低めのアイレベル。湯気や光の反射を活かす. Lighting: 店内の暖色照明＋窓の自然光。混色しすぎない. Mood: 温度・活気; warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow. People: 1名, natural, candid, not posing at the camera. Location: 自社店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 21:9, high resolution (2800x1200).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：カウンター越しの調理、または皿に盛られた看板料理。構図：低めのアイレベル。湯気や光の反射を活かす。光：店内の暖色照明＋窓の自然光。混色しすぎない。雰囲気：温度・活気。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：自社店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 21:9、推奨解像度 2800×1200。
```

## 建設現場（引き）  `build-site-wide`

- 用途：/business/build　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/build-site-wide.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: construction work in progress — 現場全体。足場・養生・搬入の様子. Composition: 引きで全景。整理整頓された現場であることが伝わるように. Lighting: 日中の自然光. Mood: 安全・秩序; construction site mood, warm earthy tones, timber and concrete textures. People: 複数名, natural, candid, not posing at the camera. Location: 施工中の現場. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：現場全体。足場・養生・搬入の様子。構図：引きで全景。整理整頓された現場であることが伝わるように。光：日中の自然光。雰囲気：安全・秩序。人物：複数名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：施工中の現場（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 施工事例：ビフォー  `build-before`

- 用途：/business/build, /works　／　比率：4:3　／　推奨解像度：2400×1800　／　保存先：`public/images/photos/build-before.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: interior space — 改修前の室内または外壁. Composition: 三脚固定。アフターと同一位置・同一画角・同一焦点距離で撮る（必須）. Lighting: アフターと同条件に揃える. Mood: 記録として正確に; clean, neutral, quietly premium. No people in frame. Location: 施工物件. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 4:3, high resolution (2400x1800).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：改修前の室内または外壁。構図：三脚固定。アフターと同一位置・同一画角・同一焦点距離で撮る（必須）。光：アフターと同条件に揃える。雰囲気：記録として正確に。人物は入れない。場所：施工物件（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 4:3、推奨解像度 2400×1800。
```

## 施工事例：アフター  `build-after`

- 用途：/business/build, /works　／　比率：4:3　／　推奨解像度：2400×1800　／　保存先：`public/images/photos/build-after.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: interior space — 改修後の同じ場所. Composition: ビフォーと完全に同一の位置・画角. Lighting: ビフォーと同条件. Mood: 仕上がりの清潔さ; construction site mood, warm earthy tones, timber and concrete textures. No people in frame. Location: 施工物件. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 4:3, high resolution (2400x1800).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：改修後の同じ場所。構図：ビフォーと完全に同一の位置・画角。光：ビフォーと同条件。雰囲気：仕上がりの清潔さ。人物は入れない。場所：施工物件（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 4:3、推奨解像度 2400×1800。
```

## 飲食店舗の内観  `dining-interior`

- 用途：/business/dining　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/dining-interior.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: interior space — 店内全景。開店前の整った状態. Composition: 入口側から奥へ。テーブルセッティング済み. Lighting: 店内照明＋外光。暖色に寄せすぎない. Mood: 居心地・清潔; warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow. No people in frame. Location: 自社店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：店内全景。開店前の整った状態。構図：入口側から奥へ。テーブルセッティング済み。光：店内照明＋外光。暖色に寄せすぎない。雰囲気：居心地・清潔。人物は入れない。場所：自社店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 料理 01（看板メニュー）  `dining-food-01`

- 用途：/business/dining　／　比率：1:1　／　推奨解像度：1800×1800　／　保存先：`public/images/photos/dining-food-01.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: plated Japanese dish — 看板メニュー1品. Composition: 真上または45度。皿の縁を少し切る。テーブルの素材感を残す. Lighting: 逆光〜サイド光で立体感。トップ光は避ける. Mood: シズル・温度; warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow. No people in frame. Location: 自社店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 1:1, high resolution (1800x1800).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：看板メニュー1品。構図：真上または45度。皿の縁を少し切る。テーブルの素材感を残す。光：逆光〜サイド光で立体感。トップ光は避ける。雰囲気：シズル・温度。人物は入れない。場所：自社店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 1:1、推奨解像度 1800×1800。
```

## 料理 02  `dining-food-02`

- 用途：/business/dining　／　比率：1:1　／　推奨解像度：1800×1800　／　保存先：`public/images/photos/dining-food-02.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: plated Japanese dish — 料理2品目（ドリンクやデザートでもよい）. Composition: 料理01と統一。皿の向き・余白を揃える. Lighting: 料理01と同一. Mood: 料理01と同一; warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow. No people in frame. Location: 自社店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 1:1, high resolution (1800x1800).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：料理2品目（ドリンクやデザートでもよい）。構図：料理01と統一。皿の向き・余白を揃える。光：料理01と同一。雰囲気：料理01と同一。人物は入れない。場所：自社店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 1:1、推奨解像度 1800×1800。
```

## 飲食店舗の外観  `dining-exterior`

- 用途：/business/dining　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/dining-exterior.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: storefront on a Japanese street — 店舗ファサード。看板・入口. Composition: 正面やや斜め。夕方のブルーアワーに店内の灯りが漏れる時間帯. Lighting: ブルーアワー（日没後15〜30分）. Mood: 灯り・誘い; warm Japanese izakaya / cafe mood, amber lighting, charcoal grill glow. No people in frame. Location: 自社店舗前. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：店舗ファサード。看板・入口。構図：正面やや斜め。夕方のブルーアワーに店内の灯りが漏れる時間帯。光：ブルーアワー（日没後15〜30分）。雰囲気：灯り・誘い。人物は入れない。場所：自社店舗前（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 採用メインビジュアル  `recruit-hero`

- 用途：/recruit　／　比率：21:9　／　推奨解像度：2800×1200　／　保存先：`public/images/photos/recruit-hero.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: a few Japanese staff members working together — 建設と店舗のメンバーが同じ空間にいる場面（現場・店舗の混成でもよい）. Composition: 引きで、人物は小さめに。空間の広さと人の関係を見せる. Lighting: 自然光. Mood: 開かれた・これから; calm, trustworthy corporate mood, muted warm neutrals with a hint of green. People: 複数名, natural, candid, not posing at the camera. Location: 本社オフィス、または店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 21:9, high resolution (2800x1200).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：建設と店舗のメンバーが同じ空間にいる場面（現場・店舗の混成でもよい）。構図：引きで、人物は小さめに。空間の広さと人の関係を見せる。光：自然光。雰囲気：開かれた・これから。人物：複数名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：本社オフィス、または店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 21:9、推奨解像度 2800×1200。
```

## 社員インタビュー 01  `interview-01`

- 用途：/recruit　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/interview-01.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 社員1名（施工管理）。現場または事務所で. Composition: ウエストアップ。少しカメラから視線を外した自然な表情も撮る. Lighting: 自然光. Mood: 自然体; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: 本人の職場. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：社員1名（施工管理）。現場または事務所で。構図：ウエストアップ。少しカメラから視線を外した自然な表情も撮る。光：自然光。雰囲気：自然体。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：本人の職場（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 社員インタビュー 02  `interview-02`

- 用途：/recruit　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/interview-02.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 社員1名（職人）。現場で. Composition: interview-01 と統一. Lighting: 現場の自然光. Mood: 自然体; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: 施工現場. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：社員1名（職人）。現場で。構図：interview-01 と統一。光：現場の自然光。雰囲気：自然体。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：施工現場（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```

## 社員インタビュー 03  `interview-03`

- 用途：/recruit　／　比率：3:2　／　推奨解像度：2400×1600　／　保存先：`public/images/photos/interview-03.jpg`

**English prompt**

```text
Photorealistic editorial photograph for a Japanese construction and restaurant company website. Subject: portrait of a single Japanese professional — 社員1名（店舗スタッフ）。店舗で. Composition: interview-01 と統一. Lighting: 店内の光. Mood: 自然体; clean, neutral, quietly premium. People: 1名, natural, candid, not posing at the camera. Location: 自社店舗. Setting is in Japan; signage, architecture and details should look Japanese. Style: shot on a full-frame camera, 35mm or 50mm lens, shallow depth of field where appropriate, natural color grading, no text, no logos, no watermarks, no stock-photo smiles. aspect ratio 3:2, high resolution (2400x1600).
```

**日本語プロンプト**

```text
日本の建設会社・飲食店のコーポレートサイト用の、写実的なエディトリアル写真。被写体：社員1名（店舗スタッフ）。店舗で。構図：interview-01 と統一。光：店内の光。雰囲気：自然体。人物：1名。カメラ目線の作り笑顔ではなく、自然な動作の中で。場所：自社店舗（日本国内の設定。看板や建物の細部も日本らしく）。文字・ロゴ・透かしは入れない。ストックフォト的な演出は避ける。アスペクト比 3:2、推奨解像度 2400×1600。
```
