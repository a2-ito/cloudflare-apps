import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

export type DB = ReturnType<typeof getDB>;
