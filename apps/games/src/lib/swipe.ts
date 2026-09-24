import { useRef } from "react";

export type SwipeDirection = "up" | "down" | "left" | "right";

/** これより短い指の動きはタップとみなしてスワイプにしない（px） */
const THRESHOLD = 24;

/** スマホで盤面をスワイプして操作するためのタッチハンドラを返す */
export function useSwipe(onSwipe: (dir: SwipeDirection) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart(e: React.TouchEvent) {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd(e: React.TouchEvent) {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      start.current = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? "right" : "left");
      else onSwipe(dy > 0 ? "down" : "up");
    },
  };
}

/** 矢印キーと WASD を向きに読み替える。関係ないキーは null */
export function keyToDirection(key: string): SwipeDirection | null {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}
