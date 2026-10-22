# 写真クレジット

サイトの写真は、飲食事業（鉄板居酒屋 陽炎）のカットは自社店舗の公式サイト https://teppan-kagero.com/ の写真を、それ以外は Pexels（https://www.pexels.com/license/ ：商用・個人利用とも無料、クレジット表記は任意）の素材を使用しています。
取り込みは `npm run photo:import`（比率に合わせた中央トリミング・EXIF 除去）。実際の撮影写真に差し替える場合は `docs/shot-list.md` を参照。

| ID | 用途 | 出典（Pexels） |
|---|---|---|
| `ceo-portrait` | 代表ポートレート | https://www.pexels.com/photo/17049766/ |
| `ceo-at-work` | 代表：仕事風景 | https://www.pexels.com/photo/17049665/ |
| `officer-01` | 役員ポートレート 01 | https://www.pexels.com/photo/16963942/ |
| `officer-02` | 役員ポートレート 02 | https://www.pexels.com/photo/8278980/ |
| `officer-03` | 役員ポートレート 03 | https://www.pexels.com/photo/28446973/ |
| `office-exterior` | オフィス外観 | https://www.pexels.com/photo/19888190/ |
| `office-interior` | オフィス内観 | https://www.pexels.com/photo/22718136/ |
| `office-working` | 執務風景 | https://www.pexels.com/photo/7845344/ |
| `kv-build` | キービジュアル：建設 | https://www.pexels.com/photo/36153946/ |
| `build-site-wide` | 建設現場（引き） | https://www.pexels.com/photo/2209529/ |
| `build-before` | 施工事例：ビフォー | https://www.pexels.com/photo/804392/ |
| `build-after` | 施工事例：アフター | https://www.pexels.com/photo/9908376/ |
| `kv-dining` | キービジュアル：飲食 | 自社店舗（teppan-kagero.com） |
| `dining-interior` | 飲食店舗の内観 | 自社店舗（teppan-kagero.com） |
| `dining-food-01` | 料理 01（看板メニュー） | 自社店舗（teppan-kagero.com） |
| `dining-food-02` | 料理 02 | 自社店舗（teppan-kagero.com） |
| `dining-exterior` | 飲食店舗の外観 | 自社店舗（teppan-kagero.com） |
| `dining-food-03` | 料理 03 | 自社店舗（teppan-kagero.com） |
| `dining-private-room` | 飲食店舗の個室 | 自社店舗（teppan-kagero.com） |
| `recruit-hero` | 採用メインビジュアル | https://www.pexels.com/photo/4956918/ |
| `interview-01` | 社員インタビュー 01 | https://www.pexels.com/photo/34670925/ |
| `interview-02` | 社員インタビュー 02 | https://www.pexels.com/photo/5974012/ |
| `interview-03` | 社員インタビュー 03 | https://www.pexels.com/photo/4350094/ |

店舗ロゴ `public/images/brand/teppan-kagero-logo.png` も同店公式サイトのもの。コーポレートのシンボルマークは `src/lib/brand/mark.ts` で SVG として作成（`npm run build:icons` で favicon 等を生成）。
