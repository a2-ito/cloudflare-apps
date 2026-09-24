# 最安値メモ (price-tracker)

商品ごとに店舗別の価格を記録し、容量あたりの単価で最安値を比較する個人用 Web アプリ。

- Next.js 16 (App Router) + [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) → Cloudflare Workers
- D1 (Drizzle ORM) / R2（商品画像）
- Auth.js v5 + Google ログイン。`ALLOWED_EMAILS` に載せたアカウントだけ利用可

## 機能

- 商品の登録・編集・削除（メーカー・容量・入数・画像・カテゴリ）
- カテゴリの追加・変更・削除
- 店舗ごとの価格記録（価格・個数・日付・リンク・写真・メモ）と、その編集・削除
- 単価（g / ml は 100 あたり、それ以外は 1 あたり）で最安値を自動判定して一覧表示
- カテゴリ絞り込み・商品名検索

容量と入数は商品が持つ。350ml × 6 缶のようなパッケージは、1 個あたり 350ml・入数 6 として登録し、
合計 2,100ml で単価を出す。同じ製品でも荷姿（1000ml と 3000ml など）が違えば別の商品として登録する。
まとめ買いの割安さで大容量が常に勝ってしまい、同じ荷姿どうしの比較ができなくなるのを避けるため。
- 配色の切り替え（ライト / ダーク / システム追従）。選択は端末に保存し、描画前に適用するのでリロード時もちらつかない
- 画像はブラウザ側で長辺 1200px に縮小してから R2 に保存

### 画像の配信

画像は R2 のカスタムドメインから CDN が直に返す。Worker を経由しない。

以前は Worker 上の Route Handler (`/api/images`) が認証を確かめてから R2 を読んでいた。
ただしトップページが商品数ぶんのサムネイルを並べるため、一覧を 1 回開くだけで商品数ぶんの
Worker が起動し、その全てで Auth.js のセッション復号が走っていた。

**引き換えに、画像は URL を知っていれば認証なしで取得できる。** キーが UUID v4 で推測できない
ことに依存している。バケットの一覧は公開されないため列挙もできない。商品名・価格・履歴は D1 に
あり、今まで通り認証の内側にある。

配信の基底 URL は `NEXT_PUBLIC_IMAGES_BASE_URL` で渡す。`imageUrl()` はクライアント
コンポーネントからも呼ぶため `NEXT_PUBLIC_` 付きで、`next build` 時に値が埋め込まれる。
実行時の環境変数では差し替わらないので、変えたら再ビルドが要る。

手元では画像が Miniflare のローカル R2 に入り、カスタムドメインからは取れない。そのため
基底 URL が無いときに限り `/api/images` へ落ちる。`src/app/api/images/[...key]/route.ts`
はこの開発用の経路で、本番では使われない。基底 URL を渡さないまま本番ビルドすると、
気づかないうちに Worker 経由へ戻るのを避けるため `imageUrl()` は例外を投げる。

## CI / CD

Pull Request を作ると GitHub Actions で lint・型チェック・テスト・ビルドが走る。

自分が出した PR には自動マージが予約され、検証が通りしだい squash でマージされる。

fork からの PR と、リポジトリ所有者以外が出した PR は対象外にしている。外部の変更が
人の目を通さず本番へ出るのを防ぐため。あわせて、外部からの PR は検証の実行自体に
承認を必要とする設定にしている。

下書きの PR も対象外なので、まだ入れたくないものは Draft にしておく。

デプロイは Cloudflare の [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) が担う。
main への push を Cloudflare が検知し、ビルドしてデプロイする。GitHub 側にデプロイ用の
認証情報は置かない。

Workers Builds の設定は Cloudflare ダッシュボードの **Settings > Build** で行う。
モノレポなので **root directory にこのアプリのディレクトリを指す**。Worker 名は
そこに置かれた Wrangler 設定の `name` と一致していなければビルドが落ちる。

| 項目 | 値 |
| --- | --- |
| Root directory | `apps/price-tracker` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run cf:deploy` |
| Git branch | `main` |
| Build watch paths | `apps/price-tracker/*`、`package-lock.json` |
| Build variables | `D1_DATABASE_ID`, `APP_HOSTNAME`, `NEXT_PUBLIC_IMAGES_BASE_URL` |

`wrangler.jsonc` は追跡していないため、`npm run cf:config` が雛形のプレースホルダを
これらの変数で埋めて生成する。手元に `wrangler.jsonc` がある場合は上書きしない。

`@emnapi/core` と `@emnapi/runtime` は直接使わないが、Tailwind の wasm パッケージが
要求する版が lock に記録されず `npm ci` が同期エラーになるため、明示的に依存へ加えている。

スキーマ変更は自動適用しない。`npm run db:migrate:remote` を手で流してからマージする。

## セットアップ

依存はリポジトリ直下でまとめて入れる。lockfile はルートに 1 つしかないため、
このディレクトリで `npm ci` は通らない。

### 1. Google OAuth クライアントの作成

[Google Cloud Console](https://console.cloud.google.com/apis/credentials) で OAuth 2.0 クライアント ID（ウェブアプリケーション）を作成し、承認済みリダイレクト URI に以下を登録する。

- `http://localhost:3000/api/auth/callback/google`（ローカル開発）
- `https://<公開ホスト名>/api/auth/callback/google`（本番）

### 2. ローカル環境変数

```sh
cp wrangler.jsonc.example wrangler.jsonc   # __D1_DATABASE_ID__ と __APP_HOSTNAME__ を書き換える
cp .dev.vars.example .dev.vars
openssl rand -base64 32   # AUTH_SECRET に貼る
```

`.dev.vars` に `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` / `ALLOWED_EMAILS` を記入する。

### 3. ローカル DB のマイグレーション

```sh
npm run db:migrate:local
```

### 4. 開発サーバ

```sh
npm run dev        # next dev（bindings は miniflare 経由で利用可）
npm run preview    # Workers ランタイムで実行して確認
```

## テスト

```sh
npm test             # Vitest 一括実行
npm run test:watch
npm run typecheck    # next typegen + tsc
npm run lint
```

DB / R2 を使うテストは Miniflare（workerd）上の本物の D1 / R2 を起動し、`drizzle/` のマイグレーション SQL をそのまま適用する。
サーバーアクションは認証・Cloudflare コンテキスト・`revalidatePath` / `redirect` だけをモックして実行する。

## デプロイ

```sh
# 初回のみ: Secrets を登録（値はリポジトリに含めない）
npx wrangler secret put AUTH_SECRET          # openssl rand -base64 32 で生成
npx wrangler secret put AUTH_GOOGLE_ID
npx wrangler secret put AUTH_GOOGLE_SECRET
npx wrangler secret put ALLOWED_EMAILS       # 許可するメールをカンマ区切りで

npm run db:migrate:remote
npm run deploy
```

## スキーマ変更

`src/db/schema.ts` を編集して以下を実行する。

```sh
npm run db:generate          # drizzle/ に SQL を生成
npm run db:migrate:local
npm run db:migrate:remote
```

## リソース

| 種別 | 名前 |
| --- | --- |
| Worker | `price-tracker` |
| D1 | `price-tracker-db` |
| R2 | `price-tracker-images`（カスタムドメインを生やして公開配信） |
| ビルド | Cloudflare Workers Builds |

ログインを許可するアカウントを増やすときは、`ALLOWED_EMAILS` の Secret を
カンマ区切りで登録し直してから再デプロイする。

```sh
npx wrangler secret put ALLOWED_EMAILS
npm run deploy
```
