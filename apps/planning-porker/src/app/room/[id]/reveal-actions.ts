"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function reveal(roomId: string) {
  const db = getDB();

  // Update room to revealed
  await db.update(rooms).set({ revealed: 1 }).where(eq(rooms.id, roomId));

  redirect(`/room/${roomId}`);
}
