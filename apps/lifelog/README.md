# lifelog

日々の出来事を写真付きの日記として残すライフログアプリ。

いまは雛形だけを置いている段階で、画面はトップページのみ。記録・認証・DB は
これから足していく。まずは日記と写真から始める。

## 技術構成

| 領域 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 16 (App Router) |
| 実行環境 | Cloudflare Workers (OpenNext) |
| UI | Tailwind CSS v4 |

## セットアップ

このアプリはモノレポ [cloudflare-apps](../../README.md) の一部。**依存はリポジトリ
直下でまとめて入れる**（lockfile はルートに 1 つしかないため、このディレクトリで
`npm ci` は通らない）。

```bash
# リポジトリ直下で
npm ci

# 以降はこのディレクトリで

# wrangler.jsonc を生成（公開ホスト名を渡す）
APP_HOSTNAME=lifelog.example.com npm run cf:config

npm run dev
```

## よく使うコマンド

| コマンド | 用途 |
| --- | --- |
| `npm run dev` | 開発サーバ |
| `npm run lint` / `npm run typecheck` | 静的チェック |
| `npm run preview` | Workers ランタイムでローカル確認 |
| `npm run cf:deploy` | Cloudflare へデプロイ |

## デプロイ

main への push を Cloudflare の [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
が検知し、ビルドしてデプロイする。設定は Cloudflare ダッシュボードの
**Settings > Build** で行う。

| 項目 | 値 |
| --- | --- |
| Root directory | `apps/lifelog` |
| Build command | `npm run cf:build` |
| Deploy command | `npm run cf:deploy` |
| Git branch | `main` |
| Build watch paths | `apps/lifelog/*`、`package-lock.json` |
| Build variables | `APP_HOSTNAME` |

`wrangler.jsonc` は公開ホスト名を含むため追跡していない。`npm run cf:config` が
雛形 `wrangler.jsonc.example` のプレースホルダを `APP_HOSTNAME` で埋めて生成する。
手元に `wrangler.jsonc` がある場合は上書きしない。
