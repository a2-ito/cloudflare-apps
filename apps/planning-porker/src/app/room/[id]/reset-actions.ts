"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { rooms, votes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function resetRoom(roomId: string) {
  const db = getDB();

  // Delete all votes for this room
  await db.delete(votes).where(eq(votes.roomId, roomId));

  // Update room to not revealed
  await db.update(rooms).set({ revealed: 0 }).where(eq(rooms.id, roomId));

  redirect(`/room/${roomId}`);
}
