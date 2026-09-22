"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { isCurrencyCode } from "@/lib/currency";

const createGroupSchema = z.object({
  name: z.string().trim().min(1, "グループ名を入力してください").max(100),
  currency: z.string().refine(isCurrencyCode, "対応していない通貨です"),
});

export async function createGroup(formData: FormData) {
  const parsed = createGroupSchema.safeParse({
    name: formData.get("name"),
    currency: formData.get("currency"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "入力が不正です");
  }

  const db = getDb();
  const id = crypto.randomUUID();
  await db.insert(schema.groups).values({
    id,
    name: parsed.data.name,
    currency: parsed.data.currency,
    createdAt: new Date(),
  });

  redirect(`/g/${id}`);
}
