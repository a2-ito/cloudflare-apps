// components/Card.tsx
import type { Card as CardType } from "@/lib/klondike";

export function Card({ card }: { card: CardType }) {
  if (!card.faceUp) {
    return (
      <div className="w-16 h-24 rounded bg-gray-700 border border-gray-500" />
    );
  }

  const color =
    card.suit === "♥" || card.suit === "♦" ? "text-red-400" : "text-white";

  return (
    <div
      className={`w-16 h-24 rounded bg-gray-800 border border-gray-500 p-1 ${color}`}
    >
      <div className="text-sm">{card.rank}</div>
      <div className="text-xl text-center">{card.suit}</div>
    </div>
  );
}
