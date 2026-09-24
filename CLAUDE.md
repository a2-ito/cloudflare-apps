# CLAUDE.md

Cloudflare Workers で動く Next.js アプリ群のモノレポ。アプリは `apps/<name>/` にあり、
アプリ固有の約束は `apps/<name>/.claude/CLAUDE.md` や各 README に書いてある。

このファイルには、どのアプリを触るときにも守ってほしい約束だけを書く。

## PR の出し方

- **下書き（Draft）にしない**。最初から Ready for review で作る
- Ready にすると auto-merge（`.github/workflows/auto-merge.yml`）が予約され、
  CI が通りしだい squash でマージされる。Draft のままだと auto-merge が動かず止まる
- 人の目を通したいものだけ、依頼されたときに Draft にする
