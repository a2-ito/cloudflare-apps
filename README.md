# cloudflare-apps

Cloudflare Workers で動く Next.js アプリをまとめたモノレポ。

アプリごとにリポジトリを分けていたが、スタックが同一なのに依存の更新も CI の
設定も人数ぶんではなくリポジトリぶん必要になっていた。1 つにまとめて、
セキュリティ対応と標準化を 1 回で済ませる。

## アプリ一覧

| アプリ | 本番 | Worker | 概要 |
| --- | --- | --- | --- |
| [price-tracker](apps/price-tracker) | https://price-tracker.a2ito.work | `price-tracker` | 店舗ごとの価格を容量あたりの単価で比較する最安値メモ |
| [tabilog](apps/tabilog) | https://tabilog.a2ito.work | `tabilog` | 旅先の食事・買い物を記録して振り返る旅行メモ |
| [account-book](apps/account-book) | https://account-book.a2ito.work | `account-book` | グループ単位で管理する家計簿 |
| [exam-lab](apps/exam-lab) | https://exam-lab.a2ito.work | `exam-lab` | 資格試験の問題を管理・学習する |
| [warikan](apps/warikan) | https://warikan.a2ito.work | `warikan` | ログイン不要の割り勘。最小回数で自動精算する |
| [wordle](apps/wordle) | https://wordle.a2ito.work | `wordle` | ブラウザで遊ぶ Wordle |
| [number-logic](apps/number-logic) | https://number-logic.a2ito.work | `number-logic` | 数独ベースのロジックパズル |
| [dev-toolbox](apps/dev-toolbox) | https://dev-toolbox.a2ito.work | `dev-toolbox` | パスワード生成や Unix time 変換などの開発者向けユーティリティ |
| [planning-porker](apps/planning-porker) | https://planning-porker.a2ito.work | `planning-porker` | チーム見積り用のプランニングポーカー |

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

## ルートの依存

`esbuild` はどのアプリも直接使わないが、ルートの `devDependencies` に置いている。

`@opennextjs/cloudflare` は `esbuild` を import するのに依存として宣言しておらず、
`@opennextjs/aws` 経由でルートへ巻き上がるのを当てにしている。巻き上がるかどうかは
同時に入る他の依存で変わるため、Workers Builds のように一部のアプリだけを対象に
install する環境では `Cannot find package 'esbuild'` で落ちる。明示的に置いて
ルートに必ず存在させる。

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

**Worker 名は Wrangler 設定の `name` と一致していなければならない。** 一致しないと
Workers Builds が CI 側の名前で上書きし、自分自身への service binding が解決できずに
デプロイが落ちる。ダッシュボードで Worker を改名したら、`wrangler.jsonc` も合わせる。

Worker の改名自体は非破壊で、Worker の実体 (tag) もカスタムドメインも保たれる。
`account-book` は移行の際に `account-book-on-cf` から改名した。`-on-cf` は
account-book という名前を Vercel 時代のリポジトリに取られていた名残りだった。

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
