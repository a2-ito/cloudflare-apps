// lib/dnd.ts
import type { Card } from "./klondike";

export type DragSource =
  | {
      type: "tableau";
      pileIndex: number;
      cards: Card[];
    }
  | {
      type: "waste";
      card: Card;
    };
