"use client";

import { useEffect, useRef, useState } from "react";
import { keyToDirection, useSwipe } from "@/lib/swipe";
import { loadNumber, saveNumber } from "@/lib/storage";
import {
  type Direction,
  GRID,
  type State,
  initialState,
  step,
  tickMs,
  turn,
} from "../lib/game";
import { BEST_KEY } from "../lib/storage-keys";

/** キャンバスの論理サイズ（px）。表示は CSS で幅いっぱいに伸ばす */
const CANVAS = 400;
const CELL = CANVAS / GRID;

// ssr: false で読み込むので、初期値の乱数や localStorage を描画中に読んでよい
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<State>(() => initialState());
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(() => loadNumber(BEST_KEY) ?? 0);

  // 1 手ずつ進める。スコアが上がるたびに間隔を詰め直す
  useEffect(() => {
    if (!running || state.over) return;
    const id = window.setInterval(
      () => setState((s) => step(s)),
      tickMs(state.score),
    );
    return () => window.clearInterval(id);
  }, [running, state.over, state.score]);

  // 終わったらベストを更新する
  useEffect(() => {
    if (state.over && state.score > best) {
      saveNumber(BEST_KEY, state.score);
    }
  }, [state.over, state.score, best]);
  const shownBest = Math.max(best, state.over ? state.score : 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== CANVAS * dpr) {
      canvas.width = CANVAS * dpr;
      canvas.height = CANVAS * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#14532d";
    ctx.fillRect(0, 0, CANVAS, CANVAS);
    // 市松模様にしてマス目を読みやすくする
    ctx.fillStyle = "#166534";
    for (let y = 0; y < GRID; y++) {
      for (let x = (y % 2) as number; x < GRID; x += 2)
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }

    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.arc(
      (state.food.x + 0.5) * CELL,
      (state.food.y + 0.5) * CELL,
      CELL * 0.4,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    state.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "#fde047" : "#facc15";
      ctx.beginPath();
      ctx.roundRect(
        p.x * CELL + 1,
        p.y * CELL + 1,
        CELL - 2,
        CELL - 2,
        CELL * 0.3,
      );
      ctx.fill();
    });
  }, [state]);

  function restart() {
    if (state.score > best) setBest(state.score);
    setState(initialState());
    setRunning(true);
  }

  function steer(dir: Direction) {
    if (state.over) return;
    if (!running) setRunning(true);
    setState((s) => turn(s, dir));
  }

  function togglePause() {
    if (state.over) restart();
    else setRunning((r) => !r);
  }

  // キー入力のハンドラは毎回作り直して、最新の state を見る
  const handlers = useRef({ steer, togglePause });
  useEffect(() => {
    handlers.current = { steer, togglePause };
  });
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        handlers.current.togglePause();
        return;
      }
      const dir = keyToDirection(e.key);
      if (!dir) return;
      e.preventDefault();
      handlers.current.steer(dir);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const swipe = useSwipe(steer);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🐍 Snake</h1>
        <div className="text-right font-mono">
          <div>スコア {state.score}</div>
          <div className="text-sm text-emerald-700 dark:text-emerald-300">
            ベスト {shownBest}
          </div>
        </div>
      </div>

      <div {...swipe} className="relative touch-none select-none">
        <canvas
          ref={canvasRef}
          className="block aspect-square w-full rounded-lg"
        />
        {(!running || state.over) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/50 text-white">
            {state.over && <p className="text-3xl font-bold">ゲームオーバー</p>}
            {state.over && <p>スコア {state.score}</p>}
            <button
              type="button"
              onClick={togglePause}
              className="rounded-md bg-yellow-400 px-5 py-2 font-bold text-stone-900 hover:bg-yellow-300"
            >
              {state.over ? "もう一度" : "▶ プレイ"}
            </button>
          </div>
        )}
      </div>

      {/* スマホ向けの十字キー */}
      <div className="mx-auto grid grid-cols-3 gap-2 sm:hidden">
        <span />
        <PadButton label="↑" onPress={() => steer("up")} />
        <span />
        <PadButton label="←" onPress={() => steer("left")} />
        <PadButton label="⏯" onPress={togglePause} />
        <PadButton label="→" onPress={() => steer("right")} />
        <span />
        <PadButton label="↓" onPress={() => steer("down")} />
        <span />
      </div>

      <p className="text-center text-sm text-stone-500 dark:text-stone-400">
        矢印キー / WASD / スワイプで曲がる。スペースで一時停止
      </p>
    </div>
  );
}

function PadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      // click より先に反応させて、素早い連続入力を取りこぼさないようにする
      onPointerDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className="h-14 w-14 touch-none rounded-lg bg-emerald-700 text-2xl text-white active:bg-emerald-600"
    >
      {label}
    </button>
  );
}
