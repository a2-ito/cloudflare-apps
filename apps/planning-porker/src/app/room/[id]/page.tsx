import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { RoomData } from "@/types/room";
import { ClientForms } from "./ClientForms";
import { joinRoom } from "./actions";
import { vote, unvote } from "./vote-actions";
import { reveal } from "./reveal-actions";
import { leaveRoom } from "./leave-actions";
import { resetRoom } from "./reset-actions";
import { Participants } from "./Participants";

import { PollingRefresher } from "./PollingRefresher";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RoomPage({ params }: Props) {
  const { id } = await params;
  const { env } = getCloudflareContext();

  const room = await env.planning_porker.get<RoomData>(`room:${id}`, "json");

  if (!room) return <h1>Room not found</h1>;

  const allVoted =
    room.participants.length > 0 &&
    room.participants.every((p) => room.votes[p] !== undefined);

  return (
    <main style={{ padding: 40 }}>
      <h1>Planning Poker</h1>

      <p>
        <strong>Room ID:</strong> {room.id}
      </p>

      <h2>参加者</h2>

      <ul className="grid grid-cols-2 gap-4">
        {/* room.participants.map((p) => {
          const voted = room.votes[p] !== undefined;

          return (
            <li
              key={p}
              className={`card h-28 ${room.revealed ? "revealed" : ""}`}
            >
              <div className="card-inner rounded-xl border shadow">
                <div className="card-face card-back">
                  <div className="text-center">
                    <div className="text-sm text-slate-500">{p}</div>
                    <div className="mt-1 text-2xl text-slate-500">
                      {voted ? "✓" : "…"}
                    </div>
                  </div>
                </div>

                <div className="card-face card-front">
                  <div className="text-center">
                    <div className="text-sm text-green-700">{p}</div>
                    <div className="text-3xl text-green-700">
                      {room.votes[p] ?? "?"}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        }) */}
      </ul>

      <section>
        <Participants
          participants={room.participants}
          votes={room.votes}
          revealed={room.revealed}
        />
      </section>

      {!room.revealed && (
        <>
          <h2>参加 / 投票</h2>

          <ClientForms
            roomId={id}
            onJoin={joinRoom.bind(null, id)}
            onVote={vote.bind(null, id)}
            onUnvote={unvote.bind(null, id)}
            onLeave={leaveRoom}
            revealed={room.revealed}
          />
        </>
      )}

      {!room.revealed && allVoted && (
        <form action={reveal.bind(null, id)}>
          <button
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            type="submit"
          >
            Reveal
          </button>
        </form>
      )}

      {room.revealed && <p>🎉 Reveal 済み</p>}

      {room.revealed && (
        <form action={resetRoom.bind(null, id)}>
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-500 py-3 text-lg font-bold text-white shadow transition hover:bg-amber-600"
          >
            再投票を開始
          </button>{" "}
        </form>
      )}

      {/* ★ 準リアルタイム化 */}
      <PollingRefresher intervalMs={3000} />
    </main>
  );
}
