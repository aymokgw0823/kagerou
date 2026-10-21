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

## データベース・フォーム（Phase 4）

- Prisma 7 ＋ SQLite（開発）。初回は `npx prisma migrate dev` で `dev.db` を作成し、クライアントを生成する（`postinstall` でも `prisma generate` が走る）。
- 本番で PostgreSQL を使う場合：`prisma/schema.prisma` の `provider` を `"postgresql"` に変更し、`DATABASE_URL` に接続文字列を設定して `npx prisma migrate deploy`。`src/lib/db.ts` が URL からアダプター（pg / better-sqlite3）を自動選択する。
- お問い合わせ・ご相談予約・採用エントリーはサーバーアクションで受け付け、`Lead` / `Booking` / `Entry` テーブルに保存する。
- メールは `src/lib/mail.ts`。`RESEND_API_KEY` 未設定ならコンソールに出力（開発）、設定すると Resend で送信。
- スパム対策：honeypot（`website` 欄）＋ IP 単位のレート制限（`src/lib/rate-limit.ts`、既定はメモリ）。Cloudflare Turnstile は `TURNSTILE_SECRET_KEY` を設定すると有効。
- 履歴書は `uploads/`（git 管理外）に保存。Vercel 等では `src/lib/storage.ts` を Blob ストレージ実装に差し替える。
- 外部の日程調整サービスを使う場合は `NEXT_PUBLIC_BOOKING_EMBED_URL` を設定すると予約ページが埋め込みに切り替わる。

## AI 機能（Phase 5）

- `ANTHROPIC_API_KEY` 未設定 → **デモモード**（モック応答・遅延つきストリーミング）。設定すると Claude API で動作（モデルは `ANTHROPIC_MODEL`、既定 `claude-sonnet-5-5`）。
- モジュールは `src/features/ai/<tool>/` に独立（UI・API・スキーマ・モック）。共通基盤は `src/features/ai/shared/`（レート制限 IP＋セッション、日次トークン上限 `AI_DAILY_TOKEN_BUDGET`、画像の検証と EXIF 除去、出力サニタイズ、相談ログのマスキング、SSE）。
- **写真でリフォーム相談**（`/ai/reform`）：`POST /api/ai/reform`（multipart → SSE）。構造化出力（JSON スキーマ）を zod で検証し、失敗時は1回再試行。金額は `src/config/reform-pricing.ts` の単価表で計算（AI は項目と数量のみ推定）。PDF は `POST /api/ai/reform/[id]/pdf`（Noto Sans JP 埋め込み）。
- **AIコンシェルジュ**（全ページ右下）：`POST /api/ai/concierge`。`public/search-index.json`（ブログ・実績・事業／店舗情報）を bigram 検索して根拠にし、【番号】で引用。引用のない回答は問い合わせ誘導に差し替える。意味検索は `AI_SEMANTIC_SEARCH_ENABLED` で切り替え可能なインターフェースのみ。
- システムプロンプトは `prompts/*.md`。コードを変えずに調整できる。
- **管理画面**（`/admin`）：`ADMIN_USER` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` を設定してログイン。リード・相談ログ・予約・エントリーの一覧と CSV 出力、簡易ダッシュボード。

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
