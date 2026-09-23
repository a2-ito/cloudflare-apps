# app-portal

`app.a2ito.work` のトップページ。`app.a2ito.work/<name>` で公開しているアプリへのリンクを並べる。

静的アセットだけの Worker で、ビルドは無い。`cf:build` は設定の検証のために
`wrangler deploy --dry-run` を流すだけ。

アプリを `app.a2ito.work` 配下に足したら `public/index.html` にもカードを足す。

wrangler は `dependencies` に置く。Workers Builds は本番依存しか入れない。
