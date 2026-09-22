# warikan

ログイン不要の割り勘アプリ（walica 相当）。旅行やイベントの立替を記録して、誰が誰にいくら払えばいいかを **最小回数** で自動精算します。

- **Stack**: Next.js (App Router) / OpenNext on Cloudflare Workers / Cloudflare D1 + Drizzle ORM / Tailwind CSS
- **本番ドメイン**: warikan.a2ito.work
- **多通貨対応**（JPY / USD / EUR / GBP / KRW / CNY / TWD / THB）

## 機能

- グループ作成（イベント名 + 通貨、URL 共有）
- メンバー追加・削除
- 立替の記録・編集・削除（支払った人 / 金額 / 内容 / 割り勘対象の均等割り）
- 合計金額・各メンバーの受取/支払残高
- 精算結果（最小回数の送金リスト）

## ローカル開発

```bash
npm install

# ローカル D1 にマイグレーション適用（初回・スキーマ変更時）
npm run db:generate        # schema.ts からマイグレーション SQL 生成
npm run db:migrate:local   # ローカル D1 に適用

npm run dev                # http://localhost:3000
```

`next dev` でも `initOpenNextCloudflareForDev()` によりローカル D1 バインディングが有効になります。

Workers ランタイムでの動作確認:

```bash
npm run preview   # opennextjs-cloudflare build && preview
```

## デプロイ（Cloudflare）

> 初回のみ `1`〜`3` を実施。以降は `4` を繰り返す。

```bash
# 1. Cloudflare にログイン
npx wrangler login

# 2. 本番 D1 を作成し、出力された database_id を wrangler.jsonc の
#    d1_databases[0].database_id に反映する
npx wrangler d1 create warikan-db

# 3. 本番 D1 にマイグレーション適用
npm run db:migrate:remote

# 4. ビルド & デプロイ
npm run deploy
```

### カスタムドメイン warikan.a2ito.work

`a2ito.work` ゾーンが Cloudflare 管理下にある前提で、以下のいずれか:

- Cloudflare ダッシュボード → Workers & Pages → `warikan` → Settings → Domains & Routes → **Add Custom Domain** に `warikan.a2ito.work` を追加
- もしくは `wrangler.jsonc` に `routes` を追加して再デプロイ:

  ```jsonc
  "routes": [
    { "pattern": "warikan.a2ito.work", "custom_domain": true }
  ]
  ```

## 構成

| パス | 役割 |
| --- | --- |
| `src/db/schema.ts` | Drizzle スキーマ（groups / members / expenses / expense_participants） |
| `src/lib/db.ts` | D1 バインディングから Drizzle クライアント取得 |
| `src/lib/currency.ts` | 通貨定義・最小単位(minor units)変換・整形 |
| `src/lib/settlement.ts` | 均等割り + 最小送金の精算アルゴリズム（純粋関数） |
| `src/app/page.tsx` | トップ（グループ作成） |
| `src/app/g/[id]/` | グループ詳細ページ・Server Actions・クライアント UI |

金額は通貨の最小単位の整数で保持し、精算計算を整数で行うことで丸め誤差を回避しています。
