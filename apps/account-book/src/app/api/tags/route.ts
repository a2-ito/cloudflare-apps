import { NextResponse } from "next/server";
import { eq, sql, asc } from "drizzle-orm";
import { tags, expenseTags, expenses } from "@/db/schema";
import { authorize } from "@/lib/apiAuth";
import { normalizeTagName, isUniqueConstraintError } from "@/lib/tagName";

type CreateTagBody = {
  name?: unknown;
};

/** 自グループのタグ一覧を、紐づく明細の件数・合計金額つきで返す */
export async function GET(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const { db, groupId } = auth;

  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        expenseCount: sql<number>`count(${expenseTags.expenseId})`,
        total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
      })
      .from(tags)
      .leftJoin(expenseTags, eq(expenseTags.tagId, tags.id))
      .leftJoin(expenses, eq(expenses.id, expenseTags.expenseId))
      .where(eq(tags.groupId, groupId))
      .groupBy(tags.id, tags.name)
      .orderBy(asc(tags.name));

    return NextResponse.json(result ?? []);
  } catch (err) {
    console.error("GET /api/tags error:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}

/** タグを新規作成する */
export async function POST(request: Request) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  const { db, groupId } = auth;

  const body = (await request.json()) as CreateTagBody;
  const name = normalizeTagName(body.name);

  if (!name.ok) {
    return NextResponse.json({ error: name.error }, { status: 400 });
  }

  try {
    const created = await db
      .insert(tags)
      .values({ groupId, name: name.value })
      .returning({ id: tags.id, name: tags.name });

    return NextResponse.json(created[0], { status: 201 });
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "tag-name-taken" }, { status: 409 });
    }

    console.error("POST /api/tags error:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
