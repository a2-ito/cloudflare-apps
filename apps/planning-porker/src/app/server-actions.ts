"use server";

import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";

export async function createRoom() {
  const { env } = getCloudflareContext();

  const id = crypto.randomUUID().slice(0, 8);

  const room: RoomData = {
    id,
    createdAt: new Date().toISOString(),
    participants: [],
    votes: {},
    revealed: false,
  };

  await env.planning_porker.put(`room:${id}`, JSON.stringify(room), {
    expirationTtl: 60 * 60,
  });

  redirect(`/room/${id}`);
}
