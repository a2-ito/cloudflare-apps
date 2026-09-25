# CLAUDE.md

カロリー記録アプリ「kcalog」。Next.js 16 (App Router) を Cloudflare Workers で動かす。
技術構成・セットアップ手順は `README.md` を読む。

このファイルには、毎回思い出してほしい約束だけを書く。

置き場所がリポジトリ直下ではなく `.claude/` なのは、直下の `CLAUDE.md` を
Next.js が自動生成するため `.gitignore` で無視しているから。

## PR の出し方

- **下書きにしない**。最初から Ready で作る
- **ラベルを必ず付ける**
  - 種別（1 つだけ）: `feature`
  - サブ種別（1 つだけ・該当すれば）: `bugfix` / `refactoring`
  - `ai-assisted` は必ず。人がコードを手で直していなければ `ai-generated` も
  - 脆弱性対応のパッケージ更新は `security-dependency-update`
- コミットメッセージ・PR・コード内のコメントは日本語で書く
- 表題は「何をしたか」、本文は「なぜそうしたか」を書く

## push する前に通すもの

```bash
npm ci

# 初回のみ。wrangler.jsonc と cloudflare-env.d.ts が無いと typecheck が落ちる
APP_HOSTNAME=placeholder.example.com npm run cf:config && npm run cf-typegen

npm run lint && npm run typecheck
```

## コードの約束

- コメントには「なぜそうなっているか」を書く。コードを読めば分かることは書かない
