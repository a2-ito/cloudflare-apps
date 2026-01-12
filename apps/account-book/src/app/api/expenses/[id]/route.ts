import { NextResponse } from "next/server";
import { expenses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";
import { getUserGroupId } from "@/lib/getUserGroupId";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

type UpdateExpenseBody = {
  amount: number;
  categoryId: string | null;
  date: string;
  memo?: string | null;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const userId = await getSessionUser(request);
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const db = drizzle(env.DB);

  const groupId = await getUserGroupId(db, userId);
  const expenseId = Number(id);

  const body = (await request.json()) as UpdateExpenseBody;
  const { amount, categoryId, date, memo } = body;

  await db
    .update(expenses)
    .set({
      amount,
      categoryId: categoryId ? categoryId : null,
      date,
      memo: memo || null,
    })
    .where(and(eq(expenses.id, expenseId), eq(expenses.groupId, groupId)));

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  const userId = await getSessionUser(request);
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const db = drizzle(env.DB);

  const groupId = await getUserGroupId(db, userId);
  const expenseId = Number(id);

  await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.groupId, groupId)));

  return NextResponse.json({ ok: true });
}
