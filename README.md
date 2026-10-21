# グループ企業コーポレートサイト

建設事業と飲食事業を展開する会社のコーポレートサイト（タグライン「つくる。営む。」）。
要件定義は [`CLAUDE.md`](./CLAUDE.md) を参照。

> このREADMEは Phase 1 時点の暫定版です。Phase 6 で本番デプロイ手順・AI機能の調整方法などを追記します。

## セットアップ

```bash
npm install
cp .env.example .env.local   # すべて任意。未設定でもデモモードで動作
npm run dev
```

## スクリプト

| コマンド                                              | 内容                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`                                         | 開発サーバー                                                                         |
| `npm run build`                                       | 本番ビルド（`prebuild` で `check:dummy` が自動実行され、差し替え漏れを警告）         |
| `npm run lint` / `npm run typecheck` / `npm run test` | ESLint／型チェック／Vitest                                                           |
| `npm run check`                                       | 上記3つをまとめて実行                                                                |
| `npm run check:dummy`                                 | 【要差し替え】・`isDummy`・ダミー画像の残りを一覧表示（`-- --strict` で終了コード1） |
| `npm run gen:placeholders`                            | 写真マニフェストからダミー画像と撮影指示書（`docs/shot-list.md`）を生成              |
| `npm run format`                                      | Prettier                                                                             |

## 会社情報の差し替え

`src/config/company.ts` だけを編集する。未確定値は `PLACEHOLDER`（【要差し替え】）のまま入れておくと、画面で目立つ表示になり `check:dummy` が検出する。
数値実績（年商・従業員数など）は確定するまで `null` のままにする（`null` の項目は画面に出ない）。

## コンテンツの追加（Phase 3）

| 種類           | 場所                       | スキーマ                                                     |
| -------------- | -------------------------- | ------------------------------------------------------------ |
| ブログ記事     | `content/blog/<slug>.mdx`  | `src/lib/content/schema.ts` の `blogFrontmatter`             |
| 執筆者・監修者 | `content/authors/<id>.md`  | `authorFrontmatter`                                          |
| 実績・事例     | `content/works/<slug>.mdx` | `workFrontmatter`（本文は「## 課題」「## 施策」「## 成果」） |
| ニュース       | `content/news/<slug>.mdx`  | `newsFrontmatter`（`pdf` でプレスリリースPDFを添付）         |

- 分類（事業・カテゴリー・業種・課題・難易度）は `src/lib/content/taxonomy.ts` が唯一の正。frontmatter はビルド時に zod で検証され、不正な値はエラーになる。
- `npm run seed:articles` で 300 本のダミー記事を再生成できる（既存の `content/blog` を削除して生成）。
- 検索インデックス `public/search-index.json` は `predev` / `prebuild` で自動生成される（手動は `npm run build:search-index`）。
- 取得ロジックは `src/lib/content/`（リポジトリパターン）。ヘッドレスCMSへ移行する場合はこの層だけを差し替える。

## 写真の差し替え

1. 撮影指示書 `docs/shot-list.md` に沿って撮影する
2. 写真を `public/images/photos/` に置く
3. `src/config/photo-manifest.ts` の該当カットに `src: "/images/photos/<file>.jpg"` を追加する

## ディレクトリ

```
src/config/     company / businesses / site / i18n / photo-manifest
src/styles/     tokens.css（デザイントークンの唯一の正）
src/components/ layout（header / footer / breadcrumbs）・ui・theme
scripts/        check-dummy / generate-placeholders
docs/           shot-list.md（自動生成）
```
