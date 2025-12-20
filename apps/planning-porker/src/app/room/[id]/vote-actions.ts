"use server";

import { redirect } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";

export async function vote(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString();
  const value = Number(formData.get("value"));

  if (!name || Number.isNaN(value)) return;

  const { env } = getCloudflareContext();
  const key = `room:${roomId}`;

  const room = await env.planning_porker.get<RoomData>(key, "json");
  if (!room) return;

  // 上書きOK（簡易版）
  const updated: RoomData = {
    ...room,
    votes: {
      ...room.votes,
      [name]: value,
    },
  };

  await env.planning_porker.put(key, JSON.stringify(updated));

  redirect(`/room/${roomId}`);
}

export async function unvote(roomId: string, formData: FormData) {
  const name = formData.get("name")?.toString();
  const value = Number(formData.get("value"));

  if (!name || Number.isNaN(value)) return;

  const { env } = getCloudflareContext();
  const key = `room:${roomId}`;

  const room = await env.planning_porker.get<RoomData>(key, "json");
  if (!room) return;

  // voted = false を意味する → vote を削除
  delete room.votes[name]

  await env.planning_porker.put(key, JSON.stringify(room));

  redirect(`/room/${roomId}`);
}
