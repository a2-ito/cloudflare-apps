"use client";

import { useEffect, useState } from "react";
import { createDeck, Card as CardType } from "@/lib/klondike";
import { Card } from "@/components/Card";
import type { DragSource } from "@/lib/dnd";

type Pile = CardType[];

export default function Page() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [stock, setStock] = useState<Pile>([]);
  const [waste, setWaste] = useState<Pile>([]);
  const [tableau, setTableau] = useState<Pile[]>([]);
  const [foundation, setFoundation] = useState<Pile[]>([[], [], [], []]);
  const [score, setScore] = useState(0);
  const [dragging, setDragging] = useState<DragSource | null>(null);

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

  function canMoveToTableau(from: CardType, to?: CardType) {
    if (!to) return from.rank === 13;
    const isRed = (c: CardType) => c.suit === "heart" || c.suit === "diamond";
    return isRed(from) !== isRed(to) && from.rank + 1 === to.rank;
  }

  /* -----------------------------
   * UI
   * ----------------------------- */
  return (
    <div className="space-y-4">
      {/* Header */}
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
        </div>

        {/* Waste */}
        <div>
          {waste.length > 0 && (
            <div
              draggable
              onDragStart={() =>
                setDragging({
                  type: "waste",
                  card: waste[waste.length - 1],
                })
              }
            >
              <Card card={waste[waste.length - 1]} />
            </div>
          )}
        </div>

        {/* Foundation（単枚のみ） */}
        <div className="flex gap-4 ml-auto">
          {foundation.map((pile, i) => (
            <div
              key={i}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!dragging) return;

                const pile = foundation[i];
                const top = pile[pile.length - 1];

                // ---------- waste → foundation ----------
                if (dragging.type === "waste") {
                  const card = dragging.card;

                  const canMove =
                    (!top && card.rank === 1) ||
                    (top &&
                      top.suit === card.suit &&
                      top.rank + 1 === card.rank);

                  if (!canMove) return;

                  const newFoundation = [...foundation];
                  newFoundation[i] = [...pile, card];

                  setFoundation(newFoundation);
                  setWaste((w) => w.slice(0, -1));
                  setScore((s) => s + 10);
                  setDragging(null);
                  return;
                }

                // ---------- tableau → foundation ----------
                if (dragging.type === "tableau") {
                  // 複数枚は禁止
                  if (dragging.cards.length !== 1) return;

                  const card = dragging.cards[0];

                  const canMove =
                    (!top && card.rank === 1) ||
                    (top &&
                      top.suit === card.suit &&
                      top.rank + 1 === card.rank);

                  if (!canMove) return;

                  const newFoundation = [...foundation];
                  newFoundation[i] = [...pile, card];

                  const newTableau = [...tableau];
                  const fromIndex = dragging.pileIndex;

                  newTableau[fromIndex] = newTableau[fromIndex].slice(0, -1);

                  // 裏カードを表に
                  const rest = newTableau[fromIndex];
                  if (rest.length > 0) {
                    rest[rest.length - 1].faceUp = true;
                  }

                  setFoundation(newFoundation);
                  setTableau(newTableau);
                  setScore((s) => s + 10);
                  setDragging(null);
                }
              }}
            >
              {pile.length > 0 ? (
                <Card card={pile[pile.length - 1]} />
              ) : (
                <div className="w-16 h-24 border border-gray-600 rounded" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tableau（複数枚ドラッグ対応） */}
      <div className="flex gap-4">
        {tableau.map((pile, pileIndex) => (
          <div
            key={pileIndex}
            className="flex flex-col min-h-[24rem]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!dragging) return;

              const toPile = tableau[pileIndex];
              const top = toPile[toPile.length - 1];

              // -------------------------------
              // waste → tableau（1枚）
              // -------------------------------
              if (dragging.type === "waste") {
                const card = dragging.card;

                // 空列は King のみ OK
                if (!canMoveToTableau(card, top)) return;

                const newTableau = [...tableau];
                newTableau[pileIndex] = [...toPile, card];

                setTableau(newTableau);
                setWaste((w) => w.slice(0, -1));
                setScore((s) => s + 5);
                setDragging(null);
                return;
              }

              // -------------------------------
              // tableau → tableau（複数枚）
              // -------------------------------
              if (dragging.type === "tableau") {
                const movingCards = dragging.cards;
                const fromIndex = dragging.pileIndex;

                // 同じ列には置けない
                if (fromIndex === pileIndex) return;

                // 先頭カードでルール判定
                if (!canMoveToTableau(movingCards[0], top)) return;

                const newTableau = [...tableau];

                // remove from source
                newTableau[fromIndex] = newTableau[fromIndex].slice(
                  0,
                  newTableau[fromIndex].length - movingCards.length,
                );

                // flip 裏カード
                const rest = newTableau[fromIndex];
                if (rest.length > 0) {
                  rest[rest.length - 1].faceUp = true;
                }

                // add to destination
                newTableau[pileIndex] = [...toPile, ...movingCards];

                setTableau(newTableau);
                setScore((s) => s + 5);
                setDragging(null);
              }
            }}
          >
            {/* 空列プレースホルダ */}
            {pile.length === 0 && (
              <div className="w-16 h-24 border-2 border-dashed border-gray-500 rounded" />
            )}

            {/* カード */}
            {pile.map((card, cardIndex) => (
              <div
                key={card.id}
                className={cardIndex > 0 ? "-mt-16" : ""}
                draggable={card.faceUp}
                onDragStart={() => {
                  const movingCards = pile.slice(cardIndex);

                  setDragging({
                    type: "tableau",
                    pileIndex,
                    cards: movingCards,
                  });
                }}
              >
                <Card card={card} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
