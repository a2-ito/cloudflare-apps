# ワインログ (winelog)

飲んだワインの「銘柄・品種・値段・買った場所」と、軸ごとの評価・感想・写真を
1 本ずつ残していくメモアプリです。

公開 URL: https://winelog.a2ito.work （許可された Google アカウントのみログイン可）

## できること

- **記録** … 銘柄、生産者、収穫年、種別（赤 / 白 / ロゼ / スパークリング / オレンジ / 酒精強化 / デザート / その他）、
  品種（複数・ブレンド順）、国・産地、価格、購入場所と店の URL、飲んだ日、感想、写真（複数枚・拡大とダウンロード）
- **評価** … 総合 / 香り / 味 / 余韻 / コスパ の 5 軸をそれぞれ ★1〜5 で。付けなかった軸は表示しない
- **探す** … 銘柄・生産者・産地・購入場所・品種の横断検索と、種別 / 品種 / 総合評価での絞り込み。
  飲んだ日・総合評価・価格の 3 通りで並べ替え
- **未開栓** … 飲んだ日を空欄にすると「まだ開けていない」として一覧の末尾に置く

旅行のような上位のまとまりは持たない。1 本 = 1 レコードで、見返すときは検索と絞り込みで辿る。

## インストール（PWA）

ブラウザの「ホーム画面に追加」「アプリをインストール」から、単独のアプリとして
起動できる。iOS Safari は共有メニューの「ホーム画面に追加」から。

Service Worker は静的アセットとオフライン案内ページだけをキャッシュする。
記録はログインした本人にしか見せられないため、HTML と API はキャッシュしない。

アイコンと `src/app/favicon.ico` は `node scripts/gen-icons.mjs` で生成する
（画像ライブラリには依存しない）。

## 技術構成

| 領域 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router / Server Actions) |
| 実行環境 | Cloudflare Workers (OpenNext) |
| DB | Cloudflare D1 + Drizzle ORM |
| 写真 | Cloudflare R2 |
| 認証 | Auth.js (next-auth v5) + Google OAuth + 許可メールリスト |
| UI | Tailwind CSS v4 |
| テスト | Vitest + Miniflare（本物の D1 / R2 を起動して検証） |

## 設計メモ

- **価格は最小通貨単位の整数で保存する**（`price_minor`）。浮動小数の誤差を持ち込まないため。
  通貨ごとの小数桁数は `src/lib/money.ts` が持つ。国内で買うことが多いので既定は円だが、
  旅行先や輸入元の値段をそのまま残せるよう通貨も選べる。価格が空なら通貨も残さない。
- **評価の軸は `src/lib/ratings.ts` に 1 か所だけ持つ**。DB の列 `rating_<軸>`、フォームの
  入力欄、詳細画面の表示をすべてこの一覧から組み立てる。軸を足すときはここと
  `src/db/schema.ts` を直す。未評価は `null`（0 は「未評価」としてフォームから来る値）。
- **品種は別テーブル**（`wine_grapes`）。1 本に複数入るブレンドが普通で、品種での
  絞り込みもこの表を引くため。入力はカンマ区切り 1 欄で受け、`src/lib/grapes.ts` で分解する。
  書いた順がそのまま表示順になる。
- **日付は 2 種類に分けている**。`drunk_at` は飲んだ日（`2026-09-23`）でタイムゾーン変換を
  せず保持し、`created_at` / `updated_at` は監査用の UTC。`drunk_at` が `null` は
  「まだ開けていない」を意味し、一覧では末尾に置く（日付の前後で並べようがないため）。
- **種別は `src/lib/wine-types.ts` に 1 か所だけ持つ**。保存する値・フォームの選択肢・
  一覧の絞り込みで同じ並びを使う。保存済みの記録に知らない種別が残っていても行が
  空にならないよう、表示はそのまま出す。
- **店の URL は https のものだけ受ける**（`src/lib/shop-url.ts`）。買う先は実店舗とは限らず
  通販サイトも入るのでホストは絞らないが、貼られた文字列をそのままリンクにすると
  `javascript:` を踏ませられるため、形を検証してから保存する。表示されるホストと
  飛び先が食い違う `user:pass@` 付きの URL も弾く。
- **写真の実体は R2**、DB にはキーのみ。外部キーの cascade では R2 は消えないので、
  削除時はアクション側でキーを集めてから消す。
- **`wrangler.jsonc` は追跡していない**（実 ID と公開ホスト名を含むため）。
  雛形 `wrangler.jsonc.example` から `npm run cf:config` で生成する。

## セットアップ

このアプリはモノレポ [cloudflare-apps](../../README.md) の一部。**依存はリポジトリ
直下でまとめて入れる**（lockfile はルートに 1 つしかないため、このディレクトリで
`npm ci` は通らない）。

```bash
# リポジトリ直下で
npm ci

# 以降はこのディレクトリで

# 環境変数
cp .dev.vars.example .dev.vars
# AUTH_SECRET は openssl rand -base64 32 で生成
# AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET は Google Cloud Console で発行
# ALLOWED_EMAILS にログインを許可するメールアドレスをカンマ区切りで記入

# wrangler.jsonc を生成（D1 の ID と公開ホスト名を渡す）
D1_DATABASE_ID=<your-d1-id> APP_HOSTNAME=winelog.example.com npm run cf:config

# ローカル D1 にマイグレーションを適用
npm run db:migrate:local

npm run dev
```

Google OAuth の承認済みリダイレクト URI には以下を登録します。

- `http://localhost:3000/api/auth/callback/google`（ローカル）
- `https://<公開ホスト名>/api/auth/callback/google`（本番）

## よく使うコマンド

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバ |
| `npm test` | テスト（Miniflare で D1 / R2 を起動） |
| `npm run lint` / `npm run typecheck` | 静的チェック |
| `npm run db:generate` | スキーマ変更からマイグレーション SQL を生成 |
| `npm run db:migrate:local` / `:remote` | マイグレーション適用 |
| `npm run preview` | Workers ランタイムでローカル確認 |
| `npm run cf:deploy` | Cloudflare へデプロイ |

## CI / CD

Pull Request を作ると GitHub Actions で lint・型チェック・テスト・ビルドが走る。

自分が出した PR には自動マージが予約され、検証（`quality` と `build`）が通りしだい
squash でマージされる。main は保護しており、この 2 つのチェックを通らないと
マージできない。

## デプロイ

main への push を Cloudflare の [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
が検知し、ビルドしてデプロイする。GitHub 側にデプロイ用の認証情報は置かない。
設定は Cloudflare ダッシュボードの **Settings > Build** で行う。

| 項目 | 値 |
| --- | --- |
| Root directory | `apps/winelog` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run db:migrate:remote && npm run cf:deploy` |
| Git branch | `main` |
| Build variables | `D1_DATABASE_ID`, `APP_HOSTNAME` |

`wrangler.jsonc` は追跡していないため、`npm run cf:config` が雛形のプレースホルダを
これらの変数で埋めて生成する。手元に `wrangler.jsonc` がある場合は上書きしない。

### スキーマ変更の進め方

マイグレーションは deploy command の先頭で適用されるので、手で流す必要はない。
`&&` で繋いでいるため、適用に失敗したらデプロイも行われず、古いコードが動き続ける。

ただし**適用からデプロイ完了までの数分間は「新しいスキーマ + 古いコード」が同時に
存在する**。この間に本番が壊れないよう、カラムやテーブルを消す変更は 2 回に分けて出す
（expand / contract）。

### 手元からデプロイする場合

```bash
# 初回のみ: リソース作成
npx wrangler d1 create winelog-db
npx wrangler r2 bucket create winelog-photos

# 初回のみ: シークレット登録
npx wrangler secret put AUTH_SECRET
npx wrangler secret put AUTH_GOOGLE_ID
npx wrangler secret put AUTH_GOOGLE_SECRET
npx wrangler secret put ALLOWED_EMAILS

npm run db:migrate:remote
npm run cf:deploy
```
