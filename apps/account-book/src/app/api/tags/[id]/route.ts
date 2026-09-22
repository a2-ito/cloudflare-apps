import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { tags, expenseTags } from "@/db/schema";
import { authorize } from "@/lib/apiAuth";
import { normalizeTagName, isUniqueConstraintError } from "@/lib/tagName";

type UpdateTagBody = {
  name?: unknown;
};

/** タグ名を変更する */
export async function PATCH(
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

  const body = (await request.json()) as UpdateTagBody;
  const name = normalizeTagName(body.name);

  if (!name.ok) {
    return NextResponse.json({ error: name.error }, { status: 400 });
  }

  try {
    const updated = await db
      .update(tags)
      .set({ name: name.value })
      .where(and(eq(tags.id, tagId), eq(tags.groupId, groupId)))
      .returning({ id: tags.id, name: tags.name });

    if (updated.length === 0) {
      return NextResponse.json({ error: "tag-not-found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: "tag-name-taken" }, { status: 409 });
    }

    console.error("PATCH /api/tags/[id] error:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}

/** タグを削除する。明細との紐付けも同時に解除する */
export async function DELETE(
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
    // 他グループのタグを削除できないよう所有を確認する
    const target = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.id, tagId), eq(tags.groupId, groupId)))
      .get();

    if (!target) {
      return NextResponse.json({ error: "tag-not-found" }, { status: 404 });
    }

    await db.delete(expenseTags).where(eq(expenseTags.tagId, tagId));
    await db.delete(tags).where(eq(tags.id, tagId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/tags/[id] error:", err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}
