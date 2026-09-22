# cloudflare-apps

Cloudflare Workers で動く Next.js アプリをまとめたモノレポ。

アプリごとにリポジトリを分けていたが、スタックが同一なのに依存の更新も CI の
設定も人数ぶんではなくリポジトリぶん必要になっていた。1 つにまとめて、
セキュリティ対応と標準化を 1 回で済ませる。

## アプリ一覧

| アプリ | 本番 | Worker | 概要 |
| --- | --- | --- | --- |
| [price-tracker](apps/price-tracker) | https://price-tracker.a2ito.work | `price-tracker` | 店舗ごとの価格を容量あたりの単価で比較する最安値メモ |

## 使い方

依存はルートで一度だけ入れる。`node_modules` は workspaces がルートへ巻き上げる。

```bash
npm install
```

アプリ 1 つに対してスクリプトを流すときは `-w` でワークスペースを指定する。

```bash
npm run dev -w apps/price-tracker
npm run build -w apps/price-tracker
```

全アプリに対して流すものはルートに用意してある。

```bash
npm run lint
npm run test
npm run typecheck
```

## デプロイ

Cloudflare Workers Builds が main への push で動く。設定はダッシュボードの
**Workers & Pages > 各 Worker > Settings > Builds** にあり、リポジトリには
残らないため、ここに控えておく。

| 項目 | 値 |
| --- | --- |
| Repository | `a2-ito/cloudflare-apps` |
| Branch | `main` |
| Root directory | `apps/<name>` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run cf:deploy` |
| Build watch paths | `apps/<name>/*`、`package-lock.json` |

**ルートディレクトリはアプリのディレクトリを指す。** Worker 名は、そこに置かれた
Wrangler 設定の `name` と一致していなければビルドが落ちる。

**build watch paths に `package-lock.json` を含める。** アプリ配下だけを見ていると、
依存をまとめて更新したときに再デプロイされない。

アプリを追加したら、その Worker にも同じ設定を入れる。入れ忘れると、
リポジトリは繋がっているのにデプロイだけ起きないという状態になる。

## スキーマ変更

**D1 のマイグレーションは自動適用しない。** merge する前に手で流す。

```bash
npm run db:migrate:remote -w apps/price-tracker
```

どのアプリの D1 を触っているかがコマンドに出るので、取り違えにくい。
データ移行を伴う場合は先に `wrangler d1 export --remote` で控えを取る。

## wrangler.jsonc

実 ID と公開ホスト名を含むため追跡していない。各アプリの
`wrangler.jsonc.example` を雛形として使う。
