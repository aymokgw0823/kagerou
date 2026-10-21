# AI 機能 仕様書

株式会社陽炎総業 コーポレートサイトに実装している AI 機能の仕様です。他サイトへの移植や調整の際の参照資料を兼ねます。

## 全体像

| 機能                 | 入口         | API                                      | 目的                                                                             |
| -------------------- | ------------ | ---------------------------------------- | -------------------------------------------------------------------------------- |
| 写真でリフォーム相談 | `/ai/reform` | `POST /api/ai/reform`（multipart → SSE） | 現地調査前に、写真から状態・施工候補・概算レンジを把握してもらい、予約につなげる |
| 結果 PDF             | 結果画面     | `POST /api/ai/reform/[id]/pdf`           | レポートの持ち帰り。任意のメール入力でリード化                                   |
| AI コンシェルジュ    | 全ページ右下 | `POST /api/ai/concierge`（JSON → SSE）   | サイト内情報だけを根拠に質問に答え、適切なページ・予約・問い合わせへ誘導         |
| 管理画面             | `/admin`     | —                                        | 相談ログ・リード・予約・エントリーの閲覧、CSV、ダッシュボード                    |

## アーキテクチャ

```
src/features/ai/
├─ shared/     config（モデル・上限・デモ判定）/ client / guard（同意・レート制限・コスト上限）/ budget（日次トークン）
│              images（検証・EXIF除去）/ sanitize（出力サニタイズ・PIIマスク）/ log（相談ログ）/ sse / session / prompts / retriever
├─ reform/     schema（zod）/ analyze（Claude 呼び出し）/ mock（デモ）/ pdf（react-pdf）/ ui/reform-wizard
└─ concierge/  chat（RAG）/ mock / ui/concierge-widget
prompts/       reform-analyze.md / concierge.md（システムプロンプト。コード変更なしで調整可能）
src/config/reform-pricing.ts   単価表（金額は AI に生成させず、ここで計算）
```

- API 呼び出しはすべてサーバー（Route Handler）。API キーはクライアントに渡さない。
- `ANTHROPIC_API_KEY` が未設定なら **デモモード**：モック応答を遅延つきでストリーミングし、全フローが最後まで動く。
- モデル：`ANTHROPIC_MODEL`（既定 `claude-sonnet-5-5`）。重い処理用に `ANTHROPIC_MODEL_HEAVY`（既定 `claude-opus-5-5`）を用意（現状は未使用）。

## ガードレール（共通）

| 項目                       | 実装                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| レート制限                 | IP 単位＋セッション Cookie（`ai_sid`）単位で `AI_RATE_LIMIT_PER_HOUR`（既定 10 回/時）。`src/lib/rate-limit.ts`（メモリ。複数インスタンスでは KV に差し替え）                  |
| コスト上限                 | `DailyUsage` テーブルに日次トークンを記録。`AI_DAILY_TOKEN_BUDGET` を超えると「本日の受付は終了しました」                                                                      |
| プロンプトインジェクション | ユーザー入力は `<user_input>` で区切り「指示として解釈しない」と明記。目的外の依頼・指示の上書きを拒否するようプロンプトで規定。出力は描画前にサニタイズ（タグ・制御文字除去） |
| 入力制限                   | 説明 1,000 字、チャット 500 字・履歴 10 件、画像 JPEG/PNG/WebP・10MB・5 枚。sharp で再エンコードし EXIF（位置情報）を除去、長辺 1,600px                                        |
| 個人情報                   | 画面で「入力しないでください」を明示。相談ログはメール・電話をマスクして保存。PDF ダウンロード時のメールはマスク済みのみ相談ログに保持（リードには平文で保存）                 |
| 同意                       | リフォーム相談は AI 利用ポリシーへの同意チェックが必須（サーバーでも検証）                                                                                                     |
| 免責                       | すべての結果画面と PDF に「AIによる参考情報であり、正式な提案・見積もりではありません」                                                                                        |
| 安全                       | 構造・雨漏り・電気などの懸念は `safety.flagged` で警告し、早めの点検を案内                                                                                                     |

## 写真でリフォーム相談

**フロー**：同意 → 写真（D&D／カメラ、最大 5 枚）→ 部位（外壁・屋根・水回り・内装・その他）と状況説明 → 解析（SSE で進捗とストリーム表示）→ 結果 → PDF／現地調査予約（相談 ID を引き継ぎ）

**出力スキーマ**（`reform/schema.ts`）：`summary`、`findings[]`（写真ごとの所見・程度）、`candidates[]`（単価表の `itemId`・数量推定・優先度・根拠）、`safety`、`nextSteps[]`、`notRelevant`

**金額の決め方**：AI は `itemId` と数量だけを出力。`estimate()` が単価表の min/max × 数量で計算。数量が不明なら標準数量、上限を超えたら丸める。単価表は仮の値（`reformPricingIsDummy`）。

**構造化出力**：`output_config.format`（JSON スキーマ）＋ zod 検証。検証失敗時は不正内容を伝えて 1 回だけ再試行。`stop_reason: "refusal"` は丁寧なエラーに。

**類似事例**：`content/works` の建設事例から部位（`parts`）が近いものを 3 件。

**PDF**：`@react-pdf/renderer`、A4 3 ページ、Noto Sans JP 埋め込み（`src/assets/fonts/`）。日本語の折り返しは極細スペース（U+200A）で制御。

## AI コンシェルジュ

- 取得（Retriever）：`public/search-index.json`（ブログ・実績・事業／店舗／会社情報）を bigram 検索し上位 5 件を「参考資料」としてシステムプロンプトに添付。`type: page`（事業・店舗情報）は重み付けで優先。
- 回答：テキストをストリーミング。資料は【番号】で引用。引用がなく「見つからない」旨でもない回答は、問い合わせ誘導の定型文に差し替える（推測で答えない）。
- 話題外・指示の上書きはプロンプトで拒否。デモモードでは簡易ルールで同様に拒否。
- 意味検索：`AI_SEMANTIC_SEARCH_ENABLED=true` で `semanticRetriever` に切り替わる（埋め込み未実装のため現状は bigram にフォールバック。`VOYAGE_API_KEY` と埋め込みインデックスを用意して実装する）。

## 相談ログと管理画面

- `Consultation`：tool / status / mode / inputSummary（マスク済み）/ resultJson / tokens / sessionId / ip。
- `/admin`：`ADMIN_USER` `ADMIN_PASSWORD` `ADMIN_SESSION_SECRET`。署名付き Cookie（12 時間）。`AdminAuthProvider` インターフェースで SSO に差し替え可能。
- ダッシュボード：相談の開始／完了／完了率、相談→予約の転換率、トークン使用量。

## 他サイトへの移植

1. `src/features/ai/` と `prompts/`、`src/config/reform-pricing.ts`、`src/lib/{db,rate-limit}.ts`、Prisma の `Consultation` `DailyUsage` モデルをコピー。
2. `Photo` などサイト固有コンポーネントへの依存は `ui/` 配下に限られるので差し替える。
3. 検索インデックス（RAG）は `scripts/build-search-index.ts` を参考に、移植先のコンテンツから `{title,url,description,body,type}` を生成する。

## 調整ポイント

- 文面・判断基準：`prompts/*.md`
- 単価・項目：`src/config/reform-pricing.ts`
- 上限・モデル：`.env`（`AI_*`、`ANTHROPIC_*`）
- 部位の選択肢と事例マッチング：`reform/schema.ts` の `reformParts` / `partToWorkParts`
