"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { parseAmountToMinor } from "@/lib/currency";

async function getGroupOrThrow(groupId: string) {
  const db = getDb();
  const group = await db.query.groups.findFirst({
    where: eq(schema.groups.id, groupId),
  });
  if (!group) throw new Error("グループが見つかりません");
  return { db, group };
}

// --- メンバー ---

const addMemberSchema = z.object({
  name: z.string().trim().min(1, "名前を入力してください").max(50),
});

export async function addMember(groupId: string, formData: FormData) {
  const parsed = addMemberSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "入力が不正です");
  }
  const { db } = await getGroupOrThrow(groupId);
  await db.insert(schema.members).values({
    id: crypto.randomUUID(),
    groupId,
    name: parsed.data.name,
    createdAt: new Date(),
  });
  revalidatePath(`/g/${groupId}`);
}

export async function removeMember(groupId: string, formData: FormData) {
  const memberId = String(formData.get("memberId") ?? "");
  if (!memberId) throw new Error("メンバーが指定されていません");
  const { db } = await getGroupOrThrow(groupId);

  // payer または participant として立替に紐づいている場合は削除不可
  const asPayer = await db.query.expenses.findFirst({
    where: and(
      eq(schema.expenses.groupId, groupId),
      eq(schema.expenses.payerId, memberId),
    ),
  });
  const asParticipant = await db.query.expenseParticipants.findFirst({
    where: eq(schema.expenseParticipants.memberId, memberId),
  });
  if (asPayer || asParticipant) {
    throw new Error(
      "このメンバーは立替に紐づいているため削除できません。先に該当の立替を削除してください。",
    );
  }

  await db
    .delete(schema.members)
    .where(
      and(eq(schema.members.id, memberId), eq(schema.members.groupId, groupId)),
    );
  revalidatePath(`/g/${groupId}`);
}

// --- 立替 ---

const expenseSchema = z.object({
  payerId: z.string().min(1, "支払った人を選択してください"),
  amount: z.string().min(1, "金額を入力してください"),
  description: z.string().trim().max(100).optional().default(""),
  participantIds: z.array(z.string()).min(1, "割り勘対象を1人以上選択してください"),
});

function parseExpenseForm(formData: FormData) {
  return expenseSchema.safeParse({
    payerId: formData.get("payerId"),
    amount: formData.get("amount"),
    description: formData.get("description") ?? "",
    participantIds: formData.getAll("participantIds").map(String),
  });
}

async function assertMembersBelong(
  db: ReturnType<typeof getDb>,
  groupId: string,
  ids: string[],
) {
  const members = await db.query.members.findMany({
    where: eq(schema.members.groupId, groupId),
  });
  const valid = new Set(members.map((m) => m.id));
  for (const id of ids) {
    if (!valid.has(id)) throw new Error("不正なメンバーが指定されました");
  }
}

export async function addExpense(groupId: string, formData: FormData) {
  const parsed = parseExpenseForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "入力が不正です");
  }
  const { db, group } = await getGroupOrThrow(groupId);

  const amount = parseAmountToMinor(parsed.data.amount, group.currency);
  if (amount === null) throw new Error("金額が不正です");

  await assertMembersBelong(db, groupId, [
    parsed.data.payerId,
    ...parsed.data.participantIds,
  ]);

  const expenseId = crypto.randomUUID();
  await db.insert(schema.expenses).values({
    id: expenseId,
    groupId,
    payerId: parsed.data.payerId,
    amount,
    description: parsed.data.description,
    createdAt: new Date(),
  });
  await db.insert(schema.expenseParticipants).values(
    parsed.data.participantIds.map((memberId) => ({
      expenseId,
      memberId,
    })),
  );
  revalidatePath(`/g/${groupId}`);
}

export async function updateExpense(groupId: string, formData: FormData) {
  const expenseId = String(formData.get("expenseId") ?? "");
  if (!expenseId) throw new Error("立替が指定されていません");
  const parsed = parseExpenseForm(formData);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "入力が不正です");
  }
  const { db, group } = await getGroupOrThrow(groupId);

  const amount = parseAmountToMinor(parsed.data.amount, group.currency);
  if (amount === null) throw new Error("金額が不正です");

  const existing = await db.query.expenses.findFirst({
    where: and(
      eq(schema.expenses.id, expenseId),
      eq(schema.expenses.groupId, groupId),
    ),
  });
  if (!existing) throw new Error("立替が見つかりません");

  await assertMembersBelong(db, groupId, [
    parsed.data.payerId,
    ...parsed.data.participantIds,
  ]);

  await db
    .update(schema.expenses)
    .set({
      payerId: parsed.data.payerId,
      amount,
      description: parsed.data.description,
    })
    .where(eq(schema.expenses.id, expenseId));
  await db
    .delete(schema.expenseParticipants)
    .where(eq(schema.expenseParticipants.expenseId, expenseId));
  await db.insert(schema.expenseParticipants).values(
    parsed.data.participantIds.map((memberId) => ({
      expenseId,
      memberId,
    })),
  );
  revalidatePath(`/g/${groupId}`);
}

export async function removeExpense(groupId: string, formData: FormData) {
  const expenseId = String(formData.get("expenseId") ?? "");
  if (!expenseId) throw new Error("立替が指定されていません");
  const { db } = await getGroupOrThrow(groupId);
  await db
    .delete(schema.expenseParticipants)
    .where(eq(schema.expenseParticipants.expenseId, expenseId));
  await db
    .delete(schema.expenses)
    .where(
      and(
        eq(schema.expenses.id, expenseId),
        eq(schema.expenses.groupId, groupId),
      ),
    );
  revalidatePath(`/g/${groupId}`);
}
