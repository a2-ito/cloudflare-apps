// Cloudflare Workers のバインディング型。`npm run cf-typegen` で再生成可能。
interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
}
