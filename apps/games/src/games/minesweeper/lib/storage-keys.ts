import type { LevelKey } from "./game";

// 他のゲームと同じオリジンを共有するため、キーにゲーム名を付けて衝突を避ける。
export const bestTimeKey = (level: LevelKey) => `minesweeper:best:${level}`;
