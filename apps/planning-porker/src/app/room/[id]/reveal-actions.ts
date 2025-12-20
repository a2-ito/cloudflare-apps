"use server";

import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";

export async function reveal(roomId: string) {
  const { env } = getCloudflareContext();
  const key = `room:${roomId}`;

  const room = await env.planning_porker.get<RoomData>(key, "json");
  if (!room) return;

  const updated: RoomData = {
    ...room,
    revealed: true,
  };

  await env.planning_porker.put(key, JSON.stringify(updated));
  redirect(`/room/${roomId}`);
}
