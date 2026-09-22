"use server";

import { redirect } from "next/navigation";
import { getDB } from "@/db";
import { rooms, votes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function vote(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString();
  const value = Number(formData.get("value"));

  if (!name || Number.isNaN(value)) return;

  const db = getDB();

  // Check if room exists
  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);
  if (!room.length) return;

  // Check if vote already exists and update/insert accordingly
  const existingVote = await db
    .select()
    .from(votes)
    .where(and(eq(votes.roomId, roomId), eq(votes.participantName, name)))
    .limit(1);

  if (existingVote.length) {
    await db
      .update(votes)
      .set({ value, votedAt: new Date().toISOString() })
      .where(and(eq(votes.roomId, roomId), eq(votes.participantName, name)));
  } else {
    await db.insert(votes).values({
      roomId,
      participantName: name,
      value,
      votedAt: new Date().toISOString(),
    });
  }

  // Remove redirect to allow client-side refresh
}

export async function unvote(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString();

  if (!name) return;

  const db = getDB();

  // Check if room exists
  const room = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);
  if (!room.length) return;

  // Delete the vote
  await db
    .delete(votes)
    .where(and(eq(votes.roomId, roomId), eq(votes.participantName, name)));

  // Remove redirect to allow client-side refresh
}
