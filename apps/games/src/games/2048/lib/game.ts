/** 4x4 の盤面。0 は空きマス */
export type Board = number[][];
export type Direction = "up" | "down" | "left" | "right";

export const SIZE = 4;
export const GOAL = 2048;

export function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));
}

/** 空きマスのどこか 1 つに 2（1 割の確率で 4）を置く。空きが無ければそのまま返す */
export function addRandomTile(
  board: Board,
  rand: () => number = Math.random,
): Board {
  const empties: [number, number][] = [];
  board.forEach((row, r) =>
    row.forEach((v, c) => v === 0 && empties.push([r, c])),
  );
  if (empties.length === 0) return board;

  const [r, c] = empties[Math.floor(rand() * empties.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = rand() < 0.9 ? 2 : 4;
  return next;
}

export function newGame(rand: () => number = Math.random): Board {
  return addRandomTile(addRandomTile(emptyBoard(), rand), rand);
}

/**
 * 1 列を先頭側に寄せ、隣り合う同じ数を 1 回だけ合体させる。
 * [2, 2, 2, 2] は [4, 4, 0, 0] になり、[8, 0, 0, 0] にはならない。
 */
export function slideLine(line: number[]): { line: number[]; gained: number } {
  const tiles = line.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      out.push(tiles[i] * 2);
      gained += tiles[i] * 2;
      i++;
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < line.length) out.push(0);
  return { line: out, gained };
}

/** 動かす向きを先頭にしたときの、各列のマスの座標 */
function linesFor(dir: Direction): [number, number][][] {
  const idx = [...Array(SIZE).keys()];
  return idx.map((i) =>
    idx.map((j): [number, number] => {
      switch (dir) {
        case "left":
          return [i, j];
        case "right":
          return [i, SIZE - 1 - j];
        case "up":
          return [j, i];
        case "down":
          return [SIZE - 1 - j, i];
      }
    }),
  );
}

export function move(
  board: Board,
  dir: Direction,
): { board: Board; gained: number; moved: boolean } {
  const next = emptyBoard();
  let gained = 0;
  let moved = false;
  for (const cells of linesFor(dir)) {
    const before = cells.map(([r, c]) => board[r][c]);
    const result = slideLine(before);
    gained += result.gained;
    cells.forEach(([r, c], k) => {
      next[r][c] = result.line[k];
      if (result.line[k] !== before[k]) moved = true;
    });
  }
  return { board: next, gained, moved };
}

/** どの向きにも動かせなければゲームオーバー */
export function canMove(board: Board): boolean {
  return (["up", "down", "left", "right"] as const).some(
    (d) => move(board, d).moved,
  );
}

export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((v) => v >= GOAL));
}
