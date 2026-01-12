import { eq } from "drizzle-orm";
import { userGroups } from "@/db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export async function getUserGroupId(
  db: DrizzleD1Database,
  userId: string,
): Promise<string> {
  const rows = await db
    .select()
    .from(userGroups)
    .where(eq(userGroups.userId, userId))
    .all();

  if (rows.length === 0) {
    throw new Error("USER_HAS_NO_GROUP");
  }

  // MVP: 1 ユーザ = 1 グループ
  return rows[0].groupId;
}
