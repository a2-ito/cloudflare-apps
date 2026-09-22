"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { rooms } from "@/db/schema";

export async function createRoom() {
  const db = getDB();

  const id = crypto.randomUUID().slice(0, 8);

  await db.insert(rooms).values({
    id,
    createdAt: new Date().toISOString(),
    revealed: 0,
  });

  redirect(`/room/${id}`);
}
