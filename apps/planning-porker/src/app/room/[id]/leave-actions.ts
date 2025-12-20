"use server";

import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";

export async function leaveRoom(roomId: string, name: string) {
  const { env } = getCloudflareContext();
  const key = `room:${roomId}`;

  const room = await env.planning_porker.get<RoomData>(key, "json");
  if (!room) return;

  const updated: RoomData = {
    ...room,
    participants: room.participants.filter((p) => p !== name),
    votes: Object.fromEntries(
      Object.entries(room.votes).filter(([k]) => k !== name)
    ),
  };

  await env.planning_porker.put(key, JSON.stringify(updated));

  redirect(`/`);
}
