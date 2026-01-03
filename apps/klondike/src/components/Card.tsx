// components/Card.tsx
import type { Card as CardType } from "@/lib/klondike";
import { SuitIcon } from "./SuitIcon";
import { CardBack } from "./CardBack";

type Props = {
  card: CardType;
  onDragStart?: () => void;
};

export function Card({ card, onDragStart }: Props) {
  if (!card.faceUp) {
    return <CardBack />;
  }

  //const color =
  //  card.suit === "♥" || card.suit === "♦" ? "text-red-400" : "text-white";

  const isRed = card.suit === "heart" || card.suit === "diamond";

  const suit = card.suit.toLowerCase(); // "spade", etc.
  const rank =
    card.rank === 1
      ? "ace"
      : card.rank === 11
        ? "jack"
        : card.rank === 12
          ? "queen"
          : card.rank === 13
            ? "king"
            : card.rank.toString();

  const fileName = `${rank}_of_${suit}s.svg`;

  return (
    <img
      draggable
      onDragStart={onDragStart}
      src={`/cards/${fileName}`}
      className="
				w-16
				h-24
				cursor-grab
				active:cursor-grabbing
				active:scale-105
				transition-transform
			"
      alt={`${rank} of ${suit}s`}
    />
  );
}
