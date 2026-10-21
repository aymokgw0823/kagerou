# 株式会社陽炎総業 コーポレートサイト

建設事業と飲食事業を営む会社のコーポレートサイト。タグラインは「つくる。営む。」。
要件定義は [`CLAUDE.md`](./CLAUDE.md)、AI 機能の仕様は [`docs/ai-features.md`](./docs/ai-features.md)。

## 技術スタック

Next.js 16（App Router / Cache Components）・TypeScript・Tailwind CSS 4・motion・React Three Fiber・MDX・Prisma 7（SQLite / PostgreSQL）・@anthropic-ai/sdk・@react-pdf/renderer・Vitest・Playwright

## セットアップ

```bash
npm install                 # postinstall で prisma generate
cp .env.example .env.local  # すべて任意。未設定でもデモモードで動く
npx prisma migrate dev      # dev.db を作成
npm run dev                 # http://localhost:3000（predev で検索インデックス生成）
```

## 環境変数

`.env.example` に全変数をコメント付きで列挙しています。主なもの：

| 変数                                                                   | 用途                                           |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                 | 本番 URL（canonical・OGP・sitemap・JSON-LD）   |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` / `ANTHROPIC_MODEL_HEAVY`      | AI 機能。キー未設定ならデモモード              |
| `AI_DAILY_TOKEN_BUDGET` / `AI_RATE_LIMIT_PER_HOUR`                     | コスト上限・レート制限                         |
| `DATABASE_URL`                                                         | `file:./dev.db`（SQLite）または `postgres://…` |
| `MAIL_FROM` / `MAIL_TO_CONTACT` / `MAIL_TO_RECRUIT` / `RESEND_API_KEY` | メール。キー未設定ならコンソール出力           |
| `ADMIN_USER` / `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`               | 管理画面                                       |
| `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID`                            | 計測（Cookie 同意後に読み込み）                |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`              | CAPTCHA（任意）                                |
| `NEXT_PUBLIC_BOOKING_EMBED_URL`                                        | 外部日程調整サービスの埋め込み（任意）         |

## スクリプト

| コマンド                                         | 内容                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `npm run dev` / `npm run build` / `npm start`    | 開発 / 本番ビルド（`prebuild` で検索インデックス生成と `check:dummy`）/ 本番起動  |
| `npm run check`                                  | lint ＋ typecheck ＋ ユニットテスト                                               |
| `npm run test:e2e`                               | Playwright E2E（**`npm run build` 後に実行**。`E2E_BASE_URL` で対象を切り替え可） |
| `npm run check:dummy` / `npm run check:dummy:md` | 差し替えが必要な箇所の一覧 / `docs/replace-checklist.md` を生成                   |
| `npm run gen:placeholders`                       | 写真マニフェストからダミー画像と撮影指示書 `docs/shot-list.md` を生成             |
| `npm run seed:articles`                          | 300 本のダミー記事を再生成（実運用では使わない）                                  |
| `npm run build:search-index`                     | ブログ・実績・事業情報の検索インデックスを生成                                    |
| `npm run db:migrate` / `npm run db:studio`       | Prisma のマイグレーション / GUI                                                   |

## 会社情報の差し替え

`src/config/company.ts` だけを編集します。未確定値は `PLACEHOLDER`（【要差し替え】）のままにしておくと画面で目立ち、`check:dummy` が検出します。年商・従業員数などの数値は事実が確定するまで `null` のまま（画面に出ません）。事業の定義は `src/config/businesses.ts`、サイト名・ナビは `src/config/site.ts`。

## コンテンツの追加

| 種類             | 場所                        | スキーマ（`src/lib/content/schema.ts` ほか）                         |
| ---------------- | --------------------------- | -------------------------------------------------------------------- |
| ブログ記事       | `content/blog/<slug>.mdx`   | `blogFrontmatter`（分類は `src/lib/content/taxonomy.ts` が唯一の正） |
| 執筆者・監修者   | `content/authors/<id>.md`   | `authorFrontmatter`                                                  |
| 実績・事例       | `content/works/<slug>.mdx`  | `workFrontmatter`（本文は「## 課題」「## 施策」「## 成果」）         |
| ニュース         | `content/news/<slug>.mdx`   | `newsFrontmatter`（`pdf` で PDF 添付）                               |
| 募集職種         | `content/jobs/<slug>.mdx`   | `jobFrontmatter`（`src/lib/content/jobs.ts`）                        |
| 事業ページの文面 | `src/content/business/*.ts` | `BusinessDetail`                                                     |
| ポリシー         | `src/content/policies/*.ts` | `PolicyDoc`（公開前に専門家確認）                                    |

frontmatter はビルド時に zod で検証され、不正な値はエラーになります。取得ロジックは `src/lib/content/`（リポジトリパターン）。ヘッドレス CMS へ移行する場合はこの層だけを差し替えます。

## 写真の差し替え

1. 撮影指示書 `docs/shot-list.md` に沿って撮影
2. 写真を `public/images/photos/` に置く
3. `src/config/photo-manifest.ts` の該当カットに `src: "/images/photos/<file>.jpg"` を追加

画像は必ず `<Photo id="…" />` 経由で表示され、`next/image` で最適化されます。

## AI 機能の調整

- 文面・判断基準：`prompts/reform-analyze.md`、`prompts/concierge.md`
- 単価表：`src/config/reform-pricing.ts`（公開前に実勢価格へ）
- 上限・モデル：`.env`
- 詳細は `docs/ai-features.md`

## フォーム・DB

お問い合わせ／ご相談予約／採用エントリーはサーバーアクションで受け付け、`Lead` / `Booking` / `Entry` に保存します。honeypot ＋ IP レート制限、任意で Turnstile。履歴書は `uploads/`（git 管理外）。本番で PostgreSQL を使う場合は `prisma/schema.prisma` の `provider` を `"postgresql"` に変えて `npx prisma migrate deploy`。

## 本番デプロイ（Vercel）

1. リポジトリを Vercel にインポート（Framework: Next.js）。
2. 環境変数を設定（上記）。`DATABASE_URL` は PostgreSQL（Vercel Postgres / Neon など）。`NEXT_PUBLIC_SITE_URL` に本番 URL。
3. `prisma/schema.prisma` の `provider` を `postgresql` にし、`npx prisma migrate deploy` をデプロイ前（Build Command の先頭）に実行：`npx prisma migrate deploy && npm run build`。
4. 履歴書アップロードは `src/lib/storage.ts` を Vercel Blob などの実装に差し替える（既定はローカルディスク）。
5. レート制限は `src/lib/rate-limit.ts` の `RateLimitStore` を KV 実装に差し替えると複数インスタンスでも厳密になる。
6. 公開前に `npm run check:dummy:md` で `docs/replace-checklist.md` を更新し、すべて消化する。`CHECK_DUMMY_STRICT=1` でビルドを失敗させることもできる。

## フォント

Noto Sans JP（400/700）と Open Sans は `@fontsource` から `scripts/build-fonts.ts` が `public/fonts/`（git 管理外）に生成します。268 個の @font-face を含む CSS は描画をブロックしないよう、ページ描画後にアイドル時に読み込み（`src/components/layout/font-loader.tsx`）、`font-display: optional` で適用します。初回訪問は OS の和文ゴシック（Hiragino / Yu Gothic / Meiryo）で描画され、キャッシュ後は Noto Sans JP になります。常に Noto Sans JP で描画したい場合は `build-fonts.ts` の `optional` を `swap` に変え、`globals.css` から `/fonts/fonts.css` を `@import` してください（Lighthouse のモバイル Performance は下がります）。

## 品質

- `npm run check`（lint / typecheck / Vitest）、`npm run build`、`npm run test:e2e`
- セキュリティヘッダー（CSP など）は `next.config.ts`。静的生成と両立させるため CSP は nonce を使わず `'unsafe-inline'` を許可しています（開発時のみ `'unsafe-eval'` を追加）。
- Lighthouse（モバイル）：本番ビルドを `npm start -- -p 3100` で起動し、`npx lighthouse http://localhost:3100/ --form-factor=mobile --screenEmulation.mobile --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --chrome-flags="--headless=new"` で計測。2026-10-21 時点の計測：トップ 96 / ブログ 96 / 実績 98 / 建設 98 / リフォーム相談 98（Performance）、Accessibility 95〜97、Best Practices 96〜100、SEO 100。
