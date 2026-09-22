import { ClientLastRoom } from "./ClientLastRoom";
import { createRoom } from "./server-actions";

export default function TopPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-center text-3xl font-bold">Planning Poker</h1>

      <div className="rounded-xl bg-white p-6 text-center shadow">
        <form action={createRoom}>
          <button className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
            新しいルームを作る
          </button>
        </form>

        <ClientLastRoom />
      </div>
    </main>
  );
}
