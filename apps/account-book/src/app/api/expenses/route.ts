import { NextResponse } from "next/server";
//import { getDB } from '@/lib/db'
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { expenses, categories } from "@/db/schema";
import { eq, like, desc, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";
import { getUserGroupId } from "@/lib/getUserGroupId";

type ExpenseSchema = {
  amount: number;
  categoryId: string;
  date: string;
  memo: string;
};

export async function GET(request: Request) {
  const userId = getSessionUser(request);

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

    const { env } = getCloudflareContext();
    const db = drizzle(env.DB);

  const groupId = await getUserGroupId(db, userId);

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json([], { status: 200 });
    }

    const result = await db
      .select({
        id: expenses.id,
        amount: expenses.amount,
        date: expenses.date,
        memo: expenses.memo,
        category: categories.name,
      })
      .from(expenses)
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
				and(
					like(expenses.date, `${month}%`),
      		eq(expenses.groupId, groupId),
				)
			)
      .orderBy(desc(expenses.date));

    // 🔑 空でも必ず JSON を返す
    return NextResponse.json(result ?? []);
  } catch (err) {
    console.error("GET /api/expenses error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = getSessionUser(request);

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const db = drizzle(env.DB);
  const groupId = await getUserGroupId(db, userId);

  const { amount, categoryId, date, memo } =
    (await request.json()) as ExpenseSchema;

  //const db = getDB()
  //const env = (request as any).env
  //const db = env.DB as D1Database
  //await db.prepare(
  //  `INSERT INTO expenses (amount, category_id, date, memo)
  //   VALUES (?, ?, ?, ?)`
  //).bind(amount, categoryId, date, memo).run()

  await db.insert(expenses).values({
    groupId,
    amount,
    categoryId,
    date,
    memo,
  });
  return NextResponse.json({ ok: true });
}
