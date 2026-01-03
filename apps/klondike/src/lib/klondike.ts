// lib/klondike.ts
export type Suit = "♠" | "♥" | "♦" | "♣";

export interface Card {
  suit: Suit;
  rank: number; // 1-13
  faceUp: boolean;
  id: string;
}

export function createDeck(): Card[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (let r = 1; r <= 13; r++) {
      deck.push({
        suit,
        rank: r,
        faceUp: false,
        id: crypto.randomUUID(),
      });
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}
