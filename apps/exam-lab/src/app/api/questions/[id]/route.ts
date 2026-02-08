import { NextResponse } from "next/server";
import { getDB } from "@/db";
import { questions, choices } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/questions/:id
 * 問題詳細 + 選択肢取得
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const questionId = Number(id);

    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "invalid-id" }, { status: 400 });
    }

    const db = getDB();

    // ---- 問題本体 ----
    const question = await db
      .select({
        id: questions.id,
        title: questions.title,
        body: questions.body,
        explanation: questions.explanation,
      })
      .from(questions)
      .where(eq(questions.id, questionId))
      .get();

    if (!question) {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }

    // ---- 選択肢 ----
    const choiceList = await db
      .select({
        id: choices.id,
        text: choices.text,
        isCorrect: choices.isCorrect,
      })
      .from(choices)
      .where(eq(choices.questionId, questionId));

    return NextResponse.json({
      ...question,
      choices: choiceList,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/questions/:id
 * 問題削除
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const questionId = Number(id);

    if (Number.isNaN(questionId)) {
      return NextResponse.json({ error: "invalid-id" }, { status: 400 });
    }

    const db = getDB();

    await db.transaction(async (tx) => {
      // ---- 存在確認 ----
      const exists = await tx
        .select({ id: questions.id })
        .from(questions)
        .where(eq(questions.id, questionId))
        .get();

      if (!exists) {
        throw new Error("not-found");
      }

      // ---- 子 → 親の順で削除 ----
      await tx.delete(choices).where(eq(choices.questionId, questionId));

      await tx.delete(questions).where(eq(questions.id, questionId));
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message === "not-found") {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }

    console.error(err);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}
