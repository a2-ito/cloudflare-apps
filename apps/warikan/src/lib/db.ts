import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "@/db/schema";

// Cloudflare の D1 バインディングから Drizzle クライアントを取得する。
// Server Component / Server Action の実行コンテキストから呼び出すこと。
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

export { schema };
