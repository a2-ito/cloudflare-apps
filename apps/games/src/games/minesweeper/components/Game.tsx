"use client";

import { useEffect, useRef, useState } from "react";
import { loadNumber, saveNumber } from "@/lib/storage";
import {
  type Board,
  type LevelKey,
  LEVELS,
  chord,
  countFlags,
  createBoard,
  isCleared,
  placeMines,
  reveal,
  revealMines,
  toggleFlag,
} from "../lib/game";
import { bestTimeKey } from "../lib/storage-keys";

type Status = "ready" | "playing" | "won" | "lost";

/** 長押しで旗を立てるまでの時間（ms） */
const LONG_PRESS_MS = 400;

const NUMBER_COLOR = [
  "",
  "text-blue-600 dark:text-blue-400",
  "text-green-700 dark:text-green-400",
  "text-red-600 dark:text-red-400",
  "text-indigo-800 dark:text-indigo-300",
  "text-rose-800 dark:text-rose-300",
  "text-teal-600 dark:text-teal-300",
  "text-stone-900 dark:text-stone-100",
  "text-stone-500",
];

/** 経過時間の計測用。描画中ではなくクリック時にだけ呼ぶ */
const now = () => Date.now();

function loadBests(): Record<LevelKey, number | null> {
  return {
    easy: loadNumber(bestTimeKey("easy")),
    normal: loadNumber(bestTimeKey("normal")),
  };
}

// ssr: false で読み込むので、localStorage を描画中に読んでよい
export default function Game() {
  const [level, setLevel] = useState<LevelKey>("easy");
  const [board, setBoard] = useState<Board>(() =>
    createBoard(LEVELS.easy.rows, LEVELS.easy.cols),
  );
  const [status, setStatus] = useState<Status>("ready");
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [bests, setBests] = useState(loadBests);

  const pressTimer = useRef<number | null>(null);
  /** 長押しで旗を立てた直後の click を無視するための印 */
  const longPressed = useRef(false);

  const { cols, mines } = LEVELS[level];

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(
      () => setElapsed(Math.floor((now() - startedAt) / 1000)),
      250,
    );
    return () => window.clearInterval(id);
  }, [status, startedAt]);

  function reset(next: LevelKey = level) {
    setLevel(next);
    setBoard(createBoard(LEVELS[next].rows, LEVELS[next].cols));
    setStatus("ready");
    setElapsed(0);
  }

  function finish(next: Board, hitMine: boolean) {
    if (hitMine) {
      setBoard(revealMines(next));
      setStatus("lost");
      return;
    }
    setBoard(next);
    if (!isCleared(next)) return;

    setStatus("won");
    const time = Math.floor((now() - startedAt) / 1000);
    setElapsed(time);
    const prev = bests[level];
    if (prev === null || time < prev) {
      setBests({ ...bests, [level]: time });
      saveNumber(bestTimeKey(level), time);
    }
  }

  function open(r: number, c: number) {
    if (status === "won" || status === "lost") return;

    if (status === "ready") {
      // 1 手目で地雷を置く。開いたマスの周りには置かれない
      setStartedAt(now());
      setStatus("playing");
      const seeded = placeMines(board, mines, r, c);
      const result = reveal(seeded, r, c);
      setBoard(result.board);
      if (isCleared(result.board)) {
        setStatus("won");
      }
      return;
    }

    const result = board[r][c].open ? chord(board, r, c) : reveal(board, r, c);
    finish(result.board, result.hitMine);
  }

  function flag(r: number, c: number) {
    if (status !== "playing") return;
    setBoard(toggleFlag(board, r, c));
  }

  function onCellClick(r: number, c: number) {
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    if (flagMode && !board[r][c].open) flag(r, c);
    else open(r, c);
  }

  function onPointerDown(e: React.PointerEvent, r: number, c: number) {
    if (e.pointerType !== "touch") return;
    longPressed.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressed.current = true;
      flag(r, c);
      navigator.vibrate?.(20);
    }, LONG_PRESS_MS);
  }

  function cancelPress() {
    if (pressTimer.current !== null) window.clearTimeout(pressTimer.current);
    pressTimer.current = null;
  }

  const face = status === "won" ? "😎" : status === "lost" ? "😵" : "🙂";
  const best = bests[level];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">マインスイーパー</h1>
        <div className="flex gap-1">
          {(Object.keys(LEVELS) as LevelKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => reset(key)}
              className={`rounded-md px-3 py-1 text-sm font-bold ${
                key === level
                  ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
              }`}
            >
              {LEVELS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md bg-slate-200 px-3 py-2 font-mono text-lg dark:bg-slate-800">
        <span title="残りの地雷">💣 {mines - countFlags(board)}</span>
        <button
          type="button"
          onClick={() => reset()}
          className="text-2xl"
          aria-label="やり直す"
        >
          {face}
        </button>
        <span title="経過時間">⏱ {elapsed}</span>
      </div>

      <div
        className="mx-auto grid w-full touch-manipulation gap-px rounded-md bg-slate-400 p-px select-none dark:bg-slate-600"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: cols * 36,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => onCellClick(r, c)}
              onContextMenu={(e) => {
                e.preventDefault();
                flag(r, c);
              }}
              onPointerDown={(e) => onPointerDown(e, r, c)}
              onPointerUp={cancelPress}
              onPointerLeave={cancelPress}
              onPointerCancel={cancelPress}
              className={`flex aspect-square items-center justify-center text-sm font-bold sm:text-base ${
                cell.open
                  ? cell.mine
                    ? "bg-red-400"
                    : `bg-slate-100 dark:bg-slate-900 ${NUMBER_COLOR[cell.adjacent]}`
                  : "bg-slate-300 hover:bg-slate-200 dark:bg-slate-500 dark:hover:bg-slate-400"
              }`}
              aria-label={`${r + 1} 行 ${c + 1} 列`}
            >
              {cell.open
                ? cell.mine
                  ? "💣"
                  : cell.adjacent || ""
                : cell.flag
                  ? "🚩"
                  : ""}
            </button>
          )),
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={flagMode}
            onChange={(e) => setFlagMode(e.target.checked)}
          />
          🚩 旗モード
        </label>
        <span className="text-slate-500 dark:text-slate-400">
          ベスト: {best === null ? "—" : `${best} 秒`}
        </span>
      </div>

      {status === "won" && (
        <p className="text-center font-bold text-green-700 dark:text-green-400">
          クリア！ {elapsed} 秒
        </p>
      )}
      {status === "lost" && (
        <p className="text-center font-bold text-red-600 dark:text-red-400">
          ドカーン！ もう一度どうぞ
        </p>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        クリックで開く / 右クリック・長押し・旗モードで旗 /
        数字をクリックで周りをまとめて開く
      </p>
    </div>
  );
}
