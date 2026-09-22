import { NextResponse } from "next/server";
import { and, eq, desc, sql } from "drizzle-orm";
import { tags, expenseTags, expenses, categories } from "@/db/schema";
import { authorize } from "@/lib/apiAuth";

/** 指定タグに紐づく明細一覧と、その合計・カテゴリ別内訳を返す */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const { db, groupId } = auth;

  const tagId = Number((await params).id);
  if (!Number.isInteger(tagId)) {
    return NextResponse.json({ error: "invalid-id" }, { status: 400 });
  }

  try {
    const tag = await db
      .select({ id: tags.id, name: tags.name })
      .from(tags)
      .where(and(eq(tags.id, tagId), eq(tags.groupId, groupId)))
      .get();

    if (!tag) {
      return NextResponse.json({ error: "tag-not-found" }, { status: 404 });
    }

    // カテゴリ未設定の明細も落とさないよう leftJoin で結合する
    const rows = await db
      .select({
        id: expenses.id,
        amount: expenses.amount,
        date: expenses.date,
        memo: expenses.memo,
        categoryId: expenses.categoryId,
        categoryName: categories.name,
      })
      .from(expenseTags)
      .innerJoin(expenses, eq(expenses.id, expenseTags.expenseId))
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(eq(expenseTags.tagId, tagId), eq(expenses.groupId, groupId)))
      .orderBy(desc(expenses.date));

    const byCategory = await db
      .select({
        category: sql<string>`coalesce(${categories.name}, '未分類')`,
        total: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenseTags)
      .innerJoin(expenses, eq(expenses.id, expenseTags.expenseId))
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(eq(expenseTags.tagId, tagId), eq(expenses.groupId, groupId)))
      .groupBy(sql`coalesce(${categories.name}, '未分類')`);

    const total = rows.reduce((sum, row) => sum + row.amount, 0);

    return NextResponse.json({
      tag,
      total,
      count: rows.length,
      byCategory: byCategory ?? [],
      expenses: rows ?? [],
    });
  } catch (err) {
    console.error("GET /api/tags/[id]/expenses error:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
