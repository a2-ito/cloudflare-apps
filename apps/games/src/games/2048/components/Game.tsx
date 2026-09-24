"use client";

import { useCallback, useEffect, useState } from "react";
import { keyToDirection, useSwipe } from "@/lib/swipe";
import { loadNumber, saveNumber } from "@/lib/storage";
import {
  type Board,
  type Direction,
  addRandomTile,
  canMove,
  hasWon,
  move,
  newGame,
} from "../lib/game";
import { BEST_KEY } from "../lib/storage-keys";

type State = {
  board: Board;
  score: number;
  /** 2048 を作ったあと「続ける」を選んだか */
  continued: boolean;
};

const TILE_STYLE: Record<number, string> = {
  2: "bg-stone-100 text-stone-700",
  4: "bg-amber-100 text-stone-700",
  8: "bg-orange-300 text-white",
  16: "bg-orange-400 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-red-500 text-white",
  128: "bg-yellow-300 text-white",
  256: "bg-yellow-400 text-white",
  512: "bg-yellow-500 text-white",
  1024: "bg-amber-500 text-white",
  2048: "bg-amber-600 text-white",
};

function tileClass(v: number): string {
  const color = TILE_STYLE[v] ?? "bg-stone-800 text-white";
  const size =
    v >= 1024
      ? "text-xl sm:text-2xl"
      : v >= 128
        ? "text-2xl sm:text-3xl"
        : "text-3xl sm:text-4xl";
  return `${color} ${size}`;
}

// ssr: false で読み込むので、初期値の乱数や localStorage を描画中に読んでよい
export default function Game() {
  const [state, setState] = useState<State>(() => ({
    board: newGame(),
    score: 0,
    continued: false,
  }));
  const [best, setBest] = useState(() => loadNumber(BEST_KEY) ?? 0);

  const won = hasWon(state.board) && !state.continued;
  const over = !canMove(state.board);

  const handleMove = useCallback(
    (dir: Direction) => {
      if (won || over) return;
      const result = move(state.board, dir);
      if (!result.moved) return;
      const score = state.score + result.gained;
      setState({ ...state, board: addRandomTile(result.board), score });
      if (score > best) {
        setBest(score);
        saveNumber(BEST_KEY, score);
      }
    },
    [state, best, won, over],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const dir = keyToDirection(e.key);
      if (!dir) return;
      e.preventDefault();
      handleMove(dir);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  const swipe = useSwipe(handleMove);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-4xl font-bold">2048</h1>
        <div className="flex gap-2">
          <Stat label="スコア" value={state.score} />
          <Stat label="ベスト" value={best} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-sm text-stone-500 dark:text-stone-400">
        <p>同じ数字をくっつけて 2048 を作ろう</p>
        <button
          type="button"
          onClick={() =>
            setState({ board: newGame(), score: 0, continued: false })
          }
          className="shrink-0 rounded-md bg-stone-700 px-3 py-1.5 font-bold text-white hover:bg-stone-600"
        >
          New Game
        </button>
      </div>

      <div
        {...swipe}
        className="relative grid touch-none grid-cols-4 gap-2 rounded-lg bg-stone-400 p-2 select-none dark:bg-stone-700"
        aria-label="2048 の盤面"
      >
        {state.board.flat().map((v, i) => (
          <div
            key={i}
            className={`flex aspect-square items-center justify-center rounded-md font-bold ${
              v === 0 ? "bg-stone-300 dark:bg-stone-600" : tileClass(v)
            }`}
          >
            {v !== 0 && v}
          </div>
        ))}

        {(won || over) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/70 dark:bg-black/60">
            <p className="text-3xl font-bold">
              {won ? "2048 達成！" : "ゲームオーバー"}
            </p>
            <div className="flex gap-2">
              {won && (
                <button
                  type="button"
                  onClick={() => setState({ ...state, continued: true })}
                  className="rounded-md bg-amber-500 px-4 py-2 font-bold text-white hover:bg-amber-400"
                >
                  続ける
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setState({ board: newGame(), score: 0, continued: false })
                }
                className="rounded-md bg-stone-700 px-4 py-2 font-bold text-white hover:bg-stone-600"
              >
                もう一度
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        矢印キー / WASD / スワイプで動かす
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-20 rounded-md bg-stone-400 px-3 py-1 text-center text-white dark:bg-stone-700">
      <div className="text-xs">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
