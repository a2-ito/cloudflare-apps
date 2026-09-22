"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { rooms, participants } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function joinRoom(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return;

  const db = getDB();

  // Check if room exists
  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);
  if (!room.length) return;

  // Check if participant already exists
  const existingParticipant = await db
    .select()
    .from(participants)
    .where(and(eq(participants.roomId, roomId), eq(participants.name, name)))
    .limit(1);

  if (!existingParticipant.length) {
    await db.insert(participants).values({
      roomId,
      name,
      joinedAt: new Date().toISOString(),
    });
  }

  redirect(`/room/${roomId}`);
}
