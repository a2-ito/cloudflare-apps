"use server";

import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";

export async function joinRoom(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return;

  const { env } = getCloudflareContext();
  const key = `room:${roomId}`;

  const room = await env.planning_porker.get<RoomData>(key, "json");
  if (!room) return;

  if (!room.participants.includes(name)) {
    const updated: RoomData = {
      ...room,
      participants: [...room.participants, name],
    };

    await env.planning_porker.put(key, JSON.stringify(updated));
  }

  redirect(`/room/${roomId}`);
}
