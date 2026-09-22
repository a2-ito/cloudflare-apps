"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { participants, votes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function leaveRoom(roomId: string, name: string) {
  const db = getDB();

  // Delete participant
  await db
    .delete(participants)
    .where(and(eq(participants.roomId, roomId), eq(participants.name, name)));

  // Delete participant's votes
  await db
    .delete(votes)
    .where(and(eq(votes.roomId, roomId), eq(votes.participantName, name)));

  redirect(`/`);
}
