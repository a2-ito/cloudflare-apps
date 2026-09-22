import { and, eq, inArray } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { tags, expenseTags } from "@/db/schema";

export type ExpenseTag = {
  id: number;
  name: string;
};

/** 入力値から重複を除いた正の整数の配列を作る */
export const normalizeTagIds = (input: unknown): number[] => {
  if (!Array.isArray(input)) return [];

  const ids = input
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  return [...new Set(ids)];
};

/**
 * 指定 ID のうち、自グループに属するタグの ID だけを返す。
 * 他グループのタグを明細に紐付けられないようにするための絞り込み。
 */
export const filterOwnedTagIds = async (
  db: DrizzleD1Database,
  groupId: string,
  tagIds: number[],
): Promise<number[]> => {
  if (tagIds.length === 0) return [];

  const owned = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.groupId, groupId), inArray(tags.id, tagIds)));

  return owned.map((row) => row.id);
};

/** 明細に紐づくタグを指定された集合で置き換える */
export const replaceExpenseTags = async (
  db: DrizzleD1Database,
  groupId: string,
  expenseId: number,
  tagIds: number[],
): Promise<void> => {
  const ownedTagIds = await filterOwnedTagIds(db, groupId, tagIds);

  await db.delete(expenseTags).where(eq(expenseTags.expenseId, expenseId));

  if (ownedTagIds.length === 0) return;

  await db
    .insert(expenseTags)
    .values(ownedTagIds.map((tagId) => ({ expenseId, tagId })));
};

/**
 * 明細 ID の配列に対応するタグを一括で取得し、明細 ID ごとにまとめる。
 * 明細ごとに問い合わせると N+1 になるため 1 クエリで引く。
 */
export const findTagsByExpenseIds = async (
  db: DrizzleD1Database,
  expenseIds: number[],
): Promise<Map<number, ExpenseTag[]>> => {
  const grouped = new Map<number, ExpenseTag[]>();

  if (expenseIds.length === 0) return grouped;

  const rows = await db
    .select({
      expenseId: expenseTags.expenseId,
      id: tags.id,
      name: tags.name,
    })
    .from(expenseTags)
    .innerJoin(tags, eq(tags.id, expenseTags.tagId))
    .where(inArray(expenseTags.expenseId, expenseIds));

  for (const row of rows) {
    const current = grouped.get(row.expenseId) ?? [];
    current.push({ id: row.id, name: row.name });
    grouped.set(row.expenseId, current);
  }

  return grouped;
};
