// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createDeck, Card as CardType } from "@/lib/klondike";
import { Card } from "@/components/Card";

type Pile = CardType[];

export default function Page() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [stock, setStock] = useState<Pile>([]);
  const [waste, setWaste] = useState<Pile>([]);
  const [tableau, setTableau] = useState<Pile[]>([]);
  const [foundation, setFoundation] = useState<Pile[]>([[], [], [], []]);
  const [score, setScore] = useState(0);

  /* -----------------------------
   * Initialize game
   * ----------------------------- */
  function newGame() {
    const d = createDeck();
    const t: Pile[] = Array.from({ length: 7 }, () => []);

    let index = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = d[index++];
        card.faceUp = j === i;
        t[i].push(card);
      }
    }

    setDeck(d.slice(index));
    setStock(d.slice(index));
    setWaste([]);
    setTableau(t);
    setFoundation([[], [], [], []]);
    setScore(0);
  }

  useEffect(() => {
    newGame();
  }, []);

  /* -----------------------------
   * Stock → Waste
   * ----------------------------- */
  function drawFromStock() {
    if (stock.length === 0) {
      setStock(waste.map((c) => ({ ...c, faceUp: false })).reverse());
      setWaste([]);
      return;
    }

    const card = stock[stock.length - 1];
    card.faceUp = true;

    setStock(stock.slice(0, -1));
    setWaste([...waste, card]);
  }

  /* -----------------------------
   * Auto move to foundation (simplified)
   * ----------------------------- */
  function tryMoveToFoundation(card: CardType) {
    for (let i = 0; i < 4; i++) {
      const pile = foundation[i];
      const top = pile[pile.length - 1];

      if (
        (!top && card.rank === 1) ||
        (top && top.suit === card.suit && top.rank + 1 === card.rank)
      ) {
        const f = [...foundation];
        f[i] = [...pile, card];
        setFoundation(f);
        setScore((s) => s + 10);
        return true;
      }
    }
    return false;
  }

  /* -----------------------------
   * UI
   * ----------------------------- */
  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={newGame}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          New Game
        </button>
        <div className="text-lg">Score: {score}</div>
      </div>

      {/* Stock / Waste / Foundation */}
      <div className="flex gap-6">
        {/* Stock */}
        <div onClick={drawFromStock} className="cursor-pointer">
          {stock.length === 0 ? (
            <div className="w-16 h-24 border border-gray-600 rounded" />
          ) : (
            <Card card={{ ...stock[stock.length - 1], faceUp: false }} />
          )}
          <div className="text-sm text-center mt-1">Stock</div>
        </div>

        {/* Waste */}
        <div>
          {waste.length > 0 && <Card card={waste[waste.length - 1]} />}
          <div className="text-sm text-center mt-1">Waste</div>
        </div>

        {/* Foundation */}
        <div className="flex gap-4 ml-auto">
          {foundation.map((pile, i) => (
            <div key={i}>
              {pile.length > 0 ? (
                <Card card={pile[pile.length - 1]} />
              ) : (
                <div className="w-16 h-24 border border-gray-600 rounded" />
              )}
              <div className="text-xs text-center mt-1">Foundation</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="flex gap-4">
        {tableau.map((pile, i) => (
          <div key={i} className="flex flex-col gap-1">
            {pile.map((card, j) => (
              <div key={card.id} className={j > 0 ? "-mt-16" : ""}>
                <Card card={card} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
