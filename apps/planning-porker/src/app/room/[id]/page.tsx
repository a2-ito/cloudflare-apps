"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { RoomData } from "@/types/room";

import { ClientForms } from "./ClientForms";
import { joinRoom } from "./actions";
import { vote, unvote } from "./vote-actions";
import { reveal } from "./reveal-actions";
import { leaveRoom } from "./leave-actions";
import { resetRoom } from "./reset-actions";
import { Participants } from "./Participants";
import { PollingRefresher } from "./PollingRefresher";
import { CopyRoomUrlButton } from "./CopyRoomUrlButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default function RoomPage({ params }: Props) {
  const router = useRouter();
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRoomId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchRoom = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/room/${roomId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setRoom(null);
        return;
      }

      const data: RoomData = await res.json();
      setRoom(data);
    } catch (err) {
      console.error("Failed to fetch room:", err);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  }, [roomId, setLoading]);

  useEffect(() => {
    if (!roomId) return;

    fetchRoom();
  }, [roomId, fetchRoom]);

  // if (loading) return <h1>Loading...</h1>;
  if (!room) return <h1>Room not found</h1>;

  const allVoted =
    room.participants.length > 0 &&
    room.participants.every((p) => room.votes[p] !== undefined);

  return (
    <main className="p-6 sm:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Planning Poker</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchRoom}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          >
            Refresh
          </button>
          <CopyRoomUrlButton />
        </div>
      </header>

      <p className="mt-4">
        <strong>Room ID:</strong> {room.id}
      </p>

      <section className="mt-6">
        <Participants
          participants={room.participants}
          votes={room.votes}
          revealed={room.revealed}
        />
      </section>

      {!room.revealed && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white p-3 sm:static sm:border-0">
          <ClientForms
            roomId={roomId}
            onJoin={joinRoom.bind(null, roomId)}
            onVote={vote.bind(null, roomId)}
            onUnvote={unvote.bind(null, roomId)}
            onLeave={leaveRoom}
            onRoomFetch={fetchRoom}
            revealed={room.revealed}
            roomVotes={room.votes}
          />
        </div>
      )}

      {!room.revealed && allVoted && (
        <form action={reveal.bind(null, roomId)} className="mt-4">
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white">
            Reveal
          </button>
        </form>
      )}

      {room.revealed && (
        <>
          <p className="mt-4">🎉 Reveal 済み</p>

          <form action={resetRoom.bind(null, roomId)} className="mt-4">
            <button className="w-full rounded-xl bg-amber-500 py-3 text-lg font-bold text-white">
              再投票を開始
            </button>
          </form>
        </>
      )}

      {/* 準リアルタイム（ポーリング） */}
      <PollingRefresher
        intervalMs={3000}
        participantsCount={room.participants.length}
      />
    </main>
  );
}
